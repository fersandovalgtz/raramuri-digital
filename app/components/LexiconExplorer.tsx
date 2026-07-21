"use client";

import { FormEvent, useEffect, useState } from "react";

type Entry = {
  id: number;
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
  pageStart: number;
  pageEnd: number;
  status: string;
};

type ClassCount = { value: string; total: number };

export function LexiconExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("Todos");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalAll, setTotalAll] = useState(2581);
  const [classes, setClasses] = useState<ClassCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selected = entries.find((entry) => entry.recordId === selectedId) ?? entries[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    fetch(`/api/lexicon?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Error de consulta");
        return payload as { entries: Entry[]; total: number; totalAll: number; pages: number; classifications: ClassCount[] };
      })
      .then((payload) => {
        setEntries(payload.entries);
        setTotal(payload.total);
        setTotalAll(payload.totalAll);
        setPages(payload.pages);
        setClasses(payload.classifications);
        setSelectedId((current) => payload.entries.some((entry) => entry.recordId === current) ? current : (payload.entries[0]?.recordId ?? ""));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setEntries([]);
        setError(cause instanceof Error ? cause.message : "Error de consulta");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [classification, page, query, revision]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setQuery(draft.trim());
    setPage(1);
    setRevision((value) => value + 1);
  }

  function exportCsv() {
    const params = new URLSearchParams({ format: "csv" });
    if (query) params.set("q", query);
    if (classification !== "Todos") params.set("pos", classification);
    window.location.href = `/api/lexicon?${params}`;
  }

  function changePage(next: number) {
    setLoading(true);
    setError("");
    setPage(next);
  }

  return (
    <section className="lexicon-module" aria-label="Consulta de la base lexicográfica">
      <h2>Base de datos</h2>
      <div className="metric-grid compact">
        <div><span>Registros</span><strong>{totalAll.toLocaleString("es-MX")}</strong></div>
        <div><span>Familias gramaticales</span><strong>{classes.length || 15}</strong></div>
        <div><span>Páginas fuente</span><strong>85</strong></div>
        <div><span>Estado</span><strong>Transcrito</strong></div>
      </div>

      <h2>Consulta</h2>
      <form className="query-form" onSubmit={search}>
        <label><span>Texto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Lema, traducción, clase o ejemplo" /></label>
        <label><span>Familia gramatical</span><select value={classification} onChange={(event) => { setLoading(true); setError(""); setClassification(event.target.value); setPage(1); }}><option>Todos</option>{classes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <button type="submit">Buscar</button>
        <button type="button" className="secondary-button" onClick={exportCsv}>Exportar CSV</button>
      </form>

      <h2>Resultados</h2>
      <div className="lexicon-layout">
        <div>
          <div className="data-table lexicon-table" role="table" aria-label="Resultados lexicográficos">
            <div className="table-header" role="row"><span>ID</span><span>Palabra</span><span>Clase</span><span>Traducción</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && entries.map((entry) => (
              <button type="button" role="row" key={entry.recordId} className={entry.recordId === selected?.recordId ? "selected" : ""} onClick={() => setSelectedId(entry.recordId)}>
                <code>{entry.recordId}</code>
                <strong>{entry.homonymNumber && <sup>{entry.homonymNumber}</sup>}{entry.headword}</strong>
                <span>{entry.classification || "—"}</span>
                <span>{entry.translationRaw || "—"}</span>
                <span>{entry.pageStart === entry.pageEnd ? entry.pageStart : `${entry.pageStart}–${entry.pageEnd}`}</span>
              </button>
            ))}
            {!loading && !error && !entries.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} registros</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>

        <aside className="record-panel">
          <h3>Registro</h3>
          {selected ? <>
            <div className="record-title"><code>{selected.recordId}</code><strong>{selected.homonymNumber && <sup>{selected.homonymNumber}</sup>}{selected.headword}</strong><span>{selected.classification || "Sin clasificar"}</span></div>
            <dl>
              <div><dt>Traducción</dt><dd>{selected.translationRaw || "Sin dato"}</dd></div>
              <div><dt>Acepciones</dt><dd>{selected.senses.length ? <ol>{selected.senses.map((sense, index) => <li key={`${index}-${sense}`}>{sense}</li>)}</ol> : "Sin dato"}</dd></div>
              <div><dt>Ejemplos y comentarios</dt><dd>{selected.examples.length ? selected.examples.map((example, index) => <p key={`${index}-${example}`}>{example}</p>) : "Sin dato"}</dd></div>
              <div><dt>Variantes y formas</dt><dd>{selected.variants.length ? <ul className="tag-list">{selected.variants.map((variant, index) => <li key={`${index}-${variant}`}>{variant}</li>)}</ul> : "Sin dato"}</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.sourceCode} · {selected.sourceDocument} · p. {selected.pageStart === selected.pageEnd ? selected.pageStart : `${selected.pageStart}–${selected.pageEnd}`}</dd></div>
              <div><dt>Estado</dt><dd>{selected.status} · cotejo pendiente</dd></div>
            </dl>
          </> : <p>Seleccione un registro.</p>}
        </aside>
      </div>
    </section>
  );
}
