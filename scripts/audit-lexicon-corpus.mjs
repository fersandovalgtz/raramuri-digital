import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputArgIndex = process.argv.indexOf("--output");
const outputDir = resolve(root, outputArgIndex >= 0 ? process.argv[outputArgIndex + 1] : ".tmp/corpus-audit");

const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));
const metadata = JSON.parse(await readFile(join(root, "project-metadata.json"), "utf8"));
const quality = JSON.parse(await readFile(join(root, "public/downloads/quality-report.json"), "utf8"));

const clean = (value) => String(value ?? "").trim();
const compactSpace = (value) => clean(value).replace(/\s+/g, " ");
const fold = (value) => compactSpace(value)
  .normalize("NFD")
  .replace(/\p{M}+/gu, "")
  .replace(/[‘’ʼʾ]/gu, "'")
  .toLocaleLowerCase("es-MX");
const pct = (n) => Number(((n / entries.length) * 100).toFixed(2));

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function duplicateGroups(items, keyFn, { skipEmpty = false } = {}) {
  return [...groupBy(items, keyFn).entries()]
    .filter(([key, group]) => (!skipEmpty || key) && group.length > 1)
    .map(([key, group]) => ({ key, count: group.length, entries: group }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, "es"));
}

const projectEntry = (entry) => ({
  record_id: entry.record_id,
  headword: entry.headword,
  headword_raw: entry.headword_raw,
  headword_normalized: entry.headword_normalized,
  homonym_number: entry.homonym_number ?? null,
  classification: entry.classification,
  classification_family: entry.classification_family,
  translation_raw: entry.translation_raw,
  page_start: entry.page_start,
  page_end: entry.page_end,
});

const classificationHintPattern = /(?:^|\b|\d+\.\s*)(vt|vi|vr|v|s|adj|adv|conj|prep|pron|interj|interr|pp|imper)(?:\s+(?:sing|pl|reg))?\b/giu;
function grammarHints(entry) {
  const text = [entry.translation_raw, ...(entry.senses ?? [])].filter(Boolean).join(" | ");
  const hints = new Set();
  for (const match of text.matchAll(classificationHintPattern)) hints.add(match[1].toLocaleLowerCase("es-MX"));
  return [...hints].sort();
}

const missingTranslation = entries.filter((entry) => !clean(entry.translation_raw));
const missingSenses = entries.filter((entry) => !Array.isArray(entry.senses) || entry.senses.length === 0);
const missingClassification = entries.filter((entry) => !clean(entry.classification));
const unclassified = entries.filter((entry) => !clean(entry.classification) || entry.classification_family === "Sin clasificar");
const unclassifiedWithHints = unclassified
  .map((entry) => ({ ...projectEntry(entry), hints: grammarHints(entry) }))
  .filter((entry) => entry.hints.length > 0);
const unclassifiedMixedHints = unclassifiedWithHints.filter((entry) => entry.hints.length > 1);

const exactContentDuplicateGroups = duplicateGroups(entries, (entry) => [
  compactSpace(entry.headword_raw),
  clean(entry.classification),
  compactSpace(entry.translation_raw),
  entry.page_start,
  entry.page_end,
  compactSpace(entry.comments_raw),
].join("|"));

const sourceSignatureGroups = duplicateGroups(entries, (entry) => `${entry.headword_normalized}|${entry.homonym_number ?? ""}|${entry.page_start}`);
const samePageUnnumberedGroups = duplicateGroups(
  entries.filter((entry) => entry.homonym_number == null),
  (entry) => `${entry.headword_normalized}|${entry.page_start}`,
);

const normalizedGroups = duplicateGroups(entries, (entry) => entry.headword_normalized, { skipEmpty: true });
const mixedHomonymNumberingGroups = normalizedGroups
  .filter(({ entries: group }) => group.some((entry) => entry.homonym_number == null) && group.some((entry) => entry.homonym_number != null));

const rawNumberPrefixMismatches = entries
  .map((entry) => {
    const match = clean(entry.headword_raw).match(/^(\d+)\s*(.+)$/u);
    if (!match) return null;
    const rawNumber = Number(match[1]);
    if (entry.homonym_number === rawNumber) return null;
    return { ...projectEntry(entry), raw_number_prefix: rawNumber };
  })
  .filter(Boolean);

