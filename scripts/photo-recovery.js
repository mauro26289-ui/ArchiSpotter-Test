// Bloque original de app.js, extraído sin cambiar su implementación.
        // Recuperación conservadora de fotos Unsplash al volver la conexión.
        // Solo intenta imágenes visibles con respaldo, una vez por elemento.
        // No altera imágenes curadas ni cambia de proveedor.
        function archiRecoverVisiblePhotos() {
            if (!navigator.onLine) return;
            document.querySelectorAll('img.image-placeholder[data-original-photo]').forEach(function(img) {
                if (!img.isConnected || img.dataset.onlineRecoveryTried === 'true') return;
                const rect = img.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > window.innerHeight) return;
                const original = img.dataset.originalPhoto;
                if (!original || !original.startsWith('https://images.unsplash.com/')) return;
                img.dataset.onlineRecoveryTried = 'true';
                img.dataset.fallbackDone = 'false';
                img.dataset.photoAttempt = '0';
                img.classList.remove('image-placeholder');
                img.src = original;
            });
        }
        // E124: when connectivity returns, offscreen fallback photos may become visible
        // later without another 'online' event. Retry only after scrolling settles
        // into the next animation frame; each image is attempted at most once.
        let archiPhotoRecoveryFrame = null;
        function archiScheduleVisiblePhotoRecovery() {
            if (!navigator.onLine || document.hidden || archiPhotoRecoveryFrame !== null) return;
            archiPhotoRecoveryFrame = requestAnimationFrame(function() {
                archiPhotoRecoveryFrame = null;
                archiRecoverVisiblePhotos();
            });
        }
        window.addEventListener('online', archiScheduleVisiblePhotoRecovery);
        window.addEventListener('scroll', archiScheduleVisiblePhotoRecovery, { passive: true, capture: true });
        window.addEventListener('pageshow', archiScheduleVisiblePhotoRecovery);
        // E142: no conservar una recuperación pendiente mientras la PWA está oculta.
        function archiCancelPendingPhotoRecovery() {
            if (archiPhotoRecoveryFrame !== null) {
                cancelAnimationFrame(archiPhotoRecoveryFrame);
                archiPhotoRecoveryFrame = null;
            }
        }
        window.addEventListener('pagehide', archiCancelPendingPhotoRecovery);
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) archiCancelPendingPhotoRecovery();
            else archiScheduleVisiblePhotoRecovery();
        });

