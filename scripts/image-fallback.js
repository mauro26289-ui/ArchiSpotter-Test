/* V26: funciones de respaldo para imágenes de monumentos. */
        // E120: cache the identical fallback data URI instead of rebuilding and
        // URL-encoding the same SVG for every failed photograph.
        let archiCachedArchitecturePlaceholder = null;
        function architecturePlaceholder() {
            if (archiCachedArchitecturePlaceholder) return archiCachedArchitecturePlaceholder;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#0f172a"/><g fill="none" stroke="#f59e0b" stroke-width="12"><path d="M110 390V210h580v180M80 390h640M150 210v-60h500v60M205 210v180m130-180v180m130-180v180m130-180v180M110 150l290-95 290 95"/></g><text x="400" y="455" text-anchor="middle" fill="#cbd5e1" font-family="Arial,sans-serif" font-size="24">Foto no disponible</text></svg>`;
            archiCachedArchitecturePlaceholder = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            return archiCachedArchitecturePlaceholder;
        }
        // Retry the original curated Unsplash photo with a simpler URL before falling back.
        // Never replace curated photos with another photo provider.
        function handleMonumentImageError(img) {
            if (!img || img.dataset.fallbackDone === 'true') return;
            if ((img.getAttribute('src') || '').startsWith('data:image/')) {
                img.dataset.fallbackDone = 'true';
                return;
            }
            const original = img.dataset.originalPhoto || img.getAttribute('src') || '';
            if (!img.dataset.originalPhoto && original.startsWith('https://images.unsplash.com/')) {
                img.dataset.originalPhoto = original;
            }
            const attempt = Number(img.dataset.photoAttempt || '0');
            if (img.dataset.originalPhoto && attempt === 0) {
                img.dataset.photoAttempt = '1';
                const clean = img.dataset.originalPhoto.split('?')[0];
                img.src = clean + '?w=900&q=75&fit=crop';
                return;
            }
            if (img.dataset.originalPhoto && attempt === 1) {
                img.dataset.photoAttempt = '2';
                img.src = img.dataset.originalPhoto.split('?')[0];
                return;
            }
            img.dataset.fallbackDone = 'true';
            img.src = architecturePlaceholder();
            img.classList.add('image-placeholder');
            img.alt = (img.alt || 'Monumento') + ' — fotografía no disponible (verificar conexión a Unsplash)';
        }
