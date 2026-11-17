// Etapa 90: aplicación editorial extraída sin alterar el orden ni el contenido.
        for(const monument of initialMonumentsData){
            monument.history=archiEightLines(monument.history,monument,'es');
            if(englishMonumentContent[monument.id])englishMonumentContent[monument.id].history=archiEightLines(englishMonumentContent[monument.id].history,monument,'en');
            if(italianMonumentContent[monument.id])italianMonumentContent[monument.id].history=archiEightLines(italianMonumentContent[monument.id].history,monument,'it');
            if(monument.id.startsWith('world-') && !monument.images.length)monument.images=[architecturePlaceholder()];
        }

        
        // Editorial review: detailed, monument-specific eight-line histories in ES, EN, IT.
        // reviewedWorldHistories: scripts/world-reviewed-histories.js
        initialMonumentsData.forEach(m => {
            const revised = reviewedWorldHistories[m.id];
            if(!revised) return;
            m.history = revised.es;
            if(englishMonumentContent[m.id]) englishMonumentContent[m.id].history = revised.en;
            if(italianMonumentContent[m.id]) italianMonumentContent[m.id].history = revised.it;
        });

        
        // Editorial batch 2: Mexico, Peru and Russia, ten monuments in three languages.
        // reviewedWorldHistoriesBatch2: scripts/editorial-batch2-data.js

        initialMonumentsData.forEach(m => {
            const revised = reviewedWorldHistoriesBatch2[m.id];
            if(!revised) return;
            m.history = revised.es;
            if(englishMonumentContent[m.id]) englishMonumentContent[m.id].history = revised.en;
            if(italianMonumentContent[m.id]) italianMonumentContent[m.id].history = revised.it;
        });

        
        // Editorial batch 3: fifteen detailed histories, translated individually.
        // reviewedWorldHistoriesBatch3 definido en scripts/editorial-batch3-data.js
        initialMonumentsData.forEach(m => {
            const revised = reviewedWorldHistoriesBatch3[m.id];
            if(!revised) return;
            m.history = revised.es;
            if(englishMonumentContent[m.id]) englishMonumentContent[m.id].history = revised.en;
            if(italianMonumentContent[m.id]) italianMonumentContent[m.id].history = revised.it;
        });

        
        // Editorial review batch 4: ten monument-specific descriptions, ES/EN/IT.
        // reviewedWorldHistoriesBatch4: scripts/editorial-batch4-data.js

        initialMonumentsData.forEach(m => {
            const revised = reviewedWorldHistoriesBatch4[m.id];
            if (!revised) return;
            m.history = revised.es.join('\n');
            if (englishMonumentContent[m.id]) englishMonumentContent[m.id].history = revised.en.join('\n');
            if (italianMonumentContent[m.id]) italianMonumentContent[m.id].history = revised.it.join('\n');
        });

        
        // Editorial batch 5: final ten world landmarks in Spanish, English and Italian.
        // reviewedWorldHistoriesBatch5: scripts/editorial-batch5-data.js

        initialMonumentsData.forEach(m => {
            const revised = reviewedWorldHistoriesBatch5[m.id];
            if(!revised) return;
            m.history = revised.es;
            if(englishMonumentContent[m.id]) englishMonumentContent[m.id].history = revised.en;
            if(italianMonumentContent[m.id]) italianMonumentContent[m.id].history = revised.it;
        });

        
