import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const result=[];
for(const width of [1440,768,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:process.argv[2]==='after'?'no-preference':'reduce'});const page=await context.newPage();
 for(const route of ['/','/products/','/media/','/about/annual-reports/','/about/locations/']){
  await page.goto('http://127.0.0.1:4321'+route);
  if(route==='/'){if(await page.locator('[data-welcome-intro]').evaluate(el=>el.open))await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.documentElement.classList.contains('welcome-active'));}
  if(route==='/about/locations/')await page.locator('.leaflet-control-zoom').waitFor();
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  result.push({width,route,...await page.evaluate(()=>({height:document.documentElement.scrollHeight,boxes:[...document.querySelectorAll('.cinema-mission,.cinema-products,.cinema-story-grid,.cinema-reports,.cinema-film-grid,.page-heading,.all-products,.page-grid,.newsroom,.news-feature,.location-map,.callout,footer')].map(el=>{const r=el.getBoundingClientRect();return {className:el.className,x:r.x,y:r.y+scrollY,width:r.width,height:r.height};})}))});
 }
 await context.close();
}
await browser.close();const phase=process.argv[2]||'after';await fs.writeFile(`audit/cinematic-layout-${phase}.json`,JSON.stringify(result,null,2));console.log(`${result.length} layout snapshots saved (${phase}).`);
if(phase==='after'){const before=JSON.parse(await fs.readFile('audit/cinematic-layout-before.json','utf8'));const changes=result.filter((item,i)=>JSON.stringify(item)!==JSON.stringify(before[i]));console.log(`Changed layouts: ${changes.length}`);if(changes.length)process.exitCode=1;}
