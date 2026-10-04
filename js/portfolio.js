(() => {
  'use strict';
  const nav = document.getElementById('mainNav');
  const menu = document.querySelector('.menu-toggle');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  const cards = [...document.querySelectorAll('.project-card')];
  const groups = [...document.querySelectorAll('.projects-group')];
  const tabs = [...document.querySelectorAll('.showcase-tab')];
  const featured = document.querySelector('.featured-project');
  const more = document.getElementById('moreProjects');
  const count = document.querySelector('.project-count');
  const search = document.getElementById('projectSearch');
  const empty = document.querySelector('.project-empty');
  function matchesProject(card) {
    const categoryMatches = filter === 'all' || card.dataset.filters.split(/\s+/).includes(filter);
    const query = search.value.trim().toLowerCase();
    return categoryMatches && `${card.dataset.title} ${card.dataset.desc} ${card.dataset.stack} ${card.dataset.type}`.toLowerCase().includes(query);
  }
  let filter = 'all';
  let expanded = false;
  function renderProjects() {
    let shown = 0;
    const matching = cards.filter(matchesProject);
    cards.forEach(card => { card.hidden = !matching.includes(card) || (!expanded && shown >= 6); if (!card.hidden) shown++; });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll('.project-card')].some(card => !card.hidden); });
    featured.hidden = !matchesProject(featured);
    empty.hidden = matching.length > 0;
    const ar = window.siteI18n?.language === 'ar';
    const number = value => window.siteI18n?.format(value) || value;
    count.textContent = ar ? `${number(shown)} من ${number(matching.length)} مشروع · كل مشروع له هدف` : `${shown} of ${matching.length} projects · built with purpose`;
    more.hidden = matching.length <= 6;
    more.textContent = ar ? (expanded ? 'اعرض مشاريع أقل ↑' : `شوف كل المشاريع (${number(matching.length)}) ↓`) : (expanded ? 'Show fewer projects ↑' : `Explore all ${matching.length} projects ↓`);
    more.setAttribute('aria-expanded', String(expanded));
  }
  tabs.forEach(tab => tab.addEventListener('click', () => {
    filter = tab.dataset.filter;
    expanded = false;
    tabs.forEach(button => { button.classList.toggle('active', button === tab); button.setAttribute('aria-pressed', String(button === tab)); });
    renderProjects();
  }));
  search.addEventListener('input', () => { expanded = false; renderProjects(); });
  document.querySelectorAll('[data-show-techpack]').forEach(link => link.addEventListener('click', () => {
    search.value = '';
    tabs.find(tab => tab.dataset.filter === 'techpack').click();
  }));
  more.addEventListener('click', () => {
    expanded = !expanded;
    renderProjects();
    if (!expanded) document.querySelector('.showcase-tabs').scrollIntoView({ block: 'start' });
    else { const firstNew = cards.filter(card => !card.hidden)[6]; if (firstNew) firstNew.querySelector('button').focus({ preventScroll: true }); }
  });
  renderProjects();
  window.addEventListener('site:languagechange', renderProjects);

  const modal = document.getElementById('caseStudyModal');
  const dialog = modal.querySelector('[role="dialog"]');
  const closeButton = modal.querySelector('button[data-close-case-study]');
  let previousFocus;
  const background = [...document.body.children].filter(el => el !== modal && el.tagName !== 'SCRIPT');
  function closeModal() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open');
    background.forEach(el => { el.inert = false; });
    previousFocus?.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-open-case-study]').forEach(button => button.addEventListener('click', () => {
    const source = [...document.querySelectorAll('[data-project-id]')].find(el => el.dataset.projectId === button.dataset.projectTarget);
    if (!source) return;
    previousFocus = button;
    ['title','type','desc','problem','role','solution'].forEach(key => { modal.querySelector(`[data-modal-${key}]`).textContent = source.dataset[key] || ''; });
    ['features','impact','stack'].forEach(key => {
      const target = modal.querySelector(`[data-modal-${key}]`);
      target.replaceChildren(...(source.dataset[key] || '').split('|').filter(Boolean).map(text => { const span = document.createElement('span'); span.textContent = text; return span; }));
    });
    const image = modal.querySelector('[data-modal-image]'); image.src = source.dataset.image; image.alt = `${source.dataset.title} project`;
    const github = modal.querySelector('[data-modal-github]'); github.hidden = !source.dataset.github;
    if (source.dataset.github) github.href = source.dataset.github; else github.removeAttribute('href');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
    background.forEach(el => { el.inert = true; });
    dialog.scrollTop = 0; closeButton.focus({ preventScroll: true });
  }));
  modal.querySelectorAll('[data-close-case-study]').forEach(button => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button,a[href]')].filter(el => !el.hidden);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const topButton = document.getElementById('scrollTop');
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  const progress = document.querySelector('.reading-progress');
  function updateScroll() {
    topButton.hidden = window.scrollY < 600;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id], #hero').forEach(section => observer.observe(section));
  }
})();
