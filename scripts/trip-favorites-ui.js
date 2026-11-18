// Funciones originales extraídas de app.js, sin cambios de lógica.
        // V23: Mi viaje. Validar primero; guardar y renderizar sin afectar el arranque.
        function addToTrip(id) {
            const monument = monumentsData.find(m => m.id === id);
            if (!monument) { showToast(tr('Monumento no encontrado','Monument not found')); return; }
            if (tripMonumentIds.includes(id)) { showToast(tr('Ya está en Mi viaje','Already in My trip')); return; }
            const updated = [...tripMonumentIds, id];
            if (!archiStorageSet('archispotter_trip', JSON.stringify(updated))) return;
            tripMonumentIds = updated;
            showToast(appLanguage === 'it' ? 'Aggiunto al mio viaggio' : tr('Añadido a Mi viaje','Added to My trip'));
            try { renderTrip(); } catch(error) { console.error('ArchiSpotter: error actualizando Mi viaje', error); }
        }
        function removeTripStop(id) {
            const updated = tripMonumentIds.filter(x => x !== id);
            if (!archiStorageSet('archispotter_trip', JSON.stringify(updated))) return;
            tripMonumentIds = updated;
            renderTrip();
        }
        function clearTrip() {
            if (!archiStorageSet('archispotter_trip','[]')) return;
            tripMonumentIds = [];
            renderTrip();
        }
        function openTripDirections(){mapsDirectionsFor(tripMonumentIds.map(id=>monumentsData.find(m=>m.id===id)).filter(m=>m&&m.coords));}
        function visualCard(m){const img=(Array.isArray(m.images)&&m.images[0])||architecturePlaceholder();return `<article class="visual-card surface-card overflow-hidden rounded-xl border border-slate-800 bg-slate-900"><button onclick="openMonumentById('${m.id}')" class="block w-full text-left"><img src="${img}" data-monument-id="${m.id}"  onerror="handleMonumentImageError(this)" alt="${m.name}" loading="lazy" decoding="async" fetchpriority="low"><div class="p-2"><strong class="block text-xs text-white leading-snug">${monumentLabel(m)}</strong><span class="block text-[10px] text-slate-400 mt-1">${cityLabel(m.city)} · ${styleLabel(m.style||tr("Arquitectura","Architecture"))}</span></div></button><div class="px-2 pb-2 flex items-center gap-2"><button onclick="addToTrip('${m.id}')" class="text-[10px] text-amber-400">+ ${tr("Mi viaje","My trip")}</button><button type="button" onclick="toggleFavorite('${m.id}')" class="archi-favorite-toggle text-rose-500" aria-pressed="${isFavorite(m.id)}" aria-label="${isFavorite(m.id)?(appLanguage==='it'?'Rimuovi dai preferiti':appLanguage==='en'?'Remove from favorites':'Quitar de favoritos'):(appLanguage==='it'?'Aggiungi ai preferiti':appLanguage==='en'?'Add to favorites':'Agregar a favoritos')}" title="${isFavorite(m.id)?tr('Quitar de favoritos','Remove from favorites'):tr('Agregar a favoritos','Add to favorites')}"><i class="${isFavorite(m.id)?'fa-solid':'fa-regular'} fa-heart" aria-hidden="true"></i></button></div></article>`;}
        function renderTrip() {
            const box = document.getElementById('trip-stops');
            if (!box) return;
            const list = archiResolveMonumentIds(tripMonumentIds, monumentsData);
            const count = document.getElementById('trip-count');
            if (count) count.textContent = `${list.length} ${tr('paradas','stops')}`;
            box.innerHTML = list.length ? list.map((m,i) => `<div class="flex items-center gap-2 text-xs"><span class="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center">${i+1}</span><button type="button" class="flex-1 text-left text-white" onclick="openMonumentById('${m.id}')">${monumentLabel(m)}<small class="block text-slate-400">${cityLabel(m.city)}</small></button><button type="button" onclick="removeTripStop('${m.id}')" class="text-rose-400 px-2" aria-label="${tr('Quitar','Remove')} ${monumentLabel(m)}">×</button></div>`).join('') : `<p class="text-xs text-slate-400">${tr('Añade monumentos desde sus fichas o desde las tarjetas visuales.','Add monuments from their details or visual cards.')}</p>`;
            const directions = document.getElementById('trip-directions');
            if (directions) directions.classList.toggle('hidden', list.length < 2);
            const grid = document.getElementById('trip-visual-grid');
            if (grid) grid.innerHTML = archiTripVisualMonuments(list, monumentsData).map(visualCard).join('');
        }
        function renderFavorites(){const box=document.getElementById('favorites-grid');if(!box)return;const list=archiResolveMonumentIds(favoriteMonuments, monumentsData);box.innerHTML=list.length?list.map(visualCard).join(''):`<p class="col-span-2 text-xs text-slate-400 rounded-xl border border-dashed border-slate-700 p-4">${tr("Todavía no tienes favoritos. Guarda monumentos con el icono de corazón en sus fichas.","You have no favorites yet. Save monuments using the heart icon in their details.")}</p>`;}

