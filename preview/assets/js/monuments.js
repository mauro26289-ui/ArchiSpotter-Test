/* Monument details: isolated state, persistence and presentation. */
window.ArchiSpotterMonuments = (function () {
  function init(currentLang, strings) {
      var selectedMonument=null, selectedMonumentCity=null;
      var monumentExamples={
        'Coliseo':[
          'El Coliseo, también conocido como anfiteatro Flavio, comenzó a construirse durante el gobierno de Vespasiano y fue inaugurado por Tito en el año 80 d. C. Su sistema de arcos, bóvedas y graderíos organizaba la circulación de miles de espectadores. Esta ficha es una demostración de diseño; la narración completa se incorporará con el catálogo definitivo.',
          'The Colosseum, also known as the Flavian Amphitheatre, was begun under Vespasian and inaugurated by Titus in AD 80. Its arches, vaults and tiers organized the movement of thousands of spectators. This is a design preview; the full narration will arrive with the final catalogue.',
          'Il Colosseo, noto anche come Anfiteatro Flavio, fu iniziato sotto Vespasiano e inaugurato da Tito nell’80 d.C. Archi, volte e gradinate organizzavano il movimento di migliaia di spettatori. Questa scheda è una dimostrazione del design; la narrazione completa arriverà con il catalogo definitivo.'
        ]
      };
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
        document.getElementById('monument-name').textContent=place[idx];
        document.getElementById('monument-photo').alt=place[idx];
        document.getElementById('monument-photo-trigger').setAttribute('aria-label',strings[currentLang()].zoomPhoto+' '+place[idx]);
        document.getElementById('monument-location').textContent=city[idx]+' · '+document.getElementById('country-detail-name').textContent;
        var colosseum=place[0]==='Coliseo';
        document.getElementById('monument-meta').textContent=colosseum?['Arquitectura romana · 70–80 d. C.','Roman architecture · AD 70–80','Architettura romana · 70–80 d.C.'][idx]:strings[currentLang()].metaPending;
        document.getElementById('monument-story-text').textContent=colosseum?monumentExamples.Coliseo[idx]:strings[currentLang()].storyPending;
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