const nonNfc = [];
const boundaryWhitespace = [];
const normalizedUppercase = [];
const normalizedCurlyApostrophe = [];
const normalizedRepeatedSpace = [];
for (const entry of entries) {
  for (const field of ["headword", "headword_raw", "headword_normalized", "classification", "translation_raw", "comments_raw"]) {
    const value = String(entry[field] ?? "");
    if (value !== value.normalize("NFC")) nonNfc.push({ record_id: entry.record_id, field, value });
    if (value !== value.trim()) boundaryWhitespace.push({ record_id: entry.record_id, field, value });
  }
  const normalized = String(entry.headword_normalized ?? "");
  if (normalized !== normalized.toLocaleLowerCase("es-MX")) normalizedUppercase.push(projectEntry(entry));
  if (/[‘’ʼʾ]/u.test(normalized)) normalizedCurlyApostrophe.push(projectEntry(entry));
  if (/\s{2,}/u.test(normalized)) normalizedRepeatedSpace.push(projectEntry(entry));
}

const numberedTranslationParsingCandidates = entries
  .filter((entry) => /^\s*1[.)]\s+/u.test(String(entry.translation_raw ?? "")) && (entry.senses?.length ?? 0) <= 1)
  .map(projectEntry);

const variantBuckets = {
  lexical_or_unspecified: [],
  explicit_variant_of: [],
  inflectional_tense: [],
  number_or_valency_note: [],
  other_grammatical_note: [],
};
for (const entry of entries) {
  for (const variant of entry.variants ?? []) {
    const text = compactSpace(variant);
    const row = { record_id: entry.record_id, headword: entry.headword, variant: text, page_start: entry.page_start };
    if (/\bvariante\s+de\b/iu.test(text)) variantBuckets.explicit_variant_of.push(row);
    else if (/\b(?:pret|fut|pres)\s*:/iu.test(text)) variantBuckets.inflectional_tense.push(row);
    else if (/\b(?:pl|sing|reg|trans|intr)\s*:/iu.test(text)) variantBuckets.number_or_valency_note.push(row);
    else if (/\b(?:part|ger|imper|impf|perf|pas)\s*:/iu.test(text)) variantBuckets.other_grammatical_note.push(row);
    else variantBuckets.lexical_or_unspecified.push(row);
  }
}

const pageCounts = new Map();
for (const entry of entries) {
  for (let page = entry.page_start; page <= entry.page_end; page += 1) pageCounts.set(page, (pageCounts.get(page) ?? 0) + 1);
}
const pageDensity = [...pageCounts.entries()]
  .map(([page, count]) => ({ page, count }))
  .sort((a, b) => b.count - a.count || a.page - b.page);

const classificationStrings = [...groupBy(entries, (entry) => clean(entry.classification) || "(vacía)").entries()]
  .map(([classification, group]) => ({ classification, count: group.length, family: group[0]?.classification_family ?? "" }))
  .sort((a, b) => b.count - a.count || a.classification.localeCompare(b.classification, "es"));

const sourceCodes = [...groupBy(entries, (entry) => entry.source_code).entries()]
  .map(([source_code, group]) => ({ source_code, count: group.length }));
const sourceDocuments = [...groupBy(entries, (entry) => entry.source_document).entries()]
  .map(([source_document, group]) => ({ source_document, count: group.length }));

