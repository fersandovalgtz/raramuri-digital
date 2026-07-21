"use client";

import { FormEvent, useEffect, useState } from "react";

type InventoryRecord = {
  inventory_id: string; product_id: number; product_name: string; record_type: string; form: string; normalized_form: string;
  related_form: string; label: string; subtype: string; classification: string; classification_family: string; translation: string;
  senses: string[]; sense_count: number; evidence: string; entry_id: string; related_entry_ids: string[]; homonym_number: number | null;
  group_key: string; relation_status: string; example_count: number; variant_count: number; source_code: string; source_document: string;
  page_start: number; page_end: number; source_status: string; validation_status: string;
};
type InventoryStats = { records: number; entries: number; pages: number; withExamples: number; multiSense: number; classes: number; explicitPairs: number; classifiedForms: number; past: number; future: number; plural: number; participles: number; gerunds: number; homonymEntries: number; polysemicEntries: number; combinedEntries: number; homonymGroups: number };
type Facet = { value: string; total: number };

const notes: Record<number, string> = {
  8: "Entradas cuya familia gramatical canónica es S.", 9: "Entradas cuya familia gramatical canónica es Vt.", 10: "Entradas cuya familia gramatical canónica es Vi.",
  11: "Entradas cuya familia gramatical canónica es Adj.", 12: "Entradas cuya familia gramatical canónica es Adv.", 13: "Entradas cuya familia gramatical canónica es Pron.",
  14: "Entradas cuya familia gramatical canónica es Interj.", 15: "Solo se incluyen marcas explícitas “reg.” o “reg.:” presentes en la fuente.",
  16: "Los pares proceden de etiquetas sing./pl.; las formas aisladas conservan la marca de clasificación sin inferir contraparte.",
  17: "Las formas se extraen de etiquetas pret./fut. y de clasificaciones temporales explícitas.",
  18: "Se incluyen entradas clasificadas como imperativo y formas asociadas a la marca imper. en comentarios.",
  19: "Se incluyen clasificaciones Pp, etiquetas pp y la única marca explícita de gerundio.",
  20: "La homonimia conserva la numeración de la fuente; la polisemia exige dos o más acepciones estructuradas.",
};
const emptyStats: InventoryStats = { records: 0, entries: 0, pages: 0, withExamples: 0, multiSense: 0, classes: 0, explicitPairs: 0, classifiedForms: 0, past: 0, future: 0, plural: 0, participles: 0, gerunds: 0, homonymEntries: 0, polysemicEntries: 0, combinedEntries: 0, homonymGroups: 0 };

function metricCards(productId: number, stats: InventoryStats) {
  if (productId === 16) return [["Registros", stats.records], ["Pares explícitos", stats.explicitPairs], ["Formas clasificadas", stats.classifiedForms], ["Entradas", stats.entries]];
  if (productId === 17) return [["Formas", stats.records], ["Pasado", stats.past], ["Futuro", stats.future], ["Entradas", stats.entries]];
  if (productId === 18) return [["Formas", stats.records], ["Entradas", stats.entries], ["Con ejemplos", stats.withExamples], ["Páginas", stats.pages]];
  if (productId === 19) return [["Formas", stats.records], ["Participios", stats.participles], ["Gerundios", stats.gerunds], ["Entradas", stats.entries]];
  if (productId === 20) return [["Entradas", stats.records], ["Homónimas", stats.homonymEntries], ["Polisémicas", stats.polysemicEntries], ["Claves normalizadas", stats.homonymGroups]];
  if (productId === 15) return [["Términos", stats.records], ["Familias", stats.classes], ["Páginas", stats.pages], ["Marcas explícitas", stats.records]];
  return [["Entradas", stats.records], ["Con ejemplos", stats.withExamples], ["Polisémicas", stats.multiSense], ["Páginas", stats.pages]];
}

