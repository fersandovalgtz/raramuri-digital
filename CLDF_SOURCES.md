# Fuentes técnicas de la implementación CLDF

La implementación de Rarámuri Digital se basa en las especificaciones y herramientas oficiales del ecosistema CLDF:

- CLDF specification: https://github.com/cldf/cldf
- Dictionary module: https://github.com/cldf/cldf/tree/master/modules/Dictionary
- EntryTable component: https://github.com/cldf/cldf/tree/master/components/entries
- SenseTable component: https://github.com/cldf/cldf/tree/master/components/senses
- LanguageTable component: https://github.com/cldf/cldf/tree/master/components/languages
- Reference validator/API: https://github.com/cldf/pycldf
- Dictionaria example: https://github.com/dictionaria/iquito
- Glottolog mapping for ISO 639-3 `tar`: https://glottolog.org/resource/languoid/id/cent2131

## Version de validación

El CI utilizará `pycldf==2.0.2`, versión estable publicada el 14 de mayo de 2026, para validar el paquete CLDF generado.

Las URL externas son referencias técnicas. Su mención no implica afiliación ni aprobación de Rarámuri Digital por parte de esos proyectos.
