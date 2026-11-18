// Funciones originales extraídas de app.js, sin alterar su lógica.
        function stampPassport() {
            triggerHaptic();
            const m = activeMonumentForModal;
            if (!m) return;

            if (!stampedPassports.includes(m.id)) {
                const nextStamps = [...stampedPassports, m.id];
                if (!archiStorageSet('archispotter_stamps', JSON.stringify(nextStamps))) return;
                stampedPassports = nextStamps;
                updatePassportBadgeCount();
                showToast(`${tr("¡Sello de","Stamp for")} ${monumentLabel(m)} ${tr("estampado!","collected!")} 🛂`);
            } else {
                showToast(tr("Ya habías estampado este sello previamente","You already collected this stamp"));
            }
        }

        function updatePassportBadgeCount() {
            const countEl = document.getElementById('passport-badge-count');
            if (countEl) {
                countEl.textContent = stampedPassports.length;
            }
        }

        function openPassportModal() {
            triggerHaptic();
            const grid = document.getElementById('passport-stamps-grid');
            const rankEl = document.getElementById('passport-rank');

            const totalStamps = stampedPassports.length;
            if (totalStamps >= 8) rankEl.textContent = tr("Nivel: Maestro Arquitecto 🏛️","Level: Master Architect 🏛️");
            else if (totalStamps >= 4) rankEl.textContent = tr("Nivel: Explorador Urbano 🧭","Level: Urban Explorer 🧭");
            else if (totalStamps >= 1) rankEl.textContent = tr("Nivel: Turista Curioso 🎒","Level: Curious Tourist 🎒");
            else rankEl.textContent = tr("Nivel: Principiante 👣","Level: Beginner 👣");

            const userStampedMonuments = monumentsData.filter(m => stampedPassports.includes(m.id));

            if (userStampedMonuments.length === 0) {
                grid.className = 'grid grid-cols-1 gap-2.5';
                grid.innerHTML = `
                    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
                        <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
                            <i class="fa-solid fa-compass-drafting text-xl"></i>
                        </div>
                        <h4 class="font-serif font-bold text-sm text-slate-200">${tr("Pasaporte Vacío","Empty passport")}</h4>
                        <p class="text-xs text-slate-400 leading-relaxed">
                            ${tr("Aún no tienes ningún sello. Explorá los monumentos en la app y tocá Estampar Sello para armar tu colección de viajes.","You have no stamps yet. Explore monuments and tap Collect stamp to build your travel collection.")}
                        </p>
                    </div>
                `;
            } else {
                grid.className = 'grid grid-cols-2 gap-2.5';
                grid.innerHTML = userStampedMonuments.map(m => `
                    <div class="bg-slate-950 border border-amber-500/40 rounded-xl p-3 flex flex-col items-center text-center space-y-1.5 relative overflow-hidden group">
                        <div class="absolute -right-3 -bottom-3 opacity-10 text-amber-500 text-4xl">
                            <i class="fa-solid fa-stamp"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
                            <img src="${m.images[0]}" data-monument-id="${m.id}"  onerror="handleMonumentImageError(this)" alt="${m.name}" loading="lazy" decoding="async" fetchpriority="low" class="w-full h-full object-cover">
                        </div>
                        <span class="font-serif font-bold text-[11px] text-slate-100 line-clamp-1">${monumentLabel(m)}</span>
                        <span class="text-[9px] text-amber-400 font-medium">${cityLabel(m.city)}, ${countryLabel(m.country)}</span>
                    </div>
                `).join('');
            }

            const passport = document.getElementById('passport-modal');
            // Portal: fuera de #app, que crea un contexto de apilamiento propio.
            if (passport.parentElement !== document.body) document.body.appendChild(passport);
            passport.classList.remove('hidden');
            passport.setAttribute('aria-hidden', 'false');
        }

        function closePassportModal() {
            triggerHaptic();
            const passport = document.getElementById('passport-modal');
            passport.classList.add('hidden');
            passport.setAttribute('aria-hidden', 'true');
        }

