(() => {
  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link'); link.rel='stylesheet'; link.href=href; document.head.appendChild(link);
  };
  ['app.css','motion.css','cinematic.css'].forEach(ensureStylesheet);

  const progress=document.createElement('div');progress.className='rf-progress';progress.setAttribute('aria-hidden','true');Object.assign(progress.style,{position:'fixed',left:'0',right:'0',top:'0',height:'4px',zIndex:'9999',transformOrigin:'left center',transform:'scaleX(0)',background:'linear-gradient(90deg,#4767d7,#d9795f,#5d8f91)',pointerEvents:'none'});document.body.appendChild(progress);

  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const o=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(o));toggle.textContent=o?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));}
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navShell=document.querySelector('.nav-shell');

  if(!reduceMotion&&!document.querySelector('.motion-orb'))['one','two','three'].forEach(name=>{const orb=document.createElement('div');orb.className=`motion-orb ${name}`;orb.setAttribute('aria-hidden','true');document.body.appendChild(orb)});

  const tabs=[...document.querySelectorAll('.console-tab')],panels=[...document.querySelectorAll('[data-console-panel]')];
  const activateTab=name=>{tabs.forEach(tab=>{const a=tab.dataset.panel===name;tab.classList.toggle('active',a);tab.setAttribute('aria-selected',String(a))});panels.forEach(panel=>{const a=panel.dataset.consolePanel===name;panel.hidden=!a;if(a&&!reduceMotion){panel.classList.remove('console-panel-enter');void panel.offsetWidth;panel.classList.add('console-panel-enter')}})};
  if(tabs.length){activateTab(tabs[0].dataset.panel);tabs.forEach(t=>t.addEventListener('click',()=>activateTab(t.dataset.panel)))}

  const revealTargets=document.querySelectorAll('.section,.page-hero,.intel-console,.hero-card,.sample-shell,.contact-grid,.pricing-table,.legal,.report-preview,.compare-box,.rf-editorial,.rf-cta-band');
  revealTargets.forEach(el=>el.classList.add('reveal','rf-cinematic'));
  document.querySelectorAll('.cards,.outcome-grid,.why-grid,.process-line,.method-grid,.fit-grid,.report-kpis').forEach(el=>el.classList.add('stagger'));
  if(reduceMotion){document.querySelectorAll('.reveal,.stagger').forEach(el=>el.classList.add('in-view'))}else if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('in-view');observer.unobserve(entry.target)}),{threshold:.08,rootMargin:'0px 0px -28px 0px'});document.querySelectorAll('.reveal,.stagger').forEach(el=>observer.observe(el));}

  if(!reduceMotion&&tabs.length>1){let index=0,timer;const startRotation=()=>{clearInterval(timer);timer=setInterval(()=>{index=(index+1)%tabs.length;activateTab(tabs[index].dataset.panel)},3400)};startRotation();}

  document.querySelectorAll('.button,.nav-cta').forEach(el=>{el.addEventListener('pointerdown',()=>el.classList.add('pressed'));['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>el.classList.remove('pressed')))});

  const storyCards=[...document.querySelectorAll('.rf-story-card')];
  const storyDots=[...document.querySelectorAll('.rf-story-progress i')];
  const updateStory=()=>{
    if(!storyCards.length)return;
    let active=0,best=Infinity;
    storyCards.forEach((card,i)=>{const r=card.getBoundingClientRect();const d=Math.abs((r.top+r.height/2)-innerHeight*.55);if(d<best){best=d;active=i}});
    storyCards.forEach((card,i)=>card.classList.toggle('active',i===active));
    storyDots.forEach((dot,i)=>dot.classList.toggle('active',i<=active));
  };

  const heroText=document.querySelector('.hero-grid > div:first-child'),consoleEl=document.querySelector('.intel-console'),report=document.querySelector('.report-preview'),process=document.querySelector('.process-line');
  if(heroText)heroText.classList.add('rf-parallax');if(consoleEl)consoleEl.classList.add('rf-parallax');if(report)report.classList.add('rf-parallax');if(process)process.classList.add('rf-progressive');

  let ticking=false;
  const animateScroll=()=>{
    const y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.transform=`scaleX(${Math.min(1,y/max)})`;navShell?.classList.toggle('scrolled',y>22);
    if(!reduceMotion){updateStory();if(report){const r=report.getBoundingClientRect();const d=r.top+r.height/2-innerHeight/2;report.style.setProperty('--rf-parallax-y',`${Math.max(-45,Math.min(45,d*-.05))}px`)}document.querySelectorAll('.rf-cinematic').forEach(section=>{const r=section.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));section.style.setProperty('--rf-line',p.toFixed(3))});}
    ticking=false;
  };
  const requestTick=()=>{if(ticking)return;ticking=true;requestAnimationFrame(animateScroll)};
  addEventListener('scroll',requestTick,{passive:true});addEventListener('resize',requestTick,{passive:true});requestTick();
})();