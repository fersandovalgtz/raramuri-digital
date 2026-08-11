const badges = [
  { label: "DOI", value: "10.5281/zenodo.21483353", href: "https://doi.org/10.5281/zenodo.21483353" },
  { label: "Zenodo", value: "archived dataset", href: "https://zenodo.org/doi/10.5281/zenodo.21483353" },
  { label: "GitHub", value: "source repository", href: "https://github.com/fersandovalgtz/raramuri-digital" },
  { label: "CITATION.cff", value: "citation metadata", href: "https://github.com/fersandovalgtz/raramuri-digital/blob/main/CITATION.cff" },
  { label: "CodeMeta", value: "software metadata", href: "https://github.com/fersandovalgtz/raramuri-digital/blob/main/codemeta.json" },
  { label: "FAIR", value: "assessment available", href: "https://github.com/fersandovalgtz/raramuri-digital/blob/main/FAIR_ASSESSMENT.md" },
  { label: "CLDF", value: "interoperable export", href: "/downloads/cldf/cldf-metadata.json" },
  { label: "TEI Lex-0", value: "lexical XML", href: "/downloads/raramuri-lex0.xml" },
  { label: "OpenAPI", value: "public API schema", href: "/downloads/openapi-lexico.json" },
  { label: "CC BY-NC-SA 4.0", value: "project data", href: "https://creativecommons.org/licenses/by-nc-sa/4.0/" },
];

export function ScientificBadges() {
  return (
    <div className="scientific-badge-grid" aria-label="Infraestructura científica verificable">
      {badges.map((badge) => (
        <a key={badge.label} className="scientific-badge" href={badge.href} target={badge.href.startsWith("http") ? "_blank" : undefined} rel={badge.href.startsWith("http") ? "noreferrer" : undefined}>
          <span>{badge.label}</span>
          <strong>{badge.value}</strong>
        </a>
      ))}
    </div>
  );
}
