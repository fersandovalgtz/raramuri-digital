import { and, asc, count, eq, like, ne, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "../../../db";
import { lexicalEntries } from "../../../db/schema";

function normalizeSearch(value: string) {
  return value
    .replace(/[’‘]/g, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function tokenCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

function serializeDocument(row: typeof lexicalEntries.$inferSelect) {
  const corpusText = [row.headwordRaw, row.translationRaw, row.commentsRaw].filter(Boolean).join("\n");
  return {
    documentId: `CORP-${row.recordId}`,
    entryId: row.recordId,
    headwordRrm: row.headword,
    headwordSource: row.headwordRaw,
    classification: row.classification,
    classificationFamily: row.classificationFamily,
    translationEs: row.translationRaw,
    contextRrmEs: row.commentsRaw,
    examples: parseArray(row.examplesJson),
    corpusText,
    tokenCount: tokenCount(corpusText),
    characterCount: corpusText.length,
    hasContext: Boolean(row.commentsRaw),
    sourceCode: row.sourceCode,
    sourceDocument: row.sourceDocument,
    pageStart: row.pageStart,
    pageEnd: row.pageEnd,
    status: row.status,
  };
}

function serializeJsonlDocument(row: typeof lexicalEntries.$inferSelect) {
  const document = serializeDocument(row);
  return {
    document_id: document.documentId,
    entry_id: document.entryId,
    headword_rrm: document.headwordSource,
    classification: document.classification,
    translation_es: document.translationEs,
    context_rrm_es: document.contextRrmEs,
    token_count: document.tokenCount,
    source_code: document.sourceCode,
    page_start: document.pageStart,
    page_end: document.pageEnd,
    status: document.status,
  };
}

function tsvCell(value: unknown) {
  return String(value ?? "").replaceAll("\t", " ").replaceAll("\r", " ").replaceAll("\n", " ");
}

function toTsv(rows: Array<typeof lexicalEntries.$inferSelect>) {
  const header = ["document_id", "entry_id", "headword_rrm", "classification", "translation_es", "context_rrm_es", "token_count", "source_code", "source_document", "page_start", "page_end", "status"];
  const data = rows.map((row) => {
    const document = serializeDocument(row);
    return [document.documentId, document.entryId, document.headwordSource, document.classification, document.translationEs, document.contextRrmEs, document.tokenCount, document.sourceCode, document.sourceDocument, document.pageStart, document.pageEnd, document.status];
  });
  return "\ufeff" + [header, ...data].map((row) => row.map(tsvCell).join("\t")).join("\r\n");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") ?? "").trim().slice(0, 160);
    const classification = (url.searchParams.get("pos") ?? "").trim().slice(0, 40);
    const content = (url.searchParams.get("content") ?? "all").trim();
    const format = url.searchParams.get("format") ?? "json";
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));

    const conditions: SQL[] = [];
    if (query) {
      const rawPattern = `%${query}%`;
      const normalizedPattern = `%${normalizeSearch(query)}%`;
      const searchCondition = or(
        like(lexicalEntries.headwordNormalized, normalizedPattern),
        like(lexicalEntries.headword, rawPattern),
        like(lexicalEntries.translationRaw, rawPattern),
        like(lexicalEntries.commentsRaw, rawPattern),
        like(lexicalEntries.classification, rawPattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }
    if (classification && classification !== "Todos") conditions.push(eq(lexicalEntries.classificationFamily, classification));
    if (content === "with_context") conditions.push(ne(lexicalEntries.commentsRaw, ""));
    if (content === "without_context") conditions.push(eq(lexicalEntries.commentsRaw, ""));
    const whereClause = conditions.length ? and(...conditions) : undefined;
    const db = getDb();

    if (format === "tsv" || format === "jsonl") {
      const rows = await db.select().from(lexicalEntries).where(whereClause).orderBy(asc(lexicalEntries.id));
      if (format === "jsonl") {
        return new Response(rows.map((row) => JSON.stringify(serializeJsonlDocument(row))).join("\n") + "\n", {
          headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Content-Disposition": 'attachment; filename="raramuri-corpus-completo.jsonl"',
            "Cache-Control": "private, max-age=60",
          },
        });
      }
      return new Response(toTsv(rows), {
        headers: {
          "Content-Type": "text/tab-separated-values; charset=utf-8",
          "Content-Disposition": 'attachment; filename="raramuri-corpus-completo.tsv"',
          "Cache-Control": "private, max-age=60",
        },
      });
    }

    const tokenExpression = sql<number>`sum(
      case when length(trim(${lexicalEntries.headwordRaw})) = 0 then 0 else 1 + length(trim(${lexicalEntries.headwordRaw})) - length(replace(trim(${lexicalEntries.headwordRaw}), ' ', '')) end +
      case when length(trim(${lexicalEntries.translationRaw})) = 0 then 0 else 1 + length(trim(${lexicalEntries.translationRaw})) - length(replace(trim(${lexicalEntries.translationRaw}), ' ', '')) end +
      case when length(trim(${lexicalEntries.commentsRaw})) = 0 then 0 else 1 + length(trim(${lexicalEntries.commentsRaw})) - length(replace(trim(${lexicalEntries.commentsRaw}), ' ', '')) end
    )`;
    const characterExpression = sql<number>`sum(
      length(${lexicalEntries.headwordRaw}) + length(${lexicalEntries.translationRaw}) + length(${lexicalEntries.commentsRaw}) +
      case when length(${lexicalEntries.translationRaw}) > 0 then 1 else 0 end +
      case when length(${lexicalEntries.commentsRaw}) > 0 then 1 else 0 end
    )`;

    const [rows, [{ value: total }], [stats], classifications] = await Promise.all([
      db.select().from(lexicalEntries).where(whereClause).orderBy(asc(lexicalEntries.id)).limit(limit).offset((page - 1) * limit),
      db.select({ value: count() }).from(lexicalEntries).where(whereClause),
      db.select({
        totalDocuments: count(),
        documentsWithContext: sql<number>`sum(case when ${lexicalEntries.commentsRaw} <> '' then 1 else 0 end)`,
        tokenCount: tokenExpression,
        characterCount: characterExpression,
      }).from(lexicalEntries),
      db.select({ value: lexicalEntries.classificationFamily, total: count() }).from(lexicalEntries).groupBy(lexicalEntries.classificationFamily).orderBy(asc(lexicalEntries.classificationFamily)),
    ]);

    return Response.json({
      documents: rows.map(serializeDocument),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      stats,
      classifications,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Error inesperado" }, { status: 500 });
  }
}
