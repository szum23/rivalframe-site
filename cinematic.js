(() => {
  const home = document.querySelector('main');
  const what = document.querySelector('#what');
  if (!home || !what) return;

  if (!document.querySelector('link[href="cinematic.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'cinematic.css';
    document.head.appendChild(link);
  }

  const story = document.createElement('section');
  story.className = 'story-shell';
  story.innerHTML = `
    <div class="wrap story-wrap">
      <div class="story-sticky">
        <div class="eyebrow">From signal to decision</div>
        <h2>Watch the intelligence build as the evidence changes.</h2>
        <p>RivalFrame is not a feed of links. The research moves through signal, buyer context, implication and action.</p>
        <div class="story-meter" aria-hidden="true"><span class="active"></span><span></span><span></span><span></span></div>
      </div>
      <div class="story-steps">
        <article class="story-step active" data-story="0"><div class="story-card"><div class="story-tag">01 / Market signal</div><h3>A competitor quietly changes the buying equation.</h3><p>Pricing moves up, feature gates shift, and the entry package becomes harder to compare.</p><div class="story-ui"><div class="story-ui-row"><span class="story-dot"></span><div><strong>Pricing package changed</strong><small>Entry threshold increased and two features moved tiers.</small></div><span class="story-score">High confidence</span></div><div class="story-ui-row"><span class="story-dot coral"></span><div><strong>Messaging unchanged</strong><small>The public promise still sounds identical to the old package.</small></div><span class="story-score">Opportunity</span></div></div></div></article>
        <article class="story-step" data-story="1"><div class="story-card"><div class="story-tag">02 / Buyer context</div><h3>The buyer pain says more than the feature grid.</h3><p>Public reviews and discussions show that faster time-to-value is becoming a stronger buying criterion.</p><div class="story-ui"><div class="story-ui-row"><span class="story-dot coral"></span><div><strong>Onboarding friction rising</strong><small>Repeated in recent buyer feedback across multiple alternatives.</small></div><span class="story-score">Repeated</span></div><div class="story-ui-row"><span class="story-dot teal"></span><div><strong>Proof matters earlier</strong><small>Broad AI claims are getting weaker without concrete evidence.</small></div><span class="story-score">Medium-high</span></div></div></div></article>
        <article class="story-step" data-story="2"><div class="story-card"><div class="story-tag">03 / Strategic implication</div><h3>The problem is not another missing feature.</h3><p>The evidence suggests the market is crowded on functionality but under-differentiated on speed, proof and clarity.</p><div class="story-ui"><div class="story-ui-row"><span class="story-dot teal"></span><div><strong>Positioning convergence</strong><small>Competitors increasingly make the same broad category promise.</small></div><span class="story-score">Material</span></div><div class="story-ui-row"><span class="story-dot"></span><div><strong>Workflow wedge available</strong><small>A narrower job appears more ownable than the category headline.</small></div><span class="story-score">Test</span></div></div></div></article>
        <article class="story-step" data-story="3"><div class="story-card"><div class="story-tag">04 / Recommended move</div><h3>Change the message before you change the roadmap.</h3><p>Test a sharper promise around faster time-to-value, move proof next to the claim, and validate response before committing engineering capacity.</p><div class="story-ui"><div class="story-ui-row"><span class="story-dot coral"></span><div><strong>Next test</strong><small>Homepage positioning experiment focused on one high-value workflow.</small></div><span class="story-score">Priority 1</span></div><div class="story-ui-row"><span class="story-dot teal"></span><div><strong>Decision</strong><small>Message first. Product change only if the evidence survives the test.</small></div><span class="story-score">Action</span></div></div></div></article>
      </div>
    </div>`;
  what.insertAdjacentElement('afterend', story);

  const steps = [...story.querySelectorAll('.story-step')];
  const bars = [...story.querySelectorAll('.story-meter span')];
  const setActive = index => {
    steps.forEach((s,i) => s.classList.toggle('active', i === index));
    bars.forEach((b,i) => b.classList.toggle('active', i === index));
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.story));
      });
    }, { threshold: .58 });
    steps.forEach(step => observer.observe(step));
  }

  const hero = document.querySelector('.hero');
  const title = hero?.querySelector('h1');
  if (hero && title && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words.map(w => `<span class="cinematic-word">${w}&nbsp;</span>`).join('');
    requestAnimationFrame(() => hero.classList.add('cinematic-ready'));
  }
})();
