import { and, asc, count, eq, like, or, type SQL } from "drizzle-orm";
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

function serializeEntry(row: typeof lexicalEntries.$inferSelect) {
  return {
    id: row.id,
    recordId: row.recordId,
    headword: row.headword,
    headwordRaw: row.headwordRaw,
    headwordNormalized: row.headwordNormalized,
    homonymNumber: row.homonymNumber,
    classification: row.classification,
    classificationFamily: row.classificationFamily,
    translationRaw: row.translationRaw,
    senses: parseArray(row.sensesJson),
    examples: parseArray(row.examplesJson),
    variants: parseArray(row.variantsJson),
    commentsRaw: row.commentsRaw,
    sourceCode: row.sourceCode,
    sourceDocument: row.sourceDocument,
    pageStart: row.pageStart,
    pageEnd: row.pageEnd,
    status: row.status,
  };
}

function csvCell(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function toCsv(rows: Array<typeof lexicalEntries.$inferSelect>) {
  const header = [
    "id_registro", "palabra_raramuri", "forma_fuente", "homonimo",
    "clasificacion_gramatical", "familia_gramatical", "traduccion",
    "acepciones", "ejemplos_y_comentarios", "variantes", "fuente",
    "documento", "pagina_inicio", "pagina_fin", "estado",
  ];
  const data = rows.map((row) => {
    const entry = serializeEntry(row);
    return [
      entry.recordId, entry.headword, entry.headwordRaw, entry.homonymNumber,
      entry.classification, entry.classificationFamily, entry.translationRaw,
      entry.senses.join(" | "), entry.examples.join(" | "),
      entry.variants.join(" | "), entry.sourceCode, entry.sourceDocument,
      entry.pageStart, entry.pageEnd, entry.status,
    ];
  });
  return "\ufeff" + [header, ...data].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") ?? "").trim().slice(0, 160);
    const classification = (url.searchParams.get("pos") ?? "").trim().slice(0, 40);
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
    if (classification && classification !== "Todos") {
      conditions.push(eq(lexicalEntries.classificationFamily, classification));
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;
    const db = getDb();

    if (format === "csv") {
      const rows = await db
        .select()
        .from(lexicalEntries)
        .where(whereClause)
        .orderBy(asc(lexicalEntries.id));
      return new Response(toCsv(rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="raramuri-base-lexicografica-completa.csv"',
          "Cache-Control": "private, max-age=60",
        },
      });
    }

    const [rows, [{ value: total }], [{ value: totalAll }], classifications] = await Promise.all([
      db.select().from(lexicalEntries).where(whereClause).orderBy(asc(lexicalEntries.id)).limit(limit).offset((page - 1) * limit),
      db.select({ value: count() }).from(lexicalEntries).where(whereClause),
      db.select({ value: count() }).from(lexicalEntries),
      db.select({ value: lexicalEntries.classificationFamily, total: count() })
        .from(lexicalEntries)
        .groupBy(lexicalEntries.classificationFamily)
        .orderBy(asc(lexicalEntries.classificationFamily)),
    ]);

    return Response.json({
      entries: rows.map(serializeEntry),
      total,
      totalAll,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      classifications,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return Response.json({ error: message }, { status: 500 });
  }
}
