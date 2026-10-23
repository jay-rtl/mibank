import fs from 'node:fs';import {load} from 'cheerio';
const c=JSON.parse(fs.readFileSync('source/crawl.json'));
for(const suffix of process.argv.slice(2)){const p=c.pages.find(x=>x.url.endsWith(suffix));const $=load(fs.readFileSync('source/pages/'+p.file));$('nav,footer,script,head').remove();console.log('\nPAGE '+suffix+'\n'+$('body').html())}
