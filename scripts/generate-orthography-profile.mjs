import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = join(projectRoot, "data", "lexicon-master.json");

function outputDirectory() {
  const index = process.argv.indexOf("--output");
  if (index >= 0 && process.argv[index + 1]) return resolve(process.argv[index + 1]);
  return join(projectRoot, "public", "downloads", "orthography");
}

function tsv(value) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll(/\r?\n/g, " ");
}

const entries = JSON.parse(await readFile(sourcePath, "utf8"));
const outputDir = outputDirectory();
await mkdir(outputDir, { recursive: true });

const counts = new Map();
const fields = ["headword_raw", "headword", "headword_normalized"];
for (const entry of entries) {
  for (const field of fields) {
    for (const char of String(entry[field] ?? "").normalize("NFC")) {
      if (/\s/u.test(char)) continue;
      const key = `${field}\u0000${char}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
}

const characters = [...new Set([...counts.keys()].map((key) => key.split("\u0000")[1]))]
  .sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
const inventoryRows = characters.map((char) => {
  const codePoint = `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
  return [codePoint, char, ...fields.map((field) => counts.get(`${field}\u0000${char}`) ?? 0)];
});

const differenceCounts = new Map();
for (const entry of entries) {
  const raw = String(entry.headword_raw ?? "");
  const normalized = String(entry.headword_normalized ?? "");
  if (raw === normalized) continue;
  const key = `${raw}\u0000${normalized}`;
  differenceCounts.set(key, (differenceCounts.get(key) ?? 0) + 1);
}
const differenceRows = [...differenceCounts.entries()]
  .map(([key, count]) => {
    const [raw, normalized] = key.split("\u0000");
    return [raw, normalized, count];
  })
  .sort((a, b) => b[2] - a[2] || a[0].localeCompare(b[0]));

const inventory = [["codepoint", "character", "headword_raw_count", "headword_count", "headword_normalized_count"], ...inventoryRows]
  .map((row) => row.map(tsv).join("\t")).join("\n") + "\n";
const differences = [["headword_raw", "headword_normalized", "count"], ...differenceRows]
  .map((row) => row.map(tsv).join("\t")).join("\n") + "\n";

await writeFile(join(outputDir, "character-inventory.tsv"), inventory, "utf8");
await writeFile(join(outputDir, "normalization-differences.tsv"), differences, "utf8");
await writeFile(join(outputDir, "README.md"), `# Empirical orthography profile\n\nThese tables are generated from the published lexicon and describe observed characters and raw-to-normalized headword differences. They are descriptive technical evidence, not a prescriptive orthography and not linguistic validation.\n\n- \`character-inventory.tsv\`: Unicode code points observed in source, display and normalized headword fields.\n- \`normalization-differences.tsv\`: distinct source/normalized pairs and their frequency.\n`, "utf8");

console.log(`Orthography profile generated in ${outputDir}: ${characters.length} code points, ${differenceRows.length} normalization pairs.`);
