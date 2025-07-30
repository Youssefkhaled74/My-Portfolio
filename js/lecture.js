// Lectures Redesigned JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const htmlRoot = document.getElementById('html-root');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        htmlRoot.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeToggle) {
            themeToggle.className = theme === 'light' ? 'fas fa-moon theme-toggle' : 'fas fa-sun theme-toggle';
        }
    }

    // Search Functionality
    const searchInput = document.getElementById('lectureSearch');
    const statusFilter = document.getElementById('statusFilter');
    const lectureCards = document.querySelectorAll('.lecture-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterLectures);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterLectures);
    }
    
    function filterLectures() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : 'all';
        
        lectureCards.forEach(card => {
            const title = card.querySelector('.lecture-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.lecture-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            const status = card.getAttribute('data-status') || '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                tags.includes(searchTerm);
            const matchesStatus = statusValue === 'all' || status === statusValue;
            
            if (matchesSearch && matchesStatus) {
                card.classList.remove('hidden');
                card.style.display = 'block';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        // Update empty state
        updateEmptyState();
    }
    
    function updateEmptyState() {
        const visibleCards = document.querySelectorAll('.lecture-card:not(.hidden)');
        const activeTabPane = document.querySelector('.tab-pane.active');
        
        if (activeTabPane) {
            let emptyState = activeTabPane.querySelector('.empty-state');
            
            if (visibleCards.length === 0) {
                if (!emptyState) {
                    emptyState = document.createElement('div');
                    emptyState.className = 'empty-state text-center py-5';
                    emptyState.innerHTML = `
                        <div class="mb-3">
                            <i class="fas fa-search fa-3x text-muted"></i>
                        </div>
                        <h5 class="text-muted">No lectures found</h5>
                        <p class="text-muted">Try adjusting your search or filter criteria</p>
                    `;
                    activeTabPane.querySelector('.lecture-grid').appendChild(emptyState);
                }
            } else if (emptyState) {
                emptyState.remove();
            }
        }
    }

    // Tab Change Handler
    const trackTabs = document.querySelectorAll('[data-bs-toggle="pill"]');
    trackTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function() {
            // Re-run filters when switching tabs
            filterLectures();
            
            // Animate cards in the new tab
            const activeTabPane = document.querySelector(tab.getAttribute('data-bs-target'));
            if (activeTabPane) {
                const cards = activeTabPane.querySelectorAll('.lecture-card');
                cards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('fade-in');
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    });

    // Lecture Card Interactions
    lectureCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add click to expand functionality
        const detailsToggle = card.querySelector('.details-toggle');
        if (detailsToggle) {
            detailsToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const details = card.querySelector('.lecture-details');
                if (details) {
                    details.classList.toggle('expanded');
                    this.textContent = details.classList.contains('expanded') ? 'Show Less' : 'Show More';
                }
            });
        }
    });

    // Resource Link Interactions
    const resourceLinks = document.querySelectorAll('.resource-link');
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show tooltip or handle resource opening
            const title = this.getAttribute('title');
            showTooltip(this, `Opening ${title}...`);
        });
    });

    // Progress Bar Animations
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    // Animate progress bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
            }
        });
    });

    const trackHeaders = document.querySelectorAll('.track-header');
    trackHeaders.forEach(header => {
        observer.observe(header);
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // Press 'S' to focus search
        if (e.key === 's' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Press 'Escape' to clear search
        if (e.key === 'Escape' && searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            filterLectures();
            searchInput.blur();
        }
    });

    // Loading States
    function showLoading(element) {
        element.classList.add('loading');
    }
    
    function hideLoading(element) {
        element.classList.remove('loading');
    }

    // Tooltip System
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-color);
            color: var(--bg-color);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }, 2000);
    }

    // Statistics Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                }
            }, 40);
        });
    }

    // Animate counters when header comes into view
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                headerObserver.unobserve(entry.target);
            }
        });
    });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        headerObserver.observe(statsContainer);
    }

    // Initialize filters on page load
    filterLectures();
    
    // Add fade-in animation to initial cards
    setTimeout(() => {
        const initialCards = document.querySelectorAll('.tab-pane.active .lecture-card');
        initialCards.forEach((card, index) => {
            card.classList.add('fade-in');
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 300);
});

// Global function to open lectures (called from HTML)
function openLecture(lectureId) {
    console.log(`Opening lecture: ${lectureId}`);
    
    // Add loading state
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Here you would typically navigate to the lecture page
        // For demo purposes, we'll just show an alert
        alert(`Opening lecture: ${lectureId}\n\nThis would normally navigate to the lecture page.`);
    }, 1000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential external use
window.LecturesApp = {
    openLecture,
    showTooltip: function(element, message) {
        showTooltip(element, message);
    }
};

