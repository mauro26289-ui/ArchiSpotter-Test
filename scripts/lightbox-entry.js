// Funciones extraídas de app.js sin alterar su implementación.
        function openFullscreenLightbox(idx) {
            triggerHaptic();
            const m = activeMonumentForModal;
            if (!m) return;

            lightboxImages = Array.isArray(m.images) ? m.images.slice() : [];
            
            lightboxCurrentIdx = idx;
            document.getElementById('lightbox-caption').textContent = m.name;

            updateLightboxView();
            initLightboxInteractions();

            const lightbox = document.getElementById('fullscreen-lightbox');
            // Sacar el visor del contenedor #app (overflow:hidden y contextos de apilamiento).
            // Así queda por encima de la ficha y del mapa, incluso en Safari para iPhone.
            if (lightbox && lightbox.parentElement !== document.body) {
                document.body.appendChild(lightbox);
            }
            if (lightbox) lightbox.classList.remove('hidden');
        }

        function closeFullscreenLightbox() {
            triggerHaptic();
            document.getElementById('fullscreen-lightbox').classList.add('hidden');
            resetLightboxZoom();
        }

