// Bloque original de app.js, extraído sin cambiar su implementación.
        // Free Wikimedia article thumbnails. Only new monuments are affected;
        // original 45 retain their curated images unchanged.
        const archiNewMonumentIds = {"fr-mont-saint-michel": true, "ma-hassan-ii-mosque": true, "br-museu-amanha": true, "us-salk-institute": true, "us-fallingwater": true, "in-lotus-temple": true, "fr-chartres-cathedral": true, "zw-great-zimbabwe": true, "et-lalibela-churches": true, "qa-national-museum": true};
        async function loadWorldMonumentPhotos(){
            const additions=monumentsData.filter(m=>m.wikipediaTitle && (m.id.startsWith('world-') || m.id in archiNewMonumentIds));
            for(const m of additions){if(!m.images?.length)m.images=[architecturePlaceholder()];}
            if(!additions.length)return;
            let cache={};
            try{cache=JSON.parse(localStorage.getItem('archispotter_world_photos_v1')||'{}')||{};}catch(e){}
            const pending=[];
            for(const m of additions){
                const cached=cache[m.id];
                if(cached){
                    m.images=[cached];
                    document.querySelectorAll('img[data-monument-id="'+m.id+'"]').forEach(img=>{img.src=cached;img.dataset.fallbackDone='false';});
                }else pending.push(m);
            }
            for(let i=0;i<pending.length;i+=15){
                const batch=pending.slice(i,i+15);
                const byTitle=new Map(batch.map(m=>[m.wikipediaTitle.toLowerCase(),m]));
                try{
                    const url='https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&pithumbsize=1000&titles='+encodeURIComponent(batch.map(m=>m.wikipediaTitle).join('|'));
                    const response=await fetch(url);
                    if(!response.ok)continue;
                    const data=await response.json();
                    for(const page of (data.query?.pages||[])){
                        const requested=(data.query?.redirects||[]).find(r=>r.to?.toLowerCase()===(page.title||'').toLowerCase())?.from;
                        const match=byTitle.get((page.title||'').toLowerCase()) || byTitle.get((requested||'').toLowerCase());
                        if(!match||!page.thumbnail?.source)continue;
                        const src=page.thumbnail.source;
                        match.images=[src];cache[match.id]=src;
                        document.querySelectorAll('img[data-monument-id="'+match.id+'"]').forEach(img=>{img.src=src;img.dataset.fallbackDone='false';});
                    }
                    try{localStorage.setItem('archispotter_world_photos_v1',JSON.stringify(cache));}catch(e){}
                    if(selectedCountry && !selectedCity)renderCities();
                    else if(selectedCountry && selectedCity)renderMonuments();
                }catch(e){console.info('Wikimedia image lookup unavailable',e);}
            }
        }
        window.addEventListener('load',()=>setTimeout(loadWorldMonumentPhotos,500));

