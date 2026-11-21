/* Navigation module: initialized explicitly by app.js after DOM and data load. */
window.ArchiSpotterNavigation = (function () {
  function showTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.setAttribute('aria-selected', String(button.getAttribute('data-tab') === tab)); });
    document.querySelectorAll('.app-view').forEach(function (view) { view.hidden = view.id !== 'view-' + tab; });
    document.querySelector('.app-content').scrollTop = 0;
    document.dispatchEvent(new CustomEvent('archispotter:tab',{detail:tab}));
  }
  // Interactive iOS-like edge swipe with a noninteractive preview of the previous screen.
  var gesture=null;
  function visible(id){var el=document.getElementById(id);return el&&!el.hidden;}
  function resetPreview(g){
    if(!g)return;
    if(g.preview)g.preview.remove();
    if(g.panel){
      g.panel.style.transform='';
      g.panel.style.transition='';
      g.panel.style.position='';
      g.panel.style.zIndex='';
      g.panel.style.background='';
      g.panel.style.boxShadow='';
      g.panel.style.willChange='';
      g.panel.style.minHeight='';
    }
  }
  function onTouchStart(e){
    if(gesture){resetPreview(gesture);gesture=null;}
    if(e.touches.length!==1||!document.body.classList.contains('is-in-app'))return;
    if(!visible('view-explore')||e.touches[0].clientX>32)return;
    if(e.target.closest('#photo-viewer, input, textarea, select, [contenteditable="true"]'))return;
    var panel=visible('monument-detail')?document.getElementById('monument-detail'):
      visible('city-detail')?document.getElementById('city-detail'):
      visible('country-detail')?document.getElementById('country-detail'):null;
    if(!panel)return;
    var previous=document.getElementById(panel.id==='monument-detail'?
      (document.getElementById('monument-back').getAttribute('data-direct-country')==='true'?'country-detail':'city-detail'):
      panel.id==='city-detail'?'country-detail':'country-overview');
    gesture={x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,started:false,
      panel:panel,previous:previous,scroll:document.querySelector('.app-content')};
  }
  function onTouchMove(e){
    var g=gesture;
    if(!g||e.touches.length!==1)return;
    var dx=e.touches[0].clientX-g.x,dy=e.touches[0].clientY-g.y;
    if(!g.started){
      if(dx<10||Math.abs(dx)<Math.abs(dy)*1.25)return;
      g.started=true;
      var preview=g.previous.cloneNode(true);
      preview.removeAttribute('id');
      preview.removeAttribute('hidden');
      preview.querySelectorAll('[id]').forEach(function(el){el.removeAttribute('id');});
      preview.setAttribute('aria-hidden','true');
      preview.style.cssText='display:block!important;position:absolute;left:0;top:'+g.scroll.scrollTop+
        'px;width:100%;pointer-events:none;z-index:0;opacity:.88;transform:translateX(-20px);';
      g.preview=preview;
      g.panel.parentNode.insertBefore(preview,g.panel);
      g.panel.style.position='relative';
      g.panel.style.zIndex='1';
      g.panel.style.background='#101517';
      g.panel.style.boxShadow='-10px 0 24px rgba(0,0,0,.24)';
      g.panel.style.willChange='transform';
      g.panel.style.minHeight='100%';
    }
    g.dx=Math.max(0,Math.min(dx,g.scroll.clientWidth));
    g.panel.style.transform='translate3d('+g.dx+'px,0,0)';
    g.preview.style.transform='translate3d('+(-20+20*g.dx/Math.max(1,g.scroll.clientWidth))+'px,0,0)';
    g.preview.style.opacity=String(.88+.12*g.dx/Math.max(1,g.scroll.clientWidth));
  }
  function onTouchEnd(e){
    var g=gesture;gesture=null;
    if(!g)return;
    if(!g.started){resetPreview(g);return;}
    var commit=g.dx>Math.min(115,g.scroll.clientWidth*.32);
    g.panel.style.transition='transform 180ms ease-out';
    g.panel.style.transform='translate3d('+(commit?g.scroll.clientWidth:0)+'px,0,0)';
    var finish=function(){
      resetPreview(g);
      if(commit){
        var back=g.panel.id==='monument-detail'?'monument-back':
          g.panel.id==='city-detail'?'city-back':'country-back';
        document.getElementById(back).click();
      }
    };
    setTimeout(finish,190);
  }
  function onTouchCancel(){if(gesture){resetPreview(gesture);gesture=null;}}
  var initialized=false;
  function init() {
    if(initialized)return;
    initialized=true;
    document.addEventListener('touchstart',onTouchStart,{passive:true});
    document.addEventListener('touchmove',onTouchMove,{passive:true});
    document.addEventListener('touchend',onTouchEnd,{passive:true});
    document.addEventListener('touchcancel',onTouchCancel,{passive:true});
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.addEventListener('click', function () { showTab(button.getAttribute('data-tab')); }); });
  }
  return { showTab: showTab, init: init };
})();
