/* Monument details: isolated state, persistence and presentation. */
window.ArchiSpotterMonuments = (function () {
  function init(currentLang, strings) {
      var selectedMonument=null, selectedMonumentCity=null;
      var officialSites={"Coliseo":"https://colosseo.it/en/","Panteón de Agripa":"https://direzionemuseiroma.cultura.gov.it/en/pantheon/","Fontana di Trevi":"https://www.turismoroma.it/en/places/trevi-fountain","Foro Romano":"https://colosseo.it/en/","Castillo de Sant'Angelo":"https://direzionemuseiroma.cultura.gov.it/en/","Catedral de Florencia":"https://duomo.firenze.it/en/home","Ponte Vecchio":"https://www.feelflorence.it/en","Palazzo Vecchio":"https://musefirenze.it/en/musei/museo-di-palazzo-vecchio/","Sagrada Familia":"https://sagradafamilia.org/","Casa Batlló":"https://www.casabatllo.es/en/","Parque Güell":"https://parkguell.barcelona/en","Casa Milà":"https://www.lapedrera.com/en","Palacio Real":"https://www.patrimonionacional.es/en","Puerta de Alcalá":"https://www.esmadrid.com/en","Palacio de Cristal":"https://www.museoreinasofia.es/en","Templo de Debod":"https://www.esmadrid.com/en","Torre Eiffel":"https://www.toureiffel.paris/en","Arco del Triunfo":"https://www.paris-arc-de-triomphe.fr/en","Catedral de Notre-Dame":"https://www.notredamedeparis.fr/en/","Basílica del Sacré-Cœur":"https://www.sacre-coeur-montmartre.com/english/","Museo del Louvre":"https://www.louvre.fr/en","Palacio de Versalles":"https://en.chateauversailles.fr/","Partenón":"https://www.theacropolismuseum.gr/en","Erecteión":"https://www.theacropolismuseum.gr/en","Templo de Zeus Olímpico":"https://odysseus.culture.gr/","Odeón de Herodes Ático":"https://odysseus.culture.gr/","Templo de Apolo":"https://delphi.culture.gr/","Palacio de Westminster":"https://www.parliament.uk/visiting/","Tower Bridge":"https://www.towerbridge.org.uk/","Abadía de Westminster":"https://www.westminster-abbey.org/","Catedral de San Pablo":"https://www.stpauls.co.uk/","Termas romanas":"https://www.romanbaths.co.uk/","Puerta de Brandeburgo":"https://www.visitberlin.de/en/brandenburg-gate","Catedral de Berlín":"https://www.berlinerdom.de/en/","Edificio del Reichstag":"https://www.bundestag.de/en/visittheBundestag","Memorial del Holocausto":"https://www.stiftung-denkmal.de/en/","Catedral de Colonia":"https://www.koelner-dom.de/en/","Torre de Belém":"https://www.museusemonumentos.pt/en","Monasterio de los Jerónimos":"https://www.museusemonumentos.pt/en","Castillo de San Jorge":"https://castelodesaojorge.pt/en/","Elevador de Santa Justa":"https://www.visitlisboa.com/en","Puente Don Luis I":"https://visitporto.travel/en-GB","Obelisco":"https://turismo.buenosaires.gob.ar/en","Teatro Colón":"https://teatrocolon.org.ar/en","Casa Rosada":"https://www.casarosada.gob.ar/","Palacio Barolo":"https://palaciobarolo.com.ar/","Congreso de la Nación Argentina":"https://www.congreso.gob.ar/","Puente de la Mujer":"https://turismo.buenosaires.gob.ar/en"};
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
        document.getElementById('monument-back').setAttribute('data-direct-country',String(city[4].length===1));
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
        var gallery=document.getElementById('monument-photo-choices');
        gallery.replaceChildren();
        var images=window.ArchiSpotterPhotos&&window.ArchiSpotterPhotos.getImages(place);
        if(images&&images.length>1){
          gallery.hidden=false;
          images.forEach(function(url,i){
            var button=document.createElement('button');
            button.type='button';
            button.className='monument-photo-choice';
            button.textContent=String(i+1);
            button.setAttribute('aria-label',({es:'Ver fotografía ',en:'View photo ',it:'Vedi foto '})[currentLang()]+(i+1));
            button.setAttribute('aria-pressed',String(i===0));
            button.addEventListener('click',function(){
              var img=document.getElementById('monument-photo');
              img.src=url;
              gallery.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-pressed',String(i===j));});
            });
            gallery.appendChild(button);
          });
        }else gallery.hidden=true;

        document.getElementById('monument-name').textContent=place[idx];
        document.getElementById('monument-photo').alt=place[idx];
        document.getElementById('monument-photo-trigger').setAttribute('aria-label',strings[currentLang()].zoomPhoto+' '+place[idx]);
        document.getElementById('monument-location').textContent=city[idx]+' · '+document.getElementById('country-detail-name').textContent;
        var entry=window.ArchiSpotterEditorial&&window.ArchiSpotterEditorial[place[0]];
        var language=currentLang();
        var metas={
          'Coliseo':[['Anfiteatro romano · siglo I','Roman amphitheatre · 1st century','Anfiteatro romano · I secolo']],
          'Panteón de Agripa':[['Templo romano · siglo II','Roman temple · 2nd century','Tempio romano · II secolo']],
          'Foro Romano':[['Centro cívico romano','Roman civic centre','Centro civico romano']],
          'Fontana di Trevi':[['Fuente barroca · 1732–1762','Baroque fountain · 1732–1762','Fontana barocca · 1732–1762']],
          "Castillo de Sant'Angelo":[['Mausoleo romano · siglo II','Roman mausoleum · 2nd century','Mausoleo romano · II secolo']],
          'Catedral de Florencia':[['Catedral · 1296–1436','Cathedral · 1296–1436','Cattedrale · 1296–1436']],
          'Ponte Vecchio':[['Puente medieval · siglo XIV','Medieval bridge · 14th century','Ponte medievale · XIV secolo']],
          'Palazzo Vecchio':[['Palacio cívico · siglo XIV','Civic palace · 14th century','Palazzo civico · XIV secolo']]
        };
        document.getElementById('monument-meta').textContent=metas[place[0]]?metas[place[0]][0][idx]:strings[language].metaPending;
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
        var official=document.getElementById('monument-official-site');
        if(official){var url=officialSites[place[0]];official.hidden=!url;if(url)official.href=url;
          document.getElementById('monument-official-label').textContent=({es:'Sitio oficial / información institucional',en:'Official site / institutional information',it:'Sito ufficiale / informazioni istituzionali'})[language];}
        updateMonumentActions();
      }
      document.getElementById('monument-back').addEventListener('click',function(){
        document.getElementById('monument-detail').hidden=true;
        if(selectedMonumentCity&&selectedMonumentCity[4].length===1){
          document.getElementById('city-detail').hidden=true;
          document.getElementById('country-detail').hidden=false;
        }else{
          document.getElementById('city-detail').hidden=false;
        }
        document.querySelector('.app-content').scrollTop=0;
      });
    return {openMonument:openMonument,renderMonument:renderMonument};
  }
  return {init:init};
})();
