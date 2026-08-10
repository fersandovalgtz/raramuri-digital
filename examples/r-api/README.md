# Ejemplo R · API de Rarámuri Digital

Ejemplo reproducible para consultar la API pública y trabajar los resultados como tabla en R.

## Requisitos

Una instalación reciente de R y el paquete `jsonlite`.

```r
install.packages("jsonlite")
```

## Uso

```bash
Rscript query_lexicon.R agua 5
Rscript query_lexicon.R escuela 10
```

El script consulta `https://raramuri.ceees.mx/api/lexicon`, convierte la respuesta JSON en una estructura tabular y muestra identificador persistente, lema y traducción.

La especificación completa está disponible en [OpenAPI 3.1](../../public/downloads/openapi-lexico.json).

> Los registros están autorizados para difusión, pero la validación lingüística permanece pendiente. Este ejemplo no modifica los datos ni constituye revisión lingüística. Toda reutilización debe conservar atribución y procedencia y atender [GOVERNANCE.md](../../GOVERNANCE.md).
