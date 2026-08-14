import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-lexicon-corpus-v6.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const jsonPath = join(out, "corpus-audit.json");
const mdPath = join(out, "corpus-audit.md");
const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));
const audit = JSON.parse(await readFile(jsonPath, "utf8"));

const clean = (v) => String(v ?? "").trim().replace(/\s+/gu, " ");
const graphicKey = (v) => clean(v).normalize("NFC")
  .replace(/[‘’ʼʾ´]/gu, "'")
  .toLocaleLowerCase("es-MX");
const splitHeadword = (v) => clean(v).split(/\s*[,;]\s*/u).map(clean).filter(Boolean);
const isGrammaticalVariant = (v) => /\b(?:pret|fut|pres|impf|perf|pl|sing|reg|trans|intr|pp|part|ger|imper|pas|ad|adj|adv)\.?\s*:/iu.test(v);
const isExplicitVariantOf = (v) => /\bvariante\s+de\b/iu.test(v);

const rows = [];
const commaHeadwords = [];
const overlapEntries = [];
const overlapTokens = [];
const multiformWithoutOverlap = [];
const headwordEqualsVariant = [];

for (const e of entries) {
  const pieces = splitHeadword(e.headword);
  const variants = (e.variants ?? []).map(clean).filter(Boolean);
  if (pieces.length > 1) commaHeadwords.push(e.record_id);

  const primary = pieces[0] ?? clean(e.headword);
  const secondary = pieces.slice(1);
  const secondaryKeys = new Map(secondary.map((p) => [graphicKey(p), p]));
  const primaryKey = graphicKey(primary);
  const overlaps = [];

  for (const variant of variants) {
    if (isGrammaticalVariant(variant) || isExplicitVariantOf(variant)) continue;
    const key = graphicKey(variant);
    if (secondaryKeys.has(key)) {
      overlaps.push({ variant, headword_piece: secondaryKeys.get(key) });
      overlapTokens.push({ record_id: e.record_id, headword: e.headword, variant, page_start: e.page_start });
    }
    if (key === primaryKey) headwordEqualsVariant.push({ record_id: e.record_id, headword: e.headword, variant, page_start: e.page_start });
  }

  if (overlaps.length) {
    const row = {
      record_id: e.record_id,
      headword: e.headword,
      headword_raw: e.headword_raw,
      homonym_number: e.homonym_number ?? null,
      page_start: e.page_start,
      page_end: e.page_end,
      primary_headword_piece: primary,
      secondary_headword_pieces: secondary,
      variants,
      duplicated_variant_tokens: overlaps,
    };
    overlapEntries.push(row);
    rows.push(row);
  } else if (pieces.length > 1) {
    multiformWithoutOverlap.push({
      record_id: e.record_id,
      headword: e.headword,
      headword_raw: e.headword_raw,
      page_start: e.page_start,
      page_end: e.page_end,
      pieces,
      variants,
    });
  }
}

const exactGraphicOverlaps = overlapTokens.filter((x) => clean(x.variant) === clean(x.headword.split(/\s*[,;]\s*/u).find((p) => graphicKey(p) === graphicKey(x.variant))));

audit.audit = "Rarámuri Digital: auditoría profunda del corpus lexicográfico v7";
audit.editorial_resolution ??= {};
audit.editorial_resolution.headword_variant_overlap_audit = {
  rule: "Comparación gráfica conservadora: separar headword por coma/punto y coma; normalizar sólo espacio, NFC, mayúsculas/minúsculas y signos equivalentes de saltillo/apóstrofo. Se preservan diacríticos. Se excluyen tokens variants con marcas gramaticales/flexivas explícitas y referencias 'variante de'.",
  multiform_headword_entry_count: commaHeadwords.length,
  embedded_variant_overlap_entry_count: overlapEntries.length,
  embedded_variant_overlap_token_count: overlapTokens.length,
  exact_surface_overlap_token_count: exactGraphicOverlaps.length,
  primary_headword_equals_variant_token_count: headwordEqualsVariant.length,
  multiform_headword_without_embedded_variant_overlap_count: multiformWithoutOverlap.length,
  entries: overlapEntries,
  primary_headword_equals_variant_tokens: headwordEqualsVariant,
  multiform_without_overlap: multiformWithoutOverlap,
  interpretation: "Un solapamiento confirma redundancia estructural entre la cadena mostrada en headword y un token ya extraído en variants; no demuestra por sí solo que el segundo segmento deba borrarse. Cualquier canonicalización debe ser versionada y preservar headword_raw y la forma fuente."
};

const existingMd = await readFile(mdPath, "utf8");
const sample = overlapEntries.slice(0, 20).map((e) => `| \`${e.record_id}\` | ${e.headword.replace(/\|/gu, "\\|")} | ${e.duplicated_variant_tokens.map((x) => `\`${x.variant}\``).join(", ")} | ${e.page_start} |`).join("\n");
const section = `\n## Solapamiento entre headword y variants\n\nLa auditoría v7 separa por primera vez dos capas que el esquema 1.0.0 puede representar simultáneamente: una variante incluida dentro de la cadena \`headword\` y la misma variante ya extraída en \`variants\`. La detección conserva los diacríticos y excluye marcas flexivas/gramaticales.\n\n| Indicador | Casos |\n|---|---:|\n| Entradas con headword multiforme (coma/punto y coma) | ${commaHeadwords.length} |\n| Entradas con al menos una variante duplicada dentro de headword | ${overlapEntries.length} |\n| Tokens variants duplicados dentro de headword | ${overlapTokens.length} |\n| Coincidencias de superficie exacta | ${exactGraphicOverlaps.length} |\n| variants iguales al primer segmento del headword | ${headwordEqualsVariant.length} |\n| Headwords multiformes sin solapamiento detectado | ${multiformWithoutOverlap.length} |\n\n### Primeros casos\n\n| record_id | headword | token duplicado | pág. |\n|---|---|---|---:|\n${sample || "| — | — | — | — |"}\n\n**Dictamen de esta fase:** estos casos son redundancias de representación candidatas a migración de esquema/datos, no errores que deban corregirse borrando texto. \`headword_raw\` debe permanecer como evidencia documental; cualquier futuro \`headword_canonical\` deberá derivarse de una política general y reversible.\n`;

await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
await writeFile(mdPath, `${existingMd.trimEnd()}\n${section}`, "utf8");

console.log("CORPUS_AUDIT_V7_HEADWORD_VARIANT=" + JSON.stringify({
  multiform_headwords: commaHeadwords.length,
  overlap_entries: overlapEntries.length,
  overlap_tokens: overlapTokens.length,
  exact_surface_overlap_tokens: exactGraphicOverlaps.length,
  primary_equals_variant_tokens: headwordEqualsVariant.length,
  multiform_without_overlap: multiformWithoutOverlap.length,
  overlap_record_ids: overlapEntries.map((e) => e.record_id),
}));
