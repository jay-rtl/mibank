import {load} from 'cheerio';

export function parseMedia(source:string){
 const $=load(source);
 const intro=$('body').children('div').first().clone();
 intro.find('h2').remove();
 const items=$('.content-cell').toArray().map((element,index)=>{
  const cell=$(element).clone();
  cell.find('.content-group').remove();
  const image=cell.find('img').first();
  const picture=image.length?{src:image.attr('src')!,alt:image.attr('alt')||'',width:Number(image.attr('width')),height:Number(image.attr('height')),href:image.closest('a').attr('href')||''}:null;
  cell.find('img,br').remove();
  cell.find('p,a,strong,span').toArray().reverse().forEach(el=>{if(!$(el).text().trim())$(el).remove()});
  const text=cell.text().replace(/\s+/g,' ').trim();
  const years=text.match(/\b20\d{2}\b/g);
  const year=years?.at(-1)||'Other';
  const href=cell.find('a[href]').first().attr('href')||picture?.href||'';
  return {id:`media-story-${index+1}`,html:cell.html()||'',text,year,image:picture,href};
 }).filter(item=>item.text);
 return {intro:intro.html()||'',items,featured:items[0],archive:items.slice(1),years:[...new Set(items.slice(1).map(item=>item.year))].sort().reverse()};
}
