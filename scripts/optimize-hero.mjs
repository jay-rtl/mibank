import sharp from 'sharp';import fs from 'node:fs/promises';
const assets=JSON.parse(await fs.readFile('source/assets.json','utf8'));const original=assets.find(a=>a.url.endsWith('/video_mibank_hibicus.jpg'));
for(const width of [640,960,1422]){const dest=`/assets/hibiscus-hero-${width}.avif`;await sharp('public'+original.local).resize({width,withoutEnlargement:true}).avif({quality:52,effort:6}).toFile('public'+dest);console.log(dest,(await fs.stat('public'+dest)).size)}
