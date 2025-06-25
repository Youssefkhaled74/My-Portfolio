// Lecture Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Progress bar functionality
    const progressBar = document.querySelector('.progress-bar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    
    window.addEventListener('scroll', function() {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = progress + '%';
        
        // Show/hide back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Back to top functionality
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Quiz functionality
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionContainer = this.closest('.quiz-question');
            const options = questionContainer.querySelectorAll('.quiz-option');
            
            // Reset all options in this question
            options.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select current option
            this.classList.add('selected');
        });
    });
    
    // Check Answers button
    const checkAnswersBtn = document.getElementById('checkAnswers');
    if (checkAnswersBtn) {
        checkAnswersBtn.addEventListener('click', function() {
            const questions = document.querySelectorAll('.quiz-question');
            let score = 0;
            let totalQuestions = questions.length;
            
            questions.forEach(question => {
                const selectedOption = question.querySelector('.quiz-option.selected');
                const feedback = question.querySelector('.feedback');
                const options = question.querySelectorAll('.quiz-option');
                
                // Reset all options
                options.forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                if (selectedOption) {
                    if (selectedOption.getAttribute('data-correct') === 'true') {
                        selectedOption.classList.add('correct');
                        feedback.textContent = 'Correct! ' + selectedOption.getAttribute('data-explanation');
                        feedback.classList.add('correct');
                        feedback.classList.remove('incorrect');
                        feedback.style.display = 'block';
                        score++;
                    } else {
                        selectedOption.classList.add('incorrect');
                        feedback.textContent = 'Incorrect. ' + selectedOption.getAttribute('data-explanation');
                        feedback.classList.add('incorrect');
                        feedback.classList.remove('correct');
                        feedback.style.display = 'block';
                        
                        // Show the correct answer
                        const correctOption = question.querySelector('.quiz-option[data-correct="true"]');
                        if (correctOption) {
                            correctOption.classList.add('correct');
                        }
                    }
                } else {
                    feedback.textContent = 'Please select an answer.';
                    feedback.classList.add('incorrect');
                    feedback.classList.remove('correct');
                    feedback.style.display = 'block';
                }
            });
            
            // Show final score
            const scoreAlert = document.createElement('div');
            scoreAlert.className = 'alert alert-info mt-4';
            scoreAlert.textContent = `Your score: ${score}/${totalQuestions}`;
            
            // Remove any existing score alert
            const existingAlert = document.querySelector('.quiz-section .alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Add the new score alert
            document.querySelector('.quiz-section').appendChild(scoreAlert);
            
            // Update progress
            updateProgress(score, totalQuestions);
        });
    }
    
    // Reset Quiz button
    const resetQuizBtn = document.getElementById('resetQuiz');
    if (resetQuizBtn) {
        resetQuizBtn.addEventListener('click', function() {
            const questions = document.querySelectorAll('.quiz-question');
            
            questions.forEach(question => {
                const options = question.querySelectorAll('.quiz-option');
                const feedback = question.querySelector('.feedback');
                
                // Reset all options
                options.forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect');
                });
                
                // Clear feedback
                feedback.textContent = '';
                feedback.style.display = 'none';
                feedback.classList.remove('correct', 'incorrect');
            });
            
            // Remove score alert
            const existingAlert = document.querySelector('.quiz-section .alert');
            if (existingAlert) {
                existingAlert.remove();
            }
        });
    }
    
    // Code highlighting
    document.querySelectorAll('.code-block').forEach(block => {
        const languageLabel = document.createElement('div');
        languageLabel.className = 'language-label';
        languageLabel.textContent = block.dataset.language || 'php';
        block.appendChild(languageLabel);
    });
    
    // Interactive examples
    const examples = document.querySelectorAll('.interactive-example');
    examples.forEach(example => {
        const runButton = example.querySelector('.run-button');
        const outputArea = example.querySelector('.output-area');
        
        if (runButton && outputArea) {
            runButton.addEventListener('click', function() {
                const codeBlock = example.querySelector('pre');
                const code = codeBlock.textContent;
                
                // Simulate code execution (just for demonstration)
                outputArea.innerHTML = '<div class="output-content">Code execution simulated!</div>';
                outputArea.style.display = 'block';
            });
        }
    });
    
    // Save progress
    function updateProgress(score, totalQuestions) {
        localStorage.setItem('lectureProgress', JSON.stringify({
            lecture: document.querySelector('title').textContent,
            progress: (score / totalQuestions) * 100,
            lastVisited: new Date().toISOString()
        }));
    }
    
    // Download functionality
    const downloadButtons = document.querySelectorAll('.download-lecture');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get lecture content
            const lectureContent = document.querySelector('.lecture-container').innerHTML;
            
            // Create a blob
            const blob = new Blob([`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${document.title}</title>
                    <style>
                        ${document.querySelector('style') ? document.querySelector('style').innerHTML : ''}
                    </style>
                </head>
                <body>
                    ${lectureContent}
                </body>
                </html>
            `], {type: 'text/html'});
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document.title.replace(/\s+/g, '-').toLowerCase() + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
}); 