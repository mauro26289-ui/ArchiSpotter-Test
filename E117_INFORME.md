# ArchiSpotter — Etapa 117

Base: E116. Corrección de dos incidencias comunicadas en iPhone.

- GPS: el apagado ya no depende de la bandera de solicitud pendiente; se elimina el marcador si está en el mapa, se limpian coordenadas y se actualiza la lista de cercanía.
- Google Maps: los enlaces de indicaciones de la ficha y del popup del mapa usan el mismo mecanismo de navegación que ya utilizaban las rutas, sin abrir una pestaña adicional con `_blank`.
- Sin cambios en los datos de monumentos, imágenes, CSS, viewport ni la navegación interna.

**Límite de validación:** pruebas estáticas y sintácticas; el comportamiento al regresar de Google Maps depende de iOS y debe verificarse en la PWA instalada.
