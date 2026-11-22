/* Monument details: isolated state, persistence and presentation. */
window.ArchiSpotterMonuments = (function () {
  function init(currentLang, strings) {
      var selectedMonument=null, selectedMonumentCity=null;
      // Existing ElevenLabs recordings from the original ArchiSpotter repository.
      // Do not synthesize or charge credits for these previously generated MP3s.
      var existingAudioIds={
        'Coliseo':'colosseum',
        'Panteón de Agripa':'pantheon',
        'Foro Romano':'forum',
        'Catedral de Florencia':'florence-duomo',
        'Sagrada Familia':'sagrada-familia',
        'Fontana di Trevi':'trevi-fountain',
        "Castillo de Sant'Angelo":'castel-sant-angelo',
        'Ponte Vecchio':'ponte-vecchio',
        'Palazzo Vecchio':'palazzo-vecchio',
        'Casa Batlló':'casa-batllo',
        'Catedral de Milán':'milan-cathedral',
        'Alhambra':'alhambra',
        'Castillo de Chillon':'chillon-castle'
      };
      var audioBase='https://raw.githubusercontent.com/mauro26289-ui/ArchiSpotter/main/audio/';
      var newAudioIds={'trevi-fountain':true,'castel-sant-angelo':true,'ponte-vecchio':true,'palazzo-vecchio':true,'casa-batllo':true};
      var audioAvailability={};
      var narrationAudio=new Audio();
      narrationAudio.preload='none';
      var activeAudioKey='';
      var audioButton=null;
      var audioLabels={
        es:{play:'Escuchar audioguía · ElevenLabs',pause:'Pausar audioguía',resume:'Continuar audioguía',error:'No se pudo cargar el audio. Comprueba tu conexión.'},
        en:{play:'Play audio guide · ElevenLabs',pause:'Pause audio guide',resume:'Resume audio guide',error:'Could not load the audio. Check your connection.'},
        it:{play:'Ascolta audioguida · ElevenLabs',pause:'Pausa audioguida',resume:'Riprendi audioguida',error:'Impossibile caricare l’audio. Controlla la connessione.'}
      };
      function stopNarration(){
        narrationAudio.pause();
        narrationAudio.removeAttribute('src');
        narrationAudio.load();
        activeAudioKey='';
        if(audioButton)audioButton.textContent=audioLabels[currentLang()].play;
      }
      function updateAudioButton(){
        if(!audioButton)return;
        var labels=audioLabels[currentLang()];
        audioButton.textContent=narrationAudio.paused?(narrationAudio.currentTime>0?labels.resume:labels.play):labels.pause;
      }
      narrationAudio.addEventListener('ended',function(){narrationAudio.currentTime=0;updateAudioButton();});
      narrationAudio.addEventListener('pause',updateAudioButton);
      narrationAudio.addEventListener('play',updateAudioButton);
      narrationAudio.addEventListener('error',function(){
        if(!audioButton||!activeAudioKey)return;
        audioButton.textContent=audioLabels[currentLang()].error;
        narrationAudio.pause();
      });
      function renderNarrationControl(place,language){
        audioButton=document.querySelector('#monument-detail .audio-action');
        if(!audioButton)return;
        var id=existingAudioIds[place[0]];
        audioButton.hidden=false;
        audioButton.disabled=!id || (audioAvailability[id] && !audioAvailability[id][language]);
        if(audioButton.disabled){stopNarration();return;}
        var key=id+'-'+language;
        if(activeAudioKey!==key){
          stopNarration();
          activeAudioKey=key;
          narrationAudio.src=(newAudioIds[id]?'./audio/':audioBase)+key+'.mp3';
          narrationAudio.playbackRate=1.15;
        }
        updateAudioButton();
        audioButton.onclick=function(){
          if(!narrationAudio.paused){narrationAudio.pause();return;}
          narrationAudio.play().catch(function(){audioButton.textContent=audioLabels[currentLang()].error;});
        };
      }

      var officialSites={"Coliseo":"https://colosseo.it/en/","Panteón de Agripa":"https://direzionemuseiroma.cultura.gov.it/en/pantheon/","Fontana di Trevi":"https://www.turismoroma.it/en/places/trevi-fountain","Foro Romano":"https://colosseo.it/en/","Castillo de Sant'Angelo":"https://direzionemuseiroma.cultura.gov.it/en/","Catedral de Florencia":"https://duomo.firenze.it/en/home","Ponte Vecchio":"https://www.feelflorence.it/en","Palazzo Vecchio":"https://musefirenze.it/en/musei/museo-di-palazzo-vecchio/","Sagrada Familia":"https://sagradafamilia.org/","Casa Batlló":"https://www.casabatllo.es/en/","Parque Güell":"https://parkguell.barcelona/en","Casa Milà":"https://www.lapedrera.com/en","Palacio Real":"https://www.patrimonionacional.es/en","Puerta de Alcalá":"https://www.esmadrid.com/en","Palacio de Cristal":"https://www.museoreinasofia.es/en","Templo de Debod":"https://www.esmadrid.com/en","Torre Eiffel":"https://www.toureiffel.paris/en","Arco del Triunfo":"https://www.paris-arc-de-triomphe.fr/en","Catedral de Notre-Dame":"https://www.notredamedeparis.fr/en/","Basílica del Sacré-Cœur":"https://www.sacre-coeur-montmartre.com/english/","Museo del Louvre":"https://www.louvre.fr/en","Palacio de Versalles":"https://en.chateauversailles.fr/","Partenón":"https://www.theacropolismuseum.gr/en","Erecteión":"https://www.theacropolismuseum.gr/en","Templo de Zeus Olímpico":"https://odysseus.culture.gr/","Odeón de Herodes Ático":"https://odysseus.culture.gr/","Templo de Apolo":"https://delphi.culture.gr/","Palacio de Westminster":"https://www.parliament.uk/visiting/","Tower Bridge":"https://www.towerbridge.org.uk/","Abadía de Westminster":"https://www.westminster-abbey.org/","Catedral de San Pablo":"https://www.stpauls.co.uk/","Termas romanas":"https://www.romanbaths.co.uk/","Puerta de Brandeburgo":"https://www.visitberlin.de/en/brandenburg-gate","Catedral de Berlín":"https://www.berlinerdom.de/en/","Edificio del Reichstag":"https://www.bundestag.de/en/visittheBundestag","Memorial del Holocausto":"https://www.stiftung-denkmal.de/en/","Catedral de Colonia":"https://www.koelner-dom.de/en/","Catedral de Milán":"https://www.duomomilano.it/en/","Alhambra":"https://www.alhambra-patronato.es/","Castillo de Chillon":"https://www.chillon.ch/en/","Torre de Belém":"https://www.museusemonumentos.pt/en","Monasterio de los Jerónimos":"https://www.museusemonumentos.pt/en","Castillo de San Jorge":"https://castelodesaojorge.pt/en/","Elevador de Santa Justa":"https://www.visitlisboa.com/en","Puente Don Luis I":"https://visitporto.travel/en-GB","Obelisco":"https://turismo.buenosaires.gob.ar/en","Teatro Colón":"https://teatrocolon.org.ar/en","Casa Rosada":"https://www.casarosada.gob.ar/","Palacio Barolo":"https://palaciobarolo.com.ar/","Congreso de la Nación Argentina":"https://www.congreso.gob.ar/","Puente de la Mujer":"https://turismo.buenosaires.gob.ar/en"};
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
        document.getElementById('monument-back').setAttribute('data-direct-country',String(document.getElementById('city-detail').hidden));
        renderMonument();
        document.getElementById('city-detail').hidden=true;
        document.getElementById('country-detail').hidden=true;
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
        var credit=document.getElementById('monument-photo-credit');
        function updatePhotoCredit(index){
          if(!credit)return;
          credit.replaceChildren();
          if(place[0]!=='Castillo de Chillon'){credit.hidden=true;return;}
          credit.hidden=false;
          var author=index===0?'Giles Laurent':'Christian David';
          credit.appendChild(document.createTextNode('Foto: '+author+' · '));
          var link=document.createElement('a');
          link.href=index===0?'https://commons.wikimedia.org/wiki/File:001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg':'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chillon%2C_Cour_int%C3%A9rieure%2C_Veytaux%2C_Vaud.jpg';
          link.textContent='Wikimedia Commons · CC BY-SA 4.0';
          link.target='_blank';link.rel='noopener noreferrer';
          credit.appendChild(link);
        }
        updatePhotoCredit(0);
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
              updatePhotoCredit(i);
              gallery.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-pressed',String(i===j));});
            });
            gallery.appendChild(button);
          });
        }else gallery.hidden=true;
        var swipeTarget=document.getElementById('monument-photo-trigger');
        if(swipeTarget){
          // Gesture contract: the incoming and outgoing photos track the finger.
          // The selected photo remains the canonical image used by the zoom viewer.
          var swipeStart=null,swipeNeighbor=null,swipeDirection=0,swipeMoved=false;
          var mainPhoto=document.getElementById('monument-photo');
          function selectedPhotoIndex(){
            var buttons=gallery.querySelectorAll('button');
            for(var k=0;k<buttons.length;k++)if(buttons[k].getAttribute('aria-pressed')==='true')return k;
            return 0;
          }
          function resetPhotoGesture(){
            mainPhoto.style.transition='';mainPhoto.style.transform='';
            mainPhoto.style.position='';mainPhoto.style.zIndex='';
            if(swipeNeighbor){swipeNeighbor.remove();swipeNeighbor=null;}
            swipeStart=null;swipeDirection=0;swipeMoved=false;
          }
          swipeTarget.ontouchstart=function(e){
            resetPhotoGesture();
            if(!images||images.length<2||e.touches.length!==1)return;
            var t=e.touches[0];
            // The left edge is reserved for interactive back navigation.
            if(t.clientX<34)return;
            swipeStart={x:t.clientX,y:t.clientY,active:false,dx:0};
          };
          swipeTarget.ontouchmove=function(e){
            if(!swipeStart||e.touches.length!==1)return;
            var t=e.touches[0],dx=t.clientX-swipeStart.x,dy=t.clientY-swipeStart.y;
            if(!swipeStart.active){
              if(Math.abs(dx)<9||Math.abs(dx)<Math.abs(dy)*1.25)return;
              swipeStart.active=true;
            }
            swipeMoved=true;
            var width=swipeTarget.clientWidth||1;
            swipeStart.dx=Math.max(-width,Math.min(width,dx));
            var direction=dx<0?1:-1;
            var index=selectedPhotoIndex(),next=(index+direction+images.length)%images.length;
            if(!swipeNeighbor||swipeDirection!==direction){
              if(swipeNeighbor)swipeNeighbor.remove();
              swipeNeighbor=mainPhoto.cloneNode(false);
              swipeNeighbor.removeAttribute('id');
              swipeNeighbor.src=images[next];
              swipeNeighbor.style.position='absolute';
              swipeNeighbor.style.inset='0';
              swipeNeighbor.style.width='100%';
              swipeNeighbor.style.height='100%';
              swipeNeighbor.style.objectFit='cover';
              swipeNeighbor.style.zIndex='2';
              swipeNeighbor.style.pointerEvents='none';
              swipeNeighbor.style.transition='none';
              swipeTarget.appendChild(swipeNeighbor);
              swipeDirection=direction;
            }
            if(getComputedStyle(swipeTarget).position==='static')swipeTarget.style.position='relative';
            swipeTarget.style.overflow='hidden';
            mainPhoto.style.transition='none';mainPhoto.style.position='relative';mainPhoto.style.zIndex='1';
            mainPhoto.style.transform='translate3d('+swipeStart.dx+'px,0,0)';
            swipeNeighbor.style.transform='translate3d('+(swipeStart.dx+(direction>0?width:-width))+'px,0,0)';
          };
          swipeTarget.ontouchend=function(e){
            if(!swipeStart)return;
            var state=swipeStart;
            if(!state.active){resetPhotoGesture();return;}
            var width=swipeTarget.clientWidth||1;
            var complete=Math.abs(state.dx)>Math.min(85,width*.22);
            var direction=state.dx<0?1:-1;
            var target=complete?(direction>0?-width:width):0;
            mainPhoto.style.transition='transform 190ms ease-out';
            mainPhoto.style.transform='translate3d('+target+'px,0,0)';
            if(swipeNeighbor){
              swipeNeighbor.style.transition='transform 190ms ease-out';
              swipeNeighbor.style.transform='translate3d('+(complete?0:(direction>0?width:-width))+'px,0,0)';
            }
            swipeStart=null;
            window.setTimeout(function(){
              if(complete&&images&&images.length>1){
                var buttons=gallery.querySelectorAll('button');
                var next=(selectedPhotoIndex()+direction+buttons.length)%buttons.length;
                if(buttons[next])buttons[next].click();
              }
              resetPhotoGesture();
            },200);
          };
          swipeTarget.ontouchcancel=resetPhotoGesture;
        }

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
          'Palazzo Vecchio':[['Palacio cívico · siglo XIV','Civic palace · 14th century','Palazzo civico · XIV secolo']],
          'Catedral de Milán':[['Catedral gótica · desde 1386','Gothic cathedral · from 1386','Cattedrale gotica · dal 1386']],
          'Alhambra':[['Palacios nazaríes · siglos XIII–XV','Nasrid palaces · 13th–15th centuries','Palazzi nasridi · XIII–XV secolo']],
          'Castillo de Chillon':[['Castillo medieval · lago Lemán','Medieval castle · Lake Geneva','Castello medievale · lago Lemano']]
        };
        document.getElementById('monument-meta').textContent=metas[place[0]]?metas[place[0]][0][idx]:strings[language].metaPending;
        document.getElementById('monument-story-text').textContent=entry?entry.history[language]:strings[language].storyPending;
        renderNarrationControl(place,language);
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
        stopNarration();
        document.getElementById('monument-detail').hidden=true;
        if(document.getElementById('monument-back').getAttribute('data-direct-country')==='true'){
          document.getElementById('city-detail').hidden=true;
          document.getElementById('country-detail').hidden=false;
        }else{
          document.getElementById('country-detail').hidden=true;
          document.getElementById('city-detail').hidden=false;
        }
        document.querySelector('.app-content').scrollTop=0;
      });
    return {openMonument:openMonument,renderMonument:renderMonument};
  }
  return {init:init};
})();
