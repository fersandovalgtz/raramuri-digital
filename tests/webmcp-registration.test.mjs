import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("registers exactly four read-only WebMCP linguistic tools", async () => {
  const source = await read("app/components/WebMCPTools.tsx");
  const names = [
    "search_raramuri_lexicon",
    "search_spanish_terminology",
    "get_lexical_relations",
    "search_parallel_corpus",
  ];

  for (const name of names) assert.match(source, new RegExp(`name: "${name}"`));
  assert.equal((source.match(/name: "(?:search_raramuri_lexicon|search_spanish_terminology|get_lexical_relations|search_parallel_corpus)"/g) ?? []).length, 4);
  assert.equal((source.match(/readOnlyHint: true/g) ?? []).length, 4);
  assert.equal((source.match(/untrustedContentHint: true/g) ?? []).length, 4);
  assert.match(source, /if \(!modelContext\) return;/);
  assert.match(source, /new AbortController\(\)/);
  assert.match(source, /registerTool\(tool, \{ signal: controller\.signal \}\)/);
  assert.match(source, /return \(\) => controller\.abort\(\);/);
});

test("WebMCP tools reuse the four canonical read-only API endpoints", async () => {
  const source = await read("app/components/WebMCPTools.tsx");
  const endpoints = [
    "/api/lexicon",
    "/api/terminology",
    "/api/lexical-relations",
    "/api/parallel-corpus",
  ];

  for (const endpoint of endpoints) assert.match(source, new RegExp(`"${endpoint}"`));
  assert.equal((source.match(/method: "GET"/g) ?? []).length, 1);
  assert.doesNotMatch(source, /method: "(?:POST|PUT|PATCH|DELETE)"/);
  assert.match(source, /signal,/);
  assert.match(source, /new URL\(path, window\.location\.origin\)/);
  assert.match(source, /MAX_LIMIT = 25/);
});

test("root layout mounts WebMCP as a progressive enhancement", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout, /import WebMCPTools from "\.\/components\/WebMCPTools";/);
  assert.match(layout, /<WebMCPTools \/>/);
});

test("challenge documentation distinguishes the pre-challenge baseline", async () => {
  const documentation = await read("WEBMCP_CHALLENGE.md");
  assert.match(documentation, /38dd3bc3343548db20e2a1a19e7fd35a47ea7996/);
  assert.match(documentation, /August 25, 2026/);
  assert.match(documentation, /Concepticon\/Glottolog/i);
  assert.match(documentation, /meaningfully extended/i);
  assert.match(documentation, /less than three minutes/i);
});
