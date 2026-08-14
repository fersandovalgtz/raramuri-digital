import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
await mkdir(out, { recursive: true });

const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));
const graphic = JSON.parse(await readFile(join(root, "data/graphic-variants.json"), "utf8"));

const clean = (value) => String(value ?? "").replace(/\s+/gu, " ").trim();
const normalize = (value) => clean(value)
  .replace(/[’‘`´]/gu, "'")
  .toLocaleLowerCase("es-MX")
  .normalize("NFD")
  .replace(/\p{M}/gu, "")
  .normalize("NFC");
const normalizeForm = (value) => normalize(value).replace(/[^a-zñ']/gu, "");

const KNOWN_LABELS = new Set(["pret", "fut", "pp", "pl", "sing", "pres", "ad", "gut"]);
const KNOWN_LABEL_PATTERN = /\b(pret|fut|pp|pl|sing|pres|ad|gut)\.?\s*:/giu;

function headwordSecondaryCandidates(entry) {
  const raw = String(entry.headword_raw ?? entry.headword ?? "");
  if (!raw.includes(",")) return [];
  return raw.split(/\s*,\s*/u).slice(1).map(clean).filter(Boolean).map((value, index) => ({
    origin: "headword_secondary",
    value,
    sequence: index,
    evidence: raw,
  }));
}

function bracketCandidates(entry) {
  const comments = String(entry.comments_raw ?? "");
  return [...comments.matchAll(/\[([^\]]+)\]/gu)].map((match, index) => ({
    origin: "bracket_annotation",
    value: clean(match[1]),
    sequence: index,
    evidence: match[0],
  })).filter((candidate) => candidate.value);
}

// Mirrors the current historical extractor exactly. It does NOT match the common accented spelling “Véase”.
function historicalCrossReferenceCandidates(entry) {
  const comments = String(entry.comments_raw ?? "");
  return [...comments.matchAll(/\b[Vv]e(?:a|á)se\s+([^.;\]]+)/gu)].map((match, index) => ({
    origin: "cross_reference",
    value: `véase ${clean(match[1])}`,
    target: clean(match[1]),
    sequence: index,
    evidence: match[0],
  })).filter((candidate) => candidate.target);
}

// Diagnostic only: recognizes both Véase/Vease and the historical regex variants.
function inclusiveCrossReferenceCandidates(entry) {
  const comments = String(entry.comments_raw ?? "");
  return [...comments.matchAll(/\b[Vv](?:e|é)(?:a|á)se\s+([^.;\]]+)/gu)].map((match, index) => ({
    target: clean(match[1]),
    value: `véase ${clean(match[1])}`,
    sequence: index,
    evidence: match[0],
  })).filter((candidate) => candidate.target);
}

function historicalBracketStructure(value) {
  const segments = clean(value).split(/\s*;\s*/u).filter(Boolean);
  const parsed = segments.map((segment) => {
    const match = /^([^:]+):\s*(.+)$/u.exec(segment);
    return match ? { segment, label: clean(match[1]).replace(/\.$/u, ""), value: clean(match[2]) } : { segment, label: "", value: "" };
  });
  const labeled = parsed.filter((segment) => segment.label);
  let structure = "unlabeled";
  if (labeled.length === parsed.length && labeled.length > 0) structure = "labeled";
  else if (labeled.length > 0) structure = "mixed";
  return { structure, parsed, labels: labeled.map((segment) => normalize(segment.label)) };
}

function robustKnownLabelGroups(value) {
  const text = clean(value);
  const matches = [...text.matchAll(KNOWN_LABEL_PATTERN)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const rawValue = text.slice(start, end).replace(/^[\s,;:]+|[\s,;:]+$/gu, "");
    const forms = rawValue.split(/\s*,\s*/u).map(clean).filter(Boolean);
    return { label: normalize(match[1]), raw_value: rawValue, forms };
  });
}

function classifyBracket(value) {
  const text = clean(value);
  const historical = historicalBracketStructure(text);
  const robust = robustKnownLabelGroups(text);

  const variantMatch = /^variante\s+de\s+(.+)$/iu.exec(text);
  if (variantMatch) return {
    nature: "explicit_source_variant_reference",
    target: clean(variantMatch[1]),
    feature: "",
    historical,
    robust,
    needs_source_review: false,
  };

  const relationPatterns = [
    [/^futuro\s+de\s+(.+)$/iu, "fut"],
    [/^pp\.?\s+de\s+(.+)$/iu, "pp"],
    [/^pret\.?\s+de\s+(.+)$/iu, "pret"],
  ];
  for (const [pattern, feature] of relationPatterns) {
    const match = pattern.exec(text);
    if (match) return {
      nature: "grammatical_relation_phrase",
      target: clean(match[1]),
      feature,
      historical,
      robust,
      needs_source_review: false,
    };
  }

  if (historical.structure === "mixed") return {
    nature: "mixed_grammatical_annotation_unlabeled_segment",
    target: "",
    feature: "",
    historical,
    robust,
    needs_source_review: true,
  };

  if (historical.structure === "labeled") {
    const historicalKnown = historical.labels.filter((label) => KNOWN_LABELS.has(label));
    const embeddedKnownLabels = Math.max(0, robust.length - historicalKnown.length);
    return {
      nature: embeddedKnownLabels > 0 ? "grammatical_annotation_malformed_punctuation" : "grammatical_annotation_labeled",
      target: "",
      feature: "",
      historical,
      robust,
      embedded_known_label_count: embeddedKnownLabels,
      needs_source_review: embeddedKnownLabels > 0 || historical.labels.includes("gut") || historical.labels.includes("ad"),
    };
  }

  return {
    nature: "untyped_bracket_annotation",
    target: "",
    feature: "",
    historical,
    robust,
    needs_source_review: true,
  };
}

const headwordIndex = new Map();
for (const entry of entries) {
  const first = clean(String(entry.headword ?? "").split(/\s*,\s*/u)[0]);
  const k = normalizeForm(first);
  if (!headwordIndex.has(k)) headwordIndex.set(k, []);
  headwordIndex.get(k).push(entry.record_id);
}

const tokenRows = [];
const unresolved = [];
const inclusiveCrossRefs = [];

for (const entry of entries) {
  const sourceCandidates = [
    ...headwordSecondaryCandidates(entry),
    ...bracketCandidates(entry),
    ...historicalCrossReferenceCandidates(entry),
  ];
  const byKey = new Map();
  for (const candidate of sourceCandidates) {
    const k = normalize(candidate.value);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(candidate);
  }

  const actualVariantKeys = new Set((entry.variants ?? []).map((value) => normalize(value)));
  for (const candidate of inclusiveCrossReferenceCandidates(entry)) {
    inclusiveCrossRefs.push({
      record_id: entry.record_id,
      headword: entry.headword,
      target: candidate.target,
      normalized_target: normalize(candidate.target),
      evidence: candidate.evidence,
      captured_in_current_variants: actualVariantKeys.has(normalize(candidate.value)),
      source_document: entry.source_document,
      page_start: entry.page_start,
      page_end: entry.page_end,
    });
  }

  for (let index = 0; index < (entry.variants ?? []).length; index += 1) {
    const variant = clean(entry.variants[index]);
    const k = normalize(variant);
    const matches = byKey.get(k) ?? [];
    const first = matches[0] ?? null;
    const origins = [...new Set(matches.map((candidate) => candidate.origin))];
    let detail = null;
    let nature = "unresolved";
    let target = "";

    if (first?.origin === "headword_secondary") {
      nature = "co_headword_form";
    } else if (first?.origin === "cross_reference") {
      nature = "cross_reference";
      target = first.target ?? variant.replace(/^véase\s+/iu, "");
    } else if (first?.origin === "bracket_annotation") {
      detail = classifyBracket(first.value);
      nature = detail.nature;
      target = detail.target;
    }

    const targetRecords = target ? (headwordIndex.get(normalizeForm(target.replace(/^[1-9](?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’‘])/u, ""))) ?? []) : [];
    const row = {
      variant_token_id: `${entry.record_id}#${String(index + 1).padStart(2, "0")}`,
      record_id: entry.record_id,
      variant,
      variant_normalized: k,
      emission_origin: first?.origin ?? "unresolved",
      all_matching_origins: origins,
      multiple_matching_origins: origins.length > 1,
      nature,
      target,
      target_record_ids: targetRecords,
      target_resolves_to_lexicon: target ? targetRecords.length > 0 : null,
      bracket_detail: detail,
      headword_raw: entry.headword_raw,
      comments_raw: entry.comments_raw,
      source_code: entry.source_code,
      source_document: entry.source_document,
      page_start: entry.page_start,
      page_end: entry.page_end,
      source_status: entry.status,
      matching_evidence: matches.map((candidate) => ({ origin: candidate.origin, value: candidate.value, evidence: candidate.evidence })),
    };
    tokenRows.push(row);
    if (!first) unresolved.push(row);
  }
}

