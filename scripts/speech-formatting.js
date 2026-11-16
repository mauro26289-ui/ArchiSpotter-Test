// ArchiSpotter: utilidades de pronunciación para audioguías.
// Se carga antes de app.js; appLanguage se consulta al invocar las funciones.
        function numberToSpanishWords(numStr) {
            const cleanStr = numStr.replace(/\./g, '');
            const num = parseInt(cleanStr, 10);
            if (isNaN(num)) return numStr;

            if (num === 50000) return 'cincuenta mil';
            if (num === 3400) return 'tres mil cuatrocientos';
            if (num === 2600) return 'dos mil seiscientos';
            if (num === 2670) return 'dos mil seiscientos setenta';
            if (num === 710) return 'setecientos diez';
            if (num === 80) return 'ochenta';
            if (num === 70) return 'setenta';
            if (num === 27) return 'veintisiete';
            if (num === 16) return 'dieciséis';
            if (num === 22) return 'veintidós';
            if (num === 38) return 'treinta y ocho';
            if (num === 28) return 'veintiocho';

            return numStr;
        }

        function preprocessTextForSpeech(text, spokenLanguage=appLanguage) {
            if (!text) return '';
            let result=String(text);
            // Expand historical abbreviations BEFORE sentence splitting; keep the original visible text untouched.
            const era=spokenLanguage==='en' ? ['before Christ','anno Domini'] : spokenLanguage==='it' ? ['avanti Cristo','dopo Cristo'] : ['antes de Cristo','después de Cristo'];
            result=result.replace(/\ba\s*\.\s*(?:de\s*)?C\s*\./gi,era[0])
                         .replace(/\bd\s*\.\s*(?:de\s*)?C\s*\./gi,era[1])
                         .replace(/\b(?:B\s*\.\s*C\s*\.|BC)\b/gi,era[0])
                         .replace(/\b(?:A\s*\.\s*D\s*\.|AD)\b/gi,era[1]);
            const wordSets={es:{thousand:'mil',million:'millones'},en:{thousand:'thousand',million:'million'},it:{thousand:'mila',million:'milioni'}};
            // 50.000 / 50,000 => 50000. Convert common monument figures and years to spoken words.
            result=result.replace(/\b\d{1,3}(?:[.,]\d{3})+\b/g,m=>numberToSpeechWords(m.replace(/[.,]/g,''),spokenLanguage));
            result=result.replace(/\b\d{1,6}\b/g,m=>numberToSpeechWords(m,spokenLanguage));
            if(spokenLanguage==='es') result=result.replace(/\bsiglo\s+([IVXLCDM]+)\b/gi,(_,r)=>'siglo '+romanToSpanishWords(r));
            return result.replace(/\baprox\./gi,spokenLanguage==='en'?'approximately':spokenLanguage==='it'?'circa':'aproximadamente')
                .replace(/\n+/g,'. ').replace(/\s+/g,' ').trim();
        }
        function numberToSpeechWords(raw, lang) {
            const n=Number(raw); if(!Number.isSafeInteger(n)||n<0||n>999999)return raw;
            const esUnits=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
            const enUnits=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
            const itUnits=['zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','undici','dodici','tredici','quattordici','quindici','sedici','diciassette','diciotto','diciannove'];
            function es(x){if(x<30)return esUnits[x];if(x<100){const tens=['','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];return tens[Math.floor(x/10)]+(x%10?' y '+es(x%10):'');}if(x<1000){if(x===100)return 'cien';const h=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];return h[Math.floor(x/100)]+(x%100?' '+es(x%100):'');}if(x<1000000)return (x<2000?'mil':es(Math.floor(x/1000))+' mil')+(x%1000?' '+es(x%1000):'');return raw;}
            function en(x){if(x<20)return enUnits[x];if(x<100){const t=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];return t[Math.floor(x/10)]+(x%10?'-'+en(x%10):'');}if(x<1000)return en(Math.floor(x/100))+' hundred'+(x%100?' and '+en(x%100):'');return en(Math.floor(x/1000))+' thousand'+(x%1000?' '+en(x%1000):'');}
            function it(x){if(x<20)return itUnits[x];if(x<100){const t=['','','venti','trenta','quaranta','cinquanta','sessanta','settanta','ottanta','novanta'];let prefix=t[Math.floor(x/10)];if(x%10===1||x%10===8)prefix=prefix.slice(0,-1);return prefix+(x%10?it(x%10):'');}if(x<1000)return (x<200?'cento':it(Math.floor(x/100))+'cento')+(x%100?it(x%100):'');return (x<2000?'mille':it(Math.floor(x/1000))+'mila')+(x%1000?it(x%1000):'');}
            return lang==='en'?en(n):lang==='it'?it(n):es(n);
        }
        function romanToSpanishWords(roman) {
            const map = {
                'I': 'primero', 'II': 'segundo', 'III': 'tercero', 'IV': 'cuarto', 'V': 'quinto',
                'VI': 'sexto', 'VII': 'séptimo', 'VIII': 'octavo', 'IX': 'noveno', 'X': 'décimo',
                'XI': 'once', 'XII': 'doce', 'XIII': 'trece', 'XIV': 'catorce', 'XV': 'quince',
                'XVI': 'dieciséis', 'XVII': 'diecisiete', 'XVIII': 'dieciocho', 'XIX': 'diecinueve', 'XX': 'veinte', 'XXI': 'veintiuno'
            };
            return map[roman.toUpperCase()] || roman;
        }

