// Extraído de app.js (E89); comportamiento original preservado.
        window.onload = function() {
            setTimeout(function() {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(function() {
                        splash.style.display = 'none';
                    }, 700);
                }
            }, 2500);

            const savedMonuments = archiStorageGet('archispotter_monuments');
            if (savedMonuments) {
                try {
                    const parsed = JSON.parse(savedMonuments);
                    const savedById = new Map((Array.isArray(parsed) ? parsed : []).filter(m => m && m.id).map(m => [m.id, m]));
                    const initialIds = new Set(initialMonumentsData.map(m => m.id));
                    // Keep user edits, but always render the built-in Unsplash gallery for built-in monuments.
                    monumentsData = initialMonumentsData.map(base => {
                        const saved = savedById.get(base.id) || {};
                        const merged = { ...base, ...saved };
                        merged.images = (base.images || []).slice();
                        return merged;
                    }).concat((Array.isArray(parsed) ? parsed : []).filter(m => m && m.id && !initialIds.has(m.id)).map(m => ({ ...m, images: Array.isArray(m.images) ? m.images.filter(Boolean) : [] })));
                } catch(e) { monumentsData = [...initialMonumentsData]; }
            } else {
                monumentsData = [...initialMonumentsData];
            }

            // E141: misma validación que favoritos y Mi viaje, usando el lector protegido compartido.
            stampedPassports = archiReadSavedIdList('archispotter_stamps');

            updatePassportBadgeCount();
            renderNavigationFlow();
            renderMapPins();
            renderWalkingRoutes();
            renderTrip();
            renderFavorites();
            applySavedPreferences();
            setTimeout(initSmartMap, 250);
        };


