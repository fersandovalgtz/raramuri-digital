import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import metadata from "../../project-metadata.json";
import quality from "../../public/downloads/quality-report.json";

const repository = "https://github.com/fersandovalgtz/raramuri-digital/blob/main";

const documents = [
  { code: "DOC-01", title: "Ficha del conjunto", description: "Motivación, composición, fuentes, procesamiento, usos, limitaciones, distribución y mantenimiento.", es: "DATASHEET.md", en: "DATASHEET.en.md" },
  { code: "DOC-02", title: "Esquema de datos", description: "Campos, tipos, cardinalidades, vocabularios, identificadores, relaciones y serializaciones.", es: "SCHEMA.md" },
  { code: "DOC-03", title: "Informe de calidad", description: "Completitud, unicidad, cobertura, rangos de página, conteos de exportación y sumas SHA-256.", es: "QUALITY_REPORT.md", json: "/downloads/quality-report.json" },
  { code: "DOC-04", title: "Gobernanza", description: "Derechos lingüísticos, autoridad comunitaria, correcciones, restricciones y prevención de daño.", es: "GOVERNANCE.md" },
  { code: "DOC-05", title: "Contribuciones", description: "Datos mínimos de un reporte, clasificación, revisión documental, revisión especializada y versionamiento.", es: "CONTRIBUTING.md" },
  { code: "DOC-06", title: "Registro de cambios", description: "Historial de publicaciones de plataforma, datos, documentación y estado de validación.", es: "CHANGELOG.md" },
  { code: "DOC-07", title: "Contribuciones CRediT", description: "Autoría, funciones, afiliaciones y distinción entre validación técnica y validación lingüística.", es: "CONTRIBUTORS.md" },
];

export default function DocumentationPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page documentation-page">
        <header className="page-heading documentation-heading">
          <div><span className="module-id">DOCUMENTACIÓN RD-DOC-01</span><h1>Documentación científica</h1></div>
          <p>Contrato editorial y técnico del conjunto de datos: alcance, modelo, calidad, validación, mantenimiento y gobernanza.</p>
        </header>

        <section className="metric-grid documentation-metrics" aria-label="Estado documental">
          <div><span>Entradas</span><strong>{quality.scope.entries.toLocaleString("es-MX")}</strong><small>Base maestra</small></div>
          <div><span>Datos</span><strong>{metadata.dataset_version}</strong><small>Versión publicada</small></div>
          <div><span>Plataforma</span><strong>{metadata.platform_version}</strong><small>Versión operativa</small></div>
          <div><span>Integridad</span><strong>{quality.integrity.duplicate_record_ids === 0 ? "VÁLIDA" : "REVISAR"}</strong><small>Pruebas estructurales</small></div>
        </section>

        <section className="content-section">
          <h2>Documentos</h2>
          <div className="documentation-grid">
            {documents.map((document) => (
              <article key={document.code}>
                <code>{document.code}</code>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <div>
                  <a className="text-link" href={`${repository}/${document.es}`} target="_blank" rel="noreferrer">ES / técnico →</a>
                  {document.en ? <a className="text-link" href={`${repository}/${document.en}`} target="_blank" rel="noreferrer">English →</a> : null}
                  {document.json ? <a className="text-link" href={document.json} download>JSON →</a> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Indicadores de calidad</h2>
          <div className="data-table quality-table" role="table" aria-label="Indicadores de calidad">
            <div className="table-header" role="row"><span>Prueba</span><span>Resultado</span><span>Interpretación</span></div>
            <div role="row"><strong>Identificadores duplicados</strong><code>{quality.integrity.duplicate_record_ids}</code><span>Debe ser cero</span></div>
            <div role="row"><strong>Identificadores inválidos</strong><code>{quality.integrity.invalid_record_ids}</code><span>Patrón RD-######</span></div>
            <div role="row"><strong>Rangos de página inválidos</strong><code>{quality.integrity.invalid_page_ranges}</code><span>Inicio ≤ fin</span></div>
            <div role="row"><strong>Lemas ausentes</strong><code>{quality.completeness.missing_headword}</code><span>Campo obligatorio</span></div>
            <div role="row"><strong>Traducciones ausentes</strong><code>{quality.completeness.missing_translation}</code><span>Ausencia conservada de la fuente</span></div>
            <div role="row"><strong>Sumas SHA-256</strong><code>{quality.integrity.all_export_checksums_present ? "6/6" : "REVISAR"}</code><span>Exportaciones interoperables</span></div>
          </div>
        </section>

        <section className="content-section">
          <h2>Estados separados</h2>
          <div className="definition-grid">
            <article><h3>Publicación</h3><p>{metadata.publication_status}. Los registros expuestos por la API pertenecen al conjunto publicado.</p></article>
            <article><h3>Transcripción</h3><p>La base conserva documento y páginas. Una corrección debe mantener el identificador y el historial.</p></article>
            <article><h3>Validación lingüística</h3><p>{metadata.validation_status}. Las pruebas estructurales no equivalen a aval lingüístico.</p></article>
            <article><h3>Gobernanza</h3><p>La reutilización debe preservar procedencia, distinguir inferencias y respetar autoridad y restricciones comunitarias.</p></article>
          </div>
        </section>

        <nav className="product-navigation" aria-label="Navegación de documentación">
          <Link href="/"><span>Anterior</span><strong>Inicio del sistema</strong></Link>
          <Link href="/descargas"><span>Siguiente</span><strong>Datos y API</strong></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
