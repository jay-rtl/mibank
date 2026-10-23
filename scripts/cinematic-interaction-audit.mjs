import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const result={axe:[],checks:[],errors:[],knownFindings:[]};const check=(name,pass)=>result.checks.push({name,pass});
const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
for(const width of [1440,768,390]){
 await page.setViewportSize({width,height:900});
 for(const route of ['/','/products/','/media/']){
  await page.goto('http://127.0.0.1:4321'+route);
  if(route==='/'&&await page.locator('[data-welcome-intro]').evaluate(el=>el.open))await page.keyboard.press('Escape');
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});await page.waitForTimeout(250);
  // Native page scrolling to the bottom completes even the clamped footer scenes.
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(1750);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.axe.push({width,route,mode:'normal motion, settled',violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  check(`Footer fully readable ${width} ${route}`,await page.locator('.footer-grid>div').evaluateAll(els=>els.every(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform==='none'?undefined:getComputedStyle(el).transform).m42)<.1)));
 }
}
await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4321/');if(await page.locator('[data-welcome-intro]').evaluate(el=>el.open))await page.keyboard.press('Escape');await page.waitForTimeout(150);
check('Desktop card group active',await page.locator('.cinema-products[data-scroll-scene]').count()===1);
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);check('Resize creates separate mobile card sequences',await page.locator('.cinema-product[data-scroll-scene]').count()===3&&await page.locator('.cinema-products[data-scroll-scene]').count()===0);
await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(250);check('Resize cleans up previous mobile scenes',await page.locator('.cinema-products[data-scroll-scene]').count()===1&&await page.locator('.cinema-product[data-scroll-scene]').count()===0);
await page.goto('http://127.0.0.1:4321/media/');await page.locator('[data-year-link="2018"]').click();await page.waitForTimeout(250);check('Archive anchor jump remains readable',await page.locator('#media-2018 .news-year-heading h3').evaluate(el=>getComputedStyle(el).clipPath==='none'));
await page.goto('http://127.0.0.1:4321/products/');const before=await page.locator('.artwork-archive').evaluate(el=>el.getBoundingClientRect().height);await page.locator('.artwork-archive summary').click();await page.waitForTimeout(250);check('Promotional artwork still expands',await page.locator('.artwork-archive').evaluate(el=>el.getBoundingClientRect().height)>before);
await page.goto('http://127.0.0.1:4321/products/');await page.waitForTimeout(150);const paired=page.locator('.product-row[data-scroll-scene]').first();check('Keyboard unmasks second item in paired row',await paired.evaluate(el=>{const other=el.nextElementSibling;other.focus();const title=other.querySelector('h2');return document.activeElement===other&&getComputedStyle(title).clipPath==='none'&&getComputedStyle(title).transform==='none';}));
// Retain and verify the existing sticky-rail warning rather than suppressing it.
const known=result.axe.filter(a=>a.width===1440&&a.route==='/media/').flatMap(a=>a.violations.filter(v=>v.id==='target-size'&&v.nodes.every(n=>JSON.stringify(n.target).includes('media-2018'))));
if(known.length){await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:4321/media/');await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(150);const baseline=(await new AxeBuilder({page}).withTags(['wcag22aa']).analyze()).violations;await page.locator('[data-year-link="2018"]').focus();const exposed=await page.locator('[data-year-link="2018"]').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>document.querySelector('.site-header').getBoundingClientRect().bottom&&r.height>=24&&el===document.activeElement;});check('Existing rail warning reproduces with motion disabled',baseline.some(v=>v.id==='target-size'));check('Keyboard fully exposes existing archive link',exposed);result.knownFindings.push({id:'target-size',route:'/media/',width:1440,scope:'Existing sticky year rail at the footer boundary; reproduced with reduced motion; keyboard exposes full target.',original:known});}
await browser.close();await fs.writeFile('audit/cinematic-interaction-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));const unexpected=result.axe.some(a=>a.violations.some(v=>!(a.width===1440&&a.route==='/media/'&&v.id==='target-size'&&v.nodes.every(n=>JSON.stringify(n.target).includes('media-2018')))));if(unexpected||result.checks.some(c=>!c.pass)||result.errors.length)process.exitCode=1;
