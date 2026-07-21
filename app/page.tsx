"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  group: "Datos" | "Corpus" | "Inventarios" | "Análisis" | "Docencia";
};

type MasterEntry = {
  id: number;
  recordId: string;
  headword: string;
  headwordRaw: string;
  headwordNormalized: string;
  homonymNumber: number | null;
  classification: string;
  classificationFamily: string;
  translationRaw: string;
  senses: string[];
  examples: string[];
  variants: string[];
  commentsRaw: string;
  sourceCode: string;
  sourceDocument: string;
  pageStart: number;
  pageEnd: number;
  status: string;
};

type ClassificationCount = { value: string; total: number };

const products: Product[] = [
  { id: 1, title: "Base lexicográfica maestra", group: "Datos" },
  { id: 2, title: "Corpus digital rarámuri-español", group: "Corpus" },
  { id: 3, title: "Corpus paralelo de ejemplos", group: "Corpus" },
  { id: 4, title: "Base terminológica español-rarámuri", group: "Datos" },
  { id: 5, title: "Base de variantes gráficas", group: "Datos" },
  { id: 6, title: "Repositorio de palabras con saltillo", group: "Corpus" },
  { id: 7, title: "Repositorio de palabras acentuadas", group: "Corpus" },
  { id: 8, title: "Inventario de sustantivos", group: "Inventarios" },
  { id: 9, title: "Inventario de verbos transitivos", group: "Inventarios" },
  { id: 10, title: "Inventario de verbos intransitivos", group: "Inventarios" },
  { id: 11, title: "Inventario de adjetivos", group: "Inventarios" },
  { id: 12, title: "Inventario de adverbios", group: "Inventarios" },
  { id: 13, title: "Inventario de pronombres", group: "Inventarios" },
  { id: 14, title: "Inventario de interjecciones", group: "Inventarios" },
  { id: 15, title: "Inventario de términos regionales", group: "Inventarios" },
  { id: 16, title: "Inventario de singulares y plurales", group: "Inventarios" },
  { id: 17, title: "Inventario de formas de pasado y futuro", group: "Inventarios" },
  { id: 18, title: "Inventario de imperativos", group: "Inventarios" },
  { id: 19, title: "Inventario de gerundios y participios", group: "Inventarios" },
  { id: 20, title: "Base de homónimos y polisemia", group: "Análisis" },
  { id: 21, title: "Base de remisiones internas", group: "Análisis" },
  { id: 22, title: "Tesauro temático", group: "Análisis" },
  { id: 23, title: "Ontología léxica inicial", group: "Análisis" },
  { id: 24, title: "Índice de frecuencia documental", group: "Análisis" },
  { id: 25, title: "Índice alfabético normalizado", group: "Corpus" },
  { id: 26, title: "Catálogo de palabras ilustrables", group: "Docencia" },
  { id: 27, title: "Catálogo de palabras abstractas", group: "Docencia" },
  { id: 28, title: "Ejemplos para enseñanza inicial", group: "Docencia" },
  { id: 29, title: "Ejemplos para análisis lingüístico", group: "Análisis" },
  { id: 30, title: "Sistema interno de trazabilidad", group: "Datos" },
];

const filters = ["Todos", "Datos", "Corpus", "Inventarios", "Análisis", "Docencia"] as const;

const schemaFields = [
  ["lemma", "Forma de entrada"],
  ["pos", "Clase gramatical"],
  ["translation[]", "Equivalentes en español"],
  ["sense[]", "Acepciones"],
  ["form[]", "Flexión y derivación"],
  ["variant[]", "Variantes gráficas"],
  ["example[]", "Ejemplos alineados"],
  ["source", "Documento + página"],
  ["status", "Estado de validación"],
];

