// Extraído de app.js en E73; lógica original sin cambios.
        function openMonumentModal(id) {
            archiRememberExploreScroll('monuments');
            triggerHaptic();
            stopAudioGuide();
            activeMonumentForModal = monumentsData.find(m => m.id === id);
            if (!activeMonumentForModal) return;

            const m = activeMonumentForModal;
            document.getElementById('modal-title').textContent = monumentLabel(m);
            const favBtn=document.getElementById('modal-favorite'); if(favBtn){favBtn.classList.toggle('is-favorite',isFavorite(m.id));favBtn.innerHTML=isFavorite(m.id)?'<i class="fa-solid fa-heart"></i>':'<i class="fa-regular fa-heart"></i>';}
            document.getElementById('modal-style').textContent = styleLabel(m.style);
            document.getElementById('modal-year').textContent = localYear(m.year);
            document.getElementById('modal-location').innerHTML = `<i class="fa-solid fa-location-dot text-amber-500 mr-1"></i> ${cityLabel(m.city)}, ${countryLabel(m.country)} ${getFlagForCountry(m.country, m.flag)}`;
            document.getElementById('modal-history').innerText = monumentField(m,"history");
            document.getElementById('modal-official-btn').href = m.ticketLink || '#';

            const secretBox = document.getElementById('modal-secret-container');
            if (m.secret) {
                document.getElementById('modal-secret-text').textContent = monumentField(m,'secret');
                secretBox.classList.remove('hidden');
            } else {
                secretBox.classList.add('hidden');
            }

            const archContainer = document.getElementById('modal-architecture');
            archContainer.innerHTML = architectureLabel(m).map(item => `
                <div class="flex items-start space-x-2">
                    <i class="fa-solid fa-check text-amber-500 text-[10px] mt-1"></i>
                    <span>${item}</span>
                </div>
            `).join('');
            translateOpenMonument(m);

            currentSlideIndex = 0;
            isSplendorView = false;
            setupSplendorComparison(m);
            renderCarouselSlides(m);
            renderInlineDescriptionGallery(m);

            document.getElementById('monument-modal').classList.remove('hidden');
        }

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

