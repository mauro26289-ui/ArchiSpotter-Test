// Etapa 90: aplicación editorial extraída sin alterar el orden ni el contenido.
        // Editorial cross-check: avoid repeating the same fact in history and curiosity.

        // archiNoRepetitionPatch: scripts/editorial-no-repetition-patches.js

        initialMonumentsData.forEach(m => {
            const h = archiNoRepetitionPatch.history[m.id];
            if(h){
                const esLines = m.history.split('\n');
                const enLines = englishMonumentContent[m.id]?.history?.split('\n');
                const itLines = italianMonumentContent[m.id]?.history?.split('\n');
                if(esLines.length===8 && enLines?.length===8 && itLines?.length===8){
                    esLines[h.index]=h.es; enLines[h.index]=h.en; itLines[h.index]=h.it;
                    m.history=esLines.join('\n');
                    englishMonumentContent[m.id].history=enLines.join('\n');
                    italianMonumentContent[m.id].history=itLines.join('\n');
                }
            }
            const secret = archiNoRepetitionPatch.secret[m.id];
            if(secret){
                m.secret=secret.es;
                if(englishMonumentContent[m.id]) englishMonumentContent[m.id].secret=secret.en;
                if(italianMonumentContent[m.id]) italianMonumentContent[m.id].secret=secret.it;
            }
        });

        // archiFinalCuriosityCorrections: scripts/editorial-final-curiosity-corrections.js

        initialMonumentsData.forEach(m => {
            const c=archiFinalCuriosityCorrections[m.id];
            if(!c)return;
            m.secret=c.es;
            if(englishMonumentContent[m.id])englishMonumentContent[m.id].secret=c.en;
            if(italianMonumentContent[m.id])italianMonumentContent[m.id].secret=c.it;
        });

        
