import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import '../styles/scroll-motion.css';

type Scene={root:HTMLElement;timeline:gsap.core.Timeline;nodes:Set<HTMLElement>;finished:boolean};
const textMask='inset(0% -2% 100% -2%)';
const textOpen='inset(-12% -2% -12% -2%)';
const imageOpen='inset(0% 0% 0% 0%)';

/** Scroll-linked enhancement only: static HTML/CSS never hides the content. */
export function initScrollReveals(){
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  let started=false;
  const start=()=>{
    if(started)return;
    started=true;
    media.add({wide:'(min-width:521px)',narrow:'(max-width:520px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
      if(context.conditions?.reduce)return;
      const narrow=Boolean(context.conditions?.narrow);
      const lift=narrow?28:46;
      const scenes:Scene[]=[];
      const frames=new Set<HTMLElement>();
      const claimed=new Set<Element>();
      const masks=CSS.supports('clip-path','inset(0%)');
      let active=true;
      const query=(selector:string,root:ParentNode=document)=>[...root.querySelectorAll<HTMLElement>(selector)];
      const refresh=gsap.delayedCall(.12,()=>{if(active)ScrollTrigger.refresh();}).pause();
      const scheduleRefresh=()=>refresh.restart(true);
      const frame=(el:HTMLElement)=>{el.classList.add('scroll-motion-frame');frames.add(el);};
      const create=(root:HTMLElement,kind:string,trigger:HTMLElement=root,end='45%'):Scene|undefined=>{
        // Preserve the current reading position and first-paint/LCP content.
        if(trigger.getBoundingClientRect().top<innerHeight*.9||root.contains(document.activeElement))return;
        const nodes=new Set<HTMLElement>();
        const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
          trigger,start:'clamp(top 94%)',end:`clamp(top ${end})`,scrub:1.5,
          invalidateOnRefresh:true,
          onRefresh:self=>{root.dataset.scrollStart=String(self.start);root.dataset.scrollEnd=String(self.end);},
          onToggle:self=>nodes.forEach(node=>{node.style.willChange=self.isActive?'transform,clip-path':'';})
        }});
        root.dataset.scrollScene=kind;root.dataset.scrollScrub='1.5';
        const scene={root,timeline,nodes,finished:false};scenes.push(scene);return scene;
      };
      const text=(scene:Scene,el:HTMLElement,at=0,heading=true)=>{
        scene.nodes.add(el);claimed.add(el);
        scene.timeline.fromTo(el,{y:heading?lift*.65:lift*.4,...(masks&&heading?{clipPath:textMask}:{})},
          {y:0,...(masks&&heading?{clipPath:textOpen}:{}),duration:.9},at);
      };
      const image=(scene:Scene,el:HTMLElement,at=0,photo=false)=>{
        scene.nodes.add(el);claimed.add(el);frame(el);
        scene.timeline.fromTo(el,{y:lift,scale:photo ? .965 : .985,...(masks?{clipPath:photo?'inset(12% 6% 12% 6%)':'inset(0% 0% 32% 0%)'}:{})},
          {y:0,scale:1,...(masks?{clipPath:imageOpen}:{}),duration:1.35},at);
        if(photo){const img=el.querySelector<HTMLElement>('img');if(img){scene.nodes.add(img);scene.timeline.fromTo(img,{'--scroll-photo-scale':1.065},{'--scroll-photo-scale':1,duration:1.65},at);}}
      };
      const textGroup=(root:HTMLElement,selector:string,kind='editorial',end='48%')=>{
        const children=query(selector,root);if(!children.length)return;
        const scene=create(root,kind,children[0],end);if(!scene)return;
        children.forEach((el,i)=>text(scene,el,i*.13,!el.matches('p')));
      };
      const cards=(container:HTMLElement,cardSelector:string,artSelector:string,textSelector:string,photo=false)=>{
        const items=query(cardSelector,container);
        const groups=narrow?items.map(item=>[item]):[items];
        for(const group of groups){
          if(!group.length)continue;
          const root=narrow?group[0]:container;const scene=create(root,'cards',root,narrow?'40%':'32%');if(!scene)continue;
          group.forEach((item,i)=>{
            const art=item.querySelector<HTMLElement>(artSelector);if(art)image(scene,art,i*.18,photo);
            query(textSelector,item).forEach((el,j)=>text(scene,el,.28+i*.18+j*.1));
          });
        }
      };
      // Homepage: distinct editorial, image and staggered-card sequences.
      query('.cinema-mission').forEach(root=>textGroup(root,':scope > .cinema-kicker,:scope > h2,:scope > p,:scope > .cinema-link'));
      query('.cinema-products').forEach(root=>cards(root,'.cinema-product','.cinema-product-art',':scope > .cinema-kicker,:scope > h3,:scope > .cinema-product-cta'));
      query('.cinema-section-heading').forEach(root=>textGroup(root,'.cinema-kicker,h2,:scope > .cinema-link'));
      query('.cinema-report-grid').forEach(root=>cards(root,'.cinema-report','.cinema-report-cover',':scope > h3,:scope > span'));
      query('.cinema-film-grid').forEach(root=>cards(root,'.cinema-film','.cinema-film-photo',':scope > h3',true));
      query('.cinema-story-grid,.cinema-hibiscus-inner,.cinema-news').forEach(root=>{
        const photo=root.querySelector<HTMLElement>('.cinema-story-image,.cinema-hibiscus-art,.cinema-news-art');
        const copy=root.querySelector<HTMLElement>('.cinema-story-copy,:scope > div');
        if(!photo||!copy)return;
        if(narrow){
          const photoScene=create(photo,'image',photo,'40%');if(photoScene)image(photoScene,photo,0,!root.matches('.cinema-hibiscus-inner'));
          textGroup(copy,':scope > .cinema-kicker,:scope > h2,:scope > p,:scope > a');
        }else{
          const scene=create(root,'section',root,'28%');if(!scene)return;
          image(scene,photo,0,!root.matches('.cinema-hibiscus-inner'));
          query(':scope > .cinema-kicker,:scope > h2,:scope > p,:scope > a',copy).forEach((el,i)=>text(scene,el,.18+i*.14,!el.matches('p')));
        }
      });
      // Interior product rows: preserve their two-column layout and existing links.
      query('.all-products').forEach(container=>{
        const rows=query('.product-row',container);const size=narrow?1:2;
        for(let i=0;i<rows.length;i+=size){
          const group=rows.slice(i,i+size);const scene=create(group[0],'rows',group[0],'60%');if(!scene)continue;
          group.forEach((row,j)=>{const img=row.querySelector<HTMLElement>('img');if(img){scene.nodes.add(img);scene.timeline.fromTo(img,{y:24,scale:.96,...(masks?{clipPath:'inset(0% 0% 30% 0%)'}:{})},{y:0,scale:1,...(masks?{clipPath:imageOpen}:{}),duration:1},j*.16);}const title=row.querySelector<HTMLElement>('h2');if(title)text(scene,title,.15+j*.16);});
        }
      });
      query('.source-content .content-cell').filter(el=>!el.parentElement?.closest('.content-cell')).forEach(root=>{
        const scene=create(root,'archive-card',root,'48%');if(!scene)return;
        const imgs=query('img',root);imgs.forEach((img,i)=>{scene.nodes.add(img);claimed.add(img);scene.timeline.fromTo(img,{y:lift*.65,scale:.98,...(masks?{clipPath:'inset(0% 0% 25% 0%)'}:{})},{y:0,scale:1,...(masks?{clipPath:imageOpen}:{}),duration:1.2},i*.08);});
        const copy=query('p,h2,h3',root).filter(el=>!el.querySelector('img')&&!el.parentElement?.closest('p,h2,h3'));
        copy.forEach((el,i)=>text(scene,el,.2+i*.08,!el.matches('p')));
      });
      query('.source-content h2,.source-content h3,.source-content p').filter(el=>!el.closest('.content-cell')&&!el.querySelector('img')).forEach(root=>{
        const scene=create(root,'article',root,'60%');if(scene)text(scene,root,0,!root.matches('p'));
      });
      // News image and copy unfold together, while live search controls stay static.
      query('.news-feature').forEach(root=>{
        const scene=create(root,'feature',root,'38%');if(!scene)return;
        const photo=root.querySelector<HTMLElement>('.news-feature-image');if(photo)image(scene,photo,0,true);
        query('.news-feature-kicker,.news-original,.news-feature-end',root).forEach((el,i)=>text(scene,el,.2+i*.15,false));
      });
      query('.news-entry').forEach(root=>{
        const scene=create(root,'news-row',root,'65%');if(!scene)return;
        const photo=root.querySelector<HTMLElement>('.news-entry-image');if(photo)image(scene,photo);
        const copy=root.querySelector<HTMLElement>('.news-original');if(copy)text(scene,copy,.14,false);
      });
      query('.news-year-heading').forEach(root=>textGroup(root,'h3,:scope > span','year','65%'));
      query('.news-archive-heading').forEach(root=>textGroup(root,'h2,a','editorial','60%'));
      // Supporting content moves gently; map, directory buttons and forms are untouched.
      query('.cinema-product-directory,.cinema-choice,.about-links,.local-video,.directory-heading,.callout-inner,.footer-top,.footer-grid > div').forEach(root=>{
        if(claimed.has(root))return;
        const scene=create(root,'supporting',root,'58%');if(!scene)return;
        scene.nodes.add(root);scene.timeline.fromTo(root,{y:lift*.45},{y:0,duration:1});
      });
      const finish=(scene:Scene)=>{
        if(scene.finished)return;scene.finished=true;
        scene.timeline.scrollTrigger?.getTween()?.kill();
        scene.timeline.scrollTrigger?.kill(false,true);
        scene.timeline.progress(1).pause();
        gsap.set([...scene.nodes],{clearProps:'transform,clipPath,willChange,--scroll-photo-scale'});
        scene.root.dataset.scrollFinished='true';
      };
      const focus=(event:FocusEvent)=>{
        const target=event.target as Node;
        scenes.filter(scene=>scene.root.contains(target)||[...scene.nodes].some(node=>node.contains(target)||(target instanceof Element&&target.matches('a,button,summary')&&target.contains(node)))).forEach(finish);
      };
      const filter=(event:Event)=>{
        const target=event.target as HTMLElement;
        if(target.matches('#media-search')||target.closest('#media-reset')){
          scenes.filter(scene=>scene.root.closest('.newsroom')).forEach(finish);scheduleRefresh();
        }else if(target.matches('#location-search,#location-type'))scheduleRefresh();
      };
      const hash=()=>{
        let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
        const anchor=id&&document.getElementById(id);if(!anchor)return;
        const top=anchor.getBoundingClientRect().top;
        scenes.filter(scene=>anchor.contains(scene.root)&&scene.root.getBoundingClientRect().top-top<innerHeight*.8).forEach(finish);
        scheduleRefresh();
      };
      document.addEventListener('focusin',focus);
      document.addEventListener('input',filter);document.addEventListener('change',filter);document.addEventListener('click',filter);
      window.addEventListener('hashchange',hash);
      // Lazy media/fonts and expanding source artwork can alter section positions.
      const loaded=(event:Event)=>{if(event.target instanceof HTMLImageElement)scheduleRefresh();};
      document.addEventListener('load',loaded,true);
      const toggled=(event:Event)=>{if(event.target instanceof HTMLDetailsElement&&event.target.classList.contains('artwork-archive'))scheduleRefresh();};
      document.addEventListener('toggle',toggled,true);
      document.fonts.ready.then(()=>{if(active)scheduleRefresh();});
      ScrollTrigger.refresh();
      return()=>{
        active=false;refresh.kill();
        document.removeEventListener('focusin',focus);document.removeEventListener('input',filter);document.removeEventListener('change',filter);document.removeEventListener('click',filter);
        document.removeEventListener('load',loaded,true);document.removeEventListener('toggle',toggled,true);window.removeEventListener('hashchange',hash);
        frames.forEach(el=>el.classList.remove('scroll-motion-frame'));
        scenes.forEach(scene=>{delete scene.root.dataset.scrollScene;delete scene.root.dataset.scrollScrub;delete scene.root.dataset.scrollStart;delete scene.root.dataset.scrollEnd;delete scene.root.dataset.scrollFinished;});
      };
    });
  };
  if(document.querySelector('[data-welcome-intro][open]'))document.addEventListener('mibank:intro-finished',start,{once:true});else start();
}
