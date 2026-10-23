import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const base='http://127.0.0.1:4321';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const result={base,routes:[],mobile:[],errors:[],failed:[],interactions:[]};
page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failed.push({url:r.url(),status:r.status()});});
async function inspect(route,width){
  const response=await page.goto(base+(route==='/'?'/':route+'/'));
  if(route==='/about/locations')await page.locator('.leaflet-control-zoom').waitFor();
  const layout=await page.evaluate(()=>({dark:document.body.classList.contains('site-dark')&&getComputedStyle(document.body).backgroundColor==='rgb(23, 28, 27)',overflow:document.documentElement.scrollWidth>innerWidth}));
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  return {route,width,status:response.status(),...layout,violations};
}
for(const item of [...pages,{route:'/source-unavailable'}])result.routes.push(await inspect(item.route,1440));
for(const route of ['/products','/about','/about/annual-reports','/media','/about/locations','/products/micash/fees','/about/contact','/about/board-of-directors','/media/hibiscus','/source-unavailable']){
  await page.setViewportSize({width:390,height:844});result.mobile.push(await inspect(route,390));
}
for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/products','/about','/media','/about/locations','/about/annual-reports']){
    await page.goto(base+route+'/');if(route==='/about/locations')await page.locator('.leaflet-control-zoom').waitFor();
    await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    await page.screenshot({path:`audit/screenshots/dark-${route.replaceAll('/','-').slice(1)}-${width}.png`,fullPage:true});
  }
}
await page.goto(base+'/');result.interactions.push({name:'Old Latest News graphic replaced',pass:await page.locator('img[src*="mibank_news_btn"]').count()===0&&await page.getByRole('link',{name:'News archive'}).count()===1});
await page.goto(base+'/media/');await page.locator('#media-search').fill('no matching item');
result.interactions.push({name:'Media empty state readable',pass:await page.locator('#media-empty').isVisible()});
const emptyAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.interactions.push({name:'Media empty state axe',pass:emptyAxe.violations.length===0,violations:emptyAxe.violations.map(v=>v.id)});
await page.locator('#media-reset').click();result.interactions.push({name:'Media reset restores 49 items',pass:await page.locator('[data-news-item]:visible').count()===49});
await page.goto(base+'/about/locations/');await page.locator('.leaflet-control-zoom').waitFor();await page.locator('#location-search').fill('Lihir');await page.locator('.location-select:visible').first().click();
result.interactions.push({name:'Location popup opens',pass:await page.locator('.leaflet-popup-content').isVisible()});
const popupAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.interactions.push({name:'Map popup axe',pass:popupAxe.violations.length===0,violations:popupAxe.violations.map(v=>v.id)});
await browser.close();await fs.writeFile('audit/dark-theme-results.json',JSON.stringify(result,null,2));
const failed=[...result.routes,...result.mobile].filter(r=>r.status!==200||!r.dark||r.overflow||r.violations.length);
console.log(JSON.stringify({desktop:result.routes.length,mobile:result.mobile.length,failed,interactions:result.interactions,errors:result.errors,failedRequests:result.failed},null,2));
if(failed.length||result.interactions.some(i=>!i.pass)||result.errors.length||result.failed.length)process.exitCode=1;
