import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes the multipage technical product architecture", async () => {
  const [page, route, hosting, products, productPage, explorer] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/api/lexicon/route.ts", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
    readFile(new URL("lib/products.ts", root), "utf8"),
    readFile(new URL("app/productos/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/components/LexiconExplorer.tsx", root), "utf8"),
  ]);

  assert.match(page, /<strong>2,581<\/strong>/);
  assert.match(page, /Estado del sistema/);
  assert.equal((products.match(/^  p\(/gm) ?? []).length, 30);
  assert.match(productPage, /generateStaticParams/);
  assert.match(productPage, /<h2>Esquema<\/h2>/);
  assert.match(explorer, /Exportar CSV/);
  assert.match(route, /raramuri-base-lexicografica-completa\.csv/);
  assert.equal(JSON.parse(hosting).d1, "DB");
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
  assert.equal(entries[0].record_id, "RD-000001");
  assert.equal(entries.at(-1).record_id, "RD-002581");
  assert.equal(entries[0].page_start, 3);
  assert.equal(entries.at(-1).page_end, 87);
  assert.equal((migration.match(/^\('RD-/gm) ?? []).length, 2581);
});
