import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes the multipage technical product architecture", async () => {
  const [page, header, route, corpusRoute, parallelRoute, terminologyRoute, variantsRoute, saltilloRoute, accentsRoute, hosting, products, productPage, explorer, corpusExplorer, parallelExplorer, terminologyExplorer, variantsExplorer, saltilloExplorer, accentsExplorer] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", root), "utf8"),
    readFile(new URL("app/api/lexicon/route.ts", root), "utf8"),
    readFile(new URL("app/api/corpus/route.ts", root), "utf8"),
    readFile(new URL("app/api/parallel-corpus/route.ts", root), "utf8"),
    readFile(new URL("app/api/terminology/route.ts", root), "utf8"),
    readFile(new URL("app/api/variants/route.ts", root), "utf8"),
    readFile(new URL("app/api/glottal-stop-words/route.ts", root), "utf8"),
    readFile(new URL("app/api/accented-words/route.ts", root), "utf8"),
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
  ]);

  assert.match(page, /<strong>2,581<\/strong>/);
  assert.match(page, /Estado del sistema/);
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
  assert.equal(JSON.parse(hosting).d1, "DB");
  await Promise.all([
    access(new URL("public/uceees-logo.png", root)),
    access(new URL("public/logo-uacj.png", root)),
    access(new URL("public/logo-ca-uacj-113.png", root)),
  ]);
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
