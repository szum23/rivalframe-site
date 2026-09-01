(()=>{
  const intel=document.querySelector('.editorial-intel');
  const canvas=document.querySelector('.editorial-canvas');
  if(!intel||!canvas)return;

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(pointer:fine)').matches;
  const status=canvas.querySelector('.desk-status span');
  const states=[
    'Scanning current market evidence',
    'Cross-checking source consistency',
    'Synthesising the pattern',
    'Decision ready for human review'
  ];

  const syncStage=()=>{
    const i=Math.max(0,Math.min(3,Number(intel.dataset.stage)||0));
    if(status)status.textContent=states[i];
    if(reduce)return;
    canvas.classList.remove('stage-shift');
    requestAnimationFrame(()=>requestAnimationFrame(()=>canvas.classList.add('stage-shift')));
  };

  new MutationObserver(syncStage).observe(intel,{attributes:true,attributeFilter:['data-stage']});
  syncStage();

  if(finePointer&&!reduce){
    let frame=0;
    const move=e=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const r=canvas.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*2;
        const y=((e.clientY-r.top)/r.height-.5)*2;
        canvas.style.setProperty('--mx',x.toFixed(3));
        canvas.style.setProperty('--my',y.toFixed(3));
      });
    };
    const reset=()=>{
      canvas.style.setProperty('--mx','0');
      canvas.style.setProperty('--my','0');
    };
    canvas.addEventListener('pointermove',move,{passive:true});
    canvas.addEventListener('pointerleave',reset,{passive:true});
  }
})();
