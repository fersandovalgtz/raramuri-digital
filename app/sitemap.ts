import type { MetadataRoute } from "next";

const baseUrl = "https://raramuri.ceees.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/documentacion`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/derechos`, lastModified: now, changeFrequency: "yearly", priority: 0.95 },
    { url: `${baseUrl}/publicaciones/steffel-1791-1809`, lastModified: now, changeFrequency: "yearly", priority: 0.95 },
    { url: `${baseUrl}/publicaciones`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/descargas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/estadisticas`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/atlas`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    { url: `${baseUrl}/productos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/international/en`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/international/de`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/international/fr`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/international/pt`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
