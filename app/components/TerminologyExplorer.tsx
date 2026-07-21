"use client";

import { FormEvent, useEffect, useState } from "react";

type TermRecord = {
  term_id: string;
  term_es: string;
  term_es_normalized: string;
  grammatical_label: string;
  equivalents_rrm: string;
  raw_entry: string;
  source_code: string;
  source_document: string;
  source_section: string;
  pdf_page: number;
  printed_page: number;
  extraction_status: string;
  validation_status: string;
};

type TerminologyStats = {
  records: number;
  uniqueTerms: number;
  sourcePages: number;
  grammaticalLabels: number;
  printedPageMin: number;
  printedPageMax: number;
};

type LabelCount = { value: string; total: number };
const initials = "ABCDEFGHIJLMNOPQRSTUVYZ".split("");
const initialStats: TerminologyStats = { records: 2090, uniqueTerms: 2072, sourcePages: 50, grammaticalLabels: 22, printedPageMin: 81, printedPageMax: 130 };

export function TerminologyExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("Todos");
  const [initial, setInitial] = useState("Todas");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [records, setRecords] = useState<TermRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<TerminologyStats>(initialStats);
  const [labels, setLabels] = useState<LabelCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selected = records.find((record) => record.term_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", label, initial });
    if (query) params.set("q", query);
    fetch(`/api/terminology?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Error de consulta");
        return payload as { records: TermRecord[]; total: number; pages: number; stats: TerminologyStats; labels: LabelCount[] };
      })
      .then((payload) => {
        setRecords(payload.records);
        setTotal(payload.total);
        setPages(payload.pages);
        setStats(payload.stats);
        setLabels(payload.labels);
        setSelectedId((current) => payload.records.some((record) => record.term_id === current) ? current : (payload.records[0]?.term_id ?? ""));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setRecords([]);
        setError(cause instanceof Error ? cause.message : "Error de consulta");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [initial, label, page, query, revision]);

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

  function exportData(format: "csv" | "jsonl") {
    const params = new URLSearchParams({ format, label, initial });
    if (query) params.set("q", query);
    window.location.href = `/api/terminology?${params}`;
  }

  return (
    <section className="lexicon-module terminology-module" aria-label="Base terminológica español-rarámuri">
      <h2>Cobertura</h2>
      <div className="metric-grid compact terminology-metrics">
        <div><span>Registros</span><strong>{stats.records.toLocaleString("es-MX")}</strong></div>
        <div><span>Términos únicos</span><strong>{stats.uniqueTerms.toLocaleString("es-MX")}</strong></div>
        <div><span>Páginas fuente</span><strong>{stats.sourcePages}</strong></div>
        <div><span>Etiquetas</span><strong>{stats.grammaticalLabels}</strong></div>
      </div>

      <div className="parallel-note terminology-note"><strong>Fuente</strong><p>Segunda sección “ESPAÑOL - TARAHUMARA”, páginas impresas {stats.printedPageMin}–{stats.printedPageMax}. Extracción OCR completa; cotejo académico pendiente.</p></div>

      <h2>Consulta</h2>
      <form className="query-form terminology-query" onSubmit={search}>
        <label><span>Texto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Término español o equivalente rarámuri" /></label>
        <label><span>Etiqueta</span><select value={label} onChange={(event) => applyFilter(setLabel, event.target.value)}><option>Todos</option>{labels.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <label><span>Inicial</span><select value={initial} onChange={(event) => applyFilter(setInitial, event.target.value)}><option>Todas</option>{initials.map((value) => <option key={value}>{value}</option>)}</select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
      </form>

      <h2>Registros terminológicos</h2>
      <div className="lexicon-layout terminology-layout">
        <div>
          <div className="data-table terminology-table" role="table" aria-label="Términos español-rarámuri">
            <div className="table-header" role="row"><span>ID</span><span>Término ES</span><span>Etiqueta</span><span>Equivalente RRM</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && records.map((record) => (
              <button type="button" role="row" key={record.term_id} className={record.term_id === selected?.term_id ? "selected" : ""} onClick={() => setSelectedId(record.term_id)}>
                <code>{record.term_id}</code>
                <strong>{record.term_es}</strong>
                <span>{record.grammatical_label}</span>
                <span lang="tar">{record.equivalents_rrm}</span>
                <span>{record.printed_page}</span>
              </button>
            ))}
            {!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} registros</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>

        <aside className="record-panel terminology-record-panel">
          <h3>Registro terminológico</h3>
          {selected ? <>
            <div className="record-title"><code>{selected.term_id}</code><strong>{selected.term_es}</strong><span>{selected.grammatical_label}</span></div>
            <div className="terminology-equivalent"><span>RRM</span><p lang="tar">{selected.equivalents_rrm}</p></div>
            <dl>
              <div><dt>Sección</dt><dd>{selected.source_section}</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.source_code} · p. impresa {selected.printed_page} · p. PDF {selected.pdf_page}</dd></div>
              <div><dt>Extracción</dt><dd>{selected.extraction_status}</dd></div>
              <div><dt>Validación</dt><dd>{selected.validation_status}</dd></div>
              <div><dt>Entrada conservada</dt><dd>{selected.raw_entry}</dd></div>
            </dl>
          </> : <p>Seleccione un registro.</p>}
        </aside>
      </div>
    </section>
  );
}
