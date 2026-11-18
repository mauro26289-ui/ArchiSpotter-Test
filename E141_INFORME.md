# E141 — Auditoría funcional de persistencia del pasaporte

- La lectura de sellos del pasaporte reutiliza `archiReadSavedIdList`, ya empleado para favoritos y Mi viaje. Mantiene la deduplicación, filtra entradas que no sean cadenas y devuelve una lista vacía ante JSON inválido o almacenamiento inaccesible.
- No se modifican los datos editoriales, la interfaz, el mapa OpenStreetMap, GPS, el icono ni las rutas.
- Comprobación estática de los 85 JavaScript, referencias de scripts locales y ZIP; falta validación en iPhone y pruebas funcionales completas de la v1.0.
