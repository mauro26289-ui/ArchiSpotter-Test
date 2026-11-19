// vB3 — Cuatro pantallas editoriales nuevas; Italia conserva vB2.
const vb3CountryContent={
 'España':{poetic:'Arquitectura que desafía el tiempo.',headline:'De la piedra medieval al modernismo',intro:'Descubrí ciudades y monumentos donde conviven siglos de historia, arte e innovación.'},
 'Suiza':{poetic:'Entre ciudades y montañas.',headline:'Un patrimonio para descubrir',intro:'Arquitectura histórica, detalles singulares y paisajes que acompañan cada recorrido.'},
 'Francia':{poetic:'Arte, historia y grandes ideas.',headline:'Una mirada a la arquitectura francesa',intro:'De las grandes catedrales a los monumentos que transformaron la historia de sus ciudades.'},
 'Reino Unido':{poetic:'Historias escritas en sus ciudades.',headline:'Siglos de arquitectura y memoria',intro:'Recorré edificios y lugares que cuentan la evolución de una cultura arquitectónica extraordinaria.'}
};
let vb3CityFilter='Todas',vb3CurrentCountry='';
function renderVB3Country(country){
 const cfg=vb3CountryContent[country];if(!cfg||typeof monumentsData==='undefined')return;
 if(vb3CurrentCountry!==country){vb3CurrentCountry=country;vb3CityFilter='Todas';}
 const all=monumentsData.filter(m=>m.country===country), cities=['Todas',...new Set(all.map(m=>m.city))];
 const el=id=>document.getElementById(id);
 el('vb3-title').textContent=typeof countryLabel==='function'?countryLabel(country):country;
 el('vb3-poetic').textContent=cfg.poetic;
 el('vb3-headline').textContent=cfg.headline;
 el('vb3-intro').textContent=cfg.intro;
 el('vb3-kicker').textContent='DESCUBRÍ '+country.toLocaleUpperCase('es');
 el('vb3-stat').textContent=all.length+' monumentos · '+(cities.length-1)+' ciudades';
 el('vb3-count').textContent=all.length+' LUGARES PARA DESCUBRIR';
 const selectedCoverIds={'España':'sagrada-familia','Suiza':'chillon-castle','Francia':'fr-notre-dame','Reino Unido':'world-big-ben-elizabeth-tower'};const cover=all.find(m=>m.id===selectedCoverIds[country])||all.find(m=>m.images&&m.images.length);el('vb3-cover').src=cover?cover.images[0]:'';el('vb3-cover').alt=cover?cover.name:country;
 const filters=el('vb3-filters');filters.replaceChildren();
 cities.forEach(city=>{const b=document.createElement('button');b.type='button';b.className='vb2-filter'+(vb3CityFilter===city?' selected':'');b.textContent=city==='Todas'?(typeof tr==='function'?tr('Todas','All'):'Todas'):(typeof cityLabel==='function'?cityLabel(city):city);b.setAttribute('aria-pressed',String(vb3CityFilter===city));b.addEventListener('click',()=>{vb3CityFilter=city;renderVB3Country(country)});filters.append(b)});
 const list=el('vb3-monuments');list.replaceChildren();
 all.filter(m=>vb3CityFilter==='Todas'||m.city===vb3CityFilter).forEach(m=>{
  const card=document.createElement('button');card.type='button';card.className='vb2-monument-card';
  const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.alt=m.name;img.src=(m.images||[])[0]||'';img.dataset.monumentId=m.id;
  img.addEventListener('error',()=>{if(typeof handleMonumentImageError==='function')handleMonumentImageError(img)});
  const info=document.createElement('span');info.className='vb2-card-info';
  const meta=document.createElement('span');meta.className='vb2-card-meta';meta.textContent=(typeof cityLabel==='function'?cityLabel(m.city):m.city)+' · '+(typeof styleLabel==='function'?styleLabel(m.style):m.style);
  const name=document.createElement('strong');name.textContent=typeof monumentLabel==='function'?monumentLabel(m):m.name;
  const detail=document.createElement('span');detail.className='vb2-card-detail';detail.textContent=String((typeof monumentField==='function'?monumentField(m,'history'):m.history)||'').replace(/<[^>]*>/g,'').slice(0,120).trim()+'…';
  const action=document.createElement('span');action.className='vb2-card-action';action.textContent='Explorar ↗';
  info.append(meta,name,detail,action);card.append(img,info);card.addEventListener('click',()=>openMonumentModal(m.id));list.append(card);
 });
}
