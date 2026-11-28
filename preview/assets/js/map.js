/* CARTO Voyager monument pins; public browser tile key configured. */
window.ArchiSpotterMap = (function () {
  var map, tiles, markers, tripLayer, locationMarker, locationCircle, failures = 0;
  var monumentCoordinates = {"Coliseo":[41.89021,12.49223],"Catedral de Milán":[45.4642,9.1916],"Alhambra":[37.1761,-3.5881],"Castillo de Chillon":[46.4142,6.9275],"Catedral de Florencia":[43.7731,11.256],"Sagrada Familia":[41.4036,2.1744],"Casa Batlló":[41.3916,2.1649],"Palacio Real":[40.41795,-3.7143],"Puerta de Alcalá":[40.4201,-3.6889],"Torre Eiffel":[48.85837,2.29448],"Arco del Triunfo":[48.8738,2.295],"Palacio de Versalles":[48.8049,2.1204],"Partenón":[37.9715,23.7267],"Erecteión":[37.972,23.7265],"Templo de Apolo":[38.4825,22.501],"Palacio de Westminster":[51.4995,-0.1248],"Tower Bridge":[51.5055,-0.0754],"Termas romanas":[51.381,-2.3595],"Puerta de Brandeburgo":[52.5163,13.3777],"Catedral de Berlín":[52.5191,13.401],"Catedral de Colonia":[50.9413,6.9583],"Torre de Belém":[38.6916,-9.216],"Monasterio de los Jerónimos":[38.6979,-9.206],"Puente Don Luis I":[41.1397,-8.6094],"Obelisco":[-34.6037,-58.3816],"Teatro Colón":[-34.6011,-58.383],"Panteón de Agripa":[41.89861,12.47687],"Fontana di Trevi":[41.90093,12.48331],"Foro Romano":[41.8925,12.4853],"Castillo de Sant'Angelo":[41.90306,12.46628],"Ponte Vecchio":[43.768,11.2531],"Palazzo Vecchio":[43.7693,11.2561],"Parque Güell":[41.4145,2.1527],"Casa Milà":[41.3954,2.1619],"Palacio de Cristal":[40.4137,-3.6825],"Templo de Debod":[40.424,-3.7178],"Catedral de Notre-Dame":[48.853,2.3499],"Basílica del Sacré-Cœur":[48.8867,2.3431],"Museo del Louvre":[48.8606,2.3376],"Templo de Zeus Olímpico":[37.9693,23.7331],"Odeón de Herodes Ático":[37.9708,23.7246],"Abadía de Westminster":[51.4993,-0.1273],"Catedral de San Pablo":[51.5138,-0.0984],"Edificio del Reichstag":[52.5186,13.3762],"Memorial del Holocausto":[52.5139,13.3787],"Castillo de San Jorge":[38.7139,-9.1335],"Elevador de Santa Justa":[38.7121,-9.1395],"Casa Rosada":[-34.6081,-58.3702],"Palacio Barolo":[-34.6098,-58.3857],"Congreso de la Nación Argentina":[-34.6093,-58.3926],"Puente de la Mujer":[-34.6078,-58.3648]};
  var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  function addTiles() {
    // CARTO Voyager raster URL supplied by the project owner.
    // Browser map tile keys are visible in network requests; restrict by domain in CARTO.
    if (tiles) return;
    failures = 0;
    tiles = L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_5bma_1_409aadd1560bee01adc6c8f7', {
      maxZoom:19, noWrap:true, attribution:attribution
    });
    tiles.on('tileerror', function () {
      if (++failures < 5 || !tiles || tiles._archiFallback) return;
      map.removeLayer(tiles);
      tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom:19, noWrap:true,
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      tiles._archiFallback = true; tiles.addTo(map);
      var status = document.getElementById('map-status');
      if (status) status.textContent = ({es:'CARTO no responde. Se muestra OpenStreetMap.',en:'CARTO is unavailable. Showing OpenStreetMap.',it:'CARTO non risponde. Visualizzazione di OpenStreetMap.'})[document.documentElement.lang];
    });
    tiles.addTo(map);
  }
  function init() {
    if (map || !window.L) { if (!window.L) document.getElementById('map-status').textContent = ({es:'No se pudo cargar el mapa. Comprueba la conexión.',en:'Unable to load the map. Check your connection.',it:'Impossibile caricare la mappa. Verifica la connessione.'})[document.documentElement.lang]; return; }
    map = L.map('archi-map', {worldCopyJump:true, maxBounds:[[-85,-180],[85,180]], maxBoundsViscosity:1, zoomControl:true}).setView([46.5,9],4);
    addTiles();
    markers = L.layerGroup().addTo(map);
    var catalog=window.ArchiSpotterData.countryCitySamples,count=0;
    Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){
      city[4].forEach(function(place){
        var pos=monumentCoordinates[place[0]];if(!pos)return;
        count++;
        var marker=L.marker(pos).addTo(markers);
        marker.on('click',function(){
          var lang=document.documentElement.lang,idx={es:0,en:1,it:2}[lang]||0;
          var popup=document.createElement('div');popup.className='archi-map-popup';
          var photo=document.createElement('img');photo.src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=360&q=75';photo.alt='';photo.loading='lazy';popup.appendChild(photo);if(window.ArchiSpotterPhotos)window.ArchiSpotterPhotos.apply(photo,place,360);
          var title=document.createElement('strong');title.textContent=place[idx];popup.appendChild(title);
          var cityLabel=document.createElement('span');cityLabel.textContent=city[idx];popup.appendChild(cityLabel);
          var button=document.createElement('button');button.type='button';button.textContent={es:'Ver ficha',en:'View details',it:'Apri scheda'}[lang]||'Ver ficha';
          button.addEventListener('click',function(){if(window.ArchiSpotterMap.openMonument)window.ArchiSpotterMap.openMonument(place,city,country);});
          popup.appendChild(button);
          var directions=document.createElement('button');directions.type='button';directions.className='archi-directions';
          directions.textContent={es:'Cómo llegar',en:'Directions',it:'Indicazioni'}[lang]||'Cómo llegar';
          directions.addEventListener('click',function(){
            var destination=pos[0]+','+pos[1];
            window.location.assign('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)+'&travelmode=walking');
          });
          popup.appendChild(directions);marker.bindPopup(popup,{maxWidth:220,minWidth:180}).openPopup();
        });
      });
    });});
    var status=document.getElementById('map-status');if(status){var total=Object.keys(catalog).reduce(function(sum,key){return sum+catalog[key].reduce(function(n,city){return n+city[4].length;},0);},0);status.textContent=({es:count+' de '+total+' monumentos ubicados',en:count+' of '+total+' monuments mapped',it:count+' di '+total+' monumenti sulla mappa'})[document.documentElement.lang];}
  }
  function locate() {
    var status=document.getElementById('map-location-status');
    var lang=document.documentElement.lang;
    if(!navigator.geolocation){status.textContent={es:'Este dispositivo no permite obtener tu ubicación.',en:'Location is unavailable on this device.',it:'Posizione non disponibile su questo dispositivo.'}[lang]||'Ubicación no disponible';return;}
    status.textContent={es:'Buscando tu ubicación…',en:'Finding your location…',it:'Ricerca della posizione…'}[lang]||'Buscando tu ubicación…';
    navigator.geolocation.getCurrentPosition(function(position){
      if(!map)return;
      var p=[position.coords.latitude,position.coords.longitude];
      if(locationMarker)map.removeLayer(locationMarker);
      if(locationCircle)map.removeLayer(locationCircle);
      locationCircle=L.circle(p,{radius:Math.max(position.coords.accuracy||0,10),color:'#247eaa',weight:1,fillOpacity:.08}).addTo(map);
      locationMarker=L.circleMarker(p,{radius:7,color:'#fff',weight:2,fillColor:'#247eaa',fillOpacity:1}).addTo(map);
      map.setView(p,Math.max(map.getZoom(),14));
      status.textContent={es:'Ubicación aproximada mostrada.',en:'Approximate location shown.',it:'Posizione approssimativa visualizzata.'}[lang]||'Ubicación aproximada mostrada.';
    },function(error){
      status.textContent=error.code===1?({es:'Permiso de ubicación denegado.',en:'Location permission denied.',it:'Permesso di localizzazione negato.'}[lang]||'Permiso denegado'):({es:'No se pudo obtener tu ubicación. Inténtalo de nuevo.',en:'Unable to get your location. Try again.',it:'Impossibile ottenere la posizione. Riprova.'}[lang]||'Ubicación no disponible');
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }
  // Local, accent-insensitive search across the mapped catalogue; no external geocoding.
  var searchInput=document.getElementById('map-search'),searchResults=document.getElementById('map-search-results');
  function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
  function searchEntries(){var entries=[],catalog=window.ArchiSpotterData.countryCitySamples;
    Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){city[4].forEach(function(place){
      var pos=monumentCoordinates[place[0]];if(pos)entries.push({place:place,city:city,country:country,pos:pos});
    });});});return entries;
  }
  function clearSearch(){if(searchResults){searchResults.replaceChildren();searchResults.hidden=true;}}
  function chooseSearch(item){
    clearSearch();if(searchInput)searchInput.value=item.place[({es:0,en:1,it:2}[document.documentElement.lang]||0)];
    show();if(!map)return;map.setView(item.pos,16);
    markers.eachLayer(function(marker){if(marker.getLatLng().distanceTo(L.latLng(item.pos))<3)marker.fire('click');});
  }
  function updateSearch(){
    clearSearch();if(!searchInput||!searchResults)return;
    var query=normalize(searchInput.value);if(!query)return;
    var idx=({es:0,en:1,it:2}[document.documentElement.lang]||0);
    var matches=searchEntries().filter(function(item){return item.place.some(function(name){return normalize(name).includes(query);})||item.city.some(function(name){return normalize(name).includes(query);});}).slice(0,12);
    if(!matches.length){var none=document.createElement('p');none.textContent=({es:'Sin resultados',en:'No results',it:'Nessun risultato'})[document.documentElement.lang];searchResults.appendChild(none);}
    matches.forEach(function(item){var button=document.createElement('button');button.type='button';button.setAttribute('role','option');button.textContent=item.place[idx]+' · '+item.city[idx];button.addEventListener('click',function(){chooseSearch(item);});searchResults.appendChild(button);});
    searchResults.hidden=false;
  }
  if(searchInput){searchInput.addEventListener('input',updateSearch);searchInput.addEventListener('keydown',function(event){if(event.key==='Escape')clearSearch();if(event.key==='Enter'){var first=searchResults&&searchResults.querySelector('button');if(first){event.preventDefault();first.click();}}});}
  document.querySelectorAll('[data-lang]').forEach(function(button){button.addEventListener('click',function(){if(searchInput&&searchInput.value)updateSearch();});});
  var locationButton=document.getElementById('map-locate');
  if(locationButton)locationButton.addEventListener('click',function(){show();locate();});
  var tripMode=false;
  function showTrip(){
    tripMode=true;
    show();if(!map)return;
    if(tripLayer)map.removeLayer(tripLayer);
    tripLayer=L.layerGroup().addTo(map);
    var ids=[];try{ids=JSON.parse(localStorage.getItem('archispotter_preview_trip')||'[]');if(!Array.isArray(ids))ids=[];}catch(_){ids=[];}
    var found=[],catalog=window.ArchiSpotterData.countryCitySamples;
    Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){
      city[4].forEach(function(place){var id=city[0]+'|'+place[0],pos=monumentCoordinates[place[0]];
        if(ids.indexOf(id)>=0&&pos)found.push({id:id,pos:pos,name:place[({es:0,en:1,it:2}[document.documentElement.lang]||0)]});
      });
    });});
    found.sort(function(a,b){return ids.indexOf(a.id)-ids.indexOf(b.id);});
    var bounds=[];found.forEach(function(item,i){
      var dot=L.circleMarker(item.pos,{radius:11,color:'#ffffff',weight:2,fillColor:'#226e61',fillOpacity:1}).addTo(tripLayer);
      dot.bindTooltip(String(i+1),{permanent:true,direction:'center',className:'archi-trip-number'});
      dot.bindPopup(item.name);bounds.push(item.pos);
    });

    if(bounds.length)map.fitBounds(bounds,{padding:[35,35],maxZoom:15});
    var status=document.getElementById('map-status');
    var missing=ids.length-found.length;
    if(status)status.textContent=({es:found.length+' de '+ids.length+' paradas ubicadas'+(missing?' · '+missing+' sin coordenadas todavía':''),en:found.length+' of '+ids.length+' stops mapped'+(missing?' · '+missing+' missing coordinates':''),it:found.length+' di '+ids.length+' tappe sulla mappa'+(missing?' · '+missing+' senza coordinate':'')})[document.documentElement.lang]||found.length+' paradas ubicadas';
  }
  function applyLanguage(){
    var i=({es:0,en:1,it:2}[document.documentElement.lang]||0);
    function set(selector,values,attr){var el=document.querySelector(selector);if(el){if(attr)el.setAttribute(attr,values[i]);else el.textContent=values[i];}}
    set('[data-tab="map"] .nav-label',['Mapa','Map','Mappa']);
    set('#view-map .map-title',['Mapa arquitectónico','Architecture map','Mappa architettonica']);
    set('#view-map .map-note',['Explora los monumentos en el mapa interactivo.','Explore monuments on the interactive map.','Esplora i monumenti sulla mappa interattiva.']);
    set('#map-search',['Buscar monumento o ciudad…','Search monument or city…','Cerca monumento o città…'],'placeholder');
    set('#map-search',['Buscar monumento o ciudad','Search monument or city','Cerca monumento o città'],'aria-label');
    set('#map-locate',['◎ Mi ubicación','◎ My location','◎ La mia posizione']);
    set('#archi-map',['Mapa de monumentos de ArchiSpotter','ArchiSpotter monument map','Mappa dei monumenti di ArchiSpotter'],'aria-label');
    if(map){map.closePopup();if(!tripMode){var count=markers.getLayers().length;var catalog=window.ArchiSpotterData.countryCitySamples,total=Object.keys(catalog).reduce(function(sum,k){return sum+catalog[k].reduce(function(n,c){return n+c[4].length;},0);},0);set('#map-status',[count+' de '+total+' monumentos ubicados',count+' of '+total+' monuments mapped',count+' di '+total+' monumenti sulla mappa']);}else showTrip();}
    set('#map-location-status',locationMarker?['Ubicación aproximada mostrada.','Approximate location shown.','Posizione approssimativa visualizzata.']:['','','']);
    if(searchInput&&searchInput.value&&!searchResults.hidden)updateSearch();
  }
  var mapResizeTimer=null;
  function show() {
    init();
    if(!map)return;
    addTiles();
    if(mapResizeTimer!==null)clearTimeout(mapResizeTimer);
    mapResizeTimer=setTimeout(function(){
      mapResizeTimer=null;
      var view=document.getElementById('view-map');
      if(view&&!view.hidden&&map)map.invalidateSize();
    },60);
  }
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='map')show();});
  document.addEventListener('archispotter:saved-change',function(){if(tripMode&&map)showTrip();});
  return {applyLanguage:applyLanguage,show:show,showTrip:showTrip,coordinates:monumentCoordinates,openMonument:null};
})();
