// Distancia geográfica en kilómetros, sin dependencias del DOM.
// Fórmula y constante (radio terrestre 6371 km) conservadas de app.js.
function archiDistanceKm(a,b) {
    const rad=x=>x*Math.PI/180, dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng), x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
    return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
