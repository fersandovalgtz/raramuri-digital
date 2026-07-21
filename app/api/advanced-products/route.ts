import records from "../../../data/advanced-products.json";

type AdvancedRecord = (typeof records)[number];

const filenames: Record<number, string> = {
  21: "base-remisiones-internas", 22: "tesauro-tematico", 23: "ontologia-lexica-inicial",
  24: "indice-frecuencia-documental", 25: "indice-alfabetico-normalizado", 26: "catalogo-palabras-ilustrables",
  27: "catalogo-palabras-abstractas", 28: "catalogo-ejemplos-ensenanza-inicial",
  29: "catalogo-ejemplos-analisis-linguistico", 30: "matriz-trazabilidad-interna",
};

function normalizeSearch(value: string) {
  return value.replace(/[’‘`´]/gu, "ʼ").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: AdvancedRecord[]) {
  const columns: Array<keyof AdvancedRecord> = [
    "advanced_id", "product_id", "product_name", "record_type", "form", "normalized_form", "related_form", "label", "subtype",
    "description", "relation_type", "target_id", "target_type", "entity_id", "entry_id", "related_entry_ids", "text_rrm", "text_spa",
    "evidence", "tags", "score", "rank", "record_count", "example_count", "form_count", "sense_count", "token_count_rrm", "token_count_spa",
    "route", "source_code", "source_document", "page_start", "page_end", "method", "confidence", "validation_status",
  ];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function facets(rows: AdvancedRecord[], key: "label" | "subtype" | "relation_type") {
  return [...new Set(rows.map((record) => record[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"))
    .map((value) => ({ value, total: rows.filter((record) => record[key] === value).length }));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = Number.parseInt(url.searchParams.get("product") ?? "0", 10);
  if (productId < 21 || productId > 30) return Response.json({ error: "Producto fuera de rango" }, { status: 400 });
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 180));
  const label = (url.searchParams.get("label") ?? "Todos").slice(0, 100);
  const subtype = (url.searchParams.get("subtype") ?? "Todos").slice(0, 100);
  const relation = (url.searchParams.get("relation") ?? "Todos").slice(0, 100);
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));
  const productRecords = records.filter((record) => record.product_id === productId);
  const filtered = productRecords.filter((record) => {
    if (label !== "Todos" && record.label !== label) return false;
    if (subtype !== "Todos" && record.subtype !== subtype) return false;
    if (relation !== "Todos" && record.relation_type !== relation) return false;
    if (!query) return true;
    return normalizeSearch([
      record.advanced_id, record.form, record.normalized_form, record.related_form, record.label, record.subtype, record.description,
      record.relation_type, record.target_id, record.entity_id, record.entry_id, record.text_rrm, record.text_spa, record.evidence,
      record.tags.join(" "), record.source_code, record.source_document,
    ].join(" ")).includes(query);
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

  const relations = facets(productRecords, "relation_type");
  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: productRecords.length,
      entries: new Set(productRecords.map((record) => record.entry_id).filter(Boolean)).size,
      pages: new Set(productRecords.flatMap((record) => Array.from({ length: record.page_end - record.page_start + 1 }, (_, index) => record.page_start + index))).size,
      labels: new Set(productRecords.map((record) => record.label)).size,
      resolved: productRecords.filter((record) => record.label === "Resuelta").length,
      fields: productId === 22 ? new Set(productRecords.map((record) => record.label)).size : productRecords.filter((record) => record.label === "Campo semántico").length,
      senses: productRecords.filter((record) => record.relation_type === "HAS_SENSE").length,
      categories: productRecords.filter((record) => record.relation_type === "HAS_GRAMMATICAL_CATEGORY").length,
      withEvidence: productRecords.filter((record) => record.example_count > 0 || record.form_count > 0).length,
      maxScore: Math.max(0, ...productRecords.map((record) => record.score)),
      initialA: productRecords.filter((record) => record.label === "Inicial A").length,
      initialB: productRecords.filter((record) => record.label === "Inicial B").length,
      products: productId === 30 ? productRecords.length : 0,
      auditedRecords: productId === 30 ? productRecords.reduce((total, record) => total + record.record_count, 0) : 0,
    },
    labels: facets(productRecords, "label"), subtypes: facets(productRecords, "subtype"), relations,
  });
}
