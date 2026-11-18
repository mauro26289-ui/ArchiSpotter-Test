// Extraído sin alterar la lógica original de ArchiSpotter.
        // E116: prevent repeated location requests and ignore stale callbacks.
        // A location permission prompt may outlive the tab that started it.
        let archiGpsRequestPending = false;
        let archiGpsRequestGeneration = 0;
        // E119: one persistent, accessible GPS toggle in the map header.
        // Keep its label in sync with the actual GPS state, including tab returns.
        function archiSyncGpsOffButton() {
            const active = Boolean(userGpsActive);
            const language = typeof appLanguage === 'string' ? appLanguage : 'es';
            const labels = {
                es: ['Activar GPS', 'Desactivar GPS'],
                en: ['Enable GPS', 'Disable GPS'],
                it: ['Attiva GPS', 'Disattiva GPS']
            };
            const pair = labels[language] || labels.es;
            const toggle = document.getElementById('gps-toggle-btn');
            const text = document.getElementById('gps-btn-text');
            if (text) text.textContent = pair[active ? 1 : 0];
            if (toggle) {
                toggle.setAttribute('aria-pressed', String(active));
                toggle.setAttribute('aria-label', pair[active ? 1 : 0]);
                toggle.setAttribute('title', pair[active ? 1 : 0]);
                toggle.classList.toggle('archi-gps-active', active);
            }
        }
        // E128: GPS feedback follows the currently selected app language.
        function archiGpsText(es, en, it) {
            return (typeof appLanguage === 'string' && appLanguage === 'it') ? it
                : (typeof appLanguage === 'string' && appLanguage === 'en') ? en : es;
        }
        function toggleUserGps() {
            triggerHaptic();
            if (userGpsActive) {
                archiGpsRequestGeneration++;
                userGpsActive = false;
                archiSyncGpsOffButton();
                if (window.userLeafletMarker) {
                    if (smartMap && smartMap.hasLayer(window.userLeafletMarker)) {
                        smartMap.removeLayer(window.userLeafletMarker);
                    }
                    window.userLeafletMarker = null;
                }
                userLat = null;
                userLng = null;
                renderNearbyMonuments();
                const marker = document.getElementById('user-gps-marker');
                if (marker) marker.classList.add('hidden');
                const button = document.getElementById('gps-btn-text');
                archiSyncGpsOffButton();
                const status = document.getElementById('map-status-text');
                if (status) status.textContent = archiGpsText('GPS desactivado. Toca un país en el mapa para explorar.', 'GPS disabled. Tap a country on the map to explore.', 'GPS disattivato. Tocca un paese sulla mappa per esplorare.');
                showToast(archiGpsText('GPS desactivado', 'GPS disabled', 'GPS disattivato'));
                return;
            }
            if (archiGpsRequestPending) {
                // Ignore duplicate taps only while a location request is pending.
                return;
            }
            if (!('geolocation' in navigator)) {
                showToast(archiGpsText('Geolocalización no soportada por el navegador.', 'Geolocation is not supported by this browser.', 'Geolocalizzazione non supportata dal browser.'));
                return;
            }
            archiGpsRequestPending = true;
            const request = ++archiGpsRequestGeneration;
            const button = document.getElementById('gps-btn-text');
            if (button) button.textContent = archiGpsText('Buscando...', 'Locating...', 'Ricerca in corso...');
            try {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        if (request !== archiGpsRequestGeneration) return;
                        archiGpsRequestPending = false;
                        userLat = pos.coords.latitude;
                        userLng = pos.coords.longitude;
                        userGpsActive = true;
                        archiSyncGpsOffButton();
                        if (smartMap && window.L) {
                            smartMap.setView([userLat, userLng], 14);
                            if (window.userLeafletMarker) smartMap.removeLayer(window.userLeafletMarker);
                            window.userLeafletMarker = L.marker([userLat, userLng]).addTo(smartMap).bindPopup(archiGpsText('Tu ubicación aproximada', 'Your approximate location', 'La tua posizione approssimativa'));
                        }
                        renderNearbyMonuments();
                        const button = document.getElementById('gps-btn-text');
                        archiSyncGpsOffButton();
                        const status = document.getElementById('map-status-text');
                        if (status) status.textContent = archiGpsText(`Ubicación localizada (${userLat.toFixed(2)}, ${userLng.toFixed(2)})`, `Location found (${userLat.toFixed(2)}, ${userLng.toFixed(2)})`, `Posizione trovata (${userLat.toFixed(2)}, ${userLng.toFixed(2)})`);
                        showToast(archiGpsText('Ubicación GPS activada 📍', 'GPS location enabled 📍', 'Posizione GPS attivata 📍'));
                    },
                    () => {
                        if (request !== archiGpsRequestGeneration) return;
                        archiGpsRequestPending = false;
                        const button = document.getElementById('gps-btn-text');
                        archiSyncGpsOffButton();
                        showToast(archiGpsText('No se pudo acceder a la geolocalización.', 'Could not access your location.', 'Impossibile accedere alla tua posizione.'));
                    },
                    { enableHighAccuracy: true, timeout: 15000 }
                );
            } catch (error) {
                if (request !== archiGpsRequestGeneration) return;
                archiGpsRequestPending = false;
                archiSyncGpsOffButton();
                showToast(archiGpsText('No se pudo acceder a la geolocalización.', 'Could not access your location.', 'Impossibile accedere alla tua posizione.'));
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

            openArchiExternalMaps(mapsUrl);
        }

        function renderMapPins() {
            if (smartMap) { smartMapMarkers.forEach(marker => smartMap.removeLayer(marker)); smartMapMarkers = []; addSmartMapMarkers(); }
        }

        function archiCartoTileUrl() {
            const style = document.body.classList.contains('light-mode') ? 'light_all' : 'dark_all';
            return 'https://{s}.basemaps.cartocdn.com/' + style + '/{z}/{x}/{y}{r}.png';
        }

        function archiUpdateMapTheme() {
            if (window.archiMapBaseTiles) window.archiMapBaseTiles.setUrl(archiCartoTileUrl());
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
            // CARTO basemaps share the same Leaflet layer; switching themes keeps pins, zoom and position.
            const archiTiles = L.tileLayer(archiCartoTileUrl(), {
                maxZoom: 19,
                noWrap: true,
                bounds: worldBounds,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            });
            window.archiMapBaseTiles = archiTiles;
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
                marker.bindPopup(`<strong>${monumentLabel(m)}</strong><br>${cityLabel(m.city)}, ${countryLabel(m.country)}<br><small>${m.style || ''}</small><br><a href="#" onclick="openMonumentById('${m.id}');return false;">Ver ficha →</a><br><a href="https://www.google.com/maps/dir/?api=1&destination=${m.coords.lat},${m.coords.lng}&travelmode=walking" onclick="openArchiExternalMaps(this.href);return false;">Cómo llegar caminando</a>`);
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

