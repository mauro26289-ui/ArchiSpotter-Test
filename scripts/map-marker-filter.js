// Filtrado de monumentos con coordenadas válidas para el mapa.
// Se conserva la condición original, incluida la búsqueda textual.
function archiMapMarkerMatches(m, q) {
    return m && m.coords &&
        m.coords.lat !== null && m.coords.lat !== undefined && String(m.coords.lat).trim() !== '' &&
        m.coords.lng !== null && m.coords.lng !== undefined && String(m.coords.lng).trim() !== '' &&
        Number.isFinite(Number(m.coords.lat)) &&
        Number.isFinite(Number(m.coords.lng)) &&
        Math.abs(Number(m.coords.lat)) <= 90 &&
        Math.abs(Number(m.coords.lng)) <= 180 &&
        (!q || archiMonumentMatchesSearch(m, archiNormalizeSearch(q), englishNames, italianNames, englishStyles, italianStyles) || archiNormalizeSearch([m.city,m.country].join(' ')).includes(archiNormalizeSearch(q)));
}
