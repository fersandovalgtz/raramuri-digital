import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));
const metadata = JSON.parse(await readFile(join(root, "project-metadata.json"), "utf8"));
const quality = JSON.parse(await readFile(join(root, "public/downloads/quality-report.json"), "utf8"));

const clean = (v) => String(v ?? "").trim();
const compact = (v) => clean(v).replace(/\s+/g, " ");
const project = (e) => ({
  record_id: e.record_id,
  headword: e.headword,
  headword_raw: e.headword_raw,
  headword_normalized: e.headword_normalized,
  homonym_number: e.homonym_number ?? null,
  classification: e.classification,
  classification_family: e.classification_family,
  translation_raw: e.translation_raw,
  page_start: e.page_start,
  page_end: e.page_end,
});
const rawKey = (v) => compact(v).replace(/^\d+\s*/u, "").normalize("NFC")
  .replace(/[‘’ʼʾ]/gu, "'").toLocaleLowerCase("es-MX");
const accentFold = (v) => rawKey(v).normalize("NFD").replace(/\p{M}+/gu, "");

function groups(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()].filter(([, xs]) => xs.length > 1)
    .map(([key, xs]) => ({ key, count: xs.length, entries: xs }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, "es"));
}

// Conservative: only an explicit grammatical label at segment start or after a numbered sense.
const gramRx = /(?:^|\s+\d+[.)]\s*)(vt|vi|vr|v|s|adj|adv|conj|prep|pron|interj|interr|pp|imper)(?:\s+(?:sing|pl|reg))?(?=\s|$)/giu;
function grammarHints(e) {
  const found = new Set();
  for (const segment of [e.translation_raw, ...(e.senses ?? [])].filter(Boolean)) {
    for (const m of compact(segment).matchAll(gramRx)) found.add(m[1].toLocaleLowerCase("es-MX"));
  }
  return [...found].sort();
}

const missingTranslation = entries.filter((e) => !clean(e.translation_raw));
const missingSenses = entries.filter((e) => !Array.isArray(e.senses) || e.senses.length === 0);
const missingClassification = entries.filter((e) => !clean(e.classification));
const unclassified = entries.filter((e) => !clean(e.classification) || e.classification_family === "Sin clasificar");
const unclassifiedHints = unclassified.map((e) => ({ ...project(e), hints: grammarHints(e) })).filter((e) => e.hints.length);
const unclassifiedMultipleHints = unclassifiedHints.filter((e) => e.hints.length > 1);
const noteLike = entries.filter((e) => /^nota\s*:/iu.test(clean(e.headword_raw))).map(project);

const exactDuplicateGroups = groups(entries, (e) => [
  compact(e.headword_raw), clean(e.classification), compact(e.translation_raw),
  e.page_start, e.page_end, compact(e.comments_raw),
].join("|"));

const signatureGroups = groups(entries, (e) => `${e.headword_normalized}|${e.homonym_number ?? ""}|${e.page_start}`)
  .map((g) => {
    const raws = [...new Set(g.entries.map((e) => rawKey(e.headword_raw)))];
    const folded = [...new Set(g.entries.map((e) => accentFold(e.headword_raw)))];
    const relation = raws.length === 1 ? "same_raw_form" : folded.length === 1 ? "normalization_only" : "other_raw_difference";
    return { key: g.key, count: g.count, raw_form_relation: relation, raw_forms: raws, entries: g.entries.map(project) };
  });
const sameRaw = signatureGroups.filter((g) => g.raw_form_relation === "same_raw_form");
const normalizationOnly = signatureGroups.filter((g) => g.raw_form_relation === "normalization_only");
const otherRaw = signatureGroups.filter((g) => g.raw_form_relation === "other_raw_difference");

