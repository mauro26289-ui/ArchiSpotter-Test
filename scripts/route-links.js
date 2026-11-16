// Construcción de enlaces de rutas a pie; formato idéntico a etapa 42.
function archiWalkingDirectionsUrl(list) {
    const pts = list.map(m => `${m.coords.lat},${m.coords.lng}`);
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(pts[0])
        + '&destination=' + encodeURIComponent(pts[pts.length - 1])
        + '&waypoints=' + encodeURIComponent(pts.slice(1, -1).join('|'))
        + '&travelmode=walking';
}

// En iOS instalado como PWA, window.open(_blank) puede dejar una ventana
// intermedia en blanco al regresar desde Google Maps. Navegamos en la misma
// ventana para evitar crear ese contexto adicional.
function openArchiExternalMaps(url) {
    if (typeof url !== 'string' || !/^https:\/\/www\.google\.com\/maps\/dir\//.test(url)) {
        throw new Error('Invalid Google Maps directions URL');
    }
    window.location.assign(url);
}
