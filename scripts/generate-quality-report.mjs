import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const entries = JSON.parse(await readFile(join(root, "data/lexicon-master.json"), "utf8"));
const metadata = JSON.parse(await readFile(join(root, "project-metadata.json"), "utf8"));
const manifest = JSON.parse(await readFile(join(root, "public/downloads/manifest.json"), "utf8"));

const countMissing = (field) => entries.filter((entry) => {
  const value = entry[field];
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}).length;
const frequencies = (field) => Object.fromEntries(
  [...new Set(entries.map((entry) => entry[field]))]
    .sort((a, b) => String(a).localeCompare(String(b), "es"))
    .map((value) => [String(value), entries.filter((entry) => entry[field] === value).length]),
);
const duplicateValues = (values) => {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
};
const pages = [...new Set(entries.flatMap((entry) => {
  const result = [];
  for (let page = entry.page_start; page <= entry.page_end; page += 1) result.push(page);
  return result;
}))].sort((a, b) => a - b);

const duplicateIds = duplicateValues(entries.map((entry) => entry.record_id));
const invalidIds = entries.filter((entry) => !/^RD-\d{6}$/.test(entry.record_id)).map((entry) => entry.record_id);
const invalidPages = entries.filter((entry) => !Number.isInteger(entry.page_start) || !Number.isInteger(entry.page_end) || entry.page_start > entry.page_end).map((entry) => entry.record_id);
const sourceSignatureDuplicates = duplicateValues(entries.map((entry) => `${entry.headword_normalized}|${entry.homonym_number ?? ""}|${entry.page_start}`));

const report = {
  report: "Rarámuri Digital: informe de calidad de datos",
  generated: metadata.release_date,
  platform_version: metadata.platform_version,
  dataset_version: metadata.dataset_version,
  publication_status: metadata.publication_status,
  validation_status: metadata.validation_status,
  scope: {
    entries: entries.length,
    pages: pages.length,
    page_min: Math.min(...pages),
    page_max: Math.max(...pages),
    sources: [...new Set(entries.map((entry) => entry.source_code))],
    senses: entries.reduce((total, entry) => total + entry.senses.length, 0),
    examples: entries.reduce((total, entry) => total + entry.examples.length, 0),
    variants: entries.reduce((total, entry) => total + entry.variants.length, 0),
  },
  completeness: {
    missing_headword: countMissing("headword"),
    missing_classification: countMissing("classification"),
    missing_translation: countMissing("translation_raw"),
    entries_without_senses: countMissing("senses"),
    entries_without_examples: countMissing("examples"),
    entries_without_variants: countMissing("variants"),
    missing_source_code: countMissing("source_code"),
    missing_source_document: countMissing("source_document"),
  },
  integrity: {
    duplicate_record_ids: duplicateIds.length,
    invalid_record_ids: invalidIds.length,
    invalid_page_ranges: invalidPages.length,
    source_signature_collisions: sourceSignatureDuplicates.length,
    all_export_checksums_present: manifest.files.every((file) => /^[a-f0-9]{64}$/.test(file.sha256)),
    all_export_entry_counts_match: manifest.files.every((file) => file.entry_count === entries.length),
  },
  distributions: {
    classification_family: frequencies("classification_family"),
    transcription_status: frequencies("status"),
  },
  interpretation: {
    source_signature_collisions: "Posibles homógrafos o registros repetidos en una misma página; requieren revisión editorial, no eliminación automática.",
    linguistic_validation: "Las comprobaciones de este informe son estructurales y documentales. No equivalen a validación lingüística por personas hablantes o especialistas autorizados.",
  },
};

const percent = (value) => `${((value / entries.length) * 100).toFixed(2)} %`;
const markdown = `# Informe de calidad / Data Quality Report

**Rarámuri Digital — datos ${metadata.dataset_version}; plataforma ${metadata.platform_version}; ${metadata.release_date}.**

Informe generado automáticamente a partir de la base maestra y el manifiesto de publicación. Las pruebas son estructurales y documentales; no sustituyen la validación lingüística.

## Alcance

| Indicador | Resultado |
|---|---:|
| Entradas | ${report.scope.entries.toLocaleString("es-MX")} |
| Páginas cubiertas | ${report.scope.pages} (${report.scope.page_min}–${report.scope.page_max}) |
| Acepciones | ${report.scope.senses.toLocaleString("es-MX")} |
| Ejemplos | ${report.scope.examples.toLocaleString("es-MX")} |
| Variantes | ${report.scope.variants.toLocaleString("es-MX")} |

## Completitud

| Campo o estructura | Ausencias | Cobertura |
|---|---:|---:|
| Lema | ${report.completeness.missing_headword} | ${percent(entries.length - report.completeness.missing_headword)} |
| Clasificación exacta | ${report.completeness.missing_classification} | ${percent(entries.length - report.completeness.missing_classification)} |
| Traducción | ${report.completeness.missing_translation} | ${percent(entries.length - report.completeness.missing_translation)} |
| Acepciones estructuradas | ${report.completeness.entries_without_senses} | ${percent(entries.length - report.completeness.entries_without_senses)} |
| Al menos un ejemplo | ${report.completeness.entries_without_examples} | ${percent(entries.length - report.completeness.entries_without_examples)} |
| Al menos una variante | ${report.completeness.entries_without_variants} | ${percent(entries.length - report.completeness.entries_without_variants)} |
| Código de fuente | ${report.completeness.missing_source_code} | ${percent(entries.length - report.completeness.missing_source_code)} |
| Documento fuente | ${report.completeness.missing_source_document} | ${percent(entries.length - report.completeness.missing_source_document)} |

## Integridad

| Prueba | Resultado |
|---|---:|
| Identificadores duplicados | ${report.integrity.duplicate_record_ids} |
| Identificadores con formato inválido | ${report.integrity.invalid_record_ids} |
| Rangos de página inválidos | ${report.integrity.invalid_page_ranges} |
| Colisiones lema normalizado–homónimo–página | ${report.integrity.source_signature_collisions} |
| SHA-256 presentes | ${report.integrity.all_export_checksums_present ? "Sí" : "No"} |
| Conteos de exportación consistentes | ${report.integrity.all_export_entry_counts_match ? "Sí" : "No"} |

Las colisiones de firma son candidatas a revisión editorial: pueden representar homógrafos legítimos, segmentación duplicada o numeración de homónimos incompleta. No se eliminan automáticamente.

## Estado de validación

- Publicación: **${metadata.publication_status}**.
- Validación lingüística: **${metadata.validation_status}**.
- Alcance de este informe: estructura, completitud, integridad referencial, cobertura documental y consistencia de exportaciones.

## English summary

This automated report covers ${report.scope.entries.toLocaleString("en-US")} entries across ${report.scope.pages} source pages. It checks completeness, identifier uniqueness, page ranges, export counts and SHA-256 availability. These checks do not constitute linguistic validation. Current linguistic status: **${metadata.validation_status}**.
`;

await writeFile(join(root, "public/downloads/quality-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(join(root, "QUALITY_REPORT.md"), markdown, "utf8");
console.log(JSON.stringify(report, null, 2));
