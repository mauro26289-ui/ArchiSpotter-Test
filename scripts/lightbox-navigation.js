// Navegación de imágenes del visor. Funciones originales sin cambios.

        function updateLightboxView() {
            const img = document.getElementById('lightbox-img');
            img.style.objectPosition = '50% 50%';
            img.dataset.monumentId = activeMonumentForModal?.id || '';
            img.dataset.fallbackDone = 'false';
            img.dataset.triedImages = '';
            img.dataset.activeImage = lightboxImages[lightboxCurrentIdx];
            img.onerror = () => handleMonumentImageError(img);
            img.src = lightboxImages[lightboxCurrentIdx];
            document.getElementById('lightbox-counter').textContent = `${lightboxCurrentIdx + 1} / ${lightboxImages.length}`;
            resetLightboxZoom();
        }

        function prevLightboxImage() {
            triggerHaptic();
            lightboxCurrentIdx = (lightboxCurrentIdx > 0) ? lightboxCurrentIdx - 1 : lightboxImages.length - 1;
            updateLightboxView();
        }

        function nextLightboxImage() {
            triggerHaptic();
            lightboxCurrentIdx = (lightboxCurrentIdx < lightboxImages.length - 1) ? lightboxCurrentIdx + 1 : 0;
            updateLightboxView();
        }
