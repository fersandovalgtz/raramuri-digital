import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const lexicalEntries = sqliteTable(
  "lexical_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    recordId: text("record_id").notNull().unique(),
    headword: text("headword").notNull(),
    headwordRaw: text("headword_raw").notNull(),
    headwordNormalized: text("headword_normalized").notNull(),
    homonymNumber: integer("homonym_number"),
    classification: text("classification").notNull().default(""),
    classificationFamily: text("classification_family").notNull(),
    translationRaw: text("translation_raw").notNull().default(""),
    sensesJson: text("senses_json").notNull().default("[]"),
    examplesJson: text("examples_json").notNull().default("[]"),
    variantsJson: text("variants_json").notNull().default("[]"),
    commentsRaw: text("comments_raw").notNull().default(""),
    sourceCode: text("source_code").notNull(),
    sourceDocument: text("source_document").notNull(),
    pageStart: integer("page_start").notNull(),
    pageEnd: integer("page_end").notNull(),
    status: text("status").notNull().default("Transcrito"),
  },
  (table) => [
    index("lexical_entries_headword_idx").on(table.headwordNormalized),
    index("lexical_entries_class_idx").on(table.classificationFamily),
    index("lexical_entries_page_idx").on(table.pageStart),
  ],
);