const unnumberedSamePage = groups(entries.filter((e) => e.homonym_number == null), (e) => `${e.headword_normalized}|${e.page_start}`);
const normalizedGroups = groups(entries, (e) => e.headword_normalized);
const mixedNumbering = normalizedGroups.filter((g) => g.entries.some((e) => e.homonym_number == null) && g.entries.some((e) => e.homonym_number != null));
const rawNumberMismatches = entries.map((e) => {
  const m = clean(e.headword_raw).match(/^(\d+)\s*(.+)$/u);
  return m && e.homonym_number !== Number(m[1]) ? { ...project(e), raw_number_prefix: Number(m[1]) } : null;
}).filter(Boolean);

const normalization = { non_nfc: [], boundary_whitespace: [], normalized_uppercase: [], normalized_curly_apostrophe: [], normalized_repeated_space: [] };
for (const e of entries) {
  for (const field of ["headword", "headword_raw", "headword_normalized", "classification", "translation_raw", "comments_raw"]) {
    const value = String(e[field] ?? "");
    if (value !== value.normalize("NFC")) normalization.non_nfc.push({ record_id: e.record_id, field, value });
    if (value !== value.trim()) normalization.boundary_whitespace.push({ record_id: e.record_id, field, value });
  }
  const n = String(e.headword_normalized ?? "");
  if (n !== n.toLocaleLowerCase("es-MX")) normalization.normalized_uppercase.push(project(e));
  if (/[‘’ʼʾ]/u.test(n)) normalization.normalized_curly_apostrophe.push(project(e));
  if (/\s{2,}/u.test(n)) normalization.normalized_repeated_space.push(project(e));
}

const numberedTranslationParsingCandidates = entries
  .filter((e) => /^\s*1[.)]\s+/u.test(String(e.translation_raw ?? "")) && (e.senses?.length ?? 0) <= 1).map(project);

const variants = { lexical_or_unspecified: [], explicit_variant_of: [], inflectional_tense: [], number_or_valency_note: [], other_grammatical_note: [] };
for (const e of entries) for (const variant of e.variants ?? []) {
  const text = compact(variant);
  const row = { record_id: e.record_id, headword: e.headword, variant: text, page_start: e.page_start };
  if (/\bvariante\s+de\b/iu.test(text)) variants.explicit_variant_of.push(row);
  else if (/\b(?:pret|fut|pres|impf|perf)\s*:/iu.test(text)) variants.inflectional_tense.push(row);
  else if (/\b(?:pl|sing|reg|trans|intr)\s*:/iu.test(text)) variants.number_or_valency_note.push(row);
  else if (/\b(?:pp|part|ger|imper|pas|ad|adj|adv)\s*:/iu.test(text)) variants.other_grammatical_note.push(row);
  else variants.lexical_or_unspecified.push(row);
}
const variantTotal = Object.values(variants).reduce((n, xs) => n + xs.length, 0);
const grammaticalVariantTotal = variants.inflectional_tense.length + variants.number_or_valency_note.length + variants.other_grammatical_note.length;

const pageCounts = new Map();
for (const e of entries) for (let p = e.page_start; p <= e.page_end; p++) pageCounts.set(p, (pageCounts.get(p) ?? 0) + 1);
const pageDensity = [...pageCounts.entries()].map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count || a.page - b.page);

const priorities = [
  { priority: "P0", issue: "Entradas sin traducción o acepciones", count: new Set([...missingTranslation, ...missingSenses].map((e) => e.record_id)).size, action: "Cotejar con la fuente; no inferir contenido faltante." },
  { priority: "P0", issue: "Notas documentales modeladas como entradas", count: noteLike.length, action: "Preservar el texto y revisar si debe vivir como nota/metadato, no como lema." },
  { priority: "P1", issue: "Colisiones con la misma forma fuente", count: sameRaw.length, action: "Cotejo editorial prioritario; no fusionar automáticamente." },
  { priority: "P1", issue: "Sin clasificación con etiqueta gramatical explícita", count: unclassifiedHints.length, action: "Cotejar y recuperar sólo la etiqueta explícita de la fuente." },
  { priority: "P2", issue: "Colisiones inducidas sólo por normalización", count: normalizationOnly.length, action: "Separar de duplicados y conservar distinciones gráficas de la fuente." },
  { priority: "P2", issue: "variants con marca gramatical/flexiva explícita", count: grammaticalVariantTotal, action: "Evaluar subtipos o estructura separada sin perder el token documental." },
  { priority: "P3", issue: "Entradas sin ejemplos", count: quality.completeness.entries_without_examples, action: "Tratar como cobertura documental, no como error automático." },
];

