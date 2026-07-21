import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { productHref, products } from "../lib/products";

const domainCounts = ["Datos", "Corpus", "Inventarios", "Análisis", "Docencia"].map((domain) => ({
  domain,
  count: products.filter((product) => product.domain === domain).length,
}));

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container">
        <section className="system-hero">
          <div className="hero-main">
            <span className="module-id">SISTEMA RD-01</span>
            <div className="project-lockup">
              <h1><span>Rarámuri</span><strong>Digital</strong></h1>
              <span className="title-circuit-line" aria-hidden="true" />
              <p>Infraestructura lexicográfica<br />rarámuri–español</p>
            </div>
            <p className="hero-description">Sistema de datos para organizar, consultar y derivar productos lexicográficos con trazabilidad documental.</p>
            <div className="hero-actions"><Link className="primary-button" href="/productos">Productos</Link><Link className="text-link" href={productHref(products[0])}>Base lexicográfica maestra →</Link></div>
          </div>
          <aside className="status-panel">
            <h2>Estado del sistema</h2>
            <dl>
              <div><dt>Versión</dt><dd>3.0</dd></div>
              <div><dt>Base maestra</dt><dd><i className="status-dot active" /> Operativa</dd></div>
              <div><dt>Corpus P-02</dt><dd><i className="status-dot active" /> Operativo</dd></div>
              <div><dt>Corpus P-03</dt><dd><i className="status-dot active" /> Operativo</dd></div>
              <div><dt>Terminología P-04</dt><dd><i className="status-dot active" /> Operativa</dd></div>
              <div><dt>Variantes P-05</dt><dd><i className="status-dot active" /> Operativa</dd></div>
              <div><dt>Saltillo P-06</dt><dd><i className="status-dot active" /> Operativo</dd></div>
              <div><dt>Acentuación P-07</dt><dd><i className="status-dot active" /> Operativa</dd></div>
              <div><dt>Inventarios P-08–P-20</dt><dd><i className="status-dot active" /> Operativos</dd></div>
              <div><dt>Análisis P-21–P-30</dt><dd><i className="status-dot active" /> Operativos</dd></div>
              <div><dt>Productos</dt><dd>30 rutas</dd></div>
              <div><dt>Validación</dt><dd><i className="status-dot pending" /> Pendiente</dd></div>
              <div><dt>Acceso</dt><dd>Privado</dd></div>
            </dl>
          </aside>
        </section>

        <section className="metric-grid" aria-label="Métricas del proyecto">
          <div><span>Entradas</span><strong>2,581</strong><small>Base maestra</small></div>
          <div><span>Páginas</span><strong>85</strong><small>Fuente estructurada</small></div>
          <div><span>Familias</span><strong>15</strong><small>Clasificación gramatical</small></div>
          <div><span>Productos</span><strong>30</strong><small>Rutas independientes</small></div>
        </section>

        <section className="institutional-logos" aria-labelledby="institutional-logos-title">
          <h2 id="institutional-logos-title">Instituciones responsables</h2>
          <div>
            <article className="institutional-logo ceees-logo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uceees-logo.png" width={118} height={112} alt="Universidad CEEES" />
              <span>Universidad CEEES</span>
            </article>
            <article className="institutional-logo uacj-logo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-uacj.png" width={330} height={117} alt="Universidad Autónoma de Ciudad Juárez" />
              <span>Universidad Autónoma de Ciudad Juárez</span>
            </article>
            <article className="institutional-logo ca-logo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-ca-uacj-113.png" width={460} height={148} alt="Cuerpo Académico UACJ-113, Estudios sobre Prácticas Educativas e Interculturalidad" />
              <span>Cuerpo Académico UACJ-113</span>
            </article>
          </div>
        </section>

        <section className="content-section" id="proyecto">
          <h2>Proyecto</h2>
          <div className="definition-grid">
            <article><h3>Objetivo</h3><p>Construir una infraestructura lexicográfica reutilizable a partir del diccionario rarámuri–español y sus ejemplos documentales.</p></article>
            <article><h3>Alcance</h3><p>Base maestra, corpus, inventarios gramaticales, índices, relaciones semánticas, recursos docentes y control de procedencia.</p></article>
            <article><h3>Unidad de datos</h3><p>Entrada lexicográfica identificada por registro, lema, clase, traducción, acepciones, ejemplos, variantes, fuente y página.</p></article>
            <article><h3>Estado</h3><p>Treinta productos materializados. Cotejo con facsímil y validación lingüística, semántica y didáctica pendientes.</p></article>
          </div>
        </section>

        <section className="content-section" id="arquitectura">
          <h2>Arquitectura</h2>
          <div className="architecture-grid">
            <article><span>01</span><h3>Fuentes</h3><p>PDF textual y facsímil.</p></article>
            <article><span>02</span><h3>Extracción</h3><p>Segmentación por filas y páginas.</p></article>
            <article><span>03</span><h3>Persistencia</h3><p>Base relacional D1.</p></article>
            <article><span>04</span><h3>Servicios</h3><p>API JSON y exportación CSV.</p></article>
            <article><span>05</span><h3>Interfaces</h3><p>Consulta, filtros y fichas.</p></article>
            <article><span>06</span><h3>Derivación</h3><p>30 productos versionados.</p></article>
          </div>
          <div className="data-table architecture-table" role="table" aria-label="Capas del sistema">
            <div className="table-header" role="row"><span>Capa</span><span>Componente</span><span>Responsabilidad</span><span>Estado</span></div>
            <div role="row"><code>DATA</code><strong>lexical_entries</strong><span>Registro canónico y trazabilidad</span><em>OPERATIVO</em></div>
            <div role="row"><code>API</code><strong>/api/lexicon</strong><span>Búsqueda, filtros, paginación y CSV</span><em>OPERATIVO</em></div>
            <div role="row"><code>WEB</code><strong>/productos/[slug]</strong><span>Rutas técnicas por producto</span><em>OPERATIVO</em></div>
            <div role="row"><code>DERIVED</code><strong>/api/advanced-products</strong><span>P-21–P-30: consulta, filtros y exportación</span><em>OPERATIVO</em></div>
            <div role="row"><code>QA</code><strong>validation_status</strong><span>Cotejo documental y lingüístico</span><em className="pending-text">PENDIENTE</em></div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-title-row"><h2>Productos</h2><Link className="text-link" href="/productos">Ver los 30 productos →</Link></div>
          <div className="domain-grid">
            {domainCounts.map((item) => <article key={item.domain}><span>{item.domain}</span><strong>{item.count}</strong></article>)}
          </div>
          <div className="product-list-preview">
            {products.slice(0, 6).map((product) => (
              <Link key={product.id} href={productHref(product)}>
                <code>P-{String(product.id).padStart(2, "0")}</code>
                <span>{product.title}</span>
                <em>{product.status}</em>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section" id="fuentes">
          <h2>Fuentes</h2>
          <div className="source-grid">
            <article><header><code>SRC-01</code><span>Fuente primaria</span></header><h3>Diccionario tarahumara de Samachique</h3><dl><div><dt>Autor</dt><dd>K. Simón Hilton</dd></div><div><dt>Edición</dt><dd>1993</dd></div><div><dt>Formato</dt><dd>PDF facsimilar</dd></div><div><dt>Páginas</dt><dd>156</dd></div><div><dt>Uso</dt><dd>Cotejo documental</dd></div></dl></article>
            <article><header><code>SRC-02</code><span>Fuente estructurada</span></header><h3>DICCIONARIO raramuri</h3><dl><div><dt>Formato</dt><dd>PDF textual</dd></div><div><dt>Páginas</dt><dd>87</dd></div><div><dt>Filas</dt><dd>2,581</dd></div><div><dt>Cobertura</dt><dd>Páginas 3–87</dd></div><div><dt>Estado</dt><dd>Transcrito</dd></div></dl></article>
          </div>
        </section>

        <section className="content-section" id="instituciones">
          <h2>Instituciones</h2>
          <div className="institution-grid">
            <article><code>INST-01</code><h3>Universidad CEEES</h3><p>Centro de Estudios Especializados en Educación Superior, Cuauhtémoc.</p><a href="mailto:informes@ceees.mx">informes@ceees.mx</a><a href="https://ceees.mx" target="_blank" rel="noreferrer">ceees.mx</a></article>
            <article><code>INST-02</code><h3>Universidad Autónoma de Ciudad Juárez</h3><p>División Multidisciplinaria en Cuauhtémoc.</p><a href="mailto:div.cua@uacj.mx">div.cua@uacj.mx</a><a href="https://www.uacj.mx/DMC/" target="_blank" rel="noreferrer">uacj.mx/DMC</a></article>
            <article><code>INST-03</code><h3>Cuerpo Académico UACJ-113</h3><p>Estudios sobre Prácticas Educativas e Interculturalidad.</p><a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a></article>
          </div>
        </section>

        <section className="content-section" id="responsable">
          <h2>Responsable</h2>
          <div className="responsible-card">
            <div><span>Nombre</span><strong>Dr. Fernando Sandoval Gutiérrez</strong></div>
            <div><span>Función</span><strong>Coordinación académica y técnica</strong></div>
            <div><span>Adscripción</span><strong>UACJ · Universidad CEEES · UACJ-113</strong></div>
            <div><span>Correo</span><strong><a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a></strong></div>
            <div><span>ORCID</span><strong><a href="https://orcid.org/0000-0002-3168-6725" target="_blank" rel="noreferrer">0000-0002-3168-6725</a></strong></div>
          </div>
        </section>

        <section className="content-section" id="licencia">
          <h2>Licencia</h2>
          <div className="license-grid">
            <article><h3>CC BY-NC-SA 4.0</h3><p>Los datos y la documentación producidos por el proyecto pueden compartirse y adaptarse con atribución, para fines no comerciales y bajo la misma licencia.</p><a className="text-link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" target="_blank" rel="license noreferrer">Términos de la licencia →</a></article>
            <article><h3>Exclusiones</h3><p>Los facsímiles, textos fuente, logotipos y materiales de terceros conservan sus propios derechos y condiciones de uso.</p></article>
            <article><h3>Atribución</h3><p>Rarámuri Digital. Fernando Sandoval Gutiérrez; Universidad CEEES; Universidad Autónoma de Ciudad Juárez; Cuerpo Académico UACJ-113.</p></article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
