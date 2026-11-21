/* Resolve monument-specific thumbnails from Wikipedia's public page-image API. */
window.ArchiSpotterPhotos=(function(){
var titles={"Panteón de Agripa":"Pantheon, Rome","Fontana di Trevi":"Trevi Fountain","Foro Romano":"Roman Forum","Castillo de Sant'Angelo":"Castel Sant'Angelo","Ponte Vecchio":"Ponte Vecchio","Palazzo Vecchio":"Palazzo Vecchio","Parque Güell":"Park Güell","Casa Milà":"Casa Milà","Palacio de Cristal":"Palacio de Cristal del Retiro","Templo de Debod":"Temple of Debod","Catedral de Notre-Dame":"Notre-Dame de Paris","Basílica del Sacré-Cœur":"Sacré-Cœur, Paris","Museo del Louvre":"Louvre","Templo de Zeus Olímpico":"Temple of Olympian Zeus, Athens","Odeón de Herodes Ático":"Odeon of Herodes Atticus","Abadía de Westminster":"Westminster Abbey","Catedral de San Pablo":"St Paul's Cathedral","Edificio del Reichstag":"Reichstag building","Memorial del Holocausto":"Memorial to the Murdered Jews of Europe","Castillo de San Jorge":"São Jorge Castle","Elevador de Santa Justa":"Santa Justa Lift","Casa Rosada":"Casa Rosada","Palacio Barolo":"Palacio Barolo","Congreso de la Nación Argentina":"Palace of the Argentine National Congress","Puente de la Mujer":"Puente de la Mujer"};
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
 'Castillo de Sant'Angelo':['https://unsplash.com/photos/WuFn2LrYSzU/download?force=true&w=1400','https://unsplash.com/photos/G2K9hytvKeg/download?force=true&w=1400'],
 'Catedral de Florencia':['https://unsplash.com/photos/PXLezcBjL7M/download?force=true&w=1400','https://unsplash.com/photos/GiQ1ggqig2k/download?force=true&w=1400'],
 'Ponte Vecchio':['https://unsplash.com/photos/JnTdxjelx6E/download?force=true&w=1400','https://unsplash.com/photos/2LE6eoeh5jo/download?force=true&w=1400'],
 'Palazzo Vecchio':['https://unsplash.com/photos/bq5r3Pve1nI/download?force=true&w=1400','https://unsplash.com/photos/WEamHW0aQyU/download?force=true&w=1400'],
 'Sagrada Familia':['https://unsplash.com/photos/D8n_RJ3keAw/download?force=true&w=1400','https://unsplash.com/photos/O_Hkk-MXKAE/download?force=true&w=1400'],
 'Casa Batlló':['https://unsplash.com/photos/LSscVPEyQpI/download?force=true&w=1400','https://unsplash.com/photos/-FSYoN9OCsM/download?force=true&w=1400'],
 'Parque Güell':['https://unsplash.com/photos/GPbn2G1fdMo/download?force=true&w=1400','https://unsplash.com/photos/G5lnbfU4i5A/download?force=true&w=1400'],
 'Casa Milà':['https://unsplash.com/photos/LTCLy5ZFGrY/download?force=true&w=1400','https://unsplash.com/photos/gKvF99QzdBo/download?force=true&w=1400']
};
function getImages(place){return curated[place[0]]?curated[place[0]].slice():[];}
var cache={};
var activeRequests=new WeakMap();
function apply(img,place,width){
 var title=titles[place[0]];if(!img)return;
 if(curated[place[0]]){activeRequests.set(img,{curated:true});img.src=curated[place[0]][0];return;}
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
return {apply:apply,getImages:getImages};
})();
