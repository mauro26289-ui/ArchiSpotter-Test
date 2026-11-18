// Código trasladado desde app.js, sin cambios funcionales.
        function renderMonuments() {
            const listContainer = document.getElementById('monuments-list');
            if (!listContainer) return;

            const searchInput = document.getElementById('search-input');
            const searchTerm = searchInput ? archiNormalizeSearch(searchInput.value) : '';

            let filtered = monumentsData.filter(m => m.country === selectedCountry && m.city === selectedCity);

            if (currentActiveStyle !== 'all') {
                filtered = filtered.filter(m => m.style.toLowerCase().includes(currentActiveStyle.toLowerCase()));
            }

            if (searchTerm) {
                filtered = filtered.filter(m => 
                    archiMonumentMatchesSearch(m, searchTerm, englishNames, italianNames, englishStyles, italianStyles)
                );
            }

            listContainer.innerHTML = filtered.map(m => `
                <div onclick="openMonumentModal('${m.id}')" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/40 transition cursor-pointer active:scale-[0.98] group">
                    <div class="relative h-44 w-full bg-slate-950 overflow-hidden">
                        <img src="${(m.images || [])[0] || architecturePlaceholder()}" data-monument-id="${m.id}" onerror="handleMonumentImageError(this)" loading="lazy" decoding="async" fetchpriority="low" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                        <span class="monument-style-badge absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                            ${styleLabel(m.style)}
                        </span>
                    </div>
                    <div class="p-4 space-y-2">
                        <div class="flex items-center justify-between">
                            <h3 class="font-serif font-bold text-base text-slate-100 group-hover:text-amber-400 transition">${monumentLabel(m)}</h3>
                            <span class="text-[10px] text-slate-400">${localYear(m.year)}</span>
                        </div>
                        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">${monumentField(m,"history")}</p>
                    </div>
                </div>
            `).join('');
        }

