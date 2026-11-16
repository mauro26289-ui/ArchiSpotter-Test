// Bloque original de app.js, extraído sin cambiar su implementación.
        function setUiText(selector, value) { const el=document.querySelector(selector); if(el) el.textContent=value; }
        // italianStaticOverrides definido en scripts/static-italian-overrides.js
        function applyStaticLanguage() {
            const en=appLanguage==='en';
            const T={
                welcome: en?'Welcome!':'¡Bienvenido!', intro:en?'What is this?':'¿Y esto qué es?',
                introText:en?'You are on vacation, walking down the street, and you see a building or monument you like and want to know what it is. Open ArchiSpotter and voilà: all the information you wanted. Select a country to explore its iconic monuments, audio guides, routes and secrets.':'Estás de vacaciones, vas caminando por la calle y ves un edificio o monumento que te gusta y quieres saber qué es. Entrás en ArchiSpotter y voilà. Toda la información que querías saber. Seleccioná un país para explorar sus monumentos icónicos, audioguías, rutas y secretos.',
                countries:en?'Available countries':'Países disponibles', cities:en?'Select the city you want to explore':'Selecciona la ciudad que deseas explorar',
                tripDesc:en?'Your itinerary and the buildings you want to discover':'Tu recorrido y los edificios que quieres descubrir', itinerary:en?'Personal itinerary':'Itinerario personal', clear:en?'Clear':'Vaciar', emptyTrip:en?'Add monuments from Explore or Favorites.':'Añade monumentos desde Explorar o Favoritos.', openTrip:en?'Open walking route with all stops':'Abrir ruta a pie con todas las paradas', visual:en?'Visual exploration':'Exploración visual', visualDesc:en?'Discover architecture through images and open each entry.':'Descubre arquitectura por imágenes y abre cada ficha.',
                favoritesTitle:en?'My favorites':'Mis favoritos', favoritesDesc:en?'All your saved monuments, from any city.':'Todos tus monumentos guardados, desde cualquier ciudad.',
                mapTitle:en?'World map & Navigation':'Mapamundi & Navegación', mapStatus:en?'Explore nearby monuments, filter by city and open their entries.':'Explora monumentos cercanos, filtra por ciudad y abre sus fichas.',
                routesTitle:en?'Themed Walking Routes':'Rutas a Pie Temáticas', routesDesc:en?'Itineraries designed to explore monuments on foot.':'Itinerarios optimizados para recorrer caminando los monumentos',
                createRoute:en?'Create my route':'Crear mi ruta', routeHelp:en?'Select two or more monuments. A walking route with stops will open in the maps service.':'Selecciona dos o más monumentos. Se abrirá una ruta peatonal con paradas en el servicio de mapas.', routeFilter:en?'Filter by name or city…':'Filtrar por nombre o ciudad…', saveRoute:en?'Save to My trip':'Guardar en Mi viaje', drawRoute:en?'Draw walking route':'Trazar ruta a pie',

                back:en?'Countries':'Países', all:en?'All':'Todos', roman:en?'Roman':'Romano', gothic:en?'Gothic':'Gótico', renaissance:en?'Renaissance':'Renacentista', baroque:en?'Baroque':'Barroco',
                modalDirections:en?'How to get there':'Cómo llegar', modalAdd:en?'Add to my trip':'Agregar a mi viaje', modalOfficial:en?'Official website':'Sitio oficial', modalClose:en?'Close entry':'Cerrar ficha'
            };
            if(appLanguage==='it') { const italianLabels={welcome:'Benvenuto!',intro:'Che cos’è?',countries:'Paesi disponibili',cities:'Seleziona la città che vuoi esplorare',tripDesc:'Il tuo itinerario e gli edifici da scoprire',itinerary:'Itinerario personale',clear:'Svuota',emptyTrip:'Aggiungi monumenti da Esplora o Preferiti.',openTrip:'Apri il percorso a piedi con tutte le tappe',visual:'Esplorazione visiva',visualDesc:'Scopri l’architettura attraverso le immagini',favoritesTitle:'I miei preferiti',favoritesDesc:'Tutti i monumenti salvati',mapTitle:'Mappa del mondo e navigazione',routesTitle:'Percorsi tematici a piedi',createRoute:'Crea il mio percorso',saveRoute:'Salva nel mio viaggio',drawRoute:'Traccia il percorso a piedi'}; Object.assign(T,italianLabels); }

            if(appLanguage==='it') Object.assign(T,italianStaticOverrides);
            setUiText('#view-home .relative.z-10 > span',T.welcome); setUiText('#home-intro-heading',T.intro); setUiText('#view-home .relative.z-10 > p',T.introText); setUiText('#view-home h3',T.countries);
            setUiText('#view-cities-container p',T.cities); setUiText('#breadcrumb-text',T.back);
            setUiText('#view-trip h3',T.tripDesc); setUiText('#view-trip .surface-card h4',T.itinerary); setUiText('#view-trip .surface-card > div > button',T.clear); setUiText('#trip-stops p',T.emptyTrip); setUiText('#trip-directions',T.openTrip); setUiText('#view-trip .space-y-2 h4',T.visual); setUiText('#view-trip .space-y-2 > p',T.visualDesc);
            setUiText('#view-favorites h3',T.favoritesTitle); setUiText('#view-favorites p',T.favoritesDesc);
            setUiText('#view-map .p-3 span',T.mapTitle); setUiText('#gps-btn-text',T.gps); setUiText('#map-status-text',T.mapStatus);
            setUiText('#view-walks h3 span',T.routesTitle); setUiText('#view-walks .space-y-1 p',T.routesDesc); setUiText('#view-walks .surface-card h4',T.createRoute); setUiText('#view-walks .surface-card p',T.routeHelp); setUiText('#view-walks button[onclick="saveSelectedRoute()"]',T.saveRoute); setUiText('#view-walks button[onclick="openSelectedRoute()"]',T.drawRoute);
            const styles=document.querySelectorAll('#styles-filter .style-btn'); const labels=[T.all,T.roman,T.gothic,T.renaissance,T.baroque]; styles.forEach((b,i)=>{if(labels[i])b.textContent=labels[i];});
            const search=document.getElementById('search-input'); if(search)search.placeholder=appLanguage==='it'?'Cerca monumento o stile…':en?'Search monument or style…':'Buscar monumento o estilo…';
            const mapSearch=document.getElementById('map-search'); if(mapSearch)mapSearch.placeholder=appLanguage==='it'?'Cerca monumento, città o stile…':en?'Search monument, city or style…':'Buscar monumento, ciudad o estilo…';
            const routeFilter=document.getElementById('route-filter'); if(routeFilter)routeFilter.placeholder=T.routeFilter;
            const directions=document.getElementById('modal-directions-btn'); if(directions)directions.setAttribute('aria-label',T.modalDirections);
            const close=document.querySelector('#monument-modal .modal-close'); if(close)close.setAttribute('aria-label',T.modalClose);
        }
