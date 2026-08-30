(() => {
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
  const activateTab = (name) => {
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.panel === name));
    panels.forEach(panel => panel.hidden = panel.dataset.consolePanel !== name);
  };
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.panel)));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealTargets = document.querySelectorAll('.section, .page-hero, .intel-console, .hero-card, .sample-shell, .contact-grid');
  revealTargets.forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.cards, .outcome-grid, .why-grid, .process-line, .method-grid, .fit-grid').forEach(el => el.classList.add('stagger'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('in-view'));
  }

  if (tabs.length > 1) {
    let index = 0;
    let timer = setInterval(() => {
      index = (index + 1) % tabs.length;
      activateTab(tabs[index].dataset.panel);
    }, 5200);
    const consoleEl = document.querySelector('.intel-console');
    if (consoleEl) {
      consoleEl.addEventListener('pointerenter', () => clearInterval(timer));
    }
  }
})();