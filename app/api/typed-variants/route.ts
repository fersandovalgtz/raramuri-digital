import variantsPayload from "../../../data/variants-typed.json";

type TypedVariantRecord = (typeof variantsPayload.records)[number];

function normalizeSearch(value: string) {
  return value.replace(/[’‘`´]/gu, "'").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: TypedVariantRecord[]) {
  const columns: Array<keyof TypedVariantRecord> = [
    "variant_token_id", "record_id", "headword", "form", "variant_origin", "variant_nature", "source_field", "source_page", "source_page_end",
    "raw_evidence", "target_record_id", "target_record_ids", "target_form", "target_homonym_number", "target_resolution_status",
    "target_resolution_method", "target_adjudication_id", "documentary_basis", "human_validation_status", "grammatical_features", "relation_feature",
    "validation_status", "source_document", "source_code", "source_status",
  ];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const origin = (url.searchParams.get("origin") ?? "Todos").slice(0, 80);
  const nature = (url.searchParams.get("nature") ?? "Todos").slice(0, 100);
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const records = variantsPayload.records;
  const filtered = records.filter((record) => {
    if (origin !== "Todos" && record.variant_origin !== origin) return false;
    if (nature !== "Todos" && record.variant_nature !== nature) return false;
    if (!query) return true;
    return normalizeSearch([
      record.variant_token_id, record.record_id, record.headword, record.form, record.variant_origin, record.variant_nature,
      record.raw_evidence, record.target_form ?? "", record.target_record_id ?? "",
    ].join(" ")).includes(query);
  });

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="raramuri-variants-tipados-1.1.0-candidate.${extension}"`,
      "Cache-Control": "public, max-age=300",
    } });
  }

  const origins = [...new Set(records.map((record) => record.variant_origin))].sort();
  const natures = [...new Set(records.map((record) => record.variant_nature))].sort();
  return Response.json({
    schema_version: variantsPayload.schema_version,
    base_dataset_version: variantsPayload.base_dataset_version,
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: variantsPayload.record_count,
      unresolved_origins: variantsPayload.unresolved_origin_count,
    },
    origins,
    natures,
  });
}
