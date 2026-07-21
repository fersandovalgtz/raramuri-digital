"use client";

import { FormEvent, useEffect, useState } from "react";

type AdvancedRecord = {
  advanced_id: string; product_id: number; product_name: string; record_type: string; form: string; normalized_form: string;
  related_form: string; label: string; subtype: string; description: string; relation_type: string; target_id: string; target_type: string;
  entity_id: string; entry_id: string; related_entry_ids: string[]; text_rrm: string; text_spa: string; evidence: string; tags: string[];
  score: number; rank: number; record_count: number; example_count: number; form_count: number; sense_count: number;
  token_count_rrm: number; token_count_spa: number; route: string; source_code: string; source_document: string;
  page_start: number; page_end: number; method: string; confidence: string; validation_status: string;
};
type Stats = { records: number; entries: number; pages: number; labels: number; resolved: number; fields: number; senses: number; categories: number; withEvidence: number; maxScore: number; initialA: number; initialB: number; products: number; auditedRecords: number };
type Facet = { value: string; total: number };

const notes: Record<number, string> = {
  21: "Solo incluye la instrucción documental explícita “véase”. La forma destino se resuelve contra el índice normalizado de P-01.",
  22: "Ocho campos controlados. La asignación usa coincidencias léxicas en traducciones y acepciones; requiere validación semántica.",
  23: "Cada registro es una relación Entry→Category, Entry→Sense o Entry→Field, con identificadores persistentes.",
  24: "El puntaje suma ejemplos y formas etiquetadas distintas. No equivale a frecuencia de uso comunitario.",
  25: "La clave usa NFC, conserva el acento y normaliza los signos de saltillo a U+02BC antes de ordenar.",
  26: "Candidatos obtenidos por campos concretos y vocabulario de objetos; no sustituyen la decisión editorial.",
  27: "Candidatos obtenidos por vocabulario abstracto y clases funcionales; se excluyen candidatos concretos de P-26.",
  28: "Pares 1:1 breves, alineados y con confianza alta o media; se excluyen marcadores de complejidad.",
  29: "Pares seleccionados por extensión, estructura de alineación, ausencia de contraparte o marcadores lingüísticos.",
  30: "Una fila por producto audita ruta, unidad, conteo, fuente mínima, página, proceso y estado de validación.",
};
const emptyStats: Stats = { records: 0, entries: 0, pages: 0, labels: 0, resolved: 0, fields: 0, senses: 0, categories: 0, withEvidence: 0, maxScore: 0, initialA: 0, initialB: 0, products: 0, auditedRecords: 0 };

function metricCards(productId: number, stats: Stats): Array<[string, number]> {
  if (productId === 21) return [["Remisiones", stats.records], ["Resueltas", stats.resolved], ["Entradas fuente", stats.entries], ["Páginas", stats.pages]];
  if (productId === 22) return [["Asignaciones", stats.records], ["Campos", stats.fields], ["Entradas", stats.entries], ["Páginas", stats.pages]];
  if (productId === 23) return [["Relaciones", stats.records], ["Categorías", stats.categories], ["Acepciones", stats.senses], ["Entradas", stats.entries]];
  if (productId === 24) return [["Entradas", stats.records], ["Con evidencia", stats.withEvidence], ["Puntaje máximo", stats.maxScore], ["Páginas", stats.pages]];
  if (productId === 25) return [["Entradas", stats.records], ["Iniciales", stats.labels], ["Páginas", stats.pages], ["Cobertura", stats.entries]];
  if (productId === 28) return [["Ejemplos", stats.records], ["Inicial A", stats.initialA], ["Inicial B", stats.initialB], ["Entradas", stats.entries]];
  if (productId === 30) return [["Productos", stats.products], ["Registros auditados", stats.auditedRecords], ["Rutas", stats.records], ["Fuentes", 2]];
  return [["Registros", stats.records], ["Entradas", stats.entries], ["Categorías", stats.labels], ["Páginas", stats.pages]];
}

