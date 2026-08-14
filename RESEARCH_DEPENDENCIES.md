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

Se mantienen como familias OCR fuertes:

- `atígameque ~ atígame`;
- `simiámec ~ simíame`;
- `machiámec ~ machiámeque ~ machíameque ~ machíame`.

Se añaden como candidatas OCR pendientes de facsímil:

- `ayoriguámeque ~ ayoriguáme`;
- `rejoírugameque ~ rejoírugame`.

La auditoría corrige además:

- `gameque` → fragmento de `netetugameque`;
- `támeque` → fragmento de `natámeque`;
- `gayéname` → fragmento de línea de `gayénameque`, **no variante breve**.

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

- histórico `Nessé` ‘guardar/cuidar’;
- histórico `Nesséameke` ‘guardián/custodio’;
- Merrill `pouguá nesséameke` ‘pastor de ovejas’;
- Márquez 1999: familia moderna contigua `nesame`, `nesbonama`, `nesema`, `neser`, `neserichi` en el dominio cuidado/pastoreo;
- Márquez: los verbos se enuncian lexicográficamente por el futuro y el futuro de primera conjugación termina en `-ma`;
- Márquez: el participio presente se deriva del indicativo correspondiente y la regla general añade `-ame`; ejemplos explícitos `ba-ame`, `os-ame` y `gumim-ame`;
- Márquez: `-me/-mi` se clasifica como adjetival y participial con verbo;
- Márquez: los nombres de persona definidos por una actividad suelen ser participios de algún verbo;
- Tarahumara Baja: `Neseme` en *Tewé Ralámuli Chibá Neseme*, ‘Niña tarahumara que cuida chivas’;
- Western/Lowland: `neseme` replicado en contexto de cuidadores de animales, sin contarlo como fuente plenamente independiente de la tradición Burgess;
- SRC-02: `Nisé` ‘cuidar, pastorear’ → `Niséami` ‘pastor’;
- *Awilichi bawi*: `nise’ami/niseami` en contexto de chivas;
- 1997: arquitectura `-ame/-me` participial regional;
- Merrill/Márquez: `e~i` fonológicamente posible, no regular.

### Resultado del control morfológico v2

La lectura de `nesame` como forma participial/agentiva de la familia `nes-` es ahora **fuertemente predicha por reglas publicadas en la misma obra**. Sin embargo, no se recuperó un parse impreso `nes-ame`, ni la frase ‘participio de nesema’, ni un paradigma token-específico que identifique con seguridad el radical secundario pertinente.

La forma de cita `nesema` tampoco permite derivar mecánicamente `nesame`: los lemas verbales son futuros y la gramática distingue radicales primarios/secundarios y clases irregulares. En el material recuperado no se explica la relación exacta del material vocálico interno de `nesema ~ nesame`.

**Documento:** `C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V2.md`.

### Cuello de botella restante

Para cambiar C04 a A hace falta **uno** de estos controles fuertes:

1. una fuente que segmente explícitamente `nesame/neseme` como radical + participial `-ame/-me`, o un paradigma publicado que identifique su radical y la derivación concreta;
2. una fuente que identifique directamente `Nessé` y `nes-/Nisé` como variantes/cognados históricos.

No sustituir este requisito acumulando más ocurrencias de `neseme`, ni convertir la productividad general de `-ame/-me` en un parse token-específico no publicado.

### Fuentes prioritarias

- Brambila original: paradigma o familia exacta `nes-`;
- Hilton/Samachique 1993/2016: `nes-/nis-`, pastorear/pastor, categoría y derivados;
- Burgess 1984 *Western Tarahumara*: análisis morfológico de `neseme` o de la raíz;
- otra comparación publicada que identifique `Nessé ~ nes-/Nisé`.

### Búsquedas ya realizadas que no deben repetirse sin una ruta documental nueva

- búsquedas indexadas de Brambila para `nesame`, `nesema`, `pastor`, `pastorear`: no recuperación; **no equivale a ausencia**;
- búsqueda dirigida en el diccionario castellano–rarámuri de 1983 desde `pastor/pastorear`: sin equivalencia verificable recuperada;
- búsquedas indexadas en Burgess 1984: sin parse `neseme` recuperado.

### Bloqueos técnicos

- Hilton/Samachique: PDF oficial identificado, pero HTTP 403 en el entorno actual;
- Márquez 1999: texto indexado suficiente para el control morfológico y lexicográfico; la ruta PDF del repositorio/Dropbox ha devuelto `cache miss`, por lo que no se afirma cotejo visual del facsímil;
- Brambila: rutas digitales localizadas, pero los índices del escaneo no permiten interpretar una búsqueda negativa como ausencia.

## D7. Genealogía de fuentes modernas

**Objetivo:** evitar que replicaciones editoriales se cuenten como evidencia independiente.

**Estado:** se sabe que Márquez depende parcialmente de Brambila/Hilton y que varias fuentes Lowland/Western comparten la tradición de Don Burgess. La independencia de SRC-02 respecto de cada repertorio moderno debe auditarse caso por caso si llega a afectar una promoción de grado.

**Regla:** `document_replication != source_independence`.

## D8. Integración al corpus/producto público

**Objetivo:** decidir qué hallazgos pasan del expediente de investigación a datos visibles o notas metodológicas.

**Precondición:** cada hallazgo debe etiquetarse como hecho documental, análisis publicado, inferencia del proyecto o hipótesis no resuelta. C04 y los nuevos pares OCR de C09 no deben integrarse todavía como segmentaciones/cognaciones asentadas en el dataset estable.

## Priorización vigente

**Máximo rendimiento sin nuevos documentos:** auditar `-ame` de Tellechea sólo alrededor de raíces ya justificadas y paralelos españoles participiales; no usar frecuencia bruta.  
**Máximo rendimiento con facsímil:** D2, empezando por `ayorigu-`, `rejoíruga-` y límites OCR reconstruidos.  
**C04:** reabrir D6 sólo si aparece una ruta documental nueva hacia parse token-específico o comparación histórica directa.  
**Siguiente prioridad documental:** D1 Guadalaxara.  
**Control metodológico paralelo:** D7 genealogía de fuentes.  
**Prioridad analítica posterior:** D3 y D4.  
**Prioridad comparativa:** D5.  
**Prioridad editorial:** D8.

No abrir búsquedas generales sobre `-ameke/-ami`, `e~i` o `neseme`; sólo pruebas que puedan mover un candidato entre niveles, depurar falsos positivos o falsar una hipótesis concreta.
