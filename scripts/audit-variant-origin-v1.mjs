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
  .replace(/[’‘]/gu, "'")
  .toLocaleLowerCase("es-MX")
  .normalize("NFD")
  .replace(/\p{M}/gu, "")
  .normalize("NFC");

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

// Deliberately mirrors scripts/extract_lexicon.py, including its historical regex.
function crossReferenceCandidates(entry) {
  const comments = String(entry.comments_raw ?? "");
  return [...comments.matchAll(/\b[Vv]e(?:a|á)se\s+([^.;\]]+)/gu)].map((match, index) => ({
    origin: "cross_reference",
    value: `véase ${clean(match[1])}`,
    sequence: index,
    evidence: match[0],
  })).filter((candidate) => candidate.value !== "véase");
}

function bracketStructure(value) {
  const segments = clean(value).split(/\s*;\s*/u).filter(Boolean);
  const parsed = segments.map((segment) => {
    const match = /^([^:]+):\s*(.+)$/u.exec(segment);
    return match ? { segment, label: clean(match[1]).replace(/\.$/u, ""), value: clean(match[2]) } : { segment, label: "", value: "" };
  });
  const labeled = parsed.filter((segment) => segment.label);
  if (labeled.length === 0) return { structure: "unlabeled_bracket_annotation", labels: [], parsed };
  if (labeled.length === parsed.length) return { structure: "labeled_bracket_annotation", labels: labeled.map((segment) => segment.label), parsed };
  return { structure: "mixed_bracket_annotation", labels: labeled.map((segment) => segment.label), parsed };
}

const tokenRows = [];
const unresolved = [];
const labelCounts = new Map();
const labelExamples = new Map();

