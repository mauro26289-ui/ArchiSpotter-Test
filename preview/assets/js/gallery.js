/* Visor independiente: no altera la fotografía ni el viewport del splash. */
      (function () {
        var hero = document.getElementById('explore-hero');
        var viewer = document.getElementById('photo-viewer');
        var photo = document.getElementById('photo-viewer-image');
        var close = document.getElementById('photo-viewer-close');
        var hint = document.getElementById('photo-viewer-hint');
        var monumentTrigger = document.getElementById('monument-photo-trigger');
        var returnFocus = hero;
        var points = new Map();
        var scale = 1, x = 0, y = 0, startDistance = 0, startScale = 1;
        var startMid = null, startX = 0, startY = 0, lastTap = 0;
        function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
        function bounds() {
          var naturalW = photo.naturalWidth || 1, naturalH = photo.naturalHeight || 1;
          var fit = Math.min(viewer.clientWidth / naturalW, viewer.clientHeight / naturalH);
          var renderedW = naturalW * fit, renderedH = naturalH * fit;
          return { x:Math.max(0,(renderedW*scale-viewer.clientWidth)/2), y:Math.max(0,(renderedH*scale-viewer.clientHeight)/2) };
        }
        function paint() {
          var b = bounds();
          x = clamp(x,-b.x,b.x); y = clamp(y,-b.y,b.y);
          photo.style.transform = 'translate3d('+x+'px,'+y+'px,0) scale('+scale+')';
        }
        function reset() { scale=1; x=0; y=0; points.clear(); paint(); }
        function openViewerFrom(source, trigger) {
          if (!source || !source.getAttribute('src')) return;
          returnFocus = trigger;
          photo.src = source.currentSrc || source.src;
          photo.alt = source.alt || '';
          viewer.setAttribute('aria-label', source.alt || 'Fotografía ampliada');
          viewer.hidden=false;
          reset();
          hint.hidden=false;
          close.focus({preventScroll:true});
        }
        function openViewer() { openViewerFrom(hero.querySelector('img'),hero); }
        function openMonumentViewer() { openViewerFrom(document.getElementById('monument-photo'),monumentTrigger); }
        function closeViewer() {
          points.clear();
          viewer.hidden=true;
          photo.removeAttribute('src');
          if(returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true});
        }
        hero.addEventListener('click',openViewer);
        monumentTrigger.addEventListener('click',openMonumentViewer);
        monumentTrigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openMonumentViewer();}});
        hero.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openViewer();}});
        close.addEventListener('click',closeViewer);
        document.addEventListener('keydown',function(e){if(viewer.hidden)return;if(e.key==='Escape')closeViewer();});
        photo.addEventListener('load',paint);
        function geometry() {
          var a=Array.from(points.values());
          if(a.length<2)return null;
          return { distance:Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y), mid:{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2} };
        }
        function restart() {
          var g=geometry();
          startScale=scale;startX=x;startY=y;
          if(g){startDistance=Math.max(1,g.distance);startMid=g.mid;}
          else if(points.size===1){startMid=Array.from(points.values())[0];}
        }
        viewer.addEventListener('pointerdown',function(e){
          if(e.target===close)return;
          e.preventDefault();
          viewer.setPointerCapture(e.pointerId);
          points.set(e.pointerId,{x:e.clientX,y:e.clientY});
          restart();
          hint.hidden=true;
        });
        viewer.addEventListener('pointermove',function(e){
          if(!points.has(e.pointerId))return;
          points.set(e.pointerId,{x:e.clientX,y:e.clientY});
          var g=geometry();
          if(g){
            scale=clamp(startScale*g.distance/startDistance,1,5);
            x=startX+g.mid.x-startMid.x;
            y=startY+g.mid.y-startMid.y;
          } else if(points.size===1&&scale>1) {
            x=startX+e.clientX-startMid.x;
            y=startY+e.clientY-startMid.y;
          }
          paint();
        });
        function end(e){
          if(!points.has(e.pointerId))return;
          points.delete(e.pointerId);
          restart();
        }
        viewer.addEventListener('pointerup',end);
        viewer.addEventListener('pointercancel',end);
        viewer.addEventListener('lostpointercapture',end);
        viewer.addEventListener('dblclick',function(e){
          if(e.target===close)return;
          scale=scale>1?1:2.5;
          if(scale===1){x=0;y=0;}
          paint();
        });
        viewer.addEventListener('touchend',function(e){
          if(e.touches.length!==0||e.changedTouches.length!==1)return;
          var now=Date.now();
          if(now-lastTap<290){scale=scale>1?1:2.5;if(scale===1){x=0;y=0;}paint();lastTap=0;}
          else lastTap=now;
        },{passive:true});
        viewer.addEventListener('wheel',function(e){
          e.preventDefault();
          scale=clamp(scale*(e.deltaY<0?1.12:.89),1,5);
          if(scale===1){x=0;y=0;}
          paint();
        },{passive:false});
        window.addEventListener('resize',function(){if(!viewer.hidden)paint();},{passive:true});
      })();
