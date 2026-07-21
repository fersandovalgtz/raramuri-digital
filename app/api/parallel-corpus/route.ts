import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { lexicalEntries } from "../../../db/schema";
import { deriveParallelPairs, type ParallelPair } from "../../../lib/parallel-corpus";

function normalizeSearch(value: string) {
  return value
    .replace(/[’‘]/g, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/gu, " ")
    .trim();
}

function tokenCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

function tsvCell(value: unknown) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll("\r", " ").replaceAll("\n", " ");
}

function serializeExportPair(pair: ParallelPair) {
  return {
    pair_id: pair.pairId,
    entry_id: pair.entryId,
    headword_rrm: pair.headwordRrm,
    classification: pair.classification,
    classification_family: pair.classificationFamily,
    rrm_text: pair.rrmText,
    spa_text: pair.spaText,
    alignment_status: pair.alignmentStatus,
    alignment_type: pair.alignmentType,
    confidence: pair.confidence,
    source_code: pair.sourceCode,
    source_document: pair.sourceDocument,
    page_start: pair.pageStart,
    page_end: pair.pageEnd,
    source_status: pair.sourceStatus,
  };
}

function toTsv(pairs: ParallelPair[]) {
  const header = ["pair_id", "entry_id", "headword_rrm", "classification", "classification_family", "rrm_text", "spa_text", "alignment_status", "alignment_type", "confidence", "source_code", "source_document", "page_start", "page_end", "source_status"];
  const rows = pairs.map((pair) => Object.values(serializeExportPair(pair)));
  return "\ufeff" + [header, ...rows].map((row) => row.map(tsvCell).join("\t")).join("\r\n");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = normalizeSearch((url.searchParams.get("q") ?? "").slice(0, 160));
    const classification = (url.searchParams.get("pos") ?? "").trim().slice(0, 40);
    const alignment = (url.searchParams.get("alignment") ?? "all").trim();
    const format = url.searchParams.get("format") ?? "json";
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

    const rows = await getDb().select().from(lexicalEntries).orderBy(asc(lexicalEntries.id));
    const allPairs = deriveParallelPairs(rows);
    const pairs = allPairs.filter((pair) => {
      if (classification && classification !== "Todos" && pair.classificationFamily !== classification) return false;
      if (alignment === "aligned" && pair.alignmentStatus !== "Alineado") return false;
      if (alignment === "review" && pair.alignmentStatus !== "Revisión requerida") return false;
      if (!query) return true;
      return normalizeSearch([pair.pairId, pair.entryId, pair.headwordRrm, pair.classification, pair.rrmText, pair.spaText].join(" ")).includes(query);
    });

    if (format === "tsv" || format === "jsonl") {
      if (format === "jsonl") {
        return new Response(pairs.map((pair) => JSON.stringify(serializeExportPair(pair))).join("\n") + "\n", {
          headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Content-Disposition": 'attachment; filename="raramuri-corpus-paralelo-completo.jsonl"',
            "Cache-Control": "private, max-age=60",
          },
        });
      }
      return new Response(toTsv(pairs), {
        headers: {
          "Content-Type": "text/tab-separated-values; charset=utf-8",
          "Content-Disposition": 'attachment; filename="raramuri-corpus-paralelo-completo.tsv"',
          "Cache-Control": "private, max-age=60",
        },
      });
    }

    const alignedPairs = allPairs.filter((pair) => pair.alignmentStatus === "Alineado").length;
    const sourceRows = rows.filter((row) => row.examplesJson !== "[]");
    const classifications = [...new Set(allPairs.map((pair) => pair.classificationFamily))]
      .sort((a, b) => a.localeCompare(b, "es"))
      .map((value) => ({ value, total: allPairs.filter((pair) => pair.classificationFamily === value).length }));

    return Response.json({
      pairs: pairs.slice((page - 1) * limit, page * limit),
      total: pairs.length,
      page,
      limit,
      pages: Math.max(1, Math.ceil(pairs.length / limit)),
      stats: {
        sourceEntries: sourceRows.length,
        totalPairs: allPairs.length,
        alignedPairs,
        reviewPairs: allPairs.length - alignedPairs,
        rrmTokens: allPairs.reduce((total, pair) => total + tokenCount(pair.rrmText), 0),
        spaTokens: allPairs.reduce((total, pair) => total + tokenCount(pair.spaText), 0),
      },
      classifications,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Error inesperado" }, { status: 500 });
  }
}