const audit = {
  audit: "Rarámuri Digital: auditoría profunda del corpus lexicográfico v2",
  generated_at: new Date().toISOString(), dataset_version: metadata.dataset_version, release_date: metadata.release_date, entry_count: entries.length,
  baseline_quality_report: { generated: quality.generated, missing_classification: quality.completeness.missing_classification, missing_translation: quality.completeness.missing_translation, source_signature_collisions: quality.integrity.source_signature_collisions },
  critical: {
    missing_translation_count: missingTranslation.length, missing_translation_entries: missingTranslation.map(project),
    entries_without_senses_count: missingSenses.length, entries_without_senses: missingSenses.map(project),
    note_like_entry_candidate_count: noteLike.length, note_like_entry_candidates: noteLike,
    exact_content_duplicate_group_count: exactDuplicateGroups.length,
    exact_content_duplicate_groups: exactDuplicateGroups.map((g) => ({ ...g, entries: g.entries.map(project) })),
  },
  editorial: {
    missing_classification_count: missingClassification.length,
    unclassified_with_explicit_grammar_hints_count: unclassifiedHints.length,
    unclassified_with_explicit_grammar_hints: unclassifiedHints,
    unclassified_with_multiple_explicit_grammar_hints_count: unclassifiedMultipleHints.length,
    source_signature_collision_group_count: signatureGroups.length,
    source_signature_collision_record_count: signatureGroups.reduce((n, g) => n + g.count, 0),
    same_raw_signature_collision_group_count: sameRaw.length, same_raw_signature_collision_groups: sameRaw,
    normalization_only_signature_collision_group_count: normalizationOnly.length, normalization_only_signature_collision_groups: normalizationOnly,
    other_raw_difference_signature_collision_group_count: otherRaw.length, other_raw_difference_signature_collision_groups: otherRaw,
    same_page_unnumbered_collision_group_count: unnumberedSamePage.length,
    mixed_homonym_numbering_group_count: mixedNumbering.length,
    mixed_homonym_numbering_groups: mixedNumbering.map((g) => ({ ...g, entries: g.entries.map(project) })),
    raw_number_prefix_mismatch_count: rawNumberMismatches.length, raw_number_prefix_mismatches: rawNumberMismatches,
    numbered_translation_parsing_candidate_count: numberedTranslationParsingCandidates.length,
    numbered_translation_parsing_candidates: numberedTranslationParsingCandidates,
  },
  normalization: Object.fromEntries(Object.entries(normalization).flatMap(([k, xs]) => [[`${k}_count`, xs.length], [k, xs]])),
  variants: { total_variant_tokens: variantTotal, explicit_grammatical_or_inflectional_token_count: grammaticalVariantTotal, bucket_counts: Object.fromEntries(Object.entries(variants).map(([k, xs]) => [k, xs.length])), buckets: variants },
  distributions: { top_pages_by_entry_density: pageDensity.slice(0, 15), page_density: pageDensity },
  priorities,
  cautions: [
    "Los candidatos de clasificación requieren etiqueta explícita en la propia traducción/acepción; no se infiere categoría por significado.",
    "Una colisión de clave normalizada no equivale a duplicado; puede colapsar distinciones de acento o representar homógrafos legítimos.",
    "La ausencia de ejemplo o variante no constituye por sí sola un error.",
    "Ninguna corrección debe sobrescribir la forma documental sin preservar headword_raw, translation_raw y comments_raw.",
  ],
};

