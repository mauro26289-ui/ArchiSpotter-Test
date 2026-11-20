/* CARTO basemap, city-center preview pins; no API key is embedded. */
window.ArchiSpotterMap = (function () {
  var map, tiles, markers, activeStyle, failures = 0;
  var cityCoordinates = { 'Roma':[41.9028,12.4964], 'Florencia':[43.7696,11.2558], 'Barcelona':[41.3874,2.1686], 'Madrid':[40.4168,-3.7038], 'París':[48.8566,2.3522], 'Versalles':[48.8014,2.1301], 'Atenas':[37.9838,23.7275], 'Delfos':[38.4824,22.5010], 'Londres':[51.5074,-0.1278], 'Bath':[51.3811,-2.3590], 'Berlín':[52.5200,13.4050], 'Colonia':[50.9375,6.9603], 'Lisboa':[38.7223,-9.1393], 'Oporto':[41.1579,-8.6291], 'Buenos Aires':[-34.6037,-58.3816] };
  var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  function dark() { return document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); }
  function style() { return dark() ? 'dark_all' : 'light_all'; }
  function addTiles() {
    var wanted = style(); if (tiles && wanted === activeStyle) return;
    activeStyle = wanted; failures = 0;
    if (tiles) map.removeLayer(tiles);
    tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/' + wanted + '/{z}/{x}/{y}{r}.png', {subdomains:'abcd', maxZoom:19, attribution:attribution, crossOrigin:true});
    tiles.on('tileerror', function () {
      if (++failures < 5 || !tiles || tiles._archiFallback) return;
      var old = tiles; map.removeLayer(old);
      tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
      tiles._archiFallback = true; tiles.addTo(map);
      var status = document.getElementById('map-status'); if (status) status.textContent = 'CARTO no responde. Se muestra OpenStreetMap.';
    });
    tiles.addTo(map);
  }
  function init() {
    if (map || !window.L) { if (!window.L) document.getElementById('map-status').textContent = 'No se pudo cargar el mapa. Comprueba la conexión.'; return; }
    map = L.map('archi-map', {worldCopyJump:true, maxBounds:[[-85,-180],[85,180]], maxBoundsViscosity:1, zoomControl:true}).setView([46.5,9],4);
    addTiles();
    markers = L.layerGroup().addTo(map);
    var catalog = window.ArchiSpotterData.countryCitySamples;
    Object.keys(catalog).forEach(function(country) { catalog[country].forEach(function(city) {
      if (country === 'ar' && city[0] !== 'Buenos Aires') return;
      var pos = cityCoordinates[city[0]]; if (!pos) return;
      L.marker(pos).bindPopup('<strong>' + city[0] + '</strong>').addTo(markers);
    }); });
    if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change',addTiles); else if (mq.addListener) mq.addListener(addTiles); }
  }
  function show() { init(); if (map) { addTiles(); setTimeout(function(){map.invalidateSize();},60); } }
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='map')show();});
  return {show:show};
})();
