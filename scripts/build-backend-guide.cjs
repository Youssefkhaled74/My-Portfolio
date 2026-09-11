// Run from any directory: node scripts/build-backend-guide.cjs
// The published page is static: readers do not need a build tool or JavaScript to read it.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/ar/backend-after-ai.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const ids = new Set();
for (const lesson of data.lessons) {
  if (!/^[a-z][a-z0-9-]*$/.test(lesson.id) || ids.has(lesson.id)) throw new Error(`Invalid or duplicate lesson id: ${lesson.id}`);
  ids.add(lesson.id);
  for (const field of ['title','english','category','summary','explanation','scenario','review','exercise','answer','takeaway']) {
    if (typeof lesson[field] !== 'string' || !lesson[field].trim()) throw new Error(`Missing ${field}: ${lesson.id}`);
  }
  if (!Array.isArray(lesson.concepts) || !Number.isFinite(lesson.minutes) || lesson.minutes <= 0) throw new Error(`Invalid metadata: ${lesson.id}`);
  if (lesson.source && !/^https:\/\//.test(lesson.source.url)) throw new Error(`Invalid source: ${lesson.id}`);
}
const n = value => Number(value).toLocaleString('ar-EG');
const categories = [...new Set(data.lessons.map(lesson => lesson.category))];
const lessonHTML = data.lessons.map((lesson, i) => `
        <article class="lesson" id="${lesson.id}" aria-labelledby="title-${lesson.id}">
          <details class="lesson-details"${i === 0 ? ' open' : ''}>
            <summary><span class="lesson-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="lesson-heading"><span class="lesson-meta">${escape(lesson.category)} <span>· ${n(lesson.minutes)} دقايق تقريبًا</span></span><h2 id="title-${lesson.id}">${escape(lesson.title)}</h2><span class="lesson-english" lang="en" dir="ltr">${escape(lesson.english)}</span></span><span class="expand-icon" aria-hidden="true">+</span></summary>
            <div class="lesson-content">
              <p class="lesson-lead">${escape(lesson.summary)}</p>
              <div class="concepts" aria-label="مصطلحات المحور">${lesson.concepts.map(term => `<bdi lang="en">${escape(term)}</bdi>`).join('')}</div>
              <h3>الفكرة ببساطة</h3><p>${escape(lesson.explanation)}</p>
              <div class="scenario"><span class="box-label">من مشروع الحجز</span><p>${escape(lesson.scenario)}</p></div>
              <h3>وإنت بتراجع كود الـAI</h3><p>${escape(lesson.review)}</p>
              <div class="exercise"><span class="box-label">وقف القراءة وجرّب</span><p>${escape(lesson.exercise)}</p><details class="answer"><summary>فكّرت؟ شوف إجابة مقترحة <span aria-hidden="true">↙</span></summary><p>${escape(lesson.answer)}</p></details></div>
              ${lesson.source ? `<p class="lesson-source">كمّل من المصدر: <a href="${escape(lesson.source.url)}" target="_blank" rel="noopener noreferrer"><bdi lang="en">${escape(lesson.source.label)}</bdi> ↗</a></p>` : '<p class="lesson-source">إطار عملي مقترح في الدليل. طبّقه على قواعد مشروعك.</p>'}
              <div class="lesson-end"><label class="completion" hidden><input type="checkbox" data-complete="${lesson.id}"><span>راجعت المحور: ${escape(lesson.takeaway)}</span></label><a class="lesson-permalink" href="#${lesson.id}" aria-label="رابط مباشر: ${escape(lesson.title)}">رابط المحور ↗</a></div>
            </div>
          </details>
        </article>`).join('');
const html = `<!doctype html>
<html lang="ar-EG" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ورا الكود | أساسيات الـBackend في عصر الـAI — يوسف خالد</title>
  <meta name="description" content="دليل عملي بالمصري: إيه اللي لازم تفهمه كـBackend Developer حتى لو الـAI بيكتب الكود؟ ٨ محاور بأمثلة وتمارين ومصادر للمراجعة.">
  <meta name="theme-color" content="#173d32">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:title" content="ورا الكود — الـAI يكتب. وإنت تفهم وتقرر.">
  <meta property="og:description" content="مرجع بالمصري لأساسيات الـBackend: من فهم المشكلة لحد مراجعة الكود وتشغيل السيستم. أمثلة وتمارين وروابط مباشرة لكل محور.">
  <meta name="twitter:card" content="summary">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;450;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link href="../css/backend-guide.css" rel="stylesheet">
  <script src="../js/backend-guide.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#reading">عدّي للمحتوى</a>
  <header class="guide-nav"><div class="wrap nav-inner"><a class="guide-brand" href="#top"><span class="brand-icon" dir="ltr" lang="en">yk.</span><span>ورا الكود<small>مساحة تعلّم مع يوسف خالد</small></span></a><nav aria-label="التنقل الرئيسي"><a href="#roadmap">خريطة التعلّم</a><a href="index.html">كل المقالات</a><a class="portfolio-link" href="../index.html">البورتفوليو <span aria-hidden="true">↖</span></a></nav></div></header>
  <main id="top">
    <section class="guide-hero"><div class="wrap hero-layout"><div><p class="eyebrow"><span></span> نفهم الأساس. ونبني عليه.</p><h1>الـ<span lang="en">AI</span> يكتب كود.<br>إنت <em>فاهم اللي وراه؟</em></h1><p class="hero-description">الكود ممكن يتكتب في ثواني. بس مين هيحدّد المطلوب، ويحمي الداتا، ويعرف الغلط لما يحصل؟ هنا بنتعلّم الـBackend من زاوية الفهم والقرار، بالمصري ومن غير تعقيد.</p><div class="hero-actions"><a class="button button-lime" href="#requirements">نبدأ من الأساس <span aria-hidden="true">↙</span></a><a class="button button-outline" href="#roadmap">شوف خريطة التعلّم</a></div><div class="author"><img src="../assets/images/youssef-khaled-logo.png" alt="" width="38" height="38"><div>يوسف خالد <span>· Backend Engineer</span><small>${n(data.lessons.length)} محاور · أمثلة Laravel · قراءة وتطبيق على مهلك</small></div></div></div><div class="thinking-card"><div class="thinking-top"><span>من كتابة الكود ← لفهم السيستم</span><span aria-hidden="true">✳</span></div><div class="thought-row"><span>01</span><div>افهم المطلوب<small>إيه المشكلة؟ وإيه حدود الحل؟</small></div><span aria-hidden="true">↙</span></div><div class="thought-row"><span>02</span><div>اختار وصمّم<small>إيه اللي ممكن يغلط؟ وليه الحل ده؟</small></div><span aria-hidden="true">↙</span></div><div class="thought-row"><span>03</span><div>اختبر وراجع<small>فين الدليل إن السلوك صح؟</small></div><span aria-hidden="true">↙</span></div><p>الهدف إنك تقدر تشرح قرارك.<br><strong>حتى لو مش إنت اللي كتبت كل سطر.</strong></p></div></div></section>
    <div class="guide-strip"><div class="wrap"><span><strong>${n(data.lessons.length)}</strong> محاور أساسية</span><span><strong>١</strong> مشروع بيربط الأفكار</span><span>شرح بالمصري · مصطلحات بالإنجليزي</span><span>مرجع ترجع له وقت ما تحتاج</span></div></div>
    <section class="wrap roadmap" id="roadmap"><div class="section-heading"><div><p class="eyebrow">ابدأ من هنا</p><h2>خريطة صغيرة. أساس يفرق.</h2></div><p>لو بدأت تتعلّم PHP أو Laravel، امشي بالترتيب.<br>ولو بتراجع حاجة معينة، ادخل على محورها مباشرة.</p></div><div class="roadmap-tools" hidden><div class="search-wrap"><label for="topicSearch">بتدور على إيه؟</label><input type="search" id="topicSearch" placeholder="جرّب: صلاحيات، SQL، اختبارات…" autocomplete="off"></div><div class="topic-filters" role="group" aria-label="تصفية محاور التعلّم"><button type="button" data-category="all" aria-pressed="true">كل المحاور</button>${categories.map(category => `<button type="button" data-category="${escape(category)}" aria-pressed="false">${escape(category)}</button>`).join('')}</div></div><div class="roadmap-grid">${data.lessons.map((lesson, i) => `<a class="roadmap-card" href="#${lesson.id}" data-category="${escape(lesson.category)}" data-search="${escape([lesson.title,lesson.english,lesson.summary,...lesson.concepts,lesson.id === 'data' ? 'SQL database داتا قاعدة بيانات' : '',lesson.id === 'production' ? 'اختبارات testing تشغيل' : ''].join(' '))}"><span class="roadmap-number">${String(i+1).padStart(2,'0')}<span class="done-mark" data-done="${lesson.id}" hidden>راجعت ✓</span></span><h3>${escape(lesson.title)}</h3><span class="roadmap-bottom"><bdi lang="en">${escape(lesson.english)}</bdi><span aria-hidden="true">↙</span></span></a>`).join('')}</div><p id="searchStatus" class="search-status" role="status" hidden></p></section>
    <div class="wrap reading-layout" id="reading"><aside class="reading-sidebar" aria-label="فهرس الدليل"><div class="sidebar-box"><p class="eyebrow">على مكتبك</p><h2>فهرس الدليل</h2><nav aria-label="محاور الدليل">${data.lessons.map((lesson,i) => `<a href="#${lesson.id}" data-toc="${lesson.id}"><span>${String(i+1).padStart(2,'0')}</span>${escape(lesson.title)}</a>`).join('')}<a href="#practice"><span>↙</span>اجمع اللي اتعلّمته</a></nav><div class="progress-panel" hidden><label for="learningProgress">محاور راجعتها <strong id="progressText">٠ / ${n(data.lessons.length)}</strong></label><progress id="learningProgress" max="${data.lessons.length}" value="0"></progress><p id="storageNote">التقدّم بيتحفظ على نفس المتصفح بس، ومش معناه تقييم لمستواك.</p><a href="#requirements" id="continueReading">ابدأ أول محور ←</a></div><button class="print-button" id="printGuide" type="button" hidden>اطبع الدليل أو احفظه PDF ↓</button></div></aside><div class="reading-content"><div class="reading-intro"><span class="eyebrow">طريقة استخدام الدليل</span><h2>اقرأ. جرّب. اشرحها بطريقتك.</h2><p>كل محور فيه فكرة، وموقف من مشروع حجز ورش، وسؤال تجرّب تجاوبه قبل ما تفتح الإجابة. مش لازم تخلص الكل مرة واحدة؛ اختار محور وطبّقه.</p><p class="version-note">الأمثلة بتشير لـLaravel 12.x. راجع توثيق إصدار مشروعك قبل التطبيق. آخر مراجعة للمحتوى: <time datetime="${escape(data.updated)}">١١ سبتمبر ٢٠٢٦</time>.</p></div>${lessonHTML}
      <section class="practice" id="practice"><p class="eyebrow">وصّل النقط ببعض</p><h2>مشروع واحد يختبر فهمك</h2><p>ابني API لحجز ورشة سعتها 20 مكان. استخدم الـAI في التنفيذ لو حابب، بس خليك قادر تشرح كل قرار. جرّب على داتا محلية للتعلّم.</p><ol><li>اكتب قواعد تأكيد وإلغاء الحجز، واتفق على معنى «حجز فعّال».</li><li>صمّم الجداول وعقد الـAPI، وامنع الوصول لحجوزات الآخرين.</li><li>اختبر طلبين على آخر مكان، وطلب إنشاء متكرر، وإلغاء متكرر.</li><li>ابعت إشعارًا في الخلفية، وجرّب فشل المهمة وإعادة تنفيذها.</li><li>قيس الاستعلامات، وسجّل إشارات تساعدك تتتبّع طلبًا فاشلًا.</li><li>اكتب قرارين اخترتهم وبديلًا لكل واحد وليه مااخترتوش.</li></ol><div class="practice-note"><strong>سلّم لنفسك دليل، مش مجرد Repo:</strong><p>وصف للقواعد، اختبارات لحالات الفشل، وشرح قصير للتنازلات. لو تقدر تمشي حد في رحلة الطلب من أولها لآخرها، إنت بتبني فهم تقدر تعتمد عليه.</p></div><a href="system-design-backend-foundations.html">عايز تتعمّق؟ افتح مرجع الـSystem Design ←</a></section>
      <section class="closing-note"><span class="eyebrow">نكمل تعلّم سوا</span><h2>فيه نقطة محتاجة نفكّها أكتر؟</h2><p>ابعت اقتراح موضوع أو تصحيح مع مثال أو مصدر. الأسئلة العملية هي أحسن بداية لشرح يستاهل نرجع له.</p><a class="button button-green" href="mailto:youssefblackenddev@gmail.com?subject=Backend%20learning%20topic">اقترح موضوع بالإيميل ↗</a></section>
    </div></div>
  </main>
  <footer class="wrap guide-footer"><a href="../index.html">يوسف خالد <span aria-hidden="true">↖</span></a><span>ورا الكود · نفهم، نطبّق، ونرجع نراجع.</span><a href="#top">لفوق تاني ↑</a></footer>
  <p class="sr-only" id="progressAnnouncement" role="status"></p>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'insights/backend-after-ai.html'), html);
console.log(`Built backend guide: ${data.lessons.length} lessons, ${categories.length} categories.`);
