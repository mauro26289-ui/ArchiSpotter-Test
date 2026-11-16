// Reglas puras del gesto horizontal del visor (extraídas de app.js).
// No modifican el DOM, el zoom ni la navegación.
function archiShouldTrackLightboxSwipe(dx, dy) {
    return Math.abs(dx) > Math.abs(dy) * 1.1 && Math.abs(dx) > 6;
}

function archiShouldChangeLightboxImage(dx, dy, elapsed, imageCount) {
    return Math.abs(dx) >= 55 &&
        Math.abs(dx) > Math.abs(dy) * 1.2 &&
        elapsed < 1200 &&
        imageCount > 1;
}
