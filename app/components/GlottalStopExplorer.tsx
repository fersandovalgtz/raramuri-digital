"use client";

import { FormEvent, useEffect, useState } from "react";

type SaltilloRecord = {
  saltillo_id: string; form: string; normalized_form: string; saltillo_glyphs: string[]; saltillo_count: number;
  position: string; saltillo_indexes: number[]; source_field: string; context_index: number; context: string;
  entry_id: string; headword: string; classification: string; classification_family: string; translation: string;
  document_frequency: number; entry_frequency: number; source_code: string; source_document: string;
  page_start: number; page_end: number; source_status: string; validation_status: string;
};
type SaltilloStats = { records: number; uniqueForms: number; sourceEntries: number; entriesWithSaltillo: number; headwordOccurrences: number; variantOccurrences: number; exampleOccurrences: number; initial: number; medial: number; final: number; multiple: number };
type GlyphCount = { value: string; total: number };
const initialStats: SaltilloStats = { records: 835, uniqueForms: 532, sourceEntries: 2581, entriesWithSaltillo: 508, headwordOccurrences: 392, variantOccurrences: 53, exampleOccurrences: 390, initial: 98, medial: 733, final: 3, multiple: 1 };

function Context({ record }: { record: SaltilloRecord }) {
  const before = record.context.slice(0, record.context_index);
  const token = record.context.slice(record.context_index, record.context_index + record.form.length);
  const after = record.context.slice(record.context_index + record.form.length);
  return <p lang="tar">{before}<mark>{token}</mark>{after}</p>;
}

