import variants from "../../../data/graphic-variants.json";

type VariantRecord = (typeof variants)[number];

function normalizeSearch(value: string) {
  return value.replace(/[’‘]/gu, "'").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: VariantRecord[]) {
  const columns: Array<keyof VariantRecord> = ["variant_id", "form_a", "form_b", "form_a_normalized", "form_b_normalized", "pattern", "relation_type", "derivation_method", "entry_id", "entry_ids", "related_entry_id", "classification", "evidence", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const relation = (url.searchParams.get("relation") ?? "Gráfica").slice(0, 30);
  const pattern = (url.searchParams.get("pattern") ?? "Todos").slice(0, 40);
  const method = (url.searchParams.get("method") ?? "Todos").slice(0, 80);
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const filtered = variants.filter((record) => {
    if (relation !== "Todos" && record.relation_type !== relation) return false;
    if (pattern !== "Todos" && record.pattern !== pattern) return false;
    if (method !== "Todos" && record.derivation_method !== method) return false;
    if (!query) return true;
    return normalizeSearch([record.variant_id, record.form_a, record.form_b, record.pattern, record.entry_ids.join(" "), record.evidence].join(" ")).includes(query);
  });

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="base-variantes-graficas-completa.${extension}"`,
      "Cache-Control": "private, max-age=60",
    } });
  }

  const patterns = [...new Set(variants.map((record) => record.pattern))].sort((a, b) => a.localeCompare(b, "es")).map((value) => ({ value, total: variants.filter((record) => record.pattern === value).length }));
  const methods = [...new Set(variants.map((record) => record.derivation_method))].sort((a, b) => a.localeCompare(b, "es")).map((value) => ({ value, total: variants.filter((record) => record.derivation_method === value).length }));
  const graphic = variants.filter((record) => record.relation_type === "Gráfica");

  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: variants.length,
      graphic: graphic.length,
      explicit: graphic.filter((record) => record.derivation_method === "Explícita en el lema").length,
      detected: graphic.filter((record) => record.derivation_method.startsWith("Comparación automática")).length,
      inflection: variants.filter((record) => record.relation_type === "Flexión").length,
      crossReferences: variants.filter((record) => record.relation_type === "Remisión").length,
      sourceEntries: 2581,
      annotatedEntries: 221,
    },
    patterns,
    methods,
  });
}
