# ArchiSpotter-Test — Etapa 3: estabilidad y rendimiento móvil
Fecha: 2026-11-22
Ámbito: repositorio de pruebas, /preview/, especialmente Safari/iPhone y gestos interactivos.
Estado: auditoría estática y correcciones conservadoras completadas; validación dinámica en iPhone pendiente.

## Criterios no negociables
- No modificar el repositorio estable mauro26289-ui/ArchiSpotter.
- Mantener 51 monumentos, ES/EN/IT, favoritos, Mi viaje, mapas y audioguías.
- Un gesto de ArchiSpotter sigue el dedo en tiempo real; no basta cambiar la pantalla al soltar.
- No borrar contenido, modificar credenciales ni migrar localStorage en esta etapa.

## Revisión por módulo
- app.js: inicio tras carga, entrada condicionada por sesión local; no se añadió inicialización repetida.
- navigation.js: gesto de volver atrás con transform durante touchmove, preview de pantalla previa; temporizador de finalización de 190 ms. Riesgo identificado: si empezaba otro gesto antes de terminar el anterior, podía quedar una transición pendiente que disparara un click de volver. Corregido: cancelación del temporizador y restauración de estilos, además de cancelar al ocultar la página.
- monuments.js: swipe de fotos con dos imágenes que siguen el dedo, umbral de confirmación y retorno animado; temporizador de galería protegido en etapa 2 frente a cambios de monumento. Requiere prueba de gesto repetido, vertical scroll y zoom.
- gallery.js: visor ampliado con pointer events, zoom, pan y límites de escala. No se cambió su comportamiento sin pruebas.
- map.js: Leaflet se inicializa una vez y reutiliza instancia; se llamaba invalidateSize en cada show() mediante timers sin cancelar. Corregido: coalescer timer, cancelar el anterior y comprobar que el panel del mapa sigue visible antes de invalidar tamaño.
- photos.js: registro de imágenes, caché y protección de respuesta tardía mediante WeakMap. No se sustituyeron URLs sin validación visual.
- saved.js: mantiene favoritos y Mi viaje sin migraciones; los eventos se registran al cargar el módulo.
- auth.js: persistencia local de prototipo; sin cambios.
- preview/index.html: eliminación de texto fijo «48 monumentos» en la nota del mapa; total dinámico existente en map.js. Cachebusters de scripts actualizados.

## Cambios concretos
1. preview/assets/js/navigation.js: cancelSettle(), settlingGesture, limpieza de estilos al cancelar; visibilitychange.
2. preview/assets/js/map.js: mapResizeTimer, coalescencia de invalidateSize y comprobación de panel visible.
3. preview/index.html: cachebuster de ambos módulos y corrección de nota obsoleta del mapa.
4. Este documento de auditoría.

## Validación de repositorio
- No se tocó el repositorio estable.
- Se verificaron los módulos y rutas modificados por lectura directa en GitHub.
- El workflow 'Audit ArchiSpotter preview' ha tenido ejecuciones exitosas en GitHub Actions; la ejecución correspondiente al último commit puede estar todavía en cola al redactar este documento. No se atribuye su resultado a una ejecución anterior.
- La auditoría automática revisa sintaxis JS, referencias locales y consistencia editorial; no simula gestos ni renderizado real.

## Matriz de pruebas manuales pendiente — Safari/PWA iPhone
1. Abrir Suiza > Veytaux > Castillo de Chillon: deslizar foto a media distancia y soltar; debe regresar si no alcanza umbral.
2. Deslizar foto completamente y regresar; la foto debe acompañar el dedo, sin parpadeos ni abrir el visor accidentalmente.
3. Deslizar desde el borde izquierdo: la pantalla previa acompaña el dedo; cancelar a mitad de camino y repetir rápidamente.
4. Abrir ficha, volver atrás, abrir otra y repetir rápido; no debe aparecer contenido anterior superpuesto.
5. Abrir mapa, cambiar pestañas rápidamente 10 veces; sin mapa en blanco, mosaicos repetidos ni pérdida de pines.
6. Abrir y cerrar visor ampliado y probar zoom/pan; sin pérdida de scroll ni gestos bloqueados.
7. Reproducir audioguía, pausar y cambiar de monumento; no debe reproducir contenido de la ficha anterior.
8. Cambiar ES/EN/IT y claro/oscuro, reiniciar la PWA; mantener sesión y favoritos.
9. Probar Wi-Fi lento / modo avión y volver a conectarse; observar fallos de recursos y recuperación.
10. Repetir pruebas en Safari y PWA instalada; comparar el comportamiento bajo la Dynamic Island.

## Limitaciones explícitas
No se realizaron mediciones de FPS, memoria, Web Inspector, Lighthouse ni pruebas automatizadas de navegador real. No es correcto declarar «certificación completa en iPhone» sin esos datos. La auditoría detecta y reduce riesgos de carreras temporales y trabajo innecesario, pero no demuestra todavía mejoras cuantificadas de rendimiento.

## Siguiente decisión
Después de confirmar los gestos y mapa en el iPhone, priorizar instrumentación de rendimiento y recuperación de imágenes/audio; no realizar refactorizaciones grandes sin pruebas de regresión.
