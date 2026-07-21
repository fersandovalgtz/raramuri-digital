import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorpusExplorer } from "../../components/CorpusExplorer";
import { LexiconExplorer } from "../../components/LexiconExplorer";
import { ParallelCorpusExplorer } from "../../components/ParallelCorpusExplorer";
import { TerminologyExplorer } from "../../components/TerminologyExplorer";
import { VariantsExplorer } from "../../components/VariantsExplorer";
import { GlottalStopExplorer } from "../../components/GlottalStopExplorer";
import { AccentedWordsExplorer } from "../../components/AccentedWordsExplorer";
import { InventoryExplorer } from "../../components/InventoryExplorer";
import { AdvancedProductExplorer } from "../../components/AdvancedProductExplorer";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getProduct, productHref, products } from "../../../lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `P-${String(product.id).padStart(2, "0")} ${product.title} | Rarámuri Digital`,
    description: product.objective,
  };
}

function methodFor(domain: string) {
  if (domain === "Inventarios") return "Consulta parametrizada sobre la base maestra, normalización de etiquetas, revisión de excepciones y materialización del subconjunto.";
  if (domain === "Corpus") return "Segmentación de texto, normalización conservadora, indexación, vinculación con entry_id y preservación de página fuente.";
  if (domain === "Análisis") return "Derivación reproducible desde registros canónicos, generación de relaciones o métricas y conservación de evidencia documental.";
  if (domain === "Docencia") return "Selección por reglas explícitas, clasificación editorial, revisión académica y exportación de conjuntos controlados.";
  return "Transformación ETL versionada, validación de campos, persistencia relacional y exposición mediante consulta y exportación.";
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const index = products.findIndex((item) => item.id === product.id);
  const previous = products[index - 1];
  const next = products[index + 1];
  const dependencies = product.dependencies.map((id) => products.find((item) => item.id === id)).filter(Boolean);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page product-page">
        <nav className="breadcrumbs" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span><Link href="/productos">Productos</Link><span>/</span><strong>P-{String(product.id).padStart(2, "0")}</strong></nav>

        <header className="product-header">
          <div><span className="module-id">P-{String(product.id).padStart(2, "0")} · {product.domain}</span><h1>{product.title}</h1></div>
          <dl>
            <div><dt>Estado</dt><dd><i className={`status-dot ${product.status === "Operativo" ? "active" : "pending"}`} /> {product.status}</dd></div>
            <div><dt>Unidad</dt><dd>{product.recordUnit}</dd></div>
            <div><dt>Versión</dt><dd>1.0</dd></div>
          </dl>
        </header>

        <section className="spec-section">
          <h2>Objetivo</h2>
          <p className="spec-lead">{product.objective}</p>
        </section>

        <section className="spec-section">
          <h2>Entradas y salidas</h2>
          <div className="io-grid">
            <article><h3>Entradas</h3><ul>{product.inputs.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><h3>Salidas</h3><ul>{product.outputs.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>

        <section className="spec-section">
          <h2>Esquema</h2>
          <div className="schema-list">
            {product.fields.map((field, fieldIndex) => <div key={field}><span>{String(fieldIndex + 1).padStart(2, "0")}</span><code>{field}</code><em>{field.includes("[]") ? "ARRAY" : field.includes("count") || field.includes("score") ? "NUMBER" : "STRING"}</em></div>)}
          </div>
        </section>

        <section className="spec-section">
          <h2>Método</h2>
          <p className="spec-lead">{methodFor(product.domain)}</p>
          <ol className="process-list"><li><span>01</span><div><strong>Selección</strong><p>Identificación de registros y evidencias aplicables.</p></div></li><li><span>02</span><div><strong>Transformación</strong><p>Normalización sin sustitución de la grafía fuente.</p></div></li><li><span>03</span><div><strong>Validación</strong><p>Control de estructura, procedencia y excepciones.</p></div></li><li><span>04</span><div><strong>Publicación</strong><p>Vista web, consulta y exportación versionada.</p></div></li></ol>
        </section>

        <section className="spec-section">
          <h2>Dependencias</h2>
          {dependencies.length ? <div className="dependency-list">{dependencies.map((dependency) => dependency && <Link key={dependency.id} href={productHref(dependency)}><code>P-{String(dependency.id).padStart(2, "0")}</code><span>{dependency.title}</span></Link>)}</div> : <p className="spec-lead">Sin dependencia de otro producto. Opera sobre fuentes documentales o sobre el conjunto del sistema.</p>}
        </section>

        <section className="spec-section">
          <h2>Trazabilidad</h2>
          <div className="trace-grid"><div><span>Identificador</span><strong>P-{String(product.id).padStart(2, "0")}</strong></div><div><span>Fuente mínima</span><strong>{product.id === 4 ? "term_id + SRC-01 + página" : product.id === 5 ? "variant_id + entry_ids + página" : product.id === 6 ? "saltillo_id + entry_id + campo + página" : product.id === 7 ? "accent_id + entry_id + campo + página" : product.id >= 8 && product.id <= 20 ? "inventory_id + entry_id + evidencia + página" : product.id >= 21 ? "advanced_id + entity_id + SRC + página" : "entry_id + source_code + page"}</strong></div><div><span>Estado de datos</span><strong>{product.id === 1 ? "Transcrito" : product.id === 2 ? "Derivado de P-01" : product.id === 3 ? "Derivado de P-01 y P-02" : product.id === 4 ? "OCR estructurado de SRC-01" : product.id === 5 ? "Derivado completo de P-01" : product.id === 6 ? "835 ocurrencias derivadas de P-01" : product.id === 7 ? "3,433 ocurrencias derivadas de P-01 y P-03" : product.id >= 8 && product.id <= 20 ? "Materializado desde P-01" : product.id >= 21 ? "Materializado y auditable" : "No materializado"}</strong></div><div><span>Validación lingüística</span><strong>Pendiente</strong></div></div>
        </section>

        {product.id === 1 ? <LexiconExplorer /> : product.id === 2 ? <CorpusExplorer /> : product.id === 3 ? <ParallelCorpusExplorer /> : product.id === 4 ? <TerminologyExplorer /> : product.id === 5 ? <VariantsExplorer /> : product.id === 6 ? <GlottalStopExplorer /> : product.id === 7 ? <AccentedWordsExplorer /> : product.id >= 8 && product.id <= 20 ? <InventoryExplorer productId={product.id} /> : product.id >= 21 && product.id <= 30 ? <AdvancedProductExplorer productId={product.id} /> : (
          <section className="spec-section implementation-state">
            <h2>Implementación</h2>
            <div><span className="status-chip">ESPECIFICADO</span><p>La ruta, el esquema y el procedimiento están definidos. La materialización de datos se ejecutará a partir de P-01.</p></div>
          </section>
        )}

        <nav className="product-navigation" aria-label="Navegación entre productos">
          {previous ? <Link href={productHref(previous)}><span>Anterior</span><strong>P-{String(previous.id).padStart(2, "0")} · {previous.title}</strong></Link> : <span />}
          {next ? <Link href={productHref(next)}><span>Siguiente</span><strong>P-{String(next.id).padStart(2, "0")} · {next.title}</strong></Link> : <Link href="/productos"><span>Catálogo</span><strong>Todos los productos</strong></Link>}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
