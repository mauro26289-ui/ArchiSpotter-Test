/* Saved monuments: render Favorites and My Trip from the same catalogue and storage keys. */
window.ArchiSpotterSaved=(function(){
  var catalog=window.ArchiSpotterData.countryCitySamples;
  var keys={trip:'archispotter_preview_trip',favorites:'archispotter_preview_favorites'};
  function lang(){return {es:0,en:1,it:2}[document.documentElement.lang]||0;}
  function labels(){return ({es:{empty:'Todavía no guardaste monumentos.',open:'Ver ficha',remove:'Quitar',count:'monumentos guardados'},en:{empty:'No monuments saved yet.',open:'View details',remove:'Remove',count:'saved monuments'},it:{empty:'Non hai ancora salvato monumenti.',open:'Apri scheda',remove:'Rimuovi',count:'monumenti salvati'}})[document.documentElement.lang]||({empty:'Todavía no guardaste monumentos.',open:'Ver ficha',remove:'Quitar',count:'monumentos guardados'});}
  function read(key){try{var data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data.filter(function(x){return typeof x==='string';}):[];}catch(_){return [];}}
  function lookup(){var result={};Object.keys(catalog).forEach(function(country){catalog[country].forEach(function(city){city[4].forEach(function(place){result[city[0]+'|'+place[0]]={country:country,city:city,place:place};});});});return result;}
  function render(type){
    var root=document.getElementById('saved-'+type);if(!root)return;
    root.replaceChildren();var dict=lookup(),items=read(keys[type]),words=labels(),idx=lang(),valid=items.filter(function(id){return !!dict[id];});
    if(!valid.length){var empty=document.createElement('p');empty.className='saved-empty';empty.textContent=words.empty;root.appendChild(empty);return;}
    var count=document.createElement('p');count.className='saved-count';count.textContent=valid.length+' '+words.count;root.appendChild(count);
    valid.forEach(function(id){
      var item=dict[id],card=document.createElement('article');card.className='saved-card';
      var photo=document.createElement('img');photo.src='https://images.unsplash.com/'+item.place[3]+'?auto=format&fit=crop&w=360&q=75';photo.alt='';photo.loading='lazy';card.appendChild(photo);
      var body=document.createElement('div');body.className='saved-card-body';var title=document.createElement('strong');title.textContent=item.place[idx];body.appendChild(title);
      var city=document.createElement('span');city.textContent=item.city[idx];body.appendChild(city);
      var actions=document.createElement('div');actions.className='saved-card-actions';
      var open=document.createElement('button');open.type='button';open.textContent=words.open;open.addEventListener('click',function(){if(window.ArchiSpotterMap&&window.ArchiSpotterMap.openMonument)window.ArchiSpotterMap.openMonument(item.place,item.city,item.country);});actions.appendChild(open);
      var remove=document.createElement('button');remove.type='button';remove.className='saved-remove';remove.textContent=words.remove;remove.addEventListener('click',function(){try{localStorage.setItem(keys[type],JSON.stringify(read(keys[type]).filter(function(x){return x!==id;})));}catch(_){}render(type);document.dispatchEvent(new CustomEvent('archispotter:saved-change'));});actions.appendChild(remove);
      body.appendChild(actions);card.appendChild(body);root.appendChild(card);
    });
  }
  function renderAll(){render('trip');render('favorites');}
  document.addEventListener('archispotter:tab',function(e){if(e.detail==='trip'||e.detail==='favorites')render(e.detail);});
  document.addEventListener('archispotter:saved-change',renderAll);
  document.querySelectorAll('[data-lang]').forEach(function(button){button.addEventListener('click',renderAll);});
  renderAll();return {render:renderAll};
})();
