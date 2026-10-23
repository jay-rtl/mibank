import fs from 'node:fs/promises';
const c=JSON.parse(await fs.readFile('source/crawl.json','utf8'));let variants=[];try{variants=JSON.parse(await fs.readFile('source/variants.json','utf8'))}catch{}
for(const p of c.pages.filter(p=>p.status===200&&p.file)){const html=await fs.readFile('source/pages/'+p.file,'utf8');for(const match of html.matchAll(/['"]([^'"\s<>]+\.(?:jpe?g|gif|png))['"]/gi)){let url;try{url=new URL(match[1],p.url).href}catch{continue}if(new URL(url).hostname!=='www.mibank.com.pg')continue;if(!c.assets.some(a=>a.url===url)){c.assets.push({url});variants.push({url,sourcePage:p.url})}}}
await fs.writeFile('source/crawl.json',JSON.stringify(c,null,2));await fs.writeFile('source/variants.json',JSON.stringify(variants,null,2));console.log(variants);
