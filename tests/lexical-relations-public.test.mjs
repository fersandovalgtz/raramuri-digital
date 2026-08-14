import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes P21 from canonical cross-reference relations", async () => {
  const [relationsPayload, advanced, report] = await Promise.all([
    readFile(new URL("data/lexical-relations.json", root), "utf8").then(JSON.parse),
    readFile(new URL("data/advanced-products.json", root), "utf8").then(JSON.parse),
    readFile(new URL("data/advanced-products-report.json", root), "utf8").then(JSON.parse),
  ]);
  const crossReferences = relationsPayload.records.filter((row) => row.relation_type === "cross_reference");
  const p21 = advanced.filter((row) => row.product_id === 21);

  assert.equal(crossReferences.length, 19);
  assert.equal(p21.length, 19);
  assert.equal(report.products[21].records, 19);
  assert.deepEqual(report.products[21].labels, { Resuelta: 19 });
  assert.ok(crossReferences.every((row) => row.resolution_status === "resolved_unique" && row.target_record_id));
  assert.equal(crossReferences.filter((row) => row.target_resolution_method === "documentary_adjudication").length, 3);

  const canonicalPairs = crossReferences.map((row) => `${row.source_record_id}|${row.target_record_id}`).sort();
  const publicPairs = p21.map((row) => `${row.entry_id}|${row.target_id}`).sort();
  assert.deepEqual(publicPairs, canonicalPairs);

  const bySource = Object.fromEntries(p21.map((row) => [row.entry_id, row.target_id]));
  assert.equal(bySource["RD-000086"], "RD-000008");
  assert.equal(bySource["RD-000495"], "RD-000484");
  assert.equal(bySource["RD-000877"], "RD-000934");
  assert.equal(bySource["RD-000728"], undefined);
});
