import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import manifest from "../../public/downloads/manifest.json";

const pdfReleaseBase = "https://github.com/fersandovalgtz/raramuri-digital/releases/download/pdf-latest";

const formatDefinitions = [
  {
    key: "raramuri-lexico.xml",
    code: "XML",
    title: "Archivo XML lexicográfico",
    description: "Estructura jerárquica completa para integración en proyectos de humanidades digitales y flujos XML.",
    schema: "Rarámuri Digital Lexicon 1.0",
  },
  {
    key: "raramuri-lexico.json",
    code: "JSON",
    title: "Archivo JSON",
    description: "Objeto autocontenido para aplicaciones web, móviles, procesos ETL y servicios de datos.",
    schema: "JSON UTF-8 · arreglos tipados",
  },
  {
    key: "raramuri-lexico.csv",
    code: "CSV",
    title: "Archivo CSV",
    description: "Tabla plana con una entrada por fila, conteos derivados y campos complejos serializados como JSON.",
    schema: "RFC 4180 · 22 variables",
  },
  {
    key: "raramuri-lexico.sql",
    code: "SQL",
    title: "Base SQL consultable",
    description: "Esquema normalizado con entradas, acepciones, ejemplos, variantes, índices y vista de registros autorizados.",
    schema: "SQLite 3 · 5 tablas · 1 vista",
  },
  {
    key: "raramuri-lex0.xml",
    code: "TEI",
    title: "Edición digital TEI Lex-0",
    description: "Codificación lexicográfica interoperable con cabecera documental, formas, gramática, sentidos, ejemplos y procedencia.",
    schema: "TEI Lex-0 0.9.5",
  },
];

