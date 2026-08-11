# Validación CLDF

El paquete se genera con:

```bash
npm run data:cldf
```

La conformidad se comprueba con la implementación de referencia `pycldf==2.0.2`:

```bash
python -m pip install -r requirements-cldf.txt
python -m pycldf validate public/downloads/cldf/cldf-metadata.json
```

El workflow `.github/workflows/validate.yml` genera el paquete, ejecuta `pycldf validate` y vuelve a generar el CLDF en dos directorios temporales para comparar byte por byte los resultados. Una validación técnica satisfactoria no implica validación lingüística del contenido.
