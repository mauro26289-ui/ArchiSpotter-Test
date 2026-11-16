// Extraído sin alterar la lógica de la etapa 85.
        function setLanguage(lang) {
            if(isSpeakingAudio) stopAudioGuide();
            appLanguage=['es','en','it'].includes(lang)?lang:'es';
            try { localStorage.setItem('archispotter_language',appLanguage); } catch(e) {}
            try { if(typeof window.updateArchiOnboarding==='function')window.updateArchiOnboarding(); } catch(e) { console.warn('[ArchiSpotter] onboarding i18n',e); }
            applyLanguage();
            try { showToast(appLanguage==='it'?'Lingua impostata su italiano':appLanguage==='en'?'Language set to English':'Idioma configurado en español'); } catch(e) {}
        }
        window.setLanguage=setLanguage;
