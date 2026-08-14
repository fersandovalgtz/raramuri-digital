import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lexiconPath = resolve(root, "data/lexicon-master.json");
const typedPath = resolve(root, "data/variants-typed.json");
const relationsPath = resolve(root, "data/lexical-relations.json");

const entries = JSON.parse(await readFile(lexiconPath, "utf8"));

const clean = (value) => String(value ?? "").replace(/\s+/gu, " ").trim();
const normalize = (value) => clean(value)
  .replace(/[’‘`´]/gu, "'")
  .toLocaleLowerCase("es-MX")
  .normalize("NFD")
  .replace(/\p{M}/gu, "")
  .normalize("NFC");
const formKey = (value) => normalize(value).replace(/[^a-zñ']/gu, "");

const LABEL_PATTERN = /\b(pret|fut|pp|pl|sing|pres|ad|gut)\.?\s*:/giu;

function firstHeadword(entry) {
  return clean(String(entry.headword ?? "").split(/\s*,\s*/u)[0]);
}

const headwordIndex = new Map();
for (const entry of entries) {
  const key = formKey(firstHeadword(entry));
  if (!headwordIndex.has(key)) headwordIndex.set(key, []);
  headwordIndex.get(key).push(entry);
}

function parseTarget(rawTarget) {
  const raw = clean(rawTarget).replace(/^[\s(\[]+|[\s)\],:]+$/gu, "");
  const homonymMatch = /^([1-9])\s*(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’‘])(.+)$/u.exec(raw);
  const homonymNumber = homonymMatch ? Number(homonymMatch[1]) : null;
  const form = clean(homonymMatch ? homonymMatch[2] : raw);
  const candidates = headwordIndex.get(formKey(form)) ?? [];
  const filtered = homonymNumber == null ? candidates : candidates.filter((entry) => entry.homonym_number === homonymNumber);
  const ids = filtered.map((entry) => entry.record_id).sort();
  return {
    target_raw: raw,
    target_form: form,
    target_homonym_number: homonymNumber,
    target_record_id: ids.length === 1 ? ids[0] : null,
    target_record_ids: ids,
    resolution_status: ids.length === 1 ? "resolved_unique" : ids.length > 1 ? "resolved_ambiguous" : "unresolved",
  };
}

function robustLabelGroups(value) {
  const text = clean(value);
  const matches = [...text.matchAll(LABEL_PATTERN)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const between = text.slice(start, end).replace(/^[\s,;:]+|[\s,;:]+$/gu, "");
    const firstSegment = between.split(/\s*;\s*/u)[0] ?? "";
    const forms = firstSegment.split(/\s*,\s*/u).map(clean).filter(Boolean);
    return {
      source_label: clean(match[1]).toLocaleLowerCase("es-MX"),
      normalized_label: clean(match[1]).toLocaleLowerCase("es-MX"),
      raw_value: between,
      forms,
      contains_unlabeled_semicolon_segment: /;/u.test(between),
    };
  });
}

function classifyBracket(raw) {
  const text = clean(raw);
  const variantMatch = /^variante\s+de\s+(.+)$/iu.exec(text);
  if (variantMatch) return { nature: "explicit_source_variant_reference", target: clean(variantMatch[1]), grammatical_features: [] };

  const relationPatterns = [
    [/^futuro\s+de\s+(.+)$/iu, "fut"],
    [/^pp\.?\s+de\s+(.+)$/iu, "pp"],
    [/^pret\.?\s+de\s+(.+)$/iu, "pret"],
  ];
  for (const [pattern, feature] of relationPatterns) {
    const match = pattern.exec(text);
    if (match) return { nature: "grammatical_relation_phrase", target: clean(match[1]), relation_feature: feature, grammatical_features: [] };
  }

  const groups = robustLabelGroups(text);
  if (groups.length > 0) {
    const consumed = groups.flatMap((group) => group.forms);
    const hasUnlabeled = groups.some((group) => group.contains_unlabeled_semicolon_segment);
    const malformed = /,\s*(?:pret|fut|pp|pl|sing|pres|ad|gut)\.?\s*:/iu.test(text)
      || /:\s*(?:pret|fut|pp|pl|sing|pres|ad|gut)\.?\s*:/iu.test(text);
    return {
      nature: hasUnlabeled ? "mixed_grammatical_annotation_unlabeled_segment" : malformed ? "grammatical_annotation_malformed_punctuation" : "grammatical_annotation_labeled",
      target: "",
      grammatical_features: groups,
      extracted_form_count: consumed.length,
    };
  }

  return { nature: "untyped_bracket_annotation", target: "", grammatical_features: [] };
}

function sourceCandidates(entry) {
  const candidates = [];
  const rawHeadword = String(entry.headword_raw ?? entry.headword ?? "");
  if (rawHeadword.includes(",")) {
    for (const value of rawHeadword.split(/\s*,\s*/u).slice(1).map(clean).filter(Boolean)) {
      candidates.push({ origin: "headword_secondary", value, source_field: "headword_raw", raw_evidence: rawHeadword });
    }
  }
  const comments = String(entry.comments_raw ?? "");
  for (const match of comments.matchAll(/\[([^\]]+)\]/gu)) {
    candidates.push({ origin: "bracket_annotation", value: clean(match[1]), source_field: "comments_raw", raw_evidence: clean(match[0]) });
  }
  for (const match of comments.matchAll(/\b[Vv]e(?:a|á)se\s+([^.;\]]+)/gu)) {
    const target = clean(match[1]);
    candidates.push({ origin: "cross_reference", value: `véase ${target}`, source_field: "comments_raw", raw_evidence: clean(match[0]), target });
  }
  return candidates;
}

const typedRecords = [];
for (const entry of entries) {
  const byKey = new Map();
  for (const candidate of sourceCandidates(entry)) {
    const key = normalize(candidate.value);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(candidate);
  }

  for (let index = 0; index < (entry.variants ?? []).length; index += 1) {
    const form = clean(entry.variants[index]);
    const matches = byKey.get(normalize(form)) ?? [];
    const candidate = matches[0] ?? null;
    let nature = "unresolved";
    let detail = null;
    let targetInfo = null;

    if (candidate?.origin === "headword_secondary") nature = "co_headword_form";
    else if (candidate?.origin === "cross_reference") {
      nature = "cross_reference";
      targetInfo = parseTarget(candidate.target);
    } else if (candidate?.origin === "bracket_annotation") {
      detail = classifyBracket(candidate.value);
      nature = detail.nature;
      if (detail.target) targetInfo = parseTarget(detail.target);
    }

    typedRecords.push({
      variant_token_id: `${entry.record_id}#${String(index + 1).padStart(2, "0")}`,
      record_id: entry.record_id,
      headword: entry.headword,
      form,
      variant_origin: candidate?.origin ?? "unresolved",
      variant_nature: nature,
      source_field: candidate?.source_field ?? null,
      source_page: entry.page_start,
      source_page_end: entry.page_end,
      raw_evidence: candidate?.raw_evidence ?? form,
      target_record_id: targetInfo?.target_record_id ?? null,
      target_record_ids: targetInfo?.target_record_ids ?? [],
      target_form: targetInfo?.target_form ?? null,
      target_homonym_number: targetInfo?.target_homonym_number ?? null,
      target_resolution_status: targetInfo?.resolution_status ?? null,
      grammatical_features: detail?.grammatical_features ?? [],
      relation_feature: detail?.relation_feature ?? null,
      validation_status: "Pendiente de cotejo lingüístico",
      source_document: entry.source_document,
      source_code: entry.source_code,
      source_status: entry.status,
    });
  }
}

