// Extraído sin alterar la lógica original de ArchiSpotter.
        function archiExploreScroller(){return document.querySelector('#app > main');}
        function archiRememberExploreScroll(level){
            const scroller=archiExploreScroller();
            if(scroller && currentTab==='explore') archiExploreScrollPositions[level]=scroller.scrollTop;
        }
        function archiRestoreExploreScroll(level){
            const scroller=archiExploreScroller();
            if(!scroller)return;
            const y=archiExploreScrollPositions[level]||0;
            // Render happens synchronously; the next frame restores after layout.
            requestAnimationFrame(()=>{scroller.scrollTop=y;});
        }
        (function archiInstallEdgeBackGesture(){
            let start=null;
            let active=null;
            const edge=32;
            function cleanOverlay(){
                if(active?.overlay)active.overlay.remove();
                document.documentElement.classList.remove('archi-edge-swiping');
            }
            function reset(){start=null;active=null;}
            function moveFrame(dx){
                if(!active)return;
                if(active.type==='surface'){moveSurface(dx);return;}
                const width=active.width;
                const progress=Math.max(0,Math.min(1,dx/width));
                active.progress=progress;
                active.overlay.style.transform=`translate3d(${progress*width}px,0,0)`;
                active.overlay.style.boxShadow=`-5px 0 14px rgba(0,0,0,${0.08*(1-progress)})`;
                active.under.style.transform=`translate3d(${(-width*0.22)*(1-progress)}px,0,0)`;
                // Preserve original colors: never fade the destination screen.
            }
            function finish(commit){
                if(!active){reset();return;}
                const state=active;
                state.overlay.style.transition='transform 230ms cubic-bezier(.22,.8,.24,1),box-shadow 230ms ease';
                state.under.style.transition='transform 230ms cubic-bezier(.22,.8,.24,1)';
                state.overlay.style.transform=`translate3d(${commit?state.width:0}px,0,0)`;
                state.under.style.transform=`translate3d(${commit?0:-state.width*.22}px,0,0)`;
                // No opacity animation: both screens remain fully opaque.
                // Restore the original view only when the gesture is cancelled.
                if(!commit){
                    selectedCountry=state.country;
                    selectedCity=state.city;
                }
                const finalize=()=>{
                    if(active!==state)return;
                    if(!commit){
                        renderNavigationFlow();
                        const scroller=archiExploreScroller();
                        if(scroller)scroller.scrollTop=state.scroll;
                    }
                    state.under.style.transition='';
                    state.under.style.transform='';
                    state.under.style.opacity='';
                    cleanOverlay();reset();
                };
                state.overlay.addEventListener('transitionend',finalize,{once:true});
                // Reduced-motion / interrupted-transition fallback.
                setTimeout(()=>{if(active===state)finalize();},310);
            }
            // Every dismissible surface participates in the same live edge gesture.
            // Use its actual DOM node: no snapshots, cloned IDs, or opacity changes.
            // Interactive edge gesture is intentionally limited to monument details.
            const surfaceSpecs=[
                ['monument-modal',()=>{closeModal();archiRestoreExploreScroll('monuments');}]
            ];
            function visibleSurface(){
                for(const [id,close] of surfaceSpecs){
                    const el=document.getElementById(id);
                    if(!el || el.hidden || el.classList.contains('hidden'))continue;
                    if(getComputedStyle(el).display==='none')continue;
                    return {el,close,id};
                }
                return null;
            }
            function beginSurface(){
                const surface=visibleSurface();
                if(!surface)return false;
                const {el,id}=surface;
                const panel=id==='monument-modal'?el.firstElementChild:el;
                if(!panel)return false;
                const previous={transition:panel.style.transition,transform:panel.style.transform,animation:panel.style.animation,willChange:panel.style.willChange};
                if(id==='monument-modal')el.classList.add('archi-modal-edge-active');
                panel.style.transition='none';panel.style.animation='none';panel.style.willChange='transform';
                active={type:'surface',...surface,panel,previous,width:window.innerWidth,progress:0};
                return true;
            }
            function moveSurface(dx){
                const state=active;
                if(!state || state.type!=='surface')return;
                state.progress=Math.max(0,Math.min(1,dx/state.width));
                state.panel.style.transform=`translate3d(${state.progress*state.width}px,0,0)`;
            }
            function finishSurface(commit){
                const state=active;
                if(!state || state.type!=='surface')return;
                start=null;
                state.panel.style.transition='transform 230ms cubic-bezier(.22,.8,.24,1)';
                state.panel.style.transform=`translate3d(${commit?state.width:0}px,0,0)`;
                const finalize=()=>{
                    if(active!==state)return;
                    Object.assign(state.panel.style,state.previous);
                    state.el.classList.remove('archi-modal-edge-active');
                    active=null;
                    if(commit)state.close();
                };
                state.panel.addEventListener('transitionend',finalize,{once:true});
                setTimeout(()=>{if(active===state)finalize();},320);
            }
            function begin(){
                if(!start || active || currentTab!=='explore' || !(selectedCity || selectedCountry))return false;
                const main=archiExploreScroller();
                if(!main)return false;
                const rect=main.getBoundingClientRect();
                const overlay=main.cloneNode(true);
                // Keep IDs and the original #app > main ancestry during the brief visual transition.
                // Removing IDs and mounting outside #app broke selector-based colors on iOS Safari.
                overlay.setAttribute('aria-hidden','true');
                overlay.inert=true;
                // Reuse already decoded images in the visual copy, avoiding lazy-load flicker.
                const sourceImages=main.querySelectorAll('img');
                overlay.querySelectorAll('img').forEach((img,i)=>{
                    const original=sourceImages[i];
                    if(!original)return;
                    const displayed=original.currentSrc || original.src;
                    if(displayed)img.src=displayed;
                    img.loading='eager';
                    img.decoding='sync';
                    img.removeAttribute('srcset');
                });
                overlay.classList.add('archi-edge-foreground');
                Object.assign(overlay.style,{
                    position:'fixed',top:`${rect.top}px`,left:`${rect.left}px`,
                    width:`${rect.width}px`,height:`${rect.height}px`,
                    margin:'0',zIndex:'999',pointerEvents:'none',
                    overflow:'hidden',background:getComputedStyle(main).backgroundColor||'var(--archi-bg)',
                    willChange:'transform',transform:'translate3d(0,0,0)'
                });
                overlay.scrollTop=main.scrollTop;
                const state={overlay,under:main,width:rect.width,country:selectedCountry,city:selectedCity,scroll:main.scrollTop,progress:0};
                active=state;
                main.parentElement.appendChild(overlay);
                document.documentElement.classList.add('archi-edge-swiping');
                // Show the destination underneath the moving snapshot.
                if(selectedCity)selectedCity=null;
                else selectedCountry=null;
                renderNavigationFlow();
                archiRestoreExploreScroll(state.city?'cities':'countries');
                moveFrame(0);
                return true;
            }
            document.addEventListener('touchstart',event=>{
                if(active || event.touches.length!==1){start=null;return;}
                const t=event.touches[0];
                if(t.clientX>edge){start=null;return;}
                if(event.target.closest('input, textarea, select, [contenteditable="true"]')){start=null;return;}
                start={x:t.clientX,y:t.clientY,time:Date.now(),lastX:t.clientX};
            },{passive:true});
            document.addEventListener('touchmove',event=>{
                if(!start || event.touches.length!==1)return;
                const t=event.touches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
                if(!active){
                    if(dy>12 && Math.abs(dy)>Math.abs(dx)){start=null;return;}
                    if(dx<9 || dx<Math.abs(dy)*1.25)return;
                    if(visibleSurface()){
                        if(!beginSurface())return;
                    } else if(!begin())return;
                }
                if(event.cancelable)event.preventDefault();
                start.lastX=t.clientX;
                moveFrame(Math.max(0,dx));
            },{passive:false});
            document.addEventListener('touchend',event=>{
                if(!start || event.changedTouches.length!==1){if(active){if(active.type==='surface')finishSurface(false);else finish(false);}else reset();return;}
                const t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
                if(active){
                    const velocity=dx/Math.max(1,Date.now()-start.time);
                    const commit=active.progress>0.38 || (dx>55 && velocity>0.55);
                    if(active.type==='surface')finishSurface(commit);
                    
                    else finish(commit);
                    return;
                }
                const valid=dx>75 && dx>Math.abs(dy)*1.45 && Date.now()-start.time<1100;
                reset();
                if(!valid)return;
                const modal=document.getElementById('monument-modal');
                if(modal && !modal.classList.contains('hidden')){closeModal();archiRestoreExploreScroll('monuments');return;}
            },{passive:true});
            document.addEventListener('touchcancel',()=>{if(active){if(active.type==='surface')finishSurface(false);else finish(false);}else reset();},{passive:true});
        })();

