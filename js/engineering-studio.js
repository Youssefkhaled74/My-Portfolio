(() => {
  'use strict';
  const visual = document.querySelector('.system-visual');
  const run = document.querySelector('.run-system');
  const status = document.querySelector('.request-status');
  const nodes = [...visual.querySelectorAll('.system-node')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const stages = [
    { node: 0, text: '01 / React UI sends a request.' },
    { node: 1, text: '02 / Application services validate and process it.' },
    { node: 2, text: '03 / The database reads and persists data.' },
    { node: 3, text: '04 / Background jobs handle follow-up work.' }
  ];
  function reset() { nodes.forEach(node => node.classList.remove('request-active')); }
  run.addEventListener('click', () => {
    clearTimeout(timer);
    reset();
    run.disabled = true;
    function step(index) {
      reset();
      if (index === stages.length) {
        status.textContent = '200 OK / Flow complete. Built to work together.';
        run.disabled = false;
        return;
      }
      nodes[stages[index].node].classList.add('request-active');
      status.textContent = stages[index].text;
      timer = setTimeout(() => step(index + 1), reduced.matches ? 180 : 850);
    }
    step(0);
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('studio-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('section .section-intro, .project-card, .capability-card, .note-card').forEach(el => {
      el.classList.add('studio-reveal'); observer.observe(el);
    });
  }
})();