export function GlottalStopExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("forms");
  const [field, setField] = useState("Todos");
  const [position, setPosition] = useState("Todos");
  const [glyph, setGlyph] = useState("Todos");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [records, setRecords] = useState<SaltilloRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<SaltilloStats>(initialStats);
  const [glyphs, setGlyphs] = useState<GlyphCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selected = records.find((record) => record.saltillo_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", mode, field, position, glyph });
    if (query) params.set("q", query);
    fetch(`/api/glottal-stop-words?${params}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Error de consulta"); return payload as { records: SaltilloRecord[]; total: number; pages: number; stats: SaltilloStats; glyphs: GlyphCount[] }; })
      .then((payload) => { setRecords(payload.records); setTotal(payload.total); setPages(payload.pages); setStats(payload.stats); setGlyphs(payload.glyphs); setSelectedId((current) => payload.records.some((record) => record.saltillo_id === current) ? current : (payload.records[0]?.saltillo_id ?? "")); })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === "AbortError") return; setRecords([]); setError(cause instanceof Error ? cause.message : "Error de consulta"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [field, glyph, mode, page, position, query, revision]);

  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setQuery(draft.trim()); setPage(1); setRevision((value) => value + 1); }
  function applyFilter(setter: (value: string) => void, value: string) { setLoading(true); setError(""); setter(value); setPage(1); }
  function changePage(next: number) { setLoading(true); setError(""); setPage(next); }
  function exportData(format: "csv" | "jsonl") { const params = new URLSearchParams({ format, mode, field, position, glyph }); if (query) params.set("q", query); window.location.href = `/api/glottal-stop-words?${params}`; }

  return (
    <section className="lexicon-module saltillo-module" aria-label="Repositorio de palabras con saltillo">
      <h2>Cobertura</h2>
      <div className="metric-grid compact saltillo-metrics">
        <div><span>Formas normalizadas</span><strong>{stats.uniqueForms.toLocaleString("es-MX")}</strong></div>
        <div><span>Ocurrencias</span><strong>{stats.records.toLocaleString("es-MX")}</strong></div>
        <div><span>Entradas</span><strong>{stats.entriesWithSaltillo.toLocaleString("es-MX")}</strong></div>
        <div><span>En ejemplos</span><strong>{stats.exampleOccurrences.toLocaleString("es-MX")}</strong></div>
      </div>
      <div className="parallel-note saltillo-note"><strong>Normalización</strong><p>Se conservan las grafías fuente y se agrega una forma de consulta con saltillo U+02BC: 98 ocurrencias iniciales, 733 mediales, 3 finales y 1 múltiple. El cotejo ortográfico y fonológico está pendiente.</p></div>

      <h2>Consulta</h2>
      <form className="query-form saltillo-query" onSubmit={search}>
        <label><span>Forma, lema o contexto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="raʼíchari, RD-000000, traducción" /></label>
        <label><span>Unidad</span><select value={mode} onChange={(event) => applyFilter(setMode, event.target.value)}><option value="forms">Formas únicas</option><option value="occurrences">Ocurrencias</option></select></label>
        <label><span>Campo</span><select value={field} onChange={(event) => applyFilter(setField, event.target.value)}><option>Todos</option><option>Lema</option><option>Variante</option><option>Ejemplo</option></select></label>
        <label><span>Posición</span><select value={position} onChange={(event) => applyFilter(setPosition, event.target.value)}><option>Todos</option><option>Inicial</option><option>Medial</option><option>Final</option><option>Múltiple</option></select></label>
        <label><span>Grafía fuente</span><select value={glyph} onChange={(event) => applyFilter(setGlyph, event.target.value)}><option>Todos</option>{glyphs.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
      </form>

      <h2>Formas con saltillo</h2>
      <div className="lexicon-layout saltillo-layout">
        <div>
          <div className="data-table saltillo-table" role="table" aria-label="Palabras rarámuri con saltillo">
            <div className="table-header" role="row"><span>ID</span><span>Forma normalizada</span><span>Grafía fuente</span><span>Posición</span><span>Campo</span><span>Frecuencia</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && records.map((record) => (
              <button type="button" role="row" key={record.saltillo_id} className={record.saltillo_id === selected?.saltillo_id ? "selected" : ""} onClick={() => setSelectedId(record.saltillo_id)}>
                <code>{record.saltillo_id}</code><strong lang="tar">{record.normalized_form}</strong><span lang="tar">{record.form}</span><em>{record.position}</em><span>{record.source_field}</span><span>{record.document_frequency}</span><span>{record.page_start === record.page_end ? record.page_start : `${record.page_start}–${record.page_end}`}</span>
              </button>
            ))}
            {!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} {mode === "forms" ? "formas" : "ocurrencias"}</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>
        <aside className="record-panel saltillo-record-panel">
          <h3>Registro ortográfico</h3>
          {selected ? <>
            <div className="saltillo-form"><code>{selected.saltillo_id}</code><strong lang="tar">{selected.normalized_form}</strong><span>Fuente: {selected.form}</span></div>
            <div className="saltillo-context"><span>Contexto documental</span><Context record={selected} /></div>
            <dl>
              <div><dt>Saltillo</dt><dd>{selected.position} · {selected.saltillo_count} marca{selected.saltillo_count === 1 ? "" : "s"} · posición{selected.saltillo_count === 1 ? "" : "es"} {selected.saltillo_indexes.map((index) => index + 1).join(", ")}</dd></div>
              <div><dt>Grafía fuente</dt><dd>{selected.saltillo_glyphs.join(" · ")}</dd></div>
              <div><dt>Frecuencia</dt><dd>{selected.document_frequency} ocurrencias · {selected.entry_frequency} entradas</dd></div>
              <div><dt>Entrada</dt><dd>{selected.entry_id} · {selected.headword} · {selected.classification || "Sin clasificar"}</dd></div>
              <div><dt>Traducción</dt><dd>{selected.translation}</dd></div>
              <div><dt>Procedencia</dt><dd>{selected.source_field} · {selected.source_code} · {selected.source_document} · p. {selected.page_start === selected.page_end ? selected.page_start : `${selected.page_start}–${selected.page_end}`}</dd></div>
              <div><dt>Validación</dt><dd>{selected.validation_status}</dd></div>
            </dl>
          </> : <p>Seleccione una forma.</p>}
        </aside>
      </div>
    </section>
  );
}
