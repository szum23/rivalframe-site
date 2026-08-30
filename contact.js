(()=>{
  const form=document.querySelector('#brief-form');
  if(!form)return;
  const endpoint='https://nwuvggcnruicvzasgfvf.supabase.co/functions/v1/submit-rivalframe-lead-v2';
  const status=document.querySelector('#form-status');
  const success=document.querySelector('#form-success');
  const successCopy=document.querySelector('#success-copy');
  const submit=form.querySelector('.submit-brief');
  let started=false;
  const track=(event,props={})=>{try{window.posthog?.capture?.(event,props)}catch{}};

  form.addEventListener('input',()=>{
    if(!started){started=true;track('lead_form_started',{page:'contact'});}
  },{passive:true});

  document.querySelectorAll('[data-select-intent]').forEach(el=>{
    el.addEventListener('click',()=>{
      const value=el.getAttribute('data-select-intent');
      const input=form.querySelector(`input[name="intent"][value="${value}"]`);
      if(input)input.checked=true;
      setTimeout(()=>form.querySelector('input[name="email"]')?.focus(),300);
      track('lead_intent_selected',{intent:value});
    });
  });

  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const intent=String(data.get('intent')||'pilot_79');
    const payload={
      intent,
      name:data.get('name'),
      email:data.get('email'),
      company:data.get('company'),
      website:data.get('website'),
      business_question:data.get('business_question'),
      competitors:data.get('competitors'),
      deadline:data.get('deadline'),
      company_fax:data.get('company_fax')
    };
    submit.disabled=true;
    submit.textContent='Sending…';
    status.textContent='Sending your question securely…';
    status.classList.remove('error');

    try{
      const res=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(body.error||'submission_failed');
      track('lead_form_submitted',{intent});
      form.querySelectorAll('input,textarea,button').forEach(el=>{if(!el.closest('#form-success'))el.disabled=true;});
      status.textContent='';
      success.hidden=false;
      if(successCopy){
        successCopy.textContent=intent==='free_check'
          ? 'RivalFrame will review the evidence trail and confirm whether there is a useful signal worth pursuing.'
          : 'RivalFrame will confirm the question is answerable, then the €79 pilot can move straight into production.';
      }
      success.scrollIntoView({behavior:'smooth',block:'nearest'});
    }catch(err){
      console.error(err);
      track('lead_form_error',{intent});
      status.textContent='The form could not be sent. Please try again, or use the email fallback below.';
      status.classList.add('error');
      submit.disabled=false;
      submit.textContent='Try again →';
    }
  });
})();
