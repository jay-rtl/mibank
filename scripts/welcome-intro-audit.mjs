import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const installClock=async page=>{await page.clock.install();};
const result={checks:[],axe:[],errors:[],failed:[]};const check=(name,pass)=>result.checks.push({name,pass});
for(const width of [1440,768,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'no-preference'});const page=await context.newPage();
 page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failed.push({url:r.url(),status:r.status()});});
 await installClock(page);await page.goto('http://127.0.0.1:4321/');
 check(`Welcome opens ${width}`,await page.locator('[data-welcome-intro]').evaluate(el=>el.open));
 check(`Welcome has no logo/image ${width}`,await page.locator('[data-welcome-intro] img,[data-welcome-intro] svg').count()===0);
 check(`Welcome text ${width}`,(await page.locator('#welcome-title').textContent()).replace(/\s/g,'')==='WelcometoMiBank');
 check(`Scroll locked ${width}`,await page.locator('html').evaluate(el=>el.classList.contains('welcome-active')));
 check(`No overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Freeze CSS animation at its fully readable stage for screenshots/contrast.
 await page.evaluate(()=>document.querySelector('[data-welcome-intro]').getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=3500;}));
 await page.screenshot({path:`audit/screenshots/welcome-intro-${width}.png`});
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.axe.push({width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
 // Reload before timing assertions so screenshot/axe work is not counted in the hold.
 await page.goto('http://127.0.0.1:4321/');
 await page.clock.runFor(5000);check(`Unhurried hold at 5 seconds ${width}`,await page.locator('[data-welcome-intro]').evaluate(el=>el.open&&!el.classList.contains('is-leaving')));
 check(`Hero remains first slide during intro ${width}`,await page.locator('[data-current]').textContent()==='01');
 await page.clock.runFor(1700);check(`Automatic dismissal after 6.6 seconds ${width}`,await page.locator('[data-welcome-intro]').evaluate(el=>!el.open));
 check(`Scroll restored ${width}`,!await page.locator('html').evaluate(el=>el.classList.contains('welcome-active')));
 await page.clock.runFor(7100);check(`Hero autoplay starts after intro ${width}`,await page.locator('[data-current]').textContent()==='02');
 await context.close();
}
const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();await installClock(page);await page.goto('http://127.0.0.1:4321/');
await page.locator('.logo').evaluate(el=>el.focus());check('Background navigation is inert during intro',await page.evaluate(()=>document.activeElement!==document.querySelector('.logo')));await page.getByRole('button',{name:'Skip intro'}).focus();check('Keyboard skip receives focus',await page.getByRole('button',{name:'Skip intro'}).evaluate(el=>el===document.activeElement));
await page.getByRole('button',{name:'Skip intro'}).click();check('Skip closes immediately',await page.locator('[data-welcome-intro]').evaluate(el=>!el.open));check('Skip focuses main',await page.locator('#main').evaluate(el=>el===document.activeElement));
await page.goto('http://127.0.0.1:4321/');await page.keyboard.press('Escape');check('Escape closes intro',await page.locator('[data-welcome-intro]').evaluate(el=>!el.open));check('Escape unlocks scroll',!await page.locator('html').evaluate(el=>el.classList.contains('welcome-active')));
await page.goto('http://127.0.0.1:4321/#mission-title');check('Direct anchor bypasses intro',await page.locator('[data-welcome-intro]').evaluate(el=>!el.open));
await page.goto('http://127.0.0.1:4321/media/');check('No intro on inner pages',await page.locator('[data-welcome-intro]').count()===0);
await context.close();
const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const rp=await reduced.newPage();await installClock(rp);await rp.goto('http://127.0.0.1:4321/');check('Reduced-motion static welcome',await rp.locator('.welcome-name').evaluate(el=>getComputedStyle(el).animationName==='none'));await rp.clock.runFor(950);check('Reduced motion avoids long wait',await rp.locator('[data-welcome-intro]').evaluate(el=>!el.open));check('Reduced-motion hero stays paused',await rp.locator('[data-pause]').getAttribute('aria-label')==='Play slideshow');await reduced.close();
const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await noJS.newPage();await np.goto('http://127.0.0.1:4321/');check('No-JS intro does not block page',await np.locator('[data-welcome-intro]').evaluate(el=>!el.open));check('No-JS hero visible',await np.locator('.cinema-slide.is-active h1').isVisible());await noJS.close();
await browser.close();await fs.writeFile('audit/welcome-intro-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify({checks:result.checks.length,failedChecks:result.checks.filter(c=>!c.pass),axe:result.axe,errors:result.errors,failed:result.failed},null,2));if(result.checks.some(c=>!c.pass)||result.axe.some(a=>a.violations.length)||result.errors.length||result.failed.length)process.exitCode=1;
