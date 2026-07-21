import inventories from "../../../data/grammatical-inventories.json";

type InventoryRecord = (typeof inventories)[number];

const filenames: Record<number, string> = {
  8: "inventario-sustantivos", 9: "inventario-verbos-transitivos", 10: "inventario-verbos-intransitivos",
  11: "inventario-adjetivos", 12: "inventario-adverbios", 13: "inventario-pronombres", 14: "inventario-interjecciones",
  15: "inventario-terminos-regionales", 16: "inventario-singulares-plurales", 17: "inventario-pasado-futuro",
  18: "inventario-imperativos", 19: "inventario-gerundios-participios", 20: "base-homonimos-polisemia",
};

function normalizeSearch(value: string) {
  return value.replace(/[’‘`´]/gu, "'").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: InventoryRecord[]) {
  const columns: Array<keyof InventoryRecord> = ["inventory_id", "product_id", "product_name", "record_type", "form", "normalized_form", "related_form", "label", "subtype", "classification", "classification_family", "translation", "senses", "sense_count", "evidence", "entry_id", "related_entry_ids", "homonym_number", "group_key", "relation_status", "example_count", "variant_count", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = Number.parseInt(url.searchParams.get("product") ?? "0", 10);
  if (productId < 8 || productId > 20) return Response.json({ error: "Producto fuera de rango" }, { status: 400 });
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const label = (url.searchParams.get("label") ?? "Todos").slice(0, 80);
  const subtype = (url.searchParams.get("subtype") ?? "Todos").slice(0, 80);
  const family = (url.searchParams.get("family") ?? "Todos").slice(0, 40);
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));
  const productRecords = inventories.filter((record) => record.product_id === productId);
  const filtered = productRecords.filter((record) => {
    if (label !== "Todos" && record.label !== label) return false;
    if (subtype !== "Todos" && record.subtype !== subtype) return false;
    if (family !== "Todos" && record.classification_family !== family) return false;
    if (!query) return true;
    return normalizeSearch([record.inventory_id, record.form, record.related_form, record.label, record.classification, record.translation, record.senses.join(" "), record.evidence, record.entry_id].join(" ")).includes(query);
  });

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenames[productId]}-completo.${extension}"`,
      "Cache-Control": "private, max-age=60",
    } });
  }

  const labels = [...new Set(productRecords.map((record) => record.label))].sort((a, b) => a.localeCompare(b, "es")).map((value) => ({ value, total: productRecords.filter((record) => record.label === value).length }));
  const subtypes = [...new Set(productRecords.map((record) => record.subtype))].sort((a, b) => a.localeCompare(b, "es")).map((value) => ({ value, total: productRecords.filter((record) => record.subtype === value).length }));
  const families = [...new Set(productRecords.map((record) => record.classification_family))].sort((a, b) => a.localeCompare(b, "es")).map((value) => ({ value, total: productRecords.filter((record) => record.classification_family === value).length }));
  const homonymRecords = productRecords.filter((record) => record.label.includes("Homonimia"));
  const polysemicRecords = productRecords.filter((record) => record.label.includes("polisemia") || record.label === "Polisemia");
  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: productRecords.length,
      entries: new Set(productRecords.map((record) => record.entry_id)).size,
      pages: new Set(productRecords.flatMap((record) => Array.from({ length: record.page_end - record.page_start + 1 }, (_, index) => record.page_start + index))).size,
      withExamples: productRecords.filter((record) => record.example_count > 0).length,
      multiSense: productRecords.filter((record) => record.sense_count > 1).length,
      classes: families.length,
      explicitPairs: productRecords.filter((record) => record.subtype === "Par explícito").length,
      classifiedForms: productRecords.filter((record) => record.subtype === "Clasificación explícita").length,
      past: productRecords.filter((record) => record.label === "Pasado").length,
      future: productRecords.filter((record) => record.label === "Futuro").length,
      plural: productRecords.filter((record) => record.subtype === "Plural").length,
      participles: productRecords.filter((record) => record.label === "Participio").length,
      gerunds: productRecords.filter((record) => record.label === "Gerundio").length,
      homonymEntries: homonymRecords.length,
      polysemicEntries: polysemicRecords.length,
      combinedEntries: productRecords.filter((record) => record.label === "Homonimia y polisemia").length,
      homonymGroups: new Set(homonymRecords.map((record) => record.group_key)).size,
    },
    labels,
    subtypes,
    families,
  });
}
