// Función original extraída de app.js sin modificar su implementación.
        function translateStaticTextNodes() {
            const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
            const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
            for(const node of nodes){
                const parent=node.parentElement;
                if(!parent||['SCRIPT','STYLE','OPTION','TEXTAREA'].includes(parent.tagName)||parent.closest('#archi-onboarding'))continue;
                const current=node.textContent;
                const match=current.match(/^(\s*)(.*?)(\s*)$/s);if(!match)continue;
                let original=node.__archiSpanishText||match[2];
                // An explicit UI renderer may have replaced the text. Do not restore a stale Spanish original.
                if(node.__archiSpanishText && ![original,staticTextEnglish[original],staticTextItalian[original]].includes(match[2])){
                    delete node.__archiSpanishText;
                    original=match[2];
                }
                if(!Object.prototype.hasOwnProperty.call(staticTextEnglish,original))continue;
                node.__archiSpanishText=original;
                const next=match[1]+(appLanguage==='it'?(staticTextItalian[original]||original):appLanguage==='en'?staticTextEnglish[original]:original)+match[3];
                if(node.textContent!==next)node.textContent=next;
            }
            for(const el of document.querySelectorAll('[placeholder],[title],[aria-label]')){
                for(const attr of ['placeholder','title','aria-label']){
                    const current=el.getAttribute(attr);if(!current)continue;
                    const key='archiOriginal'+attr;
                    const original=el.dataset[key]||current;
                    if(!Object.prototype.hasOwnProperty.call(staticTextEnglish,original))continue;
                    el.dataset[key]=original;
                    const next=appLanguage==='it'?(staticTextItalian[original]||original):appLanguage==='en'?staticTextEnglish[original]:original;
                    if(el.getAttribute(attr)!==next)el.setAttribute(attr,next);
                }
            }
        }
