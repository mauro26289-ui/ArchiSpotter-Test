// vB2: pantalla editorial exclusiva de Italia. No modifica el flujo de otros países.
let archiItalyCityFilter = 'Todas';
function archiItalyScrollToMonuments() {
 const target = document.getElementById('vb2-monuments-anchor');
 if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
}
function archiItalyOpenMap() {
 // Mantener el mapa original y su navegación, sin rutas ni datos inventados.
 if (typeof switchTab === 'function') switchTab('map');
 else { const btn=document.querySelector('[onclick*="switchTab(\'map\')"]'); if(btn)btn.click(); }
}
function renderVB2Italy() {
 const container=document.getElementById('vb2-italy-monuments');
 const filters=document.getElementById('vb2-italy-filters');
 if(!container||!filters||typeof monumentsData==='undefined')return;
 const all=monumentsData.filter(m=>m.country==='Italia');
 const cities=['Todas',...new Set(all.map(m=>m.city))];
 if(!cities.includes(archiItalyCityFilter))archiItalyCityFilter='Todas';
 const label=c=>c==='Todas'?(typeof tr==='function'?tr('Todas','All'):'Todas'):(typeof cityLabel==='function'?cityLabel(c):c);
 filters.replaceChildren();
 cities.forEach(c=>{
  const b=document.createElement('button');b.type='button';b.className='vb2-filter'+(archiItalyCityFilter===c?' selected':'');
  b.textContent=label(c);b.setAttribute('aria-pressed',String(archiItalyCityFilter===c));
  b.addEventListener('click',()=>{archiItalyCityFilter=c;renderVB2Italy();});filters.appendChild(b);
 });
 container.replaceChildren();
 all.filter(m=>archiItalyCityFilter==='Todas'||m.city===archiItalyCityFilter).forEach(m=>{
  const card=document.createElement('button');card.type='button';card.className='vb2-monument-card';
  const image=document.createElement('img');image.loading='lazy';image.decoding='async';image.alt=m.name;
  image.src=(m.images||[])[0]||'';image.dataset.monumentId=m.id;
  image.addEventListener('error',()=>{if(typeof handleMonumentImageError==='function')handleMonumentImageError(image);});
  const info=document.createElement('span');info.className='vb2-card-info';
  const meta=document.createElement('span');meta.className='vb2-card-meta';
  meta.textContent=(typeof cityLabel==='function'?cityLabel(m.city):m.city)+' · '+(typeof styleLabel==='function'?styleLabel(m.style):m.style);
  const name=document.createElement('strong');name.textContent=typeof monumentLabel==='function'?monumentLabel(m):m.name;
  const detail=document.createElement('span');detail.className='vb2-card-detail';
  const history=typeof monumentField==='function'?monumentField(m,'history'):m.history;
  detail.textContent=String(history||'').replace(/<[^>]*>/g,'').slice(0,120).trim()+'…';
  const action=document.createElement('span');action.className='vb2-card-action';action.textContent='Explorar  ↗';
  info.append(meta,name,detail,action);card.append(image,info);
  card.addEventListener('click',()=>openMonumentModal(m.id));container.appendChild(card);
 });
}
