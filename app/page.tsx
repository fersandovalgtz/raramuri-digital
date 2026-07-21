"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  group: "Datos" | "Corpus" | "Inventarios" | "Análisis" | "Docencia";
};

type Entry = {
  id: string;
  lemma: string;
  pos: string;
  spanish: string;
  note: string;
  example: string;
  translation: string;
  source: string;
  page: string;
  orthography: string;
  domain: string;
};

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

const entries: Entry[] = [
  {
    id: "RD-DEMO-0001",
    lemma: "ba’huí",
    pos: "S",
    spanish: "agua",
    note: "Sustantivo. Forma con saltillo y acento gráfico.",
    example: "Ba’huí bají.",
    translation: "Toma agua.",
    source: "Transcripción estructurada de trabajo",
    page: "10",
    orthography: "saltillo + acento",
    domain: "naturaleza",
  },
  {
    id: "RD-DEMO-0002",
    lemma: "abé",
    pos: "Adv",
    spanish: "hoy; hace rato",
    note: "Adverbio con dos acepciones y remisión interna.",
    example: "Abé huarú ucuri.",
    translation: "Hoy llovió mucho.",
    source: "Transcripción estructurada de trabajo",
    page: "3",
    orthography: "acento",
    domain: "tiempo",
  },
  {
    id: "RD-DEMO-0003",
    lemma: "a",
    pos: "Vt",
    spanish: "buscar",
    note: "Verbo transitivo con pasado, futuro, imperativo y gerundio documentados.",
    example: "Nijeni ama cahué.",
    translation: "Voy a buscar el caballo.",
    source: "Transcripción estructurada de trabajo",
    page: "3",
    orthography: "forma básica",
    domain: "acción",
  },
];

const filters = ["Todos", "Datos", "Corpus", "Inventarios", "Análisis", "Docencia"] as const;

