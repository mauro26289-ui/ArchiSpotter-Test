// Funciones extraídas de app.js sin alterar su implementación.
        function renderInlineDescriptionGallery(m) {
            const galleryContainer = document.getElementById('modal-inline-gallery');
            if (!galleryContainer) return;

            const allImages = Array.isArray(m.images) ? m.images : [];

            galleryContainer.innerHTML = allImages.map((imgUrl, idx) => `
                <div onclick="openFullscreenLightbox(${idx})" class="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group shadow-md">
                    <img src="${imgUrl}" data-monument-id="${m.id}" data-active-image="${imgUrl}" onerror="handleMonumentImageError(this)" loading="lazy" decoding="async" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                    <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition"></div>
                    <div class="absolute bottom-1.5 right-1.5 bg-slate-900/80 backdrop-blur-sm text-amber-400 w-6 h-6 rounded-full flex items-center justify-center border border-amber-500/30 text-[10px]">
                        <i class="fa-solid fa-expand"></i>
                    </div>
                </div>
            `).join('');
        }

