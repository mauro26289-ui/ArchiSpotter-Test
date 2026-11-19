
(function(){
 const ACCOUNTS='archispotter_local_accounts_v1', SESSION='archispotter_local_session_v1';
 // Demo-only account: credentials are visible in this standalone HTML.
 const DEFAULT_USER='user', DEFAULT_PASSWORD='user123';
 let mode='login';
 const $=id=>document.getElementById(id);
 const language=()=>['es','en','it'].includes(typeof appLanguage!=='undefined'?appLanguage:'')?appLanguage:(archiStorageGet('archispotter_language')||'es');
 const words={
 es:{login:'Iniciar sesión',register:'Crear usuario',user:'Usuario',password:'Contraseña',help:'Cuenta local en este navegador',disclaimer:'Solo para pruebas: la cuenta se guarda en este dispositivo y no ofrece seguridad de servidor.',invalid:'Usuario o contraseña incorrectos.',exists:'Ese usuario ya existe.',short:'Usá al menos 3 caracteres para el usuario y 6 para la contraseña.',error:'No se pudo guardar la cuenta en este navegador.',forgot:'Olvidé mi contraseña'},
 en:{login:'Sign in',register:'Create account',user:'Username',password:'Password',help:'Local account in this browser',disclaimer:'For testing only: this account is stored on this device and is not server-secured.',invalid:'Incorrect username or password.',exists:'That username already exists.',short:'Use at least 3 characters for username and 6 for password.',error:'Could not save the account in this browser.',forgot:'Forgot password?'},
 it:{login:'Accedi',register:'Crea account',user:'Nome utente',password:'Password',help:'Account locale in questo browser',disclaimer:'Solo per prove: l’account è salvato su questo dispositivo e non è protetto da un server.',invalid:'Nome utente o password errati.',exists:'Questo nome utente esiste già.',short:'Usa almeno 3 caratteri per il nome utente e 6 per la password.',error:'Impossibile salvare l’account in questo browser.',forgot:'Password dimenticata?'}
 };
 const t=()=>words[language()]||words.es;
 function accounts(){try{let a=JSON.parse(localStorage.getItem(ACCOUNTS)||'{}');return a&&typeof a==='object'&&!Array.isArray(a)?a:{}}catch(e){return {}}}
 window.archiHasSession=function(){try{let user=localStorage.getItem(SESSION);return !!(user&&(user===DEFAULT_USER||Object.prototype.hasOwnProperty.call(accounts(),user)))}catch(e){return false}};
 window.archiRefreshAuth=function(){
  if(!$('archi-auth-panel'))return;
  const x=t();
  $('archi-auth-heading').textContent=x[mode];$('archi-auth-help').textContent=x.help;
  $('archi-auth-user-label').textContent=x.user;$('archi-auth-password-label').textContent=x.password;
  $('archi-auth-submit').textContent=x[mode];$('archi-auth-switch').textContent=x[mode==='login'?'register':'login'];
  $('archi-auth-disclaimer').textContent=x.disclaimer;
  $('archi-auth-forgot').textContent=x.forgot;
  $('archi-auth-forgot').hidden=(mode!=='login');
  $('archi-auth-password').autocomplete=mode==='login'?'current-password':'new-password';
 };
 window.archiShowAuth=function(which){mode=which==='register'?'register':'login';$('archi-auth-panel').classList.remove('archi-auth-hidden');$('archi-auth-form').reset();$('archi-auth-error').textContent='';window.archiRefreshAuth();$('archi-auth-user').focus()};
 window.archiCloseAuth=function(){$('archi-auth-panel').classList.add('archi-auth-hidden')};
 window.archiToggleAuth=function(){window.archiShowAuth(mode==='login'?'register':'login')};
 window.archiLogout=function(){
  try{localStorage.removeItem(SESSION)}catch(e){}
  if(typeof stopAudioGuide==='function')stopAudioGuide();
  $('archi-onboarding').classList.remove('archi-gone');document.body.classList.add('archi-intro-active');
  window.archiCloseAuth();if(typeof window.updateArchiOnboarding==='function')window.updateArchiOnboarding();
  window.scrollTo(0,0);
 };
 async function digest(password,salt){
  if(!window.crypto||!window.crypto.subtle)throw Error('WebCrypto unavailable');
  const bytes=new TextEncoder().encode(salt+':'+password);
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');
 }
 document.addEventListener('DOMContentLoaded',()=>{
  $('archi-auth-form').addEventListener('submit',async event=>{
   event.preventDefault();
   const username=$('archi-auth-user').value.trim().toLowerCase();
   const password=$('archi-auth-password').value;
   const error=$('archi-auth-error');error.textContent='';
   if(username.length<3||password.length<6){error.textContent=t().short;return}
   const button=$('archi-auth-submit');button.disabled=true;
   try{
    const a=accounts();
    if(mode==='register'){
     if(username===DEFAULT_USER||a[username]){error.textContent=t().exists;return}
     const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');
     a[username]={salt,hash:await digest(password,salt)};
     localStorage.setItem(ACCOUNTS,JSON.stringify(a));
    }else{
     if(username===DEFAULT_USER){
      if(password!==DEFAULT_PASSWORD){error.textContent=t().invalid;return}
     }else{
      const entry=a[username];
      if(!entry || (await digest(password,entry.salt))!==entry.hash){error.textContent=t().invalid;return}
     }
    }
    localStorage.setItem(SESSION,username);
    window.archiCloseAuth();window.enterArchiSpotter();
   }catch(e){error.textContent=t().error}
   finally{button.disabled=false}
  });
  if(window.archiHasSession())window.enterArchiSpotter();
 });
})();