const schemaFields = [
  ["lemma", "Forma de entrada"],
  ["pos", "Clase gramatical"],
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
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todos");

  const selectedEntry = useMemo(() => {
    const normalized = submitted.trim().toLocaleLowerCase("es");
    if (!normalized) return entries[0];
    return entries.find((entry) =>
      [entry.lemma, entry.spanish, entry.pos, entry.domain].some((value) =>
        value.toLocaleLowerCase("es").includes(normalized),
      ),
    ) ?? null;
  }, [submitted]);

  const visibleProducts = activeFilter === "Todos"
    ? products
    : products.filter((product) => product.group === activeFilter);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(query);
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="topline" />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Rarámuri Digital, Universidad CEEES">
          <span className="brand-mark"><img src="/uceees-logo.png" alt="" /></span>
          <span className="brand-copy">
            <strong>Universidad CEEES</strong>
            <small>Humanidades digitales</small>
          </span>
        </a>

        <nav aria-label="Navegación principal">
          <a href="#explorar">Explorar</a>
          <a href="#modelo">Modelo de datos</a>
          <a href="#productos">Productos</a>
          <a href="#fuentes">Fuentes</a>
        </nav>

        <span className="build-status"><i /> PROTOTIPO · 0.2</span>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div>
            <p className="eyebrow">Infraestructura lexicográfica rarámuri-español</p>
            <h1>Rarámuri<br /><em>Digital</em></h1>
            <p className="hero-intro">
              Plataforma para integrar, consultar y relacionar entradas, acepciones, formas,
              ejemplos, variantes y referencias de página.
            </p>
          </div>

          <aside className="metric-rail" aria-label="Alcance del proyecto">
            <div className="metric">
              <span>30</span>
              <small>productos derivados<br />de una ficha maestra</small>
            </div>
            <div className="metric">
              <span>2</span>
              <small>fuentes documentales<br />en integración</small>
            </div>
            <div className="metric">
              <span>8</span>
              <small>campos mínimos<br />por entrada</small>
              <div className="progress"><i /></div>
            </div>
          </aside>
        </section>

        <section className="search-panel" id="explorar" aria-label="Consulta del corpus">
          <form className="search-form" onSubmit={submitSearch}>
            <span className="search-icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="lexical-search">Buscar en la muestra</label>
            <input
              id="lexical-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar lema, traducción, categoría o campo semántico…"
              autoComplete="off"
            />
            <button type="submit">Consultar muestra</button>
          </form>
          <div className="search-meta">
            <span>ÍNDICES: LEMA · ESPAÑOL · POS · DOMINIO</span>
            <button type="button" onClick={() => { setQuery("ba’huí"); setSubmitted("ba’huí"); }}>
              CARGAR REGISTRO DEMO
            </button>
          </div>
        </section>

        <section className="workspace" id="resultado" aria-live="polite">
          {selectedEntry ? (
            <article className="entry-card">
              <div className="card-heading">
                <p className="card-label">Registro lexicográfico</p>
                <span className="entry-id">{selectedEntry.id}</span>
              </div>
              <h2 className="entry-title">
                {selectedEntry.lemma} <span>· {selectedEntry.pos} · {selectedEntry.spanish}</span>
              </h2>
              <div className="definition">
                <span>01</span>
                <div>
                  <strong>{selectedEntry.spanish}</strong>
                  <p>{selectedEntry.note}</p>
                </div>
              </div>
              <div className="example-block">
                <p lang="tar"><small>RRM</small>{selectedEntry.example}</p>
                <p><small>SPA</small>{selectedEntry.translation}</p>
              </div>
              <dl className="record-meta">
                <div><dt>FUENTE</dt><dd>{selectedEntry.source}</dd></div>
                <div><dt>PÁGINA</dt><dd>{selectedEntry.page}</dd></div>
                <div><dt>ESTADO</dt><dd><i /> Transcrito · sin cotejo final</dd></div>
              </dl>
            </article>
          ) : (
            <article className="entry-card empty-record">
              <p className="card-label">Sin coincidencia en la muestra</p>
              <h2>Índice demostrativo: 3 registros</h2>
              <p>Pruebe: “ba’huí”, “agua”, “abé”, “hoy”, “buscar”, “S”, “Adv” o “Vt”.</p>
            </article>
          )}

          <aside className="relations-card" aria-label="Relaciones del registro seleccionado">
            <div className="relations-head">
              <h2>Relaciones del registro</h2>
              <span>GRAPH VIEW</span>
            </div>
            {selectedEntry ? (
              <div className="network" aria-label={`Relaciones de ${selectedEntry.lemma}`}>
                <span className="edge e1" /><span className="edge e2" />
                <span className="edge e3" /><span className="edge e4" />
                <span className="node primary">{selectedEntry.lemma}<small>{selectedEntry.spanish}</small></span>
                <span className="node n1"><i />POS<small>{selectedEntry.pos}</small></span>
                <span className="node n2"><i />DOMINIO<small>{selectedEntry.domain}</small></span>
                <span className="node n3"><i />ORTOGRAFÍA<small>{selectedEntry.orthography}</small></span>
                <span className="node n4"><i />FUENTE<small>p. {selectedEntry.page}</small></span>
              </div>
            ) : <p className="relations-empty">Seleccione un registro válido.</p>}
          </aside>
        </section>

        <section className="collections" aria-label="Vistas principales">
          <a href="#corpus"><span>01 / CORPUS</span><i>↗</i><b>Ejemplos alineados</b><small>RRM ↔ SPA + FUENTE</small></a>
          <a href="#modelo"><span>02 / ESQUEMA</span><i>↗</i><b>Ficha maestra</b><small>LEMA + POS + SENSE + FORM</small></a>
          <a href="#variantes"><span>03 / FORMA</span><i>↗</i><b>Variación gráfica</b><small>R/L · G/C · I/E · BA/HUA</small></a>
          <a href="#productos"><span>04 / SALIDAS</span><i>↗</i><b>30 productos</b><small>DATOS + CORPUS + ANÁLISIS</small></a>
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
            <p>Los datos mostrados son una muestra funcional. La foliación y la lectura deberán cotejarse antes de marcar un registro como validado.</p>
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

        <aside className="scope-note">
          <span>ALCANCE DE ESTA VERSIÓN</span>
          <p>Interfaz y arquitectura de información. No representa todavía cobertura completa del diccionario ni validación lingüística final.</p>
        </aside>
      </main>

      <footer>
        <div className="footer-brand"><img src="/uceees-logo.png" alt="" /><span><b>Rarámuri Digital</b>Universidad CEEES</span></div>
        <div><span>VERSIÓN</span><b>PROTOTIPO 0.2</b></div>
        <div><span>COBERTURA</span><b>MUESTRA FUNCIONAL</b></div>
        <div><span>TRAZABILIDAD</span><b>ENTRADA + PÁGINA + FUENTE</b></div>
      </footer>
    </div>
  );
}
