# ArchiSpotter — Etapa 114: gestión de galerías

Base: E113. Optimización conservadora: en el carrusel de la ficha de monumento, solo la primera imagen recibe `src` durante el renderizado. Las demás conservan su URL en `data-pending-src` y se solicitan cuando el usuario llega a su diapositiva. Una imagen ya visitada mantiene su `src` para no solicitarla de nuevo al regresar.

No se modifican imágenes, monumentos, mapas, rutas, datos editoriales, viewport ni CSS. Se actualiza la referencia de caché del módulo de carrusel en `index.html`.

Comprobar en iPhone: abrir ficha, primera imagen, avanzar y retroceder varias veces, cerrar y reabrir, navegación, zócalo. La mejora de memoria y red requiere medición en dispositivo; no se afirma que esté demostrada.