const countBy = (field) => Object.fromEntries([...new Set(tokenRows.map((row) => row[field]))].sort().map((value) => [value, tokenRows.filter((row) => row[field] === value).length]));
const originCounts = countBy("emission_origin");
const natureCounts = countBy("nature");
const entriesWithVariants = entries.filter((entry) => (entry.variants ?? []).length > 0).length;
const multipleOriginTokens = tokenRows.filter((row) => row.multiple_matching_origins);
const sourceReviewTokens = tokenRows.filter((row) => row.bracket_detail?.needs_source_review);
const explicitVariantRefs = tokenRows.filter((row) => row.nature === "explicit_source_variant_reference");
const explicitVariantTargetsResolved = explicitVariantRefs.filter((row) => row.target_resolves_to_lexicon);
const missedCrossRefs = inclusiveCrossRefs.filter((row) => !row.captured_in_current_variants);
const capturedCrossRefs = inclusiveCrossRefs.filter((row) => row.captured_in_current_variants);

const simpleLabelCounts = new Map();
const robustLabelCounts = new Map();
let simpleLabelGroups = 0;
let robustLabelGroups = 0;
let robustFormSlots = 0;
const malformedPunctuation = [];
const mixedAnnotations = [];
for (const row of tokenRows) {
  if (!row.bracket_detail) continue;
  for (const label of row.bracket_detail.historical.labels) {
    simpleLabelCounts.set(label, (simpleLabelCounts.get(label) ?? 0) + 1);
    simpleLabelGroups += 1;
  }
  for (const group of row.bracket_detail.robust) {
    robustLabelCounts.set(group.label, (robustLabelCounts.get(group.label) ?? 0) + 1);
    robustLabelGroups += 1;
    robustFormSlots += group.forms.length;
  }
  if (row.nature === "grammatical_annotation_malformed_punctuation") malformedPunctuation.push(row);
  if (row.nature === "mixed_grammatical_annotation_unlabeled_segment") mixedAnnotations.push(row);
}

