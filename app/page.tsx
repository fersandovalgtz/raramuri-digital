"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  group: "Datos" | "Corpus" | "Inventarios" | "Análisis" | "Enseñanza";
};

const products: Product[] = [
  { id: 1, title: "Base de datos lexicográfica maestra", group: "Datos" },
  { id: 2, title: "Corpus digital rarámuri-español", group: "Corpus" },
  { id: 3, title: "Corpus paralelo de ejemplos", group: "Corpus" },
  { id: 4, title: "Base terminológica español-rarámuri", group: "Datos" },
  { id: 5, title: "Base de variantes gráficas", group: "Datos" },
  { id: 6, title: "Repositorio de palabras con saltillo", group: "Corpus" },
  { id: 7, title: "Repositorio de palabras acentuadas", group: "Corpus" },
  { id: 8, title: "Inventario digital de sustantivos", group: "Inventarios" },
  { id: 9, title: "Inventario de verbos transitivos", group: "Inventarios" },
  { id: 10, title: "Inventario de verbos intransitivos", group: "Inventarios" },
  { id: 11, title: "Inventario digital de adjetivos", group: "Inventarios" },
  { id: 12, title: "Inventario digital de adverbios", group: "Inventarios" },
  { id: 13, title: "Inventario digital de pronombres", group: "Inventarios" },
  { id: 14, title: "Inventario digital de interjecciones", group: "Inventarios" },
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
  { id: 26, title: "Catálogo de palabras ilustrables", group: "Enseñanza" },
  { id: 27, title: "Catálogo de palabras abstractas", group: "Enseñanza" },
  { id: 28, title: "Ejemplos para enseñanza inicial", group: "Enseñanza" },
  { id: 29, title: "Ejemplos para análisis lingüístico", group: "Enseñanza" },
  { id: 30, title: "Sistema interno de trazabilidad", group: "Datos" },
];

const sampleEntries = [
  {
    word: "ba’huí",
    grammar: "sustantivo",
    meaning: "agua",
    example: "Ba’huí bají.",
    translation: "Toma agua.",
    note: "Voz registrada con saltillo y acento gráfico.",
    source: "Transcripción de trabajo · p. 10",
  },
  {
    word: "abé",
    grammar: "adverbio",
    meaning: "hoy; hace rato",
    example: "Abé huarú ucuri.",
    translation: "Hoy llovió mucho.",
    note: "Entrada con dos acepciones y remisión interna.",
    source: "Transcripción de trabajo · p. 3",
  },
  {
    word: "a",
    grammar: "verbo transitivo",
    meaning: "buscar",
    example: "Nijeni ama cahué.",
    translation: "Voy a buscar el caballo.",
    note: "Incluye pasado, futuro, imperativo y gerundio.",
    source: "Transcripción de trabajo · p. 3",
  },
];

