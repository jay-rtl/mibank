import fs from 'node:fs/promises';import path from 'node:path';import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));const result={routes:pages.length,broken:[],originalDomainLinks:[],externalAssets:[],missingText:[],metadata:[],assets:0};
const normalize=s=>s.replace(/\s/g,'');
for(const p of pages){const file='dist'+(p.route==='/'?'':p.route)+'/index.html';const html=await fs.readFile(file,'utf8');const $=load(html);const rendered=normalize($('body').text());
 const raw=await fs.readFile('source/pages/'+p.file,'utf8');const original=load(raw);original('head,nav,footer,script,style,noscript,object,embed').remove();const segments=[];function visit(node){if(node.type==='text'&&node.data.trim())segments.push(node.data);for(const child of node.children||[])visit(child)}visit(original('body')[0]);
 for(const segment of segments)if(!rendered.includes(normalize(segment)))result.missingText.push({route:p.route,text:segment.trim()});
 if(!$('title').text()||!$('meta[name=description]').attr('content')||!$('meta[name=robots]').attr('content')?.includes('noindex')||!$('h1').length)result.metadata.push(p.route);
 for(const el of $('a[href],img[src],source[src],script[src],link[href]').toArray()){
 const value=$(el).attr('href')||$(el).attr('src');if(/^https?:\/\//.test(value)){if(value.includes('mibank.com.pg'))result.originalDomainLinks.push({page:p.route,value});if(el.tagName!=='a')result.externalAssets.push({page:p.route,value});continue}if(/^(?:tel:|mailto:|#)/.test(value))continue;
 const u=new URL(value,'http://localhost'+p.route+'/');let pathname=decodeURIComponent(u.pathname);let target=path.join('dist',pathname);try{if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');await fs.access(target);if(/assets/.test(value))result.assets++}catch{result.broken.push({page:p.route,value})}
 }
}
await fs.mkdir('audit',{recursive:true});await fs.writeFile('audit/static-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(result.broken.length||result.originalDomainLinks.length||result.externalAssets.length||result.missingText.length||result.metadata.length)process.exitCode=1;
