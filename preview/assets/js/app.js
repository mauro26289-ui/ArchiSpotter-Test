    (function () {
      var img = document.getElementById('bg-img');
      var splash = document.getElementById('splash');
      var auth = document.getElementById('auth');
      var home = document.getElementById('home');
      var submitBtn = document.getElementById('submit-btn');
      var pass = document.getElementById('pass');
      var error = document.getElementById('auth-error');
      var ACCOUNTS = 'archispotter_local_accounts_v1';
      var SESSION = 'archispotter_local_session_v1';
      var DEFAULT_USER = 'user';
      var DEFAULT_PASSWORD = 'user123';

      function accounts() {
        try {
          var value = JSON.parse(localStorage.getItem(ACCOUNTS) || '{}');
          return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        } catch (_) { return {}; }
      }
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
      function sessionUser() {
        try {
          var user = localStorage.getItem(SESSION);
          return user && (user === DEFAULT_USER || Object.prototype.hasOwnProperty.call(accounts(), user)) ? user : null;
        } catch (_) { return null; }
      }
      async function digest(password, salt) {
        if (!crypto || !crypto.subtle) throw new Error('WebCrypto unavailable');
        var data = new TextEncoder().encode(salt + ':' + password);
        var bytes = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(bytes), function (n) { return n.toString(16).padStart(2, '0'); }).join('');
      }
      document.getElementById('logout-btn').addEventListener('click', function () {
        try { localStorage.removeItem(SESSION); } catch (_) {}
        document.getElementById('auth-form').reset();
        error.textContent = '';
        showScreen(auth);
      });
      document.getElementById('auth-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        error.textContent = '';
        var username = document.getElementById('user').value.trim().toLowerCase();
        var password = pass.value;
        if (username.length < 3 || password.length < 6) {
          error.textContent = 'Usa al menos 3 caracteres para el usuario y 6 para la contraseña.';
          return;
        }
        submitBtn.disabled = true;
        try {
          var saved = accounts();
          if (username === DEFAULT_USER) {
            if (password !== DEFAULT_PASSWORD) { error.textContent = 'Usuario o contraseña incorrectos.'; return; }
          } else if (Object.prototype.hasOwnProperty.call(saved, username)) {
            var account = saved[username];
            if (!account || await digest(password, account.salt) !== account.hash) {
              error.textContent = 'Usuario o contraseña incorrectos.';
              return;
            }
          } else {
            if (!window.crypto || !crypto.getRandomValues) throw new Error('Crypto unavailable');
            var salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (n) { return n.toString(16).padStart(2, '0'); }).join('');
            saved[username] = { salt: salt, hash: await digest(password, salt) };
            localStorage.setItem(ACCOUNTS, JSON.stringify(saved));
          }
          localStorage.setItem(SESSION, username);
          enter(username);
        } catch (_) {
          error.textContent = 'No se pudo acceder a la cuenta en este navegador.';
        } finally { submitBtn.disabled = false; }
      });
      setTimeout(function () {
        var user = sessionUser();
        if (user) enter(user);
        else showScreen(auth);
      }, 2000);
    })();
