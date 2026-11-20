/* Monument details: isolated state, persistence and presentation. */
window.ArchiSpotterMonuments = (function () {
  function init(currentLang, strings) {
      var selectedMonument=null, selectedMonumentCity=null;
      function monumentKey(place,city) { return city[0]+'|'+place[0]; }
      function storedMonumentSet(key) {
        try {var a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a:[];}catch(_){return [];}
      }
      function updateMonumentActions() {
        if(!selectedMonument)return;
        var key=monumentKey(selectedMonument,selectedMonumentCity);
        document.getElementById('monument-favorite').setAttribute('aria-pressed',String(storedMonumentSet('archispotter_preview_favorites').includes(key)));
        document.getElementById('monument-trip').setAttribute('aria-pressed',String(storedMonumentSet('archispotter_preview_trip').includes(key)));
      }
      function toggleMonument(key) {
        if(!selectedMonument)return;
        var id=monumentKey(selectedMonument,selectedMonumentCity);
        var items=storedMonumentSet(key);
        items=items.includes(id)?items.filter(function(x){return x!==id;}):items.concat(id);
        try{localStorage.setItem(key,JSON.stringify(items));}catch(_){}
        updateMonumentActions();
        document.dispatchEvent(new CustomEvent('archispotter:saved-change'));
      }
      document.getElementById('monument-favorite').addEventListener('click',function(){toggleMonument('archispotter_preview_favorites');});
      document.getElementById('monument-trip').addEventListener('click',function(){toggleMonument('archispotter_preview_trip');});
      function openMonument(place,city) {
        selectedMonument=place; selectedMonumentCity=city;
        renderMonument();
        document.getElementById('city-detail').hidden=true;
        document.getElementById('monument-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      }
      function renderMonument() {
        if(!selectedMonument)return;
        var idx={es:0,en:1,it:2}[currentLang()]||0;
        var place=selectedMonument,city=selectedMonumentCity;
        document.getElementById('monument-photo').src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=1100&q=80';
        if(window.ArchiSpotterPhotos)window.ArchiSpotterPhotos.apply(document.getElementById('monument-photo'),place,1100);
        document.getElementById('monument-name').textContent=place[idx];
        document.getElementById('monument-photo').alt=place[idx];
        document.getElementById('monument-photo-trigger').setAttribute('aria-label',strings[currentLang()].zoomPhoto+' '+place[idx]);
        document.getElementById('monument-location').textContent=city[idx]+' · '+document.getElementById('country-detail-name').textContent;
        var entry=window.ArchiSpotterEditorial&&window.ArchiSpotterEditorial[place[0]];
        var language=currentLang();
        document.getElementById('monument-meta').textContent=place[0]==='Coliseo'?['Arquitectura romana · 70–80 d. C.','Roman architecture · AD 70–80','Architettura romana · 70–80 d.C.'][idx]:strings[language].metaPending;
        document.getElementById('monument-story-text').textContent=entry?entry.history[language]:strings[language].storyPending;
        document.getElementById('monument-story-heading').textContent=entry?({es:'Historia',en:'History',it:'Storia'})[language]:strings[language].monumentStoryTitle;
        var extra=document.getElementById('monument-editorial');extra.hidden=!entry;
        if(entry){
          document.getElementById('monument-curiosity-title').textContent=({es:'Curiosidad',en:'Curiosity',it:'Curiosità'})[language];
          document.getElementById('monument-architecture-title').textContent=({es:'3 detalles arquitectónicos',en:'3 architectural details',it:'3 dettagli architettonici'})[language];
          document.getElementById('monument-curiosity-text').textContent=entry.curiosity[language];
          var list=document.getElementById('monument-architecture-list');list.replaceChildren();
          entry.architecture[language].forEach(function(detail){var li=document.createElement('li');li.textContent=detail;list.appendChild(li);});
        }
        updateMonumentActions();
      }
      document.getElementById('monument-back').addEventListener('click',function(){
        document.getElementById('monument-detail').hidden=true;
        document.getElementById('city-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      });
    return {openMonument:openMonument,renderMonument:renderMonument};
  }
  return {init:init};
})();
