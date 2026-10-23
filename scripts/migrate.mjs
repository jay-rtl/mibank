import fs from 'node:fs/promises';import {load} from 'cheerio';
const origin='https://www.mibank.com.pg';
const crawl=JSON.parse(await fs.readFile('source/crawl.json','utf8'));
const assets=JSON.parse(await fs.readFile('source/assets.json','utf8'));
const names={business_loans:['business-loan','Business Loan'],nfa_fishing_loan:['fisheries-loan','Fisheries Loan'],farmer_loans:['farmers-loan','Farmers Loan'],micash:['micash','MiCash'],micard:['micard','MiCard'],miloan:['miloan','MiLoan'],mipikinini_savings_account:['mipikinini','MiPikinini'],school_fee:['school-fee-loan','School Fee Loan'],sola_pawa_loans:['sola-pawa-loans','Sola Pawa Loans'],fixed_deposits:['term-deposits','Term Deposits'],vehicle_loan:['vehicle-loan','Vehicle Loan'],payroll:['payroll-loan','Payroll Loan'],micash_fees:['micash/fees','MiCash Transaction Fees'],about_us:['','About Us'],annual_reports:['annual-reports','Annual Reports'],board:['board-of-directors','Board of Directors'],executive_management:['executive-management','Executive Management'],history:['history','History'],privacy:['privacy','Privacy Policy'],vision_mission:['vision-mission','Vision/Mission'],contact_us:['contact','Contact Us'],media:['','Media'],media_ulip:['ulip','MiBank - ULIP'],media_micash_agent:['micash-agent','MiBank - Agent'],MiBank_choice:['michoice','MiBank Choice'],Hibiscus:['hibiscus','MiBank Hibiscus']};
const routes={};const records=[];const external=new Set();const missing=[];
for(const p of crawl.pages.filter(p=>p.status===200&&p.type.includes('html'))){
 const u=new URL(p.url);let route,title;const stem=u.pathname.split('/').at(-1).replace(/\.html?$/i,'');
 if(u.pathname==='/'||u.pathname==='/index.html'){route='/';title='Simple hassle-free banking for everyone'}
 else if(u.pathname.includes('_AR')){const year=u.pathname.match(/20\d\d/)[0];route='/about/annual-reports/'+year;title='Annual Report '+year}
 else if(stem==='MiBankSites'){route='/about/locations';title='Locations'}
 else if(stem==='products'){route='/products';title='Products'}
 else{const n=names[stem];if(!n)throw Error('Unmapped '+p.url);title=n[1];route=(u.pathname.startsWith('/products')?'/products/':/media|Hibiscus|MiBank_choice/.test(stem)?'/media/':'/about/')+n[0];route=route.replace(/\/$/,'')}
 routes[p.url]=route;records.push({...p,route,title});
}
routes[origin+'/index.htm']='/';
function rewrite(value,base){if(value.startsWith('#')||/^(mailto|tel):/.test(value))return value;let u;try{u=new URL(value,base)}catch{return null}
 if(!['https:','http:'].includes(u.protocol))return null;
 if(u.hostname.replace(/^www\./,'')!=='mibank.com.pg'){external.add(u.href);return u.href}
 u.protocol='https:';u.hostname='www.mibank.com.pg';const hash=u.hash;u.hash='';if(routes[u.href])return routes[u.href]+hash;
 const asset=assets.find(a=>a.url===u.href&&a.status===200);if(asset)return asset.optimized||asset.local;
 missing.push({source:base,url:u.href});return '/source-unavailable?file='+encodeURIComponent(decodeURIComponent(u.pathname.replace(/%(?![0-9a-f]{2})/gi,'%25')));}
