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

// Distancia entre dos contactos para el zoom por pellizco.
function archiGetPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}