function visibleRemissions(entry) {
  const rows = [];
  for (const [field, text] of [["translation_raw", entry.translation_raw], ["comments_raw", entry.comments_raw]]) {
    let occurrence = 0;
    for (const match of String(text ?? "").matchAll(/\b[Vv](?:e|é)(?:a|á)se\s+([^.;\]]+)/gu)) {
      occurrence += 1;
      const targetGroup = clean(match[1]).replace(/[)\]]+$/gu, "");
      const targets = targetGroup.split(/\s*,\s*/u).map(clean).filter(Boolean);
      for (let targetIndex = 0; targetIndex < targets.length; targetIndex += 1) {
        rows.push({
          relation_type: "cross_reference",
          relation_label: "véase",
          source_field: field,
          raw_evidence: clean(match[0]),
          occurrence,
          target_index: targetIndex + 1,
          ...parseTarget(targets[targetIndex]),
        });
      }
    }
  }
  return rows;
}

function bracketRelations(entry) {
  const rows = [];
  let occurrence = 0;
  for (const match of String(entry.comments_raw ?? "").matchAll(/\[([^\]]+)\]/gu)) {
    occurrence += 1;
    const content = clean(match[1]);
    const variantMatch = /^variante\s+de\s+(.+)$/iu.exec(content);
    if (variantMatch) {
      rows.push({
        relation_type: "source_variant_reference",
        relation_label: "variante de",
        source_field: "comments_raw",
        raw_evidence: clean(match[0]),
        occurrence,
        target_index: 1,
        ...parseTarget(clean(variantMatch[1])),
      });
      continue;
    }
    const patterns = [
      [/^futuro\s+de\s+(.+)$/iu, "futuro de", "fut"],
      [/^pp\.?\s+de\s+(.+)$/iu, "pp de", "pp"],
      [/^pret\.?\s+de\s+(.+)$/iu, "pret de", "pret"],
    ];
    for (const [pattern, label, feature] of patterns) {
      const relationMatch = pattern.exec(content);
      if (!relationMatch) continue;
      rows.push({
        relation_type: "grammatical_relation",
        relation_label: label,
        grammatical_feature: feature,
        source_field: "comments_raw",
        raw_evidence: clean(match[0]),
        occurrence,
        target_index: 1,
        ...parseTarget(clean(relationMatch[1])),
      });
      break;
    }
  }
  return rows;
}

