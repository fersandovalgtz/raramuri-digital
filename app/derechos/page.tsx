import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import metadata from "../../project-metadata.json";

export default function RightsPage() {
  const rights = metadata.source_rights;
  const primary = metadata.primary_reference;
  const production = metadata.production_source;

  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="page-container inner-page">
        <header className="page-heading">
          <div>
            <span className="module-id">DERECHOS RD-RIGHTS-01</span>
            <h1>Derechos y procedencia de Samachique</h1>
          </div>
          <p>Regla pública aplicable a la reutilización del contenido procedente del Diccionario tarahumara de Samachique dentro de Rarámuri Digital.</p>
        </header>

        <section className="content-section">
          <h2>Condición de uso</h2>
          <div className="definition-grid">
            <article>
              <h3>Perfil de derechos</h3>
              <p><strong>{rights.rights_profile}</strong></p>
              <p>Uso académico y no lucrativo únicamente.</p>
            </article>
            <article>
              <h3>Uso comercial</h3>
              <p><strong>No autorizado.</strong> Cualquier monetización, licenciamiento comercial u otro uso lucrativo requiere una autorización adicional y específica del Instituto Lingüístico de Verano, A. C.</p>
            </article>
            <article>
              <h3>Atribución</h3>
              <p>La atribución es obligatoria y debe conservar los créditos de la fuente y de la autorización.</p>
            </article>
            <article>
              <h3>Autorización</h3>
              <p>{rights.permission_grantor}. Comunicación de {rights.permission_signatory}, fechada el {rights.permission_document_date} y recibida el {rights.permission_received_date}.</p>
            </article>
          </div>
        </section>

        <section className="content-section">
          <h2>Fuente y cadena de procedencia</h2>
          <div className="source-grid">
            <article>
              <header><code>{primary.source_code}</code><span>Fuente documental</span></header>
              <h3>{primary.title}</h3>
              <dl>
                <div><dt>Autor</dt><dd>{primary.creator}</dd></div>
                <div><dt>Edición</dt><dd>{primary.edition}, {primary.year}</dd></div>
                <div><dt>Editor</dt><dd>{primary.publisher}</dd></div>
                <div><dt>Archivo</dt><dd>{primary.archive_id}</dd></div>
                <div><dt>Función</dt><dd>{primary.role}</dd></div>
              </dl>
              <a className="text-link" href={primary.archive} target="_blank" rel="noreferrer">Consultar registro del archivo SIL →</a>
            </article>
            <article>
              <header><code>{production.source_code}</code><span>Representación de trabajo</span></header>
              <h3>{production.document}</h3>
              <dl>
                <div><dt>Relación</dt><dd>Derivada de {primary.source_code}; no es una fuente lexicográfica independiente.</dd></div>
                <div><dt>Cobertura</dt><dd>{production.coverage}</dd></div>
                <div><dt>Función</dt><dd>{production.role}</dd></div>
                <div><dt>Identidad</dt><dd>Verificada el {production.identity_verified_on}</dd></div>
              </dl>
            </article>
          </div>
        </section>

        <section className="content-section">
          <h2>Usos autorizados</h2>
          <div className="definition-grid">
            {rights.authorized_uses.map((use) => (
              <article key={use}><h3>{use}</h3><p>Autorizado exclusivamente dentro del marco académico y no lucrativo indicado por el ILV.</p></article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Atribución canónica</h2>
          <p>{rights.canonical_attribution}</p>
          <p>{rights.rights_notice}</p>
          <p className="manifest-link"><a className="text-link" href="/downloads/SAMACHIQUE_RIGHTS.txt" download>Descargar aviso de derechos en texto plano →</a></p>
          <p className="manifest-link"><a className="text-link" href="https://github.com/fersandovalgtz/raramuri-digital/blob/main/docs/SAMACHIQUE_RIGHTS.md" target="_blank" rel="noreferrer">Consultar documentación canónica en el repositorio →</a></p>
        </section>

        <nav className="product-navigation" aria-label="Navegación de derechos">
          <Link href="/descargas"><span>Datos</span><strong>Descargas y API</strong></Link>
          <Link href="/documentacion"><span>Documentación</span><strong>Documentación científica</strong></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
