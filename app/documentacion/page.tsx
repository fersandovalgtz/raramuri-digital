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
  { code: "DOC-05", title: "Contribuciones", description: "Evidencia mínima, códigos de fuente, revisión documental, revisión especializada y versionamiento.", es: "CONTRIBUTING.md" },
  { code: "DOC-06", title: "Registro de cambios", description: "Historial de publicaciones de plataforma, datos, documentación y estado de validación.", es: "CHANGELOG.md" },
  { code: "DOC-07", title: "Contribuciones CRediT", description: "Autoría, funciones, afiliaciones y distinción entre validación técnica y validación lingüística.", es: "CONTRIBUTORS.md" },
  { code: "DOC-08", title: "Registro canónico de fuentes", description: "Distingue fuentes bibliográficas, facsímiles de cotejo, representaciones de trabajo y referencias relacionadas mediante códigos SRC-* y REF-*.", es: "SOURCES.md" },
  { code: "DOC-09", title: "Procedencia", description: "Cadena completa fuente → extracción → dataset → productos derivados → validación → release citable.", es: "PROVENANCE.md" },
  { code: "DOC-10", title: "Expediente Kenneth Simon Hilton", description: "Trayectoria documental desde 1947, genealogía 1959–1993–2016, Samachique, crítica de fuente y preguntas abiertas.", es: "docs/HILTON_SOURCE.md" },
  { code: "DOC-11", title: "Estándar científico", description: "Matriz auditable de citación, metadatos, FAIR, interoperabilidad, reproducibilidad, preservación, gobernanza y deuda científica.", es: "SCIENTIFIC_REPOSITORY_STANDARD.md" },
  { code: "DOC-12", title: "Ecosistema científico", description: "Relaciones con Rarámuri Histórico Digital, recursos educativos, repositorios hermanos, ORCID y redes académicas.", es: "docs/ECOSYSTEM.md" },
];

const ecosystem = [
  {
    title: "Rarámuri Histórico Digital",
    href: "https://github.com/fersandovalgtz/raramuri-historico",
    description: "Fuentes históricas, edición documental y análisis diacrónico reproducible. Las relaciones con Rarámuri Digital se mantienen tipadas y revisables.",
  },
  {
    title: "Rarámuri · recursos educativos",
    href: "https://github.com/fersandovalgtz/raramuri-recursos-educativos",
    description: "Capa pedagógica independiente para materiales y actividades con validación situada y seguridad cultural.",
  },
  {
    title: "Perfil científico",
    href: "https://github.com/fersandovalgtz/fersandovalgtz",
    description: "Hub de identidad académica que conecta proyectos, publicaciones, ORCID, Google Scholar, CATHI-UACJ y otras redes.",
  },
  {
    title: "Libro de Texto Mexicano Digital",
    href: "https://github.com/fersandovalgtz/libro-texto-mexicano-digital",
    description: "Proyecto hermano de patrimonio documental y humanidades digitales con principios compartidos de procedencia y reproducibilidad.",
  },
];

