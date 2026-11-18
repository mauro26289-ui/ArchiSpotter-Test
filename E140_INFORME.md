# E140 — Auditoría de reanudación del mapa

Se elimina un segundo listener `visibilitychange` en `gps-map-controller.js` que programaba un `invalidateSize()` adicional al regresar del segundo plano. El listener de `tab-navigation.js` ya cubre el caso, comprueba que el mapa esté visible y evita la actualización mientras la página está oculta. Se conserva el listener `online` y la inicialización original del mapa.

No se modifica la capa OpenStreetMap restaurada en E139, ni los marcadores, GPS, datos, fotografías, estilos o icono. CARTO sigue desactivado.

Validación: referencias locales de scripts, sintaxis de todos los JS e integridad ZIP. La prueba funcional en iPhone sigue pendiente.
