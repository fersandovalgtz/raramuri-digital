"use client";

import { FormEvent, useEffect, useState } from "react";

type ParallelPair = {
  pairId: string;
  entryId: string;
  headwordRrm: string;
  classification: string;
  classificationFamily: string;
  rrmText: string;
  spaText: string;
  alignmentStatus: "Alineado" | "Revisión requerida";
  alignmentType: string;
  confidence: string;
  sourceExample: string;
  sourceCode: string;
  sourceDocument: string;
  pageStart: number;
  pageEnd: number;
  sourceStatus: string;
};

type ParallelStats = {
  sourceEntries: number;
  totalPairs: number;
  alignedPairs: number;
  reviewPairs: number;
  rrmTokens: number;
  spaTokens: number;
};

type ClassCount = { value: string; total: number };

const initialStats: ParallelStats = { sourceEntries: 622, totalPairs: 1027, alignedPairs: 793, reviewPairs: 234, rrmTokens: 0, spaTokens: 0 };

export function ParallelCorpusExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("Todos");
  const [alignment, setAlignment] = useState("all");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [pairs, setPairs] = useState<ParallelPair[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<ParallelStats>(initialStats);
  const [classes, setClasses] = useState<ClassCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selected = pairs.find((pair) => pair.pairId === selectedId) ?? pairs[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", alignment });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    fetch(`/api/parallel-corpus?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Error de consulta");
        return payload as { pairs: ParallelPair[]; total: number; pages: number; stats: ParallelStats; classifications: ClassCount[] };
      })
      .then((payload) => {
        setPairs(payload.pairs);
        setTotal(payload.total);
        setPages(payload.pages);
        setStats(payload.stats);
        setClasses(payload.classifications);
        setSelectedId((current) => payload.pairs.some((pair) => pair.pairId === current) ? current : (payload.pairs[0]?.pairId ?? ""));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setPairs([]);
        setError(cause instanceof Error ? cause.message : "Error de consulta");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [alignment, classification, page, query, revision]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setQuery(draft.trim());
    setPage(1);
    setRevision((value) => value + 1);
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

  function exportCorpus(format: "tsv" | "jsonl") {
    const params = new URLSearchParams({ format, alignment });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    window.location.href = `/api/parallel-corpus?${params}`;
  }

  return (
    <section className="lexicon-module parallel-module" aria-label="Corpus paralelo de ejemplos rarámuri-español">
      <h2>Cobertura</h2>
      <div className="metric-grid compact parallel-metrics">
        <div><span>Entradas fuente</span><strong>{stats.sourceEntries.toLocaleString("es-MX")}</strong></div>
        <div><span>Pares derivados</span><strong>{stats.totalPairs.toLocaleString("es-MX")}</strong></div>
        <div><span>Alineados</span><strong>{stats.alignedPairs.toLocaleString("es-MX")}</strong></div>
        <div><span>Revisión</span><strong>{stats.reviewPairs.toLocaleString("es-MX")}</strong></div>
      </div>

      <div className="parallel-note"><strong>Estado del corpus</strong><p>Extracción completa de los 622 registros con ejemplos. La alineación es reproducible y conserva los segmentos no resueltos como registros de revisión.</p></div>

      <h2>Consulta</h2>
      <form className="query-form parallel-query" onSubmit={search}>
        <label><span>Texto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Oración, traducción, lema o identificador" /></label>
        <label><span>Familia gramatical</span><select value={classification} onChange={(event) => applyFilter(setClassification, event.target.value)}><option>Todos</option>{classes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <label><span>Alineación</span><select value={alignment} onChange={(event) => applyFilter(setAlignment, event.target.value)}><option value="all">Todos</option><option value="aligned">Alineados</option><option value="review">Revisión requerida</option></select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportCorpus("tsv")}>TSV</button><button type="button" className="secondary-button" onClick={() => exportCorpus("jsonl")}>JSONL</button></div>
      </form>

      <h2>Pares</h2>
      <div className="lexicon-layout parallel-layout">
        <div>
          <div className="data-table parallel-table" role="table" aria-label="Pares de oraciones rarámuri-español">
            <div className="table-header" role="row"><span>Par</span><span>Rarámuri</span><span>Español</span><span>Clase</span><span>Estado</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && pairs.map((pair) => (
              <button type="button" role="row" key={pair.pairId} className={pair.pairId === selected?.pairId ? "selected" : ""} onClick={() => setSelectedId(pair.pairId)}>
                <code>{pair.pairId}</code>
                <span lang="tar">{pair.rrmText || "—"}</span>
                <span lang="es">{pair.spaText || "—"}</span>
                <span>{pair.classification || "—"}</span>
                <em className={pair.alignmentStatus === "Alineado" ? "aligned" : "review"}>{pair.alignmentStatus === "Alineado" ? "ALINEADO" : "REVISIÓN"}</em>
                <span>{pair.pageStart === pair.pageEnd ? pair.pageStart : `${pair.pageStart}–${pair.pageEnd}`}</span>
              </button>
            ))}
            {!loading && !error && !pairs.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} pares</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>

        <aside className="record-panel parallel-pair-panel">
          <h3>Par alineado</h3>
          {selected ? <>
            <div className="record-title"><code>{selected.pairId}</code><strong>{selected.headwordRrm}</strong><span>{selected.classification || "Sin clasificar"}</span></div>
            <div className="aligned-sentences"><article><span>RRM</span><p lang="tar">{selected.rrmText || "Sin contraparte identificada"}</p></article><article><span>SPA</span><p lang="es">{selected.spaText || "Sin contraparte identificada"}</p></article></div>
            <dl>
              <div><dt>Entrada</dt><dd>{selected.entryId} · {selected.classificationFamily}</dd></div>
              <div><dt>Alineación</dt><dd>{selected.alignmentStatus} · {selected.alignmentType} · confianza {selected.confidence.toLocaleLowerCase("es")}</dd></div>
              <div><dt>Tokens</dt><dd>{stats.rrmTokens.toLocaleString("es-MX")} RRM · {stats.spaTokens.toLocaleString("es-MX")} SPA en el corpus</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.sourceCode} · {selected.sourceDocument} · p. {selected.pageStart === selected.pageEnd ? selected.pageStart : `${selected.pageStart}–${selected.pageEnd}`}</dd></div>
              <div><dt>Segmento fuente</dt><dd>{selected.sourceExample}</dd></div>
            </dl>
          </> : <p>Seleccione un par.</p>}
        </aside>
      </div>
    </section>
  );
}
