// Extraído sin alterar la lógica de la etapa 85.
        function applyLanguage() {
            const t=translations[appLanguage]||translations.es;
            const set=(id,value)=>{const e=document.getElementById(id);if(e)e.textContent=value;};
            const safe=(name,fn)=>{try{fn();}catch(err){console.warn('[ArchiSpotter i18n] '+name,err);}};
            set('tab-explore-label',t.explore);
            set('tab-walks-label',t.routes);
            set('tab-map-label',t.map);
            set('tab-trip-label',t.trip);
            set('tab-favorites-label',t.favorites);
            const audio=document.getElementById('audio-label');
            if(audio)audio.textContent=isSpeakingAudio?tr('Pausar audio','Pause audio'):t.audio;
            for (const id of ['language-select','archi-settings-language']) {
                const lang=document.getElementById(id);
                if(lang && lang.value!==appLanguage)lang.value=appLanguage;
            }
            document.documentElement.lang=appLanguage;
            // Conservar selectedCountry, selectedCity y currentTab; solo volver a pintar.
            safe('explore',()=>{if(currentTab==='explore')renderNavigationFlow();});
            safe('trip',()=>renderTrip());
            safe('favorites',()=>renderFavorites());
            safe('routes',()=>renderWalkingRoutes());
            safe('nearby',()=>renderNearbyMonuments());
            safe('passport',()=>{const el=document.getElementById('passport-modal');if(el&&!el.classList.contains('hidden'))openPassportModal();});
            safe('static',()=>applyStaticLanguage());
            safe('text',()=>translateStaticTextNodes());
            safe('intro',()=>setUiText('#home-intro-heading',appLanguage==='it'?'Che cos’è?':appLanguage==='en'?'What is this?':'¿Y esto qué es?'));
            safe('modal',()=>{const el=document.getElementById('monument-modal');if(activeMonumentForModal&&el&&!el.classList.contains('hidden'))translateOpenMonument(activeMonumentForModal);});
            safe('settings',()=>archiSyncSettings());
            safe('about',()=>archiSyncAboutLanguage());
            safe('map',()=>{if(currentTab==='map')renderNearbyMonuments();});
            // La barra de países no debe aparecer sobre las otras pestañas.
            if(currentTab!=='explore')document.getElementById('nav-breadcrumb')?.classList.add('hidden');
        }
