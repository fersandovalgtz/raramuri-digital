# Pruebas fuente-basadas de candidatos prioritarios — v3

**Fecha:** 2026-08-14  
**Marco:** `EVIDENCE_MASTER_MATRIX_V2.md` + `C04_NES_FAMILY_MODERN_BRIDGE_V1.md`  
**Política:** `PROJECT_VALIDATION_POLICY_V1.md`

## Objetivo

La v3 se concentra en una sola incertidumbre de alto rendimiento: determinar si C04 posee una familia moderna con vocal `e` y soporte morfológico independiente suficiente para reducir la distancia entre `Nessé` histórico y `Nisé` moderno.

## Test 1. ¿Existe una familia moderna `nes-` de cuidado/pastoreo sin reconstruirla desde `Nisé`?

**Sí.** Márquez Terrazas 1999 registra `nesema`, `nesbonama`, `nesame`, `neser` y `neserichi` dentro del dominio de pastorear, cuidar animales y denominar al pastor.

### Decisión

`modern_e_vowel_nes_family_direct=true`.

La vocal `e` moderna ya no depende de una inferencia comparativa desde Steffel ni de una normalización de `Nisé`.

## Test 2. ¿La misma obra proporciona morfología compatible con `nesame` como participial?

**Sí, pero no token-específicamente.** La gramática de Márquez describe nombres de agente/actividad como frecuentemente participiales, ejemplifica participios presentes en `-ame` y reconoce `-me/-mi` con función adjetival/participial cuando se añade a verbos.

### Decisión

`nesame_participial_compatibility=strong`.

No elevar a `explicit_token_parse=true`, porque la entrada `nesame` no imprime una segmentación morfema por morfema ni una etiqueta directa de participio.

## Test 3. ¿Hay un testigo regional independiente con `Neseme` y semántica de cuidado de animales?

**Sí.** Tarahumara Books registra *Tewé Ralámuli Chibá Neseme*, autobiografía bilingüe español–Tarahumara Baja, traducida en el propio registro como ‘Niña tarahumara que cuida chivas’.

Una versión bíblica identificada como Western/Lowland Tarahumara contiene además `gowí neseme` en Marcos 5:14, en el contexto de quienes cuidan los cerdos.

### Decisión

`lowland_neseme_attested=true`.

La Biblia funciona como replicación intravariedad, no como línea genealógicamente independiente, porque ambas evidencias pertenecen a una tradición occidental asociada a Don Burgess.

## Test 4. ¿Existe evidencia moderna publicada de `-ame/-me` participial en las variedades relevantes?

**Sí.** El *Compendio básico de la gramática ralámuli* de 1997, elaborado con hablantes de varias regiones y con Burgess/Merrill, documenta explícitamente `-ame/-me` como morfología participial/nominalizadora y muestra formas regionales en `-me`, incluso en Baja-TB.

### Decisión

La forma `Neseme` ya no debe tratarse como una cadena gráficamente parecida sin arquitectura morfológica disponible. Existe un sistema moderno regional que permite `-me` participial.

Pero:

`Neseme = nese + -me` **no se registra como parse publicado recuperado**, por lo que permanece como análisis plausible, no hecho de fuente.

## Test 5. ¿La nueva evidencia basta para promover C04 a A?

**No todavía.**

La evidencia ahora converge en seis dimensiones:

- base histórica;
- derivado histórico;
- especialización histórica exacta al pastoreo;
- familia moderna con `e`;
- familia moderna con `i`;
- morfología moderna `-ame/-me` compatible.

El vacío residual es más pequeño pero metodológicamente importante: falta un análisis publicado del token exacto `nesame/neseme` o una fuente que identifique explícitamente la relación histórica `Nessé ~ nes-/Nisé`.

### Decisión de nivel

**C04 permanece B.**  
**Nota interna:** `B+ exceptional / near-A`.

No se promueve por acumulación cuantitativa de fuentes; el nivel A requiere resolver una cuestión estructural concreta.

## Test 6. ¿Las atestiguaciones modernas son plenamente independientes entre sí?

**No puede afirmarse.**

Márquez depende parcialmente de Brambila/Hilton y otros repertorios. El título Baja `Neseme`, la Biblia Western/Lowland y parte de la tradición gramatical de 1997 están asociados a Don Burgess. SRC-02 puede compartir genealogía lexicográfica con repertorios anteriores que todavía deben auditarse.

### Nuevo control metodológico

**N06 · replicación documental = independencia genealógica automática** → rechazado.

Una forma puede aparecer en varios documentos y seguir dependiendo de la misma tradición de recopilación/edición.

## Resultado de la ronda

| Candidato/control | Resultado | Estado |
|---|---|---|
| C04 | familia moderna `nes-` directa + `Neseme` Baja + morfología `-ame/-me` | **B, B+ excepcional** |
| N06 | varias atestiguaciones no equivalen automáticamente a fuentes independientes | **N** |

## Próxima prueba decisiva

Buscar únicamente evidencia capaz de resolver el último cuello de botella:

1. segmentación publicada `nesame/neseme`;
2. declaración comparativa `Nessé ~ nese-/nise-`;
3. control directo en Brambila/Hilton/Burgess 1984 o una fuente equivalente.

Si esas pruebas no aparecen, C04 debe permanecer B+ sin abrir búsquedas generales adicionales.
