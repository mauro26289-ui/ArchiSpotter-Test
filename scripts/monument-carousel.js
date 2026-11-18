// Funciones originales extraídas de app.js, sin alterar su lógica.
        function renderCarouselSlides(m) {
            const container = document.getElementById('carousel-slides');
            const dotsContainer = document.getElementById('carousel-dots');

            container.innerHTML = (m.images || []).map((url, idx) => `
                <div class="w-full h-full flex-shrink-0 relative">
                    <img ${idx === 0 ? `src="${url}"` : `data-pending-src="${url}"`} data-monument-id="${m.id}" data-active-image="${url}" onerror="handleMonumentImageError(this)" loading="${idx === 0 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${idx === 0 ? 'high' : 'low'}" alt="${m.name}" class="w-full h-full object-cover">
                </div>
            `).join('');

            dotsContainer.innerHTML = (m.images || []).map((_, idx) => `
                <div class="w-2 h-2 rounded-full transition ${idx === 0 ? 'bg-amber-400 w-4' : 'bg-slate-600'}"></div>
            `).join('');

            container.style.transform = `translateX(0%)`;
        }

        function updateCarouselPosition() {
            const m = activeMonumentForModal;
            if (!m) return;
            const container = document.getElementById('carousel-slides');
            const dots = document.getElementById('carousel-dots').children;

            // E114: request a gallery image only when its slide is actually shown.
            // Previously all src attributes were assigned at once, potentially
            // starting network requests for every off-screen slide on iOS.
            const activeSlide = container.children[currentSlideIndex];
            const activeImage = activeSlide && activeSlide.querySelector('img[data-pending-src]');
            if (activeImage) {
                const pendingUrl = activeImage.getAttribute('data-pending-src');
                if (pendingUrl) {
                    activeImage.src = pendingUrl;
                    activeImage.removeAttribute('data-pending-src');
                }
            }
            container.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            for (let i = 0; i < dots.length; i++) {
                if (i === currentSlideIndex) {
                    dots[i].className = 'w-4 h-2 rounded-full bg-amber-400 transition';
                } else {
                    dots[i].className = 'w-2 h-2 rounded-full bg-slate-600 transition';
                }
            }
        }

        function prevSlide() {
            triggerHaptic();
            const m = activeMonumentForModal;
            if (!m || !m.images) return;
            currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : m.images.length - 1;
            updateCarouselPosition();
        }

        function nextSlide() {
            triggerHaptic();
            const m = activeMonumentForModal;
            if (!m || !m.images) return;
            currentSlideIndex = (currentSlideIndex < m.images.length - 1) ? currentSlideIndex + 1 : 0;
            updateCarouselPosition();
        }

