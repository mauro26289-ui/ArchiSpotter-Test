// Código original extraído de app.js (etapa 68).
        function renderNavigationFlow() {
            const viewHome = document.getElementById('view-home');
            const viewCitiesContainer = document.getElementById('view-cities-container');
            const viewMonumentsContainer = document.getElementById('view-monuments-container');
            const breadcrumb = document.getElementById('nav-breadcrumb');

            if (!selectedCountry) {
                viewHome.classList.remove('hidden');
                viewCitiesContainer.classList.add('hidden');
                viewMonumentsContainer.classList.add('hidden');
                breadcrumb.classList.add('hidden');
                renderCountries();
            } else if (selectedCountry && !selectedCity) {
                viewHome.classList.add('hidden');
                viewCitiesContainer.classList.remove('hidden');
                viewMonumentsContainer.classList.add('hidden');
                breadcrumb.classList.remove('hidden');

                const flag = getFlagForCountry(selectedCountry);
                document.getElementById('selected-country-flag').textContent = flag;
                document.getElementById('selected-country-title').textContent = `${tr("Ciudades de","Cities in")} ${countryLabel(selectedCountry)}`;
                document.getElementById('breadcrumb-text').textContent = tr('Países','Countries');
                document.getElementById('breadcrumb-location').textContent = countryLabel(selectedCountry);
                renderCities();
            } else {
                viewHome.classList.add('hidden');
                viewCitiesContainer.classList.add('hidden');
                viewMonumentsContainer.classList.remove('hidden');
                breadcrumb.classList.remove('hidden');

                document.getElementById('breadcrumb-text').textContent = countryLabel(selectedCountry);
                document.getElementById('breadcrumb-location').textContent = cityLabel(selectedCity);
                renderMonuments();
            }
        }

        function renderCountries() {
            const container = document.getElementById('view-countries');
            if (!container) return;

            const countriesList = archiBuildCountryList(monumentsData, getFlagForCountry);

            container.innerHTML = countriesList.map(c => `
                <div onclick="selectCountry(${JSON.stringify(c.name).replace(/"/g,'&quot;')})" class="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 cursor-pointer transition active:scale-95 group shadow-md">
                    <span class="text-3xl group-hover:scale-110 transition duration-300">${c.flag}</span>
                    <div>
                        <h4 class="font-serif font-bold text-xs text-white group-hover:text-amber-400 transition">${countryLabel(c.name)}</h4>
                        <span class="text-[10px] text-slate-400 font-medium">${c.count} ${c.count === 1 ? tr('Monumento','Monument') : tr('Monumentos','Monuments')}</span>
                    </div>
                </div>
            `).join('');
        }

        function selectCountry(countryName) {
            archiRememberExploreScroll('countries');
            triggerHaptic();
            selectedCountry = countryName;
            selectedCity = null;
            renderNavigationFlow();
            const scroller=archiExploreScroller(); if(scroller)scroller.scrollTop=0;
        }

        function renderCities() {
            const container = document.getElementById('view-cities');
            if (!container) return;

            const filteredMonuments = monumentsData.filter(m => m.country === selectedCountry);
            const citiesList = archiBuildCityList(filteredMonuments, architecturePlaceholder);

            container.innerHTML = citiesList.map(c => `
                <div onclick="selectCity(${JSON.stringify(c.name).replace(/"/g,'&quot;')})" class="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition group">
                    <div class="flex items-center space-x-3 z-10">
                        <div class="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                            <img src="${c.image}" data-monument-id="${filteredMonuments.find(m => m.city === c.name)?.id || ''}" data-active-image="${c.image}" onerror="handleMonumentImageError(this)" loading="lazy" decoding="async" fetchpriority="low" alt="${tr("Arquitectura de","Architecture in")} ${cityLabel(c.name)}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                        </div>
                        <div>
                            <h4 class="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition">${cityLabel(c.name)}</h4>
                            <span class="text-[10px] text-slate-400">${c.count} ${c.count === 1 ? tr('Monumento','Monument') : tr('Monumentos','Monuments')}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-500 group-hover:text-amber-400 transition z-10"></i>
                </div>
            `).join('');
        }

        function selectCity(cityName) {
            archiRememberExploreScroll('cities');
            triggerHaptic();
            selectedCity = cityName;
            renderNavigationFlow();
            const scroller=archiExploreScroller(); if(scroller)scroller.scrollTop=0;
        }


        // iPhone-style edge back gesture and precise position restoration in Explore.
        const archiExploreScrollPositions = {countries:0, cities:0, monuments:0};