const summary = {
  entry_count: entries.length,
  missing_translation: missingTranslation.length, missing_senses: missingSenses.length, note_like_entry_candidates: noteLike.length,
  missing_classification: missingClassification.length,
  unclassified_with_explicit_hints: unclassifiedHints.length,
  unclassified_with_multiple_explicit_hints: unclassifiedMultipleHints.length,
  source_signature_collision_groups: signatureGroups.length,
  source_signature_collision_records: signatureGroups.reduce((n, g) => n + g.count, 0),
  same_raw_signature_collision_groups: sameRaw.length,
  normalization_only_signature_collision_groups: normalizationOnly.length,
  other_raw_difference_signature_collision_groups: otherRaw.length,
  exact_content_duplicate_groups: exactDuplicateGroups.length,
  same_page_unnumbered_collision_groups: unnumberedSamePage.length,
  mixed_homonym_numbering_groups: mixedNumbering.length,
  raw_number_prefix_mismatches: rawNumberMismatches.length,
  numbered_translation_parsing_candidates: numberedTranslationParsingCandidates.length,
  non_nfc: normalization.non_nfc.length, boundary_whitespace: normalization.boundary_whitespace.length,
  normalized_uppercase: normalization.normalized_uppercase.length, normalized_curly_apostrophe: normalization.normalized_curly_apostrophe.length,
  total_variant_tokens: variantTotal, variant_explicit_grammatical_or_inflectional: grammaticalVariantTotal,
};
const rows = priorities.map((r) => `| ${r.priority} | ${r.issue} | ${r.count} | ${r.action} |`).join("\n");
const md = `# Auditoría profunda del corpus lexicográfico — v2\n\n**Datos:** ${metadata.dataset_version} · **Entradas:** ${entries.length.toLocaleString("es-MX")}\n\nEsta auditoría complementa \`QUALITY_REPORT.md\` y no sustituye validación lingüística.\n\n## Resumen\n\n| Indicador | Resultado |\n|---|---:|\n| Sin traducción | ${summary.missing_translation} |\n| Sin acepciones | ${summary.missing_senses} |\n| Nota documental candidata como lema | ${summary.note_like_entry_candidates} |\n| Sin clasificación exacta | ${summary.missing_classification} |\n| Sin clasificación con etiqueta explícita recuperable | ${summary.unclassified_with_explicit_hints} |\n| Colisiones de firma | ${summary.source_signature_collision_groups} |\n| Registros en colisiones | ${summary.source_signature_collision_records} |\n| Colisiones con misma forma fuente | ${summary.same_raw_signature_collision_groups} |\n| Colisiones sólo por normalización | ${summary.normalization_only_signature_collision_groups} |\n| Duplicados exactos de contenido | ${summary.exact_content_duplicate_groups} |\n| Numeración de homónimos mixta | ${summary.mixed_homonym_numbering_groups} |\n| Errores prefijo numérico/homónimo | ${summary.raw_number_prefix_mismatches} |\n| Problemas NFC | ${summary.non_nfc} |\n| Espacios de borde | ${summary.boundary_whitespace} |\n| Tokens en variants | ${summary.total_variant_tokens} |\n| variants con marca gramatical/flexiva | ${summary.variant_explicit_grammatical_or_inflectional} |\n\n## Prioridades\n\n| Prioridad | Frente | Casos/grupos | Acción |\n|---|---|---:|---|\n${rows}\n\nLos detalles y todos los \`record_id\` están en \`corpus-audit.json\`.\n`;
await mkdir(out, { recursive: true });
await writeFile(join(out, "corpus-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(join(out, "corpus-audit.md"), md, "utf8");
console.log("CORPUS_AUDIT_SUMMARY=" + JSON.stringify(summary));
