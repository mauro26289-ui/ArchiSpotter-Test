/* Navigation module: initialized explicitly by app.js after DOM and data load. */
window.ArchiSpotterNavigation = (function () {
  var currentTab='explore', settingsReturn=null;
  function closeSettings(){if(currentTab!=='settings')return;var saved=settingsReturn||{tab:'explore',top:0};showTab(saved.tab,true);}
  function showTab(tab,restore) {
    var sc=document.querySelector('.app-content');
    if(tab==='settings'&&currentTab!=='settings')settingsReturn={tab:currentTab,top:sc.scrollTop};
    var top=restore&&settingsReturn?settingsReturn.top:0;
    if(tab!=='settings')settingsReturn=null;
    currentTab=tab;
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.setAttribute('aria-selected', String(button.getAttribute('data-tab') === (tab==='travel'?'explore':tab))); });
    document.querySelectorAll('.app-view').forEach(function (view) { view.hidden = view.id !== 'view-' + tab; });
    sc.scrollTop = top;
    if(restore)requestAnimationFrame(function(){if(currentTab===tab)sc.scrollTop=top;});
    document.dispatchEvent(new CustomEvent('archispotter:tab',{detail:tab}));
  }
  // Interactive iOS-like edge swipe with a noninteractive preview of the previous screen.
  var gesture=null;
  var settleTimer=null,settlingGesture=null;
  function cancelSettle(){if(settleTimer!==null){clearTimeout(settleTimer);settleTimer=null;}if(settlingGesture){resetPreview(settlingGesture);settlingGesture=null;}}
  function visible(id){var el=document.getElementById(id);return el&&!el.hidden;}
  function resetPreview(g){
    if(!g)return;
    if(g.preview){
      g.preview.hidden=true;
      g.preview.removeAttribute('style');
      g.preview.removeAttribute('aria-hidden');
    }
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
    cancelSettle();
    if(gesture){resetPreview(gesture);gesture=null;}
    if(e.touches.length!==1||!document.body.classList.contains('is-in-app'))return;
    if(e.touches[0].clientX>32)return;
    if(e.target.closest('#photo-viewer, input, textarea, select, [contenteditable="true"]'))return;
    var special=currentTab==='settings'?document.getElementById('view-settings'):currentTab==='travel'&&window.ArchiSpotterFood&&window.ArchiSpotterFood.canBack()?document.querySelector('#travel-preview .food-guide'):null;
    if(special){gesture={x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,started:false,panel:special,scroll:document.querySelector('.app-content'),action:currentTab==='settings'?closeSettings:window.ArchiSpotterFood.back};return;}
    if(currentTab==='travel'){gesture={x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,started:false,panel:document.getElementById('view-travel'),scroll:document.querySelector('.app-content'),action:function(){document.getElementById('travel-preview-close').click();}};return;}
    if(!visible('view-explore'))return;
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
      // Reveal the real previous view instead of cloning the DOM.
      // Cloning duplicated images, IDs and layout, producing the broken layered view.
      if(g.action){g.panel.style.willChange='transform';}else{
      var preview=g.previous;
      preview.hidden=false;
      preview.setAttribute('aria-hidden','true');
      preview.style.setProperty('display','block','important');
      preview.style.position='absolute';
      preview.style.left='0';
      preview.style.top=g.scroll.scrollTop+'px';
      preview.style.width='100%';
      preview.style.height=g.scroll.clientHeight+'px';
      preview.style.overflow='hidden';
      preview.style.pointerEvents='none';
      preview.style.zIndex='0';
      preview.style.opacity='.88';
      preview.style.transform='translate3d(-20px,0,0)';
      g.preview=preview;
      g.panel.style.position='relative';
      g.panel.style.zIndex='1';
      g.panel.style.background='var(--paper)';
      g.panel.style.boxShadow='-10px 0 24px rgba(0,0,0,.24)';
      g.panel.style.willChange='transform';
      g.panel.style.minHeight='100%';
      }
    }
    g.dx=Math.max(0,Math.min(dx,g.scroll.clientWidth));
    g.panel.style.transform='translate3d('+g.dx+'px,0,0)';
    if(g.preview)g.preview.style.transform='translate3d('+(-20+20*g.dx/Math.max(1,g.scroll.clientWidth))+'px,0,0)';
    if(g.preview)g.preview.style.opacity=String(.88+.12*g.dx/Math.max(1,g.scroll.clientWidth));
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
      if(commit&&g.action){g.action();return;}
      if(commit){
        var back=g.panel.id==='monument-detail'?'monument-back':
          g.panel.id==='city-detail'?'city-back':'country-back';
        document.getElementById(back).click();
      }
    };
    settlingGesture=g;
    settleTimer=setTimeout(function(){settleTimer=null;settlingGesture=null;finish();},190);
  }
  function onTouchCancel(){cancelSettle();if(gesture){resetPreview(gesture);gesture=null;}}
  var initialized=false;
  function init() {
    if(initialized)return;
    initialized=true;
    document.addEventListener('touchstart',onTouchStart,{passive:true});
    document.addEventListener('touchmove',onTouchMove,{passive:true});
    document.addEventListener('touchend',onTouchEnd,{passive:true});
    document.addEventListener('touchcancel',onTouchCancel,{passive:true});
    document.addEventListener('visibilitychange',function(){if(document.hidden)onTouchCancel();});
    document.getElementById('settings-close').addEventListener('click',closeSettings);
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.addEventListener('click', function () { var tab=button.getAttribute('data-tab');if(tab==='explore'){if(window.ArchiSpotterTravel)window.ArchiSpotterTravel.close();['country-detail','city-detail','monument-detail'].forEach(function(id){document.getElementById(id).hidden=true;});document.getElementById('country-overview').hidden=false;}showTab(tab); }); });
  }
  return { showTab: showTab, init: init };
})();
