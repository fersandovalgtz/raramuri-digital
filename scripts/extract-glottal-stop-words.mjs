import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "data/lexicon-master.json");
const jsonPath = resolve(projectRoot, "data/glottal-stop-words.json");
const csvPath = resolve(projectRoot, "data/glottal-stop-words.csv");
const reportPath = resolve(projectRoot, "data/glottal-stop-words-report.json");
const entries = JSON.parse(await readFile(sourcePath, "utf8"));

const saltilloPattern = /[’‘'ʼ´`]/u;
const saltilloGlobalPattern = /[’‘'ʼ´`]/gu;
const tokenPattern = /[’‘'ʼ´`\p{L}\p{M}]+/gu;

function standardizeSaltillo(value) {
  return value.replace(saltilloGlobalPattern, "ʼ").normalize("NFC");
}

function normalizeSearch(value) {
  return standardizeSaltillo(value).normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es");
}

function positionFor(value) {
  const characters = [...standardizeSaltillo(value)];
  const indexes = characters.map((character, index) => character === "ʼ" ? index : -1).filter((index) => index >= 0);
  if (indexes.length > 1) return { position: "Múltiple", indexes };
  if (indexes[0] === 0) return { position: "Inicial", indexes };
  if (indexes[0] === characters.length - 1) return { position: "Final", indexes };
  return { position: "Medial", indexes };
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const records = [];
for (const entry of entries) {
  const fields = [
    { source_field: "Lema", field_index: 1, text: entry.headword },
    ...(entry.variants || []).map((text, index) => ({ source_field: "Variante", field_index: index + 1, text })),
    ...(entry.examples || []).map((text, index) => ({ source_field: "Ejemplo", field_index: index + 1, text })),
  ];
  for (const field of fields) {
    let tokenOrdinal = 0;
    for (const match of field.text.matchAll(tokenPattern)) {
      const form = match[0];
      if (!saltilloPattern.test(form) || !/\p{L}/u.test(form)) continue;
      tokenOrdinal += 1;
      const standardized = standardizeSaltillo(form);
      const { position, indexes } = positionFor(form);
      records.push({
        saltillo_id: "",
        form,
        normalized_form: standardized.toLocaleLowerCase("es"),
        search_form: normalizeSearch(form),
        saltillo_glyphs: [...form].filter((character) => saltilloPattern.test(character)),
        saltillo_count: indexes.length,
        position,
        saltillo_indexes: indexes,
        source_field: field.source_field,
        field_index: field.field_index,
        token_ordinal: tokenOrdinal,
        context_index: match.index ?? 0,
        context: field.text,
        entry_id: entry.record_id,
        headword: entry.headword,
        classification: entry.classification,
        classification_family: entry.classification_family,
        translation: entry.translation_raw,
        document_frequency: 0,
        entry_frequency: 0,
        source_code: entry.source_code,
        source_document: entry.source_document,
        page_start: entry.page_start,
        page_end: entry.page_end,
        source_status: entry.status,
        validation_status: "Pendiente de cotejo ortográfico y fonológico",
      });
    }
  }
}

const occurrencesByForm = new Map();
const entriesByForm = new Map();
for (const record of records) {
  occurrencesByForm.set(record.normalized_form, (occurrencesByForm.get(record.normalized_form) || 0) + 1);
  const entrySet = entriesByForm.get(record.normalized_form) || new Set();
  entrySet.add(record.entry_id);
  entriesByForm.set(record.normalized_form, entrySet);
}
for (const record of records) {
  record.document_frequency = occurrencesByForm.get(record.normalized_form);
  record.entry_frequency = entriesByForm.get(record.normalized_form).size;
}

records.sort((a, b) => a.search_form.localeCompare(b.search_form, "es") || a.entry_id.localeCompare(b.entry_id) || a.source_field.localeCompare(b.source_field, "es") || a.context_index - b.context_index);
records.forEach((record, index) => { record.saltillo_id = `SAL-${String(index + 1).padStart(6, "0")}`; });

const columns = ["saltillo_id", "form", "normalized_form", "search_form", "saltillo_glyphs", "saltillo_count", "position", "saltillo_indexes", "source_field", "field_index", "token_ordinal", "context_index", "context", "entry_id", "headword", "classification", "classification_family", "translation", "document_frequency", "entry_frequency", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
const csv = "\ufeff" + [columns, ...records.map((record) => columns.map((column) => record[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
const glyphCounts = {};
for (const record of records) for (const glyph of record.saltillo_glyphs) glyphCounts[glyph] = (glyphCounts[glyph] || 0) + 1;
const report = {
  records: records.length,
  unique_normalized_forms: new Set(records.map((record) => record.normalized_form)).size,
  source_entries: entries.length,
  entries_with_saltillo: new Set(records.map((record) => record.entry_id)).size,
  occurrences_by_field: Object.fromEntries(["Lema", "Variante", "Ejemplo"].map((field) => [field, records.filter((record) => record.source_field === field).length])),
  occurrences_by_position: Object.fromEntries(["Inicial", "Medial", "Final", "Múltiple"].map((position) => [position, records.filter((record) => record.position === position).length])),
  source_glyphs: glyphCounts,
  extraction_method: "Tokenización Unicode de lemas, variantes y ejemplos; detección de representaciones documentales del saltillo; normalización conservadora a U+02BC",
  validation_status: "Pendiente de cotejo ortográfico y fonológico",
};

await Promise.all([
  writeFile(jsonPath, JSON.stringify(records, null, 2) + "\n"),
  writeFile(csvPath, csv),
  writeFile(reportPath, JSON.stringify(report, null, 2) + "\n"),
]);
console.log(JSON.stringify(report, null, 2));
