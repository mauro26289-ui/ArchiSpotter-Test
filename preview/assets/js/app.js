    (function () {
      var img = document.getElementById('bg-img');
      var splash = document.getElementById('splash');
      var auth = document.getElementById('auth');
      var home = document.getElementById('home');
      var mode = 'login';
      var modeLabel = document.getElementById('mode-label');
      var submitBtn = document.getElementById('submit-btn');
      var switchBtn = document.getElementById('switch-btn');
      var pass = document.getElementById('pass');
      var toast = document.getElementById('toast');
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
      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
      }
      function setMode(next) {
        mode = next;
        error.textContent = '';
        document.getElementById('auth-form').reset();
        modeLabel.textContent = next === 'login' ? 'Iniciar sesión' : 'Crear usuario';
        submitBtn.textContent = modeLabel.textContent;
        switchBtn.textContent = next === 'login' ? 'Crear usuario' : 'Ya tengo cuenta';
        pass.setAttribute('autocomplete', next === 'login' ? 'current-password' : 'new-password');
        document.getElementById('forgot-btn').hidden = next !== 'login';
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
      var countryCitySamples = window.ArchiSpotterData.countryCitySamples;
      function renderCountryCities() {
        var selected = document.getElementById('country-detail').getAttribute('data-selected');
        var root = document.getElementById('country-cities');
        root.replaceChildren();
        if (!selected || !countryCitySamples[selected]) return;
        var idx = {es:0,en:1,it:2}[currentLang()] || 0;
        function picture(id, width, className) {
          var img = document.createElement('img');
          img.src = 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + width + '&q=80';
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          if (className) img.className = className;
          return img;
        }
        countryCitySamples[selected].forEach(function(city) {
          var section = document.createElement('section'); section.className='city-section';
          var heading = document.createElement('div'); heading.className='city-heading';
          var open = document.createElement('button'); open.type='button'; open.className='city-open';
          var title = document.createElement('h3'); title.textContent=city[idx]; open.appendChild(title);
          var hint = document.createElement('span'); hint.textContent=strings[currentLang()].viewCity + ' ›'; open.appendChild(hint);
          open.addEventListener('click',function(){ openCity(city); });
          heading.appendChild(open); section.appendChild(heading);
          var row = document.createElement('div'); row.className='landmarks-row';
          city[4].forEach(function(place) {
            var card=document.createElement('article'); card.className='landmark-card';
            card.appendChild(picture(place[3],500,''));
            var name=document.createElement('h4'); name.textContent=place[idx]; card.appendChild(name);
            row.appendChild(card);
          });
          section.appendChild(row); root.appendChild(section);
        });
      }
      function openCity(city) {
        var idx={es:0,en:1,it:2}[currentLang()]||0;
        var photo=document.getElementById('city-detail-photo');
        photo.src='https://images.unsplash.com/'+city[3]+'?auto=format&fit=crop&w=1100&q=80';
        document.getElementById('city-detail-name').textContent=city[idx];
        var gallery=document.getElementById('city-gallery'); gallery.replaceChildren();
        city[4].forEach(function(place) {
          var item=document.createElement('article');
          item.setAttribute('role','button'); item.tabIndex=0;
          item.style.cursor='pointer';
          item.addEventListener('click',function(){openMonument(place,city);});
          item.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openMonument(place,city);}});
          var img=document.createElement('img');
          img.src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=650&q=80';
          img.alt=''; img.loading='lazy'; img.decoding='async'; item.appendChild(img);
          var title=document.createElement('h3'); title.textContent=place[idx]; item.appendChild(title);
          var note=document.createElement('p'); note.textContent=strings[currentLang()].sampleImage; item.appendChild(note);
          gallery.appendChild(item);
        });
        document.getElementById('country-detail').hidden=true;
        document.getElementById('city-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      }
      document.getElementById('city-back').addEventListener('click',function(){
        document.getElementById('city-detail').hidden=true;
        document.getElementById('country-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      });
      var selectedMonument=null, selectedMonumentCity=null;
      var monumentExamples={
        'Coliseo':[
          'El Coliseo, también conocido como anfiteatro Flavio, comenzó a construirse durante el gobierno de Vespasiano y fue inaugurado por Tito en el año 80 d. C. Su sistema de arcos, bóvedas y graderíos organizaba la circulación de miles de espectadores. Esta ficha es una demostración de diseño; la narración completa se incorporará con el catálogo definitivo.',
          'The Colosseum, also known as the Flavian Amphitheatre, was begun under Vespasian and inaugurated by Titus in AD 80. Its arches, vaults and tiers organized the movement of thousands of spectators. This is a design preview; the full narration will arrive with the final catalogue.',
          'Il Colosseo, noto anche come Anfiteatro Flavio, fu iniziato sotto Vespasiano e inaugurato da Tito nell’80 d.C. Archi, volte e gradinate organizzavano il movimento di migliaia di spettatori. Questa scheda è una dimostrazione del design; la narrazione completa arriverà con il catalogo definitivo.'
        ]
      };
      function monumentKey(place,city) { return city[0]+'|'+place[0]; }
      function storedMonumentSet(key) {
        try {var a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a:[];}catch(_){return [];}
      }
      function updateMonumentActions() {
        if(!selectedMonument)return;
        var key=monumentKey(selectedMonument,selectedMonumentCity);
        document.getElementById('monument-favorite').setAttribute('aria-pressed',String(storedMonumentSet('archispotter_preview_favorites').includes(key)));
        document.getElementById('monument-trip').setAttribute('aria-pressed',String(storedMonumentSet('archispotter_preview_trip').includes(key)));
      }
      function toggleMonument(key) {
        if(!selectedMonument)return;
        var id=monumentKey(selectedMonument,selectedMonumentCity);
        var items=storedMonumentSet(key);
        items=items.includes(id)?items.filter(function(x){return x!==id;}):items.concat(id);
        try{localStorage.setItem(key,JSON.stringify(items));}catch(_){}
        updateMonumentActions();
      }
      document.getElementById('monument-favorite').addEventListener('click',function(){toggleMonument('archispotter_preview_favorites');});
      document.getElementById('monument-trip').addEventListener('click',function(){toggleMonument('archispotter_preview_trip');});
      function openMonument(place,city) {
        selectedMonument=place; selectedMonumentCity=city;
        renderMonument();
        document.getElementById('city-detail').hidden=true;
        document.getElementById('monument-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      }
      function renderMonument() {
        if(!selectedMonument)return;
        var idx={es:0,en:1,it:2}[currentLang()]||0;
        var place=selectedMonument,city=selectedMonumentCity;
        document.getElementById('monument-photo').src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=1100&q=80';
        document.getElementById('monument-name').textContent=place[idx];
        document.getElementById('monument-photo').alt=place[idx];
        document.getElementById('monument-photo-trigger').setAttribute('aria-label',strings[currentLang()].zoomPhoto+' '+place[idx]);
        document.getElementById('monument-location').textContent=city[idx]+' · '+document.getElementById('country-detail-name').textContent;
        var colosseum=place[0]==='Coliseo';
        document.getElementById('monument-meta').textContent=colosseum?['Arquitectura romana · 70–80 d. C.','Roman architecture · AD 70–80','Architettura romana · 70–80 d.C.'][idx]:strings[currentLang()].metaPending;
        document.getElementById('monument-story-text').textContent=colosseum?monumentExamples.Coliseo[idx]:strings[currentLang()].storyPending;
        updateMonumentActions();
      }
      document.getElementById('monument-back').addEventListener('click',function(){
        document.getElementById('monument-detail').hidden=true;
        document.getElementById('city-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      });
      var countryNames = window.ArchiSpotterData.countryNames;
      function updateCountryNames() {
        var idx = {es:0,en:1,it:2}[currentLang()] || 0;
        document.querySelectorAll('[data-country-label]').forEach(function (el) {
          el.textContent = countryNames[el.getAttribute('data-country-label')][idx];
        });
        document.querySelectorAll('[data-country]').forEach(function (el) {
          el.setAttribute('aria-label', countryNames[el.getAttribute('data-country')][idx]);
        });
        var selected = document.getElementById('country-detail').getAttribute('data-selected');
        if (selected && countryNames[selected]) document.getElementById('country-detail-name').textContent = countryNames[selected][idx];
      }
      document.querySelectorAll('[data-country]').forEach(function (button) {
        button.addEventListener('click', function () {
          document.getElementById('country-detail').setAttribute('data-selected',button.getAttribute('data-country'));
          var coverPhoto = button.querySelector('img').src;
          if (button.getAttribute('data-country') === 'it') {
            coverPhoto = 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1100&q=80';
          }
          document.getElementById('country-detail-photo').src = coverPhoto;
          document.getElementById('country-overview').hidden = true;
          document.getElementById('country-detail').hidden = false;
          updateCountryNames();
          renderCountryCities();
          document.querySelector('.app-content').scrollTop = 0;
        });
      });
      document.getElementById('country-back').addEventListener('click', function () {
        document.getElementById('country-detail').hidden = true;
        document.getElementById('country-overview').hidden = false;
        document.querySelector('.app-content').scrollTop = 0;
      });
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
      switchBtn.addEventListener('click', function () { setMode(mode === 'login' ? 'register' : 'login'); });
      document.getElementById('forgot-btn').addEventListener('click', function () {
        showToast('Las cuentas se guardan solo en este dispositivo. La recuperación aún no está disponible.');
      });
      document.getElementById('logout-btn').addEventListener('click', function () {
        try { localStorage.removeItem(SESSION); } catch (_) {}
        setMode('login');
        showScreen(auth);
      });
      document.getElementById('auth-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        error.textContent = '';
        var username = document.getElementById('user').value.trim().toLowerCase();
        var password = pass.value;
        if (username.length < 3 || password.length < 6) {
          error.textContent = 'Usá al menos 3 caracteres para el usuario y 6 para la contraseña.';
          return;
        }
        submitBtn.disabled = true;
        try {
          var saved = accounts();
          if (mode === 'register') {
            if (username === DEFAULT_USER || Object.prototype.hasOwnProperty.call(saved, username)) {
              error.textContent = 'Ese usuario ya existe.';
              return;
            }
            if (!window.crypto || !crypto.getRandomValues) throw new Error('Crypto unavailable');
            var salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (n) { return n.toString(16).padStart(2, '0'); }).join('');
            saved[username] = { salt: salt, hash: await digest(password, salt) };
            localStorage.setItem(ACCOUNTS, JSON.stringify(saved));
          } else if (username === DEFAULT_USER) {
            if (password !== DEFAULT_PASSWORD) { error.textContent = 'Usuario o contraseña incorrectos.'; return; }
          } else {
            var account = saved[username];
            if (!account || await digest(password, account.salt) !== account.hash) {
              error.textContent = 'Usuario o contraseña incorrectos.';
              return;
            }
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
