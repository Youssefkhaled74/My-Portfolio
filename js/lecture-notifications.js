document.addEventListener('DOMContentLoaded', function () {
    if (window.AOS) AOS.init({ duration: 600, once: true, easing: 'ease-out' });
    if (window.hljs) { hljs.highlightAll(); if (hljs.initLineNumbersOnLoad) hljs.initLineNumbersOnLoad(); }

    // Completed toggle
    const key = 'lecture_notifications_completed_v1';
    const btn = document.getElementById('markCompletedBtn');
    const render = (done) => {
        if (!btn) return;
        btn.classList.toggle('completed', !!done);
        btn.innerHTML = done ? '<i class="fas fa-check-circle me-2"></i>Completed' : '<i class="far fa-check-circle me-2"></i>Mark as Completed';
    };
    render(localStorage.getItem(key) === '1');
    btn && btn.addEventListener('click', () => {
        const next = localStorage.getItem(key) !== '1';
        localStorage.setItem(key, next ? '1' : '0');
        render(next);
    });

    // Quiz
    const answers = { q1: 'b', q2: 'b', q3: 'a', q4: 'a', q5: 'b' };
    const quizKey = 'lecture_notifications_quiz_score_v1';
    const form = document.getElementById('quizForm');
    const result = document.getElementById('quizResult');
    const submit = document.getElementById('submitQuiz');
    const showPrev = () => {
        const prev = localStorage.getItem(quizKey);
        if (prev && result) { result.textContent = `Previous score: ${prev}/5`; result.classList.add('text-info'); }
    };
    showPrev();
    submit && submit.addEventListener('click', () => {
        let score = 0;
        Object.keys(answers).forEach((k) => {
            const selected = form.querySelector(`input[name="${k}"]:checked`);
            if (selected && selected.value === answers[k]) score++;
        });
        if (result) {
            result.textContent = `Your score: ${score}/5`;
            result.classList.remove('text-info');
            result.classList.toggle('text-success', score >= 4);
            result.classList.toggle('text-warning', score === 3);
            result.classList.toggle('text-danger', score <= 2);
        }
        localStorage.setItem(quizKey, String(score));
    });
});

