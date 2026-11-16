// Resuelve IDs guardados a monumentos, preservando orden, duplicados y omitiendo IDs inexistentes.
// Misma semántica de map(find).filter(Boolean) usada en Mi viaje y Favoritos.
function archiResolveMonumentIds(ids, monuments) {
    return ids.map(id => monuments.find(m => m.id === id)).filter(Boolean);
}
