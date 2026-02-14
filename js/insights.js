document.addEventListener('DOMContentLoaded', function () {
    const filters = document.querySelectorAll('.insight-filter');
    const cards = document.querySelectorAll('.insight-card[data-category]');
    const searchInput = document.getElementById('insightSearch');
    const emptyState = document.getElementById('insightsEmpty');

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        const activeFilter = document.querySelector('.insight-filter.active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let visibleCount = 0;

        cards.forEach(function (card) {
            const category = card.getAttribute('data-category') || '';
            const text = card.textContent.toLowerCase();
            const matchesFilter = filter === 'all' || category === filter;
            const matchesSearch = !query || text.includes(query);
            const show = matchesFilter && matchesSearch;
            card.style.display = show ? 'flex' : 'none';
            if (show) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    filters.forEach(function (button) {
        button.addEventListener('click', function () {
            filters.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    const progressBar = document.getElementById('readProgress');
    if (progressBar) {
        window.addEventListener('scroll', function () {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop || document.body.scrollTop;
            const scrollHeight = doc.scrollHeight - doc.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    }

    const downloadLecturePdfBtn = document.getElementById('downloadLecturePdf');
    const printableArticle = document.getElementById('articlePrintable');
    if (downloadLecturePdfBtn && printableArticle) {
        downloadLecturePdfBtn.addEventListener('click', function () {
            if (typeof html2pdf === 'undefined') {
                alert('PDF generator is not loaded. Please try again.');
                return;
            }
            const options = {
                margin: [10, 10, 12, 10],
                filename: 'system-design-backend-fundamentals-ar.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            };
            html2pdf().set(options).from(printableArticle).save();
        });
    }

    applyFilters();
});