export default function DocumentationPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page documentation-page">
        <header className="page-heading documentation-heading">
          <div><span className="module-id">DOCUMENTACIÓN RD-DOC-01</span><h1>Documentación científica</h1></div>
          <p>Contrato editorial y técnico del conjunto de datos: fuente, procedencia, alcance, modelo, calidad, validación, reproducibilidad, mantenimiento y gobernanza.</p>
        </header>

        <section className="metric-grid documentation-metrics" aria-label="Estado documental">
          <div><span>Entradas</span><strong>{quality.scope.entries.toLocaleString("es-MX")}</strong><small>Base maestra</small></div>
          <div><span>Datos</span><strong>{metadata.dataset_version}</strong><small>Versión publicada</small></div>
          <div><span>Plataforma</span><strong>{metadata.platform_version}</strong><small>Versión operativa</small></div>
          <div><span>Integridad</span><strong>{quality.integrity.duplicate_record_ids === 0 ? "VÁLIDA" : "REVISAR"}</strong><small>Pruebas estructurales</small></div>
        </section>

        <section className="content-section">
          <h2>Identificador persistente</h2>
          <div className="definition-grid">
            <article>
              <h3>DOI de los datos {metadata.dataset_version}</h3>
              <p><a className="text-link" href={`https://doi.org/${metadata.doi}`} target="_blank" rel="noreferrer">{metadata.doi} →</a></p>
              <p>Registro publicado en Zenodo con archivos interoperables, documentación científica y metadatos de citación.</p>
            </article>
            <article>
              <h3>Registro de preservación</h3>
              <p><a className="text-link" href={metadata.zenodo_record} target="_blank" rel="noreferrer">Zenodo record {metadata.zenodo_record.split("/").at(-1)} →</a></p>
              <p>La versión depositada es un objeto citable fijado. Las correcciones científicas futuras deben publicarse como nuevas versiones cuando corresponda.</p>
            </article>
          </div>
        </section>

        <section className="content-section">
          <h2>Fuente documental: Hilton y Samachique</h2>
          <div className="definition-grid">
            <article>
              <span className="module-id">{metadata.primary_reference.source_code}</span>
              <h3>{metadata.primary_reference.creator} · {metadata.primary_reference.year}</h3>
              <p><em>{metadata.primary_reference.title}</em>.</p>
              <p>{metadata.primary_reference.extent}. La obra documenta tarahumara central asociado con Samachique y funciona en este proyecto como referencia bibliográfica y fuente de cotejo.</p>
              <p><a className="text-link" href={metadata.primary_reference.archive} target="_blank" rel="noreferrer">Registro archivístico de SIL México →</a></p>
            </article>
            <article>
              <span className="module-id">{metadata.production_source.source_code}</span>
              <h3>Representación de trabajo</h3>
              <p><code>{metadata.production_source.document}</code></p>
              <p>{metadata.production_source.coverage}. {metadata.production_source.edition_identity_status}.</p>
              <p>Rarámuri Digital no presenta automáticamente el dataset como transcripción directa de Hilton 1993: la identidad material entre la edición de referencia y el objeto efectivamente procesado debe demostrarse mediante cotejo.</p>
            </article>
          </div>
          <p>
            La producción documentable de Kenneth Simon Hilton incluye trabajo sobre tarahumara y guarijío desde 1947, el vocabulario de 1959 y el diccionario de Samachique de 1993. El expediente del proyecto conserva esa genealogía, reconoce colaboradores cuando están documentados y separa hechos confirmados de atribuciones que todavía requieren cotejo material.
          </p>
          <p>
            <a className="text-link" href={`${repository}/docs/HILTON_SOURCE.md`} target="_blank" rel="noreferrer">Leer expediente documental de Hilton →</a>{" · "}
            <a className="text-link" href={`${repository}/SOURCES.md`} target="_blank" rel="noreferrer">Registro de fuentes →</a>{" · "}
            <a className="text-link" href={`${repository}/PROVENANCE.md`} target="_blank" rel="noreferrer">Cadena de procedencia →</a>
          </p>
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

        <section className="content-section">
          <h2>Ecosistema científico</h2>
          <p>Rarámuri Digital se publica como un nodo dentro de un ecosistema de investigación. Los enlaces conectan responsabilidades distintas; no fusionan datasets ni convierten una capa técnica o pedagógica en autoridad lingüística.</p>
          <div className="definition-grid">
            {ecosystem.map((resource) => (
              <article key={resource.href}>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <p><a className="text-link" href={resource.href} target="_blank" rel="noreferrer">Abrir recurso →</a></p>
              </article>
            ))}
          </div>
          <p>
            Identidad académica y descubribilidad:{" "}
            <a className="text-link" href={metadata.academic_identity.orcid} target="_blank" rel="noreferrer">ORCID</a>{" · "}
            <a className="text-link" href={metadata.academic_identity.google_scholar} target="_blank" rel="noreferrer">Google Scholar</a>{" · "}
            <a className="text-link" href={metadata.academic_identity.cathi_uacj} target="_blank" rel="noreferrer">CATHI-UACJ</a>{" · "}
            <a className="text-link" href={metadata.academic_identity.researchgate} target="_blank" rel="noreferrer">ResearchGate</a>{" · "}
            <a className="text-link" href={metadata.academic_identity.researchid} target="_blank" rel="noreferrer">ResearchID</a>{" · "}
            <a className="text-link" href={metadata.academic_identity.academia_edu} target="_blank" rel="noreferrer">Academia.edu</a>
          </p>
          <p><a className="text-link" href={`${repository}/docs/ECOSYSTEM.md`} target="_blank" rel="noreferrer">Ver arquitectura y reglas del ecosistema →</a></p>
        </section>

        <section className="content-section">
          <h2>Cómo citar evidencia</h2>
          <div className="definition-grid">
            <article>
              <h3>Evidencia documental</h3>
              <p>Si una afirmación depende de una forma, glosa, ejemplo o clasificación atribuible a Hilton, cite Hilton 1993 y, cuando sea posible, la página concreta.</p>
            </article>
            <article>
              <h3>Transformación digital</h3>
              <p>Si depende de un registro estructurado, normalización, API o producto derivado, cite además la versión específica de Rarámuri Digital mediante su DOI y el identificador <code>RD-######</code> cuando corresponda.</p>
            </article>
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