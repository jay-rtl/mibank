import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const base='http://127.0.0.1:4321';
const result={base,environment:'Local production preview; installed Chrome via Playwright',checks:[],axe:[],errors:[],failed:[]};
const check=(name,pass)=>result.checks.push({name,pass});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();
page.on('pageerror',e=>result.errors.push(e.message));
page.on('response',response=>{if(response.status()>=400)result.failed.push({url:response.url(),status:response.status()});});
for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:width===390?844:1000});
  check(`Home HTTP 200 ${width}`,(await page.goto(base)).status()===200);
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  check(`All images load ${width}`,await page.evaluate(()=>[...document.images].every(img=>img.naturalWidth>0)));
  check(`No horizontal overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check(`Dark home theme ${width}`,await page.locator('body').evaluate(el=>el.classList.contains('home-cinematic')));
  check(`Four slides ${width}`,await page.locator('[data-slide]').count()===4);
  check(`Reduced motion starts paused ${width}`,await page.locator('[data-pause]').getAttribute('aria-label')==='Play slideshow');
  await page.locator('[data-next]').click();
  check(`Next slide ${width}`,await page.locator('[data-slide].is-active h2').textContent()==='Licensed financial institution');
  check(`Only current slide interactive ${width}`,await page.locator('[data-slide]').evaluateAll(slides=>slides.filter(s=>!s.inert).length===1));
  await page.locator('[data-previous]').click();
  check(`Previous slide ${width}`,await page.locator('[data-current]').textContent()==='01');
  await page.locator('[data-previous]').click();
  check(`Wrap previous ${width}`,await page.locator('[data-current]').textContent()==='04');
  await page.locator('[data-next]').click();
  check(`Wrap next ${width}`,await page.locator('[data-current]').textContent()==='01');
  await page.locator('[data-go-to="2"]').focus();await page.keyboard.press('Enter');
  check(`Keyboard direct slide ${width}`,await page.locator('[data-current]').textContent()==='03');
  check(`Slide announcement ${width}`,(await page.locator('[data-slide-announcement]').textContent()).includes('Modern and affordable'));
  check(`Inactive CTA excluded from keyboard ${width}`,await page.locator('[data-slide]').evaluateAll(slides=>slides.filter(s=>!s.classList.contains('is-active')).every(s=>s.inert&&s.getAttribute('aria-hidden')==='true')));
  await page.locator('[data-go-to="0"]').click();
  if(width<=800){
    await page.locator('#mobile-toggle').click();
    check(`Mobile menu opens ${width}`,await page.locator('#mobile-toggle').getAttribute('aria-expanded')==='true');
    await page.locator('.nav-dropdown').first().locator('summary').click();
    check(`Mobile product menu ${width}`,await page.locator('.products-dropdown').isVisible());
    await page.keyboard.press('Escape');check(`Escape closes dropdown ${width}`,await page.locator('.nav-dropdown[open]').count()===0);
    await page.keyboard.press('Escape');check(`Escape closes mobile menu ${width}`,await page.locator('#mobile-toggle').getAttribute('aria-expanded')==='false');
  }else{
    await page.locator('.nav-dropdown').first().locator('summary').click();check('Desktop products dropdown',await page.locator('.products-dropdown').isVisible());await page.keyboard.press('Escape');check('Desktop dropdown Escape',await page.locator('.nav-dropdown[open]').count()===0);
  }
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  result.axe.push({width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.locator('.cinema-scroll').click();check(`Discover anchor ${width}`,new URL(page.url()).hash==='#mission-title');
  await page.evaluate(()=>scrollTo(0,1500));check(`Sticky header ${width}`,await page.locator('.site-header').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<2));
  // Fresh page screenshots avoid focus/scroll artifacts from keyboard and axe checks.
  await page.goto(base);await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  await page.screenshot({path:`audit/screenshots/home-cinematic-${width}.png`,fullPage:true});
  await page.screenshot({path:`audit/screenshots/home-cinematic-${width}-top.png`});
}
const reports=await page.locator('.cinema-report').evaluateAll(links=>links.map(a=>a.href));
check('Three original report PDFs',reports.length===3);
for(const url of reports){const response=await context.request.get(url);check(`Report PDF ${url.split('/').pop()}`,response.status()===200&&(await response.body()).subarray(0,4).toString()==='%PDF');}
// Deterministic timer tests exercise automatic rotation without waiting in real time.
const autoContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
const auto=await autoContext.newPage();await auto.clock.install();await auto.goto(base);
await auto.getByRole('button',{name:'Skip intro'}).click();
check('Autoplay enabled by default',await auto.locator('[data-pause]').getAttribute('aria-label')==='Pause slideshow');
await auto.mouse.move(700,350);
await auto.clock.fastForward(7200);check('Automatic rotation after 7s',await auto.locator('[data-current]').textContent()==='02');
await auto.locator('[data-pause]').click();check('Pause control changes state',await auto.locator('[data-pause]').getAttribute('aria-label')==='Play slideshow');
const pausedIndex=await auto.locator('[data-current]').textContent();await auto.clock.fastForward(15000);check('Pause stops automatic rotation',await auto.locator('[data-current]').textContent()===pausedIndex);
await auto.locator('[data-pause]').click();await auto.mouse.move(0,0);await auto.clock.fastForward(7200);check('Play resumes rotation',await auto.locator('[data-current]').textContent()!==pausedIndex);
await auto.clock.runFor(1100);await auto.locator('.is-active .cinema-button').focus();check('Active slide CTA receives keyboard focus',await auto.locator('.is-active .cinema-button').evaluate(el=>el===document.activeElement));const focusIndex=await auto.locator('[data-current]').textContent();await auto.clock.fastForward(15000);check('Focus stops rotation',await auto.locator('[data-current]').textContent()===focusIndex);check('Keyboard focus pauses until Play',await auto.locator('[data-pause]').getAttribute('aria-label')==='Play slideshow');
await autoContext.close();
const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await staticContext.newPage();await staticPage.goto(base);
check('No-JS first slide usable',await staticPage.locator('.is-active .cinema-button').isVisible());check('No-JS controls hidden',!await staticPage.locator('[data-next]').isVisible());check('No-JS navigation usable',await staticPage.locator('#primary-nav').isVisible());check('No-JS content and reports available',await staticPage.locator('.cinema-report').count()===3&&await staticPage.locator('.mission-statement').isVisible());await staticContext.close();
for(const route of ['/media/','/about/locations/','/products/micash/','/media/hibiscus/']){check(`Regression HTTP ${route}`,(await page.goto(base+route)).status()===200);check(`Shared dark theme on ${route}`,await page.locator('body').evaluate(el=>el.classList.contains('site-dark')));}
await browser.close();await fs.writeFile('audit/home-cinematic-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({checks:result.checks.length,failedChecks:result.checks.filter(c=>!c.pass),axe:result.axe,errors:result.errors,failed:result.failed},null,2));
if(result.checks.some(c=>!c.pass)||result.axe.some(a=>a.violations.length)||result.errors.length||result.failed.length)process.exitCode=1;
