import type { Metadata } from "next";
import "./globals.css";
import "./scientific.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raramuri.ceees.mx"),
  title: "Rarámuri Digital | Infraestructura científica de datos lingüísticos",
  description:
    "Infraestructura científica para datos lexicográficos rarámuri-español con procedencia documental, fuente Hilton, corpus, interoperabilidad, API, DOI y preservación reproducible.",
  keywords: [
    "Rarámuri",
    "Tarahumara",
    "Central Tarahumara",
    "Samachique",
    "Kenneth Simon Hilton",
    "lexicografía",
    "humanidades digitales",
    "lenguas indígenas",
    "documentación lingüística",
    "CLDF",
    "TEI Lex-0",
    "datos FAIR",
    "procedencia de datos",
    "ciencia abierta",
  ],
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
    description: "Infraestructura científica para datos lexicográficos rarámuri-español con fuente documentada, procedencia, DOI e interoperabilidad.",
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "Rarámuri Digital, infraestructura lexicográfica rarámuri-español" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rarámuri Digital",
    description: "Infraestructura científica para datos lexicográficos rarámuri-español con fuente documentada, procedencia, DOI e interoperabilidad.",
    images: ["/og.png"],
  },
};

const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": "https://doi.org/10.5281/zenodo.21483353",
  name: "Rarámuri Digital: conjunto de datos lexicográficos rarámuri-español",
  alternateName: "Rarámuri Digital",
  description:
    "Infraestructura lexicográfica rarámuri-español con 2,581 entradas, procedencia documental explícita, productos derivados, formatos interoperables, API pública y preservación científica.",
  url: "https://raramuri.ceees.mx",
  identifier: [
    "https://doi.org/10.5281/zenodo.21483353",
    "https://github.com/fersandovalgtz/raramuri-digital",
  ],
  version: "1.0.0",
  datePublished: "2026-07-21",
  inLanguage: ["tar", "es"],
  keywords: [
    "Rarámuri",
    "Tarahumara",
    "Central Tarahumara",
    "Samachique",
    "lexicography",
    "digital humanities",
    "language documentation",
    "Indigenous languages",
    "data provenance",
    "open science",
    "TEI Lex-0",
    "CLDF",
  ],
  license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  creator: {
    "@type": "Person",
    name: "Fernando Sandoval Gutierrez",
    identifier: "https://orcid.org/0000-0002-3168-6725",
    sameAs: [
      "https://orcid.org/0000-0002-3168-6725",
      "https://github.com/fersandovalgtz",
      "https://scholar.google.com/citations?user=zNZsYYAAAAAJ&hl=es",
      "https://cathi.uacj.mx/handle/20.500.11961/3028/browse?authority=0000-0002-3168-6725&type=author",
      "https://www.researchgate.net/profile/Fernando-Sandoval-Gutierrez",
      "https://researchid.co/fersandovalg",
      "https://uacj.academia.edu/FernandoSandoval",
    ],
    affiliation: [
      { "@type": "Organization", name: "Universidad Autónoma de Ciudad Juárez", url: "https://www.uacj.mx/" },
      { "@type": "Organization", name: "Universidad CEEES", url: "https://ceees.mx/" },
    ],
  },
  isBasedOn: {
    "@type": "CreativeWork",
    name: "Diccionario tarahumara de Samachique, Chihuahua, México",
    author: { "@type": "Person", name: "Kenneth S. Hilton" },
    datePublished: "1993",
    publisher: { "@type": "Organization", name: "Instituto Lingüístico de Verano" },
    url: "https://mexico.sil.org/es/resources/archives/10966",
    isbn: "9789683102713",
  },
  citation: [
    {
      "@type": "CreativeWork",
      name: "Diccionario tarahumara de Samachique, Chihuahua, México",
      author: { "@type": "Person", name: "K. Simón Hilton" },
      datePublished: "1993",
      url: "https://mexico.sil.org/es/resources/archives/10966",
    },
    {
      "@type": "CreativeWork",
      name: "Rarámuri Digital: conjunto de datos lexicográficos rarámuri-español, versión 1.0.0",
      author: { "@type": "Person", name: "Fernando Sandoval Gutierrez" },
      identifier: "https://doi.org/10.5281/zenodo.21483353",
    },
  ],
  sameAs: [
    "https://zenodo.org/records/21483353",
    "https://github.com/fersandovalgtz/raramuri-digital",
    "https://archive.softwareheritage.org/swh:1:snp:0982c208ac90273fdb553b181b8c75c66991e09d",
  ],
  subjectOf: [
    {
      "@type": "CreativeWork",
      name: "Rarámuri Digital — documentación científica",
      url: "https://raramuri.ceees.mx/documentacion",
    },
    {
      "@type": "CreativeWork",
      name: "Rarámuri Digital — especificación OpenAPI 3.1",
      url: "https://raramuri.ceees.mx/api/openapi",
    },
  ],
  distribution: [
    { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lexico.csv" },
    { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lexico.json" },
    { "@type": "DataDownload", encodingFormat: "application/xml", contentUrl: "https://raramuri.ceees.mx/downloads/raramuri-lex0.xml" },
    { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://raramuri.ceees.mx/downloads/cldf/cldf-metadata.json" },
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