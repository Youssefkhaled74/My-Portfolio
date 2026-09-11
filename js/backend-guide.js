(() => {
  'use strict';

  const lessons = [...document.querySelectorAll('.lesson')];
  const ids = lessons.map(lesson => lesson.id);
  const storageKey = 'yk-backend-guide-v1';
  const checks = [...document.querySelectorAll('[data-complete]')];
  const number = value => value.toLocaleString('ar-EG');
  const storageNote = document.getElementById('storageNote');
  let completed = new Set();
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter(id => ids.includes(id)));
  } catch {
    storageAvailable = false;
  }

  function renderProgress(announce = false) {
    checks.forEach(check => { check.checked = completed.has(check.dataset.complete); });
    document.querySelectorAll('[data-done]').forEach(mark => { mark.hidden = !completed.has(mark.dataset.done); });
    document.getElementById('learningProgress').value = completed.size;
    document.getElementById('progressText').textContent = `${number(completed.size)} / ${number(ids.length)}`;
    const next = ids.find(id => !completed.has(id));
    const resume = document.getElementById('continueReading');
    resume.href = next ? `#${next}` : '#practice';
    resume.textContent = next ? (completed.size ? 'كمّل أول محور لسه ما راجعتوش ←' : 'ابدأ أول محور ←') : 'راجعت كل المحاور. جرّب المشروع ←';
    if (!storageAvailable) storageNote.textContent = 'الحفظ مش متاح في المتصفح ده. تقدر تتابع هنا، لكن التقدّم ممكن مايفضلش بعد ما تقفل الصفحة.';
    if (announce) document.getElementById('progressAnnouncement').textContent = `تقدّم المراجعة: ${number(completed.size)} من ${number(ids.length)}.`;
  }

  checks.forEach(check => {
    check.closest('label').hidden = false;
    check.addEventListener('change', () => {
      if (check.checked) completed.add(check.dataset.complete);
      else completed.delete(check.dataset.complete);
      try { localStorage.setItem(storageKey, JSON.stringify([...completed])); }
      catch { storageAvailable = false; }
      renderProgress(true);
    });
  });
  document.querySelector('.progress-panel').hidden = false;
  renderProgress();

  // Normalize common Arabic spelling variations, diacritics, and tatweel for lookup.
  const normalize = text => text.toLowerCase().normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
  const cards = [...document.querySelectorAll('.roadmap-card')];
  const filters = [...document.querySelectorAll('button[data-category]')];
  const search = document.getElementById('topicSearch');
  const status = document.getElementById('searchStatus');
  let category = 'all';
  function filterTopics() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const haystack = normalize(`${card.dataset.search} ${card.dataset.category}`);
      card.hidden = !(category === 'all' || card.dataset.category === category) || !words.every(word => haystack.includes(word));
      if (!card.hidden) visible++;
    });
    status.hidden = false;
    status.textContent = visible ? `عدد المحاور المطابقة: ${number(visible)}. المحتوى الكامل موجود تحت للمراجعة.` : 'مفيش محور مطابق. جرّب كلمة تانية أو اختار «كل المحاور». المحتوى الكامل موجود تحت.';
  }
  document.querySelector('.roadmap-tools').hidden = false;
  search.addEventListener('input', filterTopics);
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    filterTopics();
  }));

  function openLinkedLesson() {
    const lesson = lessons.find(item => `#${item.id}` === location.hash);
    if (lesson) lesson.querySelector('.lesson-details').open = true;
  }
  openLinkedLesson();
  window.addEventListener('hashchange', openLinkedLesson);
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const lesson = lessons.find(item => `#${item.id}` === link.hash);
    if (lesson) lesson.querySelector('.lesson-details').open = true;
  }));

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('[data-toc]')];
    const observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      if (!entering.length) return;
      const current = entering[0].target.id;
      links.forEach(link => {
        if (link.dataset.toc === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    lessons.forEach(lesson => observer.observe(lesson));
  }

  // Keep the saved reading view intact after printing all lessons and answers.
  let printState;
  function preparePrint() {
    if (printState) return;
    printState = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
    printState.forEach(([detail]) => { detail.open = true; });
  }
  function restorePrint() {
    if (!printState) return;
    printState.forEach(([detail, open]) => { detail.open = open; });
    printState = undefined;
  }
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restorePrint);
  const printButton = document.getElementById('printGuide');
  printButton.hidden = false;
  printButton.addEventListener('click', () => { preparePrint(); window.print(); });
})();
