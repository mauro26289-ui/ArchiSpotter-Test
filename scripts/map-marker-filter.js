// Filtrado de monumentos con coordenadas válidas para el mapa.
// Se conserva la condición original, incluida la búsqueda textual.
function archiMapMarkerMatches(m, q) {
    return m.coords &&
        Number.isFinite(Number(m.coords.lat)) &&
        Number.isFinite(Number(m.coords.lng)) &&
        (!q || [m.name,m.city,m.country,m.style].join(' ').toLowerCase().includes(q));
}
