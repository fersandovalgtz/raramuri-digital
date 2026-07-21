"use client";

import { FormEvent, useEffect, useState } from "react";

type CorpusDocument = {
  documentId: string;
  entryId: string;
  headwordRrm: string;
  headwordSource: string;
  classification: string;
  classificationFamily: string;
  translationEs: string;
  contextRrmEs: string;
  examples: string[];
  corpusText: string;
  tokenCount: number;
  characterCount: number;
  hasContext: boolean;
  sourceCode: string;
  sourceDocument: string;
  pageStart: number;
  pageEnd: number;
  status: string;
};

type CorpusStats = {
  totalDocuments: number;
  documentsWithContext: number;
  tokenCount: number;
  characterCount: number;
};

type ClassCount = { value: string; total: number };

export function CorpusExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("Todos");
  const [content, setContent] = useState("all");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [documents, setDocuments] = useState<CorpusDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<CorpusStats>({ totalDocuments: 2581, documentsWithContext: 622, tokenCount: 18043, characterCount: 115158 });
  const [classes, setClasses] = useState<ClassCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selected = documents.find((document) => document.documentId === selectedId) ?? documents[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", content });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    fetch(`/api/corpus?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Error de consulta");
        return payload as { documents: CorpusDocument[]; total: number; pages: number; stats: CorpusStats; classifications: ClassCount[] };
      })
      .then((payload) => {
        setDocuments(payload.documents);
        setTotal(payload.total);
        setPages(payload.pages);
        setStats(payload.stats);
        setClasses(payload.classifications);
        setSelectedId((current) => payload.documents.some((document) => document.documentId === current) ? current : (payload.documents[0]?.documentId ?? ""));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setDocuments([]);
        setError(cause instanceof Error ? cause.message : "Error de consulta");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [classification, content, page, query, revision]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setQuery(draft.trim());
    setPage(1);
    setRevision((value) => value + 1);
  }

  function exportCorpus(format: "tsv" | "jsonl") {
    const params = new URLSearchParams({ format, content });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    window.location.href = `/api/corpus?${params}`;
  }

  function applyFilter(setter: (value: string) => void, value: string) {
    setLoading(true);
    setError("");
    setter(value);
    setPage(1);
  }

  function changePage(next: number) {
    setLoading(true);
    setError("");
    setPage(next);
  }

  return (
    <section className="lexicon-module corpus-module" aria-label="Corpus digital rarámuri-español">
      <h2>Corpus</h2>
      <div className="metric-grid compact">
        <div><span>Documentos</span><strong>{stats.totalDocuments.toLocaleString("es-MX")}</strong></div>
        <div><span>Con contexto</span><strong>{stats.documentsWithContext.toLocaleString("es-MX")}</strong></div>
        <div><span>Tokens</span><strong>{stats.tokenCount.toLocaleString("es-MX")}</strong></div>
        <div><span>Caracteres</span><strong>{stats.characterCount.toLocaleString("es-MX")}</strong></div>
      </div>

      <h2>Consulta</h2>
      <form className="query-form corpus-query" onSubmit={search}>
        <label><span>Texto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Forma rarámuri, traducción o contexto" /></label>
        <label><span>Familia gramatical</span><select value={classification} onChange={(event) => applyFilter(setClassification, event.target.value)}><option>Todos</option>{classes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <label><span>Contenido</span><select value={content} onChange={(event) => applyFilter(setContent, event.target.value)}><option value="all">Todos</option><option value="with_context">Con contexto</option><option value="without_context">Sin contexto</option></select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportCorpus("tsv")}>TSV</button><button type="button" className="secondary-button" onClick={() => exportCorpus("jsonl")}>JSONL</button></div>
      </form>

      <h2>Documentos</h2>
      <div className="lexicon-layout corpus-layout">
        <div>
          <div className="data-table corpus-table" role="table" aria-label="Documentos del corpus">
            <div className="table-header" role="row"><span>Documento</span><span>Forma RRM</span><span>Clase</span><span>Traducción ES</span><span>Contexto</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && documents.map((document) => (
              <button type="button" role="row" key={document.documentId} className={document.documentId === selected?.documentId ? "selected" : ""} onClick={() => setSelectedId(document.documentId)}>
                <code>{document.documentId}</code>
                <strong>{document.headwordRrm}</strong>
                <span>{document.classification || "—"}</span>
                <span>{document.translationEs || "—"}</span>
                <span>{document.hasContext ? "Sí" : "No"}</span>
                <span>{document.pageStart === document.pageEnd ? document.pageStart : `${document.pageStart}–${document.pageEnd}`}</span>
              </button>
            ))}
            {!loading && !error && !documents.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} documentos</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>

        <aside className="record-panel corpus-document-panel">
          <h3>Documento</h3>
          {selected ? <>
            <div className="record-title"><code>{selected.documentId}</code><strong>{selected.headwordRrm}</strong><span>{selected.classification || "Sin clasificar"}</span></div>
            <dl>
              <div><dt>Segmento RRM · forma</dt><dd lang="tar">{selected.headwordSource}</dd></div>
              <div><dt>Segmento ES · traducción</dt><dd>{selected.translationEs || "Sin dato"}</dd></div>
              <div><dt>Segmento RRM–ES · contexto</dt><dd>{selected.contextRrmEs || "Sin dato"}</dd></div>
              <div><dt>Medidas</dt><dd>{selected.tokenCount} tokens · {selected.characterCount} caracteres</dd></div>
              <div><dt>Vinculación</dt><dd>{selected.entryId} · {selected.classificationFamily}</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.sourceCode} · {selected.sourceDocument} · p. {selected.pageStart === selected.pageEnd ? selected.pageStart : `${selected.pageStart}–${selected.pageEnd}`}</dd></div>
              <div><dt>Estado</dt><dd>{selected.status} · alineación interna pendiente</dd></div>
            </dl>
          </> : <p>Seleccione un documento.</p>}
        </aside>
      </div>
    </section>
  );
}
