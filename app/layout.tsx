import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rarámuri Digital | Universidad CEEES",
  description:
    "Archivo lexicográfico rarámuri-español para consulta, investigación y enseñanza, con procedencia documental verificable.",
  icons: {
    icon: "/uceees-logo.png",
    shortcut: "/uceees-logo.png",
  },
  openGraph: {
    title: "Rarámuri Digital",
    description: "Un archivo vivo del léxico rarámuri, impulsado por la Universidad CEEES.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
