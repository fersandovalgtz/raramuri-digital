# Dependencias y bloqueos de investigación — Rarámuri Histórico Digital

**Corte:** 2026-08-14

Este documento registra qué falta para elevar de grado las hipótesis vigentes. Su función es impedir búsquedas redundantes y distinguir entre problemas conceptuales, documentales y técnicos.

## D1. Rodríguez López 2010 / Guadalaxara 1683

**Objetivo:** ingerir de forma estable la edición completa de *Gramática Tarahumara de Thomas de Guadalaxara (1683)*, Abel Rodríguez López, 2010.

**Estado:** localizada digitalmente; ingestión completa no lograda en el entorno actual.

**Prioridad:** control directo de grafías coloniales, distribución de `ame(+c/k)`, posible segunda evidencia histórica para `li + ame` y mejor evaluación del puente cromático del siglo XVII.

## D2. Tellechea 1826

**Objetivo:** convertir la red OCR de variantes participiales/adjetivales en evidencia diplomática controlada.

### Ya completado

La auditoría `TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md` y su JSON clasifican exhaustivamente las 24 ocurrencias crudas en `-amec/-ameque` del OCR completo y distinguen participios explícitos, formas bilingües participiales, metalingüística, otras construcciones, falsos positivos y fragmentos por salto de línea.

Se mantienen como familias OCR fuertes `atígameque ~ atígame`, `simiámec ~ simíame` y `machiámec ~ machiámeque ~ machíameque ~ machíame`. Se añaden como candidatas OCR pendientes de facsímil `ayoriguámeque ~ ayoriguáme` y `rejoírugameque ~ rejoírugame`.

La auditoría corrige `gameque` como fragmento de `netetugameque`, `támeque` como fragmento de `natámeque` y `gayéname` como fragmento de línea de `gayénameque`, **no variante breve**.

### Bloqueo restante

**Facsímil:** localizado, pero la ruta técnica de cotejo visual estable no está disponible en el entorno actual para esta ronda.

### Cotejo visual prioritario cuando sea posible

1. `ayoriguámeque ~ ayoriguáme`;
2. `rejoírugameque ~ rejoírugame`;
3. límites `netetu-gameque`, `na-támeque`, `gayéname-que`;
4. lectura diplomática exacta de `Taraijámeque`, `rumgamec` y `yumctvameque`;
5. sólo después, relación grafemática `c/que/k/ke`.

**Regla:** el OCR puede generar y depurar candidatos, pero no sustituye el facsímil cuando el límite de palabra o una letra determina la conclusión. La pérdida `que/ca` de pretéritos no se transfiere automáticamente a participios.

## D3. Grafemática colonial `<c>/<k>/<que>/<ke>`

**Objetivo:** determinar cuándo estas grafías representan valores comparables y cuándo responden a convenciones distintas.

**Dependencias:** D1 + D2 y descripciones ortográficas explícitas de Guadalaxara, Steffel y Tellechea.

## D4. Segunda raíz histórica D1 para `X-li-ame(ke)`

**Objetivo:** encontrar una segunda raíz histórica con segmentación publicada o evidencia equivalente para `X + -li + -ame(ke)`.

**Estado:** no encontrada. D1 `tsanelíameke`; D2 fuerte `tschutschelíameke`; controles negativos `ganelíameke`, `uilíameke`, `selíameke`.

## D5. Relación moderna `-ame ~ -me ~ -ami`

**Objetivo:** separar variación regional/sincrónica, condicionamiento fonológico y posible cambio diacrónico.

**Estado:** el *Compendio básico de la gramática ralámuli* 1997 documenta `-ame/-me` participial en varias regiones, incluidas realizaciones `-me` en Baja-TB; otras fuentes apoyan `-ame ~ -ami`. Merrill y Márquez documentan además alternancias `e~i`, sin demostrar una ley general.

**Regla:** no convertir distribución regional en una cadena histórica universal.

## D6. C04 `Nessé/Nesséameke ↔ nes-/Neseme ↔ Nisé/Niséami`

**Objetivo:** determinar si C04 puede elevarse de B (`B+ excepcional / cercano a A`) a A.

### Evidencia ya resuelta

La cadena histórica/moderna ya contiene `Nessé`, `Nesséameke`, `pouguá nesséameke`, la familia moderna `nesema/nesbonama/nesame/neser/neserichi`, `Neseme` Baja/Western, `Nisé/Niséami` de SRC-02 y `nise’ami/niseami` en Balleza. La arquitectura regional `-ame/-me` y la posibilidad interna `e~i/é~í` están documentadas sin convertirlas en leyes universales.

### Control morfológico v3 · completado

`C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md` recupera cinco pares internos independientes en Márquez 1999:

