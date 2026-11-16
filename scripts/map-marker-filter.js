// Filtrado de monumentos con coordenadas válidas para el mapa.
// Se conserva la condición original, incluida la búsqueda textual.
function archiMapMarkerMatches(m, q) {
    return m.coords &&
        Number.isFinite(Number(m.coords.lat)) &&
        Number.isFinite(Number(m.coords.lng)) &&
        (!q || archiMonumentMatchesSearch(m, archiNormalizeSearch(q), englishNames, italianNames, englishStyles, italianStyles) || archiNormalizeSearch([m.city,m.country].join(' ')).includes(archiNormalizeSearch(q)));
}
