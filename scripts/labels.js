/* V28 — Etiquetas de países, ciudades, monumentos, estilos y arquitectura. */
// Normalización solo para buscar claves: no modifica cómo se muestra el nombre.
function archiLabelKey(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');
}
function archiLookupLabel(dictionary, value) {
  if (value == null) return value;
  if (Object.prototype.hasOwnProperty.call(dictionary, value)) return dictionary[value];
  const target = archiLabelKey(value);
  const key = Object.keys(dictionary).find(k => archiLabelKey(k) === target);
  return key === undefined ? value : dictionary[key];
}
function countryLabel(value){return appLanguage==='it'?archiLookupLabel(italianCountries,value):appLanguage==='en'?archiLookupLabel(englishCountries,value):value;}
function cityLabel(value){return appLanguage==='it'?archiLookupLabel(italianCities,value):appLanguage==='en'?archiLookupLabel(englishCities,value):value;}
function monumentLabel(m){return appLanguage==='it'?(italianNames[m.id]||m.name):appLanguage==='en'?(englishNames[m.id]||m.name):m.name;}
function styleLabel(value){return appLanguage==='it'?archiLookupLabel(italianStyles,value):appLanguage==='en'?archiLookupLabel(englishStyles,value):value;}
function architectureLabel(m){return appLanguage==='it'?(italianMonumentContent[m.id]?.architecture||m.architecture||[]):appLanguage==='en'?(englishMonumentContent[m.id]?.architecture||m.architecture||[]):(m.architecture||[]);}
