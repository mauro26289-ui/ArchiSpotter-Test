# ArchiSpotter E127 — estabilidad al salir de la PWA

Base: E126. Se cancela el temporizador pendiente de actualización del mapa al recibir `pagehide`, evitando operaciones Leaflet diferidas al salir a Google Maps o suspender la PWA. No se altera el estado del GPS, las rutas, las imágenes ni los monumentos.

Pruebas estáticas: sintaxis de todos los JS, integridad del ZIP, recuento de archivos y conservación exacta del catálogo y estilos. Pendiente: validación funcional en iPhone.
