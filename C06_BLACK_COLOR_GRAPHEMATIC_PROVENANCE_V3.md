# C06 · Control de procedencia grafemática de `tsocamec/otsocamec` — v3

**Fecha:** 14 de agosto de 2026  
**Candidato:** `tsocamec/otsocamec → čókameke ~ čókame → chó-ka-me`  
**Nivel formal:** **B**  
**Nota interna:** **B+ excepcional / cercano a A en Steffel→moderno**  
**Documento anterior:** `C06_BLACK_COLOR_STRUCTURAL_BRIDGE_V2.md`

## Pregunta

Determinar qué puede afirmarse documentalmente sobre la grafía final `<c>` de `tsocamec/otsocamec` en el *Compendio* de Thomas de Guadalaxara (1683), antes de compararla con Steffel `čókameke ~ čókame` o con la morfología moderna `chó-ka-me/chó-ka-mi`.

La finalidad de esta ronda es separar cuatro niveles que no deben confundirse:

1. procedencia material del token;
2. fidelidad de la transcripción moderna;
3. valor fonético del grafema final;
4. función morfológica del material final.

## 1. El token de ‘negro/oscuro’ es exclusivo del impreso de 1683

Rodríguez López cotejó el manuscrito zapopano y el impreso conservado en la British Library mediante listas de la terminología rarámuri de ambos documentos. Señala que el vocabulario es casi el mismo y que **sólo un término rarámuri presente en el impreso no aparece en el manuscrito**:

`tsocamec, otsocamec` (fol. 35r), ‘oscuro’ o ‘negro’.

### Consecuencia

`printed_1683_black_form_unique_to_print=true`  
`zapopan_manuscript_doublet=false`

La forma no dispone, por tanto, de un doblete manuscrito del mismo dossier con el cual controlar directamente la consonante final, la vocalización o la posible extensión expletiva.

Esto reduce una vía de verificación que antes podía suponerse disponible.

## 2. El `<c>` final no es una modernización de Rodríguez 2010

En sus criterios de edición, Rodríguez declara que para la transcripción del impreso de 1683 respetó los términos escritos y los signos del ejemplar de la British Library, reproduciendo incluso la disposición de líneas y folios. Cuando introduce sustituciones tipográficas por razones técnicas, afirma haber comprobado que no alteren el valor fonético de los grafemas empleados por Guadalaxara.

Por ello, la lectura `tsocamec/otsocamec` debe tratarse como **testimonio documental de la grafía del impreso**, no como una normalización ortográfica de 2010.

`printed_final_c_editorially_faithful=true`

## 3. Fidelidad grafemática ≠ identificación fonológica

La fidelidad de la transcripción sólo demuestra que el impreso presenta `<c>` en esa posición según la lectura editorial de Rodríguez.

No demuestra todavía:

- `final_c_phonetic_value=/k/`;
- `final_c_is_expletive_k=true`;
- `final_c_morpheme=-ke`;
- `final_c_corresponds_to_Steffel_ke=true`.

Estos cuatro enunciados permanecen **no adjudicados**.

## 4. Rodríguez identifica /k/ y la reduplicación expletiva como un problema específico del impreso

La tercera parte de la edición incluye un apartado autónomo titulado:

**“El fonema oclusivo velar /k/ del tarahumar y la reduplicación expletiva”** (p. 162), seguido de **“Las letras equívocas”** (p. 163).

La introducción explica que estos apartados son dos de los detalles importantes que deben tomarse en cuenta para aproximarse a la gramática de Guadalaxara.

### Qué sí permite esto

Confirma que el valor de /k/, la reduplicación expletiva y ciertas ambigüedades gráficas son problemas **internos y explícitos de la edición del documento de 1683**, no solamente categorías traídas de gramáticas modernas.

### Qué todavía no permite

En la ruta digital consultada no fue posible recuperar de manera estable el cuerpo completo de las pp. 162–164. Por tanto, no se atribuye a Rodríguez ninguna regla concreta sobre `tsocamec`, ni se usa el mero título de la sección para analizar el `<c>` final.

