// Formato editorial de párrafos históricos. Función extraída sin cambios de app.js.
function archiEightLines(original, m, lang){
            const source=String(original||'').trim();
            // Split at sentence boundaries without truncating any existing historical text.
            const sentences=source.replace(/\n+/g,' ').split(/(?<=[.!?。])\s+(?=[A-ZÁÉÍÓÚÜÑÀÈÌÒÙÇ0-9«“])/u).filter(Boolean);
            let lines=sentences.length>1?sentences:[source];
            // Keep every sentence: distribute them into eight balanced groups if needed.
            if(lines.length>10){
                const groups=Array.from({length:10},()=>[]);
                lines.forEach((sentence,i)=>groups[Math.floor(i*10/lines.length)].push(sentence));
                lines=groups.map(group=>group.join(' '));
            }
            const supplements=archiExtraHistory[lang];
            let j=0;
            while(lines.length<8 && j<supplements.length)lines.push(supplements[j++](m));
            return lines.join('\n');
        }
