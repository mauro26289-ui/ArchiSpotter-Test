/* ArchiSpotter preview static regression checks. Run: node scripts/audit-preview.mjs */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=process.cwd();
const preview=path.join(root,'preview');
const html=fs.readFileSync(path.join(preview,'index.html'),'utf8');
const errors=[],warnings=[];
const assert=(condition,message)=>(condition?undefined:errors.push(message));
const refs=[...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)(?:\?[^"]*)?"/g)].map(x=>x[1]);
for(const ref of refs)assert(fs.existsSync(path.join(preview,ref)),`Missing preview reference: ${ref}`);
assert(refs.length===new Set(refs).size,'Duplicate local src/href references');
const scripts=[...html.matchAll(/<script[^>]*src="(\.\/[^"]+)"[^>]*>/g)].map(x=>x[1].split('?')[0]);
for(const file of scripts){
 const full=path.join(preview,file);
 if(!fs.existsSync(full))continue;
 try{new vm.Script(fs.readFileSync(full,'utf8'),{filename:file});}catch(e){errors.push(`JavaScript syntax: ${file}: ${e.message}`);}
}
const sandbox={window:{ArchiSpotterData:{},ArchiSpotterEditorial:{},ArchiSpotterCityGuides:{},ArchiSpotterCityFood:{}}};
vm.createContext(sandbox);
const load=(file)=>vm.runInContext(fs.readFileSync(path.join(preview,file),'utf8'),sandbox,{filename:file,timeout:3000});
for(const file of ['assets/data/countries.js','assets/data/cities.js','assets/data/editorial.js','assets/data/restored-monuments.js','assets/data/city-guides.js','assets/data/city-food.js','assets/data/veytaux-guide.js'])load(file);
const data=sandbox.window.ArchiSpotterData.countryCitySamples;
const editorial=sandbox.window.ArchiSpotterEditorial;
const names=Object.values(data).flatMap(cities=>cities.flatMap(city=>city[4].map(monument=>monument[0])));
assert(names.length===new Set(names).size,'Duplicate monument keys');
for(const name of names){
 const item=editorial[name];
 assert(Boolean(item),`Missing editorial entry: ${name}`);
 if(!item)continue;
 for(const lang of ['es','en','it']){
  assert(typeof item.history?.[lang]==='string'&&item.history[lang].trim().length>0,`Missing history ${name} ${lang}`);
  assert(typeof item.curiosity?.[lang]==='string'&&item.curiosity[lang].trim().length>0,`Missing curiosity ${name} ${lang}`);
  assert(Array.isArray(item.architecture?.[lang])&&item.architecture[lang].length===3,`Architecture must have 3 details: ${name} ${lang}`);
 }
}
for(const name of Object.keys(editorial))assert(names.includes(name),`Orphan editorial entry: ${name}`);
const audio=fs.readFileSync(path.join(preview,'assets/js/monuments.js'),'utf8');
const ids=Object.fromEntries([...audio.matchAll(/^\s*['"]([^'"]+)['"]\s*:\s*'([a-z0-9-]+)'\s*,?$/gm)].map(m=>[m[1],m[2]]));
const localIds=['trevi-fountain','castel-sant-angelo','ponte-vecchio','palazzo-vecchio','casa-batllo'];
for(const id of localIds)for(const lang of ['es','en','it']){
 const f=path.join(preview,'audio',`${id}-${lang}.mp3`);
 if(!fs.existsSync(f))warnings.push(`Missing local MP3: ${id}-${lang}.mp3`);
}
assert(names.length>=51,`Unexpected monument count: ${names.length}`);
console.log(`Preview QA: ${names.length} monuments, ${Object.keys(editorial).length} editorial entries, ${scripts.length} local scripts`);
for(const message of warnings)console.warn('WARNING:',message);
for(const message of errors)console.error('ERROR:',message);
if(errors.length)process.exitCode=1;
else console.log(`PASS: ${warnings.length} nonblocking media warning(s)`);