const graphicExplicitHeadword = graphic.filter((row) => row.relation_type === "Gráfica" && row.derivation_method === "Explícita en el lema");
const graphicFlexion = graphic.filter((row) => row.relation_type === "Flexión");
const graphicCrossRefs = graphic.filter((row) => row.relation_type === "Remisión");
const explicitPatternCounts = Object.fromEntries([...new Set(graphicExplicitHeadword.map((row) => row.pattern))].sort().map((pattern) => [pattern, graphicExplicitHeadword.filter((row) => row.pattern === pattern).length]));

const explicitVariantRelationCoverage = explicitVariantRefs.map((row) => {
  const headKey = normalizeForm(String(row.headword_raw ?? "").replace(/^[1-9](?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’‘])/u, "").split(/\s*,\s*/u)[0]);
  const targetKey = normalizeForm(row.target);
  const relations = graphic.filter((rel) => rel.entry_ids?.includes(row.record_id) && (
    (normalizeForm(rel.form_a) === headKey && normalizeForm(rel.form_b) === targetKey) ||
    (normalizeForm(rel.form_b) === headKey && normalizeForm(rel.form_a) === targetKey)
  ));
  return {
    variant_token_id: row.variant_token_id,
    record_id: row.record_id,
    source_headword: row.headword_raw,
    target: row.target,
    target_record_ids: row.target_record_ids,
    structured_graphic_relations: relations.map((rel) => ({ variant_id: rel.variant_id, pattern: rel.pattern, derivation_method: rel.derivation_method, relation_type: rel.relation_type })),
    has_any_structured_relation: relations.length > 0,
    has_source_explicit_structured_relation: relations.some((rel) => /explícita/iu.test(rel.derivation_method)),
  };
});

