import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v7.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const audit = JSON.parse(await readFile(jsonPath, "utf8"));
const graphic = JSON.parse(await readFile(join(root, "data/graphic-variants.json"), "utf8"));
const graphicReport = JSON.parse(await readFile(join(root, "data/graphic-variants-report.json"), "utf8"));

const clean = (v) => String(v ?? "").trim().replace(/\s+/gu, " ");
const key = (v) => clean(v).normalize("NFC").replace(/[‘’ʼʾ´]/gu, "'").toLocaleLowerCase("es-MX");

const hv = audit.editorial_resolution.headword_variant_overlap_audit;
const overlapSet = new Set(hv.entries.flatMap((entry) => entry.duplicated_variant_tokens.map((token) => `${entry.record_id}|${key(token.variant)}`)));
const explicitRelations = graphic.filter((r) => r.relation_type === "Gráfica" && r.derivation_method === "Explícita en el lema");
const explicitSet = new Set(explicitRelations.map((r) => `${r.entry_id}|${key(r.form_b)}`));
const overlapOnly = [...overlapSet].filter((x) => !explicitSet.has(x)).sort();
const graphicOnly = [...explicitSet].filter((x) => !overlapSet.has(x)).sort();
const exactBijection = overlapOnly.length === 0 && graphicOnly.length === 0 && overlapSet.size === explicitSet.size;

audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v8";
audit.editorial_resolution.headword_variant_dual_representation = {
  multiform_headword_entry_count: hv.multiform_headword_entry_count,
  secondary_headword_form_count: overlapSet.size,
  variants_overlap_token_count: hv.embedded_variant_overlap_token_count,
  graphic_variant_explicit_headword_relation_count: explicitRelations.length,
  graphic_variants_report_explicit_count: graphicReport.explicit_graphic_relations,
  exact_bijection_between_variant_tokens_and_explicit_headword_relations: exactBijection,
  overlap_tokens_without_graphic_relation: overlapOnly,
  graphic_relations_without_overlap_token: graphicOnly,
  data_model_interpretation: "La coincidencia no es evidencia duplicada independiente: el extractor maestro deriva variants de los segmentos secundarios del lema separados por coma, mientras el producto graphic-variants deriva relaciones explícitas de esos mismos segmentos. Deben conservarse ambas capas por sus funciones diferentes (presentación/procedencia y estructura/consulta), pero los consumidores analíticos deben contarlas como una sola evidencia documental.",
  recommended_policy: "No borrar segmentos de headword ni tokens variants en datos 1.0.0. Documentar la procedencia del token y evitar doble conteo. En una futura revisión de esquema, tipar variant_origin=headword_secondary|bracket_annotation|cross_reference sin perder las cadenas originales."
};

const existingMd = await readFile(mdPath, "utf8");
const section = `\n## Consistencia de la representación dual headword ↔ variants\n\nLa v8 cruza la auditoría de solapamiento con \`data/graphic-variants.json\`. Los ${hv.embedded_variant_overlap_token_count} tokens secundarios que aparecen tanto en \`headword\` como en \`variants\` corresponden ${exactBijection ? "exactamente" : "NO exactamente"} a las ${explicitRelations.length} relaciones gráficas con método \`Explícita en el lema\`.\n\n| Control | Resultado |\n|---|---:|\n| Entradas con lema multiforme | ${hv.multiform_headword_entry_count} |\n| Formas secundarias documentales | ${overlapSet.size} |\n| Tokens duplicados estructuralmente en variants | ${hv.embedded_variant_overlap_token_count} |\n| Relaciones gráficas explícitas derivadas del lema | ${explicitRelations.length} |\n| Biyectividad exacta entre ambas capas | ${exactBijection ? "sí" : "no"} |\n| Tokens sin relación gráfica correspondiente | ${overlapOnly.length} |\n| Relaciones gráficas sin token correspondiente | ${graphicOnly.length} |\n\nEste patrón es sistemático, no una colección de errores aislados. \`scripts/extract_lexicon.py\` extrae deliberadamente como \`variants\` los segmentos posteriores a la coma del lema, y \`scripts/extract-graphic-variants.mjs\` utiliza esos mismos segmentos de \`headword\` para construir relaciones gráficas explícitas. Por tanto, la política correcta es **preservar ambas representaciones y declarar que comparten la misma evidencia**, no borrar una de ellas.\n\nPara una futura versión de esquema conviene añadir procedencia tipada de variante (por ejemplo \`headword_secondary\`, \`bracket_annotation\`, \`cross_reference\`) y reservar \`variants\` como vista compatible mientras se mantenga 1.0.0.\n`;

await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, `${existingMd.trimEnd()}\n${section}`, "utf8");

console.log("CORPUS_AUDIT_V8_DUAL_VARIANT=" + JSON.stringify({
  multiform_headwords: hv.multiform_headword_entry_count,
  secondary_forms: overlapSet.size,
  variant_overlap_tokens: hv.embedded_variant_overlap_token_count,
  explicit_graphic_relations: explicitRelations.length,
  exact_bijection: exactBijection,
  overlap_only: overlapOnly.length,
  graphic_only: graphicOnly.length,
}));
