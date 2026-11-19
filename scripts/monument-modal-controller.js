// Extraído sin alterar la lógica de la etapa 85.
        function openMonumentModal(id) {
            archiRememberExploreScroll('monuments');
            triggerHaptic();
            stopAudioGuide();
            activeMonumentForModal = monumentsData.find(m => m.id === id);
            if (!activeMonumentForModal) return;

            const m = activeMonumentForModal;
            document.getElementById('monument-modal').classList.toggle('vb4-italy-modal', m.country === 'Italia');
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


        function closeModal() {
            triggerHaptic();
            stopAudioGuide();
            document.getElementById('monument-modal').classList.add('hidden');
        }

