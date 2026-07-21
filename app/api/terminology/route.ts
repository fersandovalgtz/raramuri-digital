import terminology from "../../../data/terminology-spanish-raramuri.json";

type TermRecord = (typeof terminology)[number];

function normalizeSearch(value: string) {
  return value
    .replace(/[’‘]/g, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/gu, " ")
    .trim();
}

function csvCell(value: unknown) {
  const text = String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: TermRecord[]) {
  const columns: Array<keyof TermRecord> = ["term_id", "term_es", "term_es_normalized", "grammatical_label", "equivalents_rrm", "source_code", "source_document", "source_section", "pdf_page", "printed_page", "extraction_status", "validation_status", "raw_entry"];
  return "\ufeff" + [columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
  const label = (url.searchParams.get("label") ?? "Todos").trim().slice(0, 30);
  const initialParam = (url.searchParams.get("initial") ?? "Todas").trim();
  const initial = initialParam === "Todas" ? "todas" : normalizeSearch(initialParam.slice(0, 1));
  const format = url.searchParams.get("format") ?? "json";
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

  const filtered = terminology.filter((record) => {
    if (label !== "Todos" && record.grammatical_label !== label) return false;
    if (initial !== "todas" && !record.term_es_normalized.startsWith(initial)) return false;
    if (!query) return true;
    return normalizeSearch([record.term_id, record.term_es, record.grammatical_label, record.equivalents_rrm, record.raw_entry].join(" ")).includes(query);
  });

  if (format === "csv" || format === "jsonl") {
    if (format === "jsonl") {
      return new Response(filtered.map((record) => JSON.stringify(record)).join("\n") + "\n", {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Content-Disposition": 'attachment; filename="base-terminologica-espanol-raramuri-completa.jsonl"',
          "Cache-Control": "private, max-age=60",
        },
      });
    }
    return new Response(toCsv(filtered), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="base-terminologica-espanol-raramuri-completa.csv"',
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  const labels = [...new Set(terminology.map((record) => record.grammatical_label))]
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((value) => ({ value, total: terminology.filter((record) => record.grammatical_label === value).length }));

  return Response.json({
    records: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    stats: {
      records: terminology.length,
      uniqueTerms: new Set(terminology.map((record) => record.term_es_normalized)).size,
      sourcePages: new Set(terminology.map((record) => record.pdf_page)).size,
      grammaticalLabels: labels.length,
      printedPageMin: Math.min(...terminology.map((record) => record.printed_page)),
      printedPageMax: Math.max(...terminology.map((record) => record.printed_page)),
    },
    labels,
  });
}
