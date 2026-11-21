/* Resolve monument-specific thumbnails from Wikipedia's public page-image API. */
window.ArchiSpotterPhotos=(function(){
var titles={"Panteón de Agripa":"Pantheon, Rome","Fontana di Trevi":"Trevi Fountain","Foro Romano":"Roman Forum","Castillo de Sant'Angelo":"Castel Sant'Angelo","Ponte Vecchio":"Ponte Vecchio","Palazzo Vecchio":"Palazzo Vecchio","Parque Güell":"Park Güell","Casa Milà":"Casa Milà","Palacio de Cristal":"Palacio de Cristal del Retiro","Templo de Debod":"Temple of Debod","Catedral de Notre-Dame":"Notre-Dame de Paris","Basílica del Sacré-Cœur":"Sacré-Cœur, Paris","Museo del Louvre":"Louvre","Templo de Zeus Olímpico":"Temple of Olympian Zeus, Athens","Odeón de Herodes Ático":"Odeon of Herodes Atticus","Abadía de Westminster":"Westminster Abbey","Catedral de San Pablo":"St Paul's Cathedral","Edificio del Reichstag":"Reichstag building","Memorial del Holocausto":"Memorial to the Murdered Jews of Europe","Castillo de San Jorge":"São Jorge Castle","Elevador de Santa Justa":"Santa Justa Lift","Casa Rosada":"Casa Rosada","Palacio Barolo":"Palacio Barolo","Congreso de la Nación Argentina":"Palace of the Argentine National Congress","Puente de la Mujer":"Puente de la Mujer"};
var cache={};
var activeRequests=new WeakMap();
function apply(img,place,width){
 var title=titles[place[0]];if(!img)return;
 var request={title:title};activeRequests.set(img,request);
 if(!title)return;
 if(cache[title]){img.src=cache[title];return;}
 var original=img.src;
 var url='https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&redirects=1&origin=*&pithumbsize='+Math.max(width||500,500)+'&titles='+encodeURIComponent(title);
 fetch(url).then(function(r){if(!r.ok)throw Error('photo');return r.json();}).then(function(json){
  var pages=json.query&&json.query.pages;var page=pages&&Object.values(pages)[0];
  if(!page||!page.thumbnail||!page.thumbnail.source)return;
  cache[title]=page.thumbnail.source;
  if(img.isConnected&&activeRequests.get(img)===request)img.src=cache[title];
 }).catch(function(){if(img.isConnected&&activeRequests.get(img)===request&&!img.src)img.src=original;});
}
return {apply:apply};
})();
