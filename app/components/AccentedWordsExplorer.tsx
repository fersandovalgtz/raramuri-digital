"use client";

import { FormEvent, useEffect, useState } from "react";

type AccentRecord = {
  accent_id: string; form: string; normalized_form: string; base_form: string; accented_vowels: string[]; accent_count: number;
  accent_indexes: number[]; accent_position: string; vowel_ordinals_from_start: number[]; vowel_ordinals_from_end: number[];
  source_field: string; context_index: number; context: string; source_context: string; pair_id: string;
  alignment_status: string; alignment_confidence: string; entry_id: string; headword: string; classification: string;
  translation: string; document_frequency: number; entry_frequency: number; source_code: string; source_document: string;
  page_start: number; page_end: number; source_status: string; validation_status: string;
};
type AccentStats = { records: number; uniqueForms: number; sourceEntries: number; entriesWithAccents: number; headwordOccurrences: number; variantOccurrences: number; exampleOccurrences: number; initial: number; medial: number; final: number; multiple: number };
type VowelCount = { value: string; total: number };
const initialStats: AccentStats = { records: 3433, uniqueForms: 2152, sourceEntries: 2581, entriesWithAccents: 1873, headwordOccurrences: 1765, variantOccurrences: 186, exampleOccurrences: 1482, initial: 15, medial: 1300, final: 2073, multiple: 45 };

function AccentedForm({ value }: { value: string }) {
  return <>{[...value].map((character, index) => /[áéíóú]/iu.test(character) ? <mark key={`${character}-${index}`}>{character}</mark> : character)}</>;
}

function Context({ record }: { record: AccentRecord }) {
  const before = record.context.slice(0, record.context_index);
  const token = record.context.slice(record.context_index, record.context_index + record.form.length);
  const after = record.context.slice(record.context_index + record.form.length);
  return <p lang="tar">{before}<strong><AccentedForm value={token} /></strong>{after}</p>;
}

