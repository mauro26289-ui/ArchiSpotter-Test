import fs from 'node:fs';
const src=fs.readFileSync('docs/audits/unsplash-stage-1-candidates.js','utf8');
const pairs=JSON.parse(src.slice(src.indexOf('{'),src.lastIndexOf(';')));
const results=[];
for(const [name,photos] of Object.entries(pairs)){
 for(const photo of photos){
  const id=photo.unsplashId;
  try{
   const response=await fetch('https://unsplash.com/photos/'+id,{headers:{'User-Agent':'Mozilla/5.0 (compatible; ArchiSpotterQA/1.0)','Accept':'text/html'},signal:AbortSignal.timeout(18000)});
   const html=await response.text();
   const meta=(key)=>{const a=html.match(new RegExp('<meta[^>]+(?:property|name)=["\\\']'+key+'["\\\'][^>]+content=["\\\']([^"\\\']+)','i'));const b=html.match(new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]+(?:property|name)=["\\\']'+key+'["\\\']','i'));return (a||b)?.[1]?.replaceAll('&amp;','&')||null;};
   const title=meta('og:title')||html.match(/<title>([^<]+)/)?.[1]||'';
   const image=meta('og:image');
   let imageStatus=null,imageType=null,imageSize=null;
   if(image){let res=await fetch(image,{method:'GET',headers:{Range:'bytes=0-4095'},signal:AbortSignal.timeout(20000)});imageStatus=res.status;imageType=res.headers.get('content-type');imageSize=res.headers.get('content-length');await res.body?.cancel();}
   results.push({name,id,artist:photo.artist,description:photo.description,pageStatus:response.status,title,image,imageStatus,imageType,imageSize,source:photo.source});
  }catch(e){results.push({name,id,error:String(e)});}
 }
}
fs.mkdirSync('docs/audits',{recursive:true});fs.writeFileSync('docs/audits/unsplash-stage-1-http.json',JSON.stringify({generatedAt:new Date().toISOString(),total:results.length,valid:results.filter(x=>x.pageStatus===200&&x.imageStatus>=200&&x.imageStatus<300&&x.imageType?.startsWith('image/')).length,results},null,2)+'\n');
console.log(JSON.stringify({total:results.length,valid:results.filter(x=>x.imageStatus>=200&&x.imageStatus<300).length,failures:results.filter(x=>!(x.imageStatus>=200&&x.imageStatus<300)).map(x=>({name:x.name,id:x.id,error:x.error,page:x.pageStatus,image:x.imageStatus}))},null,2));

// CI audit: page metadata and CDN image response are recorded separately.
