/* Resolve monument-specific thumbnails from Wikipedia's public page-image API. */
window.ArchiSpotterPhotos=(function(){
var titles={"Panteón de Agripa":"Pantheon, Rome","Fontana di Trevi":"Trevi Fountain","Foro Romano":"Roman Forum","Castillo de Sant'Angelo":"Castel Sant'Angelo","Ponte Vecchio":"Ponte Vecchio","Palazzo Vecchio":"Palazzo Vecchio","Parque Güell":"Park Güell","Casa Milà":"Casa Milà","Palacio de Cristal":"Palacio de Cristal del Retiro","Templo de Debod":"Temple of Debod","Catedral de Notre-Dame":"Notre-Dame de Paris","Basílica del Sacré-Cœur":"Sacré-Cœur, Paris","Museo del Louvre":"Louvre","Templo de Zeus Olímpico":"Temple of Olympian Zeus, Athens","Odeón de Herodes Ático":"Odeon of Herodes Atticus","Abadía de Westminster":"Westminster Abbey","Catedral de San Pablo":"St Paul's Cathedral","Edificio del Reichstag":"Reichstag building","Memorial del Holocausto":"Memorial to the Murdered Jews of Europe","Castillo de San Jorge":"São Jorge Castle","Elevador de Santa Justa":"Santa Justa Lift","Casa Rosada":"Casa Rosada","Palacio Barolo":"Palacio Barolo","Congreso de la Nación Argentina":"Palace of the Argentine National Congress","Puente de la Mujer":"Puente de la Mujer","Catedral de Milán":"Milan Cathedral","Palacio Real":"Royal Palace of Madrid","Puerta de Alcalá":"Puerta de Alcalá","Alhambra":"Alhambra","Torre Eiffel":"Eiffel Tower","Arco del Triunfo":"Arc de Triomphe","Palacio de Versalles":"Palace of Versailles","Templo de Apolo":"Temple of Apollo (Delphi)","Palacio de Westminster":"Palace of Westminster","Tower Bridge":"Tower Bridge","Termas romanas":"Roman Baths (Bath)","Puerta de Brandeburgo":"Brandenburg Gate","Catedral de Berlín":"Berlin Cathedral","Catedral de Colonia":"Cologne Cathedral","Torre de Belém":"Belém Tower","Monasterio de los Jerónimos":"Jerónimos Monastery","Puente Don Luis I":"Dom Luís I Bridge","Obelisco":"Obelisco de Buenos Aires","Teatro Colón":"Teatro Colón"};
var curated={
 'Coliseo':[
  'https://unsplash.com/photos/s87bBFZviAU/download?force=true&w=1400',
  'https://unsplash.com/photos/nAb-SFzL1GM/download?force=true&w=1400'
 ],
 'Panteón de Agripa':[
  'https://unsplash.com/photos/fbYpd5Xubf8/download?force=true&w=1400',
  'https://images.unsplash.com/photo-1654874324486-4acfae9228e4?auto=format&fit=crop&w=1400&q=85'
 ]
,
 'Fontana di Trevi':['https://unsplash.com/photos/I1Lv2yX67GI/download?force=true&w=1400','https://unsplash.com/photos/gZKzBhsO6KY/download?force=true&w=1400'],
 'Foro Romano':['https://unsplash.com/photos/Nu8ZBfP5zD8/download?force=true&w=1400','https://unsplash.com/photos/Fhcgt6yduFA/download?force=true&w=1400'],
 "Castillo de Sant'Angelo":['https://unsplash.com/photos/WuFn2LrYSzU/download?force=true&w=1400','https://unsplash.com/photos/G2K9hytvKeg/download?force=true&w=1400'],
 'Catedral de Florencia':['https://unsplash.com/photos/PXLezcBjL7M/download?force=true&w=1400','https://unsplash.com/photos/GiQ1ggqig2k/download?force=true&w=1400'],
 'Ponte Vecchio':['https://unsplash.com/photos/JnTdxjelx6E/download?force=true&w=1400','https://unsplash.com/photos/2LE6eoeh5jo/download?force=true&w=1400'],
 'Palazzo Vecchio':['https://unsplash.com/photos/bq5r3Pve1nI/download?force=true&w=1400','https://unsplash.com/photos/WEamHW0aQyU/download?force=true&w=1400'],
 'Sagrada Familia':['https://unsplash.com/photos/D8n_RJ3keAw/download?force=true&w=1400','https://unsplash.com/photos/O_Hkk-MXKAE/download?force=true&w=1400'],
 'Casa Batlló':['https://unsplash.com/photos/LSscVPEyQpI/download?force=true&w=1400','https://unsplash.com/photos/-FSYoN9OCsM/download?force=true&w=1400'],
 'Parque Güell':['https://unsplash.com/photos/GPbn2G1fdMo/download?force=true&w=1400','https://unsplash.com/photos/G5lnbfU4i5A/download?force=true&w=1400'],
 'Casa Milà':['https://unsplash.com/photos/LTCLy5ZFGrY/download?force=true&w=1400','https://unsplash.com/photos/gKvF99QzdBo/download?force=true&w=1400'],
 'Partenón':[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Parthenon.jpg?width=1400',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Parthenon%20-%20facade%20est.jpg?width=1400'
 ],
 'Erecteión':[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Erechtheion%20caryatids.jpg?width=1400',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Caryatids%20erechtheum%20Acropolis%20Athens.jpg?width=1400'
 ],
 'Castillo de Chillon':[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/001%20Chateau%20de%20Chillon%20and%20Dents%20du%20Midi%20Photo%20by%20Giles%20Laurent.jpg?width=1400',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ch%C3%A2teau%20de%20Chillon%2C%20Cour%20int%C3%A9rieure%2C%20Veytaux%2C%20Vaud.jpg?width=1400'
 ]
};
function getImages(place){return curated[place[0]]?curated[place[0]].slice():[];}
var cache=Object.create(null);
var pending=Object.create(null);
var activeRequests=new WeakMap();
function apply(img,place,width){
 var title=titles[place[0]];if(!img)return;
 if(curated[place[0]]){activeRequests.set(img,{curated:true});img.src=curated[place[0]][0];return;}
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