export function InventoryExplorer({ productId }: { productId: number }) {
  const [draft, setDraft] = useState(""); const [query, setQuery] = useState("");
  const [label, setLabel] = useState("Todos"); const [subtype, setSubtype] = useState("Todos"); const [family, setFamily] = useState("Todos");
  const [page, setPage] = useState(1); const [revision, setRevision] = useState(0); const [pages, setPages] = useState(1);
  const [records, setRecords] = useState<InventoryRecord[]>([]); const [total, setTotal] = useState(0); const [stats, setStats] = useState<InventoryStats>(emptyStats);
  const [labels, setLabels] = useState<Facet[]>([]); const [subtypes, setSubtypes] = useState<Facet[]>([]); const [families, setFamilies] = useState<Facet[]>([]);
  const [selectedId, setSelectedId] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const selected = records.find((record) => record.inventory_id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ product: String(productId), page: String(page), limit: "50", label, subtype, family }); if (query) params.set("q", query);
    fetch(`/api/inventories?${params}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Error de consulta"); return payload as { records: InventoryRecord[]; total: number; pages: number; stats: InventoryStats; labels: Facet[]; subtypes: Facet[]; families: Facet[] }; })
      .then((payload) => { setRecords(payload.records); setTotal(payload.total); setPages(payload.pages); setStats(payload.stats); setLabels(payload.labels); setSubtypes(payload.subtypes); setFamilies(payload.families); setSelectedId((current) => payload.records.some((record) => record.inventory_id === current) ? current : (payload.records[0]?.inventory_id ?? "")); })
      .catch((cause: unknown) => { if (cause instanceof DOMException && cause.name === "AbortError") return; setRecords([]); setError(cause instanceof Error ? cause.message : "Error de consulta"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [family, label, page, productId, query, revision, subtype]);

  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setQuery(draft.trim()); setPage(1); setRevision((value) => value + 1); }
  function applyFilter(setter: (value: string) => void, value: string) { setLoading(true); setError(""); setter(value); setPage(1); }
  function changePage(next: number) { setLoading(true); setError(""); setPage(next); }
  function exportData(format: "csv" | "jsonl") { const params = new URLSearchParams({ product: String(productId), format, label, subtype, family }); if (query) params.set("q", query); window.location.href = `/api/inventories?${params}`; }

  return <section className="lexicon-module inventory-module" aria-label={`Producto ${productId}: inventario consultable`}>
    <h2>Cobertura</h2>
    <div className="metric-grid compact inventory-metrics">{metricCards(productId, stats).map(([name, value]) => <div key={name}><span>{name}</span><strong>{Number(value).toLocaleString("es-MX")}</strong></div>)}</div>
    <div className="parallel-note inventory-note"><strong>Regla de inclusión</strong><p>{notes[productId]} Todos los registros conservan entrada, clasificación, evidencia, fuente y página; la validación lingüística está pendiente.</p></div>
    <h2>Consulta</h2>
    <form className="query-form inventory-query" onSubmit={search}>
      <label><span>Forma, traducción o ID</span><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Lema, significado, RD-000000" /></label>
      <label><span>Etiqueta</span><select value={label} onChange={(event) => applyFilter(setLabel, event.target.value)}><option>Todos</option>{labels.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <label><span>Subtipo</span><select value={subtype} onChange={(event) => applyFilter(setSubtype, event.target.value)}><option>Todos</option>{subtypes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <label><span>Familia</span><select value={family} onChange={(event) => applyFilter(setFamily, event.target.value)}><option>Todos</option>{families.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}</select></label>
      <button type="submit">Buscar</button><div className="export-actions"><button type="button" className="secondary-button" onClick={() => exportData("csv")}>CSV</button><button type="button" className="secondary-button" onClick={() => exportData("jsonl")}>JSONL</button></div>
    </form>
    <h2>Registros</h2>
    <div className="lexicon-layout inventory-layout"><div>
      <div className="data-table inventory-table" role="table" aria-label="Registros del inventario">
        <div className="table-header" role="row"><span>ID</span><span>Forma</span><span>Relación / significado</span><span>Etiqueta</span><span>Clase</span><span>Entrada</span><span>Página</span></div>
        {loading && <p className="table-message">Consultando…</p>}{error && <p className="table-message error">{error}</p>}
        {!loading && !error && records.map((record) => <button type="button" role="row" key={record.inventory_id} className={record.inventory_id === selected?.inventory_id ? "selected" : ""} onClick={() => setSelectedId(record.inventory_id)}>
          <code>{record.inventory_id}</code><strong lang="tar">{record.form}</strong><span>{record.related_form || record.translation}</span><em>{record.label}</em><span>{record.classification || "—"}</span><code>{record.entry_id}</code><span>{record.page_start === record.page_end ? record.page_start : `${record.page_start}–${record.page_end}`}</span>
        </button>)}{!loading && !error && !records.length && <p className="table-message">Sin resultados.</p>}
      </div>
      <div className="pagination"><button type="button" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)}>Anterior</button><span>Página {page} / {pages} · {total.toLocaleString("es-MX")} registros</span><button type="button" disabled={page >= pages || loading} onClick={() => changePage(page + 1)}>Siguiente</button></div>
    </div><aside className="record-panel inventory-record-panel"><h3>Registro del inventario</h3>{selected ? <>
      <div className="inventory-record-title"><code>{selected.inventory_id}</code><strong lang="tar">{selected.form}</strong><span>{selected.label}</span></div>
      {selected.related_form && <div className="inventory-related"><span>Forma relacionada</span><strong lang="tar">{selected.related_form}</strong></div>}
      <dl><div><dt>Traducción</dt><dd>{selected.translation || "Sin traducción"}</dd></div>
        {selected.senses.length > 1 && <div><dt>Acepciones</dt><dd><ol>{selected.senses.map((sense, index) => <li key={`${sense}-${index}`}>{sense}</li>)}</ol></dd></div>}
        <div><dt>Tipo</dt><dd>{selected.record_type} · {selected.subtype} · {selected.relation_status}</dd></div>
        <div><dt>Entrada</dt><dd>{selected.entry_id} · {selected.classification || "Sin clasificar"}</dd></div>
        {selected.homonym_number != null && <div><dt>Homonimia</dt><dd>Número {selected.homonym_number} · clave {selected.group_key} · relacionados {selected.related_entry_ids.join(", ") || "sin resolución automática"}</dd></div>}
        <div><dt>Evidencia</dt><dd>{selected.evidence}</dd></div><div><dt>Procedencia</dt><dd>{selected.source_code} · {selected.source_document} · p. {selected.page_start === selected.page_end ? selected.page_start : `${selected.page_start}–${selected.page_end}`}</dd></div><div><dt>Validación</dt><dd>{selected.validation_status}</dd></div></dl>
    </> : <p>Seleccione un registro.</p>}</aside></div>
  </section>;
}
