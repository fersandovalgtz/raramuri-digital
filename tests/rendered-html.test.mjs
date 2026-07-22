import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes the multipage technical product architecture", async () => {
  const [page, header, route, corpusRoute, parallelRoute, terminologyRoute, variantsRoute, saltilloRoute, accentsRoute, inventoriesRoute, advancedRoute, hosting, products, productPage, explorer, corpusExplorer, parallelExplorer, terminologyExplorer, variantsExplorer, saltilloExplorer, accentsExplorer, inventoryExplorer, advancedExplorer] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", root), "utf8"),
    readFile(new URL("app/api/lexicon/route.ts", root), "utf8"),
    readFile(new URL("app/api/corpus/route.ts", root), "utf8"),
    readFile(new URL("app/api/parallel-corpus/route.ts", root), "utf8"),
    readFile(new URL("app/api/terminology/route.ts", root), "utf8"),
    readFile(new URL("app/api/variants/route.ts", root), "utf8"),
    readFile(new URL("app/api/glottal-stop-words/route.ts", root), "utf8"),
    readFile(new URL("app/api/accented-words/route.ts", root), "utf8"),
    readFile(new URL("app/api/inventories/route.ts", root), "utf8"),
    readFile(new URL("app/api/advanced-products/route.ts", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
    readFile(new URL("lib/products.ts", root), "utf8"),
    readFile(new URL("app/productos/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/components/LexiconExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/CorpusExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/ParallelCorpusExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/TerminologyExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/VariantsExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/GlottalStopExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/AccentedWordsExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/InventoryExplorer.tsx", root), "utf8"),
    readFile(new URL("app/components/AdvancedProductExplorer.tsx", root), "utf8"),
  ]);

  assert.match(page, /<strong>2,581<\/strong>/);
  assert.match(page, /Estado del sistema/);
  assert.match(page, /<dt>Acceso<\/dt><dd><i className="status-dot active" \/> Público<\/dd>/);
  assert.match(page, /className="project-lockup"/);
  assert.doesNotMatch(page, /title-owner/);
  assert.match(page, /logo-uacj\.png/);
  assert.match(page, /logo-ca-uacj-113\.png/);
  assert.match(page, /<img src="\/uceees-logo\.png"/);
  assert.doesNotMatch(header, /uceees-logo\.png/);
  assert.equal((products.match(/^  p\(/gm) ?? []).length, 30);
  assert.match(productPage, /generateStaticParams/);
  assert.match(productPage, /<h2>Esquema<\/h2>/);
  assert.match(productPage, /product\.id === 3 \? <ParallelCorpusExplorer/);
  assert.match(productPage, /product\.id === 4 \? <TerminologyExplorer/);
  assert.match(productPage, /product\.id === 5 \? <VariantsExplorer/);
  assert.match(productPage, /product\.id === 6 \? <GlottalStopExplorer/);
  assert.match(productPage, /product\.id === 7 \? <AccentedWordsExplorer/);
  assert.match(productPage, /product\.id >= 8 && product\.id <= 20 \? <InventoryExplorer/);
  assert.match(productPage, /product\.id >= 21 && product\.id <= 30 \? <AdvancedProductExplorer/);
  assert.match(explorer, /Exportar CSV/);
  assert.match(corpusExplorer, /Corpus digital rarámuri-español/);
  assert.match(corpusExplorer, /JSONL/);
  assert.match(parallelExplorer, /Corpus paralelo de ejemplos rarámuri-español/);
  assert.match(parallelExplorer, /Extracción completa de los 622 registros con ejemplos/);
  assert.match(terminologyExplorer, /Segunda sección “ESPAÑOL - TARAHUMARA”/);
  assert.match(variantsExplorer, /Las relaciones gráficas/);
  assert.match(variantsExplorer, /CANDIDATA/);
  assert.match(saltilloExplorer, /Se conservan las grafías fuente/);
  assert.match(saltilloExplorer, /Contexto documental/);
  assert.match(accentsExplorer, /no se infiere división silábica/);
  assert.match(accentsExplorer, /Contexto rarámuri/);
  assert.match(inventoryExplorer, /Regla de inclusión/);
  assert.match(inventoryExplorer, /La homonimia conserva la numeración de la fuente/);
  assert.match(advancedExplorer, /Cada fila expone entidad, evidencia, fuente, página, método y estado de validación/);
  assert.match(route, /raramuri-base-lexicografica-completa\.csv/);
  assert.match(corpusRoute, /raramuri-corpus-completo\.tsv/);
  assert.match(corpusRoute, /raramuri-corpus-completo\.jsonl/);
  assert.match(parallelRoute, /raramuri-corpus-paralelo-completo\.tsv/);
  assert.match(parallelRoute, /raramuri-corpus-paralelo-completo\.jsonl/);
  assert.match(terminologyRoute, /base-terminologica-espanol-raramuri-completa\.csv/);
  assert.match(terminologyRoute, /base-terminologica-espanol-raramuri-completa\.jsonl/);
  assert.match(variantsRoute, /base-variantes-graficas-completa/);
  assert.match(saltilloRoute, /repositorio-palabras-con-saltillo-completo/);
  assert.match(saltilloRoute, /glyph.*Todos.*slice\(0, 8\)/);
  assert.match(accentsRoute, /repositorio-palabras-acentuadas-completo/);
  assert.match(accentsRoute, /vowel.*Todas.*slice\(0, 8\)/);
  assert.match(inventoriesRoute, /base-homonimos-polisemia/);
  assert.match(inventoriesRoute, /Producto fuera de rango/);
  assert.match(advancedRoute, /matriz-trazabilidad-interna/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  await Promise.all([
    access(new URL("public/uceees-logo.png", root)),
    access(new URL("public/logo-uacj.png", root)),
    access(new URL("public/logo-ca-uacj-113.png", root)),
  ]);
});

