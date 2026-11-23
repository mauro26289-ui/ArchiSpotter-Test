/* Network health check for 102 photo URLs, including stage 1 Unsplash Free. Does not validate visual subject. */
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync('preview/assets/data/photo-pairs.js','utf8'),context);
const items=Object.entries(context.window.ArchiSpotterPhotoPairs).flatMap(([name,photos])=>photos.map((p,i)=>({name,index:i+1,...p})));
const results=[];
let cursor=0;
async function check(item){
 if(item.pexelsId){const f='preview/'+item.url.replace(/^\.\//,'');const ok=fs.existsSync(f)&&fs.statSync(f).size===item.bytes;return {monument:item.name,index:item.index,file:item.file,url:item.url,status:ok?200:404,contentType:ok?'image/jpeg':'',contentLength:ok?String(item.bytes):'0',ok};}
 let last={status:0,error:'unknown'};
 for(let attempt=0;attempt<3;attempt++){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),18000);
  try{
   const res=await fetch(item.url,{method:'HEAD',signal:controller.signal,headers:{'User-Agent':'ArchiSpotter-photo-audit/1.0'}});
   const type=res.headers.get('content-type')||'';
   last={status:res.status,contentType:type,contentLength:res.headers.get('content-length')};
   if(res.ok&&type.startsWith('image/'))break;
  }catch(e){last={status:0,error:String(e.message||e)};}
  finally{clearTimeout(timeout);}
  if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1000+attempt*2500));
 }
 return {monument:item.name,index:item.index,file:item.file,url:item.url,...last,ok:last.status>=200&&last.status<300&&last.contentType?.startsWith('image/')};
}
async function worker(){
 while(cursor<items.length){
  const i=cursor++;
  results[i]=await check(items[i]);
  console.log('['+(i+1)+'/'+items.length+'] '+(results[i].ok?'OK':'FAIL')+' '+items[i].name+' #'+items[i].index+' '+results[i].status);
  await new Promise(resolve=>setTimeout(resolve,200));
 }
}
await Promise.all(Array.from({length:3},()=>worker()));
const report={checkedAt:new Date().toISOString(),total:results.length,ok:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length,results};
fs.mkdirSync('docs/audits',{recursive:true});
fs.writeFileSync('docs/audits/photo-http-check.json',JSON.stringify(report,null,2)+'\n');
console.log('HTTP checked '+report.ok+'/'+report.total+'; failures='+report.failed);
