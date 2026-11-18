# E139 — Recuperación del mapa

Se restaura OpenStreetMap como capa de fondo predeterminada. CARTO queda desactivado temporalmente: un mosaico con aviso de API key puede llegar como imagen HTTP 200 sin activar el evento tileerror de Leaflet.

Se preservan los marcadores, GPS, zoom, navegación, rutas, icono y datos editoriales. El archivo de configuración CARTO se mantiene para futuras pruebas, pero la clave no se utiliza en esta etapa.

Validaciones: sintaxis JavaScript, referencias de scripts, integridad ZIP. Prueba en iPhone pendiente.
