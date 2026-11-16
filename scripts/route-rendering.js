// Funciones originales extraídas de app.js, sin cambios de lógica.
        function renderWalkingRoutes() {
            const container = document.getElementById('routes-container');
            if (container) container.innerHTML = cityWalkingRoutes.map(r => `
                <div class="surface-card bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                    <div><span class="text-[10px] text-amber-400 font-bold uppercase">${cityLabel(r.cityName)}</span><h4 class="font-serif font-bold text-sm text-white">${tr(r.title,r.title==='Ruta Imperial por la Roma Antigua'?'Imperial Route through Ancient Rome':'Gaudí & Modernisme Route')}</h4><p class="text-[11px] text-slate-400">${r.stops.length} ${tr("paradas · recorrido sugerido","stops · suggested route")}</p></div>
                    <div class="space-y-1.5">${r.stops.map((stop,i)=>`<div class="route-stop text-xs text-slate-300"><span class="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-[10px] flex items-center justify-center">${i+1}</span>${stop}</div>`).join('')}</div>
                    <button onclick="openNamedRoute(${JSON.stringify(r.stops).replace(/"/g,'&quot;')})" class="w-full rounded-lg bg-slate-800 border border-slate-700 text-amber-300 text-xs py-2">${tr("Abrir indicaciones a pie","Open walking directions")}</button>
                </div>`).join('');
            renderRoutePicker();
        }

        function renderRoutePicker() {
            const box=document.getElementById('route-picker'); if(!box)return;
            const q=(document.getElementById('route-filter')?.value||'').toLowerCase();
            const list=monumentsData.filter(m=>archiRouteStopMatches(m, q));
            box.innerHTML=list.map(m=>`<label class="flex items-center gap-2 rounded-lg bg-slate-800/70 p-2 text-xs text-slate-200"><input type="checkbox" value="${m.id}" ${selectedRouteIds.includes(m.id)?'checked':''} onchange="toggleRouteStop('${m.id}',this.checked)" class="accent-amber-500"><span class="flex-1">${monumentLabel(m)}<small class="block text-slate-400">${cityLabel(m.city)}, ${countryLabel(m.country)}</small></span></label>`).join('') || `<p class="text-xs text-slate-400">${tr("No hay monumentos con coordenadas que coincidan.","No monuments with matching coordinates.")}</p>`;
        }
