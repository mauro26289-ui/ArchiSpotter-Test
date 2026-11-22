# Auditoría de fotografías — 51 monumentos
Fecha: 2026-11-22
Estado: inventario completo; selección y verificación de 74 fotografías pendientes. NO certificado.

## Requisitos de aceptación
Dos fotografías reales, distintas y específicamente del monumento por ficha; resolución de al menos 1400 px preferida; URL accesible, procedencia y licencia revisadas; no usar imágenes genéricas de ciudad. Fuentes autorizadas: Unsplash Free (no Unsplash+) y Wikimedia Commons con licencia apta. Para Commons, registrar autor, URL de ficha y requisitos de atribución; para Unsplash Free, registrar autor y URL de foto. La licencia de fotografía no elimina necesariamente los derechos de edificios/obras representados.

## Inventario comprobado contra preview/assets/data/cities.js y preview/assets/js/photos.js
- Monumentos del catálogo: 51.
- Fichas con dos URLs elegidas manualmente: 14.
- Fichas sin pareja de URLs elegidas manualmente: 37.
- Las 14 parejas existentes tampoco se han certificado en bloque mediante inspección visual, resolución, disponibilidad y licencia individual.
- Antes de esta auditoría 19 de las 37 fichas carecían incluso de título Wikipedia específico; se agregaron sus correspondencias para mejorar la imagen de respaldo, sin presentarlas como dos fotografías certificadas.
- Los identificadores genéricos de Unsplash compartidos por ciudad en cities.js siguen presentes como respaldo provisional. NO cumplen el requisito de exactitud del monumento.
- No se han insertado fotografías inventadas, de Unsplash+ ni enlaces de Commons no comprobados en las 37 fichas.

## Las 37 fichas pendientes
1. Castillo de Sant'Angelo
2. Catedral de Milán
3. Palacio Real
4. Puerta de Alcalá
5. Palacio de Cristal
6. Templo de Debod
7. Alhambra
8. Torre Eiffel
9. Arco del Triunfo
10. Catedral de Notre-Dame
11. Basílica del Sacré-Cœur
12. Museo del Louvre
13. Palacio de Versalles
14. Templo de Zeus Olímpico
15. Odeón de Herodes Ático
16. Templo de Apolo
17. Palacio de Westminster
18. Tower Bridge
19. Abadía de Westminster
20. Catedral de San Pablo
21. Termas romanas
22. Puerta de Brandeburgo
23. Catedral de Berlín
24. Edificio del Reichstag
25. Memorial del Holocausto
26. Catedral de Colonia
27. Torre de Belém
28. Monasterio de los Jerónimos
29. Castillo de San Jorge
30. Elevador de Santa Justa
31. Puente Don Luis I
32. Obelisco
33. Teatro Colón
34. Casa Rosada
35. Palacio Barolo
36. Congreso de la Nación Argentina
37. Puente de la Mujer

## Cambios efectivamente realizados
- Se agregaron 19 títulos de Wikipedia específicos en photos.js para que las imágenes de respaldo de esos monumentos no dependan exclusivamente de las fotos genéricas de ciudad.
- Se actualizó el cachebuster de photos.js en preview/index.html.
- No se tocó el repositorio estable.
- Las 37 parejas de fotos NO se han cargado; no declarar la tarea completada.

## Para cerrar la tarea
Seleccionar 74 fotografías concretas; revisar visualmente cada una contra el monumento correcto; verificar resolución, enlace, fuente, licencia y autor; registrar metadatos y luego cargar las parejas en curated de photos.js. Ejecutar control de 102 fotos y prueba visual en Safari/iPhone. Auditar además las 28 URLs ya seleccionadas.
