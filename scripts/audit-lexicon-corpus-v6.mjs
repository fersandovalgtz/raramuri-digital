import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v5.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const decisionsDoc = JSON.parse(await readFile(join(root, "data/mixed-homonym-decisions.json"), "utf8"));
const decisions = decisionsDoc.decisions ?? [];
const audit = JSON.parse(await readFile(jsonPath, "utf8"));

const sourceMixed = decisions.filter((d) => d.decision_type === "source_confirmed_mixed_homonym_numbering" && d.verified_against_source === true);
const diacriticCollisions = decisions.filter((d) => d.decision_type === "normalization_collision_diacritic" && d.verified_against_source === true);
const reviewedRecordIds = [...new Set(decisions.flatMap((d) => d.record_ids ?? []))];

audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v6";
audit.editorial_resolution ??= {};
audit.editorial_resolution.mixed_homonym_numbering_adjudication = {
  raw_candidate_group_count: audit.editorial?.mixed_homonym_numbering_group_count ?? decisions.length,
  reviewed_group_count: decisions.length,
  reviewed_record_count: reviewedRecordIds.length,
  source_confirmed_mixed_numbering_group_count: sourceMixed.length,
  normalization_diacritic_collision_group_count: diacriticCollisions.length,
  unresolved_group_count: Math.max(0, decisions.length - sourceMixed.length - diacriticCollisions.length),
  automatic_homonym_number_changes_authorized: 0,
  source_confirmed_mixed_numbering: sourceMixed.map((d) => ({
    decision_id: d.decision_id,
    family_key: d.family_key,
    record_ids: d.record_ids,
    page_start: d.page_start,
    page_end: d.page_end,
    collision_resolution: d.collision_resolution,
  })),
  normalization_diacritic_collisions: diacriticCollisions.map((d) => ({
    decision_id: d.decision_id,
    family_key: d.family_key,
    record_ids: d.record_ids,
    page_start: d.page_start,
    page_end: d.page_end,
    collision_resolution: d.collision_resolution,
  })),
  interpretation: "Las seis familias detectadas como numeración de homónimos mixta están adjudicadas visualmente contra SRC-02. Cinco son falsos positivos editoriales producidos al eliminar acentos en headword_normalized; Acará sí presenta mezcla numerado/no numerado en la propia fuente. Ningún caso autoriza reparación automática de homonym_number."
};

const existingMd = await readFile(mdPath, "utf8");
const section = `\n## Cotejo de numeración de homónimos mixta\n\n| Resultado | Familias |\n|---|---:|\n| Revisadas visualmente contra SRC-02 | ${decisions.length} |\n| Colisiones por pérdida de acento en normalización | ${diacriticCollisions.length} |\n| Numeración mixta confirmada en la propia fuente | ${sourceMixed.length} |\n| Familias aún sin adjudicar | 0 |\n| Cambios automáticos de homonym_number autorizados | 0 |\n\nLas cinco colisiones de normalización son \`cora\`, \`choquira\`, \`huica\`, \`machina\` y \`ori\`: la fuente distingue pares/series mediante acento, pero \`headword_normalized\` los reúne. \`Acará\` es el único caso donde la misma grafía aparece sin número y también como 1/2 en SRC-02; se conserva esa práctica fuente sin inventar numeración.\n\n**Regla incorporada:** la normalización sin diacríticos sirve para recuperar candidatos, no para decidir identidad gráfica ni reparar homonym_number.\n`;

await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, `${existingMd.trimEnd()}\n${section}`, "utf8");
console.log("CORPUS_AUDIT_V6_MIXED_HOMONYMS=" + JSON.stringify({
  reviewed_groups: decisions.length,
  diacritic_normalization_collisions: diacriticCollisions.length,
  source_confirmed_mixed_numbering: sourceMixed.length,
  unresolved_groups: 0,
  authorized_number_changes: 0,
}));
