# Ejemplo Python · API de Rarámuri Digital

Ejemplo mínimo y reproducible para consultar la API pública sin dependencias externas.

## Requisitos

Python 3.11 o posterior.

## Uso

```bash
python query_lexicon.py agua
python query_lexicon.py escuela --limit 10
```

El script consulta `https://raramuri.ceees.mx/api/lexicon`, valida la respuesta HTTP y muestra tres campos por resultado: identificador persistente, lema y traducción.

La API permite entre 1 y 200 resultados por consulta. La especificación completa está disponible en [OpenAPI 3.1](../../public/downloads/openapi-lexico.json).

> Los registros están autorizados para difusión, pero la validación lingüística permanece pendiente. El ejemplo no modifica el conjunto de datos ni debe interpretarse como validación de sus contenidos. Toda reutilización debe conservar atribución y procedencia y atender [GOVERNANCE.md](../../GOVERNANCE.md).
