import fs from 'node:fs/promises';
const url='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';
const css=await(await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'}})).text();
await fs.writeFile('source/font-source.css',css);const blocks=css.split('/* latin */').at(-1);const source=blocks.match(/url\(([^)]+)\)/)[1];const ext=source.endsWith('.woff2')?'woff2':'ttf';const r=await fetch(source);await fs.writeFile('public/assets/manrope-latin.'+ext,Buffer.from(await r.arrayBuffer()));
const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt');if(license.ok)await fs.writeFile('public/assets/Manrope-OFL.txt',await license.text());
console.log({source,local:'/assets/manrope-latin.'+ext});
