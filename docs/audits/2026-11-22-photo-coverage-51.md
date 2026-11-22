# ArchiSpotter — auditoría y sustitución fotográfica (51 monumentos / 102 fotografías)
Fecha: 2026-11-22
Repositorio: mauro26289-ui/ArchiSpotter-Test, rama main
Base estable mauro26289-ui/ArchiSpotter: sin modificaciones.

## Resultado implementado
- 51 monumentos del catálogo actual tienen exactamente 2 fotografías específicas, 102 en total.
- Se reemplazaron los antiguos identificadores genéricos de fotografías compartidos por ciudad para la presentación de monumentos.
- Las 102 fotografías proceden de archivos reales de Wikimedia Commons con URL, nombre de archivo, autor, licencia, enlace de origen, dimensiones originales y hash SHA-1 registrados.
- Resolución original mínima exigida: 1400 px de ancho y 800 px de alto.
- Ningún hash de archivo se repite en las 102 fotografías.
- 102/102 URLs de fotografías respondieron correctamente a comprobaciones HTTP HEAD con tipo MIME de imagen en GitHub Actions (ver docs/audits/photo-http-check.json).
- Se incorporó atribución visible en las fichas: autor, fuente Commons, tipo de licencia y enlace a licencia.
- Se eliminó la antigua tabla de URLs duplicadas de photos.js. El único registro de parejas es preview/assets/data/photo-pairs.js.
- Se evitó la descarga previa de una foto genérica antes de mostrar la fotografía específica en las tarjetas y fichas.
- Se creó una galería de revisión visual: preview/photo-audit.html.
- scripts/audit-preview.mjs exige 51 parejas, 102 archivos distintos, atribución, resolución y enlaces HTTPS.

## Procedimiento de selección
1. Inventario de los 51 nombres y ciudades desde preview/assets/data/cities.js.
2. Búsqueda de archivos Commons usando títulos concretos y términos geográficos.
3. Extracción mediante MediaWiki API de metadatos de imagen: dimensiones, licencia, autor, URL, SHA-1.
4. Exclusión de licencias NC/ND o desconocidas, archivos demasiado pequeños y archivos duplicados.
5. Selección de vistas del monumento y detalles arquitectónicos a partir de nombres y descripciones de archivos. Se descartaron explícitamente resultados ambiguos: «Coliseo Eduardo Dibós» (no es el Coliseo romano), «Avenida del Partenón» de Madrid, diagramas del Elevador de Santa Justa, fotos duplicadas recortadas del memorial de Berlín y una panorámica desde San Pablo que no representaba la catedral.
6. Verificación de disponibilidad HTTP para las 102 URLs finales.
7. Incorporación de créditos y pruebas automáticas.

## Limitaciones que NO deben confundirse con certificación visual
- La identidad del edificio se comprobó mediante títulos de archivo, metadatos, contexto geográfico y revisión de los candidatos; NO se realizó una inspección humana en tamaño completo de cada una de las 102 fotografías.
- HTTP 200 no demuestra que una imagen esté bien encuadrada, que no contenga un error visual o que tenga calidad estética suficiente. Para ello se publicó preview/photo-audit.html.
- No se realizó prueba física de las 102 fotografías en Safari/PWA iPhone. Las URLs son correctas al momento del chequeo, pero un proveedor externo puede fallar posteriormente.
- Las licencias CC BY / CC BY-SA exigen cumplir las condiciones de atribución y, según el caso, otras obligaciones. Se muestran créditos y enlaces en la ficha; revisar también posibles derechos de elementos representados.
- El usuario autorizó Unsplash Free, pero el lote final se seleccionó de Wikimedia Commons porque permite verificar metadatos de licencia, autor y dimensiones de manera reproducible. No se utilizaron imágenes Unsplash+.

## Rutas principales
- preview/assets/data/photo-pairs.js — 51 pares, 102 registros y créditos.
- preview/assets/js/photos.js — proveedor único de fotografías.
- preview/assets/js/monuments.js — galería y créditos visibles.
- preview/assets/js/explore.js — tarjetas sin carga previa de imágenes genéricas.
- preview/assets/js/saved.js — fotos correctas en Favoritos/Mi viaje.
- scripts/research-monument-photos.py — investigación de Commons.
- scripts/check-photo-links.mjs — comprobación HTTP de 102 imágenes.
- docs/audits/photo-candidates.json — candidatos y procedencia de investigación.
- docs/audits/photo-http-check.json — estado HTTP de las 102 URLs.
- preview/photo-audit.html — revisión visual de 51 parejas.

## Criterio de cierre
Implementación del catálogo de 102 fotos y controles automáticos: completa. Disponibilidad HTTP: 102/102 correcta. Certificación visual exhaustiva y prueba real en iPhone: pendientes; no declarar ambas completadas hasta realizarlas.
