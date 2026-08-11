import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { ScientificBadges } from "../../components/ScientificBadges";

const translations = {
  en: {
    language: "English",
    title: "Rarámuri Digital",
    subtitle: "Open lexical research infrastructure for Rarámuri–Spanish language data",
    description: "Rarámuri Digital organizes, documents and publishes lexical data with explicit provenance, reusable exports and a public API. The interface translation does not alter documentary Rarámuri forms or source transcriptions.",
    data: "Dataset",
    entries: "2,581 lexical entries",
    products: "30 derived research products",
    formats: "CSV, JSON, XML, SQL, TEI Lex-0 and CLDF",
    citation: "Persistent citation through DOI and CITATION.cff",
    principle: "Language policy",
    principleText: "Navigation and explanatory text may be translated. Documentary linguistic data remain faithful to their source and are not machine-translated as if they were equivalent lexical evidence.",
    science: "Scientific infrastructure",
    back: "Spanish site",
  },
  de: {
    language: "Deutsch",
    title: "Rarámuri Digital",
    subtitle: "Offene lexikographische Forschungsinfrastruktur für Rarámuri–Spanisch",
    description: "Rarámuri Digital organisiert, dokumentiert und veröffentlicht lexikalische Daten mit nachvollziehbarer Provenienz, wiederverwendbaren Exportformaten und einer öffentlichen API. Die Übersetzung der Benutzeroberfläche verändert weder dokumentarische Rarámuri-Formen noch Quellentranskriptionen.",
    data: "Datensatz",
    entries: "2.581 lexikographische Einträge",
    products: "30 abgeleitete Forschungsprodukte",
    formats: "CSV, JSON, XML, SQL, TEI Lex-0 und CLDF",
    citation: "Persistente Zitierbarkeit über DOI und CITATION.cff",
    principle: "Sprachpolitisches Prinzip",
    principleText: "Navigation und erläuternde Texte können übersetzt werden. Dokumentarische Sprachdaten bleiben quellentreu und werden nicht maschinell als vermeintlich gleichwertige lexikalische Evidenz übersetzt.",
    science: "Wissenschaftliche Infrastruktur",
    back: "Spanische Website",
  },
  fr: {
    language: "Français",
    title: "Rarámuri Digital",
    subtitle: "Infrastructure de recherche lexicographique ouverte pour les données rarámuri–espagnol",
    description: "Rarámuri Digital organise, documente et publie des données lexicales avec une provenance explicite, des formats réutilisables et une API publique. La traduction de l’interface ne modifie ni les formes documentaires rarámuri ni les transcriptions des sources.",
    data: "Jeu de données",
    entries: "2 581 entrées lexicographiques",
    products: "30 produits de recherche dérivés",
    formats: "CSV, JSON, XML, SQL, TEI Lex-0 et CLDF",
    citation: "Citation persistante par DOI et CITATION.cff",
    principle: "Politique linguistique",
    principleText: "La navigation et les textes explicatifs peuvent être traduits. Les données linguistiques documentaires restent fidèles aux sources et ne sont pas traduites automatiquement comme s’il s’agissait de preuves lexicales équivalentes.",
    science: "Infrastructure scientifique",
    back: "Site en espagnol",
  },
  pt: {
    language: "Português",
    title: "Rarámuri Digital",
    subtitle: "Infraestrutura aberta de pesquisa lexicográfica para dados rarámuri–espanhol",
    description: "Rarámuri Digital organiza, documenta e publica dados lexicais com proveniência explícita, formatos reutilizáveis e uma API pública. A tradução da interface não altera formas documentais em rarámuri nem transcrições das fontes.",
    data: "Conjunto de dados",
    entries: "2.581 entradas lexicográficas",
    products: "30 produtos derivados de pesquisa",
    formats: "CSV, JSON, XML, SQL, TEI Lex-0 e CLDF",
    citation: "Citação persistente por DOI e CITATION.cff",
    principle: "Política linguística",
    principleText: "A navegação e os textos explicativos podem ser traduzidos. Os dados linguísticos documentais permanecem fiéis às fontes e não são traduzidos automaticamente como se fossem evidência lexical equivalente.",
    science: "Infraestrutura científica",
    back: "Site em espanhol",
  },
} as const;

type Language = keyof typeof translations;

export function generateStaticParams() {
  return Object.keys(translations).map((lang) => ({ lang }));
}

export default async function InternationalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in translations)) notFound();
  const t = translations[lang as Language];

  return (
    <div className="site-shell">
      <div className="top-rule" />
      <header className="international-header">
        <Link className="site-brand" href="/"><span><strong>Rarámuri <em>Digital</em></strong><small>{t.language}</small></span></Link>
        <nav aria-label="Languages"><Link href="/">ES</Link><Link href="/international/en">EN</Link><Link href="/international/de">DE</Link><Link href="/international/fr">FR</Link><Link href="/international/pt">PT</Link></nav>
      </header>
      <main id="main" className="page-container inner-page">
        <section className="science-page-hero international-hero">
          <span className="module-id">INTERNATIONAL RD</span>
          <h1>{t.title}</h1>
          <h2>{t.subtitle}</h2>
          <p>{t.description}</p>
        </section>

        <section className="content-section">
          <h2>{t.data}</h2>
          <div className="international-facts">
            <article><strong>2,581</strong><span>{t.entries}</span></article>
            <article><strong>30</strong><span>{t.products}</span></article>
            <article><strong>6+</strong><span>{t.formats}</span></article>
            <article><strong>DOI</strong><span>{t.citation}</span></article>
          </div>
        </section>

        <section className="content-section">
          <h2>{t.principle}</h2>
          <div className="language-policy"><p>{t.principleText}</p></div>
        </section>

        <section className="content-section">
          <h2>{t.science}</h2>
          <ScientificBadges />
        </section>

        <div className="science-page-actions"><Link className="primary-button" href="/">{t.back}</Link><Link className="text-link" href="/estadisticas">Observatorio / Statistics →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
