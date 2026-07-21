import accentedWords from "../../../data/accented-words.json";

type AccentRecord = (typeof accentedWords)[number];

function normalizeSearch(value: string) {
  return value.replace(/[’‘'ʼ´`]/gu, "ʼ").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: AccentRecord[]) {
  const columns: Array<keyof AccentRecord> = ["accent_id", "form", "normalized_form", "base_form", "accented_vowels", "accent_count", "accent_indexes", "accent_position", "vowel_ordinals_from_start", "vowel_ordinals_from_end", "source_field", "field_index", "token_ordinal", "context_index", "context", "source_context", "pair_id", "alignment_status", "alignment_confidence", "entry_id", "headword", "classification", "classification_family", "translation", "document_frequency", "entry_frequency", "source_code", "source_document", "page_start", "page_end", "source_status", "validation_status"];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const field = (url.searchParams.get("field") ?? "Todos").slice(0, 24);
  const position = (url.searchParams.get("position") ?? "Todos").slice(0, 20);
  const vowel = (url.searchParams.get("vowel") ?? "Todas").slice(0, 8);
  const confidence = (url.searchParams.get("confidence") ?? "Todos").slice(0, 12);
  const mode = url.searchParams.get("mode") === "occurrences" ? "occurrences" : "forms";
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const matching = accentedWords.filter((record) => {
    if (field !== "Todos" && record.source_field !== field) return false;
    if (position !== "Todos" && record.accent_position !== position) return false;
    if (vowel !== "Todas" && !record.accented_vowels.includes(vowel)) return false;
    if (confidence !== "Todos" && record.alignment_confidence !== confidence) return false;
    if (!query) return true;
    return normalizeSearch([record.accent_id, record.form, record.normalized_form, record.entry_id, record.headword, record.translation, record.context].join(" ")).includes(query);
  });
  const filtered = mode === "forms" ? [...new Map(matching.map((record) => [record.normalized_form, record])).values()] : matching;

  if (format === "csv" || format === "jsonl") {
    const body = format === "csv" ? toCsv(filtered) : filtered.map((record) => JSON.stringify(record)).join("\n") + "\n";
    const extension = format === "csv" ? "csv" : "jsonl";
    return new Response(body, { headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="repositorio-palabras-acentuadas-completo.${extension}"`,
      "Cache-Control": "private, max-age=60",
    } });
  }

  const vowels = ["á", "é", "í", "ó", "ú"].map((value) => ({ value, total: accentedWords.reduce((sum, record) => sum + record.accented_vowels.filter((item) => item === value).length, 0) }));
  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    matchingOccurrences: matching.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: accentedWords.length,
      uniqueForms: new Set(accentedWords.map((record) => record.normalized_form)).size,
      sourceEntries: 2581,
      entriesWithAccents: new Set(accentedWords.map((record) => record.entry_id)).size,
      headwordOccurrences: accentedWords.filter((record) => record.source_field === "Lema").length,
      variantOccurrences: accentedWords.filter((record) => record.source_field === "Variante").length,
      exampleOccurrences: accentedWords.filter((record) => record.source_field === "Ejemplo RRM").length,
      initial: accentedWords.filter((record) => record.accent_position === "Inicial").length,
      medial: accentedWords.filter((record) => record.accent_position === "Medial").length,
      final: accentedWords.filter((record) => record.accent_position === "Final").length,
      multiple: accentedWords.filter((record) => record.accent_position === "Múltiple").length,
    },
    vowels,
  });
}
