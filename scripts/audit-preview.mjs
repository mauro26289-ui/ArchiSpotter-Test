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
// Storage regression: legacy keys, malformed data, order, and failed writes.
{
 const data=new Map();
 const localStorage={getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,value)};
 const ctx={window:{},localStorage};vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(path.join(preview,'assets/js/storage.js'),'utf8'),ctx);
 const storage=ctx.window.ArchiSpotterStorage;
 assert(storage.keys.favorites==='archispotter_preview_favorites','Favorites storage key changed');
 assert(storage.keys.trip==='archispotter_preview_trip','Trip storage key changed');
 assert(storage.write(storage.keys.trip,['A|B','C|D']),'Trip write failed');
 assert(JSON.stringify(Array.from(storage.read(storage.keys.trip)))===JSON.stringify(['A|B','C|D']),'Trip order or data changed');
 data.set(storage.keys.favorites,'{invalid');
 assert(storage.read(storage.keys.favorites).length===0,'Malformed favorites must be safe');
 data.set(storage.keys.favorites,JSON.stringify(['valid',5,null,'second']));
 assert(JSON.stringify(Array.from(storage.read(storage.keys.favorites)))===JSON.stringify(['valid','second']),'Invalid favorites were not filtered');
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
// Static two-photo coverage and metadata integrity; visual review remains a separate acceptance check.
// Commons image pair metadata and integrity checks.
const pairsContext={window:{}};vm.createContext(pairsContext);
vm.runInContext(fs.readFileSync(path.join(preview,'assets/data/photo-pairs.js'),'utf8'),pairsContext);
const pairs=pairsContext.window.ArchiSpotterPhotoPairs;
for(const [name,photos] of Object.entries(pairs)){
 assert(names.includes(name),`Photo pair not in catalog: ${name}`);
 assert(Array.isArray(photos)&&photos.length===2,`Photo pair must contain two photos: ${name}`);
 if(!Array.isArray(photos)||photos.length!==2)continue;
 assert(photos[0].url!==photos[1].url&&(photos[0].sha1||photos[0].pexelsId||photos[0].unsplashId)!==(photos[1].sha1||photos[1].pexelsId||photos[1].unsplashId),`Duplicate photo pair: ${name}`);
 for(const photo of photos){
  assert(photo.url?.startsWith('https://'),`Invalid photo URL: ${name}`);
  if(photo.pexelsId){assert(photo.url===`./assets/photos/pexels/${photo.pexelsId}.jpg`,`Pexels image path mismatch: ${name}`);assert(fs.existsSync(path.join(preview,photo.url)),`Missing local Pexels photo: ${name}`);assert(photo.bytes>=25000&&Boolean(photo.sha256),`Missing Pexels file verification: ${name}`);}else assert(photo.width>=1400&&photo.height>=800,`Insufficient photo resolution: ${name}`);
  assert(Boolean(photo.source&&photo.artist&&photo.license),`Missing image attribution: ${name}`);
 }
}
assert(Object.keys(pairs).length===names.length,`Expected two image records for all ${names.length} monuments`);
for(const name of names)assert(Boolean(pairs[name]),`Missing two-photo record: ${name}`);
const seenPhotoHashes=new Map();
for(const [name,photos] of Object.entries(pairs)){
 for(const photo of photos){
  const photoKey=photo.sha1||photo.pexelsId||photo.unsplashId;
  if(seenPhotoHashes.has(photoKey))errors.push(`Image reused by ${name} and ${seenPhotoHashes.get(photoKey)}: ${photo.file}`);
  seenPhotoHashes.set(photoKey,name);
 }
}
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

// Pexels local-image regression check is part of the preview audit.
