/* Resolve monument-specific thumbnails from Wikipedia's public page-image API. */
window.ArchiSpotterPhotos=(function(){
var titles={"Panteón de Agripa":"Pantheon, Rome","Fontana di Trevi":"Trevi Fountain","Foro Romano":"Roman Forum","Castillo de Sant'Angelo":"Castel Sant'Angelo","Ponte Vecchio":"Ponte Vecchio","Palazzo Vecchio":"Palazzo Vecchio","Parque Güell":"Park Güell","Casa Milà":"Casa Milà","Palacio de Cristal":"Palacio de Cristal del Retiro","Templo de Debod":"Temple of Debod","Catedral de Notre-Dame":"Notre-Dame de Paris","Basílica del Sacré-Cœur":"Sacré-Cœur, Paris","Museo del Louvre":"Louvre","Templo de Zeus Olímpico":"Temple of Olympian Zeus, Athens","Odeón de Herodes Ático":"Odeon of Herodes Atticus","Abadía de Westminster":"Westminster Abbey","Catedral de San Pablo":"St Paul's Cathedral","Edificio del Reichstag":"Reichstag building","Memorial del Holocausto":"Memorial to the Murdered Jews of Europe","Castillo de San Jorge":"São Jorge Castle","Elevador de Santa Justa":"Santa Justa Lift","Casa Rosada":"Casa Rosada","Palacio Barolo":"Palacio Barolo","Congreso de la Nación Argentina":"Palace of the Argentine National Congress","Puente de la Mujer":"Puente de la Mujer","Catedral de Milán":"Milan Cathedral","Palacio Real":"Royal Palace of Madrid","Puerta de Alcalá":"Puerta de Alcalá","Alhambra":"Alhambra","Torre Eiffel":"Eiffel Tower","Arco del Triunfo":"Arc de Triomphe","Palacio de Versalles":"Palace of Versailles","Templo de Apolo":"Temple of Apollo (Delphi)","Palacio de Westminster":"Palace of Westminster","Tower Bridge":"Tower Bridge","Termas romanas":"Roman Baths (Bath)","Puerta de Brandeburgo":"Brandenburg Gate","Catedral de Berlín":"Berlin Cathedral","Catedral de Colonia":"Cologne Cathedral","Torre de Belém":"Belém Tower","Monasterio de los Jerónimos":"Jerónimos Monastery","Puente Don Luis I":"Dom Luís I Bridge","Obelisco":"Obelisco de Buenos Aires","Teatro Colón":"Teatro Colón"};
function getImages(place){var pair=window.ArchiSpotterPhotoPairs&&window.ArchiSpotterPhotoPairs[place[0]];return pair&&pair.length===2?pair.map(function(photo){return photo.url;}):[];}
var cache=Object.create(null);
var pending=Object.create(null);
var activeRequests=new WeakMap();
function apply(img,place,width){
 var title=titles[place[0]];if(!img)return;
 var selected=getImages(place);
 if(selected.length){activeRequests.set(img,{curated:true});img.src=selected[0];return;}
 var request={title:title};activeRequests.set(img,request);
 if(!title)return;
 var original=img.getAttribute('src')||'';
 var size=Math.max(width||500,500);
 var key=title+'|'+size;
 if(cache[key]){img.src=cache[key];return;}
 if(!pending[key]){
  var url='https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&redirects=1&origin=*&pithumbsize='+size+'&titles='+encodeURIComponent(title);
  pending[key]=fetch(url).then(function(r){if(!r.ok)throw Error('photo');return r.json();}).then(function(json){
   var pages=json.query&&json.query.pages;var page=pages&&Object.values(pages)[0];
   if(!page||!page.thumbnail||!page.thumbnail.source)throw Error('no thumbnail');
   cache[key]=page.thumbnail.source;
   return cache[key];
  }).finally(function(){delete pending[key];});
 }
 pending[key].then(function(source){
  if(img.isConnected&&activeRequests.get(img)===request)img.src=source;
 }).catch(function(){
  if(img.isConnected&&activeRequests.get(img)===request&&!img.getAttribute('src')&&original)img.src=original;
 });
}
return {apply:apply,getImages:getImages};
})();
