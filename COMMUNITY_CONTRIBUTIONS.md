# Protocolo para contribuciones comunitarias y multimedia

Este protocolo regula la incorporación futura de correcciones, pronunciaciones, audio, video, fotografías, ejemplos y otros aportes realizados por personas hablantes o integrantes de comunidades rarámuri. Su finalidad es hacer operativos los principios de `GOVERNANCE.md`; no declara que exista todavía una validación comunitaria general del corpus.

## Autoridad y consentimiento

La contribución de una persona no transfiere a Rarámuri Digital autoridad sobre la lengua, la comunidad ni otros materiales culturales. Cada contribución multimedia requiere consentimiento explícito y registrable antes de su publicación. El consentimiento debe referirse al material concreto, al alcance de difusión y a la forma de atribución; no se presume por el hecho de participar en una entrevista, conversación, clase, investigación o actividad institucional.

El proyecto distinguirá al menos tres alcances: `public`, para material que puede publicarse y redistribuirse conforme a sus condiciones específicas; `research-only`, para material disponible únicamente dentro de un contexto de investigación autorizado; y `restricted`, para material que no debe hacerse público. Una licencia general del dataset nunca ampliará un permiso más restrictivo otorgado por la persona contribuyente o por una decisión comunitaria aplicable.

## Identidad y atribución

La persona contribuyente podrá elegir aparecer con su nombre, con un seudónimo/código o sin identificación pública. El sistema conservará únicamente los datos personales necesarios para documentar consentimiento, atribución y contacto operativo. La información privada de contacto no debe almacenarse en el repositorio público.

Cuando una contribución se publique, la atribución debe reflejar la preferencia registrada. Si la persona solicita anonimato público, no debe ser posible reconstruir su identidad a partir de metadatos abiertos, nombres de archivo o rutas.

## Variante, localidad y contexto

Las etiquetas de variante, localidad, comunidad o forma de habla se registrarán como fueron declaradas por la persona contribuyente o como una clasificación revisada por especialistas; ambos casos deben distinguirse. El proyecto no inferirá automáticamente una identidad comunitaria, una variante o un Glottocode a partir de coordenadas, apellidos, rasgos ortográficos o similitud lingüística.

El contexto mínimo de una contribución debe permitir comprender qué representa el material sin revelar información sensible. La procedencia puede incluir fecha, localidad a un nivel apropiado, persona que realizó la grabación, relación con una entrada `RD-######`, notas de contexto y fuente de autorización.

## Estados de revisión

Una contribución puede pasar por los estados `submitted`, `consent-verified`, `speaker-reviewed`, `linguist-reviewed`, `community-reviewed`, `restricted` o `withdrawn`. Estos estados no son equivalentes. `speaker-reviewed` indica revisión por una o más personas hablantes identificadas en el registro; no implica consenso comunitario. `community-reviewed` solo podrá utilizarse cuando exista un procedimiento documentado que justifique esa denominación.

La publicación técnica de un archivo no convierte automáticamente la entrada lexicográfica relacionada en lingüísticamente validada. Las revisiones deben quedar fechadas y vinculadas a la persona o instancia que realizó la revisión, con el nivel de publicidad que permita el consentimiento.

## Retiro, corrección y cambio de consentimiento

Una persona contribuyente puede solicitar corrección de atribución, restricción adicional o retiro del material que aportó. La solicitud recibirá prioridad y el proyecto podrá suspender temporalmente el acceso mientras se revisa. Cuando la eliminación completa no sea técnicamente posible por copias externas, depósitos o versiones ya distribuidas, se documentará la limitación y se retirará el material de las superficies bajo control del proyecto.

Las modificaciones posteriores al contenido de una grabación, transcripción, traducción o segmentación deben conservar historial. Nunca se reemplazará silenciosamente una contribución humana por una salida automática.

## Sensibilidad cultural y daño potencial

No se publicará material que la persona contribuyente o una instancia comunitaria competente identifique como sensible, ceremonial, restringido, peligroso de descontextualizar o inapropiado para difusión abierta. La capacidad técnica de almacenar o compartir un archivo no constituye una razón suficiente para publicarlo.

Las solicitudes relacionadas con daño cultural, privacidad, atribución incorrecta o uso indebido pueden prevalecer sobre objetivos de apertura, métricas de reutilización o conveniencia computacional.

## Compensación y reciprocidad

Cuando una actividad requiera trabajo sustantivo de hablantes —grabación, revisión, traducción, explicación, curación o evaluación— el proyecto deberá definir antes de comenzar si habrá compensación, reconocimiento académico, devolución de materiales, capacitación, acceso a herramientas u otra forma de reciprocidad. La ausencia de presupuesto no debe ocultarse ni sustituirse por expectativas implícitas de trabajo gratuito.

## Reutilización y plataformas externas

Ningún archivo multimedia se copiará automáticamente a una plataforma de terceros. Antes de transferirlo se revisarán consentimiento, condiciones de uso, controles de acceso, capacidad de retiro, historial, atribución y compatibilidad de licencias. Si una integración puede realizarse mediante enlace, API o metadatos sin duplicar el archivo, se preferirá esa opción cuando preserve mejor el control del material.

## Metadatos mínimos

El esquema `schemas/community-media.schema.json` define un registro técnico mínimo. Su existencia no autoriza la recolección de datos. Cada implementación deberá mantener separados los metadatos públicos de cualquier evidencia privada de consentimiento y contacto.

## Piloto recomendado

La primera prueba debe ser pequeña y reversible: unas pocas entradas seleccionadas con personas hablantes que conozcan el propósito del proyecto, con consentimiento individual explícito, revisión de la atribución antes de publicar y una evaluación posterior del proceso. Solo después de ese piloto deberá decidirse si conviene ampliar el componente multimedia o conectarlo con plataformas externas.
