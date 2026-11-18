# Etapa 142 — Auditoría de recuperación de fotografías

- Se cancela el `requestAnimationFrame` pendiente de recuperación de fotografías al ocultar o abandonar la PWA.
- Al regresar a primer plano, la recuperación se puede programar nuevamente, sin dejar el indicador de tarea pendiente bloqueado.
- No se cambian los datos, imágenes originales, diseño, mapa, GPS, rutas, idiomas ni persistencia.
- Validaciones estáticas: sintaxis JS, referencias locales de scripts, ZIP íntegro. Falta prueba funcional en iPhone, en particular recuperación de fotografías tras desconexión.
