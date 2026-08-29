"use client";

import { useEffect } from "react";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

function stringArg(input: Record<string, unknown>, key: string) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

function limitArg(input: Record<string, unknown>) {
  const value = input.limit;
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.trunc(value)));
}

function toolResult(payload: unknown): WebMCPToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload) }],
  };
}

function toolError(error: unknown): WebMCPToolResult {
  const message = error instanceof Error ? error.message : "Unexpected WebMCP tool error";
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

async function fetchApi<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  signal: AbortSignal,
): Promise<T> {
  const url = new URL(path, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

type LexiconResponse = {
  entries: Array<{
    recordId: string;
    headword: string;
    headwordRaw: string;
    homonymNumber: number | null;
    classification: string;
    classificationFamily: string;
    translationRaw: string;
    senses: string[];
    examples: string[];
    variants: string[];
    sourceCode: string;
    sourceDocument: string;
    pageStart: number | null;
    pageEnd: number | null;
    transcriptionStatus: string;
    publicationStatus: string;
    validationStatus: string;
  }>;
  total: number;
  publicationStatus: string;
  validationStatus: string;
};

type TerminologyResponse = {
  records: Array<{
    term_id: string;
    term_es: string;
    grammatical_label: string;
    equivalents_rrm: string;
    source_code: string;
    source_document: string;
    source_section: string;
    pdf_page: number;
    printed_page: number;
    extraction_status: string;
    validation_status: string;
  }>;
  total: number;
};

type RelationsResponse = {
  records: Array<{
    relation_id: string;
    source_record_id: string;
    source_headword: string;
    relation_type: string;
    relation_label: string;
    raw_evidence: string;
    target_form: string;
    target_record_id: string | null;
    target_record_ids: string[];
    resolution_status: string;
    target_resolution_method: string;
    documentary_basis: string | null;
    human_validation_status: string;
    validation_status: string;
    source_document: string;
    source_code: string;
    source_page: number;
    source_page_end: number | null;
  }>;
  total: number;
  schema_version: string;
  base_dataset_version: string;
};

type ParallelCorpusResponse = {
  pairs: Array<{
    pairId: string;
    entryId: string;
    headwordRrm: string;
    classification: string;
    classificationFamily: string;
    rrmText: string;
    spaText: string;
    alignmentStatus: string;
    alignmentType: string;
    confidence: string | number;
    sourceCode: string;
    sourceDocument: string;
    pageStart: number | null;
    pageEnd: number | null;
    sourceStatus: string;
  }>;
  total: number;
};

const searchRaramuriLexicon: WebMCPToolDefinition = {
  name: "search_raramuri_lexicon",
  title: "Search Rarámuri lexicon",
  description:
    "Search Rarámuri Digital's provenance-aware Rarámuri-Spanish lexicon. Returns documentary forms, meanings, examples, variants, source pages, publication status, and linguistic-validation status.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        description: "Rarámuri or Spanish search text.",
      },
      partOfSpeech: {
        type: "string",
        maxLength: 40,
        description: "Optional grammatical family exactly as exposed by the lexicon API.",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: MAX_LIMIT,
        default: DEFAULT_LIMIT,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  async execute(input, { signal }) {
    try {
      const query = stringArg(input, "query").slice(0, 160);
      if (!query) return toolError(new Error("query is required"));
      const partOfSpeech = stringArg(input, "partOfSpeech").slice(0, 40);
      const data = await fetchApi<LexiconResponse>(
        "/api/lexicon",
        { q: query, pos: partOfSpeech || undefined, limit: limitArg(input) },
        signal,
      );
      return toolResult({
        source: "/api/lexicon",
        query,
        totalMatches: data.total,
        publicationStatus: data.publicationStatus,
        validationStatus: data.validationStatus,
        entries: data.entries.map((entry) => ({
          recordId: entry.recordId,
          headword: entry.headword,
          sourceForm: entry.headwordRaw,
          homonymNumber: entry.homonymNumber,
          partOfSpeech: entry.classification,
          partOfSpeechFamily: entry.classificationFamily,
          translation: entry.translationRaw,
          senses: entry.senses,
          examples: entry.examples,
          variants: entry.variants,
          provenance: {
            sourceCode: entry.sourceCode,
            sourceDocument: entry.sourceDocument,
            pageStart: entry.pageStart,
            pageEnd: entry.pageEnd,
          },
          transcriptionStatus: entry.transcriptionStatus,
          publicationStatus: entry.publicationStatus,
          validationStatus: entry.validationStatus,
        })),
      });
    } catch (error) {
      return toolError(error);
    }
  },
};

const searchSpanishTerminology: WebMCPToolDefinition = {
  name: "search_spanish_terminology",
  title: "Search Spanish-to-Rarámuri terminology",
  description:
    "Search the documented Spanish-to-Rarámuri terminology layer. Returns candidate Rarámuri equivalents with grammatical labels, extraction status, validation status, and source-page provenance.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        description: "Spanish term or other text to locate in the terminology layer.",
      },
      grammaticalLabel: {
        type: "string",
        maxLength: 30,
        description: "Optional exact grammatical label.",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: MAX_LIMIT,
        default: DEFAULT_LIMIT,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  async execute(input, { signal }) {
    try {
      const query = stringArg(input, "query").slice(0, 160);
      if (!query) return toolError(new Error("query is required"));
      const grammaticalLabel = stringArg(input, "grammaticalLabel").slice(0, 30);
      const data = await fetchApi<TerminologyResponse>(
        "/api/terminology",
        { q: query, label: grammaticalLabel || undefined, limit: limitArg(input) },
        signal,
      );
      return toolResult({
        source: "/api/terminology",
        query,
        totalMatches: data.total,
        records: data.records.map((record) => ({
          id: record.term_id,
          spanishTerm: record.term_es,
          grammaticalLabel: record.grammatical_label,
          raramuriEquivalents: record.equivalents_rrm,
          extractionStatus: record.extraction_status,
          validationStatus: record.validation_status,
          provenance: {
            sourceCode: record.source_code,
            sourceDocument: record.source_document,
            sourceSection: record.source_section,
            pdfPage: record.pdf_page,
            printedPage: record.printed_page,
          },
        })),
      });
    } catch (error) {
      return toolError(error);
    }
  },
};

const getLexicalRelations: WebMCPToolDefinition = {
  name: "get_lexical_relations",
  title: "Explore lexical relations",
  description:
    "Search documented lexical relations in Rarámuri Digital by headword, record ID, target form, or evidence. Preserves resolution method, documentary basis, validation state, and source provenance.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        description: "Headword, record ID, target form, relation text, or documentary evidence.",
      },
      relationType: {
        type: "string",
        maxLength: 80,
        description: "Optional exact relation type.",
      },
      resolutionMethod: {
        type: "string",
        maxLength: 80,
        description: "Optional exact target-resolution method.",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: MAX_LIMIT,
        default: DEFAULT_LIMIT,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  async execute(input, { signal }) {
    try {
      const query = stringArg(input, "query").slice(0, 160);
      if (!query) return toolError(new Error("query is required"));
      const relationType = stringArg(input, "relationType").slice(0, 80);
      const resolutionMethod = stringArg(input, "resolutionMethod").slice(0, 80);
      const data = await fetchApi<RelationsResponse>(
        "/api/lexical-relations",
        {
          q: query,
          type: relationType || undefined,
          method: resolutionMethod || undefined,
          limit: limitArg(input),
        },
        signal,
      );
      return toolResult({
        source: "/api/lexical-relations",
        query,
        schemaVersion: data.schema_version,
        baseDatasetVersion: data.base_dataset_version,
        totalMatches: data.total,
        relations: data.records.map((record) => ({
          relationId: record.relation_id,
          sourceRecordId: record.source_record_id,
          sourceHeadword: record.source_headword,
          relationType: record.relation_type,
          relationLabel: record.relation_label,
          evidence: record.raw_evidence,
          targetForm: record.target_form,
          targetRecordId: record.target_record_id,
          targetRecordIds: record.target_record_ids,
          resolutionStatus: record.resolution_status,
          resolutionMethod: record.target_resolution_method,
          documentaryBasis: record.documentary_basis,
          humanValidationStatus: record.human_validation_status,
          validationStatus: record.validation_status,
          provenance: {
            sourceCode: record.source_code,
            sourceDocument: record.source_document,
            pageStart: record.source_page,
            pageEnd: record.source_page_end,
          },
        })),
      });
    } catch (error) {
      return toolError(error);
    }
  },
};

const searchParallelCorpus: WebMCPToolDefinition = {
  name: "search_parallel_corpus",
  title: "Search bilingual corpus evidence",
  description:
    "Search documented Rarámuri-Spanish parallel examples. Returns bilingual text, alignment status and type, confidence, source status, and page-level provenance so agents can verify lexical claims against corpus evidence.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 160,
        description: "Rarámuri or Spanish text to search in the parallel corpus.",
      },
      partOfSpeech: {
        type: "string",
        maxLength: 40,
        description: "Optional exact grammatical family.",
      },
      alignment: {
        type: "string",
        enum: ["all", "aligned", "review"],
        default: "all",
        description: "Filter by alignment status.",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: MAX_LIMIT,
        default: DEFAULT_LIMIT,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  async execute(input, { signal }) {
    try {
      const query = stringArg(input, "query").slice(0, 160);
      if (!query) return toolError(new Error("query is required"));
      const partOfSpeech = stringArg(input, "partOfSpeech").slice(0, 40);
      const alignmentInput = stringArg(input, "alignment");
      const alignment = ["aligned", "review"].includes(alignmentInput) ? alignmentInput : "all";
      const data = await fetchApi<ParallelCorpusResponse>(
        "/api/parallel-corpus",
        {
          q: query,
          pos: partOfSpeech || undefined,
          alignment,
          limit: limitArg(input),
        },
        signal,
      );
      return toolResult({
        source: "/api/parallel-corpus",
        query,
        totalMatches: data.total,
        pairs: data.pairs.map((pair) => ({
          pairId: pair.pairId,
          entryId: pair.entryId,
          headword: pair.headwordRrm,
          partOfSpeech: pair.classification,
          partOfSpeechFamily: pair.classificationFamily,
          raramuri: pair.rrmText,
          spanish: pair.spaText,
          alignmentStatus: pair.alignmentStatus,
          alignmentType: pair.alignmentType,
          confidence: pair.confidence,
          sourceStatus: pair.sourceStatus,
          provenance: {
            sourceCode: pair.sourceCode,
            sourceDocument: pair.sourceDocument,
            pageStart: pair.pageStart,
            pageEnd: pair.pageEnd,
          },
        })),
      });
    } catch (error) {
      return toolError(error);
    }
  },
};

const tools = [
  searchRaramuriLexicon,
  searchSpanishTerminology,
  getLexicalRelations,
  searchParallelCorpus,
];

export default function WebMCPTools() {
  useEffect(() => {
    const modelContext = document.modelContext;
    if (!modelContext) return;

    const controller = new AbortController();
    void Promise.all(
      tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })),
    ).catch((error) => {
      if (!controller.signal.aborted) {
        console.error("Rarámuri Digital WebMCP registration failed", error);
      }
    });

    return () => controller.abort();
  }, []);

  return null;
}
