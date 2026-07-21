import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><strong>Rarámuri Digital</strong><span>Universidad CEEES · UACJ · CA UACJ-113</span></div>
      <div><span>Versión</span><strong>3.1</strong></div>
      <div><span>Datos</span><strong><Link href="/descargas">5 formatos + API</Link></strong></div>
      <div><span>Contacto</span><strong><a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a></strong></div>
    </footer>
  );
}
