
        // Global App State
        let monumentsData = [];
        let stampedPassports = [];
        let selectedCountry = null;
        let selectedCity = null;
        let currentActiveStyle = 'all';
        let currentTab = 'explore';
        let activeMonumentForModal = null;
        let currentSlideIndex = 0;
        let isSplendorView = false;
        let devAuthenticated = false;
        let userGpsActive = false;
        let userLat = null;
        let userLng = null;
        let isSpeakingAudio = false;
        const archiSavedLanguage = archiStorageGet('archispotter_language');
        let appLanguage = ['es','en','it'].includes(archiSavedLanguage) ? archiSavedLanguage : 'es';
        let audioRate = 1.0;
        let smartMap = null;
        let smartMapMarkers = [];
        // Funciones de almacenamiento trasladadas a scripts/storage.js.
        let favoriteMonuments = archiReadSavedIdList('archispotter_favorites');
        let tripMonumentIds = archiReadSavedIdList('archispotter_trip');
        let selectedRouteIds = []; 

        // Lightbox Zoom & Pan State
        let lightboxImages = [];
        let lightboxCurrentIdx = 0;
        let lightboxScale = 1;
        let lightboxPanX = 0;
        let lightboxPanY = 0;
        let isDraggingLightbox = false;
        let startPanX = 0;
        let startPanY = 0;
        let initialPinchDistance = null;
        let initialPinchScale = 1;
        let lastTapTime = 0;

        // countryFlagsDict: definido en data/app-catalog.js


        // getFlagForCountry moved to formatting.js

        // countryMapPositions: definido en data/app-catalog.js


        // Initial Monuments Dataset — original Unsplash image URLs for each monument.
        /* initialMonumentsData: cargado desde data/monuments-data.js */

        // cityWalkingRoutes: definido en data/app-catalog.js


        // Extraído a scripts/app-startup.js
        // All monument photographs come exclusively from initialMonumentsData[].images.
        // If a URL fails, show a local placeholder; never request a second image source.
        // Respaldo de fotografías: scripts/image-fallback.js
        // Reset the retry state when a gallery changes its source.
        // Extraído a scripts/photo-load-reset.js
        // Extraído a scripts/photo-recovery.js
        // Extraído a scripts/world-photo-loader.js
        // Datos trasladados a scripts/english-monument-content.js
        // Datos trasladados a scripts/language-base-dictionaries.js
        // Datos trasladados a scripts/italian-monument-content.js
                // Additional 55 world landmarks — three-language content.
        // Datos extraídos a scripts/world-english-content.js
        // Datos extraídos a scripts/world-italian-content.js
        // Datos extraídos a scripts/world-country-dictionaries.js
        // Datos extraídos a scripts/world-country-dictionaries.js
        // Datos extraídos a scripts/world-country-dictionaries.js
        // Datos extraídos a scripts/world-country-dictionaries.js
        // Datos extraídos a scripts/world-country-dictionaries.js

        // Editorial expansion: eight readable, separately wrapped historical lines per ficha.
        // The original history is preserved; its sentences are redistributed into lines.

        // archiExtraHistory: scripts/editorial-history-supplements.js

        // archiEightLines: definido en scripts/history-formatting.js

        // Aplicación editorial: scripts/editorial-history-application.js

        // Aplicación editorial: scripts/editorial-facts-application.js

        // Aplicación editorial: scripts/editorial-dedup-application.js

        // E91: editorial-three-section-audit.js
        // Funciones trasladadas a scripts/settings-ui.js.

        function tr(es,en){return appLanguage==='it'?(italianDynamicText[es]||en):appLanguage==='en'?en:es;}
        // countryLabel: scripts/labels.js
        // E91: additional-monument-translations.js
        // E91: editorial-description-batches.js
        // monumentField: scripts/monument-content-field.js

        // architectureLabel: scripts/labels.js
        // localYear moved to formatting.js
        // staticTextEnglish definido en scripts/static-english-dictionary.js
        // translateStaticTextNodes: scripts/static-text-translation.js

        // Keep translations in sync with dynamically rendered modals, routes, and passport.
        // Extraído a scripts/translation-observer.js
        // Extraído a scripts/static-language-layout.js
        // Extraído a scripts/language-application.js
        // Extraído a scripts/modal-translation.js
        // Extraído a scripts/language-selection.js
        // Extraído a scripts/language-input-handler.js
        // Extraído a scripts/theme-preferences.js
        // Funciones trasladadas a scripts/favorites-actions.js.

        // showToast y triggerHaptic: scripts/ui-feedback.js

        // Funciones trasladadas a scripts/explore-country-city.js.

        // Funciones trasladadas a scripts/explore-gestures.js.

        // Navegación/listado/filtros extraídos: scripts/explore-navigation.js

        // Navegación/listado/filtros extraídos: scripts/monument-list-ui.js

        // Extraído a scripts/monument-modal-controller.js
        // Extraído a scripts/inline-gallery-ui.js
        // Extraído a scripts/lightbox-entry.js
        // updateLightboxView trasladada a scripts/lightbox-navigation.js.

        // prevLightboxImage trasladada a scripts/lightbox-navigation.js.

        // nextLightboxImage trasladada a scripts/lightbox-navigation.js.

        // Zoom del visor trasladado a scripts/lightbox-zoom.js.

        // Extraído a scripts/lightbox-interactions.js
        // Funciones en scripts/splendor-controls.js.
        // Funciones trasladadas a scripts/monument-carousel.js.

        // closeModal: scripts/monument-modal-controller.js

        // ArchiSpotter neural MP3 pilot: Colosseum (EN / ES / IT).
        // Other monuments retain the existing browser-voice fallback.
        const NEURAL_MONUMENT_IDS = new Set([
            'colosseum', 'pantheon', 'forum', 'florence-duomo',
            'milan-cathedral', 'sagrada-familia', 'alhambra',
            'chillon-castle', 'christ-redeemer', 'borobudur'
        ]);
        let neuralAudioPlayer = null;
        function startNeuralAudioGuide() {
            const monument = activeMonumentForModal;
            if (!monument || !NEURAL_MONUMENT_IDS.has(monument.id)) return false;
            const language = ['es','en','it'].includes(appLanguage) ? appLanguage : 'es';
            const audio = new Audio(`audio/${monument.id}-${language}.mp3`);
            const session = ++audioSessionId;
            neuralAudioPlayer = audio;
            isSpeakingAudio = true;
            const icon = document.getElementById('audio-icon');
            const label = document.getElementById('audio-label');
            if (icon) icon.className = 'fa-solid fa-circle-pause text-sm text-amber-400 animate-pulse';
            if (label) label.textContent = language === 'it' ? 'Ferma audio' : language === 'en' ? 'Stop audio' : 'Detener audio';
            audio.onended = () => { if (session === audioSessionId) { neuralAudioPlayer = null; resetAudioState(); } };
            audio.onerror = () => {
                if (session !== audioSessionId) return;
                neuralAudioPlayer = null;
                resetAudioState();
                showToast(language === 'it' ? 'Audio neurale non disponibile; uso la voce del dispositivo.' : language === 'en' ? 'Neural audio unavailable; using device voice.' : 'Audio neuronal no disponible; usando voz del dispositivo.');
                startAudioGuide();
            };
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    if (session !== audioSessionId) return;
                    neuralAudioPlayer = null;
                    resetAudioState();
                    showToast(language === 'it' ? 'Tocca di nuovo per riprodurre.' : language === 'en' ? 'Tap again to play audio.' : 'Tocá de nuevo para reproducir.');
                });
            }
            return true;
        }
        function toggleAudioGuide() {
            triggerHaptic();
            if (isSpeakingAudio) {
                stopAudioGuide();
            } else if (!startNeuralAudioGuide()) {
                startAudioGuide();
            }
        }

        // Formateo de pronunciación: scripts/speech-formatting.js

        // iOS Safari: narraciones cortas y una única sesión activa.
        let audioSessionId = 0;
        let audioCurrentUtterance = null;
        // audioChunks: scripts/audio-chunks.js
        function startAudioGuide() {
            if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
                showToast(tr('Tu navegador no soporta síntesis de voz.', 'Your browser does not support speech synthesis.'));
                return;
            }
            const m = activeMonumentForModal;
            if (!m) return;
            const session = ++audioSessionId;
            const synth = window.speechSynthesis;
            synth.cancel();
            const language = appLanguage;
            const langTag = language === 'it' ? 'it-IT' : language === 'en' ? 'en-GB' : 'es-MX';
            const intro = language === 'it' ? 'Situato a' : language === 'en' ? 'Located in' : 'Ubicado en';
            const history = preprocessTextForSpeech(archiEditorial2026[m.id]?.narrations?.[language] || monumentField(m, 'history'), language);
            const text = archiEditorial2026[m.id]?.narrations?.[language] ? history : `${monumentLabel(m)}. ${intro} ${cityLabel(m.city)}, ${countryLabel(m.country)}. ${history}`;
            const chunks = audioChunks(text);
            if (!chunks.length) return;
            let index = 0;
            let hasStarted = false;
            isSpeakingAudio = true;
            const icon = document.getElementById('audio-icon');
            const label = document.getElementById('audio-label');
            if (icon) icon.className = 'fa-solid fa-circle-pause text-sm text-amber-400 animate-pulse';
            if (label) label.textContent = language === 'it' ? 'Pausa audio' : language === 'en' ? 'Pause audio' : 'Pausar audio';
            function next() {
                if (session !== audioSessionId) return;
                if (index >= chunks.length) { resetAudioState(); return; }
                const utterance = new SpeechSynthesisUtterance(chunks[index++]);
                audioCurrentUtterance = utterance;
                utterance.lang = langTag;
                utterance.rate = audioRate;
                utterance.pitch = language === 'en' ? 0.98 : 1;
                const voices = synth.getVoices();
                // Priorizar acentos: español latinoamericano neutro, inglés británico e italiano claro.
                const normalizeLang = v => String(v.lang || '').toLowerCase().replace('_', '-');
                const preferred = language === 'es'
                    ? ['es-mx', 'es-co', 'es-us', 'es-ar', 'es-cl', 'es-pe', 'es-ve', 'es-419']
                    : language === 'en' ? ['en-gb', 'en-ie', 'en-au', 'en-nz', 'en-us'] : ['it-it', 'it-ch', 'it'];
                const matches = voices.filter(v => normalizeLang(v).startsWith(language));
                const score = v => {
                    const tag = normalizeLang(v);
                    const rank = preferred.findIndex(code => tag === code || tag.startsWith(code + '-'));
                    const regional = rank < 0 ? 0 : 100 - rank * 10;
                    const quality = /natural|premium|enhanced|mejorada|neural|eloquence|siri/i.test(v.name) ? 180 : 0;
                    return regional + quality;
                };
                if (matches.length) {
                    matches.sort((a, b) => score(b) - score(a));
                    utterance.voice = matches[0];
                    utterance.lang = matches[0].lang;
                }
                utterance.onstart = () => { if (session === audioSessionId) hasStarted = true; };
                utterance.onend = () => { if (session === audioSessionId) next(); };
                utterance.onerror = (event) => {
                    if (session !== audioSessionId) return;
                    if (event.error !== 'canceled' && event.error !== 'interrupted') {
                        showToast(language === 'it' ? 'Impossibile riprodurre la voce.' : language === 'en' ? 'Unable to play audio.' : 'No se pudo reproducir la audioguía.');
                    }
                    resetAudioState();
                };
                try { synth.speak(utterance); }
                catch (error) { resetAudioState(); showToast('No se pudo iniciar la audioguía.'); }
            }
            // La primera llamada se ejecuta directamente dentro del toque del usuario.
            next();
        }
        function stopAudioGuide() {
            ++audioSessionId;
            if (neuralAudioPlayer) {
                neuralAudioPlayer.pause();
                neuralAudioPlayer.removeAttribute('src');
                neuralAudioPlayer.load();
                neuralAudioPlayer = null;
            }
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            audioCurrentUtterance = null;
            resetAudioState();
        }
        function resetAudioState() {
            isSpeakingAudio = false;
            audioCurrentUtterance = null;
            const icon = document.getElementById('audio-icon');
            const label = document.getElementById('audio-label');
            if (icon) icon.className = 'fa-solid fa-circle-play text-sm';
            if (label) label.textContent = tr('Audioguía 60s', 'Audio guide');
        }

        // Funciones trasladadas a scripts/passport-ui.js.

        // Funciones trasladadas a scripts/gps-map-controller.js.

        // Funciones en scripts/route-rendering.js.
        // Selección de rutas: scripts/route-selection.js (etapa 45).
        // Funciones en scripts/trip-favorites-ui.js.
        // switchTab: scripts/tab-navigation.js


        // Navegación/listado/filtros extraídos: scripts/explore-search-controls.js

        // Controles del panel desarrollador: scripts/developer-access.js

        // Funciones trasladadas a scripts/developer-editor.js.

