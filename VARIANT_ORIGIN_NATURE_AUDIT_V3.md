# Auditoría exhaustiva de procedencia y naturaleza de `variants` — v3

**Fecha:** 14 de agosto de 2026  
**Dataset:** 1.0.0  
**Fuente controlada:** `DICCIONARIO raramuri.pdf` (87 páginas)

## Resultado cerrado

Los **224 tokens** almacenados en `variants` quedaron clasificados sin residuos: **0 sin origen** y **0 con origen múltiple**. La composición es: 54 formas co-presentadas en el lema; 156 anotaciones gramaticales etiquetadas regulares; 2 anotaciones gramaticales con separador interno no canónico; 3 relaciones gramaticales expresadas en frase; 6 referencias donde la fuente dice literalmente `variante de ...`; 1 anotación mixta con un segmento no etiquetado; y 2 remisiones actualmente capturadas.

## Control visual de la fuente

- `RD-000034`, p. 4: `[pret.: a'huiri, fut.: a'huimea]`. La página fuente confirma dos etiquetas explícitas, pret. y fut.; la coma funciona como separador entre grupos. El parser derivado actual las fusiona y debe corregirse en una migración controlada.
- `RD-000726`, p. 36: `[pret.: chirihuéari; chiruérama; pp.: chirihuéami]`. La página fuente confirma que `chiruérama` aparece sin etiqueta. No se le asigna fut. ni otra función por inferencia.
- `RD-000862`, p. 42: `[ad.: huáami; pp.: huacami]`. La página fuente confirma literalmente la etiqueta `ad.`; se conserva sin expandirla ni reinterpretarla.
- `RD-000895`, p. 43: `[gut.: huaniméa]`. La página fuente confirma literalmente `gut.`. El mapeo actual `gut→fut` es una normalización editorial y no debe presentarse como lectura documental sin una decisión explícita.
- `RD-001023`, p. 48: `[pret.: huirírari: fut.: huiriráma]`. La página fuente confirma dos etiquetas explícitas, pret. y fut., pese al colon usado como separador interno. El parser derivado actual las fusiona.

La búsqueda literal en el PDF confirma exactamente **6** ocurrencias de `variante de`, en concordancia con la clasificación automática 6/6. Sus seis destinos resuelven a lemas existentes del corpus.

## Remisiones: cobertura real

Al ampliar el control desde `comments_raw` a **ambos campos textuales de la entrada**, la fuente contiene **18 remisiones visibles**: 15 en `comments_raw` y 3 en `translation_raw`. Sólo **2** están hoy representadas en `variants`; faltan **16**.

De las faltantes, **13** están en comentarios y se pierden por la regex que no reconoce `Véase` con acento en la primera e; **3** están en `translation_raw`, campo que `extract_variants` no inspecciona.

Por tanto, las remisiones deben salir conceptualmente de `variants`: son relaciones lexicográficas, no variantes lingüísticas. La migración futura debe capturarlas desde ambos campos, conservar el texto fuente y resolver el destino mediante `record_id` cuando sea posible.

## Consecuencia para el producto de variantes gráficas

Dos casos ya cotejados visualmente demuestran que el parser actual de anotaciones gramaticales no es suficientemente robusto ante separadores internos: `RD-000034` y `RD-001023`. Además, el código normaliza `gut` a `fut` aunque la fuente imprime `gut.`. Estos tres puntos quedan registrados como deuda técnica/documental; no se corrigen silenciosamente en datos 1.0.0.

Las seis relaciones explícitas `variante de ...` constituyen un segundo frente: todas enlazan con un lema existente, pero ninguna está marcada actualmente como relación estructurada **explícita en la fuente**. Dos coinciden accidentalmente con relaciones detectadas por comparación automática (`Icori ~ huicori` y `Icúsuhua ~ igúsuhua`); esa coincidencia no sustituye la procedencia documental explícita.

## Modelo recomendado

Una futura estructura tipada debe separar `variant_origin`, `variant_nature`, `target_record_id`, `source_field`, `source_page`, `raw_evidence` y `validation_status`. `variants` puede mantenerse como vista compatible, pero ya no debe funcionar como contenedor semánticamente homogéneo.

La migración deberá preservar las 54 formas co-presentadas, convertir las remisiones en relaciones lexicográficas separadas, representar las seis fórmulas `variante de ...` como relaciones explícitas de fuente y robustecer el parser gramatical sin completar por inferencia los segmentos no etiquetados.
