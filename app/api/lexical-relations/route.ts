import relationsPayload from "../../../data/lexical-relations.json";

type RelationRecord = (typeof relationsPayload.records)[number];

function normalizeSearch(value: string) {
  return value.replace(/[’‘`´]/gu, "'").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: RelationRecord[]) {
  const columns: Array<keyof RelationRecord> = [
    "relation_id", "source_record_id", "source_headword", "source_page", "source_page_end", "relation_type", "relation_label",
    "source_field", "raw_evidence", "target_form", "target_homonym_number", "target_record_id", "target_record_ids", "resolution_status",
    "target_resolution_method", "target_adjudication_id", "documentary_basis", "human_validation_status", "validation_status", "source_document", "source_code",
  ];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const type = (url.searchParams.get("type") ?? "Todos").slice(0, 80);
  const method = (url.searchParams.get("method") ?? "Todos").slice(0, 80);
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const records = relationsPayload.records;
  const filtered = records.filter((record) => {
    if (type !== "Todos" && record.relation_type !== type) return false;
    if (method !== "Todos" && record.target_resolution_method !== method) return false;
    if (!query) return true;
    return normalizeSearch([
      record.relation_id, record.source_record_id, record.source_headword, record.relation_type, record.relation_label,
      record.raw_evidence, record.target_form, record.target_record_id ?? "", record.documentary_basis ?? "",
    ].join(" ")).includes(query);
  });

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="raramuri-relaciones-lexicograficas-1.1.0-candidate.${extension}"`,
      "Cache-Control": "public, max-age=300",
    } });
  }

  return Response.json({
    schema_version: relationsPayload.schema_version,
    base_dataset_version: relationsPayload.base_dataset_version,
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      relations: relationsPayload.relation_count,
      source_remission_occurrences: relationsPayload.source_remission_occurrence_count,
      resolved_unique: relationsPayload.unique_resolution_count,
      resolved_ambiguous: relationsPayload.ambiguous_resolution_count,
      unresolved: relationsPayload.unresolved_resolution_count,
      documentary_adjudications: relationsPayload.documentary_adjudication_count,
    },
  });
}
