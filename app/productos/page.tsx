import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { productHref, products } from "../../lib/products";

export const metadata: Metadata = {
  title: "Productos | Rarámuri Digital",
  description: "Catálogo técnico de los 30 productos de infraestructura lexicográfica rarámuri-español.",
};

const domains = ["Datos", "Corpus", "Inventarios", "Análisis", "Docencia"] as const;

export default function ProductsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page">
        <nav className="breadcrumbs" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span><strong>Productos</strong></nav>
        <header className="page-header">
          <div><span className="module-id">CATÁLOGO</span><h1>Productos</h1></div>
          <p>Treinta componentes derivados de la misma base maestra. Cada producto tiene ruta, especificación, esquema, entradas, salidas, dependencias y estado.</p>
        </header>

        <section className="metric-grid compact">
          <div><span>Total</span><strong>30</strong></div>
          <div><span>Operativos</span><strong>4</strong></div>
          <div><span>Especificados</span><strong>26</strong></div>
          <div><span>Fuente común</span><strong>P-01</strong></div>
        </section>

        {domains.map((domain) => {
          const group = products.filter((product) => product.domain === domain);
          return (
            <section className="product-group" key={domain}>
              <div className="group-title"><h2>{domain}</h2><span>{group.length} productos</span></div>
              <div className="product-catalog">
                {group.map((product) => (
                  <Link key={product.id} href={productHref(product)}>
                    <div><code>P-{String(product.id).padStart(2, "0")}</code><span className={`status-chip ${product.status === "Operativo" ? "active" : ""}`}>{product.status}</span></div>
                    <h3>{product.title}</h3>
                    <p>{product.objective}</p>
                    <span className="route-label">/productos/{product.slug} →</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
