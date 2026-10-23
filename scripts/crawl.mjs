import fs from 'node:fs/promises';
import path from 'node:path';
const origin='https://www.mibank.com.pg/';
const dir='source/pages'; await fs.mkdir(dir,{recursive:true});
const queue=[origin,origin+'robots.txt',origin+'sitemap.xml']; const seen=new Set();const pages=[];const files=new Map();
function absolute(value,base){try{return new URL(value.replaceAll('&amp;','&'),base)}catch{return null}}
while(queue.length){
 const batch=queue.splice(0,6).filter(u=>!seen.has(u));batch.forEach(u=>seen.add(u));
 await Promise.all(batch.map(async url=>{try{
 const response=await fetch(url,{signal:AbortSignal.timeout(45000)});const type=response.headers.get('content-type')||'';
 if(!type.includes('text')&&!type.includes('xml')){files.set(url,{url,type,status:response.status});return;}
 const html=await response.text();const filename=String(pages.length)+'-'+Buffer.from(url).toString('base64url')+'.html';
 const record={url,finalUrl:response.url,status:response.status,type,file:filename}; pages.push(record);await fs.writeFile(path.join(dir,filename),html);
 if(response.ok&&type.includes('html')){
 for(const m of html.matchAll(/(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)){
 const u=absolute(m[1],url);if(!u||!['http:','https:'].includes(u.protocol))continue;u.hash='';
 if(u.hostname.replace(/^www\./,'')!=='mibank.com.pg')continue;u.protocol='https:';u.hostname='www.mibank.com.pg';
 if(/\.(?:html?|php|asp)$/i.test(u.pathname)||u.pathname.endsWith('/')){if(!seen.has(u.href)&&!queue.includes(u.href))queue.push(u.href)}
 else files.set(u.href,{url:u.href});
 }
 }
 console.log(response.status,url);
 }catch(e){pages.push({url,status:0,error:e.message});console.log('FAILED',url,e.message)}}));
 await fs.writeFile('source/crawl.json',JSON.stringify({pages,assets:[...files.values()]},null,2));
}
console.log('Pages',pages.length,'assets',files.size);
