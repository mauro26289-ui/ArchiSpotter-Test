# Etapa 143 — Auditoría de coordenadas del mapa

- El filtro de marcadores exige latitud entre -90 y 90 y longitud entre -180 y 180, además de valores numéricos finitos.
- No se cambian las coordenadas ni los datos de los 110 monumentos.
- Se mantiene OpenStreetMap como mapa activo; CARTO permanece desactivado.
- Se comprueba sintaxis de todos los JS, referencias locales, ZIP y pruebas unitarias del filtro.
- La prueba en iPhone sigue siendo necesaria.
