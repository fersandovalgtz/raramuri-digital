import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raramuri-digital-ceees.fersandovalgtz.chatgpt.site"),
  title: "Rarámuri Digital | Infraestructura lexicográfica CEEES",
  description:
    "Plataforma de datos lexicográficos rarámuri-español: corpus, entradas, variantes, ejemplos alineados y trazabilidad documental.",
  icons: {
    icon: "/uceees-logo.png",
    shortcut: "/uceees-logo.png",
  },
  openGraph: {
    title: "Rarámuri Digital",
    description: "Infraestructura lexicográfica rarámuri-español de la Universidad CEEES.",
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "Rarámuri Digital, infraestructura lexicográfica rarámuri-español" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rarámuri Digital",
    description: "Infraestructura lexicográfica rarámuri-español de la Universidad CEEES.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
