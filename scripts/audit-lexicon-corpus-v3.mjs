import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v2.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const audit = JSON.parse(await readFile(jsonPath, "utf8"));

const all = Object.values(audit.variants.buckets).flat();
const buckets = { lexical_or_unspecified: [], explicit_variant_of: [], inflectional_tense: [], number_or_valency_note: [], other_grammatical_note: [] };
for (const row of all) {
  const text = row.variant;
  if (/\bvariante\s+de\b/iu.test(text)) buckets.explicit_variant_of.push(row);
  else if (/\b(?:pret|fut|pres|impf|perf)\.?\s*:/iu.test(text)) buckets.inflectional_tense.push(row);
  else if (/\b(?:pl|sing|reg|trans|intr)\.?\s*:/iu.test(text)) buckets.number_or_valency_note.push(row);
  else if (/\b(?:pp|part|ger|imper|pas|ad|adj|adv)\.?\s*:/iu.test(text)) buckets.other_grammatical_note.push(row);
  else buckets.lexical_or_unspecified.push(row);
}
const grammatical = buckets.inflectional_tense.length + buckets.number_or_valency_note.length + buckets.other_grammatical_note.length;
audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v3";
audit.variants.buckets = buckets;
audit.variants.bucket_counts = Object.fromEntries(Object.entries(buckets).map(([k, xs]) => [k, xs.length]));
audit.variants.total_variant_tokens = all.length;
audit.variants.explicit_grammatical_or_inflectional_token_count = grammatical;
audit.variants.interpretation = "Las abreviaturas con o sin punto antes de dos puntos (pret.:, fut.:, pl.:, pp.:, ad.:, etc.) se reconocen como marcas gramaticales/flexivas explícitas. No se interpreta automáticamente su valor lingüístico.";
const variantPriority = audit.priorities.find((p) => p.issue.includes("variants con marca"));
if (variantPriority) variantPriority.count = grammatical;

const e = audit.editorial;
const n = audit.normalization;
const summary = {
  entry_count: audit.entry_count,
  missing_translation: audit.critical.missing_translation_count,
  missing_senses: audit.critical.entries_without_senses_count,
  note_like_entry_candidates: audit.critical.note_like_entry_candidate_count,
  missing_classification: e.missing_classification_count,
  unclassified_with_explicit_hints: e.unclassified_with_explicit_grammar_hints_count,
  unclassified_with_multiple_explicit_hints: e.unclassified_with_multiple_explicit_grammar_hints_count,
  source_signature_collision_groups: e.source_signature_collision_group_count,
  source_signature_collision_records: e.source_signature_collision_record_count,
  same_raw_signature_collision_groups: e.same_raw_signature_collision_group_count,
  normalization_only_signature_collision_groups: e.normalization_only_signature_collision_group_count,
  other_raw_difference_signature_collision_groups: e.other_raw_difference_signature_collision_group_count,
  exact_content_duplicate_groups: audit.critical.exact_content_duplicate_group_count,
  mixed_homonym_numbering_groups: e.mixed_homonym_numbering_group_count,
  raw_number_prefix_mismatches: e.raw_number_prefix_mismatch_count,
  numbered_translation_parsing_candidates: e.numbered_translation_parsing_candidate_count,
  non_nfc: n.non_nfc_count,
  boundary_whitespace: n.boundary_whitespace_count,
  normalized_uppercase: n.normalized_uppercase_count,
  normalized_curly_apostrophe: n.normalized_curly_apostrophe_count,
  total_variant_tokens: all.length,
  variant_explicit_grammatical_or_inflectional: grammatical,
};
const rows = audit.priorities.map((p) => `| ${p.priority} | ${p.issue} | ${p.count} | ${p.action} |`).join("\n");
const md = `# Auditoría profunda del corpus lexicográfico — v3\n\n**Datos:** ${audit.dataset_version} · **Entradas:** ${audit.entry_count.toLocaleString("es-MX")}\n\nEsta auditoría complementa \`QUALITY_REPORT.md\` y no sustituye validación lingüística.\n\n## Resumen\n\n| Indicador | Resultado |\n|---|---:|\n| Sin traducción | ${summary.missing_translation} |\n| Sin acepciones | ${summary.missing_senses} |\n| Nota documental candidata como lema | ${summary.note_like_entry_candidates} |\n| Sin clasificación exacta | ${summary.missing_classification} |\n| Sin clasificación con etiqueta explícita recuperable | ${summary.unclassified_with_explicit_hints} |\n| De ellas, multicategoría explícita | ${summary.unclassified_with_multiple_explicit_hints} |\n| Colisiones de firma | ${summary.source_signature_collision_groups} |\n| Registros en colisiones | ${summary.source_signature_collision_records} |\n| Colisiones con misma forma fuente | ${summary.same_raw_signature_collision_groups} |\n| Colisiones sólo por normalización | ${summary.normalization_only_signature_collision_groups} |\n| Duplicados exactos de contenido | ${summary.exact_content_duplicate_groups} |\n| Numeración de homónimos mixta | ${summary.mixed_homonym_numbering_groups} |\n| Errores prefijo numérico/homónimo | ${summary.raw_number_prefix_mismatches} |\n| Problemas NFC | ${summary.non_nfc} |\n| Espacios de borde | ${summary.boundary_whitespace} |\n| Tokens en variants | ${summary.total_variant_tokens} |\n| variants con marca gramatical/flexiva explícita | ${summary.variant_explicit_grammatical_or_inflectional} |\n\n## Prioridades\n\n| Prioridad | Frente | Casos/grupos | Acción |\n|---|---|---:|---|\n${rows}\n\nLos detalles y todos los \`record_id\` están en \`corpus-audit.json\`.\n`;
await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, md, "utf8");
console.log("CORPUS_AUDIT_V3_SUMMARY=" + JSON.stringify(summary));
