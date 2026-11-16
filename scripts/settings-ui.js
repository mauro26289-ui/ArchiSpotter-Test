// Código original extraído de app.js (etapa 68).
        const archiSettingsWords={
          es:['Ajustes','Personalizá tu experiencia','Idioma','Apariencia','Claro','Oscuro','Mi pasaporte','Acerca de ArchiSpotter','Cerrar sesión'],
          en:['Settings','Customize your experience','Language','Appearance','Light','Dark','My passport','About ArchiSpotter','Sign out'],
          it:['Impostazioni','Personalizza la tua esperienza','Lingua','Aspetto','Chiaro','Scuro','Il mio passaporto','Informazioni su ArchiSpotter','Esci']
        };
        function archiSyncSettings(){
          const lang=(typeof appLanguage!=='undefined'&&archiSettingsWords[appLanguage])?appLanguage:'es';
          const ids=['archi-settings-heading','archi-settings-subheading','archi-settings-lang-label','archi-settings-theme-label','archi-light-label','archi-dark-label','archi-settings-passport-label','archi-settings-about-label','archi-settings-logout-label'];
          ids.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=archiSettingsWords[lang][i]});
          const devLabel=document.getElementById('archi-settings-dev-label');if(devLabel)devLabel.textContent=({es:'Modo desarrollador',en:'Developer mode',it:'Modalità sviluppatore'})[lang];
          const select=document.getElementById('archi-settings-language');if(select)select.value=lang;
          const light=document.body.classList.contains('light-mode');
          document.getElementById('archi-settings-light')?.setAttribute('aria-pressed',String(light));
          document.getElementById('archi-settings-dark')?.setAttribute('aria-pressed',String(!light));
        }
        function archiOpenSettings(){archiSyncSettings();const el=document.getElementById('archi-settings-overlay');if(el){el.hidden=false;el.querySelector('.archi-settings-close')?.focus();}}
        function archiCloseSettings(){const el=document.getElementById('archi-settings-overlay');if(el)el.hidden=true;}
        function archiSetTheme(theme){if(document.body.classList.contains('light-mode')!==(theme==='light'))toggleTheme();archiSyncSettings();}
        const archiAboutTranslations={
          es:{title:'Acerca de ArchiSpotter',message:'Esta app nació caminando por alguna calle del mundo, mirando edificios históricos y ruinas sin un cartel que explicara su historia. Porque sé que a vos, como a mí, la curiosidad no te deja quedarte con la duda de qué es eso que tienes ahí delante. ¡Bienvenidos a ArchiSpotter!',close:'Cerrar'},
          en:{title:'About ArchiSpotter',message:'This app was born while walking down a street somewhere in the world, looking at historic buildings and ruins without a sign explaining their history. Because I know that you, like me, are too curious to walk away without finding out what is right in front of you. Welcome to ArchiSpotter!',close:'Close'},
          it:{title:'Informazioni su ArchiSpotter',message:'Questa app è nata camminando per una strada in qualche parte del mondo, osservando edifici storici e rovine senza un cartello che ne spiegasse la storia. Perché so che tu, come me, sei troppo curioso per andare oltre senza scoprire che cosa hai davanti agli occhi. Benvenuti su ArchiSpotter!',close:'Chiudi'}
        };
        function archiSyncAboutLanguage(){
          const lang=(typeof appLanguage!=='undefined'&&archiAboutTranslations[appLanguage])?appLanguage:'es';
          const t=archiAboutTranslations[lang];
          const title=document.getElementById('archi-about-title');if(title)title.textContent=t.title;
          const message=document.getElementById('archi-about-message');if(message)message.textContent=t.message;
          const close=document.querySelector('#archi-about-overlay .archi-about-close');if(close)close.setAttribute('aria-label',t.close);
        }
        function archiShowAppInfo(){
          const overlay=document.getElementById('archi-about-overlay');
          if(overlay){archiSyncAboutLanguage();overlay.hidden=false;overlay.querySelector('.archi-about-close')?.focus();}
        }
        function archiCloseAppInfo(){const overlay=document.getElementById('archi-about-overlay');if(overlay)overlay.hidden=true;}

        document.addEventListener('keydown',e=>{if(e.key==='Escape')archiCloseSettings()});

