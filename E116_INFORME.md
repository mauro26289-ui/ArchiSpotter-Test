# ArchiSpotter E116 — Estabilidad de GPS

Base: E115 validada por el usuario en PWA instalada.

Cambios:
- Evita solicitudes de geolocalización duplicadas mientras una está pendiente.
- Timeout de 15 segundos para solicitudes GPS.
- Protege callbacks tardíos mediante identificador de solicitud.
- Elimina el marcador Leaflet de ubicación al desactivar GPS.
- Comprueba la existencia de nodos de interfaz antes de modificarlos.
- Actualiza únicamente el cache-buster del controlador GPS.

Sin cambios en datos, imágenes, mapa base, navegación, CSS, viewport o módulos restantes.

Validación estática: node --check en todos los JS, integridad ZIP.
Pendiente: prueba funcional en iPhone de activar/desactivar GPS y permisos.
