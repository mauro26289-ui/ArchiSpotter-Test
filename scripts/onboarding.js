
(function(){
 const texts={
  es:{title:'¿Y esto qué es?',description:'Estás de vacaciones, vas caminando por la calle y ves un edificio o monumento que te gusta y quieres saber qué es. Abrí ArchiSpotter y descubre su historia, arquitectura, fotografías, audioguías y rutas. Elegí un país y empezá a explorar.',start:'Iniciar sesión',register:'Crear usuario',logout:'Cerrar sesión',user:'Usuario',password:'Contraseña',help:'Cuenta local en este navegador',disclaimer:'Solo para pruebas: la cuenta se guarda en este dispositivo y no ofrece seguridad de servidor.',invalid:'Usuario o contraseña incorrectos.',exists:'Ese usuario ya existe.',short:'Usá al menos 3 caracteres para el usuario y 6 para la contraseña.',error:'No se pudo guardar la cuenta en este navegador.',login:'Iniciar sesión'},
  en:{title:'What is this?',description:'You are on vacation, walking down the street, and notice a building or monument you want to know more about. Open ArchiSpotter to discover its history, architecture, photographs, audio guides and routes. Choose a country and start exploring.',start:'Sign in',register:'Create account',logout:'Sign out',user:'Username',password:'Password',help:'Local account in this browser',disclaimer:'For testing only: this account is stored on this device and is not server-secured.',invalid:'Incorrect username or password.',exists:'That username already exists.',short:'Use at least 3 characters for username and 6 for password.',error:'Could not save the account in this browser.',login:'Sign in'},
  it:{title:'Che cos’è?',description:'Sei in vacanza, passeggi per strada e noti un edificio o un monumento che ti incuriosisce. Apri ArchiSpotter per scoprirne la storia, l’architettura, le fotografie, le audioguide e i percorsi. Scegli un paese e inizia a esplorare.',start:'Accedi',register:'Crea account',logout:'Esci',user:'Nome utente',password:'Password',help:'Account locale in questo browser',disclaimer:'Solo per prove: l’account è salvato su questo dispositivo e non è protetto da un server.',invalid:'Nome utente o password errati.',exists:'Questo nome utente esiste già.',short:'Usa almeno 3 caratteri per il nome utente e 6 per la password.',error:'Impossibile salvare l’account in questo browser.',login:'Accedi'}
 };
 window.updateArchiOnboarding=function(){
  const language=(typeof appLanguage!=='undefined'?appLanguage:archiStorageGet('archispotter_language'))||'es';
  const t=texts[language]||texts.es;
  document.getElementById('archi-onboarding-title').textContent=t.title;
  document.getElementById('archi-onboarding-description').textContent=t.description;
  document.getElementById('archi-onboarding-start').textContent=t.start;
  document.getElementById('archi-register-btn').textContent=t.register;
  document.getElementById('archi-logout-label').textContent=t.logout;
  document.getElementById('archi-logout').setAttribute('aria-label',t.logout);
  document.getElementById('archi-logout').title=t.logout;
  if(typeof window.archiRefreshAuth==='function')window.archiRefreshAuth();
  document.querySelectorAll('.archi-lang-btn').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.archiLang===language)));
 };
 window.enterArchiSpotter=function(){
  if(!window.archiHasSession || !window.archiHasSession()){window.archiShowAuth('login');return;}
  document.getElementById('archi-onboarding').classList.add('archi-gone');
  document.body.classList.remove('archi-intro-active');
  if(typeof switchTab==='function')switchTab('explore');
  if(typeof applyLanguage==='function')applyLanguage();
 };
 document.addEventListener('DOMContentLoaded',()=>{
  const source=document.querySelector('#splash-screen img[alt="ArchiSpotter"]');
  const logo=document.getElementById('archi-onboarding-logo');
  if(source && logo) logo.src=source.src;
  window.updateArchiOnboarding();
  if(window.archiHasSession && window.archiHasSession())window.enterArchiSpotter();
 });
})();
