import Link from "next/link";
import metadata from "../../project-metadata.json";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><strong>Rarámuri Digital</strong><span>Universidad CEEES · UACJ · CA UACJ-113</span></div>
      <div><span>Versiones</span><strong>Plataforma {metadata.platform_version} · Datos {metadata.dataset_version}</strong></div>
      <div><span>Datos</span><strong><Link href="/descargas">5 formatos + API</Link></strong></div>
      <div><span>Contacto</span><strong><a href="mailto:fernando.sandoval@uacj.mx">fernando.sandoval@uacj.mx</a></strong></div>
    </footer>
  );
}
