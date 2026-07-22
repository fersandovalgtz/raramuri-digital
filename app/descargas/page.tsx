import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import manifest from "../../public/downloads/manifest.json";

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
          <p>Exportaciones completas de la base lexicográfica maestra. Todos los formatos contienen {manifest.entry_count.toLocaleString("es-MX")} entradas.</p>
        </header>

        <section className="metric-grid downloads-metrics" aria-label="Métricas de interoperabilidad">
          <div><span>Entradas</span><strong>{manifest.entry_count.toLocaleString("es-MX")}</strong><small>En cada exportación</small></div>
          <div><span>Formatos</span><strong>5</strong><small>XML, JSON, CSV, SQL, TEI</small></div>
          <div><span>Codificación</span><strong>UTF-8</strong><small>Acentos y saltillos</small></div>
          <div><span>API</span><strong>REST</strong><small>OpenAPI 3.1</small></div>
        </section>

        <section className="content-section download-section">
          <h2>Archivos</h2>
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

        <section className="content-section integrity-section">
          <h2>Control de publicación</h2>
          <div className="definition-grid">
            <article><h3>Estado de publicación</h3><p>{manifest.publication_status}. La API y las exportaciones públicas contienen únicamente este conjunto.</p></article>
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
