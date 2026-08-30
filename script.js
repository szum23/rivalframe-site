(() => {
  // Load the shared premium design layer on every page.
  if (!document.querySelector('link[href="app.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'app.css';
    document.head.appendChild(link);
  }

  const runtimeStyle = document.createElement('style');
  runtimeStyle.textContent = `
    .rf-progress{position:fixed;left:0;right:0;top:0;height:3px;z-index:9999;transform-origin:left center;transform:scaleX(0);background:linear-gradient(90deg,#4767d7,#d9795f,#5d8f91);box-shadow:0 0 12px rgba(71,103,215,.22);pointer-events:none}
    .console-tab[aria-selected="true"]{position:relative}.console-tab[aria-selected="true"]:after{content:"";position:absolute;left:22%;right:22%;bottom:3px;height:2px;border-radius:99px;background:linear-gradient(90deg,#4767d7,#d9795f)}
  `;
  document.head.appendChild(runtimeStyle);

  // Slim scroll-progress line: useful orientation, not decoration.
  const progress = document.createElement('div');
  progress.className = 'rf-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const tabs = [...document.querySelectorAll('.console-tab')];
  const panels = [...document.querySelectorAll('[data-console-panel]')];
  const activateTab = name => {
    tabs.forEach(tab => {
      const active = tab.dataset.panel === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.consolePanel !== name; });
  };
  if (tabs.length) activateTab(tabs[0].dataset.panel);
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.panel)));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealTargets = document.querySelectorAll('.section, .page-hero, .intel-console, .hero-card, .sample-shell, .contact-grid, .pricing-table, .legal');
  revealTargets.forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.cards, .outcome-grid, .why-grid, .process-line, .method-grid, .fit-grid, .report-kpis').forEach(el => el.classList.add('stagger'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('in-view'));
  }

  if (tabs.length > 1) {
    let index = 0;
    let timer;
    const startRotation = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        index = (index + 1) % tabs.length;
        activateTab(tabs[index].dataset.panel);
      }, 3900);
    };
    startRotation();
    const consoleEl = document.querySelector('.intel-console');
    if (consoleEl) {
      consoleEl.addEventListener('pointerenter', () => clearInterval(timer));
      consoleEl.addEventListener('pointerleave', startRotation);
    }
    tabs.forEach((tab, i) => tab.addEventListener('click', () => { index = i; startRotation(); }));
  }
})();