export function AdvancedProductExplorer({ productId }: { productId: number }) {
  const [draft, setDraft] = useState(""); const [query, setQuery] = useState(""); const [label, setLabel] = useState("Todos");
  const [subtype, setSubtype] = useState("Todos"); const [relation, setRelation] = useState("Todos"); const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0); const [pages, setPages] = useState(1); const [records, setRecords] = useState<AdvancedRecord[]>([]);
  const [total, setTotal] = useState(0); const [stats, setStats] = useState<Stats>(emptyStats); const [labels, setLabels] = useState<Facet[]>([]);
  const [subtypes, setSubtypes] = useState<Facet[]>([]); const [relations, setRelations] = useState<Facet[]>([]); const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const selected = records.find((record) => record.advanced_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ product: String(productId), page: String(page), limit: "50", label, subtype, relation }); if (query) params.set("q", query);
    fetch(`/api/advanced-products?${params}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Error de consulta"); return payload as { records: AdvancedRecord[]; total: number; pages: number; stats: Stats; labels: Facet[]; subtypes: Facet[]; relations: Facet[] }; })
      .then((payload) => { setRecords(payload.records); setTotal(payload.total); setPages(payload.pages); setStats(payload.stats); setLabels(payload.labels); setSubtypes(payload.subtypes); setRelations(payload.relations); setSelectedId((current) => payload.records.some((record) => record.advanced_id === current) ? current : (payload.records[0]?.advanced_id ?? "")); })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === "AbortError") return; setRecords([]); setError(cause instanceof Error ? cause.message : "Error de consulta"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [label, page, productId, query, relation, revision, subtype]);

  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setQuery(draft.trim()); setPage(1); setRevision((value) => value + 1); }
  function applyFilter(setter: (value: string) => void, value: string) { setLoading(true); setError(""); setter(value); setPage(1); }
  function changePage(next: number) { setLoading(true); setError(""); setPage(next); }
  function exportData(format: "csv" | "jsonl") { const params = new URLSearchParams({ product: String(productId), format, label, subtype, relation }); if (query) params.set("q", query); window.location.href = `/api/advanced-products?${params}`; }

  return <section className="lexicon-module inventory-module advanced-module" aria-label={`Producto ${productId}: conjunto consultable`}>
    <h2>Cobertura</h2>
    <div className="metric-grid compact inventory-metrics">{metricCards(productId, stats).map(([name, value]) => <div key={name}><span>{name}</span><strong>{Number(value).toLocaleString("es-MX")}</strong></div>)}</div>
    <div className="parallel-note inventory-note"><strong>Regla de inclusión</strong><p>{notes[productId]} Cada fila expone entidad, evidencia, fuente, página, método y estado de validación.</p></div>
    <h2>Consulta</h2>
    <form className="query-form inventory-query" onSubmit={search}>
      <label><span>Forma, relación, texto o ID</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Lema, campo, PAR-, RD- o ADV-" /></label>
      <label><span>Etiqueta</span><select value={label} onChange={(event) => applyFilter(setLabel, event.target.value)}><option>Todos</option>{labels.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <label><span>Subtipo</span><select value={subtype} onChange={(event) => applyFilter(setSubtype, event.target.value)}><option>Todos</option>{subtypes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <label><span>Relación</span><select value={relation} onChange={(event) => applyFilter(setRelation, event.target.value)}><option>Todos</option>{relations.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <button type="submit">Buscar</button><div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
    </form>
    <h2>Registros</h2>
    <div className="lexicon-layout inventory-layout"><div>
      <div className="data-table inventory-table advanced-table" role="table" aria-label="Registros derivados">
        <div className="table-header" role="row"><span>ID</span><span>Elemento</span><span>Relación / contenido</span><span>Etiqueta</span><span>Índice</span><span>Entidad</span><span>Página</span></div>
        {loading && <p className="table-message">Consultando…</p>}{error && <p className="table-message error">{error}</p>}
        {!loading && !error && records.map((record) => <button type="button" role="row" key={record.advanced_id} className={record.advanced_id === selected?.advanced_id ? "selected" : ""} onClick={() => setSelectedId(record.advanced_id)}>
          <code>{record.advanced_id}</code><strong lang="tar">{record.form}</strong><span>{record.related_form || record.text_spa || record.description}</span><em>{record.label}</em><span>{record.rank ? `#${record.rank}` : record.score || record.record_count || "—"}</span><code>{record.entity_id || record.entry_id}</code><span>{record.page_start === record.page_end ? record.page_start : `${record.page_start}–${record.page_end}`}</span>
        </button>)}{!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
      </div>
      <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} registros</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
    </div><aside className="record-panel inventory-record-panel advanced-record-panel"><h3>Registro derivado</h3>{selected ? <>
      <div className="inventory-record-title"><code>{selected.advanced_id}</code><strong lang="tar">{selected.form}</strong><span>{selected.label}</span></div>
      {selected.text_rrm && <div className="aligned-example"><span>Rarámuri</span><p lang="tar">{selected.text_rrm}</p><span>Español</span><p>{selected.text_spa || "Sin contraparte"}</p></div>}
      {selected.related_form && <div className="inventory-related"><span>Destino / categoría</span><strong>{selected.related_form}</strong></div>}
      <dl><div><dt>Tipo</dt><dd>{selected.record_type} · {selected.subtype || "Sin subtipo"}</dd></div>
        {selected.relation_type && <div><dt>Relación</dt><dd><code>{selected.relation_type}</code> → {selected.target_id || "sin destino"} ({selected.target_type})</dd></div>}
        {selected.description && <div><dt>Descripción</dt><dd>{selected.description}</dd></div>}
        {(selected.rank > 0 || selected.score > 0 || selected.record_count > 0) && <div><dt>Métrica</dt><dd>{selected.rank ? `rango ${selected.rank}; ` : ""}{selected.score ? `puntaje ${selected.score}; ` : ""}{selected.record_count ? `${selected.record_count.toLocaleString("es-MX")} registros` : ""}</dd></div>}
        {selected.tags.length > 0 && <div><dt>Etiquetas</dt><dd>{selected.tags.join(" · ")}</dd></div>}
        <div><dt>Evidencia</dt><dd>{selected.evidence || "Registro estructural"}</dd></div><div><dt>Método</dt><dd>{selected.method}</dd></div>
        <div><dt>Procedencia</dt><dd>{selected.entry_id || selected.entity_id} · {selected.source_code} · {selected.source_document} · p. {selected.page_start === selected.page_end ? selected.page_start : `${selected.page_start}–${selected.page_end}`}</dd></div>
        <div><dt>Validación</dt><dd>{selected.validation_status}{selected.confidence ? ` · confianza ${selected.confidence}` : ""}</dd></div></dl>
    </> : <p>Seleccione un registro.</p>}</aside></div>
  </section>;
}