export function AccentedWordsExplorer() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("forms");
  const [field, setField] = useState("Todos");
  const [position, setPosition] = useState("Todos");
  const [vowel, setVowel] = useState("Todas");
  const [confidence, setConfidence] = useState("Todos");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pages, setPages] = useState(1);
  const [records, setRecords] = useState<AccentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<AccentStats>(initialStats);
  const [vowels, setVowels] = useState<VowelCount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selected = records.find((record) => record.accent_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "50", mode, field, position, vowel, confidence });
    if (query) params.set("q", query);
    fetch(`/api/accented-words?${params}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Error de consulta"); return payload as { records: AccentRecord[]; total: number; pages: number; stats: AccentStats; vowels: VowelCount[] }; })
      .then((payload) => { setRecords(payload.records); setTotal(payload.total); setPages(payload.pages); setStats(payload.stats); setVowels(payload.vowels); setSelectedId((current) => payload.records.some((record) => record.accent_id === current) ? current : (payload.records[0]?.accent_id ?? "")); })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === "AbortError") return; setRecords([]); setError(cause instanceof Error ? cause.message : "Error de consulta"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [confidence, field, mode, page, position, query, revision, vowel]);

  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setQuery(draft.trim()); setPage(1); setRevision((value) => value + 1); }
  function applyFilter(setter: (value: string) => void, value: string) { setLoading(true); setError(""); setter(value); setPage(1); }
  function changePage(next: number) { setLoading(true); setError(""); setPage(next); }
  function exportData(format: "csv" | "jsonl") { const params = new URLSearchParams({ format, mode, field, position, vowel, confidence }); if (query) params.set("q", query); window.location.href = `/api/accented-words?${params}`; }

  return (
    <section className="lexicon-module accent-module" aria-label="Repositorio de palabras acentuadas">
      <h2>Cobertura</h2>
      <div className="metric-grid compact accent-metrics">
        <div><span>Formas normalizadas</span><strong>{stats.uniqueForms.toLocaleString("es-MX")}</strong></div>
        <div><span>Ocurrencias</span><strong>{stats.records.toLocaleString("es-MX")}</strong></div>
        <div><span>Entradas</span><strong>{stats.entriesWithAccents.toLocaleString("es-MX")}</strong></div>
        <div><span>En ejemplos RRM</span><strong>{stats.exampleOccurrences.toLocaleString("es-MX")}</strong></div>
      </div>
      <div className="parallel-note accent-note"><strong>Convención registrada</strong><p>Se detectan vocales con acento agudo en lemas, variantes y segmentos rarámuri de P-03. Se registra posición gráfica y ordinal vocálico; no se infiere división silábica ni regla prosódica sin validación lingüística.</p></div>
      <div className="accent-vowel-distribution" aria-label="Distribución de vocales acentuadas">{(vowels.length ? vowels : [{ value: "á", total: 1022 }, { value: "é", total: 820 }, { value: "í", total: 972 }, { value: "ó", total: 353 }, { value: "ú", total: 311 }]).map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.total.toLocaleString("es-MX")}</span></div>)}</div>

      <h2>Consulta</h2>
      <form className="query-form accent-query" onSubmit={search}>
        <label><span>Forma, lema o contexto</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="rarámuri, RD-000000, traducción" /></label>
        <label><span>Unidad</span><select value={mode} onChange={(event) => applyFilter(setMode, event.target.value)}><option value="forms">Formas únicas</option><option value="occurrences">Ocurrencias</option></select></label>
        <label><span>Campo</span><select value={field} onChange={(event) => applyFilter(setField, event.target.value)}><option>Todos</option><option>Lema</option><option>Variante</option><option>Ejemplo RRM</option></select></label>
        <label><span>Vocal</span><select value={vowel} onChange={(event) => applyFilter(setVowel, event.target.value)}><option>Todas</option>{vowels.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
        <label><span>Posición</span><select value={position} onChange={(event) => applyFilter(setPosition, event.target.value)}><option>Todos</option><option>Inicial</option><option>Medial</option><option>Final</option><option>Múltiple</option></select></label>
        <label><span>Confianza P-03</span><select value={confidence} onChange={(event) => applyFilter(setConfidence, event.target.value)}><option>Todos</option><option>No aplica</option><option>Alta</option><option>Media</option><option>Baja</option></select></label>
        <button type="submit">Buscar</button>
        <div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
      </form>

      <h2>Formas acentuadas</h2>
      <div className="lexicon-layout accent-layout">
        <div>
          <div className="data-table accent-table" role="table" aria-label="Palabras rarámuri acentuadas">
            <div className="table-header" role="row"><span>ID</span><span>Forma</span><span>Vocal</span><span>Posición</span><span>Campo</span><span>Frecuencia</span><span>Página</span></div>
            {loading && <p className="table-message">Consultando…</p>}
            {error && <p className="table-message error">{error}</p>}
            {!loading && !error && records.map((record) => (
              <button type="button" role="row" key={record.accent_id} className={record.accent_id === selected?.accent_id ? "selected" : ""} onClick={() => setSelectedId(record.accent_id)}>
                <code>{record.accent_id}</code><strong lang="tar"><AccentedForm value={record.normalized_form} /></strong><span>{record.accented_vowels.join(" · ")}</span><em>{record.accent_position}</em><span>{record.source_field}</span><span>{record.document_frequency}</span><span>{record.page_start === record.page_end ? record.page_start : `${record.page_start}–${record.page_end}`}</span>
              </button>
            ))}
            {!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
          </div>
          <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} {mode === "forms" ? "formas" : "ocurrencias"}</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
        </div>
        <aside className="record-panel accent-record-panel">
          <h3>Registro ortográfico</h3>
          {selected ? <>
            <div className="accent-form"><code>{selected.accent_id}</code><strong lang="tar"><AccentedForm value={selected.normalized_form} /></strong><span>Base sin diacríticos: {selected.base_form}</span></div>
            <div className="accent-context"><span>Contexto rarámuri</span><Context record={selected} /></div>
            <dl>
              <div><dt>Acento gráfico</dt><dd>{selected.accented_vowels.join(" · ")} · {selected.accent_position} · carácter{selected.accent_count === 1 ? "" : "es"} {selected.accent_indexes.map((index) => index + 1).join(", ")}</dd></div>
              <div><dt>Orden vocálico</dt><dd>Desde inicio: {selected.vowel_ordinals_from_start.join(", ")} · desde final: {selected.vowel_ordinals_from_end.join(", ")}</dd></div>
              <div><dt>Frecuencia</dt><dd>{selected.document_frequency} ocurrencias · {selected.entry_frequency} entradas</dd></div>
              <div><dt>Entrada</dt><dd>{selected.entry_id} · {selected.headword} · {selected.classification || "Sin clasificar"}</dd></div>
              <div><dt>Traducción</dt><dd>{selected.translation}</dd></div>
              {selected.pair_id && <div><dt>Alineación P-03</dt><dd>{selected.pair_id} · {selected.alignment_status} · confianza {selected.alignment_confidence.toLocaleLowerCase("es")}</dd></div>}
              <div><dt>Procedencia</dt><dd>{selected.source_field} · {selected.source_code} · {selected.source_document} · p. {selected.page_start === selected.page_end ? selected.page_start : `${selected.page_start}–${selected.page_end}`}</dd></div>
              <div><dt>Validación</dt><dd>{selected.validation_status}</dd></div>
            </dl>
          </> : <p>Seleccione una forma.</p>}
        </aside>
      </div>
    </section>
  );
}
