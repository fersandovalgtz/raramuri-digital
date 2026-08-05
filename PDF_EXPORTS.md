# Exportaciones PDF reproducibles / Reproducible PDF exports

Las ediciones PDF de **Rarámuri Digital** se generan automáticamente a partir de `data/lexicon-master.csv`. No constituyen una base paralela ni deben corregirse manualmente: la base maestra estructurada conserva la autoridad documental y computacional.

The PDF editions of **Rarámuri Digital** are generated automatically from `data/lexicon-master.csv`. They are not a parallel source of truth and must not be edited manually: the structured master dataset remains the documentary and computational authority.

## Productos / Outputs

- `raramuri-lexico-completo.pdf`: edición completa con lema, clasificación, traducción, acepciones, variantes, ejemplos, procedencia, identificador y estado de transcripción.
- `raramuri-lexico-a.pdf`, `raramuri-lexico-b.pdf`, etc.: secciones alfabéticas para consulta, impresión o distribución parcial.
- `raramuri-lexico-alfabetico.zip`: paquete con todas las secciones alfabéticas.
- `manifest-pdf.json`: conteos, tamaños, tipos de medio y sumas SHA-256.

## Generación local / Local generation

Requisitos: Python 3.12 o posterior, una fuente TrueType Unicode y ReportLab.

```bash
python3 -m pip install -r requirements-pdf.txt
python3 scripts/generate-pdf-exports.py
```

La salida predeterminada se escribe en `dist/pdf/`. Para elegir otro directorio:

```bash
python3 scripts/generate-pdf-exports.py --output /ruta/de/salida
```

El parámetro `--max-entries` existe únicamente para pruebas de integración continua. No debe emplearse para publicar una edición.

## Reproducibilidad / Reproducibility

El generador:

- ordena las entradas mediante la forma normalizada y un plegado Unicode estable;
- agrupa las secciones por letra inicial sin eliminar los caracteres originales del contenido;
- incorpora la versión, DOI, licencia, estado de publicación y estado de validación desde `project-metadata.json`;
- utiliza metadatos PDF invariantes y archivos ZIP con marcas temporales fijas;
- calcula SHA-256 para cada producto;
- no incorpora facsímiles, logotipos ni materiales de terceros.

La automatización `.github/workflows/publish-pdf-exports.yml` produce las ediciones completas y las publica en el release móvil `pdf-latest`. Ese release es un canal de descarga, no una versión académica independiente. Para citar los datos debe utilizarse el DOI del proyecto y la versión del conjunto de datos.

## Control editorial / Editorial control

- **Estado de publicación:** autorizada para difusión.
- **Estado lingüístico:** pendiente de validación lingüística.
- **Licencia de datos y documentación:** CC BY-NC-SA 4.0.
- **Código del generador:** MIT.

La disponibilidad del PDF no sustituye la autoridad lingüística, cultural o política de las comunidades y personas hablantes rarámuri. Las reutilizaciones deben conservar atribución y procedencia y atender `GOVERNANCE.md`.