for (const entry of entries) {
  const candidates = [
    ...headwordSecondaryCandidates(entry),
    ...bracketCandidates(entry),
    ...crossReferenceCandidates(entry),
  ];
  const byKey = new Map();
  for (const candidate of candidates) {
    const k = normalize(candidate.value);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(candidate);
  }

  for (let index = 0; index < (entry.variants ?? []).length; index += 1) {
    const variant = clean(entry.variants[index]);
    const k = normalize(variant);
    const matches = byKey.get(k) ?? [];
    const first = matches[0] ?? null;
    const origins = [...new Set(matches.map((candidate) => candidate.origin))];
    let nature = "unresolved";
    let bracket = null;

    if (first?.origin === "headword_secondary") {
      nature = "secondary_headword_form";
    } else if (first?.origin === "cross_reference") {
      nature = "cross_reference";
    } else if (first?.origin === "bracket_annotation") {
      bracket = bracketStructure(first.value);
      nature = bracket.structure;
      for (const label of bracket.labels) {
        const normalizedLabel = normalize(label);
        labelCounts.set(normalizedLabel, (labelCounts.get(normalizedLabel) ?? 0) + 1);
        if (!labelExamples.has(normalizedLabel)) labelExamples.set(normalizedLabel, []);
        const examples = labelExamples.get(normalizedLabel);
        if (examples.length < 5) examples.push({ record_id: entry.record_id, variant, label });
      }
    }

    const row = {
      variant_token_id: `${entry.record_id}#${String(index + 1).padStart(2, "0")}`,
      record_id: entry.record_id,
      variant,
      variant_normalized: k,
      emission_origin: first?.origin ?? "unresolved",
      all_matching_origins: origins,
      multiple_matching_origins: origins.length > 1,
      nature,
      bracket_labels: bracket?.labels ?? [],
      bracket_segments: bracket?.parsed ?? [],
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
const uniqueNormalizedVariants = new Set(tokenRows.map((row) => row.variant_normalized)).size;

const flexionRelations = graphic.filter((row) => row.relation_type === "Flexión");
const crossReferenceRelations = graphic.filter((row) => row.relation_type === "Remisión");
const explicitHeadwordRelations = graphic.filter((row) => row.relation_type === "Gráfica" && row.derivation_method === "Explícita en el lema");

const labels = [...labelCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es")).map(([label, count]) => ({
  label,
  count,
  examples: labelExamples.get(label) ?? [],
}));

const report = {
  audit: "Rarámuri Digital: auditoría exhaustiva de procedencia de variants v1",
  date: "2026-08-14",
  dataset_version: "1.0.0",
  source_entries: entries.length,
  entries_with_variants: entriesWithVariants,
  variant_tokens: tokenRows.length,
  unique_normalized_variant_strings: uniqueNormalizedVariants,
  emission_origin_counts: originCounts,
  nature_counts: natureCounts,
  multiple_matching_origin_tokens: multipleOriginTokens.length,
  unresolved_tokens: unresolved.length,
  bracket_label_inventory: labels,
  graphic_product_controls: {
    explicit_headword_relations: explicitHeadwordRelations.length,
    flexion_relations: flexionRelations.length,
    cross_reference_relations: crossReferenceRelations.length,
  },
  interpretation_rules: {
    headword_secondary: "Forma posterior a la primera dentro de una celda de lema separada por coma. Es una forma documental co-presentada con el lema; no se infiere automáticamente sinonimia, equivalencia fonológica ni independencia léxica.",
    bracket_annotation: "Texto extraído literalmente de corchetes en comments_raw. Si contiene etiqueta:valor se clasifica por estructura, no automáticamente como flexión lingüística validada.",
    cross_reference: "Remisión capturada por la expresión regular histórica del extractor. El conteo refleja el comportamiento actual del pipeline, no todas las cadenas visibles 'Véase' de la fuente.",
    multiple_origin: "Un mismo valor normalizado puede estar sustentado por más de una posición documental. emission_origin conserva la precedencia efectiva del extractor: lema secundario, luego corchete, luego remisión.",
  },
  token_records: tokenRows,
};

const lines = [
  "# Auditoría exhaustiva de procedencia de `variants` — v1",
  "",
  "**Fecha:** 14 de agosto de 2026  ",
  "**Dataset:** 1.0.0  ",
  `**Entradas fuente:** ${entries.length}`,
  "",
  "## Resultado ejecutivo",
  "",
  `Se auditaron los **${tokenRows.length} tokens** almacenados en \`variants\`, distribuidos en **${entriesWithVariants} entradas**. La reconstrucción de procedencia reproduce el orden exacto de \`extract_variants\`: formas secundarias del lema, contenido entre corchetes y remisiones capturadas por la expresión regular histórica del extractor.`,
  "",
  "| Procedencia de emisión | Tokens |",
  "|---|---:|",
  ...Object.entries(originCounts).map(([name, count]) => `| \`${name}\` | ${count} |`),
  "",
  "| Naturaleza estructural | Tokens |",
  "|---|---:|",
  ...Object.entries(natureCounts).map(([name, count]) => `| \`${name}\` | ${count} |`),
  "",
  `Tokens con más de una procedencia documental coincidente: **${multipleOriginTokens.length}**. Tokens sin procedencia reconstruible: **${unresolved.length}**.`,
  "",
  "## Inventario de etiquetas en anotaciones entre corchetes",
  "",
  "Estas etiquetas se inventarían como estructura documental. Su presencia **no equivale por sí sola a una validación lingüística de flexión**.",
  "",
  "| Etiqueta normalizada | Ocurrencias |",
  "|---|---:|",
  ...labels.map((item) => `| \`${item.label || "(vacía)"}\` | ${item.count} |`),
  "",
  "## Controles contra productos derivados",
  "",
  `El producto \`data/graphic-variants.json\` contiene **${explicitHeadwordRelations.length}** relaciones gráficas explícitas derivadas del lema, **${flexionRelations.length}** relaciones etiquetadas como \`Flexión\` y **${crossReferenceRelations.length}** remisiones. Estos conteos se comparan con el inventario de procedencia, pero no se fuerzan a una igualdad 1:1: una sola anotación entre corchetes puede contener varias parejas etiqueta:valor y producir varias relaciones derivadas.`,
  "",
  "## Cautela editorial",
  "",
  "La auditoría clasifica **procedencia y estructura documental**, no identidad lingüística. Una forma secundaria del lema no se convierte automáticamente en variante fonológica; una anotación `pret.: ...` o `fut.: ...` no se valida automáticamente como análisis morfológico; una cadena entre corchetes sin etiqueta permanece como anotación no tipada hasta cotejo lingüístico.",
  "",
  "## Siguiente paso",
  "",
  "Revisar el inventario real de etiquetas y los casos `unlabeled_bracket_annotation`, para separar con criterios explícitos las anotaciones flexivas de variantes léxicas/gráficas y de notas que requieren validación humana. Después puede diseñarse una estructura futura `variant_origin`/`variant_nature` manteniendo `variants` como vista compatible.",
  "",
];

await writeFile(join(out, "variant-origin-audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(join(out, "variant-origin-audit.md"), `${lines.join("\n")}\n`, "utf8");

console.log("VARIANT_ORIGIN_AUDIT_V1=" + JSON.stringify({
  source_entries: entries.length,
  entries_with_variants: entriesWithVariants,
  variant_tokens: tokenRows.length,
  unique_normalized_variant_strings: uniqueNormalizedVariants,
  emission_origin_counts: originCounts,
  nature_counts: natureCounts,
  multiple_matching_origin_tokens: multipleOriginTokens.length,
  unresolved_tokens: unresolved.length,
  bracket_labels: labels.map(({ label, count }) => ({ label, count })),
}));
