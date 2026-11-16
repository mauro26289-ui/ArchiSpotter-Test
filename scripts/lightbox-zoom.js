// Etapa 47: controles del zoom del visor de fotografías.
function zoomInLightbox() {
            lightboxScale = Math.min(lightboxScale + 0.5, 4);
            applyLightboxTransform();
        }

        function zoomOutLightbox() {
            lightboxScale = Math.max(lightboxScale - 0.5, 1);
            if (lightboxScale === 1) { lightboxPanX = 0; lightboxPanY = 0; }
            applyLightboxTransform();
        }

        function resetLightboxZoom() {
            lightboxScale = 1;
            lightboxPanX = 0;
            lightboxPanY = 0;
            applyLightboxTransform();
        }

        function applyLightboxTransform() {
            const img = document.getElementById('lightbox-img');
            if (img) {
                img.style.transform = `translate(${lightboxPanX}px, ${lightboxPanY}px) scale(${lightboxScale})`;
            }
        }
