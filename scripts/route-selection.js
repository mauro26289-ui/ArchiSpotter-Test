// Funciones de selección y guardado de rutas extraídas sin cambios de la etapa 44.
        function toggleRouteStop(id,checked){ if(checked){if(!selectedRouteIds.includes(id))selectedRouteIds.push(id);}else selectedRouteIds=selectedRouteIds.filter(x=>x!==id); }
        function selectedRouteMonuments(){return selectedRouteIds.map(id=>monumentsData.find(m=>m.id===id)).filter(m=>m&&m.coords);}
        function mapsDirectionsFor(list){ if(list.length<2){showToast(tr("Selecciona al menos dos monumentos con coordenadas","Select at least two monuments with coordinates"));return;} const url=archiWalkingDirectionsUrl(list); openArchiExternalMaps(url); }
        function openSelectedRoute(){mapsDirectionsFor(selectedRouteMonuments());}
        function openNamedRoute(names){const list=names.map(n=>monumentsData.find(m=>m.name===n)).filter(m=>m&&m.coords);mapsDirectionsFor(list);}
        function saveSelectedRoute(){const list=selectedRouteMonuments();if(list.length<2){showToast(tr("Selecciona al menos dos paradas","Select at least two stops"));return;}const updated=[...new Set([...tripMonumentIds,...list.map(m=>m.id)])];if(!archiStorageSet('archispotter_trip',JSON.stringify(updated)))return;tripMonumentIds=updated;renderTrip();showToast(tr("Paradas guardadas en Mi viaje","Stops saved to My trip"));}
