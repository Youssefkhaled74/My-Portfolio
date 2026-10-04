(() => {
  'use strict';
  const dictionary = window.SITE_TRANSLATIONS || [];
  const normalize = value => String(value).replace(/\s+/g, ' ').trim();
  const lookup = new Map();
  dictionary.forEach(pair => pair.forEach(text => { if (text) lookup.set(normalize(text), pair); }));
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const storageKey = 'yk-site-language';
  let language;
  try { language = new URL(location.href).searchParams.get('lang') || localStorage.getItem(storageKey); } catch {}
  if (!['en', 'ar'].includes(language)) language = document.documentElement.lang.startsWith('ar') ? 'ar' : 'en';
  const t = value => lookup.get(normalize(value))?.[language === 'ar' ? 1 : 0] || value;
  const format = value => Number(value).toLocaleString(language === 'ar' ? 'ar-EG' : 'en');
  function translateText(node) {
    const record = originalText.get(node);
    const source = record && node.nodeValue === record.last ? record.source : node.nodeValue;
    const translated = t(source);
    const next = normalize(translated) === normalize(source) ? source : `${source.match(/^\s*/)[0]}${translated}${source.match(/\s*$/)[0]}`;
    if (node.nodeValue !== next) node.nodeValue = next;
    originalText.set(node, { source, last: next });
  }
  function localize(scope = document.body) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.parentElement?.closest('script,style,pre,code,[data-no-translate],.language-switch')) translateText(node);
    });
    scope.querySelectorAll('[aria-label],[title],[placeholder],[alt],[data-project-id],meta[name="description"],meta[property="og:title"],meta[property="og:description"]').forEach(element => {
      let originals = originalAttributes.get(element);
      if (!originals) { originals = {}; originalAttributes.set(element, originals); }
      const attributes = ['aria-label','title','placeholder','alt','data-desc','data-type','data-problem','data-role','data-solution','data-features','data-impact'];
      if (element.tagName === 'META') attributes.push('content');
      attributes.forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
        const next = originals[attribute].split('|').map(t).join('|');
        if (element.getAttribute(attribute) !== next) element.setAttribute(attribute, next);
      });
    });
  }
  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#') || link.hasAttribute('download')) return;
      try {
        const url = new URL(raw, location.href);
        if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
        url.searchParams.set('lang', language);
        link.href = url.href;
      } catch {}
    });
  }
  function setLanguage(next, updateURL = true) {
    if (!['en', 'ar'].includes(next)) return;
    language = next;
    document.documentElement.lang = next === 'ar' ? 'ar-EG' : 'en';
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.language = next;
    try { localStorage.setItem(storageKey, next); } catch {}
    if (updateURL) {
      const url = new URL(location.href); url.searchParams.set('lang', next);
      history.replaceState(history.state, '', url);
    }
    localize(document.documentElement);
    document.querySelectorAll('[data-set-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setLanguage === next)));
    updateLinks();
    window.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language: next } }));
  }
  window.siteI18n = { t, format, localize, get language() { return language; }, setLanguage };
  document.querySelectorAll('[data-set-language]').forEach(button => button.addEventListener('click', () => {
    // Preserve the reader's position within the nearest content section while text reflows.
    const sections = [...document.querySelectorAll('.lesson,main > section[id],main > header[id]')];
    const anchor = sections.find(section => { const box = section.getBoundingClientRect(); return box.top <= 160 && box.bottom > 160; });
    const offset = anchor?.getBoundingClientRect().top;
    setLanguage(button.dataset.setLanguage);
    if (anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - offset, behavior: 'instant' });
  }));
  setLanguage(language, false);
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; localize(); });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
