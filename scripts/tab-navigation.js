// Función original extraída de app.js sin modificar su implementación.
        function switchTab(tab) {
            triggerHaptic(); currentTab=tab;
            // La barra de país/ciudad pertenece exclusivamente a Explorar.
            const archiBreadcrumb = document.getElementById('nav-breadcrumb');
            if (archiBreadcrumb && tab !== 'explore') archiBreadcrumb.classList.add('hidden');
            // vB5: Las vistas editoriales son parte de Explorar, nunca pestañas globales.
            ['vb2-italy','vb3-country'].forEach(id => {
                const el=document.getElementById(id);
                if(el) el.classList.add('hidden');
            });
            const ids=['view-home','view-cities-container','view-monuments-container','view-map','view-walks','view-trip','view-favorites'];
            ids.forEach(id=>{const el=document.getElementById(id);if(el && !el.classList.contains('hidden'))el.classList.add('hidden');});
            ['tab-explore','tab-trip','tab-favorites','tab-map','tab-walks'].forEach(id=>{const b=document.getElementById(id);if(b && b.className!=='flex flex-col items-center text-slate-400 rounded-xl')b.className='flex flex-col items-center text-slate-400 rounded-xl';});
            const active=document.getElementById('tab-'+tab);if(active && active.className!=='flex flex-col items-center text-amber-500 rounded-xl')active.className='flex flex-col items-center text-amber-500 rounded-xl';
            if(tab==='explore') renderNavigationFlow();
            if(tab==='map'){
                document.getElementById('view-map').classList.remove('hidden');
                // E115: una sola actualización pendiente; evita redimensionar Leaflet
                // después de abandonar la pestaña durante una navegación rápida.
                if (switchTab.mapRefreshTimer) clearTimeout(switchTab.mapRefreshTimer);
                switchTab.mapRefreshTimer = setTimeout(() => {
                    switchTab.mapRefreshTimer = null;
                    const mapView = document.getElementById('view-map');
                    if (document.hidden || currentTab !== 'map' || !mapView || mapView.classList.contains('hidden')) return;
                    if (!smartMap) initSmartMap();
                    else smartMap.invalidateSize();
                }, 120);
            } else if (switchTab.mapRefreshTimer) {
                clearTimeout(switchTab.mapRefreshTimer);
                switchTab.mapRefreshTimer = null;
            }
            if(tab==='walks'){document.getElementById('view-walks').classList.remove('hidden');renderWalkingRoutes();}
            if(tab==='trip'){document.getElementById('view-trip').classList.remove('hidden');renderTrip();}
            if(tab==='favorites'){document.getElementById('view-favorites').classList.remove('hidden');renderFavorites();}
            // E125: newly visible tab content may contain fallback photos that
            // were offscreen when connectivity returned. Reuse E124's guarded
            // recovery scheduler after the tab's DOM has been rendered.
            if (typeof archiScheduleVisiblePhotoRecovery === 'function') {
                archiScheduleVisiblePhotoRecovery();
            }
        }

// E127: cancel a pending Leaflet refresh when the PWA leaves the foreground.
// Returning to the map still uses switchTab's existing guarded refresh.
function archiCancelPendingMapRefresh() {
    if (switchTab.mapRefreshTimer) {
        clearTimeout(switchTab.mapRefreshTimer);
        switchTab.mapRefreshTimer = null;
    }
}
window.addEventListener('pagehide', archiCancelPendingMapRefresh);
// iOS can background an installed PWA without immediately firing pagehide.
document.addEventListener('visibilitychange', function() {
    if (document.hidden) archiCancelPendingMapRefresh();
    else if (currentTab === 'map') {
        // Refresh only the already initialized map when returning to the foreground.
        // Never initialize Leaflet from this lifecycle callback.
        if (typeof smartMap !== 'undefined' && smartMap) {
            requestAnimationFrame(function() {
                const mapView = document.getElementById('view-map');
                if (!document.hidden && currentTab === 'map' && mapView && !mapView.classList.contains('hidden') && smartMap) smartMap.invalidateSize();
            });
        }
    }
});
