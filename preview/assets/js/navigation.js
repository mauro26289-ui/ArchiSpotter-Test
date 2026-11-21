/* Navigation module: initialized explicitly by app.js after DOM and data load. */
window.ArchiSpotterNavigation = (function () {
  function showTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.setAttribute('aria-selected', String(button.getAttribute('data-tab') === tab)); });
    document.querySelectorAll('.app-view').forEach(function (view) { view.hidden = view.id !== 'view-' + tab; });
    document.querySelector('.app-content').scrollTop = 0;
    document.dispatchEvent(new CustomEvent('archispotter:tab',{detail:tab}));
  }
  // Edge swipe back within Explore; leave map and photo gestures untouched.
  var gesture=null;
  function visible(id){var el=document.getElementById(id);return el&&!el.hidden;}
  function onTouchStart(e){
    gesture=null;
    if(e.touches.length!==1||!document.body.classList.contains('is-in-app'))return;
    if(!visible('view-explore')||e.touches[0].clientX>28)return;
    if(!visible('monument-detail')&&!visible('city-detail')&&!visible('country-detail'))return;
    if(e.target.closest('#photo-viewer, input, textarea, select, [contenteditable="true"]'))return;
    gesture={x:e.touches[0].clientX,y:e.touches[0].clientY,time:Date.now()};
  }
  function onTouchEnd(e){
    if(!gesture||e.changedTouches.length!==1){gesture=null;return;}
    var start=gesture;gesture=null;
    var dx=e.changedTouches[0].clientX-start.x;
    var dy=e.changedTouches[0].clientY-start.y;
    if(dx<85||Math.abs(dy)>Math.abs(dx)*0.65||Date.now()-start.time>900)return;
    var back=visible('monument-detail')?'monument-back':visible('city-detail')?'city-back':visible('country-detail')?'country-back':null;
    if(back)document.getElementById(back).click();
  }
  var initialized=false;
  function init() {
    if(initialized)return;
    initialized=true;
    document.addEventListener('touchstart',onTouchStart,{passive:true});
    document.addEventListener('touchend',onTouchEnd,{passive:true});
    document.addEventListener('touchcancel',function(){gesture=null;},{passive:true});
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.addEventListener('click', function () { showTab(button.getAttribute('data-tab')); }); });
  }
  return { showTab: showTab, init: init };
})();
