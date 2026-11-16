// Extraído sin alterar la lógica original de ArchiSpotter.
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

