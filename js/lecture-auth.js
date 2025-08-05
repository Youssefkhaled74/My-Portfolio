document.addEventListener('DOMContentLoaded', function() {
    // Mark as completed functionality
    const markCompletedBtn = document.getElementById('mark-completed');
    const lectureKey = 'lecture-auth-completed';
    
    // Check localStorage for completed status
    if (localStorage.getItem(lectureKey) === 'true') {
        markCompletedBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Completed';
        markCompletedBtn.classList.add('completed');
    }
    
    markCompletedBtn.addEventListener('click', function() {
        if (this.classList.contains('completed')) {
            this.innerHTML = '<i class="far fa-circle me-2"></i>Mark as Completed';
            this.classList.remove('completed');
            localStorage.setItem(lectureKey, 'false');
        } else {
            this.innerHTML = '<i class="fas fa-check-circle me-2"></i>Completed';
            this.classList.add('completed');
            localStorage.setItem(lectureKey, 'true');
        }
    });
    
    // Quiz functionality
    const quizForm = document.getElementById('lecture-quiz');
    const quizResults = document.getElementById('quiz-results');
    const quizScore = document.getElementById('quiz-score');
    const quizProgress = document.getElementById('quiz-progress');
    const quizFeedback = document.getElementById('quiz-feedback');
    
    // Correct answers
    const correctAnswers = {
        q1: 'b',
        q2: 'b',
        q3: 'a',
        q4: 'a'
    };
    
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get user answers
        const userAnswers = {
            q1: document.querySelector('input[name="q1"]:checked')?.value,
            q2: document.querySelector('input[name="q2"]:checked')?.value,
            q3: document.querySelector('input[name="q3"]:checked')?.value,
            q4: document.querySelector('input[name="q4"]:checked')?.value
        };
        
        // Calculate score
        let score = 0;
        for (const question in userAnswers) {
            if (userAnswers[question] === correctAnswers[question]) {
                score++;
            }
        }
        
        // Display results
        const percentage = (score / Object.keys(correctAnswers).length) * 100;
        quizProgress.style.width = `${percentage}%`;
        quizScore.textContent = `You scored ${score} out of ${Object.keys(correctAnswers).length}`;
        
        // Provide feedback
        if (percentage >= 75) {
            quizProgress.classList.add('bg-success');
            quizFeedback.textContent = 'Excellent work! You clearly understand these concepts.';
        } else if (percentage >= 50) {
            quizProgress.classList.add('bg-warning');
            quizFeedback.textContent = 'Good effort! Review the sections you missed.';
        } else {
            quizProgress.classList.add('bg-danger');
            quizFeedback.textContent = 'Keep practicing! Review the lecture material and try again.';
        }
        
        // Show results
        quizResults.classList.remove('d-none');
        quizResults.classList.add('fade-in');
        
        // Scroll to results
        quizResults.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});