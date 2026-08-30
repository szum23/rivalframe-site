(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTargets = document.querySelectorAll('.section, .page-hero, .hero-card, .proofbar, .sample-shell, .contact-grid');
  revealTargets.forEach(el => el.classList.add('reveal'));

  document.querySelectorAll('.cards, .method-grid, .proofbar').forEach(el => el.classList.add('stagger'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

  if (motionOK) {
    window.addEventListener('pointermove', e => {
      document.body.style.setProperty('--mx', `${e.clientX}px`);
      document.body.style.setProperty('--my', `${e.clientY}px`);
    }, { passive: true });

    document.querySelectorAll('.hero-card, .card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-y * 2.4).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }
})();