const filters = ["Todos", "Datos", "Corpus", "Inventarios", "Análisis", "Enseñanza"] as const;

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todos");

  const selectedEntry = useMemo(() => {
    const normalized = submittedQuery.trim().toLocaleLowerCase("es");
    if (!normalized) return sampleEntries[0];
    return (
      sampleEntries.find((entry) =>
        [entry.word, entry.meaning, entry.grammar].some((value) =>
          value.toLocaleLowerCase("es").includes(normalized),
        ),
      ) ?? null
    );
  }, [submittedQuery]);

  const visibleProducts =
    activeFilter === "Todos"
      ? products
      : products.filter((product) => product.group === activeFilter);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Rarámuri Digital, Universidad CEEES">
          <img src="/uceees-logo.png" alt="Universidad CEEES" />
          <span className="brand-copy">
            <strong>Rarámuri Digital</strong>
            <small>Archivo lexicográfico abierto</small>
          </span>
        </a>

        <nav aria-label="Navegación principal">
          <a href="#diccionario">Diccionario</a>
          <a href="#corpus">Corpus</a>
          <a href="#productos">Productos</a>
          <a href="#fuentes">Fuentes</a>
        </nav>

        <span className="language-pair">Rarámuri <i>↔</i> Español</span>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-intro">
            <p className="kicker">Patrimonio lingüístico · Universidad CEEES</p>
            <h1>Rarámuri<br />Digital</h1>
            <p className="lede">
              Un archivo vivo para consultar, estudiar y enseñar el léxico rarámuri con rigor
              documental y procedencia verificable.
            </p>
            <div className="hero-facts" aria-label="Alcance del proyecto">
              <span><b>30</b> productos</span>
              <span><b>2</b> fuentes de trabajo</span>
              <span><b>1</b> ficha maestra</span>
            </div>
          </div>

          <div className="hero-search" id="diccionario">
            <p className="eyebrow">Consulta el acervo</p>
            <h2>Una entrada, todas sus relaciones.</h2>
            <form className="searchbox" onSubmit={handleSearch}>
              <span className="search-icon" aria-hidden="true" />
              <label className="sr-only" htmlFor="search">Buscar en el diccionario</label>
              <input
                id="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Prueba: ba’huí, agua o adverbio…"
              />
              <button type="submit">Buscar</button>
            </form>
            <div className="search-help">
              <span>Palabras, traducciones, categorías y variantes.</span>
              <button type="button" onClick={() => { setQuery("ba’huí"); setSubmittedQuery("ba’huí"); }}>
                Ver ejemplo
              </button>
            </div>
          </div>
        </section>

        <section className="entry-section" id="resultado" aria-live="polite">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Ficha lexicográfica maestra</p>
              <h2>{selectedEntry ? "Resultado documentado" : "Sin coincidencia en la muestra"}</h2>
            </div>
            <span className="prototype-badge">Prototipo estructural</span>
          </div>

          {selectedEntry ? (
            <article className="entry-card">
              <div className="entry-main">
                <div className="entry-head">
                  <h3>{selectedEntry.word}</h3>
                  <span>{selectedEntry.grammar}</span>
                  <strong>{selectedEntry.meaning}</strong>
                </div>
                <p className="entry-note"><b>1.</b> {selectedEntry.note}</p>
                <div className="parallel-example">
                  <p lang="tar"><span>Rarámuri</span>{selectedEntry.example}</p>
                  <p><span>Español</span>{selectedEntry.translation}</p>
                </div>
              </div>

              <aside className="trace-card" aria-label="Trazabilidad de la entrada">
                <p className="eyebrow">Procedencia</p>
                <b>Diccionario tarahumara de Samachique</b>
                <span>{selectedEntry.source}</span>
                <dl>
                  <div><dt>Entrada</dt><dd>{selectedEntry.word}</dd></div>
                  <div><dt>Estado</dt><dd>Transcrita</dd></div>
                  <div><dt>Fuente exacta</dt><dd>Por cotejar</dd></div>
                </dl>
                <p className="trace-status">Registro con trazabilidad</p>
              </aside>
            </article>
          ) : (
            <div className="empty-state">
              <b>La maqueta contiene tres entradas de demostración.</b>
              <span>Prueba “ba’huí”, “abé”, “agua”, “hoy” o “buscar”.</span>
            </div>
          )}
        </section>

        <section className="explore-section" id="corpus">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Puertas de entrada</p>
              <h2>Explorar el acervo desde distintas preguntas</h2>
            </div>
            <p>La misma información lexicográfica se reutiliza sin perder su vínculo con la fuente.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card featured">
              <span className="feature-number">01</span>
              <p className="eyebrow">Diccionario</p>
              <h3>Entradas rarámuri-español</h3>
              <p>Palabra, clasificación, acepciones, ejemplos, variantes y procedencia en una ficha unificada.</p>
              <a href="#diccionario">Consultar una entrada <span>→</span></a>
            </article>
            <article className="feature-card">
              <span className="feature-number">02</span>
              <p className="eyebrow">Corpus paralelo</p>
              <h3>Oraciones alineadas</h3>
              <p>Ejemplos rarámuri y traducciones españolas preparados para búsqueda y análisis.</p>
              <a href="#ejemplo-paralelo">Ver alineación <span>→</span></a>
            </article>
            <article className="feature-card">
              <span className="feature-number">03</span>
              <p className="eyebrow">Variación</p>
              <h3>Alternancias gráficas</h3>
              <p>Relaciones r/l, g/c, consonante inicial, i/e y ba/hua explicadas y navegables.</p>
              <a href="#variantes">Explorar variantes <span>→</span></a>
            </article>
            <article className="feature-card">
              <span className="feature-number">04</span>
              <p className="eyebrow">Enseñanza</p>
              <h3>Selecciones didácticas</h3>
              <p>Palabras ilustrables, ejemplos iniciales y materiales de complejidad gradual.</p>
              <a href="#productos">Ver recursos <span>→</span></a>
            </article>
          </div>
        </section>

        <section className="parallel-section" id="ejemplo-paralelo">
          <div className="parallel-copy">
            <p className="eyebrow">Corpus paralelo de ejemplos</p>
            <h2>Cada oración permanece junto a su traducción.</h2>
            <p>
              La alineación conserva la entrada que originó el ejemplo, su categoría gramatical y la página
              de procedencia para que el dato pueda volver a verificarse.
            </p>
            <div className="alignment-key">
              <span><i className="dot raramuri" /> texto rarámuri</span>
              <span><i className="dot spanish" /> traducción española</span>
            </div>
          </div>
          <div className="alignment-card">
            <div className="alignment-row">
              <span className="line-number">01</span>
              <p lang="tar"><small>rarámuri</small>Nijeni ama cahué.</p>
              <p><small>español</small>Voy a buscar el caballo.</p>
            </div>
            <div className="alignment-row">
              <span className="line-number">02</span>
              <p lang="tar"><small>rarámuri</small>Abé huarú ucuri.</p>
              <p><small>español</small>Hoy llovió mucho.</p>
            </div>
            <div className="alignment-footer">
              <span>2 ejemplos de demostración</span>
              <span>Entrada + página + fuente</span>
            </div>
          </div>
        </section>

        <section className="variants-section" id="variantes">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Base de variantes gráficas</p>
              <h2>Una forma puede conducir a otra.</h2>
            </div>
            <p>Alternancias descritas en las advertencias de la fuente.</p>
          </div>
          <div className="variant-strip">
            <div><b>r / l</b><span>corachi ↔ colachi</span></div>
            <div><b>g / c</b><span>garé ↔ caré</span></div>
            <div><b>consonante inicial</b><span>gará ↔ ará</span></div>
            <div><b>i / e</b><span>quimá ↔ quemá</span></div>
            <div><b>ba / hua</b><span>basoná ↔ huasoná</span></div>
          </div>
        </section>

        <section className="products-section" id="productos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Arquitectura completa</p>
              <h2>Treinta productos, una infraestructura común</h2>
            </div>
            <p>La clasificación permite crecer por etapas sin fragmentar el corpus ni duplicar información.</p>
          </div>

          <div className="product-filters" aria-label="Filtrar productos">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {visibleProducts.map((product) => (
              <article className="product-row" key={product.id}>
                <span>{String(product.id).padStart(2, "0")}</span>
                <div>
                  <small>{product.group}</small>
                  <h3>{product.title}</h3>
                </div>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="sources-section" id="fuentes">
          <div className="source-intro">
            <p className="eyebrow">Fuentes y método</p>
            <h2>La procedencia no es una nota al pie: es parte del dato.</h2>
            <p>
              Cada registro futuro deberá indicar entrada, página y documento exactos. La maqueta separa la
              transcripción de trabajo del facsímil para facilitar el cotejo editorial.
            </p>
          </div>
          <div className="source-list">
            <article>
              <span>Fuente primaria</span>
              <b>Diccionario tarahumara de Samachique</b>
              <p>K. Simón Hilton · edición especial corregida y actualizada, 1993.</p>
              <small>Fascículo digital · 156 páginas</small>
            </article>
            <article>
              <span>Documento de trabajo</span>
              <b>Transcripción estructurada rarámuri-español</b>
              <p>Entradas en columnas con clasificación, traducción, ejemplos y comentarios.</p>
              <small>PDF de trabajo · 87 páginas</small>
            </article>
          </div>
        </section>

        <aside className="editorial-note">
          <b>Nota editorial</b>
          <p>
            Esta primera versión define la experiencia y la organización del portal. Los conteos finales,
            la normalización ortográfica y la foliación exacta se validarán durante la carga completa del corpus.
          </p>
        </aside>
      </main>

      <footer>
        <div className="footer-brand">
          <img src="/uceees-logo.png" alt="" />
          <span><b>Universidad CEEES</b>Centro de Estudios Especializados en Educación Superior</span>
        </div>
        <div className="footer-links">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Mapa de productos</a>
          <a href="#fuentes">Metodología</a>
        </div>
        <p>Prototipo académico · Cuauhtémoc, Chihuahua</p>
      </footer>
    </>
  );
}
