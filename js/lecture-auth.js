document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle (Placeholder)
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.classList.toggle('fa-moon');
        themeToggle.classList.toggle('fa-sun');
    });

    // Mark as Completed Button
    const markCompletedBtn = document.getElementById('markCompletedBtn');
    let isCompleted = false;

    markCompletedBtn.addEventListener('click', () => {
        isCompleted = !isCompleted;
        if (isCompleted) {
            markCompletedBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Completed';
            markCompletedBtn.classList.add('completed');
        } else {
            markCompletedBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Mark as Completed';
            markCompletedBtn.classList.remove('completed');
        }
    });

    // Quiz Submission
    window.submitQuiz = function() {
        const answers = {
            q1: 'b', // Breeze scaffolds authentication
            q2: 'b', // Sanctum for API and SPA
            q3: 'b', // Spatie for roles and permissions
            q4: 'a'  // Cache to reduce queries
        };

        let score = 0;
        const totalQuestions = 4;
        const form = document.getElementById('quizForm');
        const resultDiv = document.getElementById('quizResult');

        for (let i = 1; i <= totalQuestions; i++) {
            const selected = form.querySelector(`input[name="q${i}"]:checked`);
            if (selected && selected.value === answers[`q${i}`]) {
                score++;
            }
        }

        resultDiv.innerHTML = `
            <div class="alert ${score === totalQuestions ? 'alert-success' : 'alert-info'}">
                You scored ${score} out of ${totalQuestions}! 
                ${score === totalQuestions ? 'Perfect!' : 'Review the concepts and try again.'}
            </div>
        `;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    };
});