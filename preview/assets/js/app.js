    (function () {
      var splash = document.getElementById('splash');
      var auth = document.getElementById('auth');
      var home = document.getElementById('home');
      function showScreen(screen) {
        [splash, auth, home].forEach(function (el) { el.classList.toggle('is-active', el === screen); });
        document.body.classList.toggle('is-in-app', screen === home);
        document.documentElement.classList.toggle('is-in-app', screen === home);
      }
      var strings = window.ArchiSpotterData.strings;
      function currentLang() {
        try { var l = localStorage.getItem('archispotter_language'); return strings[l] ? l : 'es'; } catch (_) { return 'es'; }
      }
      function applyLanguage() {
        var lang = currentLang(), words = strings[lang];
        document.documentElement.lang = lang;
        if(window.ArchiSpotterMap&&window.ArchiSpotterMap.applyLanguage)window.ArchiSpotterMap.applyLanguage();
        document.querySelectorAll('#home [data-i18n]').forEach(function (el) {
          el.textContent = words[el.getAttribute('data-i18n')] || '';
        });
        document.querySelectorAll('[data-lang]').forEach(function (el) { el.setAttribute('aria-pressed', String(el.getAttribute('data-lang') === lang)); });
        var user = sessionUser();
        if (user) document.getElementById('welcome-user').textContent = words.welcome + user;
        updateCountryNames();
        renderCountryCities();
        renderMonument();
      }
      var monumentModule = window.ArchiSpotterMonuments.init(currentLang,strings);
      var openMonument = monumentModule.openMonument;
      if(window.ArchiSpotterMap)window.ArchiSpotterMap.openMonument=function(place,city,country){
        var countryButton=document.querySelector('[data-country="'+country+'"]');
        if(!countryButton)return;
        countryButton.click();
        exploreModule.openCity(city);
        window.ArchiSpotterNavigation.showTab('explore');
        openMonument(place,city);
      };
      var renderMonument = monumentModule.renderMonument;
      var exploreModule = window.ArchiSpotterExplore.init(currentLang,strings,openMonument);
      var renderCountryCities = exploreModule.renderCountryCities;
      var updateCountryNames = exploreModule.updateCountryNames;
      var showTab = window.ArchiSpotterNavigation.showTab;
      window.ArchiSpotterNavigation.init();
      document.querySelectorAll('[data-lang]').forEach(function (button) { button.addEventListener('click', function () {
        try { localStorage.setItem('archispotter_language', button.getAttribute('data-lang')); } catch (_) {}
        applyLanguage();
      }); });
      function enter(user) {
        showTab('explore');
        applyLanguage();
        showScreen(home);
      }
      var authModule = window.ArchiSpotterAuth.init(enter,showScreen,auth);
      var sessionUser = authModule.sessionUser;
      setTimeout(function () {
        var user = sessionUser();
        if (user) enter(user);
        else showScreen(auth);
      }, 2000);
    })();