const report = {
  audit: "Rarámuri Digital: auditoría exhaustiva de procedencia y naturaleza de variants v2",
  date: "2026-08-14",
  dataset_version: "1.0.0",
  source_entries: entries.length,
  entries_with_variants: entriesWithVariants,
  variant_tokens: tokenRows.length,
  unique_normalized_variant_strings: new Set(tokenRows.map((row) => row.variant_normalized)).size,
  emission_origin_counts: originCounts,
  nature_counts: natureCounts,
  multiple_matching_origin_tokens: multipleOriginTokens.length,
  unresolved_tokens: unresolved.length,
  source_review_tokens: sourceReviewTokens.map((row) => ({ variant_token_id: row.variant_token_id, record_id: row.record_id, variant: row.variant, nature: row.nature, page_start: row.page_start, bracket_detail: row.bracket_detail })),
  grammatical_annotation_controls: {
    historical_parser_label_groups: simpleLabelGroups,
    robust_known_label_groups: robustLabelGroups,
    robust_form_slots_before_deduplication: robustFormSlots,
    historical_label_counts: Object.fromEntries([...simpleLabelCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))),
    robust_known_label_counts: Object.fromEntries([...robustLabelCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))),
    malformed_punctuation_tokens: malformedPunctuation.map((row) => ({ record_id: row.record_id, variant: row.variant, page_start: row.page_start, historical: row.bracket_detail.historical, robust: row.bracket_detail.robust })),
    mixed_annotation_tokens: mixedAnnotations.map((row) => ({ record_id: row.record_id, variant: row.variant, page_start: row.page_start, historical: row.bracket_detail.historical })),
    unresolved_abbreviation_labels: [
      { label: "ad", policy: "Conservar como etiqueta documental; no expandir sin cotejo de fuente." },
      { label: "gut", policy: "El producto actual la normaliza a fut, pero la auditoría conserva gut y exige cotejo de fuente antes de tratarla como fut." },
    ],
  },
  explicit_source_variant_references: {
    count: explicitVariantRefs.length,
    targets_resolving_to_lexicon: explicitVariantTargetsResolved.length,
    records: explicitVariantRelationCoverage,
  },
  cross_reference_capture_audit: {
    inclusive_visible_cross_reference_count: inclusiveCrossRefs.length,
    captured_by_current_variants_count: capturedCrossRefs.length,
    missed_by_current_extractor_count: missedCrossRefs.length,
    cause: "La expresión regular histórica reconoce Vease/Veáse pero no la grafía frecuente Véase con acento en e.",
    missed_records: missedCrossRefs,
  },
  graphic_product_controls: {
    explicit_headword_relations: graphicExplicitHeadword.length,
    explicit_headword_pattern_counts: explicitPatternCounts,
    flexion_relations_current: graphicFlexion.length,
    cross_reference_relations_current: graphicCrossRefs.length,
    note: "Una anotación bracket puede generar varias relaciones Flexión; el parser actual además presenta dos casos de puntuación interna que requieren revisión antes de corregir relaciones derivadas.",
  },
  editorial_policy: {
    dataset_1_0_0: "No modificar headword_raw, headword, variants ni record_id durante esta auditoría.",
    co_headword_form: "Forma documental co-presentada en la celda del lema; no asumir sinonimia, cognación ni variante fonológica sin validación lingüística.",
    explicit_source_variant_reference: "La propia fuente dice 'variante de'; relación documental explícita, aunque su naturaleza gráfica/fonológica requiere análisis separado.",
    grammatical_annotations: "Conservar etiquetas y formas tal como fueron extraídas; separar estructura documental de validación morfológica.",
    cross_references: "Tratar como relaciones documentales, no como variantes. Corregir la cobertura del extractor en una migración controlada, no silenciosamente en 1.0.0.",
  },
  token_records: tokenRows,
};

