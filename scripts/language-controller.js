// Extraído de app.js en E73; lógica original sin cambios.
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
        function translateOpenMonument(m) {
            if(!m) return;
            document.getElementById('modal-title').textContent=monumentLabel(m);
            document.getElementById('modal-style').textContent=styleLabel(m.style);
            document.getElementById('modal-year').textContent=localYear(m.year);
            document.getElementById('modal-location').innerHTML=`<i class="fa-solid fa-location-dot text-amber-500 mr-1"></i> ${cityLabel(m.city)}, ${countryLabel(m.country)} ${getFlagForCountry(m.country,m.flag)}`;
            document.getElementById('modal-history').innerText=monumentField(m,'history');
            document.getElementById('modal-secret-text').textContent=monumentField(m,'secret')||'';
            document.getElementById('modal-architecture').innerHTML=architectureLabel(m).map(item=>`<div class="flex items-start space-x-2"><i class="fa-solid fa-check text-amber-500 text-[10px] mt-1"></i><span>${item}</span></div>`).join('');
        }
        function setLanguage(lang) {
            if(isSpeakingAudio) stopAudioGuide();
            appLanguage=['es','en','it'].includes(lang)?lang:'es';
            try { localStorage.setItem('archispotter_language',appLanguage); } catch(e) {}
            try { if(typeof window.updateArchiOnboarding==='function')window.updateArchiOnboarding(); } catch(e) { console.warn('[ArchiSpotter] onboarding i18n',e); }
            applyLanguage();
            try { showToast(appLanguage==='it'?'Lingua impostata su italiano':appLanguage==='en'?'Language set to English':'Idioma configurado en español'); } catch(e) {}
        }
        window.setLanguage=setLanguage;
        // iOS Safari: escuchar el selector REAL de Ajustes. El antiguo listener
        // observaba #language-select, que no existe en la ventana actual.
        function archiHandleLanguageSelection(event) {
            const target=event.target;
            if (!target || !['archi-settings-language','language-select'].includes(target.id)) return;
            const requested=target.value;
            if (!['es','en','it'].includes(requested) || requested===appLanguage) return;
            setLanguage(requested);
        }
        document.addEventListener('change',archiHandleLanguageSelection);
        document.addEventListener('input',archiHandleLanguageSelection);
