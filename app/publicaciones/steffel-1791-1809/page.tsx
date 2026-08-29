import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

const canonical = "https://raramuri.ceees.mx/publicaciones/steffel-1791-1809";
const doi = "10.5281/zenodo.22165824";
const doiUrl = `https://doi.org/${doi}`;
const zenodoRecord = "https://zenodo.org/records/22165824";
const pdfUrl = "https://zenodo.org/records/22165824/files/Raramuri_Historico_Digital_Informe_Steffel_v1.0.pdf?download=1";
const corpusVersionDoi = "10.5281/zenodo.21958018";
const corpusConceptDoi = "10.5281/zenodo.21957212";
const repository = "https://github.com/fersandovalgtz/raramuri-historico";

const title = "Rarámuri Histórico Digital: edición histórico-digital y corpus computacional del Tarahumarisches Wörterbuch de Matthäus Steffel (1791/1809)";
const description = "Informe técnico-académico de constitución, procesamiento, trazabilidad y reproducibilidad del Corpus Steffel 1791/1809. Documenta fuente, capas editoriales, OCR e IA asistida, procedencia, interoperabilidad, control de calidad, versionamiento y límites epistemológicos.";

export const metadata: Metadata = {
  title: `${title} | Rarámuri Digital`,
  description,
  keywords: [
    "Rarámuri",
    "Tarahumara",
    "Matthäus Steffel",
    "historical lexicography",
    "digital humanities",
    "digital scholarly edition",
    "Indigenous languages",
    "historical linguistics",
    "TEI Lex-0",
    "IIIF",
    "FAIR data",
    "provenance",
    "reproducibility",
    "OCR",
    "artificial intelligence",
  ],
  authors: [{ name: "Fernando Sandoval Gutiérrez", url: "https://orcid.org/0000-0002-3168-6725" }],
  creator: "Fernando Sandoval Gutiérrez",
  publisher: "Zenodo",
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: canonical,
    title,
    description,
    publishedTime: "2026-08-29",
    authors: ["Fernando Sandoval Gutiérrez"],
  },
  twitter: { card: "summary_large_image", title, description },
  other: {
    citation_title: title,
    citation_author: "Fernando Sandoval Gutiérrez",
    citation_publication_date: "2026/08/29",
    citation_doi: doi,
    citation_pdf_url: pdfUrl,
    citation_language: "es",
    citation_technical_report_institution: "Universidad Autónoma de Ciudad Juárez; Universidad CEEES / CEEES Cuauhtémoc",
    "DC.title": title,
    "DC.creator": "Fernando Sandoval Gutiérrez",
    "DC.date": "2026-08-29",
    "DC.identifier": doiUrl,
    "DC.type": "Technical report",
    "DC.language": "es",
    "DC.rights": "CC BY 4.0",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  additionalType: "https://schema.org/Report",
  headline: title,
  name: title,
  description,
  abstract: "El informe documenta la construcción de Rarámuri Histórico Digital — Corpus Steffel 1791/1809, con 2,495 candidatos documentales, 1,965 artículos activos, 530 falsos límites preservados, cobertura diplomática IA-asistida para los 1,965 artículos, 482 casos PHIL recotejados y 298 relaciones diacrónicas mantenidas como candidatos. Distingue testimonio, OCR, segmentación, reconstrucción documental, transcripción diplomática, recotejo filológico asistido y datos derivados, sin atribuir validación filológica o lingüística humana cuando ésta no existe.",
  identifier: [doiUrl, zenodoRecord],
  url: canonical,
  sameAs: [doiUrl, zenodoRecord],
  datePublished: "2026-08-29",
  inLanguage: "es",
  version: "1.0",
  license: "https://creativecommons.org/licenses/by/4.0/",
  author: {
    "@type": "Person",
    name: "Fernando Sandoval Gutiérrez",
    identifier: "https://orcid.org/0000-0002-3168-6725",
    sameAs: ["https://orcid.org/0000-0002-3168-6725", "https://github.com/fersandovalgtz"],
    affiliation: [
      { "@type": "Organization", name: "Universidad Autónoma de Ciudad Juárez", url: "https://www.uacj.mx/" },
      { "@type": "Organization", name: "Universidad CEEES / CEEES Cuauhtémoc", url: "https://ceees.mx/" },
    ],
  },
  publisher: { "@type": "Organization", name: "Zenodo", url: "https://zenodo.org/" },
  encoding: {
    "@type": "MediaObject",
    encodingFormat: "application/pdf",
    contentUrl: pdfUrl,
  },
  about: {
    "@type": "Dataset",
    name: "Rarámuri Histórico Digital — Corpus Steffel 1791/1809 v1.0.1",
    identifier: `https://doi.org/${corpusVersionDoi}`,
    sameAs: [repository, `https://doi.org/${corpusConceptDoi}`],
  },
  citation: [
    { "@type": "Dataset", name: "Rarámuri Histórico Digital — Corpus Steffel 1791/1809 v1.0.1", identifier: `https://doi.org/${corpusVersionDoi}` },
    { "@type": "CreativeWork", name: "Rarámuri Histórico Digital — Corpus Steffel 1791/1809", identifier: `https://doi.org/${corpusConceptDoi}` },
  ],
};

