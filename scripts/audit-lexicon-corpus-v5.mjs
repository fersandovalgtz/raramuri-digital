import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v4.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const decisions = JSON.parse(await readFile(join(root, "data/editorial-decisions.json"), "utf8")).decisions ?? [];
const audit = JSON.parse(await readFile(jsonPath, "utf8"));

const separateRows = decisions.filter((d) => d.verified_against_source === true && d.decision_type === "source_separate_rows_same_form");
const mergeCandidates = decisions.filter((d) => d.verified_against_source === true && d.decision_type === "same_explicit_homonym_split_rows");
const reviewedGroups = [...separateRows, ...mergeCandidates];
const reviewedRecordIds = [...new Set(reviewedGroups.flatMap((d) => d.record_ids ?? []))];

audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v5";
audit.editorial_resolution.same_raw_signature_adjudication = {
  reviewed_group_count: reviewedGroups.length,
  reviewed_record_count: reviewedRecordIds.length,
  source_verified_separate_row_group_count: separateRows.length,
  source_verified_separate_rows: separateRows.map((d) => ({
    decision_id: d.decision_id,
    headword_raw: d.headword_raw,
    record_ids: d.record_ids,
    page_start: d.page_start,
    collision_resolution: d.collision_resolution,
  })),
  versioned_merge_candidate_group_count: mergeCandidates.length,
  versioned_merge_candidates: mergeCandidates.map((d) => ({
    decision_id: d.decision_id,
    headword_raw: d.headword_raw,
    record_ids: d.record_ids,
    page_start: d.page_start,
    collision_resolution: d.collision_resolution,
  })),
  accidental_extraction_duplicate_group_count: 0,
  interpretation: "El cotejo visual de los diez grupos con idéntica forma fuente confirma nueve conjuntos de filas independientes y un caso (1ca) en que la propia fuente repite explícitamente el mismo número de homónimo 1 en dos filas. Ninguno es duplicado accidental de extracción."
};

const existingMd = await readFile(mdPath, "utf8");
const section = `\n## Cotejo P1 de colisiones con idéntica forma fuente\n\n| Resultado | Grupos |\n|---|---:|\n| Revisados visualmente contra SRC-02 | ${reviewedGroups.length} |\n| Filas fuente independientes: conservar separadas | ${separateRows.length} |\n| Candidatos a consolidación versionada por señal explícita de fuente | ${mergeCandidates.length} |\n| Duplicados accidentales de extracción demostrados | 0 |\n\nEl único candidato a consolidación es \`1ca\` (RD-000357 / RD-000358): SRC-02 imprime el número 1 ante ambas filas y después \`2ca\`. La versión 1.0.0 conserva ambos registros; una futura migración puede representarlos como un homónimo 1 con dos acepciones, manteniendo los identificadores heredados como procedencia. Los otros nueve grupos permanecen separados.\n`;

await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, `${existingMd.trimEnd()}\n${section}`, "utf8");
console.log("CORPUS_AUDIT_V5_SAME_FORM=" + JSON.stringify({
  reviewed_groups: reviewedGroups.length,
  retain_separate: separateRows.length,
  versioned_merge_candidates: mergeCandidates.length,
  accidental_extraction_duplicates: 0,
}));