const audit = {
  audit: "Rarámuri Digital: auditoría profunda del corpus lexicográfico",
  generated_at: new Date().toISOString(),
  dataset_version: metadata.dataset_version,
  release_date: metadata.release_date,
  entry_count: entries.length,
  baseline_quality_report: {
    generated: quality.generated,
    missing_classification: quality.completeness.missing_classification,
    missing_translation: quality.completeness.missing_translation,
    source_signature_collisions: quality.integrity.source_signature_collisions,
  },
  critical: {
    missing_translation_count: missingTranslation.length,
    missing_translation_entries: missingTranslation.map(projectEntry),
    entries_without_senses_count: missingSenses.length,
    entries_without_senses: missingSenses.map(projectEntry),
    exact_content_duplicate_group_count: exactContentDuplicateGroups.length,
    exact_content_duplicate_record_count: exactContentDuplicateGroups.reduce((sum, group) => sum + group.count, 0),
    exact_content_duplicate_groups: exactContentDuplicateGroups.map((group) => ({ ...group, entries: group.entries.map(projectEntry) })),
  },
  editorial: {
    missing_classification_count: missingClassification.length,
    missing_classification_percent: pct(missingClassification.length),
    unclassified_count: unclassified.length,
    unclassified_with_recoverable_grammar_hints_count: unclassifiedWithHints.length,
    unclassified_with_recoverable_grammar_hints: unclassifiedWithHints,
    unclassified_with_multiple_grammar_hints_count: unclassifiedMixedHints.length,
    unclassified_with_multiple_grammar_hints: unclassifiedMixedHints,
    source_signature_collision_group_count: sourceSignatureGroups.length,
    source_signature_collision_record_count: sourceSignatureGroups.reduce((sum, group) => sum + group.count, 0),
    source_signature_collision_groups: sourceSignatureGroups.map((group) => ({ ...group, entries: group.entries.map(projectEntry) })),
    same_page_unnumbered_collision_group_count: samePageUnnumberedGroups.length,
    same_page_unnumbered_collision_groups: samePageUnnumberedGroups.map((group) => ({ ...group, entries: group.entries.map(projectEntry) })),
    mixed_homonym_numbering_group_count: mixedHomonymNumberingGroups.length,
    mixed_homonym_numbering_groups: mixedHomonymNumberingGroups.map((group) => ({ ...group, entries: group.entries.map(projectEntry) })),
    raw_number_prefix_mismatch_count: rawNumberPrefixMismatches.length,
    raw_number_prefix_mismatches: rawNumberPrefixMismatches,
    numbered_translation_parsing_candidate_count: numberedTranslationParsingCandidates.length,
    numbered_translation_parsing_candidates: numberedTranslationParsingCandidates,
  },
  normalization: {
    non_nfc_count: nonNfc.length,
    non_nfc: nonNfc,
    boundary_whitespace_count: boundaryWhitespace.length,
    boundary_whitespace: boundaryWhitespace,
    normalized_uppercase_count: normalizedUppercase.length,
    normalized_uppercase: normalizedUppercase,
    normalized_curly_apostrophe_count: normalizedCurlyApostrophe.length,
    normalized_curly_apostrophe: normalizedCurlyApostrophe,
    normalized_repeated_space_count: normalizedRepeatedSpace.length,
    normalized_repeated_space: normalizedRepeatedSpace,
  },
  variants: {
    total_variant_tokens: Object.values(variantBuckets).reduce((sum, items) => sum + items.length, 0),
    bucket_counts: Object.fromEntries(Object.entries(variantBuckets).map(([key, items]) => [key, items.length])),
    buckets: variantBuckets,
    interpretation: "El campo variants mezcla variantes léxicas y, cuando aparecen etiquetas como pret./fut./pl., notas flexivas. La auditoría sólo clasifica por marcas explícitas; no reanaliza lingüísticamente las formas.",
  },
  distributions: {
    source_codes: sourceCodes,
    source_documents: sourceDocuments,
    classification_strings: classificationStrings,
    top_pages_by_entry_density: pageDensity.slice(0, 15),
    page_density: pageDensity,
  },
  priorities: [
    {
      priority: "P0",
      issue: "Entradas sin traducción o sin acepciones",
      count: new Set([...missingTranslation, ...missingSenses].map((entry) => entry.record_id)).size,
      action: "Cotejo directo con la fuente; no inferir traducción ni acepción.",
    },
    {
      priority: "P1",
      issue: "Posibles duplicados exactos y colisiones de firma",
      count: exactContentDuplicateGroups.length + sourceSignatureGroups.length,
      action: "Revisión editorial por grupo; conservar homógrafos legítimos y corregir sólo duplicación demostrada o numeración incompleta.",
    },
    {
      priority: "P1",
      issue: "Entradas sin clasificación con pistas gramaticales explícitas en la traducción",
      count: unclassifiedWithHints.length,
      action: "Recuperar únicamente la etiqueta que la fuente haga explícita; los casos con múltiples pistas requieren modelado multicategoría o decisión editorial.",
    },
    {
      priority: "P2",
      issue: "Sobrecarga semántica del campo variants",
      count: variantBuckets.inflectional_tense.length + variantBuckets.number_or_valency_note.length + variantBuckets.other_grammatical_note.length,
      action: "Evaluar separar variantes léxicas de formas flexivas/notas gramaticales sin alterar la evidencia documental.",
    },
    {
      priority: "P3",
      issue: "Cobertura de ejemplos",
      count: quality.completeness.entries_without_examples,
      action: "Tratar como cobertura documental, no como error automático: la fuente puede no ofrecer ejemplo para cada entrada.",
    },
  ],
  cautions: [
    "Los candidatos de clasificación se detectan por etiquetas explícitas en traducciones/acepciones; no son clasificaciones lingüísticas automáticas.",
    "Una colisión de lema normalizado no equivale a duplicado: puede corresponder a homógrafos, variantes documentales o segmentación legítima.",
    "La ausencia de ejemplo o variante no constituye por sí misma un defecto del registro.",
    "Ninguna corrección propuesta debe sobrescribir headword_raw, translation_raw o comments_raw sin preservar la forma documental.",
  ],
};

const mdTableRows = (rows) => rows.length
  ? rows.map((row) => `| ${row.priority} | ${row.issue} | ${row.count} | ${row.action} |`).join("\n")
  : "| — | — | 0 | — |";

