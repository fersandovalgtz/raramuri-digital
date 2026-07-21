import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes the complete master lexicon in the interface", async () => {
  const [page, route, hosting] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/api/lexicon/route.ts", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
  ]);

  assert.match(page, /2,581 registros/);
  assert.match(page, /Base maestra completa/);
  assert.match(page, /Exportar CSV/);
  assert.match(page, /página de procedencia/);
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
