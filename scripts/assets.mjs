import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';
const crawl=JSON.parse(await fs.readFile('source/crawl.json','utf8'));
const assets=crawl.assets.filter(a=>/\.(?:pdf|jpe?g|gif|png|mp4|webp)$/i.test(new URL(a.url).pathname)||a.url.endsWith('mapscripts.js'));
await fs.mkdir('public/assets',{recursive:true});let manifest=[];
try{manifest=JSON.parse(await fs.readFile('source/assets.json','utf8'))}catch{}
for(let i=0;i<assets.length;i+=8){await Promise.all(assets.slice(i,i+8).map(async a=>{
 if(manifest.some(m=>m.url===a.url&&m.status===200))return;
 manifest=manifest.filter(m=>m.url!==a.url);
 const u=new URL(a.url),ext=path.extname(u.pathname),name=decodeURIComponent(path.basename(u.pathname,ext).replace(/%(?![0-9a-f]{2})/gi,'%25')).replace(/[^a-zA-Z0-9_-]/g,'-');
 const file=`/assets/${name}-${crypto.createHash('sha1').update(a.url).digest('hex').slice(0,8)}${ext}`;
 try{const r=await fetch(a.url,{headers:{Referer:'https://www.mibank.com.pg/','User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(90000)});if(!r.ok){manifest.push({...a,status:r.status});console.log(r.status,a.url);return}
 const data=Buffer.from(await r.arrayBuffer());await fs.writeFile('public'+file,data);const item={url:a.url,local:file,status:r.status,bytes:data.length};
 if(/\.(?:jpg|jpeg|png|gif)$/i.test(ext)){try{const meta=await sharp(data).metadata();item.width=meta.width;item.height=meta.height;const optimized=file.replace(/\.[^.]+$/,'.webp');await sharp(data).resize({width:1800,withoutEnlargement:true}).webp({quality:88}).toFile('public'+optimized);item.optimized=optimized;}catch(e){item.imageError=e.message}}
 manifest.push(item);console.log('OK',Math.round(data.length/1024)+'KB',file);
 }catch(e){manifest.push({...a,status:0,error:e.message});console.log('FAILED',a.url)}
}));await fs.writeFile('source/assets.json',JSON.stringify(manifest,null,2));}
