/* Local-only authentication, registration, and session persistence. */
window.ArchiSpotterAuth = (function () {
  function init(enter, showScreen, authScreen) {
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
        showScreen(authScreen);
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
    return {sessionUser:sessionUser};
  }
  return {init:init};
})();
