// Extraído de app.js (E89); comportamiento original preservado.
        document.addEventListener('load', function(ev) {
            const img = ev.target;
            if (img && img.tagName === 'IMG' && img.dataset.monumentId && !img.classList.contains('image-placeholder')) {
                img.dataset.photoAttempt = '0';
            }
        }, true);



