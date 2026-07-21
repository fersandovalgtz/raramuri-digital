import saltilloWords from "../../../data/glottal-stop-words.json";

type SaltilloRecord = (typeof saltilloWords)[number];

function normalizeSearch(value: string) {
  return value.replace(/[’‘'ʼ´`]/gu, "ʼ").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: SaltilloRecord[]) {
  const columns: Array<keyof SaltilloRecord> = ["saltillo_id", "form", "normalized_form", "search_form", "saltillo_glyphs", "saltillo_count", "position", "saltillo_indexes", "source_field", "field_index", "token_ordinal", "context_index", "context", "entry_id", "headword", "classification", "classification_family", "translation", "document_frequency", "entry_frequency", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const field = (url.searchParams.get("field") ?? "Todos").slice(0, 20);
  const position = (url.searchParams.get("position") ?? "Todos").slice(0, 20);
  const glyph = (url.searchParams.get("glyph") ?? "Todos").slice(0, 4);
  const mode = url.searchParams.get("mode") === "occurrences" ? "occurrences" : "forms";
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const matching = saltilloWords.filter((record) => {
    if (field !== "Todos" && record.source_field !== field) return false;
    if (position !== "Todos" && record.position !== position) return false;
    if (glyph !== "Todos" && !record.saltillo_glyphs.includes(glyph)) return false;
    if (!query) return true;
    return normalizeSearch([record.saltillo_id, record.form, record.normalized_form, record.entry_id, record.headword, record.translation, record.context].join(" ")).includes(query);
  });
  const filtered = mode === "forms" ? [...new Map(matching.map((record) => [record.normalized_form, record])).values()] : matching;

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="repositorio-palabras-con-saltillo-completo.${extension}"`,
      "Cache-Control": "private, max-age=60",
    } });
  }

  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    matchingOccurrences: matching.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: saltilloWords.length,
      uniqueForms: new Set(saltilloWords.map((record) => record.normalized_form)).size,
      sourceEntries: 2581,
      entriesWithSaltillo: new Set(saltilloWords.map((record) => record.entry_id)).size,
      headwordOccurrences: saltilloWords.filter((record) => record.source_field === "Lema").length,
      variantOccurrences: saltilloWords.filter((record) => record.source_field === "Variante").length,
      exampleOccurrences: saltilloWords.filter((record) => record.source_field === "Ejemplo").length,
      initial: saltilloWords.filter((record) => record.position === "Inicial").length,
      medial: saltilloWords.filter((record) => record.position === "Medial").length,
      final: saltilloWords.filter((record) => record.position === "Final").length,
      multiple: saltilloWords.filter((record) => record.position === "Múltiple").length,
    },
    glyphs: ["'", "’", "‘", "´"].map((value) => ({ value, total: saltilloWords.reduce((sum, record) => sum + record.saltillo_glyphs.filter((glyphItem) => glyphItem === value).length, 0) })),
  });
}
