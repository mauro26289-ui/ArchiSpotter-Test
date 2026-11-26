(function(){
'use strict';
var selectedCountry='',selectedCity='';
var words={es:['Elige un país','Elige una ciudad','Volver a países','Volver a ciudades','Sabores de','Comer al paso','Pequeños placeres para disfrutar mientras recorres la ciudad.','A la mesa','Platos tradicionales para disfrutar sin prisa.','Contenido en preparación','Fotografías y descripciones en la próxima etapa.'],en:['Choose a country','Choose a city','Back to countries','Back to cities','Flavours of','On the go','Small bites to enjoy as you explore the city.','At the table','Traditional dishes to enjoy at your leisure.','Content coming soon','Photos and descriptions in the next stage.'],it:['Scegli un paese','Scegli una città','Torna ai paesi','Torna alle città','Sapori di','Da mangiare al volo','Piccole delizie da gustare mentre esplori la città.','A tavola','Piatti tradizionali da gustare con calma.','Contenuti in preparazione','Foto e descrizioni nella prossima fase.']};
var groups=[['Supplì','Maritozzo','Pizza al taglio','Trapizzino','Panino con porchetta'],['Carbonara','Cacio e pepe','Amatriciana','Saltimbocca alla romana','Carciofi alla giudia']];
function render(host,lang,reveal){
 var catalog=window.ArchiSpotterData,data=catalog.countryCitySamples,names=catalog.countryNames,w=words[lang]||words.es,i={es:0,en:1,it:2}[lang]||0;
 var root=document.createElement('section');root.className='food-guide';host.replaceChildren(root);
 function add(tag,value,parent,cls){var el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;(parent||root).append(el);return el;}
 function refresh(){render(host,lang,reveal);reveal(host);}
 function button(label,fn,parent){var b=add('button',label,parent,'food-choice');b.type='button';b.onclick=fn;return b;}
 function countryName(code){return (names[code]||[code,code,code])[i]||code;}
 if(!selectedCountry){add('h4',w[0]);var list=add('div','',root,'food-choices');Object.keys(data).filter(function(c){return data[c].length;}).forEach(function(c){button(countryName(c)+' ›',function(){selectedCountry=c;selectedCity='';refresh();},list);});return;}
 button('‹ '+w[2],function(){selectedCountry='';selectedCity='';refresh();});
 if(!selectedCity){add('h4',countryName(selectedCountry)+' · '+w[1]);var grid=add('div','',root,'food-choices');(data[selectedCountry]||[]).forEach(function(c){button(c[i]+' ›',function(){selectedCity=c[0];refresh();},grid);});return;}
 button('‹ '+w[3],function(){selectedCity='';refresh();});
 var city=(data[selectedCountry]||[]).find(function(c){return c[0]===selectedCity;});
 if(!city){selectedCity='';refresh();return;}
 add('h4',w[4]+' '+city[i]);
 if(selectedCity!=='Roma'){add('p',w[9]);return;}
 groups.forEach(function(dishes,j){var section=add('section','',root,'food-category');add('h5',w[5+j*2],section);add('p',w[6+j*2],section);var grid=add('div','',section,'food-dishes');dishes.forEach(function(d){var card=add('article','',grid,'food-dish');var placeholder=add('div','',card,'food-photo-slot');placeholder.setAttribute('aria-hidden','true');add('strong',d,card);});});add('p',w[10],root,'food-note');
}
window.ArchiSpotterFood={render:render};
})();