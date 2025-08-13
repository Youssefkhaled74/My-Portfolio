document.addEventListener('DOMContentLoaded', function () {
    if (window.AOS) AOS.init({ duration: 650, once: true, easing: 'ease-out' });
    if (window.hljs) { hljs.highlightAll(); if (hljs.initLineNumbersOnLoad) hljs.initLineNumbersOnLoad(); }

    // Completed toggle
    const key = 'lecture_queues_completed_v1';
    const btn = document.getElementById('markCompletedBtn');
    const renderBtn = (done) => {
        if (!btn) return;
        btn.classList.toggle('completed', !!done);
        btn.innerHTML = done ? '<i class="fas fa-check-circle me-2"></i>Completed' : '<i class="far fa-check-circle me-2"></i>Mark as Completed';
    };
    renderBtn(localStorage.getItem(key) === '1');
    btn && btn.addEventListener('click', () => {
        const next = localStorage.getItem(key) !== '1';
        localStorage.setItem(key, next ? '1' : '0');
        renderBtn(next);
    });

    // Quiz
    const answers = { q1: 'b', q2: 'b', q3: 'a', q4: 'a', q5: 'b' };
    const quizKey = 'lecture_queues_quiz_score_v1';
    const form = document.getElementById('quizForm');
    const res = document.getElementById('quizResult');
    const submit = document.getElementById('submitQuiz');
    const showPrev = () => {
        const prev = localStorage.getItem(quizKey);
        if (prev && res) { res.textContent = `Previous score: ${prev}/5`; res.classList.add('text-info'); }
    };
    showPrev();
    submit && submit.addEventListener('click', () => {
        let s = 0;
        Object.keys(answers).forEach((k) => {
            const selected = form.querySelector(`input[name="${k}"]:checked`);
            if (selected && selected.value === answers[k]) s++;
        });
        if (res) {
            res.textContent = `Your score: ${s}/5`;
            res.classList.remove('text-info');
            res.classList.toggle('text-success', s >= 4);
            res.classList.toggle('text-warning', s === 3);
            res.classList.toggle('text-danger', s <= 2);
        }
        localStorage.setItem(quizKey, String(s));
    });
});

