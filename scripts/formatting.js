/* V27 presentation helpers */
function getFlagForCountry(cName, overrideFlag) {
            if (overrideFlag && overrideFlag.trim() !== '') return overrideFlag;
            return countryFlagsDict[cName] || '🏛️';
        }

function localYear(value){if(appLanguage==='it')return String(value).replace(/\bPresente\b/gi,'oggi').replace(/\bActualidad\b/gi,'oggi').replace(/\ba\.\s*C\./gi,'a.C.').replace(/\bd\.\s*C\./gi,'d.C.').replace(/\bSiglo\b/gi,'secolo');return appLanguage==='en'?String(value).replace(/\bPresente\b/gi,'Present').replace(/\bActualidad\b/gi,'Present').replace(/\ba\.\s*C\./gi,'BC').replace(/\bd\.\s*C\./gi,'AD').replace(/\bSiglo\b/gi,'Century').replace(/\bsiglos\b/gi,'centuries'):value;}
