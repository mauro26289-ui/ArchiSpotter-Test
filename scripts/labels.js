/* V28 — Etiquetas de países, ciudades, monumentos, estilos y arquitectura. */
function countryLabel(value){return appLanguage==='it'?(italianCountries[value]||value):appLanguage==='en'?(englishCountries[value]||value):value;}
function cityLabel(value){return appLanguage==='it'?(italianCities[value]||value):appLanguage==='en'?(englishCities[value]||value):value;}
function monumentLabel(m){return appLanguage==='it'?(italianNames[m.id]||m.name):appLanguage==='en'?(englishNames[m.id]||m.name):m.name;}
function styleLabel(value){return appLanguage==='it'?(italianStyles[value]||value):appLanguage==='en'?(englishStyles[value]||value):value;}
function architectureLabel(m){return appLanguage==='it'?(italianMonumentContent[m.id]?.architecture||m.architecture||[]):appLanguage==='en'?(englishMonumentContent[m.id]?.architecture||m.architecture||[]):(m.architecture||[]);}