const markdown = `# Auditoría profunda del corpus lexicográfico — ejecución automática\n\n**Fecha de ejecución:** ${audit.generated_at}  \n**Datos:** ${metadata.dataset_version} · **Entradas:** ${entries.length.toLocaleString("es-MX")}\n\n## Resumen\n\nEsta auditoría complementa \`QUALITY_REPORT.md\`. No valida lingüísticamente el corpus: busca problemas de integridad editorial, homonimia, normalización, completitud crítica y sobrecarga de campos.\n\n| Indicador | Resultado |\n|---|---:|\n| Entradas sin traducción | ${missingTranslation.length} |\n| Entradas sin acepciones | ${missingSenses.length} |\n| Entradas sin clasificación exacta | ${missingClassification.length} |\n| Sin clasificación con pista gramatical explícita | ${unclassifiedWithHints.length} |\n| De ellas, con múltiples pistas gramaticales | ${unclassifiedMixedHints.length} |\n| Grupos de colisión lema normalizado–homónimo–página | ${sourceSignatureGroups.length} |\n| Registros involucrados en esas colisiones | ${sourceSignatureGroups.reduce((sum, group) => sum + group.count, 0)} |\n| Grupos de posible duplicado de contenido | ${exactContentDuplicateGroups.length} |\n| Grupos sin numeración de homónimo en misma página | ${samePageUnnumberedGroups.length} |\n| Grupos con numeración de homónimo mixta | ${mixedHomonymNumberingGroups.length} |\n| Inconsistencias prefijo numérico vs. homónimo | ${rawNumberPrefixMismatches.length} |\n| Problemas Unicode NFC | ${nonNfc.length} |\n| Espacios de borde | ${boundaryWhitespace.length} |\n| Mayúsculas en clave normalizada | ${normalizedUppercase.length} |\n| Apóstrofo tipográfico en clave normalizada | ${normalizedCurlyApostrophe.length} |\n| Tokens totales en variants | ${audit.variants.total_variant_tokens} |\n| Tokens variants con marca flexiva/gramatical | ${audit.priorities.find((row) => row.issue.includes("Sobrecarga"))?.count ?? 0} |\n\n## Prioridades editoriales\n\n| Prioridad | Frente | Casos/grupos | Acción |\n|---|---|---:|---|\n${mdTableRows(audit.priorities)}\n\n## Observaciones metodológicas\n\n- Los ${unclassifiedWithHints.length} candidatos de clasificación contienen etiquetas explícitas detectables en la propia traducción o acepción; **no deben autocorregirse**.\n- Las ${sourceSignatureGroups.length} colisiones de firma requieren cotejo editorial y no eliminación automática.\n- El campo \`variants\` contiene ${audit.variants.total_variant_tokens} tokens; ${audit.priorities.find((row) => row.issue.includes("Sobrecarga"))?.count ?? 0} llevan marcas de tiempo, número, valencia u otra gramática y conviene evaluarlos como una clase distinta de las variantes léxicas.\n- Los resultados detallados, incluidos todos los \`record_id\`, están en \`corpus-audit.json\`.\n\n## Cautela\n\nEsta auditoría no sustituye cotejo con la fuente ni validación por personas hablantes/especialistas. Las ausencias de ejemplos y variantes se reportan como cobertura, no como errores.\n`;

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, "corpus-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(join(outputDir, "corpus-audit.md"), markdown, "utf8");

console.log("CORPUS_AUDIT_SUMMARY=" + JSON.stringify({
  entry_count: audit.entry_count,
  missing_translation: missingTranslation.length,
  missing_senses: missingSenses.length,
  missing_classification: missingClassification.length,
  unclassified_with_hints: unclassifiedWithHints.length,
  unclassified_mixed_hints: unclassifiedMixedHints.length,
  source_signature_collision_groups: sourceSignatureGroups.length,
  source_signature_collision_records: sourceSignatureGroups.reduce((sum, group) => sum + group.count, 0),
  exact_content_duplicate_groups: exactContentDuplicateGroups.length,
  same_page_unnumbered_collision_groups: samePageUnnumberedGroups.length,
  mixed_homonym_numbering_groups: mixedHomonymNumberingGroups.length,
  raw_number_prefix_mismatches: rawNumberPrefixMismatches.length,
  numbered_translation_parsing_candidates: numberedTranslationParsingCandidates.length,
  non_nfc: nonNfc.length,
  boundary_whitespace: boundaryWhitespace.length,
  normalized_uppercase: normalizedUppercase.length,
  normalized_curly_apostrophe: normalizedCurlyApostrophe.length,
  total_variant_tokens: audit.variants.total_variant_tokens,
  variant_inflectional_or_grammatical: audit.priorities.find((row) => row.issue.includes("Sobrecarga"))?.count ?? 0,
}));