const pipeline = [
  ["01", "Transcripción", "Captura de la entrada y su página."],
  ["02", "Segmentación", "Separación de lema, acepciones, formas y ejemplos."],
  ["03", "Normalización", "Índice normalizado sin eliminar la grafía fuente."],
  ["04", "Alineación", "Vinculación oración rarámuri ↔ traducción española."],
  ["05", "Validación", "Cotejo lingüístico y documental por especialistas."],
  ["06", "Publicación", "Versión identificable y trazable del registro."],
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todos");
  const [masterDraft, setMasterDraft] = useState("");
  const [masterQuery, setMasterQuery] = useState("");
  const [masterPos, setMasterPos] = useState("Todos");
  const [masterPage, setMasterPage] = useState(1);
  const [masterRevision, setMasterRevision] = useState(0);
  const [masterPages, setMasterPages] = useState(1);
  const [masterEntries, setMasterEntries] = useState<MasterEntry[]>([]);
  const [masterTotal, setMasterTotal] = useState(0);
  const [masterTotalAll, setMasterTotalAll] = useState(2581);
  const [classifications, setClassifications] = useState<ClassificationCount[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [masterLoading, setMasterLoading] = useState(true);
  const [masterError, setMasterError] = useState("");

  const visibleProducts = activeFilter === "Todos"
    ? products
    : products.filter((product) => product.group === activeFilter);

  const selectedMasterEntry = masterEntries.find((entry) => entry.recordId === selectedMasterId) ?? masterEntries[0] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(masterPage),
      limit: "50",
    });
    if (masterQuery) params.set("q", masterQuery);
    if (masterPos !== "Todos") params.set("pos", masterPos);
    fetch(`/api/lexicon?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "No fue posible consultar la base.");
        return payload as {
          entries: MasterEntry[];
          total: number;
          totalAll: number;
          pages: number;
          classifications: ClassificationCount[];
        };
      })
      .then((payload) => {
        setMasterEntries(payload.entries);
        setMasterTotal(payload.total);
        setMasterTotalAll(payload.totalAll);
        setMasterPages(payload.pages);
        setClassifications(payload.classifications);
        setSelectedMasterId((current) =>
          payload.entries.some((entry) => entry.recordId === current)
            ? current
            : (payload.entries[0]?.recordId ?? ""),
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMasterEntries([]);
        setMasterError(error instanceof Error ? error.message : "Error de consulta.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setMasterLoading(false);
      });
    return () => controller.abort();
  }, [masterPage, masterPos, masterQuery, masterRevision]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMasterLoading(true);
    setMasterError("");
    setMasterQuery(masterDraft.trim());
    setMasterPage(1);
    setMasterRevision((revision) => revision + 1);
    document.getElementById("base-maestra")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exportMasterCsv() {
    const params = new URLSearchParams({ format: "csv" });
    if (masterQuery) params.set("q", masterQuery);
    if (masterPos !== "Todos") params.set("pos", masterPos);
    window.location.href = `/api/lexicon?${params}`;
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="topline" />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Rarámuri Digital, Universidad CEEES">
          <span className="brand-mark"><Image src="/uceees-logo.png" width={54} height={54} alt="" priority /></span>
          <span className="brand-copy">
            <strong>Universidad CEEES</strong>
            <small>Humanidades digitales</small>
          </span>
        </a>

        <nav aria-label="Navegación principal">
          <a href="#base-maestra">Base maestra</a>
          <a href="#modelo">Modelo de datos</a>
          <a href="#productos">Productos</a>
          <a href="#proyecto">Proyecto</a>
          <a href="#licencia">Licencia</a>
        </nav>

        <span className="build-status"><i /> PROTOTIPO · 0.4</span>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div>
            <p className="eyebrow">Proyecto interinstitucional de humanidades digitales</p>
            <h1>Rarámuri<br /><em>Digital</em></h1>
            <p className="hero-intro">
              Plataforma para integrar, consultar y relacionar entradas, acepciones, formas,
              ejemplos, variantes y referencias de página. Universidad CEEES · UACJ · UACJ-113.
            </p>
          </div>

          <aside className="metric-rail" aria-label="Alcance del proyecto">
            <div className="metric">
              <span>30</span>
              <small>productos derivados<br />de una ficha maestra</small>
            </div>
            <div className="metric">
              <span>2,581</span>
              <small>registros lexicográficos<br />cargados</small>
            </div>
            <div className="metric">
              <span>85</span>
              <small>páginas fuente<br />indexadas</small>
              <div className="progress"><i /></div>
            </div>
          </aside>
        </section>

        <section className="institution-rail" aria-label="Instituciones participantes">
          <span>INSTITUCIONES PARTICIPANTES</span>
          <b>Universidad CEEES</b>
          <i />
          <b>Universidad Autónoma de Ciudad Juárez</b>
          <i />
          <b>CA UACJ-113</b>
          <small>Estudios sobre Prácticas Educativas e Interculturalidad</small>
        </section>

        <section className="search-panel" id="explorar" aria-label="Consulta del corpus">
          <form className="search-form" onSubmit={submitSearch}>
            <span className="search-icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="lexical-search">Buscar en la base completa</label>
            <input
              id="lexical-search"
              type="search"
              value={masterDraft}
              onChange={(event) => setMasterDraft(event.target.value)}
              placeholder="Buscar lema, traducción, clase o texto de ejemplo…"
              autoComplete="off"
            />
            <button type="submit">Consultar 2,581 entradas</button>
          </form>
          <div className="search-meta">
            <span>ÍNDICES: LEMA NORMALIZADO · ESPAÑOL · POS · EJEMPLOS</span>
            <button type="button" onClick={() => { setMasterLoading(true); setMasterError(""); setMasterDraft(""); setMasterQuery(""); setMasterPage(1); setMasterRevision((revision) => revision + 1); }}>
              RESTABLECER CONSULTA
            </button>
          </div>
        </section>

        <section className="workspace" id="resultado" aria-live="polite">
          {selectedMasterEntry ? (
            <article className="entry-card">
              <div className="card-heading">
                <p className="card-label">Registro lexicográfico</p>
                <span className="entry-id">{selectedMasterEntry.recordId}</span>
              </div>
              <h2 className="entry-title">
                {selectedMasterEntry.homonymNumber && <sup>{selectedMasterEntry.homonymNumber}</sup>}
                {selectedMasterEntry.headword} <span>· {selectedMasterEntry.classification || "Sin clasificar"}</span>
              </h2>
              <div className="definition">
                <span>01</span>
                <div>
                  <strong>{selectedMasterEntry.translationRaw || "Sin traducción consignada"}</strong>
                  <p>{selectedMasterEntry.senses.length} acepción(es) segmentada(s) · {selectedMasterEntry.variants.length} variante(s) o forma(s) detectada(s)</p>
                </div>
              </div>
              <div className="example-block">
                <p lang="tar"><small>FORMA FUENTE</small>{selectedMasterEntry.headwordRaw}</p>
                <p><small>EJEMPLOS Y COMENTARIOS</small>{selectedMasterEntry.commentsRaw || "Sin ejemplo o comentario en esta entrada."}</p>
              </div>
              <dl className="record-meta">
                <div><dt>FUENTE</dt><dd>{selectedMasterEntry.sourceDocument}</dd></div>
                <div><dt>PÁGINA</dt><dd>{selectedMasterEntry.pageStart === selectedMasterEntry.pageEnd ? selectedMasterEntry.pageStart : `${selectedMasterEntry.pageStart}–${selectedMasterEntry.pageEnd}`}</dd></div>
                <div><dt>ESTADO</dt><dd><i /> Transcrito · sin cotejo final</dd></div>
              </dl>
            </article>
          ) : (
            <article className="entry-card empty-record">
              <p className="card-label">Sin coincidencias</p>
              <h2>No hay registros para esta consulta.</h2>
              <p>Pruebe otro lema, traducción o clase gramatical.</p>
            </article>
          )}

          <aside className="relations-card" aria-label="Relaciones del registro seleccionado">
            <div className="relations-head">
              <h2>Relaciones del registro</h2>
              <span>GRAPH VIEW</span>
            </div>
            {selectedMasterEntry ? (
              <div className="network" aria-label={`Relaciones de ${selectedMasterEntry.headword}`}>
                <span className="edge e1" /><span className="edge e2" />
                <span className="edge e3" /><span className="edge e4" />
                <span className="node primary">{selectedMasterEntry.headword}<small>{selectedMasterEntry.translationRaw}</small></span>
                <span className="node n1"><i />POS<small>{selectedMasterEntry.classificationFamily}</small></span>
                <span className="node n2"><i />ACEPCIONES<small>{selectedMasterEntry.senses.length}</small></span>
                <span className="node n3"><i />VARIANTES<small>{selectedMasterEntry.variants.length}</small></span>
                <span className="node n4"><i />FUENTE<small>p. {selectedMasterEntry.pageStart}</small></span>
              </div>
            ) : <p className="relations-empty">Seleccione un registro válido.</p>}
          </aside>
        </section>

        <section className="collections" aria-label="Vistas principales">
          <a href="#base-maestra"><span>01 / BASE</span><i>↗</i><b>Registros maestros</b><small>LEMA + POS + SENSE + SOURCE</small></a>
          <a href="#corpus"><span>02 / CORPUS</span><i>↗</i><b>Ejemplos alineados</b><small>RRM ↔ SPA + FUENTE</small></a>
          <a href="#variantes"><span>03 / FORMA</span><i>↗</i><b>Variación gráfica</b><small>R/L · G/C · I/E · BA/HUA</small></a>
          <a href="#productos"><span>04 / SALIDAS</span><i>↗</i><b>30 productos</b><small>DATOS + CORPUS + ANÁLISIS</small></a>
        </section>

        <section className="master-section" id="base-maestra">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Producto 01 · Base lexicográfica maestra</p>
              <h2>Registro canónico por entrada.</h2>
            </div>
            <p>
              Base completa de 2,581 registros transcritos de la fuente de trabajo. Incluye palabra
              rarámuri, clasificación, traducción, acepciones, ejemplos, variantes y página de procedencia.
            </p>
          </div>

          <div className="master-metrics" aria-label="Resumen de la base maestra">
            <div><span>{masterTotalAll.toLocaleString("es-MX")}</span><small>REGISTROS CARGADOS</small></div>
            <div><span>{classifications.length || 15}</span><small>FAMILIAS GRAMATICALES</small></div>
            <div><span>7</span><small>CAMPOS LEXICOGRÁFICOS</small></div>
            <div><span>0</span><small>REGISTROS VALIDADOS</small></div>
          </div>

          <form className="master-toolbar" onSubmit={submitSearch}>
            <label>
              <span>BUSCAR EN REGISTROS</span>
              <input value={masterDraft} onChange={(event) => setMasterDraft(event.target.value)}
                type="search" placeholder="Lema, traducción, acepción o variante" />
            </label>
            <label>
              <span>CLASE GRAMATICAL</span>
              <select value={masterPos} onChange={(event) => { setMasterLoading(true); setMasterError(""); setMasterPos(event.target.value); setMasterPage(1); }}>
                <option>Todos</option>
                {classifications.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.total})</option>)}
              </select>
            </label>
            <button type="submit">Buscar</button>
            <button type="button" onClick={exportMasterCsv}>Exportar CSV</button>
          </form>

          <div className="master-layout">
            <div className="master-table-wrap">
              <div className="master-table" role="table" aria-label="Base lexicográfica maestra completa">
                <div className="master-table-head" role="row">
                  <span>ID</span><span>LEMA</span><span>POS</span><span>TRADUCCIÓN</span><span>PÁG.</span><span>ESTADO</span>
                </div>
                {masterLoading && <p className="master-empty">Consultando la base…</p>}
                {masterError && <p className="master-empty error">{masterError}</p>}
                {!masterLoading && !masterError && masterEntries.map((entry) => (
                  <button type="button" role="row" key={entry.recordId}
                    className={entry.recordId === selectedMasterEntry?.recordId ? "selected" : ""}
                    onClick={() => setSelectedMasterId(entry.recordId)}>
                    <code>{entry.recordId}</code>
                    <b>{entry.homonymNumber && <sup>{entry.homonymNumber}</sup>}{entry.headword}</b>
                    <span className="pos-chip">{entry.classification || "—"}</span>
                    <span>{entry.translationRaw || "Sin traducción consignada"}</span>
                    <span>{entry.pageStart === entry.pageEnd ? entry.pageStart : `${entry.pageStart}–${entry.pageEnd}`}</span>
                    <i>{entry.status}</i>
                  </button>
                ))}
                {!masterLoading && !masterError && masterEntries.length === 0 && <p className="master-empty">Sin registros para este filtro.</p>}
              </div>
              <div className="master-pagination" aria-label="Paginación de resultados">
                <button type="button" disabled={masterPage <= 1 || masterLoading} onClick={() => { setMasterLoading(true); setMasterError(""); setMasterPage((page) => page - 1); }}>← Anterior</button>
                <span>Página {masterPage} de {masterPages}</span>
                <button type="button" disabled={masterPage >= masterPages || masterLoading} onClick={() => { setMasterLoading(true); setMasterError(""); setMasterPage((page) => page + 1); }}>Siguiente →</button>
              </div>
              <p className="master-count">{masterEntries.length} en esta página · {masterTotal.toLocaleString("es-MX")} resultados</p>
            </div>

            {selectedMasterEntry ? (
              <aside className="record-inspector" aria-label={`Detalle de ${selectedMasterEntry.headword}`}>
                <header>
                  <div><span>RECORD INSPECTOR</span><code>{selectedMasterEntry.recordId}</code></div>
                  <i>{selectedMasterEntry.status}</i>
                </header>
                <div className="inspector-title">
                  <h3>{selectedMasterEntry.homonymNumber && <sup>{selectedMasterEntry.homonymNumber}</sup>}{selectedMasterEntry.headword}</h3>
                  <span>{selectedMasterEntry.classification || "Sin clasificar"}</span>
                </div>
                <dl>
                  <div><dt>TRADUCCIÓN</dt><dd>{selectedMasterEntry.translationRaw || "Sin traducción consignada"}</dd></div>
                  <div><dt>ACEPCIONES</dt><dd>{selectedMasterEntry.senses.length ? <ol>{selectedMasterEntry.senses.map((sense, index) => <li key={`${index}-${sense}`}>{sense}</li>)}</ol> : "Sin acepciones segmentadas"}</dd></div>
                  <div><dt>EJEMPLOS Y COMENTARIOS</dt><dd>{selectedMasterEntry.examples.length ? selectedMasterEntry.examples.map((example, index) => <p key={`${index}-${example}`}>{example}</p>) : <em>Sin dato en la entrada</em>}</dd></div>
                  <div><dt>VARIANTES / FORMAS / REMISIONES</dt><dd className="tag-list">{selectedMasterEntry.variants.length ? selectedMasterEntry.variants.map((variant, index) => <span key={`${index}-${variant}`}>{variant}</span>) : <em>Sin dato en la entrada</em>}</dd></div>
                  <div><dt>PROCEDENCIA</dt><dd><code>{selectedMasterEntry.sourceCode}</code> · {selectedMasterEntry.sourceDocument} · página {selectedMasterEntry.pageStart === selectedMasterEntry.pageEnd ? selectedMasterEntry.pageStart : `${selectedMasterEntry.pageStart}–${selectedMasterEntry.pageEnd}`}</dd></div>
                </dl>
                <p className="validation-warning"><i /> Transcripción completa de trabajo. Requiere cotejo con el facsímil y validación lingüística.</p>
              </aside>
            ) : <aside className="record-inspector empty-inspector"><p>Seleccione un registro.</p></aside>}
          </div>
        </section>

        <section className="technical-section" id="modelo">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Modelo de datos</p>
              <h2>Una ficha canónica. Múltiples vistas derivadas.</h2>
            </div>
            <p>
              El sistema conserva la grafía de la fuente y agrega campos normalizados para búsqueda,
              agrupación y análisis. Ningún producto se mantiene como lista aislada.
            </p>
          </div>

          <div className="schema-layout">
            <article className="schema-card">
              <header><span>SCHEMA</span><b>lexical_entry</b><i>v0.2</i></header>
              <div className="schema-fields">
                {schemaFields.map(([field, description], index) => (
                  <div key={field}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <code>{field}</code>
                    <p>{description}</p>
                    <i>{field.includes("[]") ? "ARRAY" : "STRING"}</i>
                  </div>
                ))}
              </div>
            </article>

            <article className="pipeline-card">
              <header><span>PIPELINE</span><b>ingesta → publicación</b></header>
              <ol>
                {pipeline.map(([number, title, description]) => (
                  <li key={number}>
                    <span>{number}</span>
                    <div><b>{title}</b><p>{description}</p></div>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="parallel-section" id="corpus">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Corpus paralelo</p>
              <h2>Alineación a nivel de ejemplo.</h2>
            </div>
            <p>Cada par mantiene vínculo con lema, acepción, documento y página.</p>
          </div>
          <div className="corpus-table" role="table" aria-label="Ejemplos alineados">
            <div className="table-head" role="row">
              <span>ID</span><span>RRM</span><span>SPA</span><span>LEMA</span><span>FUENTE</span>
            </div>
            <div role="row"><code>EX-0001</code><p lang="tar">Ba’huí bají.</p><p>Toma agua.</p><b>ba’huí</b><small>p. 10</small></div>
            <div role="row"><code>EX-0002</code><p lang="tar">Abé huarú ucuri.</p><p>Hoy llovió mucho.</p><b>abé</b><small>p. 3</small></div>
            <div role="row"><code>EX-0003</code><p lang="tar">Nijeni ama cahué.</p><p>Voy a buscar el caballo.</p><b>a</b><small>p. 3</small></div>
          </div>
        </section>

        <section className="variants-section" id="variantes">
          <div className="section-heading compact">
            <div><p className="eyebrow">Variación gráfica</p><h2>Alternancias registradas por la fuente.</h2></div>
            <p>La consulta recuperará la forma documentada y sus variantes relacionadas.</p>
          </div>
          <div className="variant-grid">
            <div><code>VAR-01</code><b>r ↔ l</b><span>corachi / colachi</span></div>
            <div><code>VAR-02</code><b>g ↔ c</b><span>garé / caré</span></div>
            <div><code>VAR-03</code><b>Ø ↔ g/c</b><span>gará / ará</span></div>
            <div><code>VAR-04</code><b>i ↔ e</b><span>quimá / quemá</span></div>
            <div><code>VAR-05</code><b>ba ↔ hua</b><span>basoná / huasoná</span></div>
          </div>
        </section>

        <section className="products-section" id="productos">
          <div className="section-heading">
            <div><p className="eyebrow">Productos derivados</p><h2>Treinta salidas sobre el mismo corpus.</h2></div>
            <p>Estado actual: arquitectura especificada. La publicación de cada salida dependerá de validación y cobertura suficientes.</p>
          </div>
          <div className="product-filters" aria-label="Filtrar productos">
            {filters.map((filter) => (
              <button key={filter} type="button" onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "active" : ""} aria-pressed={activeFilter === filter}>
                {filter}
              </button>
            ))}
          </div>
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <article key={product.id}>
                <span>P-{String(product.id).padStart(2, "0")}</span>
                <small>{product.group}</small>
                <h3>{product.title}</h3>
                <i>ESPECIFICADO</i>
              </article>
            ))}
          </div>
        </section>

        <section className="sources-section" id="fuentes">
          <div className="section-heading compact">
            <div><p className="eyebrow">Control de fuentes</p><h2>Documento, página y estado en cada registro.</h2></div>
            <p>La transcripción estructurada cubre las 2,581 filas de la fuente de trabajo. La lectura deberá cotejarse con el facsímil antes de marcar un registro como validado.</p>
          </div>
          <div className="source-grid">
            <article>
              <header><span>SRC-01</span><i>FUENTE PRIMARIA</i></header>
              <h3>Diccionario tarahumara de Samachique</h3>
              <p>K. Simón Hilton. Edición especial corregida y actualizada, 1993.</p>
              <dl><div><dt>Páginas</dt><dd>156</dd></div><div><dt>Formato</dt><dd>Facsímil PDF</dd></div><div><dt>Estado</dt><dd>Disponible</dd></div></dl>
            </article>
            <article>
              <header><span>SRC-02</span><i>DOCUMENTO DE TRABAJO</i></header>
              <h3>Transcripción estructurada rarámuri-español</h3>
              <p>Columnas de lema, clasificación, traducción, ejemplos y comentarios.</p>
              <dl><div><dt>Páginas</dt><dd>87</dd></div><div><dt>Formato</dt><dd>PDF textual</dd></div><div><dt>Estado</dt><dd>Por cotejar</dd></div></dl>
            </article>
          </div>
        </section>

        <section className="project-section" id="proyecto">
          <div className="section-heading">
            <div><p className="eyebrow">Responsabilidad y contacto</p><h2>Proyecto interinstitucional.</h2></div>
            <p>Los contactos publicados son institucionales. Para asuntos académicos del corpus, escriba al responsable del proyecto.</p>
          </div>

          <article className="lead-card">
            <div>
              <span>RESPONSABLE DEL PROYECTO</span>
              <h3>Dr. Fernando Sandoval Gutiérrez</h3>
              <p>Coordinación académica y responsable del proyecto Rarámuri Digital.</p>
            </div>
            <dl>
              <div><dt>Adscripción</dt><dd>Universidad Autónoma de Ciudad Juárez · Universidad CEEES</dd></div>
              <div><dt>Cuerpo académico</dt><dd>UACJ-113 · Estudios sobre Prácticas Educativas e Interculturalidad</dd></div>
              <div><dt>Correo</dt><dd><a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a></dd></div>
              <div><dt>ORCID</dt><dd><a href="https://orcid.org/0000-0002-3168-6725" target="_blank" rel="noreferrer">0000-0002-3168-6725 ↗</a></dd></div>
            </dl>
          </article>

          <div className="institution-grid">
            <article>
              <header><span>INST-01</span><i>INSTITUCIÓN PARTICIPANTE</i></header>
              <h3>Universidad CEEES</h3>
              <p>Centro de Estudios Especializados en Educación Superior, Cuauhtémoc.</p>
              <address>Calle Cuarta, entre Guerrero y Allende, Centro, Cuauhtémoc, Chihuahua.</address>
              <div className="contact-links">
                <a href="mailto:informes@ceees.mx">informes@ceees.mx</a>
                <a href="tel:+526251475963">+52 625 147 5963</a>
                <a href="https://ceees.mx/contact/" target="_blank" rel="noreferrer">ceees.mx ↗</a>
              </div>
            </article>
            <article>
              <header><span>INST-02</span><i>INSTITUCIÓN PARTICIPANTE</i></header>
              <h3>Universidad Autónoma de Ciudad Juárez</h3>
              <p>División Multidisciplinaria en Cuauhtémoc.</p>
              <address>Km 3.5 Carretera Cuauhtémoc-Anáhuac, C.P. 31600, Chihuahua.</address>
              <div className="contact-links">
                <a href="mailto:div.cua@uacj.mx">div.cua@uacj.mx</a>
                <a href="tel:+526251281700">+52 625 128 1700</a>
                <a href="https://www.uacj.mx/DMC/" target="_blank" rel="noreferrer">uacj.mx/DMC ↗</a>
              </div>
            </article>
            <article>
              <header><span>INST-03</span><i>CUERPO ACADÉMICO</i></header>
              <h3>UACJ-113</h3>
              <p>Estudios sobre Prácticas Educativas e Interculturalidad.</p>
              <address>ICSA · División Multidisciplinaria en Cuauhtémoc, UACJ.</address>
              <div className="contact-links">
                <a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a>
                <a href="https://erevistas.uacj.mx/ojs/index.php/biniriame" target="_blank" rel="noreferrer">Referencia institucional ↗</a>
              </div>
            </article>
          </div>
        </section>

        <section className="license-section" id="licencia">
          <div className="license-badge"><b>CC</b><span>BY<br />NC<br />SA</span><i>4.0</i></div>
          <div className="license-copy">
            <p className="eyebrow">Licencia de uso</p>
            <h2>CC BY-NC-SA 4.0 Internacional</h2>
            <p>
              Los contenidos originales, la documentación y los datos producidos específicamente por Rarámuri Digital
              pueden compartirse y adaptarse con atribución, para fines no comerciales y bajo la misma licencia.
            </p>
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" target="_blank" rel="license noreferrer">Consultar términos de la licencia ↗</a>
          </div>
          <aside>
            <b>ATRIBUCIÓN SUGERIDA</b>
            <p>Rarámuri Digital. Fernando Sandoval Gutiérrez; Universidad CEEES; Universidad Autónoma de Ciudad Juárez; Cuerpo Académico UACJ-113.</p>
            <b>EXCLUSIONES</b>
            <p>La licencia no se extiende a facsímiles, textos fuente, logotipos ni materiales de terceros. Esos elementos conservan sus propios derechos y condiciones de uso.</p>
          </aside>
        </section>

        <aside className="scope-note">
          <span>ALCANCE DE ESTA VERSIÓN</span>
          <p>Base maestra completa: 2,581 registros, páginas 3–87 de la transcripción estructurada. Estado documental: transcrito; validación lingüística y cotejo con el facsímil pendientes.</p>
        </aside>
      </main>

      <footer>
        <div className="footer-brand"><Image src="/uceees-logo.png" width={54} height={54} alt="" /><span><b>Rarámuri Digital</b>Universidad CEEES</span></div>
        <div><span>VERSIÓN</span><b>PROTOTIPO 0.4</b></div>
        <div><span>COBERTURA</span><b>2,581 REGISTROS</b></div>
        <div><span>TRAZABILIDAD</span><b>ENTRADA + PÁGINA + FUENTE</b></div>
      </footer>
    </div>
  );
}
