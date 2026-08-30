(() => {
  // Load the shared premium design layer on every page.
  if (!document.querySelector('link[href="app.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'app.css';
    document.head.appendChild(link);
  }

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