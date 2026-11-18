// Selección de los seis monumentos más próximos al GPS.
// Conserva los mismos resultados, distancias y desempates por orden original.
// E131: mantiene solo seis candidatos en vez de ordenar toda la colección.
function archiNearestMonuments(monumentsData, userLat, userLng, distanceKm) {
    const nearest = [];
    const origin = {lat:userLat,lng:userLng};
    for (const monument of monumentsData) {
        if (!monument.coords) continue;
        const km = distanceKm(
            origin,
            {lat:monument.coords.lat,lng:monument.coords.lng}
        );
        // Usar > (no >=) conserva el orden de entrada para distancias iguales.
        let pos = nearest.findIndex(item => item.km > km);
        if (pos === -1) pos = nearest.length;
        if (pos < 6) {
            nearest.splice(pos, 0, {...monument, km});
            if (nearest.length > 6) nearest.pop();
        }
    }
    return nearest;
}
