import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { deriveParallelPairs } from "../lib/parallel-corpus.ts";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "data/lexicon-master.json");
const jsonPath = resolve(projectRoot, "data/accented-words.json");
const csvPath = resolve(projectRoot, "data/accented-words.csv");
const reportPath = resolve(projectRoot, "data/accented-words-report.json");
const entries = JSON.parse(await readFile(sourcePath, "utf8"));
const entryById = new Map(entries.map((entry) => [entry.record_id, entry]));

const tokenPattern = /[’‘'ʼ´`\p{L}\p{M}]+/gu;
const accentedVowelPattern = /[áéíóú]/iu;

function standardize(value) {
  return value.replace(/[’‘'ʼ´`]/gu, "ʼ").normalize("NFC");
}

function normalizeSearch(value) {
  return standardize(value).normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es");
}

function hasAcute(value) {
  return [...standardize(value)].some((character) => accentedVowelPattern.test(character));
}

function accentData(value) {
  const characters = [...standardize(value).toLocaleLowerCase("es")];
  const accentIndexes = characters.map((character, index) => accentedVowelPattern.test(character) ? index : -1).filter((index) => index >= 0);
  const accentedVowels = accentIndexes.map((index) => characters[index]);
  const vowelIndexes = characters.map((character, index) => /[aeiouáéíóúü]/u.test(character) ? index : -1).filter((index) => index >= 0);
  const vowelOrdinalsFromStart = accentIndexes.map((index) => vowelIndexes.indexOf(index) + 1);
  const vowelOrdinalsFromEnd = accentIndexes.map((index) => vowelIndexes.length - vowelIndexes.indexOf(index));
  const position = accentIndexes.length > 1 ? "Múltiple" : accentIndexes[0] === 0 ? "Inicial" : accentIndexes[0] === characters.length - 1 ? "Final" : "Medial";
  return { accentIndexes, accentedVowels, vowelOrdinalsFromStart, vowelOrdinalsFromEnd, position };
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const records = [];

function addTokens(entry, field) {
  let tokenOrdinal = 0;
  for (const match of field.text.matchAll(tokenPattern)) {
    if (!hasAcute(match[0])) continue;
    tokenOrdinal += 1;
    const form = match[0];
    const normalized = standardize(form).toLocaleLowerCase("es");
    const accent = accentData(form);
    records.push({
      accent_id: "",
      form,
      normalized_form: normalized,
      base_form: normalizeSearch(form),
      accented_vowels: accent.accentedVowels,
      accent_count: accent.accentIndexes.length,
      accent_indexes: accent.accentIndexes,
      accent_position: accent.position,
      vowel_ordinals_from_start: accent.vowelOrdinalsFromStart,
      vowel_ordinals_from_end: accent.vowelOrdinalsFromEnd,
      source_field: field.source_field,
      field_index: field.field_index,
      token_ordinal: tokenOrdinal,
      context_index: match.index ?? 0,
      context: field.text,
      source_context: field.source_context || field.text,
      pair_id: field.pair_id || "",
      alignment_status: field.alignment_status || "No aplica",
      alignment_confidence: field.alignment_confidence || "No aplica",
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
      validation_status: "Pendiente de cotejo ortográfico y prosódico",
    });
  }
}

for (const entry of entries) {
  addTokens(entry, { source_field: "Lema", field_index: 1, text: entry.headword });
  for (const [index, rawVariant] of (entry.variants || []).entries()) {
    addTokens(entry, { source_field: "Variante", field_index: index + 1, text: rawVariant.replace(/^véase\s+/iu, "") });
  }
}

const sourceRows = entries.map((entry) => ({
  recordId: entry.record_id,
  headword: entry.headword,
  classification: entry.classification,
  classificationFamily: entry.classification_family,
  translationRaw: entry.translation_raw,
  examplesJson: JSON.stringify(entry.examples),
  sourceCode: entry.source_code,
  sourceDocument: entry.source_document,
  pageStart: entry.page_start,
  pageEnd: entry.page_end,
  status: entry.status,
}));

for (const pair of deriveParallelPairs(sourceRows)) {
  if (!pair.rrmText) continue;
  const entry = entryById.get(pair.entryId);
  if (!entry) continue;
  addTokens(entry, {
    source_field: "Ejemplo RRM",
    field_index: Number.parseInt(pair.pairId.slice(-2), 10),
    text: pair.rrmText,
    source_context: pair.sourceExample,
    pair_id: pair.pairId,
    alignment_status: pair.alignmentStatus,
    alignment_confidence: pair.confidence,
  });
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

records.sort((a, b) => a.base_form.localeCompare(b.base_form, "es") || a.normalized_form.localeCompare(b.normalized_form, "es") || a.entry_id.localeCompare(b.entry_id) || a.source_field.localeCompare(b.source_field, "es") || a.context_index - b.context_index);
records.forEach((record, index) => { record.accent_id = `ACE-${String(index + 1).padStart(6, "0")}`; });

const columns = ["accent_id", "form", "normalized_form", "base_form", "accented_vowels", "accent_count", "accent_indexes", "accent_position", "vowel_ordinals_from_start", "vowel_ordinals_from_end", "source_field", "field_index", "token_ordinal", "context_index", "context", "source_context", "pair_id", "alignment_status", "alignment_confidence", "entry_id", "headword", "classification", "classification_family", "translation", "document_frequency", "entry_frequency", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
const csv = "\ufeff" + [columns, ...records.map((record) => columns.map((column) => record[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
const vowels = ["á", "é", "í", "ó", "ú"];
const report = {
  records: records.length,
  unique_normalized_forms: new Set(records.map((record) => record.normalized_form)).size,
  source_entries: entries.length,
  entries_with_accented_forms: new Set(records.map((record) => record.entry_id)).size,
  occurrences_by_field: Object.fromEntries(["Lema", "Variante", "Ejemplo RRM"].map((field) => [field, records.filter((record) => record.source_field === field).length])),
  accented_vowels: Object.fromEntries(vowels.map((vowel) => [vowel, records.reduce((sum, record) => sum + record.accented_vowels.filter((item) => item === vowel).length, 0)])),
  occurrences_by_position: Object.fromEntries(["Inicial", "Medial", "Final", "Múltiple"].map((position) => [position, records.filter((record) => record.accent_position === position).length])),
  extraction_method: "Tokenización Unicode de lemas y variantes; extracción de segmentos rarámuri mediante P-03; detección de vocales con acento agudo y posición vocálica sin inferir sílabas",
  validation_status: "Pendiente de cotejo ortográfico y prosódico",
};

await Promise.all([
  writeFile(jsonPath, JSON.stringify(records, null, 2) + "\n"),
  writeFile(csvPath, csv),
  writeFile(reportPath, JSON.stringify(report, null, 2) + "\n"),
]);
console.log(JSON.stringify(report, null, 2));
