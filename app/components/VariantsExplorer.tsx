"use client";

import { FormEvent, useEffect, useState } from "react";

type VariantRecord = {
  variant_id: string; form_a: string; form_b: string; pattern: string; relation_type: string;
  derivation_method: string; entry_id: string; entry_ids: string[]; related_entry_id: string;
  classification: string; evidence: string; source_code: string; source_document: string;
  page_start: number; page_end: number; source_status: string; validation_status: string;
};
type VariantStats = { records: number; graphic: number; explicit: number; detected: number; inflection: number; crossReferences: number; sourceEntries: number; annotatedEntries: number };
type Facet = { value: string; total: number };

const initialStats: VariantStats = { records: 829, graphic: 602, explicit: 54, detected: 548, inflection: 225, crossReferences: 2, sourceEntries: 2581, annotatedEntries: 221 };

export function VariantsExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [relation, setRelation] = useState("Gráfica");
  const [pattern, setPattern] = useState("Todos");
  const [method, setMethod] = useState("Todos");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [records, setRecords] = useState<VariantRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<VariantStats>(initialStats);
  const [patterns, setPatterns] = useState<Facet[]>([]);
  const [methods, setMethods] = useState<Facet[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selected = records.find((record) => record.variant_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", relation, pattern, method });
    if (query) params.set("q", query);
    fetch(`/api/variants?${params}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Error de consulta"); return payload as { records: VariantRecord[]; total: number; pages: number; stats: VariantStats; patterns: Facet[]; methods: Facet[] }; })
      .then((payload) => {
        setRecords(payload.records); setTotal(payload.total); setPages(payload.pages); setStats(payload.stats); setPatterns(payload.patterns); setMethods(payload.methods);
        setSelectedId((current) => payload.records.some((record) => record.variant_id === current) ? current : (payload.records[0]?.variant_id ?? ""));
      })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === "AbortError") return; setRecords([]); setError(cause instanceof Error ? cause.message : "Error de consulta"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [method, page, pattern, query, relation, revision]);

  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setQuery(draft.trim()); setPage(1); setRevision((value) => value + 1); }
  function applyFilter(setter: (value: string) => void, value: string) { setLoading(true); setError(""); setter(value); setPage(1); }
  function changePage(next: number) { setLoading(true); setError(""); setPage(next); }
  function exportData(format: "csv" | "jsonl") { const params = new URLSearchParams({ format, relation, pattern, method }); if (query) params.set("q", query); window.location.href = `/api/variants?${params}`; }

  return (
    <section className="lexicon-module variants-module" aria-label="Base de variantes gráficas">
      <h2>Cobertura</h2>
      <div className="metric-grid compact variants-metrics">
        <div><span>Relaciones gráficas</span><strong>{stats.graphic.toLocaleString("es-MX")}</strong></div>
        <div><span>Explícitas</span><strong>{stats.explicit.toLocaleString("es-MX")}</strong></div>
        <div><span>Detectadas</span><strong>{stats.detected.toLocaleString("es-MX")}</strong></div>
        <div><span>Anotaciones fuente</span><strong>{stats.annotatedEntries.toLocaleString("es-MX")}</strong></div>
      </div>
      <div className="parallel-note variants-note"><strong>Control de clasificación</strong><p>Las relaciones gráficas, las {stats.inflection} formas flexivas y las {stats.crossReferences} remisiones se almacenan por separado. Las {stats.detected} coincidencias automáticas son candidatos formales y requieren cotejo lingüístico.</p></div>

      <h2>Consulta</h2>
      <form className="query-form variants-query" onSubmit={search}>
        <label><span>Forma o registro</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="rarámuri, patrón, RD-000000" /></label>
        <label><span>Relación</span><select value={relation} onChange={(event) => applyFilter(setRelation, event.target.value)}><option>Todos</option><option>Gráfica</option><option>Flexión</option><option>Remisión</option></select></label>
        <label><span>Patrón</span><select value={pattern} onChange={(event) => applyFilter(setPattern, event.target.value)}><option>Todos</option>{patterns.filter((item) => relation === "Todos" || relation !== "Gráfica" || ["r/l", "g/c", "i/e", "ba/hua", "Ø/C inicial", "Otra relación explícita"].includes(item.value)).map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <label><span>Método</span><select value={method} onChange={(event) => applyFilter(setMethod, event.target.value)}><option>Todos</option>{methods.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
      </form>

      <h2>Relaciones</h2>
      <div className="lexicon-layout variants-layout">
        <div>
          <div className="data-table variants-table" role="table" aria-label="Relaciones entre variantes gráficas">
            <div className="table-header" role="row"><span>ID</span><span>Forma A</span><span>Forma B</span><span>Patrón</span><span>Método</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && records.map((record) => (
              <button type="button" role="row" key={record.variant_id} className={record.variant_id === selected?.variant_id ? "selected" : ""} onClick={() => setSelectedId(record.variant_id)}>
                <code>{record.variant_id}</code><strong lang="tar">{record.form_a}</strong><strong lang="tar">{record.form_b}</strong><span>{record.pattern}</span><em className={record.derivation_method.startsWith("Comparación") ? "review" : "aligned"}>{record.derivation_method.startsWith("Comparación") ? "CANDIDATA" : "DOCUMENTADA"}</em><span>{record.page_start === record.page_end ? record.page_start : `${record.page_start}–${record.page_end}`}</span>
              </button>
            ))}
            {!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} relaciones</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>
        <aside className="record-panel variants-record-panel">
          <h3>Relación de variantes</h3>
          {selected ? <>
            <div className="variant-pair"><code>{selected.variant_id}</code><div><strong lang="tar">{selected.form_a}</strong><span>↔</span><strong lang="tar">{selected.form_b}</strong></div><em>{selected.pattern}</em></div>
            <dl>
              <div><dt>Tipo</dt><dd>{selected.relation_type}</dd></div>
              <div><dt>Método</dt><dd>{selected.derivation_method}</dd></div>
              <div><dt>Entradas</dt><dd>{selected.entry_ids.join(" · ")}</dd></div>
              <div><dt>Clase</dt><dd>{selected.classification || "Sin clasificar"}</dd></div>
              <div><dt>Evidencia</dt><dd>{selected.evidence}</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.source_code} · {selected.source_document} · p. {selected.page_start === selected.page_end ? selected.page_start : `${selected.page_start}–${selected.page_end}`}</dd></div>
              <div><dt>Validación</dt><dd>{selected.validation_status}</dd></div>
            </dl>
          </> : <p>Seleccione una relación.</p>}
        </aside>
      </div>
    </section>
  );
}
