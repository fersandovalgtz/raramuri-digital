import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "data/lexicon-master.json");
const jsonPath = resolve(projectRoot, "data/graphic-variants.json");
const csvPath = resolve(projectRoot, "data/graphic-variants.csv");
const reportPath = resolve(projectRoot, "data/graphic-variants-report.json");

const entries = JSON.parse(await readFile(sourcePath, "utf8"));

function normalize(value) {
  return value
    .replace(/[’‘`´]/gu, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/gu, " ")
    .trim();
}

function searchKey(value) {
  return normalize(value).replace(/[^a-zñ']/gu, "");
}

function splitHeadword(value) {
  return value.split(/\s*,\s*/u).map((item) => item.trim()).filter(Boolean);
}

function splitForms(value) {
  return value.split(/\s*,\s*/u).map((item) => item.trim()).filter(Boolean);
}

function patternFor(left, right) {
  const a = searchKey(left);
  const b = searchKey(right);
  if (!a || !b || a === b) return "Otra relación explícita";
  if (a.length === b.length) {
    const diffs = [];
    for (let index = 0; index < a.length; index += 1) {
      if (a[index] !== b[index]) diffs.push([a[index], b[index]]);
    }
    if (diffs.length === 1) {
      const chars = new Set(diffs[0]);
      if (chars.has("r") && chars.has("l")) return "r/l";
      if (chars.has("g") && chars.has("c")) return "g/c";
      if (chars.has("i") && chars.has("e")) return "i/e";
    }
  }
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  if (longer.slice(1) === shorter && /[bcdfghjklmnñpqrstvwxyz]/u.test(longer[0])) return "Ø/C inicial";
  if (longer.startsWith("hu") && longer.slice(2) === shorter) return "Ø/C inicial";
  for (let index = 0; index <= shorter.length - 2; index += 1) {
    if (shorter.slice(index, index + 2) === "ba" && `${shorter.slice(0, index)}hua${shorter.slice(index + 2)}` === longer) return "ba/hua";
  }
  return "Otra relación explícita";
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const relations = [];
const seen = new Set();

function addRelation(relation) {
  const key = [relation.relation_type, relation.pattern, searchKey(relation.form_a), searchKey(relation.form_b), relation.entry_ids.join("|")].join("::");
  if (seen.has(key) || !relation.form_a || !relation.form_b) return;
  seen.add(key);
  relations.push(relation);
}

function sourceFields(entry) {
  return {
    source_code: entry.source_code,
    source_document: entry.source_document,
    page_start: entry.page_start,
    page_end: entry.page_end,
    source_status: entry.status,
    validation_status: "Pendiente de cotejo lingüístico",
  };
}

for (const entry of entries) {
  const headwordForms = splitHeadword(entry.headword);
  for (const form of headwordForms.slice(1)) {
    addRelation({
      variant_id: "",
      form_a: headwordForms[0],
      form_b: form,
      form_a_normalized: normalize(headwordForms[0]),
      form_b_normalized: normalize(form),
      pattern: patternFor(headwordForms[0], form),
      relation_type: "Gráfica",
      derivation_method: "Explícita en el lema",
      entry_id: entry.record_id,
      entry_ids: [entry.record_id],
      related_entry_id: "",
      evidence: entry.headword_raw || entry.headword,
      classification: entry.classification,
      ...sourceFields(entry),
    });
  }

  for (const rawVariant of entry.variants || []) {
    if (/^véase\s+/iu.test(rawVariant)) {
      const target = rawVariant.replace(/^véase\s+/iu, "").trim();
      addRelation({
        variant_id: "", form_a: headwordForms[0], form_b: target,
        form_a_normalized: normalize(headwordForms[0]), form_b_normalized: normalize(target),
        pattern: "Remisión", relation_type: "Remisión", derivation_method: "Explícita en variantes",
        entry_id: entry.record_id, entry_ids: [entry.record_id], related_entry_id: "",
        evidence: rawVariant, classification: entry.classification, ...sourceFields(entry),
      });
      continue;
    }
    if (!rawVariant.includes(":")) continue;
    for (const segment of rawVariant.split(/\s*;\s*/u)) {
      const match = /^([^:]+):\s*(.+)$/u.exec(segment.trim());
      if (!match) continue;
      const label = match[1].trim().replace(/\.$/u, "").toLocaleLowerCase("es");
      for (const form of splitForms(match[2])) {
        addRelation({
          variant_id: "", form_a: headwordForms[0], form_b: form,
          form_a_normalized: normalize(headwordForms[0]), form_b_normalized: normalize(form),
          pattern: label === "gut" ? "fut" : label,
          relation_type: "Flexión", derivation_method: "Etiqueta morfológica explícita",
          entry_id: entry.record_id, entry_ids: [entry.record_id], related_entry_id: "",
          evidence: rawVariant, classification: entry.classification, ...sourceFields(entry),
        });
      }
    }
  }
}

const candidates = [];
for (const entry of entries) {
  for (const form of splitHeadword(entry.headword)) {
    const key = searchKey(form);
    if (!key || key.length < 2 || key.length > 32 || /\s/u.test(normalize(form))) continue;
    candidates.push({ form, key, entry });
  }
}

const patternNames = new Set(["r/l", "g/c", "i/e", "Ø/C inicial", "ba/hua"]);
for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
  const left = candidates[leftIndex];
  for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
    const right = candidates[rightIndex];
    if (left.key === right.key) continue;
    if (Math.abs(left.key.length - right.key.length) > 2) continue;
    const pattern = patternFor(left.form, right.form);
    if (!patternNames.has(pattern)) continue;
    const entryIds = [...new Set([left.entry.record_id, right.entry.record_id])].sort();
    const first = left.key.localeCompare(right.key, "es") <= 0 ? left : right;
    const second = first === left ? right : left;
    addRelation({
      variant_id: "", form_a: first.form, form_b: second.form,
      form_a_normalized: normalize(first.form), form_b_normalized: normalize(second.form),
      pattern, relation_type: "Gráfica", derivation_method: "Comparación automática de lemas documentados",
      entry_id: first.entry.record_id, entry_ids: entryIds,
      related_entry_id: entryIds.length > 1 ? second.entry.record_id : "",
      evidence: `${left.entry.record_id}: ${left.entry.headword} | ${right.entry.record_id}: ${right.entry.headword}`,
      classification: [left.entry.classification, right.entry.classification].filter(Boolean).join(" | "),
      source_code: first.entry.source_code,
      source_document: first.entry.source_document,
      page_start: Math.min(left.entry.page_start, right.entry.page_start),
      page_end: Math.max(left.entry.page_end, right.entry.page_end),
      source_status: `${left.entry.status} | ${right.entry.status}`,
      validation_status: "Pendiente de cotejo lingüístico",
    });
  }
}

relations.sort((a, b) => a.relation_type.localeCompare(b.relation_type, "es") || a.pattern.localeCompare(b.pattern, "es") || a.form_a_normalized.localeCompare(b.form_a_normalized, "es"));
relations.forEach((relation, index) => { relation.variant_id = `VAR-${String(index + 1).padStart(6, "0")}`; });

const columns = ["variant_id", "form_a", "form_b", "form_a_normalized", "form_b_normalized", "pattern", "relation_type", "derivation_method", "entry_id", "entry_ids", "related_entry_id", "classification", "evidence", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
const csv = "\ufeff" + [columns, ...relations.map((relation) => columns.map((column) => relation[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
const graphicRelations = relations.filter((relation) => relation.relation_type === "Gráfica");
const patterns = Object.fromEntries([...new Set(graphicRelations.map((relation) => relation.pattern))].sort((a, b) => a.localeCompare(b, "es")).map((pattern) => [pattern, graphicRelations.filter((relation) => relation.pattern === pattern).length]));
const report = {
  records: relations.length,
  graphic_relations: graphicRelations.length,
  inflection_relations: relations.filter((relation) => relation.relation_type === "Flexión").length,
  cross_references: relations.filter((relation) => relation.relation_type === "Remisión").length,
  explicit_graphic_relations: graphicRelations.filter((relation) => relation.derivation_method === "Explícita en el lema").length,
  detected_graphic_relations: graphicRelations.filter((relation) => relation.derivation_method.startsWith("Comparación automática")).length,
  source_entries: entries.length,
  source_entries_with_variant_annotations: entries.filter((entry) => entry.variants?.length).length,
  patterns,
  extraction_method: "Relaciones explícitas de lemas y variantes; comparación exhaustiva de lemas documentados para r/l, g/c, i/e, ba/hua y presencia/ausencia de consonante inicial",
  validation_status: "Pendiente de cotejo lingüístico",
};

await Promise.all([
  writeFile(jsonPath, JSON.stringify(relations, null, 2) + "\n"),
  writeFile(csvPath, csv),
  writeFile(reportPath, JSON.stringify(report, null, 2) + "\n"),
]);

console.log(JSON.stringify(report, null, 2));
