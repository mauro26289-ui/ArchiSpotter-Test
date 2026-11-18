// Funciones de selección y guardado de rutas extraídas sin cambios de la etapa 44.
        function toggleRouteStop(id,checked){ if(checked){if(!selectedRouteIds.includes(id))selectedRouteIds.push(id);}else selectedRouteIds=selectedRouteIds.filter(x=>x!==id); }
        // E148: Google Maps solo debe recibir coordenadas geográficas válidas.
        function archiHasValidRouteCoords(m) {
            if (!m || !m.coords) return false;
            const lat = Number(m.coords.lat), lng = Number(m.coords.lng);
            return m.coords.lat !== null && m.coords.lng !== null &&
                m.coords.lat !== '' && m.coords.lng !== '' &&
                Number.isFinite(lat) && Number.isFinite(lng) &&
                lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        }
        function selectedRouteMonuments(){return selectedRouteIds.map(id=>monumentsData.find(m=>m.id===id)).filter(archiHasValidRouteCoords);}
        function mapsDirectionsFor(list){ if(list.length<2){showToast(tr("Selecciona al menos dos monumentos con coordenadas","Select at least two monuments with coordinates"));return;} const url=archiWalkingDirectionsUrl(list); openArchiExternalMaps(url); }
        function openSelectedRoute(){mapsDirectionsFor(selectedRouteMonuments());}
        function openNamedRoute(names){const list=names.map(n=>monumentsData.find(m=>m.name===n)).filter(archiHasValidRouteCoords);mapsDirectionsFor(list);}
        function saveSelectedRoute(){const list=selectedRouteMonuments();if(list.length<2){showToast(tr("Selecciona al menos dos paradas","Select at least two stops"));return;}const updated=[...new Set([...tripMonumentIds,...list.map(m=>m.id)])];if(!archiStorageSet('archispotter_trip',JSON.stringify(updated)))return;tripMonumentIds=updated;renderTrip();showToast(tr("Paradas guardadas en Mi viaje","Stops saved to My trip"));}
