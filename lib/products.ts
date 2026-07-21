export type ProductStatus = "Operativo" | "Especificado";

export type Product = {
  id: number;
  slug: string;
  title: string;
  domain: "Datos" | "Corpus" | "Inventarios" | "Análisis" | "Docencia";
  status: ProductStatus;
  objective: string;
  recordUnit: string;
  inputs: string[];
  outputs: string[];
  fields: string[];
  dependencies: number[];
};

const p = (
  id: number,
  slug: string,
  title: string,
  domain: Product["domain"],
  objective: string,
  recordUnit: string,
  inputs: string[],
  outputs: string[],
  fields: string[],
  dependencies: number[] = [1],
): Product => ({ id, slug, title, domain, objective, recordUnit, inputs, outputs, fields, dependencies, status: id <= 6 ? "Operativo" : "Especificado" });

export const products: Product[] = [
  p(1, "base-lexicografica-maestra", "Base lexicográfica maestra", "Datos", "Concentrar una fila canónica por entrada del diccionario con trazabilidad documental.", "Entrada lexicográfica", ["SRC-02: transcripción estructurada", "SRC-01: facsímil de cotejo"], ["Consulta web", "CSV completo o filtrado", "API JSON"], ["record_id", "headword", "classification", "translation", "senses[]", "examples[]", "variants[]", "source_page"], []),
  p(2, "corpus-digital-raramuri-espanol", "Corpus digital rarámuri-español", "Corpus", "Integrar todas las entradas y segmentos textuales en un corpus consultable.", "Documento por entrada", ["Entradas maestras", "Ejemplos", "Comentarios"], ["Consulta web", "API JSON", "Exportación TSV", "Exportación JSONL"], ["document_id", "entry_id", "headword_rrm", "classification", "translation_es", "context_rrm_es", "token_count", "source_page"]),
  p(3, "corpus-paralelo-ejemplos", "Corpus paralelo de ejemplos", "Corpus", "Alinear cada oración rarámuri con su traducción española.", "Par de oraciones", ["Ejemplos y comentarios", "Segmentación oracional"], ["Pares RRM↔SPA", "Archivo paralelo", "Métricas de alineación"], ["pair_id", "rrm_text", "spa_text", "entry_id", "alignment_status", "source_page"], [1, 2]),
  p(4, "base-terminologica-espanol-raramuri", "Base terminológica español-rarámuri", "Datos", "Estructurar la segunda sección del diccionario como una base consultable de términos españoles y equivalentes rarámuri.", "Registro terminológico", ["SRC-01: sección ESPAÑOL - TARAHUMARA", "Páginas impresas 81–130", "OCR del facsímil"], ["Consulta web", "CSV completo o filtrado", "API JSON", "JSONL"], ["term_id", "term_es", "term_es_normalized", "grammatical_label", "equivalents_rrm", "source_section", "pdf_page", "printed_page", "validation_status"], []),
  p(5, "base-variantes-graficas", "Base de variantes gráficas", "Datos", "Registrar relaciones documentadas y candidatos de alternancia r/l, g/c, i/e, ba/hua y presencia o ausencia de consonante inicial.", "Relación entre formas", ["P-01: 2,581 lemas", "221 entradas con anotaciones de variante", "Lemas múltiples y remisiones"], ["Consulta web", "CSV completo o filtrado", "API JSON", "JSONL"], ["variant_id", "form_a", "form_b", "pattern", "relation_type", "derivation_method", "entry_ids[]", "evidence", "source_page", "validation_status"]),
  p(6, "palabras-con-saltillo", "Repositorio de palabras con saltillo", "Corpus", "Indexar todas las formas documentadas con saltillo para alfabetización, análisis ortográfico y análisis fonológico.", "Ocurrencia con saltillo", ["P-01: 2,581 entradas", "Lemas", "Variantes", "Ejemplos documentales"], ["Consulta por forma y contexto", "CSV completo o filtrado", "API JSON", "JSONL"], ["saltillo_id", "form", "normalized_form", "saltillo_glyphs[]", "position", "saltillo_indexes[]", "source_field", "entry_id", "context", "document_frequency", "source_page", "validation_status"]),
  p(7, "palabras-acentuadas", "Repositorio de palabras acentuadas", "Corpus", "Indexar formas con acento gráfico y conservar su contexto.", "Forma acentuada", ["Lemas", "Ejemplos", "Variantes"], ["Listado de formas", "Distribución de acentos", "Contextos"], ["form", "accented_vowel", "syllable_position", "entry_id", "context"]),
  p(8, "inventario-sustantivos", "Inventario de sustantivos", "Inventarios", "Extraer entradas clasificadas como sustantivo.", "Entrada nominal", ["classification_family = S"], ["Inventario S", "Conteos", "CSV"], ["entry_id", "headword", "classification", "translation", "source_page"]),
  p(9, "inventario-verbos-transitivos", "Inventario de verbos transitivos", "Inventarios", "Extraer entradas clasificadas como verbo transitivo.", "Entrada verbal transitiva", ["classification_family = Vt"], ["Inventario Vt", "Formas verbales", "CSV"], ["entry_id", "headword", "translation", "documented_forms[]", "source_page"]),
  p(10, "inventario-verbos-intransitivos", "Inventario de verbos intransitivos", "Inventarios", "Extraer entradas clasificadas como verbo intransitivo.", "Entrada verbal intransitiva", ["classification_family = Vi"], ["Inventario Vi", "Formas verbales", "CSV"], ["entry_id", "headword", "translation", "documented_forms[]", "source_page"]),
  p(11, "inventario-adjetivos", "Inventario de adjetivos", "Inventarios", "Extraer entradas clasificadas como adjetivo.", "Entrada adjetival", ["classification_family = Adj"], ["Inventario Adj", "Conteos", "CSV"], ["entry_id", "headword", "classification", "translation", "source_page"]),
  p(12, "inventario-adverbios", "Inventario de adverbios", "Inventarios", "Extraer entradas clasificadas como adverbio.", "Entrada adverbial", ["classification_family = Adv"], ["Inventario Adv", "Conteos", "CSV"], ["entry_id", "headword", "classification", "translation", "source_page"]),
  p(13, "inventario-pronombres", "Inventario de pronombres", "Inventarios", "Extraer entradas clasificadas como pronombre.", "Entrada pronominal", ["classification_family = Pron"], ["Inventario Pron", "Conteos", "CSV"], ["entry_id", "headword", "classification", "translation", "source_page"]),
  p(14, "inventario-interjecciones", "Inventario de interjecciones", "Inventarios", "Extraer entradas clasificadas como interjección.", "Entrada interjectiva", ["classification_family = Interj"], ["Inventario Interj", "Contextos", "CSV"], ["entry_id", "headword", "translation", "examples[]", "source_page"]),
  p(15, "terminos-regionales", "Inventario de términos regionales", "Inventarios", "Concentrar marcas regionales documentadas en clasificación o comentarios.", "Entrada regional", ["Marcas regionales", "Comentarios"], ["Inventario regional", "Distribución de marcas", "CSV"], ["entry_id", "headword", "regional_label", "evidence", "source_page"]),
  p(16, "formas-singulares-plurales", "Inventario de singulares y plurales", "Inventarios", "Extraer pares singular-plural explícitamente documentados.", "Par de número", ["Formas entre corchetes", "Comentarios"], ["Pares SG↔PL", "Cobertura por clase", "CSV"], ["form_id", "singular", "plural", "entry_id", "evidence", "source_page"]),
  p(17, "formas-pasado-futuro", "Inventario de formas de pasado y futuro", "Inventarios", "Extraer formas verbales etiquetadas como pasado o futuro.", "Forma flexiva temporal", ["Etiquetas pret.", "Etiquetas fut."], ["Inventario temporal", "Pares por lema", "CSV"], ["form_id", "entry_id", "tense", "form", "evidence", "source_page"]),
  p(18, "imperativos", "Inventario de imperativos", "Inventarios", "Extraer imperativos documentados en las entradas.", "Forma imperativa", ["Etiquetas imper.", "Ejemplos exclamativos"], ["Inventario imperativo", "Contextos", "CSV"], ["form_id", "entry_id", "form", "number", "evidence", "source_page"]),
  p(19, "gerundios-participios", "Inventario de gerundios y participios", "Inventarios", "Extraer gerundios y participios etiquetados en la fuente.", "Forma no finita", ["Etiquetas ger.", "Etiquetas pp."], ["Inventario no finito", "Cobertura por lema", "CSV"], ["form_id", "entry_id", "form_type", "form", "evidence", "source_page"]),
  p(20, "homonimos-polisemia", "Base de homónimos y polisemia", "Análisis", "Separar homonimia numerada y polisemia interna por acepciones.", "Relación semántica", ["Números de homónimo", "Acepciones"], ["Grupos homónimos", "Entradas polisémicas", "CSV"], ["group_id", "headword_normalized", "relation_type", "entry_ids[]", "sense_count"]),
  p(21, "remisiones-internas", "Base de remisiones internas", "Análisis", "Resolver instrucciones de tipo véase como enlaces entre entradas.", "Arista de remisión", ["Comentarios", "Variantes", "Patrón véase"], ["Grafo de remisiones", "Remisiones no resueltas", "CSV"], ["link_id", "source_entry_id", "target_form", "target_entry_id", "resolution_status"]),
  p(22, "tesauro-tematico", "Tesauro temático", "Análisis", "Asignar conceptos y campos semánticos controlados a las entradas.", "Asignación temática", ["Traducciones", "Acepciones", "Ejemplos"], ["Tesauro jerárquico", "Navegación por tema", "SKOS/CSV"], ["concept_id", "preferred_label", "broader_id", "entry_ids[]", "assignment_status"]),
  p(23, "ontologia-lexica", "Ontología léxica inicial", "Análisis", "Modelar relaciones entre palabras, sentidos, categorías y conceptos.", "Entidad o relación léxica", ["Entradas", "Acepciones", "Tesauro", "Remisiones"], ["Modelo de entidades", "Grafo RDF", "Documentación de relaciones"], ["entity_id", "entity_type", "predicate", "target_id", "provenance"], [1, 20, 21, 22]),
  p(24, "frecuencia-documental", "Índice de frecuencia documental", "Análisis", "Calcular frecuencia por número de ejemplos, formas y apariciones documentales.", "Métrica por entrada", ["Ejemplos", "Formas", "Corpus"], ["Ranking documental", "Distribución de frecuencias", "CSV"], ["entry_id", "example_count", "form_count", "mention_count", "frequency_score"], [1, 2, 3]),
  p(25, "indice-alfabetico-normalizado", "Índice alfabético normalizado", "Corpus", "Ordenar entradas mediante una clave que preserve consulta de acentos y saltillos.", "Clave de ordenación", ["headword", "headword_normalized"], ["Índice A–Y", "Navegación alfabética", "CSV"], ["entry_id", "display_form", "sort_key", "initial", "homonym_number"]),
  p(26, "palabras-ilustrables", "Catálogo de palabras ilustrables", "Docencia", "Clasificar conceptos con referente visual concreto.", "Entrada candidata", ["Traducciones", "Campos semánticos"], ["Catálogo ilustrable", "Nivel de concreción", "Lista editorial"], ["entry_id", "concept", "concreteness", "visual_category", "review_status"], [1, 22]),
  p(27, "palabras-abstractas", "Catálogo de palabras abstractas", "Docencia", "Clasificar conceptos de baja representabilidad visual.", "Entrada abstracta", ["Traducciones", "Campos semánticos"], ["Catálogo abstracto", "Nivel de abstracción", "Lista editorial"], ["entry_id", "concept", "abstractness", "semantic_category", "review_status"], [1, 22]),
  p(28, "ejemplos-ensenanza-inicial", "Ejemplos para enseñanza inicial", "Docencia", "Seleccionar ejemplos breves con estructura y vocabulario controlables.", "Ejemplo didáctico", ["Corpus paralelo", "Métricas de longitud"], ["Banco inicial", "Niveles de complejidad", "CSV"], ["pair_id", "rrm_text", "spa_text", "token_count", "level", "review_status"], [1, 3]),
  p(29, "ejemplos-analisis-linguistico", "Ejemplos para análisis lingüístico", "Análisis", "Seleccionar ejemplos con información morfológica, sintáctica o variacional relevante.", "Ejemplo analítico", ["Corpus paralelo", "Formas", "Variantes"], ["Banco analítico", "Etiquetas lingüísticas", "CSV"], ["pair_id", "phenomenon", "rrm_text", "spa_text", "entry_id", "source_page"], [1, 3, 5]),
  p(30, "trazabilidad-interna", "Sistema interno de trazabilidad", "Datos", "Mantener procedencia, transformación, versión y estado para cada registro derivado.", "Evento de procedencia", ["Todos los productos", "Fuentes", "Procesos ETL"], ["Historial por registro", "Matriz producto-fuente", "Auditoría"], ["event_id", "entity_id", "source_code", "source_page", "process", "version", "status", "timestamp"], []),
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productHref(product: Product) {
  return `/productos/${product.slug}`;
}
