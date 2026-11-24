/* Saved monuments: render Favorites and My Trip from the same catalogue and storage keys. */
window.ArchiSpotterSaved=(function(){
  var catalog=window.ArchiSpotterData.countryCitySamples;
  var storage=window.ArchiSpotterStorage;
  var keys=storage.keys;
  function lang(){return {es:0,en:1,it:2}[document.documentElement.lang]||0;}
  function labels(){return ({es:{empty:'Todavía no guardaste monumentos.',open:'Ver ficha',remove:'Quitar',count:'monumentos guardados'},en:{empty:'No monuments saved yet.',open:'View details',remove:'Remove',count:'saved monuments'},it:{empty:'Non hai ancora salvato monumenti.',open:'Apri scheda',remove:'Rimuovi',count:'monumenti salvati'}})[document.documentElement.lang]||({empty:'Todavía no guardaste monumentos.',open:'Ver ficha',remove:'Quitar',count:'monumentos guardados'});}
  function read(key){return storage.read(key);}
  function lookup(){var result={};Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){city[4].forEach(function(place){result[city[0]+'|'+place[0]]={country:country,city:city,place:place};});});});return result;}
  function render(type){
    var root=document.getElementById('saved-'+type);if(!root)return;
    root.replaceChildren();var dict=lookup(),items=read(keys[type]),words=labels(),idx=lang(),valid=items.filter(function(id){return !!dict[id];});
    if(!valid.length){var empty=document.createElement('p');empty.className='saved-empty';empty.textContent=words.empty;root.appendChild(empty);return;}
    var count=document.createElement('p');count.className='saved-count';count.textContent=valid.length+' '+words.count;root.appendChild(count);
    if(type==='trip'){
      var routeNote=document.createElement('p');routeNote.className='saved-count';
      routeNote.textContent=({es:'Abrí las paradas en Google Maps y ajustá allí el orden. En iPhone se envían hasta 5 paradas por tramo.',en:'Open stops in Google Maps and adjust their order there. On iPhone, each section contains up to 5 stops.',it:'Apri le tappe in Google Maps e riordinale lì. Su iPhone, ogni tratto contiene fino a 5 tappe.'})[document.documentElement.lang];
      root.appendChild(routeNote);
      var coordinates=window.ArchiSpotterMap.coordinates;
      var mapped=valid.map(function(id){var entry=dict[id];return {id:id,pos:coordinates[entry.place[0]]};});
      var unavailable=mapped.filter(function(entry){return !entry.pos;});
      if(unavailable.length){var warning=document.createElement('p');warning.className='saved-count';warning.textContent=unavailable.length+' sin coordenadas disponibles';root.appendChild(warning);}
      var located=mapped.filter(function(entry){return !!entry.pos;});
      if(located.length){
        var groups=[];
        if(located.length<=5)groups.push(located);
        else {for(var at=0;at<located.length-1;at+=4)groups.push(located.slice(at,at+5));}
        groups.forEach(function(group,index){
          var actions=document.createElement('div');actions.className='trip-map-actions';
          var button=document.createElement('button');button.type='button';
          button.textContent=({es:'Abrir recorrido en Google Maps',en:'Open route in Google Maps',it:'Apri percorso in Google Maps'})[document.documentElement.lang]+(groups.length>1?' · '+(index+1)+'/'+groups.length:'');
          button.addEventListener('click',function(){
            var points=group.map(function(entry){return entry.pos.join(',');});
            var url='https://www.google.com/maps/dir/?api=1&travelmode=walking';
            if(points.length===1)url+='&destination='+encodeURIComponent(points[0]);
            else {url+='&origin='+encodeURIComponent(points[0])+'&destination='+encodeURIComponent(points[points.length-1]);if(points.length>2)url+='&waypoints='+encodeURIComponent(points.slice(1,-1).join('|'));}
            window.location.assign(url);
          });actions.appendChild(button);root.appendChild(actions);
        });
      }
    }
    valid.forEach(function(id,index){
      var item=dict[id],card=document.createElement('article');card.className='saved-card';
      var photo=document.createElement('img');var pair=window.ArchiSpotterPhotos&&window.ArchiSpotterPhotos.getImages(item.place);photo.src=pair&&pair.length?pair[0]:'https://images.unsplash.com/'+item.place[3]+'?auto=format&fit=crop&w=360&q=75';photo.alt='';photo.loading='lazy';card.appendChild(photo);
      if(type==='trip'){
        var order=document.createElement('div');order.className='trip-order';
        var number=document.createElement('span');number.className='trip-order-number';number.textContent=String(index+1);order.appendChild(number);
        function move(direction){
          var current=read(keys.trip),at=current.indexOf(id),target=at+direction;
          if(at<0||target<0||target>=current.length)return;
          var other=current[target];current[target]=id;current[at]=other;
          if(!storage.write(keys.trip,current))return;
          document.dispatchEvent(new CustomEvent('archispotter:saved-change'));
        }
        var up=document.createElement('button');up.type='button';up.textContent='↑';up.disabled=index===0;up.setAttribute('aria-label',({es:'Subir parada',en:'Move stop up',it:'Sposta tappa su'})[document.documentElement.lang]||'Subir parada');up.addEventListener('click',function(){move(-1);});order.appendChild(up);
        var down=document.createElement('button');down.type='button';down.textContent='↓';down.disabled=index===valid.length-1;down.setAttribute('aria-label',({es:'Bajar parada',en:'Move stop down',it:'Sposta tappa giù'})[document.documentElement.lang]||'Bajar parada');down.addEventListener('click',function(){move(1);});order.appendChild(down);
        card.appendChild(order);
      }
      var body=document.createElement('div');body.className='saved-card-body';var title=document.createElement('strong');title.textContent=item.place[idx];body.appendChild(title);
      var city=document.createElement('span');city.textContent=item.city[idx];body.appendChild(city);
      var actions=document.createElement('div');actions.className='saved-card-actions';
      var open=document.createElement('button');open.type='button';open.textContent=words.open;open.addEventListener('click',function(){if(window.ArchiSpotterMap&&window.ArchiSpotterMap.openMonument)window.ArchiSpotterMap.openMonument(item.place,item.city,item.country);});actions.appendChild(open);
      var remove=document.createElement('button');remove.type='button';remove.className='saved-remove';remove.textContent=words.remove;remove.addEventListener('click',function(){if(!storage.write(keys[type],read(keys[type]).filter(function(x){return x!==id;})))return;render(type);document.dispatchEvent(new CustomEvent('archispotter:saved-change'));});actions.appendChild(remove);
      body.appendChild(actions);card.appendChild(body);root.appendChild(card);
    });
  }
  function renderAll(){render('trip');render('favorites');}
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='trip'||e.detail==='favorites')render(e.detail);});
  document.addEventListener('archispotter:saved-change',renderAll);
  document.querySelectorAll('[data-lang]').forEach(function(button){button.addEventListener('click',renderAll);});
  renderAll();return {render:renderAll};
})();
