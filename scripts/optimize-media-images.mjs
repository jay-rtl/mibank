import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const $=load(pages.find(p=>p.route==='/media').html);
const images={};
for(const src of new Set($('img[src]').toArray().map(img=>$(img).attr('src')))){
  const original='public'+src;
  const {width}=await sharp(original).metadata();
  const variants=[];
  for(const size of [...new Set([Math.min(200,width),Math.min(380,width),Math.min(768,width)])]){
    const url='/assets/'+path.basename(src,path.extname(src))+`-display-${size}.webp`;
    await sharp(original).resize({width:size,withoutEnlargement:true}).webp({quality:76}).toFile('public'+url);
    variants.push({url,width:size});
  }
  images[src]=variants.map(v=>`${v.url} ${v.width}w`).join(', ');
}
await fs.writeFile('src/data/media-images.json',JSON.stringify(images,null,2));
console.log(`Generated responsive sizes for ${Object.keys(images).length} original media images.`);