export default function SteffelReportLanding() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page documentation-page">
        <header className="page-heading documentation-heading">
          <div>
            <span className="module-id">PUBLICACIÓN RHD-REP-01</span>
            <h1>{title}</h1>
          </div>
          <p><strong>Informe técnico-académico de constitución, procesamiento, trazabilidad y reproducibilidad del Corpus Steffel 1791/1809.</strong></p>
        </header>

        <section className="metric-grid documentation-metrics" aria-label="Datos bibliográficos principales">
          <div><span>DOI</span><strong>22165824</strong><small>{doi}</small></div>
          <div><span>Versión</span><strong>1.0</strong><small>29 ago 2026</small></div>
          <div><span>Extensión</span><strong>24 pp.</strong><small>PDF académico</small></div>
          <div><span>Licencia</span><strong>CC BY 4.0</strong><small>Acceso abierto</small></div>
        </section>

        <section className="content-section">
          <h2>Acceso y citación</h2>
          <div className="definition-grid">
            <article>
              <h3>Registro académico</h3>
              <p><a className="text-link" href={doiUrl} target="_blank" rel="noreferrer">DOI {doi} →</a></p>
              <p><a className="text-link" href={zenodoRecord} target="_blank" rel="noreferrer">Registro publicado en Zenodo →</a></p>
            </article>
            <article>
              <h3>Documento</h3>
              <p><a className="text-link" href={pdfUrl} target="_blank" rel="noreferrer">Abrir o descargar PDF →</a></p>
              <p>Versión depositada y citable del informe técnico-académico.</p>
            </article>
            <article>
              <h3>Corpus documentado</h3>
              <p><a className="text-link" href={`https://doi.org/${corpusVersionDoi}`} target="_blank" rel="noreferrer">Corpus v1.0.1 · {corpusVersionDoi} →</a></p>
              <p><a className="text-link" href={`https://doi.org/${corpusConceptDoi}`} target="_blank" rel="noreferrer">Concept DOI · {corpusConceptDoi} →</a></p>
            </article>
            <article>
              <h3>Repositorio reproducible</h3>
              <p><a className="text-link" href={repository} target="_blank" rel="noreferrer">GitHub · raramuri-historico →</a></p>
              <p>Datos, documentación, scripts, TEI/TEI Lex-0, IIIF, pruebas y procedencia.</p>
            </article>
          </div>
        </section>

        <section className="content-section">
          <h2>Autoría</h2>
          <p><strong>Fernando Sandoval Gutiérrez</strong> · ORCID <a className="text-link" href="https://orcid.org/0000-0002-3168-6725" target="_blank" rel="noreferrer">0000-0002-3168-6725</a>.</p>
          <p>Universidad Autónoma de Ciudad Juárez · Universidad CEEES / CEEES Cuauhtémoc.</p>
        </section>

        <section className="content-section">
          <h2>Resumen</h2>
          <p>
            Este informe documenta la fuente histórica, la constitución del corpus, las capas documentales y editoriales, el procesamiento mediante OCR e inteligencia artificial asistida, la arquitectura de datos, la procedencia de la evidencia, los mecanismos de control de calidad, la interoperabilidad y los procedimientos de reproducibilidad de <em>Rarámuri Histórico Digital — Corpus Steffel 1791/1809</em>.
          </p>
          <p>
            El objeto científico distingue de forma explícita el testimonio histórico, el OCR, la segmentación, la reconstrucción documental, la transcripción diplomática, el recotejo filológico asistido y las capas derivadas. La incertidumbre se conserva cuando la evidencia no permite una resolución única; una inferencia computacional no se presenta como validación filológica, lingüística, semántica o histórica.
          </p>
        </section>

        <section className="content-section">
          <h2>Composición documentada</h2>
          <div className="data-table quality-table" role="table" aria-label="Composición del Corpus Steffel">
            <div className="table-header" role="row"><span>Dimensión</span><span>Estado</span><span>Alcance</span></div>
            <div role="row"><strong>Candidatos documentales</strong><code>2,495</code><span>Cobertura total del proceso de segmentación</span></div>
            <div role="row"><strong>Artículos activos</strong><code>1,965</code><span>Entradas lexicográficas del corpus</span></div>
            <div role="row"><strong>Falsos límites</strong><code>530</code><span>Preservados como decisiones documentales trazables</span></div>
            <div role="row"><strong>Transcripciones diplomáticas IA-asistidas</strong><code>1,965 / 1,965</code><span>Cobertura de artículos activos</span></div>
            <div role="row"><strong>Casos PHIL recotejados</strong><code>482 / 482</code><span>284 confirmados · 152 corregidos · 46 no resueltos</span></div>
            <div role="row"><strong>Relaciones diacrónicas</strong><code>298 candidate</code><span>No equivalen automáticamente a cognación o continuidad histórica</span></div>
          </div>
        </section>

        <section className="content-section">
          <h2>Relación entre publicación y corpus</h2>
          <div className="definition-grid">
            <article>
              <h3>Objeto A · corpus/software</h3>
              <p><strong>Rarámuri Histórico Digital — Corpus Steffel 1791/1809 v1.0.1.</strong></p>
              <p>Objeto computacional, datos, serializaciones y software reproducible. DOI de versión: <a className="text-link" href={`https://doi.org/${corpusVersionDoi}`}>{corpusVersionDoi}</a>.</p>
            </article>
            <article>
              <h3>Objeto B · informe académico</h3>
              <p><strong>Este informe técnico-académico.</strong></p>
              <p>Publicación explicativa e independiente que documenta método, procedencia, decisiones editoriales, limitaciones y reproducibilidad. DOI: <a className="text-link" href={doiUrl}>{doi}</a>.</p>
            </article>
          </div>
          <p>La separación evita alterar artificialmente el tipo documental del corpus para fines de indexación y permite citar cada objeto según la afirmación científica que sustenta.</p>
        </section>

        <section className="content-section">
          <h2>Límites epistemológicos</h2>
          <p>
            El informe no presenta los resultados IA-asistidos como revisión humana independiente. Las relaciones diacrónicas permanecen como candidatos y no se convierten automáticamente en cognados, etimologías, equivalencias semánticas o demostraciones de continuidad histórica. Las formas históricas tampoco se proponen como norma contemporánea ni sustituyen conocimiento comunitario situado.
          </p>
        </section>

        <section className="content-section">
          <h2>Citación recomendada</h2>
          <p>
            Sandoval Gutiérrez, Fernando. 2026. <em>Rarámuri Histórico Digital: edición histórico-digital y corpus computacional del Tarahumarisches Wörterbuch de Matthäus Steffel (1791/1809)</em>. Informe técnico-académico de constitución, procesamiento, trazabilidad y reproducibilidad del Corpus Steffel 1791/1809. Zenodo. <a className="text-link" href={doiUrl}>{doiUrl}</a>.
          </p>
        </section>

        <section className="content-section">
          <h2>Palabras clave</h2>
          <p>Rarámuri · Tarahumara · Matthäus Steffel · lexicografía histórica · humanidades digitales · edición académica digital · lenguas indígenas · lingüística histórica · TEI Lex-0 · IIIF · FAIR · procedencia · reproducibilidad · OCR · inteligencia artificial.</p>
        </section>

        <nav className="product-navigation" aria-label="Navegación de publicación">
          <Link href="/publicaciones"><span>Anterior</span><strong>Publicaciones académicas</strong></Link>
          <Link href="/documentacion"><span>Siguiente</span><strong>Documentación científica</strong></Link>
        </nav>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
