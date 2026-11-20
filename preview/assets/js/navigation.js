/* Navigation module: initialized explicitly by app.js after DOM and data load. */
window.ArchiSpotterNavigation = (function () {
  function showTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.setAttribute('aria-selected', String(button.getAttribute('data-tab') === tab)); });
    document.querySelectorAll('.app-view').forEach(function (view) { view.hidden = view.id !== 'view-' + tab; });
    document.querySelector('.app-content').scrollTop = 0;
  }
  function init() {
    document.querySelectorAll('[data-tab]').forEach(function (button) { button.addEventListener('click', function () { showTab(button.getAttribute('data-tab')); }); });
  }
  return { showTab: showTab, init: init };
})();
