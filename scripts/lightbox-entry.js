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
            // Expandir el viewport al area de sistema solo mientras se muestra la foto.
            archiSetImmersivePhotoViewport(true);
            if (lightbox) lightbox.classList.remove('hidden');
        }

        function closeFullscreenLightbox() {
            triggerHaptic();
            document.getElementById('fullscreen-lightbox').classList.add('hidden');
            archiSetImmersivePhotoViewport(false);
            resetLightboxZoom();
        }


        // Modo pantalla llena por defecto; el usuario puede alternar sin recortar.
        function toggleLightboxFit() {
            const lightbox = document.getElementById('fullscreen-lightbox');
            if (!lightbox) return;
            const contained = lightbox.classList.toggle('archi-fit-contain');
            const button = document.getElementById('lightbox-fit-button');
            if (button) {
                button.setAttribute('aria-label', contained ? 'Llenar pantalla con fotografía' : 'Mostrar imagen completa');
                button.title = contained ? 'Llenar pantalla' : 'Mostrar imagen completa';
                const icon = button.querySelector('i');
                if (icon) icon.className = contained ? 'fa-solid fa-compress text-xs' : 'fa-solid fa-expand text-xs';
            }
            resetLightboxZoom();
        }

        // Mantener la geometria historica de ArchiSpotter fuera del visor.
        function archiSetImmersivePhotoViewport(enabled) {
            const meta = document.querySelector('meta[name="viewport"]');
            if (!meta) return;
            if (!meta.dataset.archiNormalViewport) meta.dataset.archiNormalViewport = meta.content;
            const normal = meta.dataset.archiNormalViewport;
            meta.content = enabled
                ? normal.replace(/viewport-fit=(?:auto|contain|cover)/, 'viewport-fit=cover')
                : normal;
            document.documentElement.classList.toggle('archi-photo-immersive', enabled);
        }
