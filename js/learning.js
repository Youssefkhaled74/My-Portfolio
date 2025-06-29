// Learning Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });
    
    // Track buttons functionality
    const trackButtons = document.querySelectorAll('.track-btn');
    const filterButtons = document.querySelectorAll('.track-filter .btn');
    const trackContents = document.querySelectorAll('.track-content');
    const searchInput = document.getElementById('trackSearch');
    const lectureItems = document.querySelectorAll('.lecture-item');
    
    // Show all tracks initially
    document.getElementById('laravel-content').classList.add('active');
    document.getElementById('data-analysis-content').classList.add('active');
    document.getElementById('system-design-content').classList.add('active');
    document.getElementById('devops-content').classList.add('active');
    
    // Track button click handler
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackName = this.getAttribute('data-track');
            
            // Hide all track contents
            trackContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected track content
            document.getElementById(`${trackName}-content`).classList.add('active');
            
            // Update filter buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-track') === trackName) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to content
            document.getElementById(`${trackName}-content`).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackName = this.getAttribute('data-track');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (trackName === 'all') {
                // Show all track contents
                trackContents.forEach(content => {
                    content.classList.add('active');
                });
                
                // Show all lecture items
                lectureItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                // Hide all track contents
                trackContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show selected track content
                document.getElementById(`${trackName}-content`).classList.add('active');
                
                // Filter lecture items
                lectureItems.forEach(item => {
                    if (item.getAttribute('data-category') === trackName) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm === '') {
            // If search is empty, respect the current filter
            const activeFilter = document.querySelector('.track-filter .btn.active').getAttribute('data-track');
            
            if (activeFilter === 'all') {
                // Show all lectures
                lectureItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                // Show only lectures from active filter
                lectureItems.forEach(item => {
                    if (item.getAttribute('data-category') === activeFilter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        } else {
            // Search across all lectures
            lectureItems.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const description = item.querySelector('.card-text').textContent.toLowerCase();
                const category = item.getAttribute('data-category').toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    });
    
    // Lecture view functionality
    const viewLectureButtons = document.querySelectorAll('.view-lecture');
    const lectureModal = new bootstrap.Modal(document.getElementById('lectureModal'));
    
    viewLectureButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lecturePath = this.getAttribute('data-lecture');
            const lectureType = this.getAttribute('data-type');
            
            if (lecturePath && lecturePath !== '#') {
                // Set modal title based on lecture title
                const lectureTitle = this.closest('.card-body').querySelector('.card-title').textContent.trim();
                document.getElementById('lectureModalLabel').textContent = lectureTitle;
                
                // Set open in new tab link
                const openInNewTabBtn = document.getElementById('openInNewTab');
                openInNewTabBtn.href = lecturePath;
                
                // Handle different content types
                const htmlContent = document.getElementById('htmlContent');
                const markdownContent = document.getElementById('markdownContent');
                
                if (lectureType === 'html') {
                    // Show HTML content (iframe)
                    htmlContent.style.display = 'block';
                    markdownContent.style.display = 'none';
                    
                    // Set iframe source
                    const lectureFrame = document.getElementById('lectureFrame');
                    lectureFrame.src = lecturePath;
                } else if (lectureType === 'markdown') {
                    // Show Markdown content
                    htmlContent.style.display = 'none';
                    markdownContent.style.display = 'block';
                    
                    // Fetch and render markdown
                    fetch(lecturePath)
                        .then(response => response.text())
                        .then(text => {
                            markdownContent.innerHTML = marked.parse(text);
                            
                            // Apply syntax highlighting
                            markdownContent.querySelectorAll('pre code').forEach((block) => {
                                Prism.highlightElement(block);
                            });
                        })
                        .catch(error => {
                            markdownContent.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
                        });
                }
                
                // Show modal
                lectureModal.show();
            } else {
                // For "Coming Soon" lectures, show alert
                alert('This lecture is coming soon! Stay tuned for updates.');
            }
        });
    });
}); 