let lexicalRelations = [];
for (const entry of entries) {
  const sourceHeadword = firstHeadword(entry);
  const base = {
    source_record_id: entry.record_id,
    source_headword: sourceHeadword,
    source_page: entry.page_start,
    source_page_end: entry.page_end,
    source_document: entry.source_document,
    source_code: entry.source_code,
    validation_status: "Pendiente de cotejo lingüístico",
  };
  for (const relation of [...visibleRemissions(entry), ...bracketRelations(entry)]) lexicalRelations.push({ ...base, ...relation });
}

lexicalRelations.sort((a, b) => a.source_record_id.localeCompare(b.source_record_id)
  || a.relation_type.localeCompare(b.relation_type)
  || a.source_field.localeCompare(b.source_field)
  || a.occurrence - b.occurrence
  || a.target_index - b.target_index
  || String(a.target_form).localeCompare(String(b.target_form), "es"));
lexicalRelations = lexicalRelations.map((row, index) => ({ relation_id: `REL-${String(index + 1).padStart(6, "0")}`, ...row }));

const typedOutput = {
  schema_version: "1.1.0-candidate",
  base_dataset_version: "1.0.0",
  generated_from: "data/lexicon-master.json",
  record_count: typedRecords.length,
  unresolved_origin_count: typedRecords.filter((row) => row.variant_origin === "unresolved").length,
  records: typedRecords,
};

const relationOutput = {
  schema_version: "1.1.0-candidate",
  base_dataset_version: "1.0.0",
  generated_from: ["translation_raw", "comments_raw"],
  relation_count: lexicalRelations.length,
  source_remission_occurrence_count: new Set(lexicalRelations.filter((row) => row.relation_type === "cross_reference").map((row) => `${row.source_record_id}|${row.source_field}|${row.occurrence}`)).size,
  unique_resolution_count: lexicalRelations.filter((row) => row.resolution_status === "resolved_unique").length,
  ambiguous_resolution_count: lexicalRelations.filter((row) => row.resolution_status === "resolved_ambiguous").length,
  unresolved_resolution_count: lexicalRelations.filter((row) => row.resolution_status === "unresolved").length,
  records: lexicalRelations,
};

await Promise.all([
  writeFile(typedPath, `${JSON.stringify(typedOutput, null, 2)}\n`, "utf8"),
  writeFile(relationsPath, `${JSON.stringify(relationOutput, null, 2)}\n`, "utf8"),
]);

console.log(JSON.stringify({
  typed_variant_tokens: typedRecords.length,
  unresolved_variant_origins: typedOutput.unresolved_origin_count,
  lexical_relations: lexicalRelations.length,
  source_remission_occurrences: relationOutput.source_remission_occurrence_count,
  resolved_unique: relationOutput.unique_resolution_count,
  resolved_ambiguous: relationOutput.ambiguous_resolution_count,
  unresolved_targets: relationOutput.unresolved_resolution_count,
}, null, 2));
