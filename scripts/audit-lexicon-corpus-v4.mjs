import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v3.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const decisionsPath = join(root, "data/editorial-decisions.json");

const audit = JSON.parse(await readFile(jsonPath, "utf8"));
const editorial = JSON.parse(await readFile(decisionsPath, "utf8"));
const decisions = editorial.decisions ?? [];
const verified = decisions.filter((decision) => decision.verified_against_source === true);
const sourceConfirmedBlank = verified.filter((decision) => decision.decision_type === "source_confirmed_blank_fields");
const sourceNotes = verified.filter((decision) => decision.decision_type === "source_note_misclassified_as_lexical_entry");
const resolvedIds = new Set(verified.map((decision) => decision.record_id));

const rawMissingTranslationEntries = audit.critical.missing_translation_entries ?? [];
const rawMissingSenseEntries = audit.critical.entries_without_senses ?? [];
const unresolvedMissingTranslation = rawMissingTranslationEntries.filter((entry) => !resolvedIds.has(entry.record_id));
const unresolvedMissingSenses = rawMissingSenseEntries.filter((entry) => !resolvedIds.has(entry.record_id));

audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v4";
audit.editorial_resolution = {
  decisions_schema_version: editorial.schema_version,
  decision_file: "data/editorial-decisions.json",
  verified_decision_count: verified.length,
  source_confirmed_blank_count: sourceConfirmedBlank.length,
  source_confirmed_blank_records: sourceConfirmedBlank.map((decision) => decision.record_id),
  source_note_misclassified_as_lexical_entry_count: sourceNotes.length,
  source_note_records: sourceNotes.map((decision) => decision.record_id),
  unresolved_missing_translation_count: unresolvedMissingTranslation.length,
  unresolved_missing_translation_records: unresolvedMissingTranslation.map((entry) => entry.record_id),
  unresolved_missing_senses_count: unresolvedMissingSenses.length,
  unresolved_missing_senses_records: unresolvedMissingSenses.map((entry) => entry.record_id),
  interpretation: "Los conteos brutos de campos vacíos se preservan. Los conteos no resueltos excluyen únicamente casos cotejados visualmente contra la fuente y registrados en la capa editorial no destructiva."
};

const oldP0 = audit.priorities.find((priority) => priority.priority === "P0");
if (oldP0) {
  oldP0.issue = "Entradas con campos críticos vacíos todavía no resueltas contra fuente";
  oldP0.count = new Set([
    ...unresolvedMissingTranslation.map((entry) => entry.record_id),
    ...unresolvedMissingSenses.map((entry) => entry.record_id),
  ]).size;
  oldP0.action = "Cotejar con fuente; no inferir. Los casos ya verificados se registran aparte como vacío documental o nota de fuente.";
}

const existingMd = await readFile(mdPath, "utf8");
const resolutionSection = `\n## Resolución documental P0\n\nLa auditoría v4 incorpora \`data/editorial-decisions.json\` como capa no destructiva de decisiones cotejadas contra fuente. Los conteos brutos siguen disponibles para reproducibilidad.\n\n| Estado verificado | Casos | Registros |\n|---|---:|---|\n| Vacío documental confirmado por fuente | ${sourceConfirmedBlank.length} | ${sourceConfirmedBlank.map((d) => `\`${d.record_id}\``).join(", ") || "—"} |\n| Nota de fuente modelada como lema | ${sourceNotes.length} | ${sourceNotes.map((d) => `\`${d.record_id}\``).join(", ") || "—"} |\n| Traducción vacía aún no resuelta | ${unresolvedMissingTranslation.length} | ${unresolvedMissingTranslation.map((e) => `\`${e.record_id}\``).join(", ") || "—"} |\n| Acepciones vacías aún no resueltas | ${unresolvedMissingSenses.length} | ${unresolvedMissingSenses.map((e) => `\`${e.record_id}\``).join(", ") || "—"} |\n\n\`RD-000120\` se conserva sin completar porque la propia fuente deja vacías Clasif y Traducción. \`RD-000860\` se conserva en datos 1.0.0 por estabilidad de release, pero queda marcado para migración versionada a una entidad de nota de fuente.\n`;

await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, `${existingMd.trimEnd()}\n${resolutionSection}`, "utf8");

console.log("CORPUS_AUDIT_V4_RESOLUTION=" + JSON.stringify({
  verified_decisions: verified.length,
  source_confirmed_blank: sourceConfirmedBlank.length,
  source_note_records: sourceNotes.length,
  unresolved_missing_translation: unresolvedMissingTranslation.length,
  unresolved_missing_senses: unresolvedMissingSenses.length,
}));
