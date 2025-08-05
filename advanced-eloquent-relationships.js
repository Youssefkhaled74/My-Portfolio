// Smooth scroll to opened accordion section
const accordion = document.getElementById('conceptsAccordion');
if (accordion) {
    accordion.addEventListener('shown.bs.collapse', function (event) {
        const section = event.target;
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Quiz logic
const quizForm = document.getElementById('quizForm');
const submitQuiz = document.getElementById('submitQuiz');
const quizResult = document.getElementById('quizResult');

if (submitQuiz) {
    submitQuiz.addEventListener('click', function () {
        let score = 0;
        const answers = {
            q1: 'a',
            q2: 'b',
            q3: 'a',
            q4: 'a'
        };
        for (let q in answers) {
            const selected = quizForm.querySelector(`input[name="${q}"]:checked`);
            if (selected && selected.value === answers[q]) {
                score++;
            }
        }
        let feedback = '';
        if (score === 4) {
            feedback = 'Excellent! أنت جامد جداً 👏';
        } else if (score >= 2) {
            feedback = 'كويس! بس حاول تراجع تاني على المفاهيم.';
        } else {
            feedback = 'محتاج تذاكر تاني يا بطل! جرب تراجع الشرح فوق.';
        }
        quizResult.innerHTML = `Score: <span class="text-primary">${score}/4</span><br>${feedback}`;
        quizResult.style.opacity = 0;
        setTimeout(() => {
            quizResult.style.transition = 'opacity 0.7s';
            quizResult.style.opacity = 1;
        }, 100);
    });
}

// Mark as Completed button
const markCompleted = document.getElementById('markCompleted');
if (markCompleted) {
    markCompleted.addEventListener('click', function () {
        this.classList.toggle('completed');
        if (this.classList.contains('completed')) {
            this.innerHTML = '<i class="fa-solid fa-check-double"></i> Completed!';
        } else {
            this.innerHTML = '<i class="fa-solid fa-check"></i> Mark as Completed';
        }
    });
}