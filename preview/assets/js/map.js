/* CARTO Voyager monument pins; public browser tile key configured. */
window.ArchiSpotterMap = (function () {
  var map, tiles, markers, tripLayer, locationMarker, locationCircle, failures = 0;
  var monumentCoordinates = {"Coliseo":[41.89021,12.49223],"Catedral de Florencia":[43.7731,11.256],"Sagrada Familia":[41.4036,2.1744],"Casa Batlló":[41.3916,2.1649],"Palacio Real":[40.41795,-3.7143],"Puerta de Alcalá":[40.4201,-3.6889],"Torre Eiffel":[48.85837,2.29448],"Arco del Triunfo":[48.8738,2.295],"Palacio de Versalles":[48.8049,2.1204],"Partenón":[37.9715,23.7267],"Erecteión":[37.972,23.7265],"Templo de Apolo":[38.4825,22.501],"Palacio de Westminster":[51.4995,-0.1248],"Tower Bridge":[51.5055,-0.0754],"Termas romanas":[51.381,-2.3595],"Puerta de Brandeburgo":[52.5163,13.3777],"Catedral de Berlín":[52.5191,13.401],"Catedral de Colonia":[50.9413,6.9583],"Torre de Belém":[38.6916,-9.216],"Monasterio de los Jerónimos":[38.6979,-9.206],"Puente Don Luis I":[41.1397,-8.6094],"Obelisco":[-34.6037,-58.3816],"Teatro Colón":[-34.6011,-58.383]};
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
      if (status) status.textContent = 'CARTO no responde. Se muestra OpenStreetMap.';
    });
    tiles.addTo(map);
  }
  function init() {
    if (map || !window.L) { if (!window.L) document.getElementById('map-status').textContent = 'No se pudo cargar el mapa. Comprueba la conexión.'; return; }
    map = L.map('archi-map', {worldCopyJump:true, maxBounds:[[-85,-180],[85,180]], maxBoundsViscosity:1, zoomControl:true}).setView([46.5,9],4);
    addTiles();
    markers = L.layerGroup().addTo(map);
    var catalog=window.ArchiSpotterData.countryCitySamples,count=0;
    Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){
      if(country==='ar'&&city[0]!=='Buenos Aires')return;
      city[4].forEach(function(place){
        var pos=monumentCoordinates[place[0]];if(!pos)return;
        count++;
        var marker=L.marker(pos).addTo(markers);
        marker.on('click',function(){
          var lang=document.documentElement.lang,idx={es:0,en:1,it:2}[lang]||0;
          var popup=document.createElement('div');popup.className='archi-map-popup';
          var photo=document.createElement('img');photo.src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=360&q=75';photo.alt='';photo.loading='lazy';popup.appendChild(photo);
          var title=document.createElement('strong');title.textContent=place[idx];popup.appendChild(title);
          var cityLabel=document.createElement('span');cityLabel.textContent=city[idx];popup.appendChild(cityLabel);
          var button=document.createElement('button');button.type='button';button.textContent={es:'Ver ficha',en:'View details',it:'Apri scheda'}[lang]||'Ver ficha';
          button.addEventListener('click',function(){if(window.ArchiSpotterMap.openMonument)window.ArchiSpotterMap.openMonument(place,city,country);});
          popup.appendChild(button);
          var directions=document.createElement('button');directions.type='button';directions.className='archi-directions';
          directions.textContent={es:'Cómo llegar',en:'Directions',it:'Indicazioni'}[lang]||'Cómo llegar';
          directions.addEventListener('click',function(){
            var destination=pos[0]+','+pos[1];
            window.open('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)+'&travelmode=walking','_blank','noopener,noreferrer');
          });
          popup.appendChild(directions);marker.bindPopup(popup,{maxWidth:220,minWidth:180}).openPopup();
        });
      });
    });});
    var status=document.getElementById('map-status');if(status)status.textContent=count+' monumentos ubicados · Catálogo de 48 en preparación';
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
  var locationButton=document.getElementById('map-locate');
  if(locationButton)locationButton.addEventListener('click',function(){show();locate();});
  function showTrip(){
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
    if(bounds.length>1){
      // Straight connectors indicate selected stop order, not a calculated walking route.
      L.polyline(bounds,{color:'#226e61',weight:3,opacity:.8,dashArray:'7 9',interactive:false}).addTo(tripLayer);
    }
    if(bounds.length)map.fitBounds(bounds,{padding:[35,35],maxZoom:15});
    var status=document.getElementById('map-status');
    if(status)status.textContent=({es:found.length+' paradas ordenadas · Línea orientativa, no ruta peatonal',en:found.length+' ordered stops · Straight-line guide, not a walking route',it:found.length+' tappe ordinate · Linea indicativa, non percorso pedonale'})[document.documentElement.lang]||found.length+' paradas ordenadas';
  }
  function show() { init(); if (map) { addTiles(); setTimeout(function(){map.invalidateSize();},60); } }
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='map')show();});
  return {show:show,showTrip:showTrip,openMonument:null};
})();
