// Distancia geográfica en kilómetros, sin dependencias del DOM.
// Fórmula y constante (radio terrestre 6371 km) conservadas de app.js.
function archiDistanceKm(a,b) {
    const rad=x=>x*Math.PI/180, dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng), x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
    // E150: limitar el término haversine a [0, 1] evita NaN por redondeo en puntos antipodales.
    return 6371*2*Math.atan2(Math.sqrt(Math.min(1,Math.max(0,x))),Math.sqrt(1-Math.min(1,Math.max(0,x))));
}
