import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

await import("./audit-variant-origin-v2.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const oi = process.argv.indexOf("--output");
const out = resolve(root, oi >= 0 ? process.argv[oi + 1] : ".tmp/corpus-audit");
const v2Path = join(out, "variant-origin-nature-audit-v2.json");
const v2 = JSON.parse(await readFile(v2Path, "utf8"));
const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));

const clean = (value) => String(value ?? "").replace(/\s+/gu, " ").trim();
const normalize = (value) => clean(value)
  .replace(/[’‘`´]/gu, "'")
  .toLocaleLowerCase("es-MX")
  .normalize("NFD")
  .replace(/\p{M}/gu, "")
  .normalize("NFC");

function remissionCandidates(text, field) {
  return [...String(text ?? "").matchAll(/\b[Vv](?:e|é)(?:a|á)se\s+([^.;\]]+)/gu)].map((match, index) => ({
    field,
    index,
    target: clean(match[1]),
    evidence: clean(match[0]),
  })).filter((candidate) => candidate.target);
}

const sourceRemissions = [];
for (const entry of entries) {
  const variantKeys = new Set((entry.variants ?? []).map((value) => normalize(value)));
  for (const candidate of [
    ...remissionCandidates(entry.translation_raw, "translation_raw"),
    ...remissionCandidates(entry.comments_raw, "comments_raw"),
  ]) {
    const canonicalVariant = `véase ${candidate.target}`;
    sourceRemissions.push({
      record_id: entry.record_id,
      headword: entry.headword,
      field: candidate.field,
      target: candidate.target,
      evidence: candidate.evidence,
      captured_in_current_variants: variantKeys.has(normalize(canonicalVariant)),
      page_start: entry.page_start,
      page_end: entry.page_end,
      source_document: entry.source_document,
    });
  }
}

const remissionsByField = Object.fromEntries([...new Set(sourceRemissions.map((row) => row.field))].sort().map((field) => [field, sourceRemissions.filter((row) => row.field === field).length]));
const capturedRemissions = sourceRemissions.filter((row) => row.captured_in_current_variants);
const missingRemissions = sourceRemissions.filter((row) => !row.captured_in_current_variants);
const missingByField = Object.fromEntries([...new Set(missingRemissions.map((row) => row.field))].sort().map((field) => [field, missingRemissions.filter((row) => row.field === field).length]));

const sourceVisualControls = [
  {
    record_id: "RD-000034",
    page: 4,
    evidence: "[pret.: a'huiri, fut.: a'huimea]",
    adjudication: "La página fuente confirma dos etiquetas explícitas, pret. y fut.; la coma funciona como separador entre grupos. El parser derivado actual las fusiona y debe corregirse en una migración controlada.",
  },
  {
    record_id: "RD-000726",
    page: 36,
    evidence: "[pret.: chirihuéari; chiruérama; pp.: chirihuéami]",
    adjudication: "La página fuente confirma que chiruérama aparece sin etiqueta. No se le asigna fut. ni otra función por inferencia.",
  },
  {
    record_id: "RD-000862",
    page: 42,
    evidence: "[ad.: huáami; pp.: huacami]",
    adjudication: "La página fuente confirma literalmente la etiqueta ad.; se conserva sin expandirla ni reinterpretarla.",
  },
  {
    record_id: "RD-000895",
    page: 43,
    evidence: "[gut.: huaniméa]",
    adjudication: "La página fuente confirma literalmente gut. El mapeo actual gut→fut es una normalización editorial y no debe presentarse como lectura documental sin una decisión explícita.",
  },
  {
    record_id: "RD-001023",
    page: 48,
    evidence: "[pret.: huirírari: fut.: huiriráma]",
    adjudication: "La página fuente confirma dos etiquetas explícitas, pret. y fut., pese al colon usado como separador interno. El parser derivado actual las fusiona.",
  },
];

const report = {
  ...v2,
  audit: "Rarámuri Digital: auditoría exhaustiva de procedencia y naturaleza de variants v3 — control de fuente",
  source_control: {
    source_document: "DICCIONARIO raramuri.pdf",
    source_total_pages: 87,
    visually_adjudicated_records: sourceVisualControls,
    explicit_variant_phrase_source_count: 6,
    explicit_variant_phrase_note: "La búsqueda literal de 'variante de' en la fuente devuelve seis ocurrencias; coincide con los seis tokens explicit_source_variant_reference de la auditoría.",
  },
  cross_reference_capture_audit_v3: {
    source_visible_remission_count_all_fields: sourceRemissions.length,
    source_visible_remissions_by_field: remissionsByField,
    captured_in_current_variants: capturedRemissions.length,
    missing_from_current_variants: missingRemissions.length,
    missing_by_field: missingByField,
    causes: [
      "La regex histórica aplicada a comments_raw no reconoce la grafía frecuente Véase con acento en la primera e.",
      "extract_variants no inspecciona translation_raw, donde también hay remisiones documentales.",
    ],
    records: sourceRemissions,
  },
  revised_policy: {
    source_layer: "Preservar exactamente etiquetas y puntuación de la fuente, incluidas ad. y gut.",
    derived_parser: "Puede reconocer etiquetas conocidas aun con separadores no canónicos, pero debe conservar la evidencia raw y documentar toda normalización.",
    remissions: "Modelar las remisiones como relaciones separadas, no como variantes lingüísticas. En una migración futura, escanear translation_raw y comments_raw con una regex que reconozca Véase/Vease.",
    dataset_1_0_0: "No reescribir silenciosamente el dataset publicado durante esta auditoría.",
  },
};

const n = v2.nature_counts;
const lines = [
  "# Auditoría exhaustiva de procedencia y naturaleza de `variants` — v3",
  "",
  "**Fecha:** 14 de agosto de 2026  ",
  "**Dataset:** 1.0.0  ",
  "**Fuente controlada:** `DICCIONARIO raramuri.pdf` (87 páginas)",
  "",
  "## Resultado cerrado",
  "",
  `Los **${v2.variant_tokens} tokens** almacenados en \`variants\` quedaron clasificados sin residuos: **${v2.unresolved_tokens} sin origen** y **${v2.multiple_matching_origin_tokens} con origen múltiple**. La composición es: ${n.co_headword_form} formas co-presentadas en el lema; ${n.grammatical_annotation_labeled} anotaciones gramaticales etiquetadas regulares; ${n.grammatical_annotation_malformed_punctuation} anotaciones gramaticales con separador interno no canónico; ${n.grammatical_relation_phrase} relaciones gramaticales expresadas en frase; ${n.explicit_source_variant_reference} referencias donde la fuente dice literalmente \`variante de ...\`; ${n.mixed_grammatical_annotation_unlabeled_segment} anotación mixta con un segmento no etiquetado; y ${n.cross_reference} remisiones actualmente capturadas.`,
  "",
  "## Control visual de la fuente",
  "",
  ...sourceVisualControls.map((item) => `- \`${item.record_id}\`, p. ${item.page}: \`${item.evidence}\`. ${item.adjudication}`),
  "",
  "La búsqueda literal en el PDF confirma exactamente **6** ocurrencias de `variante de`, en concordancia con la clasificación automática 6/6. Sus seis destinos resuelven a lemas existentes del corpus.",
  "",
  "## Remisiones: cobertura real",
  "",
  `Al ampliar el control desde \`comments_raw\` a **ambos campos textuales de la entrada**, la fuente contiene **${sourceRemissions.length} remisiones visibles**: ${remissionsByField.comments_raw ?? 0} en \`comments_raw\` y ${remissionsByField.translation_raw ?? 0} en \`translation_raw\`. Sólo **${capturedRemissions.length}** están hoy representadas en \`variants\`; faltan **${missingRemissions.length}**.`,
  "",
  `De las faltantes, **${missingByField.comments_raw ?? 0}** están en comentarios y se pierden por la regex que no reconoce \`Véase\` con acento en la primera e; **${missingByField.translation_raw ?? 0}** están en \`translation_raw\`, campo que \`extract_variants\` no inspecciona.`,
  "",
  "Por tanto, las remisiones deben salir conceptualmente de `variants`: son relaciones lexicográficas, no variantes lingüísticas. La migración futura debe capturarlas desde ambos campos, conservar el texto fuente y resolver el destino mediante `record_id` cuando sea posible.",
  "",
  "## Consecuencia para el producto de variantes gráficas",
  "",
  "Dos casos ya cotejados visualmente demuestran que el parser actual de anotaciones gramaticales no es suficientemente robusto ante separadores internos: `RD-000034` y `RD-001023`. Además, el código normaliza `gut` a `fut` aunque la fuente imprime `gut.`. Estos tres puntos quedan registrados como deuda técnica/documental; no se corrigen silenciosamente en datos 1.0.0.",
  "",
  "## Modelo recomendado",
  "",
  "Una futura estructura tipada debe separar `variant_origin`, `variant_nature`, `target_record_id`, `source_field`, `source_page`, `raw_evidence` y `validation_status`. `variants` puede mantenerse como vista compatible, pero ya no debe funcionar como contenedor semánticamente homogéneo.",
  "",
];

await writeFile(join(out, "variant-origin-nature-audit-v3.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(join(out, "variant-origin-nature-audit-v3.md"), `${lines.join("\n")}\n`, "utf8");

console.log("VARIANT_ORIGIN_NATURE_AUDIT_V3=" + JSON.stringify({
  variant_tokens: v2.variant_tokens,
  nature_counts: v2.nature_counts,
  explicit_source_variant_references: v2.explicit_source_variant_references.count,
  source_visible_remissions_all_fields: sourceRemissions.length,
  source_visible_remissions_by_field: remissionsByField,
  captured_remissions: capturedRemissions.length,
  missing_remissions: missingRemissions.length,
  missing_by_field: missingByField,
  source_visual_controls: sourceVisualControls.length,
}));
