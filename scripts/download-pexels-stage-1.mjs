import fs from 'node:fs';import crypto from 'node:crypto';
const rows=JSON.parse(fs.readFileSync('docs/audits/pexels-stage-1-group-1.json','utf8'));
const results=[];const dir='preview/assets/photos/pexels';fs.mkdirSync(dir,{recursive:true});
for(const row of rows){const url='https://images.pexels.com/photos/'+row.id+'/pexels-photo-'+row.id+'.jpeg?auto=compress&cs=tinysrgb&w=1400';
 try{const res=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Mozilla/5.0'}});const buf=Buffer.from(await res.arrayBuffer());const type=res.headers.get('content-type')||'';if(!res.ok||!type.startsWith('image/')||buf.length<25000)throw Error('HTTP '+res.status+' '+type+' bytes '+buf.length);const file=dir+'/'+row.id+'.jpg';fs.writeFileSync(file,buf);results.push({...row,url:'assets/photos/pexels/'+row.id+'.jpg',originalUrl:url,bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex'),status:'ok'});console.log('OK',row.monument,row.id,buf.length);}
 catch(e){results.push({...row,status:'failed',error:String(e)});console.error('FAIL',row.monument,row.id,String(e));}}
fs.writeFileSync('docs/audits/pexels-stage-1-group-1-results.json',JSON.stringify({total:rows.length,ok:results.filter(x=>x.status==='ok').length,results},null,2)+'\n');
if(results.some(x=>x.status!=='ok'))process.exitCode=1;
