// Selección de los seis monumentos más próximos al GPS.
// Preserva el filtro, la fórmula y el orden de la implementación anterior.
function archiNearestMonuments(monumentsData, userLat, userLng, distanceKm) {
    return monumentsData.filter(m=>m.coords)
        .map(m=>({...m,km:distanceKm({lat:userLat,lng:userLng},{lat:m.coords.lat,lng:m.coords.lng})}))
        .sort((a,b)=>a.km-b.km)
        .slice(0,6);
}
