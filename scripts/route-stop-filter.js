// Regla de filtrado de paradas para el selector de rutas.
// Misma condición que en app.js de la etapa 62.
function archiRouteStopMatches(m, q) {
    return m.coords && (`${m.name} ${m.city} ${m.country}`.toLowerCase().includes(q));
}
