/* CARTO Voyager monument pins; public browser tile key configured. */
window.ArchiSpotterMap = (function () {
  var map, tiles, markers, failures = 0;
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
          popup.appendChild(button);marker.bindPopup(popup,{maxWidth:220,minWidth:180}).openPopup();
        });
      });
    });});
    var status=document.getElementById('map-status');if(status)status.textContent=count+' monumentos ubicados · Catálogo de 48 en preparación';
  }
  function show() { init(); if (map) { addTiles(); setTimeout(function(){map.invalidateSize();},60); } }
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='map')show();});
  return {show:show,openMonument:null};
})();
