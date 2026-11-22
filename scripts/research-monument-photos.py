#!/usr/bin/env python3
"""Build a traceable two-photo candidate inventory from Wikimedia Commons.
Does not certify that the depicted building is correct: human visual review is required.
"""
import json, re, time, urllib.parse, urllib.request, html, pathlib, random
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE=ROOT/'preview/assets/data/cities.js'
PHOTOS=ROOT/'preview/assets/js/photos.js'
OUT=ROOT/'docs/audits/photo-candidates.json'
raw=SOURCE.read_text()
catalog=json.loads(raw.split('countryCitySamples = ',1)[1].strip().rstrip(';'))
names=[m[0] for cities in catalog.values() for city in cities for m in city[4]]
src=PHOTOS.read_text()
titles=json.loads(re.search(r'var titles=(\{.*?\});',src,re.S).group(1))
curated=re.findall(r"(?m)^\s*['\"]([^'\"]+)['\"]\s*:\s*\[\s*['\"]https?://",src)
search_override={
"Castillo de Sant'Angelo":"Castel Sant'Angelo Rome",
"Catedral de Milán":"Milan Cathedral Duomo",
"Palacio Real":"Royal Palace Madrid",
"Puerta de Alcalá":"Puerta de Alcalá Madrid",
"Alhambra":"Alhambra Granada",
"Torre Eiffel":"Eiffel Tower Paris",
"Arco del Triunfo":"Arc de Triomphe Paris",
"Palacio de Versalles":"Palace of Versailles",
"Templo de Apolo":"Temple of Apollo Delphi",
"Palacio de Westminster":"Palace of Westminster London",
"Termas romanas":"Roman Baths Bath England",
"Obelisco":"Obelisco Buenos Aires",
"Teatro Colón":"Teatro Colón Buenos Aires",
"Puente Don Luis I":"Dom Luís I Bridge Porto",
}
def api(params):
    params.update({'action':'query','format':'json','formatversion':2})
    url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    req=urllib.request.Request(url,headers={'User-Agent':'ArchiSpotter-PhotoAudit/1.0 (research; GitHub Actions)','Accept':'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req,timeout=35) as f:return json.load(f)
        except Exception:
            if attempt==3:raise
            time.sleep(15*(attempt+1))
def plain(x):return re.sub('<[^>]+>',' ',html.unescape(x or '')).strip()
def acceptable(info):
    meta=info.get('extmetadata',{})
    license_name=plain(meta.get('LicenseShortName',{}).get('value',''))
    license_url=meta.get('LicenseUrl',{}).get('value','')
    # Commons CC licenses or public domain, never NC/ND/unknown.
    allowed=bool(re.search(r'\b(CC0|CC BY|CC-BY|Public domain|PD-|PDM)\b',license_name,re.I))
    forbidden=bool(re.search(r'NC|ND|non.?commercial|no.?derivatives',license_name,re.I))
    return allowed and not forbidden and bool(license_url or re.search('public domain|PD-|CC0',license_name,re.I))
def score(item,terms):
    name=item['file'].lower().replace('_',' ')
    tokens=[t for t in re.findall(r'[\w]+',terms.lower()) if len(t)>3]
    return sum(3 for t in tokens if t in name)+min(item['width'],4500)/4500
result=json.loads(OUT.read_text()) if OUT.exists() else {'generated_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'method':'Commons API search; license, resolution and filename relevance; NOT visual certification','monuments':{}}
for i,name in enumerate(names):
    if result['monuments'].get(name,{}).get('status') not in (None,'search_error','needs_more_candidates'):continue
    query=search_override.get(name,titles.get(name,name))
    existing=name in curated
    candidates=[]
    try:
        found=api({'list':'search','srnamespace':6,'srsearch':query+' filetype:bitmap','srlimit':35}).get('query',{}).get('search',[])
        files=[x['title'] for x in found if x['title'].lower().endswith(('.jpg','.jpeg','.png','.webp'))]
        if not files:
            found=api({'list':'search','srnamespace':6,'srsearch':query,'srlimit':35}).get('query',{}).get('search',[])
            files=[x['title'] for x in found if x['title'].lower().endswith(('.jpg','.jpeg','.png','.webp'))]
        if files:
            pages=api({'prop':'imageinfo','iiprop':'url|size|sha1|extmetadata','iiurlwidth':1400,'titles':'|'.join(files[:35])}).get('query',{}).get('pages',[])
            for page in pages:
                inf=(page.get('imageinfo') or [None])[0]
                if not inf or not acceptable(inf):continue
                if inf.get('width',0)<1400 or inf.get('height',0)<800:continue
                if not (inf.get('thumburl') or inf.get('url')):continue
                meta=inf.get('extmetadata',{})
                item={'file':page['title'],'url':inf.get('thumburl') or inf['url'],'original':inf.get('url'),'description_url':inf.get('descriptionurl'),'width':inf['width'],'height':inf['height'],'sha1':inf.get('sha1'),'license':plain(meta.get('LicenseShortName',{}).get('value','')),'license_url':meta.get('LicenseUrl',{}).get('value',''),'artist':plain(meta.get('Artist',{}).get('value',''))[:240]}
                item['score']=score(item,query)
                candidates.append(item)
        candidates.sort(key=lambda x:x['score'],reverse=True)
        seen=set();unique=[]
        for c in candidates:
            if c['sha1'] in seen:continue
            seen.add(c['sha1']);unique.append(c)
        result['monuments'][name]={'query':query,'already_curated':existing,'candidates':unique[:6],'candidate_pair':unique[:2],'status':'candidate_only_not_visually_verified' if len(unique)>=2 else 'needs_more_candidates'}
    except Exception as exc:
        result['monuments'][name]={'query':query,'already_curated':existing,'candidates':[],'candidate_pair':[],'status':'search_error','error':str(exc)[:240]}
    print(f"[{i+1}/{len(names)}] {name}: {len(result['monuments'][name]['candidate_pair'])} candidates ({result['monuments'][name]['status']})",flush=True)
    time.sleep(4)
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Saved',OUT)
