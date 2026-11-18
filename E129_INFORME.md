# ArchiSpotter E129

Mejora del ciclo de vida del mapa: cancelar refrescos pendientes cuando la PWA pasa a segundo plano (visibilitychange), además de pagehide. Al volver, si el mapa ya existe y sigue seleccionada su pestaña, ajustar el tamaño de Leaflet sin reinicializarlo. No se alteraron datos, estilos ni otras funciones.

Pruebas estáticas: node --check para todos los JS, integridad ZIP, máximo 100 archivos. Validación funcional en iPhone pendiente.
