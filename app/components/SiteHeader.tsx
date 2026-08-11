import Link from "next/link";
import metadata from "../../project-metadata.json";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <div className="top-rule" />
      <header className="site-header">
        <Link className="site-brand" href="/" aria-label="Rarámuri Digital, inicio">
          <span><strong>Rarámuri <em>Digital</em></strong><small>Infraestructura lexicográfica</small></span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/descargas">Datos/API</Link>
          <Link href="/estadisticas">Estadísticas</Link>
          <Link href="/documentacion">Documentación</Link>
          <Link href="/#fuentes">Fuentes</Link>
          <span className="language-links" aria-label="Idiomas">
            <Link href="/">ES</Link>
            <Link href="/international/en">EN</Link>
            <Link href="/international/de">DE</Link>
            <Link href="/international/fr">FR</Link>
            <Link href="/international/pt">PT</Link>
          </span>
        </nav>
        <span className="system-version">v{metadata.platform_version}</span>
      </header>
    </>
  );
}