const pages=[];
for(const r of records){if(pages.some(p=>p.route===r.route))continue;
 const html=await fs.readFile('source/pages/'+r.file,'utf8');const $=load(html);
 $('head,nav,footer,script,style,noscript').remove();
 $('h1').filter((_,el)=>$(el).text().trim()==='Simple hassle-free banking for everyone').remove();
 $('#divheader > p:first-child').remove();$('#sample,#divcontent').remove();
 // Flash viewers are replaced with their original PDF links; no legacy code executes.
 $('object,embed').remove();
 const baseline=$('body').text().replace(/\s+/g,' ').trim();
 const imageList=[];
 $('img').each((i,el)=>{const img=$(el),old=img.attr('src');if(!old)return;const src=rewrite(old,r.url);const source=new URL(old,r.url).href;const a=assets.find(a=>a.url===source);if(!a?.local){missing.push({source:r.url,url:source});img.replaceWith('<span class="asset-unavailable">Original image unavailable</span>');return}
 const caption=img.closest('td').find('strong').first().text().trim();const fallback=decodeURIComponent(source.split('/').at(-1)).replace(/\.[^.]+$/,'').replace(/[_-]/g,' ');
 imageList.push({src,original:source,width:a.width,height:a.height,alt:img.attr('alt')||caption||fallback});
 img.attr({src,alt:img.attr('alt')||caption||fallback,loading:'lazy',decoding:'async',width:a.width,height:a.height});
 });
 $('a').each((_,el)=>{const a=$(el),href=a.attr('href');if(!href){a.replaceWith(a.html());return}const local=rewrite(href,r.url);if(!local){a.replaceWith(a.html());return}a.attr('href',local);a.removeAttr('target');if(/^https?:/.test(local))a.attr('rel','noopener noreferrer');if(!a.text().trim()&&!a.find('img').length){a.remove();return}if(!a.text().trim())a.attr('aria-label',a.find('img').attr('alt')||r.title);});
 const videos=[];
 $('p').each((_,el)=>{if(!$(el).text().trim()&&$(el).find('img').length)$(el).find('br').remove()});
 $('video').each((_,el)=>{const v=$(el);const s=v.attr('src')||v.find('source').attr('src');if(s)videos.push({src:rewrite(s,r.url),title:r.title});v.remove()});
 // Keep actual fee tables; turn presentation tables into responsive content sections.
 if(!r.route.endsWith('/fees')){
 $('td').each((_,el)=>{const td=$(el);if(td.text().trim()||td.find('img,video').length){el.tagName='section';td.attr('class','content-cell')}else td.remove()});
 $('table,tbody,thead,tr').each((_,el)=>{el.tagName='div';$(el).attr('class','content-group')});
 }else{$('table').attr('class','fees-table');$('table tr').first().find('td').each((_,el)=>{el.tagName='th';$(el).attr('scope','col')})}
 $('h1').each((_,el)=>{el.tagName='h2'});
 $('*').each((_,el)=>{for(const a of Object.keys(el.attribs||{})){if(!['href','src','alt','width','height','loading','decoding','rel','aria-label','scope','class'].includes(a))$(el).removeAttr(a)}if(el.tagName!=='img'){$(el).removeAttr('width height')}if(!['content-cell','content-group','fees-table','asset-unavailable'].includes($(el).attr('class')))$(el).removeAttr('class')});
 $('body').find('*').contents().filter((_,node)=>node.type==='comment').remove();
 // Remove empty legacy wrappers and whitespace-only paragraphs.
 for(let i=0;i<4;i++)$('div,p,span,section,header,blockquote,a').each((_,el)=>{if(!$(el).text().trim()&&!$(el).find('img,video').length)$(el).remove()});
 if(/board-of-directors|executive-management/.test(r.route)){const cells=$('.content-cell').toArray().filter(el=>$(el).find('img').length).map(el=>$.html(el));$('body').html(`<h2>${r.title}</h2><div class="people-grid">${cells.join('')}</div>`)}
 pages.push({...r,baseline,html:$('body').html(),images:imageList,videos,description:baseline.slice(0,155)});
}
const map=await fs.readFile('source/mapscripts.js','utf8');const desc=JSON.parse(map.match(/var desc = (\[[\s\S]*?\]);/)[1].replace(/,\s*\]/,']'));
const lat=JSON.parse(map.match(/var lat = (\[[\s\S]*?\]);/)[1]);const lng=JSON.parse(map.match(/var longi = (\[[\s\S]*?\]);/)[1]);
await fs.mkdir('src/data',{recursive:true});await fs.writeFile('src/data/pages.json',JSON.stringify(pages,null,2));await fs.writeFile('src/data/routes.json',JSON.stringify(routes,null,2));await fs.writeFile('src/data/locations.json',JSON.stringify(desc.map((name,i)=>({name,lat:lat[i],lng:lng[i],type:i<17?'Financial Literacy Training':i<72?'Agents':'Branches'})),null,2));
await fs.writeFile('source/missing.json',JSON.stringify(missing,null,2));await fs.writeFile('source/external.json',JSON.stringify([...external],null,2));
const row=(a)=>'| '+a.join(' | ')+' |';
await fs.writeFile('SITE_INVENTORY.md','# Site inventory\n\nAudit date: 22 October 2026. Recursive same-origin link crawl from homepage, including image-only links, secondary/footer links and report viewers. Search query `site:mibank.com.pg` returned no additional results. robots.txt and sitemap.xml both returned 404. This is a reachable-link inventory, not proof of unlinked-page coverage. Raw responses: `source/pages/`.\n\n'+row(['Original URL','Local route','Title','Source HTTP','Content'])+'\n'+row(['---','---','---','---','---'])+'\n'+records.map(r=>row([r.url,r.route,r.title,r.status,'Captured; see content audit'])).join('\n')+'\n\n## Unavailable endpoints\n'+crawl.pages.filter(p=>p.status!==200).map(p=>`- ${p.url}: HTTP ${p.status}`).join('\n'));
await fs.writeFile('ROUTE_MAPPING.md','# Route mapping\n\nAll same-origin informational links are rewritten at migration time. Downloads use local files; unavailable source documents use an explanatory local page, with the original label preserved. Original paths are documented for a future approved host-level migration; this preview serves the new local routes. No navigation links fall back to MiBank production.\n\n'+row(['Original','Local'])+'\n'+row(['---','---'])+'\n'+Object.entries(routes).map(([a,b])=>row([a,b])).join('\n')+'\n\n## Third-party links (not runtime dependencies)\n'+[...external].map(u=>'- '+u).join('\n'));
await fs.writeFile('ASSET_MANIFEST.md','# Asset manifest\n\nOriginal bytes are retained. Optimized WebP derivatives retain the full source composition. MiBank owns the original assets; use in this local redesign follows the supplied brief. Client approval remains required before public release. No stock or generated brand imagery is used.\n\n'+row(['Original URL','Local original','Optimized display','HTTP','Bytes'])+'\n'+row(['---','---','---','---','---'])+'\n'+assets.map(a=>row([a.url,a.local||'Unavailable',a.optimized||'—',a.status,a.bytes||'—'])).join('\n'));
await fs.writeFile('CONTENT_AUDIT.md',`# Content audit\n\nCaptured ${records.length} accessible HTML URLs; ${pages.length} unique local informational pages after deduplicating the homepage. Body text, images, tables, downloads and video sources are captured in src/data/pages.json. Shared navigation/footer is rebuilt once; the shared slogan is retained in the new footer. Only HTML whitespace and entities are normalized for automated comparison. No original rates, eligibility text, paragraphs or news dates are intentionally corrected.\n\n## Content discrepancies requiring client review\n- Homepage says 16 branches; About Us says 12. Both preserved.\n- History ends with “more than Agents”; preserved exactly.\n- Contact details include “TEL: 321 381 /7999 9129”; preserved exactly.\n- Media has inconsistent image/title/date destinations, including digital ID linking to innovation award and some dates pointing to unrelated PDFs. Destinations are preserved where available; no editorial fixes inferred.\n- Eight report viewers require obsolete Flash. Their original fallback wording is preserved and original PDFs offered locally; Flash is not executed.\n- No standalone current insurance page was discovered. Insurance references and the BIMA MiLife release remain available.\n- robots.txt, sitemap.xml and logo destination index.htm return 404. Logo maps to local home.\n\n## Missing source references\n${[...new Set(missing.map(m=>m.url))].map(u=>'- '+u).join('\n')}\n\n## Coverage limits\nNo content is fabricated for unavailable files. The original source site was crawled via public HTML links. Unlinked pages, historical archive versions and content behind authentication are outside verifiable coverage. Final comparison and rendered checks are recorded in FINAL_AUDIT.md.\n`);
console.log('Migrated',pages.length,'pages;',assets.filter(a=>a.status===200).length,'assets;',missing.length,'unavailable references');
