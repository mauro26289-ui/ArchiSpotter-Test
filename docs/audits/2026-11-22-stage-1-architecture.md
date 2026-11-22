# ArchiSpotter-Test — Etapa 1: auditoría de arquitectura y dependencias
Fecha: 2026-11-22
Alcance: rama main; entrada de producción de pruebas /preview/index.html y estructura general del repositorio.
Estado: auditoría estática completada; no equivale a pruebas dinámicas en Safari/iPhone.

## 1. Inventario reproducible
Se consultó el árbol recursivo Git de main. Resultado: 148 archivos.
- preview/: 38 archivos (HTML, CSS, JS, datos, MP3, imágenes, manifest y respaldo).
- scripts/ en raíz: 86 archivos de la arquitectura anterior.
- data/ en raíz: 3 archivos.
- styles/ en raíz: 5 archivos.
- assets/ en raíz: 4 archivos.
- legacy/: 1 archivo.
- .github/workflows/: 1 archivo.
- otros archivos raíz y prototipos: 10.
El conteo es una fotografía de la rama en la fecha de auditoría, no un límite permanente.

## 2. Entradas y límites de ejecución
- /preview/index.html es la entrada de la PWA de pruebas utilizada actualmente.
- /index.html, /next/index.html y /sample/index.html son entradas HTML distintas; NO son importadas por preview/index.html. Siguen siendo accesibles por URL y no deben llamarse «código muerto» sin decidir el soporte de esas rutas.
- Los 86 archivos /scripts/ y los datos /data/ de raíz NO son referenciados directamente por preview/index.html. Pertenecen a otra generación de la aplicación, potencialmente utilizada por /index.html.
- /preview/backups/pre-modularization-2026-11-20.html es un respaldo histórico y no se carga como script en preview.
- No eliminar ni mover archivos raíz sin auditar sus otras entradas y los enlaces externos.

## 3. Grafo de dependencias de preview
Orden de scripts declarado en HTML:
1. Leaflet 1.9.4 (CDN unpkg)
2. data/translations.js
3. data/countries.js
4. data/cities.js
5. js/photos.js
6. data/city-food.js
7. js/navigation.js
8. data/editorial.js
9. js/monuments.js
10. data/restored-monuments.js
11. data/city-guides.js
12. data/veytaux-guide.js
13. js/explore.js
14. js/auth.js
15. js/map.js
16. js/app.js
17. js/gallery.js
18. js/saved.js
Los scripts locales se cargan con defer; el orden relativo declarado se conserva.
CSS locales: app.css, map.css, gallery.css, saved.css.
Dependencias externas: Leaflet, Google Fonts, Unsplash, Wikimedia Commons/Wikipedia API, audio alojado en GitHub raw y recursos de mapa CARTO.

## 4. Responsabilidades y propiedad de estado
- app.js: arranque, selección de idioma, sesión y composición de módulos.
- auth.js: cuentas y sesión locales.
- navigation.js: tabs y gesto de regreso.
- explore.js: país, ciudad, guías y platos.
- monuments.js: ficha, favoritos/viaje, audio y galería de monumento.
- photos.js: catálogo de URLs fotográficas y carga de imágenes.
- gallery.js: visor ampliado, zoom y arrastre.
- map.js: mapa, marcadores y geolocalización.
- saved.js: favoritos y Mi viaje.
- data/: diccionarios y contenido editorial.

Dependencias globales explícitas: window.ArchiSpotterData, ArchiSpotterEditorial, ArchiSpotterCityGuides, ArchiSpotterCityFood, ArchiSpotterPhotos, ArchiSpotterNavigation, ArchiSpotterMonuments, ArchiSpotterExplore, ArchiSpotterAuth, ArchiSpotterMap y ArchiSpotterSaved. No hay empaquetador/imports ES modules en esta entrada.

## 5. Comprobaciones objetivas
- Todas las referencias locales src/href detectadas en preview/index.html existen en el árbol Git.
- Ninguna referencia local src/href está repetida en preview/index.html.
- El catálogo activo contiene 51 entradas de monumentos, 51 nombres únicos.
- 48 fichas están en editorial.js y 3 adicionales en restored-monuments.js.
- Ninguna de las 3 fichas adicionales sobrescribe una clave existente en editorial.js.
- No faltan fichas editoriales para los 51 monumentos; no sobran fichas huérfanas.
- city-guides.js contiene 15 ciudades; Veytaux se agrega desde veytaux-guide.js.
- El HTML de preview carga un único archivo app.js; la inicialización central está en ese módulo.
- La inspección textual de los módulos JS activos no encontró asignaciones a innerHTML ni uso de eval(). Esto no es una auditoría de seguridad completa.

## 6. Hallazgos priorizados
P1 — Versiones coexistentes: hay múltiples entradas HTML y 86 scripts de raíz. Están fuera de la ruta de carga de preview, pero pueden servir a la app raíz. Etiquetar y documentar antes de archivar.
P1 — Dependencias por globals y orden: el arranque depende de que los archivos defer se ejecuten en orden y de nombres window.*. Falta un verificador automático de dependencias y carga.
P1 — Rutas de audio manuales: monuments.js mantiene mapas de IDs y elige entre ./audio/ y raw.githubusercontent.com. Riesgo de rutas inexistentes; no eliminar ni cambiar sin inventario de MP3.
P2 — Catálogo editorial fragmentado: 48+3 fichas en dos archivos; guías urbanas y platos se extienden con un archivo especial para Veytaux. No hay colisiones actuales, pero se recomienda un registro único validado.
P2 — Galería dividida: photos.js decide URLs; monuments.js maneja swipe de fichas; gallery.js maneja visor ampliado. No es duplicación exacta de código, pero hay contratos implícitos entre módulos que necesitan documentarse y probarse.
P2 — Caché manual: muchos parámetros ?v= distintos; riesgo de inconsistencias tras publicar. Recomendar manifest/versionado de build.
P2 — Dependencias externas: imágenes, fuentes, Leaflet, mapas y MP3 pueden fallar independientemente del JS. Documentar política de fallbacks y licencias.
P3 — Módulos grandes: monuments.js ~20 KB, map.js ~12.5 KB, editorial.js ~260 KB. Dividir solo si reduce acoplamiento; no fragmentar por fragmentar.

## 7. Reglas para etapa 2
1. Preservar el comportamiento actual y los 51 monumentos.
2. No borrar scripts de raíz, copias ni respaldos hasta auditar todas las rutas HTML.
3. No cambiar IDs de monumentos, claves de localStorage ni rutas de audio sin migración y tests.
4. Añadir comprobación automática de referencias locales, catálogo/editorial y colisiones.
5. Documentar contrato de gesto interactivo: el contenido sigue el dedo en tiempo real.
6. Comprobar reproducción de audio, galería y navegación en Safari iPhone antes de declarar certificación dinámica.

## 8. Límites y criterios de cierre
Esta etapa verifica arquitectura declarada, dependencias estáticas, rutas locales y unicidad de datos. No certifica que las URLs externas funcionen, que todos los MP3 reproduzcan, que no haya fugas de memoria, que los gestos funcionen en dispositivo o que el código histórico sea obsoleto. Esos temas pertenecen a auditorías de ejecución, rendimiento, medios y regresiones.