`Rodriguez_k_expletive_section_exists=true`  
`Rodriguez_k_expletive_section_full_text_recovered=false`  
`token_specific_application_to_tsocamec=not_demonstrated`

## 5. Control moderno: reduplicación expletiva con K + vocal

Fuentes modernas describen una reduplicación expletiva opcional que añade `k` más repetición de la vocal final de la base, por ejemplo:

- `gomá → gomáka`;
- `remé → reméke`;
- `muní → muniki`;
- `ganó → ganóko`;
- `sunú → sunúku`.

Este patrón es pertinente porque muestra que secuencias finales de tipo `-ka/-ke/-ki/-ko/-ku` pueden ser expletivas en rarámuri moderno.

### Regla epistemológica

El patrón moderno es **hipótesis-generador**, no prueba histórica token-específica.

No se infiere:

`tsocame + c = expletive`  
ni  
`1683 c = Steffel ke`.

## 6. Segundo ejemplar impreso potencial

Una publicación de historia del libro señala que para estudiar la obra de Guadalaxara fue consultado un ejemplar en la **New York Public Library**.

Esto abre una vía importante de control material independiente del ejemplar de la British Library. En esta ronda no se recuperó todavía un registro digital verificable del ejemplar ni imágenes del fol. 35r.

`NYPL_second_print_copy_reported=true`  
`NYPL_catalog_record_recovered=false`  
`NYPL_fol35r_visual_control=false`

La existencia reportada del segundo ejemplar debe tratarse como pista documental de alta prioridad, no como cotejo realizado.

## 7. Consecuencia para C06

C06 **no cambia de grado**.

Se mantiene:

`C06_tier=B`;  
`C06_strength=B+_exceptional_near_A_Steffel_to_modern`.

Pero su cuello de botella queda ahora mejor definido:

### Resuelto

- `tsocamec/otsocamec` pertenece exclusivamente al impreso de 1683 dentro del par de testigos cotejados por Rodríguez;
- la grafía final `<c>` es editorialmente fiel al impreso según los criterios declarados de la edición;
- Rodríguez considera /k/, reduplicación expletiva y “letras equívocas” problemas específicos que requieren discusión.

### No resuelto

- valor fonético exacto del `<c>` final del token;
- posible relación con reduplicación expletiva;
- identidad o correspondencia con Steffel `-ke`;
- segmentación interna `tso/čo + ka + ame + ...` en 1683;
- cotejo visual con el ejemplar británico o el ejemplar reportado de NYPL.

## 8. Nuevo control negativo N12

**N12. Fidelidad diplomática de un grafema no equivale a identificación fonológica o morfológica.**

Para `tsocamec/otsocamec`, el hecho de que `<c>` sea antiguo y esté transcrito fielmente no autoriza a leerlo automáticamente como /k/, como reduplicación expletiva, como `-ke`, ni como el mismo material que el final de Steffel.

## 9. Próxima prueba capaz de mover el candidato

C06 sólo debe reabrirse para una promoción de grado si se obtiene una de estas piezas:

1. texto completo de Rodríguez 2010, pp. 162–164, con una regla que pueda aplicarse de manera controlada al token o a su contexto gráfico;
2. facsímil del fol. 35r del impreso británico;
3. localización y facsímil del ejemplar reportado en NYPL para cotejo independiente;
4. análisis histórico publicado token-específico que relacione `tsocamec/otsocamec` con la estructura cromática posterior.

Hasta entonces, **no acumular más ocurrencias modernas de `chókame/chócami`**.

## Fuentes

- Rodríguez López, Abel. 2010. *Gramática Tarahumara (1683): Compendio del arte de la lengua de los tarahumares y guazapares de Thomas de Guadalaxara*. UACJ.
- Guadalaxara, Thomas de. 1683. *Compendio del Arte de la lengva de los Tarahvmares, y Gvazápares*.
- Brambila, David. *Diccionario rarámuri-castellano*; descripción moderna de reduplicación expletiva.
- Irigoyen Rascón, Fructuoso. 2023. *Chá Okó*, sinopsis gramatical rarámuri.
- Garone Gravier et al., estudio de historia del libro que reporta consulta de un ejemplar de Guadalaxara 1683 en la New York Public Library.
