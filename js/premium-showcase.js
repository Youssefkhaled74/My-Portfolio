(function(){
  const projects = Array.from(document.querySelectorAll('[data-project-row]'));
  const feature = document.querySelector('[data-project-feature]');
  const tabs = Array.from(document.querySelectorAll('[data-filter]'));
  const rows = Array.from(document.querySelectorAll('[data-kind]'));
  function activate(row){
    projects.forEach(p=>p.classList.remove('active'));
    row.classList.add('active');
    if(!feature) return;
    feature.querySelector('img').src = row.dataset.image;
    feature.querySelector('img').alt = row.dataset.title + ' preview';
    feature.querySelector('[data-title]').textContent = row.dataset.title;
    feature.querySelector('[data-desc]').textContent = row.dataset.desc;
    feature.querySelector('[data-type]').textContent = row.dataset.kind === 'evyx' ? 'Evyx Product' : 'Freelance Build';
    feature.querySelector('[data-impact]').innerHTML = row.dataset.impact.split('|').map(x=>`<span>${x}</span>`).join('');
    feature.querySelector('[data-stack]').innerHTML = row.dataset.stack.split('|').map(x=>`<span>${x}</span>`).join('');
  }
  projects.forEach(row=>row.addEventListener('click',()=>activate(row)));
  if(projects[0]) activate(projects[0]);
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active');
    const filter = tab.dataset.filter;
    rows.forEach(row=>{ row.style.display = filter === 'all' || row.dataset.kind === filter ? '' : 'none'; });
    const first = rows.find(row=>row.style.display !== 'none'); if(first) activate(first);
  }));
  const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.15});
  document.querySelectorAll('.reveal-up').forEach(el=>io.observe(el));
  document.querySelectorAll('.freelance-card,.project-feature').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      if(window.innerWidth<900) return;
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
})();