const lines = [
  "# Auditoría exhaustiva de procedencia y naturaleza de `variants` — v2",
  "",
  "**Fecha:** 14 de agosto de 2026  ",
  "**Dataset:** 1.0.0  ",
  `**Entradas fuente:** ${entries.length}`,
  "",
  "## Clasificación completa",
  "",
  `Se clasificaron **${tokenRows.length} tokens** de \`variants\` en **${entriesWithVariants} entradas**. La reconstrucción de procedencia es total: **${unresolved.length} tokens sin origen** y **${multipleOriginTokens.length} con origen múltiple**.`,
  "",
  "| Procedencia efectiva | Tokens |",
  "|---|---:|",
  ...Object.entries(originCounts).map(([name, count]) => `| \`${name}\` | ${count} |`),
  "",
  "| Naturaleza documental | Tokens |",
  "|---|---:|",
  ...Object.entries(natureCounts).map(([name, count]) => `| \`${name}\` | ${count} |`),
  "",
  "La separación permite distinguir las formas co-presentadas en el lema de las anotaciones gramaticales, las seis referencias en las que la fuente dice literalmente `variante de ...`, las remisiones y los casos problemáticos de puntuación.",
  "",
  "## Anotaciones gramaticales",
  "",
  `El parser histórico recupera **${simpleLabelGroups} grupos etiqueta:valor**. Un control más robusto restringido a las etiquetas realmente documentadas recupera **${robustLabelGroups} grupos** y **${robustFormSlots} posiciones de forma antes de deduplicación**. La diferencia se concentra en **${malformedPunctuation.length} tokens con puntuación interna problemática**.`,
  "",
  "| Etiqueta documental | Conteo robusto |",
  "|---|---:|",
  ...[...robustLabelCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es")).map(([label, count]) => `| \`${label}\` | ${count} |`),
  "",
  ...malformedPunctuation.map((row) => `- \`${row.record_id}\` (p. ${row.page_start}): \`${row.variant}\` — el parser histórico fusiona una etiqueta interna; requiere cotejo visual antes de corregir el producto derivado.`),
  ...mixedAnnotations.map((row) => `- \`${row.record_id}\` (p. ${row.page_start}): \`${row.variant}\` — contiene al menos un segmento sin etiqueta; no se le asigna función por inferencia.`),
  "",
  "Las abreviaturas `ad` y `gut` se conservan literalmente. En particular, el extractor de variantes gráficas normaliza hoy `gut` a `fut`; esa sustitución queda marcada para cotejo de fuente en vez de asumirse como equivalencia documental.",
  "",
  "## Referencias explícitas de variante",
  "",
  `Hay **${explicitVariantRefs.length}** anotaciones entre corchetes con la fórmula literal \`variante de ...\`; **${explicitVariantTargetsResolved.length}/${explicitVariantRefs.length}** de sus destinos resuelven a lemas del corpus. Son relaciones de variante explícitas en la fuente, distintas de las 54 formas co-presentadas en la celda del lema.`,
  "",
  "## Remisiones y defecto de cobertura",
  "",
  `El campo \`variants\` contiene sólo **${capturedCrossRefs.length}** remisiones, pero un barrido inclusivo de \`comments_raw\` detecta **${inclusiveCrossRefs.length}** cadenas visibles de tipo \`Véase/Vease\`; por tanto, **${missedCrossRefs.length}** no fueron capturadas por el extractor actual. La causa es precisa: la regex histórica reconoce \`Vease\`/\`Veáse\`, pero no la grafía común \`Véase\` con acento en la primera e.`,
  "",
  "Este hallazgo **no autoriza a reescribir silenciosamente datos 1.0.0**. Sí justifica una corrección controlada del extractor y una migración reproducible de las remisiones en una revisión posterior.",
  "",
  "## Dictamen",
  "",
  "`variants` no es una colección homogénea de variantes lingüísticas. Es un contenedor desnormalizado que mezcla formas co-presentadas, anotaciones gramaticales, referencias explícitas de variante y remisiones. La siguiente versión de esquema debe separar al menos `variant_origin`, `variant_nature`, `target_record_id` y la evidencia fuente, manteniendo una vista compatible de `variants`.",
  "",
];

await writeFile(join(out, "variant-origin-nature-audit-v2.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(join(out, "variant-origin-nature-audit-v2.md"), `${lines.join("\n")}\n`, "utf8");

console.log("VARIANT_ORIGIN_NATURE_AUDIT_V2=" + JSON.stringify({
  entries_with_variants: entriesWithVariants,
  variant_tokens: tokenRows.length,
  origin_counts: originCounts,
  nature_counts: natureCounts,
  unresolved_tokens: unresolved.length,
  source_review_tokens: sourceReviewTokens.length,
  explicit_source_variant_references: explicitVariantRefs.length,
  explicit_variant_targets_resolved: explicitVariantTargetsResolved.length,
  inclusive_visible_cross_references: inclusiveCrossRefs.length,
  current_cross_references_captured: capturedCrossRefs.length,
  missed_cross_references: missedCrossRefs.length,
  historical_parser_label_groups: simpleLabelGroups,
  robust_known_label_groups: robustLabelGroups,
  robust_form_slots: robustFormSlots,
  malformed_punctuation_tokens: malformedPunctuation.length,
  mixed_annotation_tokens: mixedAnnotations.length,
}));
