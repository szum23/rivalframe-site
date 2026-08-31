(()=>{
  if(!document.querySelector('link[href="polish.css"]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='polish.css';document.head.appendChild(l);
  }
  if(!document.querySelector('link[rel="manifest"]')){
    const m=document.createElement('link');m.rel='manifest';m.href='site.webmanifest';document.head.appendChild(m);
  }
  if(!document.querySelector('script[src="analytics.js"]')){
    const a=document.createElement('script');a.src='analytics.js';a.async=true;document.head.appendChild(a);
  }
  const p=document.querySelector('.v2-progress');
  const intel=document.querySelector('.hero-intel');
  const tabs=[...document.querySelectorAll('[data-stage-btn]')];
  const method=[...document.querySelectorAll('[data-method-step]')];
  const bar=document.querySelector('.method-progress i');
  const reveal=[...document.querySelectorAll('[data-reveal]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track=(event,props={})=>{try{window.posthog?.capture?.(event,props)}catch{}};
  let stage=0,timer;
  const setStage=(i,source='auto')=>{
    stage=i;intel?.setAttribute('data-stage',String(i));tabs.forEach((b,n)=>b.classList.toggle('active',n===i));
    if(source==='click')track('intelligence_stage_selected',{stage:['signal','evidence','implication','decision'][i]});
  };
  const rotate=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>setStage((stage+1)%4),3600)};
  tabs.forEach((b,i)=>b.addEventListener('click',()=>{setStage(i,'click');rotate()}));
  setStage(0);rotate();

  if('IntersectionObserver'in window&&!reduce){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.13,rootMargin:'0px 0px -6% 0px'});
    reveal.forEach(el=>io.observe(el));
  }else reveal.forEach(el=>el.classList.add('revealed'));

  if(!document.body.classList.contains('subpage')){
    const mobile=document.createElement('div');
    mobile.className='mobile-brief-cta';
    mobile.innerHTML='<span><strong>One question. One decision.</strong>24-hour pilot · €79</span><a href="contact.html">Start brief →</a>';
    document.body.appendChild(mobile);
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest('a');if(!a)return;
    const href=a.getAttribute('href')||'';
    if(href.includes('contact.html')||href==='#brief-form')track('cta_clicked',{label:(a.textContent||'').trim().slice(0,80),page:location.pathname||'/'});
    if(href.includes('sample.html'))track('sample_report_opened',{page:location.pathname||'/'});
  });

  const fired=new Set();
  const onScroll=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=Math.min(1,scrollY/max);
    if(p)p.style.transform=`scaleX(${progress})`;
    document.body.classList.toggle('is-scrolled',scrollY>20);
    document.body.classList.toggle('cta-ready',scrollY>Math.min(520,innerHeight*.7));
    [50,75,90].forEach(n=>{if(progress>=n/100&&!fired.has(n)){fired.add(n);track('scroll_depth_reached',{percent:n,page:location.pathname||'/'})}});
    let active=0;method.forEach((el,i)=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*.6)active=i});
    method.forEach((el,i)=>el.classList.toggle('active',i===active));if(bar)bar.style.width=`${25*(active+1)}%`;
  };
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
})();
