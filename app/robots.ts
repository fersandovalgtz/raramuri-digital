import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://raramuri.ceees.mx/sitemap.xml",
    host: "https://raramuri.ceees.mx",
  };
}
