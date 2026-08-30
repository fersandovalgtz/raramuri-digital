import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Atlas documental mínimo — Rarámuri Digital",
  description: "Prototipo cartográfico de geografía documental de Rarámuri Digital con MapLibre GL JS y datos cartográficos abiertos.",
};

export default function AtlasPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page">
        <section className="science-page-hero">
          <span className="module-id">PROTOTIPO CARTOGRÁFICO RD</span>
          <h1>Atlas documental mínimo</h1>
          <p>
            Prueba tecnológica con MapLibre GL JS para visualizar cinco nodos de procedencia,
            genealogía editorial e infraestructura institucional vinculados con Rarámuri Digital.
            El mapa no representa fronteras dialectales, densidad de hablantes ni autoridad territorial.
          </p>
        </section>

        <section className="content-section">
          <iframe
            src="/atlas-minimo.html"
            title="Atlas documental mínimo de Rarámuri Digital"
            style={{ width: "100%", minHeight: "720px", border: "1px solid rgba(23, 32, 51, 0.14)", borderRadius: "16px", background: "#f6f1e8" }}
            loading="lazy"
          />
          <p className="method-note">
            Capa base: OpenFreeMap/OpenStreetMap. Los puntos usan coordenadas de referencia de localidad o ciudad y deben interpretarse junto con la evidencia documental enlazada en cada ficha.
          </p>
        </section>

        <section className="content-section">
          <h2>Qué evalúa este piloto</h2>
          <div className="definition-grid">
            <article><h3>Reutilización</h3><p>Si la procedencia documental se comprende mejor cuando puede explorarse espacialmente.</p></article>
            <article><h3>Trazabilidad</h3><p>Si cada punto puede conducir de forma inequívoca a una fuente o documento existente.</p></article>
            <article><h3>Rigor</h3><p>Si el mapa puede añadir contexto sin extrapolar una localidad documentada al conjunto de variedades rarámuri.</p></article>
            <article><h3>Costo</h3><p>Si la capa puede mantenerse con software abierto y sin contratar tiles, API keys o almacenamiento cartográfico.</p></article>
          </div>
        </section>

        <div className="science-page-actions">
          <Link className="primary-button" href="/documentacion">Documentación científica</Link>
          <Link className="text-link" href="/">Volver al inicio →</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