- `benema ~ bename`;
- `natogema ~ natogame`;
- `ne’ogema ~ ne’ogame`;
- `nichugema ~ nichugame`;
- `semema ~ semame`.

Todos muestran la oposición superficial verbo de cita `...ema` ↔ agente/cualidad `...ame`; `semema ~ semame` ofrece el control más transparente: ‘tocar un instrumento de cuerdas’ ↔ ‘violinista, músico de cuerdas’.

La misma obra declara que los nombres de persona definidos por una actividad suelen ser participios, que el participio presente puede ser sustantivo/adjetivo y que `-ame/-me/-mi` posee función participial/adjetival. Por tanto:

**`nesame` como miembro participial/agentivo de la familia `nes-` = alta confianza interna de fuente.**

La relación `nesema ~ nesame` ya no debe tratarse como una anomalía o ajuste ad hoc. **No buscar más controles genéricos `Xema ~ Xame`: esta dependencia está cerrada.**

### Cuello de botella restante

Para cambiar C04 a A hace falta todavía **uno** de estos controles fuertes:

1. una fuente que segmente explícitamente `nesame/neseme` como radical + participial `-ame/-me`, o un paradigma publicado que identifique el radical y la derivación concreta;
2. una fuente que identifique directamente `Nessé` y `nes-/Nisé` como variantes/cognados históricos.

El patrón interno de alta confianza no debe presentarse como un parse impreso morfema por morfema que la fuente no ofrece.

### Fuentes prioritarias sólo si aparece una ruta documental nueva

- Brambila original: paradigma o familia exacta `nes-`;
- Hilton/Samachique 1993/2016: `nes-/nis-`, pastorear/pastor, categoría y derivados;
- Burgess 1984 *Western Tarahumara*: análisis morfológico de `neseme` o de la raíz;
- otra comparación publicada que identifique `Nessé ~ nes-/Nisé`.

### Búsquedas ya realizadas que no deben repetirse

- Brambila indexado para `nesame`, `nesema`, `pastor`, `pastorear`: no recuperación, no ausencia;
- diccionario castellano–rarámuri de 1983 desde `pastor/pastorear`: sin equivalencia verificable recuperada;
- Burgess 1984 indexado: sin parse `neseme` recuperado;
- controles genéricos `Xema ~ Xame`: **resueltos con cinco pares internos; no seguir acumulando**.

### Bloqueos técnicos

- Hilton/Samachique: PDF oficial identificado, pero HTTP 403 en el entorno actual;
- Márquez 1999: texto indexado suficiente para control gramatical/lexicográfico; la ruta PDF ha devuelto `cache miss`, por lo que no se afirma cotejo visual;
- Brambila: rutas digitales localizadas, pero la indexación incompleta impide interpretar una búsqueda negativa como ausencia.

## D7. Genealogía de fuentes modernas

**Objetivo:** evitar que replicaciones editoriales se cuenten como evidencia independiente.

**Estado:** Márquez depende parcialmente de Brambila/Hilton y varias fuentes Lowland/Western comparten tradición de Don Burgess. La independencia de SRC-02 respecto de repertorios modernos debe auditarse sólo si afecta una promoción de grado.

**Regla:** `document_replication != source_independence`.

## D8. Integración al corpus/producto público

**Objetivo:** decidir qué hallazgos pasan del expediente de investigación a datos visibles o notas metodológicas.

**Precondición:** cada hallazgo debe etiquetarse como hecho documental, análisis publicado, inferencia del proyecto o hipótesis no resuelta. C04 y los nuevos pares OCR de C09 no deben integrarse todavía como segmentaciones/cognaciones asentadas en el dataset estable.

## Priorización vigente

**Máximo rendimiento sin nuevos documentos:** auditar `-ame` de Tellechea sólo alrededor de raíces ya justificadas y paralelos españoles participiales; no usar frecuencia bruta.  
**Máximo rendimiento con facsímil:** D2, empezando por `ayorigu-`, `rejoíruga-` y límites OCR reconstruidos.  
**C04:** cerrado para búsquedas generales; reabrir sólo si aparece parse/paradigma token-específico o comparación histórica directa.  
**Siguiente prioridad documental:** D1 Guadalaxara.  
**Control metodológico paralelo:** D7 genealogía de fuentes.  
**Prioridad analítica posterior:** D3 y D4.  
**Prioridad comparativa:** D5.  
**Prioridad editorial:** D8.

No abrir búsquedas generales sobre `-ameke/-ami`, `e~i`, `neseme` o nuevos pares `Xema~Xame`; sólo pruebas que puedan mover un candidato entre niveles, depurar falsos positivos o falsar una hipótesis concreta.
