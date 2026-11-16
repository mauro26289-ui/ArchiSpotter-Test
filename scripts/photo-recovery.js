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
        window.addEventListener('online', archiRecoverVisiblePhotos);
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) archiRecoverVisiblePhotos();
        });

