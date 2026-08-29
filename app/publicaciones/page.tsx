import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Publicaciones académicas | Rarámuri Digital",
  description: "Publicaciones académicas relacionadas con Rarámuri Digital y Rarámuri Histórico Digital, con DOI, metadatos bibliográficos y acceso abierto.",
  alternates: { canonical: "https://raramuri.ceees.mx/publicaciones" },
  robots: { index: true, follow: true },
};

export default function PublicationsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page documentation-page">
        <header className="page-heading documentation-heading">
          <div><span className="module-id">PUBLICACIONES RD-PUB-01</span><h1>Publicaciones académicas</h1></div>
          <p>Producción académica complementaria vinculada con los corpus, datos y software del ecosistema Rarámuri Digital, manteniendo separados los tipos documentales y sus responsabilidades científicas.</p>
        </header>

        <section className="content-section">
          <h2>Rarámuri Histórico Digital · Steffel 1791/1809</h2>
          <div className="definition-grid">
            <article>
              <span className="module-id">RHD-REP-01 · 2026</span>
              <h3>Rarámuri Histórico Digital: edición histórico-digital y corpus computacional del <em>Tarahumarisches Wörterbuch</em> de Matthäus Steffel (1791/1809)</h3>
              <p>Informe técnico-académico de constitución, procesamiento, trazabilidad y reproducibilidad del Corpus Steffel 1791/1809.</p>
              <p><strong>Fernando Sandoval Gutiérrez</strong> · 24 páginas · CC BY 4.0.</p>
              <p><a className="text-link" href="https://doi.org/10.5281/zenodo.22165824" target="_blank" rel="noreferrer">DOI 10.5281/zenodo.22165824 →</a></p>
              <p><Link className="text-link" href="/publicaciones/steffel-1791-1809">Landing académica y metadatos →</Link></p>
            </article>
            <article>
              <span className="module-id">CORPUS RELACIONADO</span>
              <h3>Rarámuri Histórico Digital — Corpus Steffel 1791/1809 v1.0.1</h3>
              <p>Corpus/software histórico-digital documentado por el informe, preservado como objeto independiente.</p>
              <p><a className="text-link" href="https://doi.org/10.5281/zenodo.21958018" target="_blank" rel="noreferrer">DOI de versión 10.5281/zenodo.21958018 →</a></p>
              <p><a className="text-link" href="https://github.com/fersandovalgtz/raramuri-historico" target="_blank" rel="noreferrer">Repositorio reproducible →</a></p>
            </article>
          </div>
        </section>

        <section className="content-section">
          <h2>Regla de citación</h2>
          <p>Cuando una afirmación dependa del método, la arquitectura editorial, la procedencia o los límites del proyecto Steffel, cite el informe. Cuando dependa de datos, archivos o una versión reproducible del corpus, cite además el DOI específico del corpus. Si depende de una lectura histórica, cite también a Steffel 1809 y la página correspondiente.</p>
        </section>

        <nav className="product-navigation" aria-label="Navegación de publicaciones">
          <Link href="/"><span>Anterior</span><strong>Inicio del sistema</strong></Link>
          <Link href="/publicaciones/steffel-1791-1809"><span>Siguiente</span><strong>Informe Steffel</strong></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
