import fs from 'node:fs/promises';import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));const result=[];
for(let i=0;i<pages.length;i+=6)await Promise.all(pages.slice(i,i+6).map(async p=>{const r=await fetch('https://jay-rtl.github.io/mibank'+(p.route==='/'?'/':p.route+'/'),{signal:AbortSignal.timeout(30000)});const $=load(await r.text());result.push({route:p.route,status:r.status,noindex:$('meta[name=robots]').attr('content')?.includes('noindex'),hasHeading:$('h1').length>0})}));
await fs.writeFile('audit/deployed-route-results.json',JSON.stringify(result,null,2));const failures=result.filter(x=>x.status!==200||!x.noindex||!x.hasHeading);console.log({pages:result.length,failures});if(failures.length)process.exitCode=1;
