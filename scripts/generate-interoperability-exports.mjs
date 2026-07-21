import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, "public", "downloads");
const sourcePath = join(projectRoot, "data", "lexicon-master.json");
const generatedAt = "2026-07-21";
const datasetVersion = "1.0.0";
const siteVersion = "3.1";
const publicationStatus = "Autorizada para difusión";
const validationStatus = "Pendiente de validación lingüística";
const license = "CC BY-NC-SA 4.0";
const licenseUrl = "https://creativecommons.org/licenses/by-nc-sa/4.0/";

const entries = JSON.parse(await readFile(sourcePath, "utf8"));
await mkdir(outputDir, { recursive: true });

function xml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sql(value) {
  return value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
}

function csv(value) {
  const text = value == null ? "" : String(value).replaceAll(/\r?\n/g, " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function pageLabel(entry) {
  return entry.page_start === entry.page_end
    ? String(entry.page_start)
    : `${entry.page_start}-${entry.page_end}`;
}

function publicEntry(entry) {
  return {
    record_id: entry.record_id,
    headword: entry.headword,
    headword_raw: entry.headword_raw,
    headword_normalized: entry.headword_normalized,
    homonym_number: entry.homonym_number,
    classification: entry.classification,
    classification_family: entry.classification_family,
    translation_raw: entry.translation_raw,
    senses: entry.senses,
    examples: entry.examples,
    variants: entry.variants,
    comments_raw: entry.comments_raw,
    provenance: {
      source_code: entry.source_code,
      source_document: entry.source_document,
      page_start: entry.page_start,
      page_end: entry.page_end,
      transcription_status: entry.status,
    },
    publication_status: publicationStatus,
    validation_status: validationStatus,
  };
}

const genericXmlEntries = entries.map((entry) => `    <entry xml:id="${xml(entry.record_id)}" publicationStatus="authorized">
      <form type="lemma">
        <orth xml:lang="tar">${xml(entry.headword)}</orth>
        <orth type="source" xml:lang="tar">${xml(entry.headword_raw)}</orth>
        <orth type="normalized" xml:lang="tar">${xml(entry.headword_normalized)}</orth>
      </form>
      ${entry.homonym_number == null ? "" : `<homonymNumber>${entry.homonym_number}</homonymNumber>`}
      <gramGrp>
        <pos code="${xml(entry.classification_family)}">${xml(entry.classification)}</pos>
      </gramGrp>
      <translation xml:lang="es">${xml(entry.translation_raw)}</translation>
      <senses count="${entry.senses.length}">
${entry.senses.map((sense, index) => `        <sense n="${index + 1}" xml:lang="es">${xml(sense)}</sense>`).join("\n")}
      </senses>
      <examples count="${entry.examples.length}">
${entry.examples.map((example, index) => `        <example n="${index + 1}">${xml(example)}</example>`).join("\n")}
      </examples>
      <variants count="${entry.variants.length}">
${entry.variants.map((variant, index) => `        <variant n="${index + 1}">${xml(variant)}</variant>`).join("\n")}
      </variants>
      <note type="sourceComments">${xml(entry.comments_raw)}</note>
      <provenance sourceCode="${xml(entry.source_code)}" pageStart="${entry.page_start}" pageEnd="${entry.page_end}" transcriptionStatus="${xml(entry.status)}">
        <sourceDocument>${xml(entry.source_document)}</sourceDocument>
      </provenance>
      <validation publicationStatus="${xml(publicationStatus)}" linguisticStatus="${xml(validationStatus)}"/>
    </entry>`).join("\n");

const genericXml = `<?xml version="1.0" encoding="UTF-8"?>
<lexicon xmlns="https://raramuri.ceees.mx/ns/lexicon/1.0" xml:lang="tar" version="${datasetVersion}">
  <metadata>
    <title>Rarámuri Digital: base lexicográfica maestra</title>
    <publisher>Universidad CEEES; Universidad Autónoma de Ciudad Juárez; Cuerpo Académico UACJ-113</publisher>
    <responsible>Fernando Sandoval Gutiérrez</responsible>
    <contact>fernando.sandoval@uacj.mx</contact>
    <languages><objectLanguage code="tar">rarámuri</objectLanguage><targetLanguage code="es">español</targetLanguage></languages>
    <entryCount>${entries.length}</entryCount>
    <generated>${generatedAt}</generated>
    <license uri="${licenseUrl}">${license}</license>
    <publicationStatus>${publicationStatus}</publicationStatus>
    <validationStatus>${validationStatus}</validationStatus>
  </metadata>
  <entries count="${entries.length}">
${genericXmlEntries}
  </entries>
</lexicon>
`;

const jsonExport = {
  schema: "https://raramuri.ceees.mx/ns/lexicon/1.0",
  dataset: "Rarámuri Digital: base lexicográfica maestra",
  dataset_version: datasetVersion,
  site_version: siteVersion,
  generated: generatedAt,
  languages: { object: { code: "tar", label: "rarámuri" }, target: { code: "es", label: "español" } },
  publisher: ["Universidad CEEES", "Universidad Autónoma de Ciudad Juárez", "Cuerpo Académico UACJ-113"],
  responsible: { name: "Fernando Sandoval Gutiérrez", email: "fernando.sandoval@uacj.mx" },
  license: { id: license, url: licenseUrl },
  publication_status: publicationStatus,
  validation_status: validationStatus,
  entry_count: entries.length,
  entries: entries.map(publicEntry),
};

const csvHeader = [
  "record_id", "headword", "headword_raw", "headword_normalized", "homonym_number",
  "classification", "classification_family", "translation_raw", "sense_count", "senses_json",
  "example_count", "examples_json", "variant_count", "variants_json", "comments_raw", "source_code",
  "source_document", "page_start", "page_end", "transcription_status", "publication_status", "validation_status",
];
const csvRows = entries.map((entry) => [
  entry.record_id, entry.headword, entry.headword_raw, entry.headword_normalized, entry.homonym_number,
  entry.classification, entry.classification_family, entry.translation_raw, entry.senses.length, JSON.stringify(entry.senses),
  entry.examples.length, JSON.stringify(entry.examples), entry.variants.length, JSON.stringify(entry.variants), entry.comments_raw,
  entry.source_code, entry.source_document, entry.page_start, entry.page_end, entry.status, publicationStatus, validationStatus,
]);
const csvExport = `\ufeff${[csvHeader, ...csvRows].map((row) => row.map(csv).join(",")).join("\r\n")}\r\n`;

const sqlLines = [
  "-- Rarámuri Digital: base SQL consultable",
  `-- Versión de datos: ${datasetVersion}; generado: ${generatedAt}; entradas: ${entries.length}`,
  "-- Motor objetivo: SQLite 3; codificación: UTF-8",
  `-- Estado de publicación: ${publicationStatus}`,
  `-- Estado lingüístico: ${validationStatus}`,
  "PRAGMA foreign_keys = ON;",
  "BEGIN TRANSACTION;",
  "CREATE TABLE sources (source_code TEXT PRIMARY KEY, source_document TEXT NOT NULL);",
  "CREATE TABLE lexical_entries (record_id TEXT PRIMARY KEY, headword TEXT NOT NULL, headword_raw TEXT NOT NULL, headword_normalized TEXT NOT NULL, homonym_number INTEGER, classification TEXT NOT NULL, classification_family TEXT NOT NULL, translation_raw TEXT NOT NULL, comments_raw TEXT NOT NULL, source_code TEXT NOT NULL REFERENCES sources(source_code), page_start INTEGER NOT NULL, page_end INTEGER NOT NULL, transcription_status TEXT NOT NULL, publication_status TEXT NOT NULL CHECK (publication_status = 'Autorizada para difusión'), validation_status TEXT NOT NULL);",
  "CREATE TABLE senses (sense_id TEXT PRIMARY KEY, entry_id TEXT NOT NULL REFERENCES lexical_entries(record_id) ON DELETE CASCADE, sense_order INTEGER NOT NULL, definition_es TEXT NOT NULL, UNIQUE(entry_id, sense_order));",
  "CREATE TABLE examples (example_id TEXT PRIMARY KEY, entry_id TEXT NOT NULL REFERENCES lexical_entries(record_id) ON DELETE CASCADE, example_order INTEGER NOT NULL, example_text TEXT NOT NULL, UNIQUE(entry_id, example_order));",
  "CREATE TABLE variants (variant_id TEXT PRIMARY KEY, entry_id TEXT NOT NULL REFERENCES lexical_entries(record_id) ON DELETE CASCADE, variant_order INTEGER NOT NULL, variant_text TEXT NOT NULL, UNIQUE(entry_id, variant_order));",
  `INSERT INTO sources VALUES ('SRC-02', 'DICCIONARIO raramuri.pdf');`,
];

for (const entry of entries) {
  sqlLines.push(`INSERT INTO lexical_entries VALUES (${[
    entry.record_id, entry.headword, entry.headword_raw, entry.headword_normalized, entry.homonym_number,
    entry.classification, entry.classification_family, entry.translation_raw, entry.comments_raw, entry.source_code,
    entry.page_start, entry.page_end, entry.status, publicationStatus, validationStatus,
  ].map(sql).join(", ")});`);
  entry.senses.forEach((sense, index) => sqlLines.push(`INSERT INTO senses VALUES (${sql(`${entry.record_id}-S${String(index + 1).padStart(2, "0")}`)}, ${sql(entry.record_id)}, ${index + 1}, ${sql(sense)});`));
  entry.examples.forEach((example, index) => sqlLines.push(`INSERT INTO examples VALUES (${sql(`${entry.record_id}-E${String(index + 1).padStart(2, "0")}`)}, ${sql(entry.record_id)}, ${index + 1}, ${sql(example)});`));
  entry.variants.forEach((variant, index) => sqlLines.push(`INSERT INTO variants VALUES (${sql(`${entry.record_id}-V${String(index + 1).padStart(2, "0")}`)}, ${sql(entry.record_id)}, ${index + 1}, ${sql(variant)});`));
}
sqlLines.push(
  "CREATE INDEX idx_entries_headword_normalized ON lexical_entries(headword_normalized);",
  "CREATE INDEX idx_entries_classification ON lexical_entries(classification_family);",
  "CREATE INDEX idx_entries_translation ON lexical_entries(translation_raw);",
  "CREATE INDEX idx_entries_source_page ON lexical_entries(source_code, page_start);",
  "CREATE VIEW authorized_entries AS SELECT * FROM lexical_entries WHERE publication_status = 'Autorizada para difusión';",
  "COMMIT;",
  "-- Ejemplos:",
  "-- SELECT record_id, headword, translation_raw FROM authorized_entries WHERE headword_normalized LIKE 'a%' ORDER BY headword_normalized;",
  "-- SELECT e.record_id, e.headword, s.definition_es FROM lexical_entries e JOIN senses s ON s.entry_id = e.record_id WHERE e.classification_family = 'Vt';",
  "",
);
const sqlExport = sqlLines.join("\n");

const teiEntries = entries.map((entry) => {
  const variantForms = entry.variants.map((variant) => `      <form type="variant"><orth xml:lang="tar">${xml(variant)}</orth></form>`).join("\n");
  const senses = entry.senses.map((sense, senseIndex) => {
    const examples = senseIndex === 0
      ? entry.examples.map((example) => `        <cit type="example"><quote>${xml(example)}</quote></cit>`).join("\n")
      : "";
    return `      <sense xml:id="${entry.record_id}.sense.${senseIndex + 1}" n="${senseIndex + 1}">
        <cit type="translationEquivalent" xml:lang="es"><quote>${xml(sense)}</quote></cit>
${examples}
      </sense>`;
  }).join("\n");
  return `    <entry xml:id="${entry.record_id}" xml:lang="tar" type="mainEntry">
      <form type="lemma"><orth>${xml(entry.headword)}</orth></form>
${variantForms ? `${variantForms}\n` : ""}      <gramGrp><gram type="pos" norm="${xml(entry.classification_family)}">${xml(entry.classification)}</gram></gramGrp>
${senses}
      <note type="sourceComment">${xml(entry.comments_raw)}</note>
      <note type="provenance"><ref type="source" target="#${xml(entry.source_code)}">${xml(entry.source_document)}, p. ${pageLabel(entry)}</ref></note>
      <note type="publicationStatus">${xml(publicationStatus)}</note>
      <note type="validationStatus">${xml(validationStatus)}</note>
    </entry>`;
}).join("\n");

const teiExport = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="https://raw.githubusercontent.com/DARIAH-ERIC/lexicalresources/master/Schemas/TEILex0/out/TEILex0.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" type="lex-0" version="4.9.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Rarámuri Digital: edición lexicográfica TEI Lex-0</title>
        <principal>Fernando Sandoval Gutiérrez</principal>
        <respStmt><resp>Coordinación académica y técnica</resp><name>Fernando Sandoval Gutiérrez</name></respStmt>
      </titleStmt>
      <editionStmt><edition n="${datasetVersion}">Edición digital completa</edition></editionStmt>
      <extent>${entries.length} entradas lexicográficas</extent>
      <publicationStmt>
        <publisher>Universidad CEEES; Universidad Autónoma de Ciudad Juárez; Cuerpo Académico UACJ-113</publisher>
        <authority role="rightsHolder">Rarámuri Digital</authority>
        <date when="${generatedAt}">${generatedAt}</date>
        <availability><licence target="${licenseUrl}">${license}</licence></availability>
      </publicationStmt>
      <sourceDesc>
        <listBibl type="dictionaries">
          <biblStruct xml:id="SRC-02"><monogr><title>DICCIONARIO raramuri</title><imprint><publisher>Fuente digital del proyecto</publisher></imprint><extent>87 páginas</extent></monogr></biblStruct>
          <biblStruct xml:id="SRC-01"><monogr><author>K. Simón Hilton</author><title>Diccionario tarahumara de Samachique</title><imprint><date when="1993">1993</date></imprint><extent>156 páginas</extent></monogr></biblStruct>
        </listBibl>
      </sourceDesc>
    </fileDesc>
    <encodingDesc>
      <projectDesc><p>Edición digital derivada de la base lexicográfica maestra de Rarámuri Digital. Se preservan lema, clasificación, traducciones, acepciones, ejemplos, variantes y procedencia documental.</p></projectDesc>
      <editorialDecl><p>La difusión está autorizada; el cotejo con facsímil y la validación lingüística permanecen pendientes.</p></editorialDecl>
    </encodingDesc>
    <profileDesc>
      <langUsage>
        <language ident="tar" role="objectLanguage">rarámuri</language>
        <language ident="es" role="targetLanguage">español</language>
        <language ident="es" role="workingLanguage">español</language>
      </langUsage>
    </profileDesc>
    <revisionDesc><change when="${generatedAt}">Generación integral a partir de ${entries.length} registros de la base maestra.</change></revisionDesc>
  </teiHeader>
  <text><body>
${teiEntries}
  </body></text>
</TEI>
`;

const openApiExport = {
  openapi: "3.1.0",
  info: {
    title: "API lexicográfica de Rarámuri Digital",
    version: datasetVersion,
    description: `Consulta pública de ${entries.length} entradas autorizadas para difusión. La validación lingüística está pendiente.`,
    contact: { name: "Fernando Sandoval Gutiérrez", email: "fernando.sandoval@uacj.mx" },
    license: { name: license, identifier: "CC-BY-NC-SA-4.0", url: licenseUrl },
  },
  servers: [{ url: "https://raramuri.ceees.mx", description: "Producción" }],
  paths: {
    "/api/lexicon": {
      get: {
        summary: "Consultar entradas autorizadas",
        operationId: "listAuthorizedLexicalEntries",
        parameters: [
          { name: "id", in: "query", description: "Identificador exacto, por ejemplo RD-000001", schema: { type: "string", pattern: "^RD-[0-9]{6}$" } },
          { name: "q", in: "query", description: "Búsqueda en lema, traducción, clasificación y comentarios", schema: { type: "string", maxLength: 160 } },
          { name: "pos", in: "query", description: "Familia de clasificación gramatical", schema: { type: "string", maxLength: 40 } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 200, default: 50 } },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" } },
        ],
        responses: {
          "200": {
            description: "Entradas autorizadas y metadatos de paginación",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/LexiconResponse" } },
              "text/csv": { schema: { type: "string" } },
            },
          },
          "500": { description: "Error interno" },
        },
      },
    },
    "/api/openapi": {
      get: { summary: "Descargar la especificación OpenAPI", responses: { "200": { description: "Documento OpenAPI 3.1" } } },
    },
  },
  components: {
    schemas: {
      LexicalEntry: {
        type: "object",
        required: ["recordId", "headword", "translationRaw", "publicationStatus", "validationStatus"],
        properties: {
          recordId: { type: "string" }, headword: { type: "string" }, headwordRaw: { type: "string" }, headwordNormalized: { type: "string" },
          homonymNumber: { type: ["integer", "null"] }, classification: { type: "string" }, classificationFamily: { type: "string" }, translationRaw: { type: "string" },
          senses: { type: "array", items: { type: "string" } }, examples: { type: "array", items: { type: "string" } }, variants: { type: "array", items: { type: "string" } },
          commentsRaw: { type: "string" }, sourceCode: { type: "string" }, sourceDocument: { type: "string" }, pageStart: { type: "integer" }, pageEnd: { type: "integer" },
          transcriptionStatus: { type: "string" }, publicationStatus: { type: "string", const: publicationStatus }, validationStatus: { type: "string", const: validationStatus },
        },
      },
      LexiconResponse: {
        type: "object",
        properties: {
          entries: { type: "array", items: { $ref: "#/components/schemas/LexicalEntry" } }, total: { type: "integer" }, totalAll: { type: "integer" }, page: { type: "integer" }, limit: { type: "integer" }, pages: { type: "integer" },
          publicationStatus: { type: "string", const: publicationStatus }, validationStatus: { type: "string", const: validationStatus },
        },
      },
    },
  },
};

const files = [
  ["raramuri-lexico.xml", genericXml, "application/xml", "XML lexicográfico"],
  ["raramuri-lexico.json", `${JSON.stringify(jsonExport, null, 2)}\n`, "application/json", "JSON web y móvil"],
  ["raramuri-lexico.csv", csvExport, "text/csv", "CSV analítico"],
  ["raramuri-lexico.sql", sqlExport, "application/sql", "Base SQL SQLite"],
  ["raramuri-lex0.xml", teiExport, "application/tei+xml", "TEI Lex-0 0.9.5"],
  ["openapi-lexico.json", `${JSON.stringify(openApiExport, null, 2)}\n`, "application/vnd.oai.openapi+json;version=3.1", "Especificación OpenAPI"],
];

for (const [name, content] of files) await writeFile(join(outputDir, name), content, "utf8");

const manifestFiles = [];
for (const [name, , mediaType, label] of files) {
  const path = join(outputDir, name);
  const bytes = (await stat(path)).size;
  const checksum = createHash("sha256").update(await readFile(path)).digest("hex");
  manifestFiles.push({ label, file: name, media_type: mediaType, bytes, sha256: checksum, entry_count: entries.length });
}

const manifest = {
  dataset: "Rarámuri Digital: base lexicográfica maestra",
  dataset_version: datasetVersion,
  generated: generatedAt,
  entry_count: entries.length,
  encoding: "UTF-8",
  publication_status: publicationStatus,
  validation_status: validationStatus,
  license: { id: license, url: licenseUrl },
  files: manifestFiles,
};
await writeFile(join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify(manifest, null, 2));
