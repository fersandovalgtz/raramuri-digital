import type { Metadata } from "next";
import "./globals.css";
import "./scientific.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raramuri.ceees.mx"),
  title: "Rarámuri Digital | Infraestructura científica de datos lingüísticos",
  description:
    "Infraestructura abierta para datos lexicográficos rarámuri-español, corpus, interoperabilidad, API, documentación científica y trazabilidad documental.",
  keywords: ["Rarámuri", "Tarahumara", "lexicografía", "humanidades digitales", "lenguas indígenas", "CLDF", "TEI Lex-0", "datos FAIR"],
  alternates: {
    canonical: "https://raramuri.ceees.mx",
    languages: {
      "es-MX": "/",
      "en": "/international/en",
      "de": "/international/de",
      "fr": "/international/fr",
      "pt": "/international/pt",
    },
  },
  icons: {
    icon: "/uceees-logo.png",
    shortcut: "/uceees-logo.png",
  },
  openGraph: {
    title: "Rarámuri Digital",
    description: "Infraestructura científica abierta para datos lexicográficos rarámuri-español.",
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "Rarámuri Digital, infraestructura lexicográfica rarámuri-español" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rarámuri Digital",
    description: "Infraestructura científica abierta para datos lexicográficos rarámuri-español.",
    images: ["/og.png"],
  },
};

const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Rarámuri Digital: conjunto de datos lexicográficos rarámuri-español",
  description: "Infraestructura lexicográfica rarámuri-español con 2,581 entradas, productos derivados, formatos interoperables y API pública.",
  url: "https://raramuri.ceees.mx",
  identifier: "https://doi.org/10.5281/zenodo.21483353",
  license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  creator: {
    "@type": "Person",
    name: "Fernando Sandoval Gutierrez",
    identifier: "https://orcid.org/0000-0002-3168-6725",
  },
  distribution: [
    { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lexico.csv" },
    { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lexico.json" },
    { "@type": "DataDownload", encodingFormat: "application/xml", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lex0.xml" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      </body>
    </html>
  );
}
