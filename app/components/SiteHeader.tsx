import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <div className="top-rule" />
      <header className="site-header">
        <Link className="site-brand" href="/" aria-label="Rarámuri Digital, inicio">
          <span className="brand-logo"><Image src="/uceees-logo.png" width={48} height={48} alt="" priority /></span>
          <span><strong>Rarámuri <em>Digital</em></strong><small>Infraestructura lexicográfica</small></span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/#arquitectura">Arquitectura</Link>
          <Link href="/#fuentes">Fuentes</Link>
          <Link href="/#proyecto">Proyecto</Link>
          <Link href="/#licencia">Licencia</Link>
        </nav>
        <span className="system-version">v0.7</span>
      </header>
    </>
  );
}
