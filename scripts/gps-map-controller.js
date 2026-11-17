// Extraído sin alterar la lógica original de ArchiSpotter.
        function toggleUserGps() {
            triggerHaptic();
            if (userGpsActive) {
                userGpsActive = false;
                document.getElementById('user-gps-marker').classList.add('hidden');
                document.getElementById('gps-btn-text').textContent = 'Activar GPS';
                document.getElementById('map-status-text').textContent = 'GPS desactivado. Toca un país en el mapa para explorar.';
                showToast(tr("GPS Desactivado","GPS disabled"));
                return;
            }

            if ('geolocation' in navigator) {
                document.getElementById('gps-btn-text').textContent = 'Buscando...';
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        userLat = pos.coords.latitude;
                        userLng = pos.coords.longitude;
                        userGpsActive = true;

                        if (smartMap) { smartMap.setView([userLat, userLng], 14); if (window.userLeafletMarker) smartMap.removeLayer(window.userLeafletMarker); window.userLeafletMarker = L.marker([userLat,userLng]).addTo(smartMap).bindPopup('Tu ubicación aproximada'); }
                        renderNearbyMonuments();

                        document.getElementById('gps-btn-text').textContent = 'GPS Activo';
                        document.getElementById('map-status-text').textContent = `Ubicación localizada (${userLat.toFixed(2)}, ${userLng.toFixed(2)})`;
                        showToast(tr("Ubicación GPS activada con éxito 📍","GPS location enabled 📍"));
                    },
                    (err) => {
                        document.getElementById('gps-btn-text').textContent = 'Activar GPS';
                        showToast(tr("No se pudo acceder a la geolocalización.","Could not access your location."));
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                showToast(tr("Geolocalización no soportada por el navegador.","Geolocation is not supported by this browser."));
            }
        }

        function openGpsNavigation() {
            triggerHaptic();
            const m = activeMonumentForModal;
            if (!m) return;

            let mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${m.coords.lat},${m.coords.lng}`;
            if (userGpsActive && userLat && userLng) {
                mapsUrl += `&origin=${userLat},${userLng}&travelmode=walking`;
            }

            window.open(mapsUrl, '_blank');
        }

        function renderMapPins() {
            if (smartMap) { smartMapMarkers.forEach(marker => smartMap.removeLayer(marker)); smartMapMarkers = []; addSmartMapMarkers(); }
        }

        function initSmartMap() {
            const el = document.getElementById('smart-map');
            if (!el || smartMap) return;
            if (!window.L) {
                const status = document.getElementById('map-status-text');
                if (status) status.textContent = 'El mapa no está disponible. Comprobá la conexión e intentá nuevamente.';
                el.setAttribute('role', 'status');
                el.textContent = 'No se pudo cargar el mapa. Revisá tu conexión y volvé a abrir esta pestaña.';
                return;
            }
            el.textContent = '';
            // One world only: do not duplicate tiles or markers across the antimeridian.
            // Limit latitude to the usable Web Mercator extent; allow the full longitude range.
            const worldBounds = L.latLngBounds([[-85.05112878, -180], [85.05112878, 180]]);
            smartMap = L.map(el, {
                zoomControl: false,
                worldCopyJump: false,
                maxBounds: worldBounds,
                maxBoundsViscosity: 1.0,
                minZoom: 1,
                zoomSnap: 0.25
            }).setView([43.2, 10.5], 4);
            const archiTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                noWrap: true,
                bounds: worldBounds,
                attribution: '&copy; OpenStreetMap contributors'
            });
            let archiTileFailures = 0;
            archiTiles.on('tileerror', function () {
                archiTileFailures++;
                if (archiTileFailures >= 3) {
                    const status = document.getElementById('map-status-text');
                    if (status) status.textContent = 'Algunas partes del mapa no cargaron. Los monumentos siguen disponibles; comprobá tu conexión.';
                }
            });
            archiTiles.on('tileload', function () {
                archiTileFailures = 0;
            });
            archiTiles.addTo(smartMap);
            L.control.zoom({ position: 'bottomright' }).addTo(smartMap);
            addSmartMapMarkers();
            setTimeout(() => smartMap.invalidateSize(), 300);
        }

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && smartMap && currentTab === 'map') {
                setTimeout(function () { if (smartMap) smartMap.invalidateSize(); }, 150);
            }
        });
        window.addEventListener('online', function () {
            if (smartMap && currentTab === 'map') {
                smartMap.invalidateSize();
            }
        });

        function addSmartMapMarkers(query = '') {
            if (!smartMap || !window.L) return;
            smartMapMarkers.forEach(marker => smartMap.removeLayer(marker)); smartMapMarkers = [];
            const q = query.toLowerCase();
            const valid = monumentsData.filter(m => archiMapMarkerMatches(m, q));
            valid.forEach(m => {
                const marker = L.marker([Number(m.coords.lat), Number(m.coords.lng)]).addTo(smartMap);
                marker.bindPopup(`<strong>${monumentLabel(m)}</strong><br>${cityLabel(m.city)}, ${countryLabel(m.country)}<br><small>${m.style || ''}</small><br><a href="#" onclick="openMonumentById('${m.id}');return false;">Ver ficha →</a><br><a target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${m.coords.lat},${m.coords.lng}&travelmode=walking">Cómo llegar caminando</a>`);
                marker.monument = m; smartMapMarkers.push(marker);
            });
            renderNearbyMonuments();
        }

        // E92: el buscador del mapa también desplaza la vista hacia los resultados.
        let archiMapSearchTimer = null;
        function filterMapMarkers(value) {
            addSmartMapMarkers(value);
            if (archiMapSearchTimer) clearTimeout(archiMapSearchTimer);
            const query = archiNormalizeSearch(String(value || '').trim());
            if (!smartMap || query.length < 3) return;
            archiMapSearchTimer = setTimeout(function () {
                if (!smartMap || !window.L) return;
                const input = document.getElementById('map-search');
                if (!input || archiNormalizeSearch(input.value.trim()) !== query) return;
                const matches = smartMapMarkers.filter(function (marker) {
                    const m = marker.monument;
                    return m && m.coords && Number.isFinite(Number(m.coords.lat)) && Number.isFinite(Number(m.coords.lng));
                });
                if (!matches.length) return;
                // Priorizar una ciudad o monumento coincidente exactamente para evitar
                // saltos inesperados mientras se escribe una búsqueda parcial.
                const exact = matches.filter(function (marker) {
                    const m = marker.monument;
                    return [m.city, m.name, monumentLabel(m), cityLabel(m.city)].some(function (v) {
                        return archiNormalizeSearch(String(v || '')) === query;
                    });
                });
                const targets = exact.length ? exact : matches;
                if (targets.length === 1) {
                    const m = targets[0].monument;
                    smartMap.flyTo([Number(m.coords.lat), Number(m.coords.lng)], 13, {duration: 0.8});
                } else {
                    const bounds = L.latLngBounds(targets.map(function (marker) {
                        return marker.getLatLng();
                    }));
                    if (bounds.isValid()) smartMap.flyToBounds(bounds, {padding: [38, 38], maxZoom: 12, duration: 0.8});
                }
            }, 450);
        }
        function openMonumentById(id) { const m = monumentsData.find(item => item.id === id); if (m) openMonumentModal(m.id); }
        function centerMapOnUser() { if (!smartMap) return; if (userGpsActive && userLat != null) smartMap.setView([userLat,userLng],15); else toggleUserGps(); }
        function renderNearbyMonuments() {
            const target = document.getElementById('nearby-list'); if (!target) return;
            if (userLat == null || userLng == null) { target.innerHTML = `<span class="text-[10px] text-slate-400">${tr("Activa GPS para ordenar por cercanía.","Enable GPS to sort by distance.")}</span>`; return; }

            const nearby = archiNearestMonuments(monumentsData, userLat, userLng, archiDistanceKm);
            target.innerHTML = nearby.map(m=>`<button onclick="openMonumentById('${m.id}')" class="min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-left"><span class="block text-[10px] text-white font-semibold">${monumentLabel(m)}</span><span class="text-[9px] text-amber-400">${m.km.toFixed(1)} km</span></button>`).join('');
        }

        function selectCountryFromMap(cName) {
            triggerHaptic();
            selectedCountry = cName;
            selectedCity = null;
            switchTab('explore');
            renderNavigationFlow();
        }

