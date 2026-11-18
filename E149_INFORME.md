# E149 — Protección del listado de monumentos cercanos

El selector de los seis monumentos cercanos ignora resultados de distancia no finitos (NaN o infinito) o negativos. Conserva el orden, la selección y los desempates para distancias válidas. No cambia el GPS, el mapa, los datos de monumentos, los favoritos, Mi viaje ni el pasaporte.

Validaciones: casos de distancias válidas e inválidas; sintaxis de todos los JavaScript; referencias de scripts locales; ZIP íntegro y límite de archivos. Las pruebas en iPhone corresponden al usuario.
