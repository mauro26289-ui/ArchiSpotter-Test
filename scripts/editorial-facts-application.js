// Etapa 90: aplicación editorial extraída sin alterar el orden ni el contenido.
        // 55 specific curiosities, edited individually in ES / EN / IT.
        // revisedCuriosities55: scripts/world-curiosities.js
        initialMonumentsData.forEach(m => {
            const entry = revisedCuriosities55[m.id];
            if (!entry) return;
            m.secret = entry.es;
            if (englishMonumentContent[m.id]) englishMonumentContent[m.id].secret = entry.en;
            if (italianMonumentContent[m.id]) italianMonumentContent[m.id].secret = entry.it;
        });

        
        // Specific construction facts: measurements, materials and structural solutions.
        // archiSpecificConstructionFacts: scripts/world-construction-facts.js
        initialMonumentsData.forEach(m => {
            const details = archiSpecificConstructionFacts[m.id];
            if(!details) return;
            m.architecture = details.es;
            if(englishMonumentContent[m.id]) englishMonumentContent[m.id].architecture = details.en;
            if(italianMonumentContent[m.id]) italianMonumentContent[m.id].architecture = details.it;
        });

        