test("publishes versioned scientific documentation and reproducible quality controls", async () => {
  const [metadataText, datasheet, datasheetEn, schema, governance, contributing, contributors, changelog, qualityText, documentationPage, header, citation, codemetaText] = await Promise.all([
    readFile(new URL("project-metadata.json", root), "utf8"),
    readFile(new URL("DATASHEET.md", root), "utf8"),
    readFile(new URL("DATASHEET.en.md", root), "utf8"),
    readFile(new URL("SCHEMA.md", root), "utf8"),
    readFile(new URL("GOVERNANCE.md", root), "utf8"),
    readFile(new URL("CONTRIBUTING.md", root), "utf8"),
    readFile(new URL("CONTRIBUTORS.md", root), "utf8"),
    readFile(new URL("CHANGELOG.md", root), "utf8"),
    readFile(new URL("public/downloads/quality-report.json", root), "utf8"),
    readFile(new URL("app/documentacion/page.tsx", root), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", root), "utf8"),
    readFile(new URL("CITATION.cff", root), "utf8"),
    readFile(new URL("codemeta.json", root), "utf8"),
  ]);
  const metadata = JSON.parse(metadataText);
  const quality = JSON.parse(qualityText);
  const codemeta = JSON.parse(codemetaText);
  assert.equal(metadata.platform_version, "3.1.0");
  assert.equal(metadata.dataset_version, "1.0.0");
  assert.equal(quality.scope.entries, 2581);
  assert.equal(quality.integrity.duplicate_record_ids, 0);
  assert.equal(quality.integrity.invalid_record_ids, 0);
  assert.equal(quality.integrity.invalid_page_ranges, 0);
  assert.equal(quality.integrity.all_export_checksums_present, true);
  assert.equal(quality.integrity.all_export_entry_counts_match, true);
  assert.match(datasheet, /Validación lingüística está pendiente/i);
  assert.match(datasheetEn, /Linguistic validation is pending/i);
  assert.match(schema, /RD-######/);
  assert.match(governance, /autoridad cultural y lingüística/i);
  assert.match(contributing, /VERIFICACIÓN DOCUMENTAL/);
  assert.match(contributors, /taxonomía CRediT/);
  assert.match(changelog, /Plataforma 3\.1\.0 \/ Datos 1\.0\.0/);
  assert.match(documentationPage, /Documentación científica/);
  assert.match(documentationPage, /metadata\.doi/);
  assert.match(documentationPage, /metadata\.zenodo_record/);
  assert.match(documentationPage, /quality-report\.json/);
  assert.match(header, /href="\/documentacion"/);
  assert.match(citation, /type: dataset/);
  assert.match(citation, /version: "1\.0\.0"/);
  assert.equal(codemeta["@type"], "Dataset");
});

test("publishes complete interoperable exports and the authorized lexicographic API", async () => {
  const [downloadsPage, header, apiRoute, openApiRoute, xmlText, jsonText, csvText, sqlText, teiText, openApiText, manifestText] = await Promise.all([
    readFile(new URL("app/descargas/page.tsx", root), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", root), "utf8"),
    readFile(new URL("app/api/lexicon/route.ts", root), "utf8"),
    readFile(new URL("app/api/openapi/route.ts", root), "utf8"),
    readFile(new URL("public/downloads/raramuri-lexico.xml", root), "utf8"),
    readFile(new URL("public/downloads/raramuri-lexico.json", root), "utf8"),
    readFile(new URL("public/downloads/raramuri-lexico.csv", root), "utf8"),
    readFile(new URL("public/downloads/raramuri-lexico.sql", root), "utf8"),
    readFile(new URL("public/downloads/raramuri-lex0.xml", root), "utf8"),
    readFile(new URL("public/downloads/openapi-lexico.json", root), "utf8"),
    readFile(new URL("public/downloads/manifest.json", root), "utf8"),
  ]);

  const json = JSON.parse(jsonText);
  const openApi = JSON.parse(openApiText);
  const manifest = JSON.parse(manifestText);
  assert.equal(json.entries.length, 2581);
  assert.equal(json.entries[0].record_id, "RD-000001");
  assert.equal(json.entries.at(-1).record_id, "RD-002581");
  assert.equal((xmlText.match(/<entry xml:id="RD-/g) ?? []).length, 2581);
  assert.equal((teiText.match(/<entry xml:id="RD-/g) ?? []).length, 2581);
  assert.equal(csvText.split("\r\n").length, 2583);
  assert.equal((sqlText.match(/^INSERT INTO lexical_entries VALUES/gm) ?? []).length, 2581);
  assert.equal((sqlText.match(/^INSERT INTO senses VALUES/gm) ?? []).length, 2758);
  assert.equal((sqlText.match(/^INSERT INTO examples VALUES/gm) ?? []).length, 622);
  assert.equal((sqlText.match(/^INSERT INTO variants VALUES/gm) ?? []).length, 224);
  assert.equal(manifest.entry_count, 2581);
  assert.equal(manifest.files.length, 6);
  assert.ok(manifest.files.every((file) => file.sha256.length === 64 && file.entry_count === 2581));
  assert.equal(openApi.openapi, "3.1.0");
  assert.ok(openApi.paths["/api/lexicon"]);
  assert.match(downloadsPage, /Edición digital TEI Lex-0/);
  assert.match(downloadsPage, /API lexicográfica/);
  assert.match(header, /href="\/descargas"/);
  assert.match(apiRoute, /Autorizada para difusión/);
  assert.match(apiRoute, /Access-Control-Allow-Origin/);
  assert.match(apiRoute, /recordId/);
  assert.match(openApiRoute, /openapi-lexico\.json/);
});

test("materializes products 21 through 30 as traceable derived datasets", async () => {
  const [recordsText, reportText] = await Promise.all([
    readFile(new URL("data/advanced-products.json", root), "utf8"),
    readFile(new URL("data/advanced-products-report.json", root), "utf8"),
  ]);
  const records = JSON.parse(recordsText);
  const report = JSON.parse(reportText);
  const expectedCounts = { 21: 19, 22: 1825, 23: 7164, 24: 2581, 25: 2581, 26: 492, 27: 224, 28: 456, 29: 348, 30: 30 };
  assert.equal(records.length, 15720);
  assert.equal(report.records, 15720);
  assert.equal(report.source_entries, 2581);
  for (const [productId, expected] of Object.entries(expectedCounts)) {
    assert.equal(report.products[productId].records, expected);
    assert.equal(records.filter((record) => record.product_id === Number(productId)).length, expected);
  }
  assert.deepEqual(report.products[21].labels, { Resuelta: 19 });
  assert.equal(report.products[22].labels.Acciones, 1254);
  assert.deepEqual(report.products[23].relation_types, { HAS_GRAMMATICAL_CATEGORY: 2581, HAS_SENSE: 2758, IN_SEMANTIC_FIELD: 1825 });
  assert.equal(report.products[25].records, 2581);
  assert.equal(report.products[30].records, 30);
  assert.ok(records.every((record) => record.advanced_id && record.product_id >= 21 && record.product_id <= 30 && record.entity_id && record.source_code && record.page_start && record.method && record.validation_status));
});

test("materializes products 8 through 20 as complete traceable inventories", async () => {
  const [recordsText, reportText] = await Promise.all([
    readFile(new URL("data/grammatical-inventories.json", root), "utf8"),
    readFile(new URL("data/grammatical-inventories-report.json", root), "utf8"),
  ]);
  const records = JSON.parse(recordsText);
  const report = JSON.parse(reportText);
  const expectedCounts = { 8: 752, 9: 547, 10: 694, 11: 184, 12: 162, 13: 22, 14: 3, 15: 11, 16: 179, 17: 170, 18: 23, 19: 75, 20: 425 };
  assert.equal(records.length, 3247);
  assert.equal(report.records, 3247);
  assert.equal(report.source_entries, 2581);
  for (const [productId, expected] of Object.entries(expectedCounts)) {
    assert.equal(report.products[productId].records, expected);
    assert.equal(records.filter((record) => record.product_id === Number(productId)).length, expected);
  }
  assert.deepEqual(report.products[15].labels, { "Marca regional explícita": 11 });
  assert.deepEqual(report.products[16].subtypes, { "Clasificación explícita": 137, "Par explícito": 42 });
  assert.deepEqual(report.products[17].labels, { Futuro: 103, Pasado: 67 });
  assert.deepEqual(report.products[18].subtypes, { "Número no indicado": 20, Plural: 3 });
  assert.deepEqual(report.products[19].labels, { Gerundio: 1, Participio: 74 });
  assert.deepEqual(report.products[20].labels, { Homonimia: 266, "Homonimia y polisemia": 18, Polisemia: 141 });
  assert.ok(records.every((record) => record.inventory_id && record.product_id >= 8 && record.product_id <= 20 && record.form && record.entry_id && record.source_code && record.page_start && record.validation_status));
});

test("materializes the complete repository of accented Rarámuri words", async () => {
  const [recordsText, reportText, csvText] = await Promise.all([
    readFile(new URL("data/accented-words.json", root), "utf8"),
    readFile(new URL("data/accented-words-report.json", root), "utf8"),
    readFile(new URL("data/accented-words.csv", root), "utf8"),
  ]);
  const records = JSON.parse(recordsText);
  const report = JSON.parse(reportText);
  assert.equal(records.length, 3433);
  assert.equal(report.records, 3433);
  assert.equal(report.unique_normalized_forms, 2152);
  assert.equal(report.source_entries, 2581);
  assert.equal(report.entries_with_accented_forms, 1873);
  assert.deepEqual(report.occurrences_by_field, { Lema: 1765, Variante: 186, "Ejemplo RRM": 1482 });
  assert.deepEqual(report.accented_vowels, { "á": 1022, "é": 820, "í": 972, "ó": 353, "ú": 311 });
  assert.deepEqual(report.occurrences_by_position, { Inicial: 15, Medial: 1300, Final: 2073, Múltiple: 45 });
  assert.ok(records.every((record) => record.accent_id && record.form && record.accented_vowels.length && record.accent_indexes.length && record.entry_id && record.context && record.source_code && record.page_start && record.validation_status));
  assert.ok(records.filter((record) => record.source_field === "Ejemplo RRM").every((record) => record.pair_id && record.alignment_confidence !== "No aplica"));
  assert.equal(csvText.split("\r\n").length, 3434);
});

test("materializes the complete repository of words with glottal stop", async () => {
  const [recordsText, reportText, csvText] = await Promise.all([
    readFile(new URL("data/glottal-stop-words.json", root), "utf8"),
    readFile(new URL("data/glottal-stop-words-report.json", root), "utf8"),
    readFile(new URL("data/glottal-stop-words.csv", root), "utf8"),
  ]);
  const records = JSON.parse(recordsText);
  const report = JSON.parse(reportText);
  assert.equal(records.length, 835);
  assert.equal(report.records, 835);
  assert.equal(report.unique_normalized_forms, 532);
  assert.equal(report.source_entries, 2581);
  assert.equal(report.entries_with_saltillo, 508);
  assert.deepEqual(report.occurrences_by_field, { Lema: 392, Variante: 53, Ejemplo: 390 });
  assert.deepEqual(report.occurrences_by_position, { Inicial: 98, Medial: 733, Final: 3, Múltiple: 1 });
  assert.deepEqual(report.source_glyphs, { "’": 477, "'": 272, "´": 12, "‘": 75 });
  assert.ok(records.every((record) => record.saltillo_id && record.form && record.normalized_form.includes("ʼ") && record.entry_id && record.context && record.source_code && record.page_start && record.validation_status));
  assert.equal(csvText.split("\r\n").length, 836);
});

test("materializes the complete graphic-variant derivation", async () => {
  const [variantsText, reportText, csvText] = await Promise.all([
    readFile(new URL("data/graphic-variants.json", root), "utf8"),
    readFile(new URL("data/graphic-variants-report.json", root), "utf8"),
    readFile(new URL("data/graphic-variants.csv", root), "utf8"),
  ]);
  const variants = JSON.parse(variantsText);
  const report = JSON.parse(reportText);
  assert.equal(variants.length, 829);
  assert.equal(report.records, 829);
  assert.equal(report.graphic_relations, 602);
  assert.equal(report.explicit_graphic_relations, 54);
  assert.equal(report.detected_graphic_relations, 548);
  assert.equal(report.inflection_relations, 225);
  assert.equal(report.cross_references, 2);
  assert.equal(report.source_entries, 2581);
  assert.equal(report.source_entries_with_variant_annotations, 221);
  assert.deepEqual(report.patterns, { "ba/hua": 27, "g/c": 11, "i/e": 122, "Ø/C inicial": 380, "Otra relación explícita": 48, "r/l": 14 });
  assert.ok(variants.every((record) => record.variant_id && record.form_a && record.form_b && record.entry_ids.length && record.source_code && record.page_start && record.validation_status));
  assert.equal(csvText.split("\r\n").length, 830);
});

test("keeps every extracted source row traceable and seeded", async () => {
  const [jsonText, migration, reportText] = await Promise.all([
    readFile(new URL("data/lexicon-master.json", root), "utf8"),
    readFile(new URL("drizzle/0000_sleepy_cardiac.sql", root), "utf8"),
    readFile(new URL("data/extraction-report.json", root), "utf8"),
  ]);
  const entries = JSON.parse(jsonText);
  const report = JSON.parse(reportText);

  assert.equal(entries.length, 2581);
  assert.equal(report.records, 2581);
  assert.equal(report.with_examples, 622);
  assert.equal(entries[0].record_id, "RD-000001");
  assert.equal(entries.at(-1).record_id, "RD-002581");
  assert.equal(entries[0].page_start, 3);
  assert.equal(entries.at(-1).page_end, 87);
  assert.equal((migration.match(/^\('RD-/gm) ?? []).length, 2581);
});

test("materializes the complete parallel-example derivation", async () => {
  const entries = JSON.parse(await readFile(new URL("data/lexicon-master.json", root), "utf8"));
  const { deriveParallelPairs } = await import(new URL("lib/parallel-corpus.ts", root));
  const rows = entries.map((entry) => ({
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
  const pairs = deriveParallelPairs(rows);
  assert.equal(entries.filter((entry) => entry.examples.length).length, 622);
  assert.equal(pairs.length, 1027);
  assert.equal(pairs.filter((pair) => pair.alignmentStatus === "Alineado").length, 793);
  assert.ok(pairs.every((pair) => pair.pairId && pair.entryId && pair.sourceCode && pair.pageStart));
});

test("materializes the complete Spanish-Rarámuri terminology section", async () => {
  const [termsText, reportText, csvText] = await Promise.all([
    readFile(new URL("data/terminology-spanish-raramuri.json", root), "utf8"),
    readFile(new URL("data/terminology-extraction-report.json", root), "utf8"),
    readFile(new URL("data/terminology-spanish-raramuri.csv", root), "utf8"),
  ]);
  const terms = JSON.parse(termsText);
  const report = JSON.parse(reportText);
  assert.equal(terms.length, 2090);
  assert.equal(report.records, 2090);
  assert.equal(report.source_pages, 50);
  assert.equal(report.printed_page_min, 81);
  assert.equal(report.printed_page_max, 130);
  assert.equal(terms[0].term_es, "a pesar de");
  assert.equal(terms.at(-1).term_es, "zurdo");
  assert.ok(terms.every((term) => term.term_id && term.term_es && term.equivalents_rrm && term.pdf_page && term.printed_page));
  assert.equal(csvText.split("\r\n").length, 2091);
});
