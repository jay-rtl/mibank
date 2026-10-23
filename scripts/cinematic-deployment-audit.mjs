import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const base=process.argv[2]||'https://jay-rtl.github.io/mibank';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const result={base,checks:[],axe:[],errors:[],failed:[]};const check=(name,pass)=>result.checks.push({name,pass});
const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();
page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failed.push({url:r.url(),status:r.status()});});
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 check(`Home HTTP ${width}`,(await page.goto(base+'/')).status()===200);
 check(`Welcome opens ${width}`,await page.locator('[data-welcome-intro]').evaluate(el=>el.open));
 check(`Welcome has no logo ${width}`,await page.locator('[data-welcome-intro] img,[data-welcome-intro] svg').count()===0);
 if(width===1440){await page.waitForFunction(()=>!document.querySelector('[data-welcome-intro]').open,{},{timeout:12000});check('Welcome dismisses automatically',!await page.locator('html').evaluate(el=>el.classList.contains('welcome-active')));check('Hero starts on first slide',await page.locator('[data-current]').textContent()==='01');await page.waitForTimeout(7200);check('Live hero autoplays',await page.locator('[data-current]').textContent()==='02');}
 else await page.keyboard.press('Escape');
 check(`Hero image loads ${width}`,await page.locator('.cinema-slide.is-active img').evaluate(img=>img.complete&&img.naturalWidth>0));
 check(`No overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const cards=page.locator(width>520?'.cinema-products':'.cinema-product').first();await cards.waitFor();
 const range=await cards.evaluate(el=>({start:+el.dataset.scrollStart,end:+el.dataset.scrollEnd}));
 check(`Live ScrollTrigger installed ${width}`,await cards.getAttribute('data-scroll-scrub')==='1.5'&&range.end>range.start);
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),(range.start+range.end)/2);await page.waitForTimeout(1700);
 check(`Live masks and scaling progress ${width}`,await page.locator('.cinema-product-art').first().evaluate(el=>{const style=getComputedStyle(el);const m=new DOMMatrixReadOnly(style.transform);return m.m42>1&&m.m11<1&&style.clipPath!=='none'&&style.opacity==='1';}));
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 if(width===390)await page.locator('#mobile-toggle').click();
 await page.locator('.nav-dropdown summary').first().click();await page.locator('.products-dropdown a').filter({hasText:/^MiCash/}).first().click();
 check(`Product navigation ${width}`,page.url().includes('/mibank/products/micash')&&await page.locator('h1').textContent()==='MiCash');
 check(`Dark inner page ${width}`,await page.locator('body').evaluate(el=>el.classList.contains('site-dark')&&getComputedStyle(el).backgroundColor==='rgb(23, 28, 27)'));
 await page.reload();check(`Nested route refresh ${width}`,await page.locator('h1').textContent()==='MiCash');
 await page.goto(base+'/media/');check(`49 Media items ${width}`,await page.locator('[data-news-item]').count()===49);
 check(`Responsive media image ${width}`,await page.locator('.news-feature-image img').evaluate(img=>img.complete&&img.naturalWidth>0&&img.currentSrc.includes('/mibank/assets/')));
 await page.locator('#media-search').fill('Sola PayGo');check(`Media search ${width}`,await page.locator('[data-news-item]:visible').count()===1);await page.locator('#media-search').fill('nothing matches this query');await page.locator('#media-reset').click();check(`Media reset ${width}`,await page.locator('[data-news-item]:visible').count()===49);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.axe.push({route:'/media/',width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
 await page.goto(base+'/about/locations/');await page.locator('.leaflet-control-zoom').waitFor();await page.locator('#location-search').fill('Lihir');await page.locator('.location-select:visible').first().click();check(`Locations popup ${width}`,await page.locator('.leaflet-popup-content').isVisible());
}
await page.goto(base+'/about/annual-reports/');const pdf=await page.locator('.source-content a[href$=".pdf"]').first().getAttribute('href');const pdfResponse=await context.request.get(new URL(pdf,base).href);check('Original PDF download',pdfResponse.status()===200&&(await pdfResponse.body()).subarray(0,4).toString()==='%PDF');
for(const slug of ['hibiscus','michoice','ulip','micash-agent']){await page.goto(base+'/media/'+slug+'/');check(`Video playback ${slug}`,await page.locator('video').evaluate(async video=>{try{video.muted=true;await Promise.race([video.play(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),15000))]);const ok=!video.paused;video.pause();return ok}catch{return false}}));}
const routes=JSON.parse(await fs.readFile('src/data/pages.json','utf8')).map(p=>p.route);for(let i=0;i<routes.length;i+=4){await Promise.all(routes.slice(i,i+4).map(async route=>{const response=await context.request.get(base+(route==='/'?'/':route+'/'));const html=await response.text();check(`Published route ${route}`,response.status()===200&&html.includes('noindex')&&html.includes('site-dark'));}));}
await browser.close();await fs.writeFile('audit/cinematic-deployed-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify({base,checks:result.checks.length,failedChecks:result.checks.filter(c=>!c.pass),axe:result.axe,errors:result.errors,failedRequests:result.failed},null,2));if(result.checks.some(c=>!c.pass)||result.axe.some(a=>a.violations.length)||result.errors.length||result.failed.length)process.exitCode=1;
