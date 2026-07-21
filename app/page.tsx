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

type MasterEntry = {
  id: string;
  lemma: string;
  homonym: string;
  pos: string;
  translations: string[];
  senses: string[];
  examples: string[];
  variants: string[];
  page: string;
  source: string;
  status: "Transcrito" | "Cotejado" | "Validado";
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

const masterEntries: MasterEntry[] = [
  {
    id: "RD-000001", lemma: "a", homonym: "", pos: "Vt", translations: ["buscar"],
    senses: ["Buscar"], examples: ["Nijeni ama cahué. — Voy a buscar el caballo."],
    variants: ["pret.: ari", "fut.: ama", "imper.: ábasi", "ger.: ásiga"],
    page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000002", lemma: "abé", homonym: "", pos: "Adv", translations: ["hoy", "hace rato"],
    senses: ["Hoy", "Hace rato"], examples: ["Abé huarú ucuri. — Hoy llovió mucho."],
    variants: ["véase jipi", "véase curipi"], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000003", lemma: "abi, abiyena", homonym: "", pos: "Adv", translations: ["sí"],
    senses: ["Respuesta afirmativa"], examples: ["¿Acha mi ’yárati? Ayena, abi. — ¿Se lo dieron? Sí."],
    variants: ["abiyena"], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000004", lemma: "abijí", homonym: "", pos: "Adv", translations: ["todavía", "aún"],
    senses: ["Continuidad temporal"], examples: ["Abijí que cho ucú. — Todavía no llueve."],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000005", lemma: "aboni", homonym: "", pos: "Pron", translations: ["ellos", "ellas"],
    senses: ["Pronombre personal de tercera persona plural"], examples: ["Aboni pirérachi. — Habitación de ellos."],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000006", lemma: "acá", homonym: "1", pos: "S", translations: ["cara", "nariz"],
    senses: ["Cara", "Nariz"], examples: ["Binoy acara. — Su cara."],
    variants: ["véase cho’ó"], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000007", lemma: "acá", homonym: "2", pos: "Vi", translations: ["tener sal", "estar dulce o sabroso"],
    senses: ["Tener sal", "Estar dulce o sabroso"], examples: ["¿Acha gará acá muní? — ¿Tienen suficiente sal los frijoles?"],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000008", lemma: "acá", homonym: "3", pos: "S", translations: ["huarache"],
    senses: ["Huarache"], examples: ["Nijeni quetasi te acá. — No tengo huaraches."],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000009", lemma: "acá", homonym: "4", pos: "Vi", translations: ["embotarse", "quitarse el filo"],
    senses: ["Embotarse", "Perder el filo"], examples: ["Ripurá acari rité. — Se embotó el hacha."],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000010", lemma: "acáchura", homonym: "", pos: "S", translations: ["abuela paterna", "nieta"],
    senses: ["Abuela paterna", "Nieta de la abuela paterna"],
    examples: ["Echi nijé onorá iyera nijé acáchura ju. — La mamá de mi papá es mi abuela paterna."],
    variants: [], page: "3", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000011", lemma: "achá", homonym: "", pos: "Vt", translations: ["poner", "colocar"],
    senses: ["Poner una sola cosa o persona", "Colocar"], examples: ["Echo’ná achámani. — Voy a ponerlo allí."],
    variants: ["pl.: muchuhua"], page: "4", source: "SRC-02", status: "Transcrito",
  },
  {
    id: "RD-000012", lemma: "achí", homonym: "", pos: "Vt", translations: ["reír", "sonreír"],
    senses: ["Reír", "Sonreír"], examples: ["Echi jaré rarámuri huabé achiri. — Los rarámuri se rieron mucho."],
    variants: [], page: "4", source: "SRC-02", status: "Transcrito",
  },
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
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todos");
  const [masterQuery, setMasterQuery] = useState("");
  const [masterPos, setMasterPos] = useState("Todos");
  const [selectedMasterId, setSelectedMasterId] = useState(masterEntries[0].id);

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

  const visibleMasterEntries = useMemo(() => {
    const normalized = masterQuery.trim().toLocaleLowerCase("es");
    return masterEntries.filter((entry) => {
      const matchesPos = masterPos === "Todos" || entry.pos === masterPos;
      const values = [entry.lemma, entry.pos, ...entry.translations, ...entry.senses, ...entry.variants];
      const matchesQuery = !normalized || values.some((value) => value.toLocaleLowerCase("es").includes(normalized));
      return matchesPos && matchesQuery;
    });
  }, [masterPos, masterQuery]);

  const selectedMasterEntry = masterEntries.find((entry) => entry.id === selectedMasterId) ?? masterEntries[0];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(query);
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function exportMasterCsv() {
    const rows = [
      ["id", "lema", "homonimo", "clasificacion", "traducciones", "acepciones", "ejemplos", "variantes", "fuente", "pagina", "estado"],
      ...visibleMasterEntries.map((entry) => [
        entry.id, entry.lemma, entry.homonym, entry.pos, entry.translations.join(" | "), entry.senses.join(" | "),
        entry.examples.join(" | "), entry.variants.join(" | "), entry.source, entry.page, entry.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "raramuri-base-lexicografica-muestra.csv";
    link.click();
    URL.revokeObjectURL(url);
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
          <a href="#base-maestra">Base maestra</a>
          <a href="#modelo">Modelo de datos</a>
          <a href="#productos">Productos</a>
          <a href="#proyecto">Proyecto</a>
          <a href="#licencia">Licencia</a>
        </nav>

        <span className="build-status"><i /> PROTOTIPO · 0.3</span>
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
              <span>2</span>
              <small>fuentes documentales<br />en integración</small>
            </div>
            <div className="metric">
              <span>9</span>
              <small>campos mínimos<br />por entrada</small>
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
              Muestra inicial de 12 registros transcritos. Incluye lema rarámuri, clasificación,
              traducción, acepciones, ejemplos, variantes y página de procedencia.
            </p>
          </div>

          <div className="master-metrics" aria-label="Resumen de la base maestra">
            <div><span>12</span><small>REGISTROS CARGADOS</small></div>
            <div><span>5</span><small>CLASES GRAMATICALES</small></div>
            <div><span>7</span><small>CAMPOS LEXICOGRÁFICOS</small></div>
            <div><span>0</span><small>REGISTROS VALIDADOS</small></div>
          </div>

          <div className="master-toolbar">
            <label>
              <span>BUSCAR EN REGISTROS</span>
              <input value={masterQuery} onChange={(event) => setMasterQuery(event.target.value)}
                type="search" placeholder="Lema, traducción, acepción o variante" />
            </label>
            <label>
              <span>CLASE GRAMATICAL</span>
              <select value={masterPos} onChange={(event) => setMasterPos(event.target.value)}>
                {['Todos', 'S', 'Vt', 'Vi', 'Adv', 'Pron'].map((pos) => <option key={pos}>{pos}</option>)}
              </select>
            </label>
            <button type="button" onClick={exportMasterCsv}>Exportar CSV</button>
          </div>

          <div className="master-layout">
            <div className="master-table-wrap">
              <div className="master-table" role="table" aria-label="Muestra de la base lexicográfica maestra">
                <div className="master-table-head" role="row">
                  <span>ID</span><span>LEMA</span><span>POS</span><span>TRADUCCIÓN</span><span>PÁG.</span><span>ESTADO</span>
                </div>
                {visibleMasterEntries.map((entry) => (
                  <button type="button" role="row" key={entry.id}
                    className={entry.id === selectedMasterEntry.id ? "selected" : ""}
                    onClick={() => setSelectedMasterId(entry.id)}>
                    <code>{entry.id}</code>
                    <b>{entry.homonym && <sup>{entry.homonym}</sup>}{entry.lemma}</b>
                    <span className="pos-chip">{entry.pos}</span>
                    <span>{entry.translations.join("; ")}</span>
                    <span>{entry.page}</span>
                    <i>{entry.status}</i>
                  </button>
                ))}
                {visibleMasterEntries.length === 0 && <p className="master-empty">Sin registros para este filtro.</p>}
              </div>
              <p className="master-count">{visibleMasterEntries.length} de {masterEntries.length} registros visibles</p>
            </div>

            <aside className="record-inspector" aria-label={`Detalle de ${selectedMasterEntry.lemma}`}>
              <header>
                <div><span>RECORD INSPECTOR</span><code>{selectedMasterEntry.id}</code></div>
                <i>{selectedMasterEntry.status}</i>
              </header>
              <div className="inspector-title">
                <h3>{selectedMasterEntry.homonym && <sup>{selectedMasterEntry.homonym}</sup>}{selectedMasterEntry.lemma}</h3>
                <span>{selectedMasterEntry.pos}</span>
              </div>
              <dl>
                <div><dt>TRADUCCIÓN</dt><dd>{selectedMasterEntry.translations.join("; ")}</dd></div>
                <div><dt>ACEPCIONES</dt><dd><ol>{selectedMasterEntry.senses.map((sense) => <li key={sense}>{sense}</li>)}</ol></dd></div>
                <div><dt>EJEMPLOS</dt><dd>{selectedMasterEntry.examples.map((example) => <p key={example}>{example}</p>)}</dd></div>
                <div><dt>VARIANTES / FORMAS / REMISIONES</dt><dd className="tag-list">{selectedMasterEntry.variants.length ? selectedMasterEntry.variants.map((variant) => <span key={variant}>{variant}</span>) : <em>Sin dato en la entrada</em>}</dd></div>
                <div><dt>PROCEDENCIA</dt><dd><code>{selectedMasterEntry.source}</code> · página {selectedMasterEntry.page}</dd></div>
              </dl>
              <p className="validation-warning"><i /> Transcripción de trabajo. Requiere cotejo con el facsímil y validación lingüística.</p>
            </aside>
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
          <p>Base maestra inicial con 12 registros de muestra. No representa todavía cobertura completa del diccionario ni validación lingüística final.</p>
        </aside>
      </main>

      <footer>
        <div className="footer-brand"><img src="/uceees-logo.png" alt="" /><span><b>Rarámuri Digital</b>Universidad CEEES</span></div>
        <div><span>VERSIÓN</span><b>PROTOTIPO 0.3</b></div>
        <div><span>COBERTURA</span><b>12 REGISTROS</b></div>
        <div><span>TRAZABILIDAD</span><b>ENTRADA + PÁGINA + FUENTE</b></div>
      </footer>
    </div>
  );
}