function formatBytes(bytes: number) {
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(2)} MB` : `${Math.round(bytes / 1000)} KB`;
}

export default function DownloadsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page downloads-page">
        <header className="page-heading downloads-heading">
          <div><span className="module-id">INTEROPERABILIDAD RD-EXP-01</span><h1>Datos y servicios</h1></div>
          <p>Exportaciones completas de la base lexicográfica maestra. Todos los formatos estructurados contienen {manifest.entry_count.toLocaleString("es-MX")} entradas.</p>
        </header>

        <section className="metric-grid downloads-metrics" aria-label="Métricas de interoperabilidad">
          <div><span>Entradas</span><strong>{manifest.entry_count.toLocaleString("es-MX")}</strong><small>En cada exportación completa</small></div>
          <div><span>Formatos</span><strong>7</strong><small>XML, JSON, CSV, SQL, TEI, PDF, ZIP</small></div>
          <div><span>Codificación</span><strong>UTF-8</strong><small>Acentos y saltillos</small></div>
          <div><span>API</span><strong>REST</strong><small>OpenAPI 3.1 + capas candidatas</small></div>
        </section>

        <section className="content-section download-section">
          <h2>Archivos estructurados</h2>
          <div className="download-grid">
            {formatDefinitions.map((format) => {
              const file = manifest.files.find((item) => item.file === format.key);
              if (!file) return null;
              return (
                <article key={format.key} className="download-card">
                  <header><code>{format.code}</code><span>{formatBytes(file.bytes)}</span></header>
                  <h3>{format.title}</h3>
                  <p>{format.description}</p>
                  <dl>
                    <div><dt>Registros</dt><dd>{file.entry_count.toLocaleString("es-MX")}</dd></div>
                    <div><dt>Esquema</dt><dd>{format.schema}</dd></div>
                    <div><dt>SHA-256</dt><dd><code title={file.sha256}>{file.sha256.slice(0, 16)}…</code></dd></div>
                  </dl>
                  <a className="primary-button" href={`/downloads/${format.key}`} download>Descargar {format.code}</a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="content-section download-section">
          <h2>Ediciones PDF para lectura e impresión</h2>
          <p>Estas ediciones se generan automáticamente desde la base maestra. Facilitan la consulta sin conexión, la impresión, la citación y el uso docente, pero no sustituyen los formatos estructurados para correcciones o análisis computacional.</p>
          <div className="download-grid">
            <article className="download-card">
              <header><code>PDF</code><span>Edición completa</span></header>
              <h3>Diccionario completo</h3>
              <p>Lema, clasificación, traducción, acepciones, variantes, ejemplos, identificador y procedencia documental de cada entrada.</p>
              <dl>
                <div><dt>Registros</dt><dd>{manifest.entry_count.toLocaleString("es-MX")}</dd></div>
                <div><dt>Uso</dt><dd>Consulta, impresión y lectura sin conexión</dd></div>
                <div><dt>Generación</dt><dd>Automática y reproducible</dd></div>
              </dl>
              <a className="primary-button" href={`${pdfReleaseBase}/raramuri-lexico-completo.pdf`}>Descargar PDF completo</a>
            </article>

            <article className="download-card">
              <header><code>ZIP</code><span>Secciones alfabéticas</span></header>
              <h3>Paquete por letras</h3>
              <p>PDF independientes por letra inicial para distribuir, imprimir o consultar únicamente una parte del repertorio.</p>
              <dl>
                <div><dt>Cobertura</dt><dd>{manifest.entry_count.toLocaleString("es-MX")} entradas</dd></div>
                <div><dt>Contenido</dt><dd>Un PDF por sección alfabética</dd></div>
                <div><dt>Integridad</dt><dd>Manifiesto con SHA-256</dd></div>
              </dl>
              <a className="primary-button" href={`${pdfReleaseBase}/raramuri-lexico-alfabetico.zip`}>Descargar paquete ZIP</a>
            </article>
          </div>
          <p className="manifest-link"><a className="text-link" href={`${pdfReleaseBase}/manifest-pdf.json`}>Descargar manifiesto de las ediciones PDF →</a></p>
          <p className="manifest-link"><a className="text-link" href="https://github.com/fersandovalgtz/raramuri-digital/blob/main/PDF_EXPORTS.md">Consultar el método de generación y control editorial →</a></p>
        </section>

        <section className="content-section api-section">
          <h2>API lexicográfica</h2>
          <div className="api-grid">
            <article>
              <code>GET /api/lexicon</code>
              <h3>Consulta de entradas autorizadas</h3>
              <p>Búsqueda por identificador, texto y categoría; paginación de 1 a 200 registros; salida JSON o CSV.</p>
              <div className="api-actions">
                <a className="primary-button" href="/api/lexicon?limit=10" target="_blank" rel="noreferrer">Ejecutar consulta</a>
                <a className="text-link" href="/api/openapi" target="_blank" rel="noreferrer">Especificación OpenAPI →</a>
              </div>
            </article>
            <div className="api-examples">
              <h3>Parámetros</h3>
              <code>/api/lexicon?id=RD-000001</code>
              <code>/api/lexicon?q=agua&amp;limit=25</code>
              <code>/api/lexicon?pos=Vt&amp;page=2</code>
              <code>/api/lexicon?format=csv</code>
              <a className="text-link" href="/downloads/openapi-lexico.json" download>Descargar OpenAPI JSON →</a>
            </div>
          </div>
        </section>

        <section className="content-section api-section">
          <h2>Capas experimentales · 1.1.0-candidate</h2>
          <p>Estas interfaces publican estructuras documentales reproducibles para revisión y reutilización sin cambiar la versión estable del conjunto de datos, que continúa en 1.0.0. Su exposición pública no equivale a validación lingüística.</p>
          <div className="api-grid">
            <article>
              <code>GET /api/lexical-relations</code>
              <h3>Relaciones lexicográficas canónicas</h3>
              <p>28 relaciones documentales con destino resuelto; incluye remisiones, referencias explícitas de variante y relaciones gramaticales. Cuatro destinos fueron adjudicados documentalmente y permanecen pendientes de cotejo lingüístico humano.</p>
              <div className="api-actions">
                <a className="primary-button" href="/api/lexical-relations?limit=28" target="_blank" rel="noreferrer">Consultar relaciones</a>
                <a className="text-link" href="/api/lexical-relations?format=csv">Exportar CSV →</a>
              </div>
            </article>
            <article>
              <code>GET /api/typed-variants</code>
              <h3>Variants tipados</h3>
              <p>224 tokens heredados del campo compatible <code>variants</code>, tipados por procedencia y naturaleza documental; 0 orígenes permanecen sin resolver.</p>
              <div className="api-actions">
                <a className="primary-button" href="/api/typed-variants?limit=50" target="_blank" rel="noreferrer">Consultar capa tipada</a>
                <a className="text-link" href="/api/typed-variants?format=jsonl">Exportar JSONL →</a>
              </div>
            </article>
          </div>
          <p className="manifest-link"><a className="text-link" href="https://github.com/fersandovalgtz/raramuri-digital/blob/main/CANDIDATE_LAYER_PUBLICATION_V1.md">Consultar la frontera de publicación y cautelas metodológicas →</a></p>
        </section>

        <section className="content-section integrity-section">
          <h2>Control de publicación</h2>
          <div className="definition-grid">
            <article><h3>Estado de publicación</h3><p>{manifest.publication_status}. Las exportaciones estables contienen únicamente el conjunto 1.0.0; las capas candidatas están señaladas y separadas.</p></article>
            <article><h3>Estado lingüístico</h3><p>{manifest.validation_status}. El estado se registra explícitamente en todos los formatos.</p></article>
            <article><h3>Procedencia</h3><p>Cada entrada conserva código de fuente, documento, página inicial, página final y estado de transcripción.</p></article>
            <article><h3>Licencia</h3><p>{manifest.license.id}. Los textos fuente, facsímiles, logotipos y materiales de terceros conservan sus derechos.</p></article>
          </div>
          <p className="manifest-link"><a className="text-link" href="/downloads/manifest.json" download>Descargar manifiesto técnico y sumas SHA-256 →</a></p>
          <p className="manifest-link"><a className="text-link" href="/downloads/quality-report.json" download>Descargar informe de calidad reproducible →</a></p>
        </section>

        <nav className="product-navigation" aria-label="Navegación de datos">
          <Link href="/documentacion"><span>Anterior</span><strong>Documentación científica</strong></Link>
          <Link href="/productos"><span>Siguiente</span><strong>30 productos lexicográficos</strong></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}