// Extraído de app.js (E89); comportamiento original preservado.
        let archiTranslationQueued=false;
        const archiTranslationObserver=new MutationObserver(()=>{
            if(archiTranslationQueued)return;
            archiTranslationQueued=true;
            queueMicrotask(()=>{
                archiTranslationQueued=false;
                translateStaticTextNodes();
            });
        });
        function observeArchiTranslations(){
            if(document.body)archiTranslationObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
        }
        if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observeArchiTranslations,{once:true});
        else observeArchiTranslations();
