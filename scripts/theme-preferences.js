// Tema cinematográfico único: se conservan los nombres públicos para compatibilidad.
function toggleTheme(){document.body.classList.remove('light-mode');archiStorageSet('archispotter_theme','dark');if(typeof archiUpdateMapTheme==='function')archiUpdateMapTheme();}
function applySavedPreferences(){document.body.classList.remove('light-mode');archiStorageSet('archispotter_theme','dark');if(typeof applyLanguage==='function')applyLanguage();}
