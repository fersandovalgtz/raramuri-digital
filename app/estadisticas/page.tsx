import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { ScientificBadges } from "../components/ScientificBadges";

const coreMetrics = [
  ["2,581", "entradas lexicográficas", "Base maestra estructurada"],
  ["30", "productos derivados", "Corpus, inventarios, análisis y docencia"],
  ["5+", "formatos interoperables", "CSV, JSON, XML, SQL, TEI Lex-0 y CLDF"],
  ["1", "API pública", "Esquema OpenAPI documentado"],
];

const qualityMetrics = [
  ["CLDF", "Exportación estructurada disponible"],
  ["TEI Lex-0", "Representación lexicográfica normalizada"],
  ["JSON-LD", "Metadatos FAIR legibles por máquina"],
  ["CITATION.cff", "Citación formal versionada"],
  ["CodeMeta", "Metadatos de software"],
  ["GitHub Actions", "Validaciones automatizadas del repositorio"],
];

export default function StatisticsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page">
        <section className="science-page-hero">
          <span className="module-id">OBSERVATORIO RD</span>
          <h1>Estadísticas y estado científico</h1>
          <p>Indicadores transparentes de cobertura, interoperabilidad, preservación y uso de Rarámuri Digital. Las métricas de contenido proceden de la versión publicada del conjunto de datos; las métricas de tráfico web se incorporarán únicamente desde analítica respetuosa de la privacidad.</p>
        </section>

        <section className="science-metric-grid" aria-label="Indicadores principales">
          {coreMetrics.map(([value, label, note]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{note}</small></article>)}
        </section>

        <section className="content-section">
          <div className="section-title-row"><h2>Uso del portal</h2><span className="privacy-note">Analítica web: preparada · datos públicos pendientes de instrumentación</span></div>
          <div className="traffic-panel">
            <article><span>Visitas</span><strong>—</strong><small>Se mostrará cuando exista una fuente de analítica verificable.</small></article>
            <article><span>Usuarios únicos</span><strong>—</strong><small>Sin fingerprinting ni identificación personal.</small></article>
            <article><span>Países</span><strong>—</strong><small>Agregación geográfica, no seguimiento individual.</small></article>
            <article><span>Descargas / API</span><strong>—</strong><small>Se integrará desde registros agregados de infraestructura.</small></article>
          </div>
          <p className="method-note">Rarámuri Digital no presenta cifras simuladas. Hasta disponer de una fuente confiable, estas métricas permanecen explícitamente sin dato. La arquitectura está preparada para integrar Cloudflare Web Analytics, Plausible o Umami sin modificar el corpus.</p>
        </section>

        <section className="content-section">
          <h2>Salud del dataset</h2>
          <div className="quality-grid">
            {qualityMetrics.map(([label, description]) => <article key={label}><span className="quality-status">✓</span><div><strong>{label}</strong><p>{description}</p></div></article>)}
          </div>
        </section>

        <section className="content-section">
          <h2>Infraestructura científica</h2>
          <ScientificBadges />
        </section>

        <section className="content-section">
          <h2>Metodología de las métricas</h2>
          <div className="definition-grid">
            <article><h3>Reproducibilidad</h3><p>Los indicadores estructurales deben poder reconstruirse a partir de los archivos versionados del repositorio y de los reportes generados por el proyecto.</p></article>
            <article><h3>Transparencia</h3><p>Ningún valor de uso se publica sin una fuente identificable. Las métricas faltantes se muestran como tales y no como estimaciones.</p></article>
            <article><h3>Privacidad</h3><p>La analítica web debe funcionar de forma agregada y proporcional al propósito científico del proyecto, evitando perfiles personales y seguimiento invasivo.</p></article>
            <article><h3>Versionado</h3><p>Las estadísticas del corpus deben interpretarse con referencia a una versión concreta del dataset y a su identificador persistente.</p></article>
          </div>
        </section>

        <div className="science-page-actions"><Link className="primary-button" href="/">Volver al inicio</Link><Link className="text-link" href="/documentacion">Documentación científica →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
