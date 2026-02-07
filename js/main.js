var tablinks = document.getElementsByClassName("tab-links")
var tabcontents = document.getElementsByClassName("tab-contents")
function opentab(tabname){
    for(tablink of tablinks){
        tablink.classList.remove("active-links");
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("tab-active");
    }
    event.currentTarget.classList.add("active-links");
    document.getElementById(tabname).classList.add("tab-active")
}
var sidemeu = document.getElementById("sidemenu")
function openmenu(){
    sidemeu.style.right ="0";
}
function closemenu(){
    sidemeu.style.right ="-200px";
}
// const scriptURL = 'https://script.google.com/macros/s/AKfycbysepLTVAQnh5dcnywRx8IX5OsNYl_h_pxeq9AEdBUIGrQ6iRf_K95B8K84AC4ZYvie/exec'
// const form = document.forms['submit-to-google-sheet']
// const msg = document.getElementById("msg")
// form.addEventListener('submit', e => {
//   e.preventDefault()
//   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
//     .then(response => {
//         msg.innerHTML = "Message sent successfully !!!!"
//         setTimeout(function(){
//             msg.innerHTML = ""
//         },5000)
//         form.reset()
//     })
//     .catch(error => console.error('Error!', error.message))
// })

// Preloader
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    if (!preloader) {
        return;
    }
    setTimeout(() => {
        preloader.classList.add('hide');
    }, 500);
});

// Initialize AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true
    });
}

// Theme Toggle System
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const htmlRoot = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlRoot.setAttribute('data-theme', savedTheme);
if (themeToggle) {
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlRoot.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }
    
    // Shrink navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
        navbar.classList.add('navbar-shrink');
    } else if (navbar) {
        navbar.classList.remove('navbar-shrink');
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Language Toggle System
const langToggle = document.getElementById('langToggle');
const translations = {
    en: {
        navbar_brand: "Youssef Khaled",
        nav_home: "Home",
        nav_about: "About",
        nav_services: "Services",
        nav_portfolio: "Portfolio",
        nav_learning: "Learning",
        nav_testimonials: "Testimonials",
        nav_contact: "Contact",
        nav_tracks: "All Tracks",
        nav_projects: "Projects",
        nav_freelance: "Freelance",
        nav_proof: "Proof",
        nav_knowledge: "Knowledge",
        hero_title: "Backend engineer who ships reliable systems.",
        hero_subtitle: "I design scalable APIs, data models, and infrastructure that keep products fast, secure, and resilient. Strong focus on Laravel, performance, and production readiness.",
        hero_cta_primary: "Start a project",
        hero_cta_secondary: "See case studies",
        metric_experience: "Experience",
        metric_projects: "Projects delivered",
        metric_uptime: "Uptime focus",
        signal_focus_label: "System focus",
        signal_focus_title: "Backend systems",
        signal_focus_desc: "Architecture, security, and performance that scale.",
        signal_reliability_label: "Reliability",
        signal_reliability_title: "99.9% uptime mindset",
        signal_reliability_desc: "Release checks, rollback plans, and clean monitoring.",
        signal_delivery_label: "Delivery",
        signal_delivery_title: "Shipping cadence",
        signal_delivery_desc: "Predictable releases with resilient data models.",
        projects_eyebrow: "Projects",
        projects_title: "Full portfolio of shipped products",
        projects_desc: "All projects below are from my work at Evyx. Each one will include full details and multiple links.",
        project_placeholder: "Project description coming soon.",
        link_apple: "Apple Store",
        link_play: "Google Play",
        link_dashboard: "Dashboard",
        proof_eyebrow: "Proof",
        proof_title: "Backend outcomes that keep products healthy",
        proof_perf_title: "Performance",
        proof_perf_desc: "Optimized data access layers and caching for faster response times.",
        proof_rel_title: "Reliability",
        proof_rel_desc: "Zero-downtime deployments and guardrails for safe releases.",
        proof_scale_title: "Scale",
        proof_scale_desc: "Multi-tenant designs supporting growing teams and data volume.",
        about_title: "About me",
        about_desc: "I am Youssef Khaled Anwar, backend developer and statistics graduate focused on reliable web systems. I lead backend efforts at Evyx Company and mentor developers through learning communities.",
        about_card_title: "What you get",
        about_card_item_1: "Clear system architecture and clean data models.",
        about_card_item_2: "Scalable APIs with documented endpoints.",
        about_card_item_3: "Production readiness: monitoring, logging, and security.",
        about_cv: "Download full CV",
        contact_title: "Let’s build your backend roadmap",
        contact_desc: "Available for backend development, API architecture, and performance consulting.",
        contact_email: "Email me",
        contact_whatsapp: "WhatsApp",
        contact_modal_title: "Choose a subject",
        contact_modal_desc: "Pick a topic and we will open your email client.",
        contact_modal_name: "Your name",
        contact_modal_email: "Your email",
        contact_modal_message: "Message",
        contact_modal_cancel: "Cancel",
        contact_modal_send: "Compose email",
        header_greeting: "Hi, I'm <span class='text-primary'>Youssef Khaled</span>",
        header_roles: "Laravel Full-Stack Developer | PHP Backend Developer | Data Analyst",
        header_position: "Back-end Developer at Evyx Company | B.Sc. Student",
        about_title: "About Me",
        about_bio_title: "Biography",
        about_bio: "I am Youssef Khaled Anwar, a senior at the Faculty of Science, Ain Shams University, majoring in Statistics and Computer Science. I am currently a Back-end Developer at Evyx Company, specializing in Laravel and PHP. With a diploma in full-stack web development from SSD Academy, I have extensive experience as a freelance developer and intern at SSD Academy. I lead the backend department at IEEE Future Academy and share knowledge through my YouTube and Telegram channels. My goal is to build scalable and efficient web applications.",
        about_skills_tab: "Skills",
        about_experience_tab: "Experience",
        about_education_tab: "Education",
        skills_programming: "Programming Languages",
        skills_frameworks: "Frameworks",
        skills_webdev: "Web Development",
        skills_databases: "Databases",
        skills_algorithms: "Algorithms and Data Structures",
        skills_data_analysis: "Data Analysis",
        skills_tools: "Tools and Technologies",
        skills_parallel: "Parallel Computing",
        services_title: "My Services",
        services_laravel: "Laravel Full-Stack Development",
        services_laravel_desc: "Build comprehensive web applications using Laravel for both frontend and backend.",
        services_api: "REST API Development",
        services_api_desc: "Design and implement scalable RESTful APIs with Laravel for seamless integration.",
        services_db: "Database Management",
        services_db_desc: "Develop efficient database solutions with MySQL and MongoDB for robust data handling.",
        portfolio_title: "Key Projects",
        portfolio_ceaser: "Ceaser",
        portfolio_ceaser_desc: "A smart business management platform with Laravel Nova dashboard, QR code integration, and Google Maps for real-time monitoring.",
        portfolio_lawyer: "Ask Lawyer",
        portfolio_lawyer_desc: "A legal consultation platform with a Laravel Nova admin dashboard for dynamic content management.",
        portfolio_peking: "Peking",
        portfolio_peking_desc: "A restaurant management system for multiple branches, handling dine-in, takeaway, and delivery orders.",
        portfolio_view: "View Project",
        portfolio_more: "See More Projects",
        testimonials_title: "Testimonials",
        testimonial_1: "Youssef's expertise in Laravel development transformed our project. His attention to detail and professionalism were outstanding.",
        testimonial_1_author: "John Doe, Project Manager",
        testimonial_2: "Working with Youssef was a pleasure. His backend solutions were robust, and his teaching content is exceptional.",
        testimonial_2_author: "Jane Smith, Developer",
        contact_title: "Contact Me",
        contact_cv: "Download CV",
        contact_cv_backend: "Backend CV",
        contact_name_placeholder: "Your Name",
        contact_email_placeholder: "Your Email",
        contact_message_placeholder: "Your Message",
        contact_submit: "Submit",
        contact_success: "Message sent successfully!",
        contact_error: "Failed to send message. Please try again.",
        footer: "Copyright © 2025 Youssef Khaled. Made with <i class='fa-solid fa-heart text-danger'></i>",
        knowledge_eyebrow: "Knowledge Hub",
        knowledge_title: "Backend topics, practical and structured",
        knowledge_desc: "Bilingual lectures with categories. Read in-page or download PDF.",
        filter_all: "All",
        filter_database: "Database",
        filter_performance: "Performance",
        filter_security: "Security",
        lecture_concurrency_title: "Concurrency & Locking in Laravel",
        lecture_concurrency_desc: "How to prevent race conditions with transactions and row locks.",
        lecture_read: "Read",
        lecture_pdf: "PDF",
        tag_database: "Database",
        knowledge_all: "View all lectures",
        freelance_eyebrow: "Freelance",
        freelance_title: "Selected freelance work outside Evyx",
        freelance_desc: "A separate showcase for independent projects with their own visual style.",
        tag_freelance: "Freelance",
        freelance_maktabty_desc: "Library platform with inventory, orders, and admin dashboard.",
        freelance_sgsolar_desc: "Solar energy services website with service catalog and customer collection.",
        freelance_fifa_desc: "Interactive interface with tables, statistics, and highlights."
        ,
        freelance_yeesooh_desc: "Project description coming soon.",
        freelance_insave_desc: "Project description coming soon."
    },
    ar: {
        navbar_brand: "يوسف خالد",
        nav_home: "الرئيسية",
        nav_about: "نبذة عني",
        nav_services: "خدماتي",
        nav_portfolio: "مشاريعي",
        nav_learning: "التعلم",
        nav_testimonials: "آراء العملاء",
        nav_contact: "اتصل بي",
        nav_tracks: "جميع المسارات",
        nav_projects: "المشاريع",
        nav_freelance: "فريلانس",
        nav_proof: "الإنجازات",
        nav_knowledge: "المعرفة",
        hero_title: "مهندس خلفية يسلّم أنظمة موثوقة.",
        hero_subtitle: "أصمم واجهات API قابلة للتوسع، نماذج بيانات، وبنية تحتية تحافظ على سرعة المنتج وأمانه واستقراره. تركيز قوي على Laravel والأداء والجاهزية الإنتاجية.",
        hero_cta_primary: "ابدأ مشروعًا",
        hero_cta_secondary: "اطّلع على المشاريع",
        metric_experience: "الخبرة",
        metric_projects: "مشاريع تم تسليمها",
        metric_uptime: "تركيز التوافر",
        signal_focus_label: "التركيز النظمي",
        signal_focus_title: "أنظمة الخلفية",
        signal_focus_desc: "هيكلة، أمان، وأداء ينمو مع المنتج.",
        signal_reliability_label: "الموثوقية",
        signal_reliability_title: "عقلية 99.9% توافر",
        signal_reliability_desc: "تحققات إصدار، خطط تراجع، ومراقبة نظيفة.",
        signal_delivery_label: "التسليم",
        signal_delivery_title: "إيقاع إطلاق منتظم",
        signal_delivery_desc: "إطلاقات متوقعة مع نماذج بيانات متينة.",
        projects_eyebrow: "المشاريع",
        projects_title: "محفظة كاملة لمشاريع منجزة",
        projects_desc: "جميع المشاريع أدناه من عملي في Evyx. سيتم إضافة تفاصيل كاملة وروابط متعددة.",
        project_placeholder: "وصف المشروع قادم قريبًا.",
        link_apple: "آبل ستور",
        link_play: "جوجل بلاي",
        link_dashboard: "لوحة التحكم",
        proof_eyebrow: "الإنجازات",
        proof_title: "نتائج خلفية تحافظ على سلامة المنتج",
        proof_perf_title: "الأداء",
        proof_perf_desc: "تحسين طبقات البيانات والكاش لتسريع الاستجابة.",
        proof_rel_title: "الموثوقية",
        proof_rel_desc: "إطلاقات بدون توقف مع حواجز أمان.",
        proof_scale_title: "التوسع",
        proof_scale_desc: "تصاميم متعددة المستأجرين تدعم النمو.",
        about_title: "نبذة عني",
        about_desc: "أنا يوسف خالد أنور، مطور خلفية وخريج إحصاء وعلوم حاسب مهتم ببناء أنظمة ويب موثوقة. أقود جهود الخلفية في Evyx وأرعى مجتمعات تعليمية.",
        about_card_title: "ماذا ستحصل عليه",
        about_card_item_1: "هيكلة نظام واضحة ونماذج بيانات نظيفة.",
        about_card_item_2: "واجهات API قابلة للتوسع مع توثيق واضح.",
        about_card_item_3: "جاهزية إنتاجية: مراقبة، سجلات، وأمان.",
        about_cv: "تحميل السيرة الذاتية",
        contact_title: "لنضع خارطة طريق قوية لخلفيتك",
        contact_desc: "متاح لتطوير الخلفية وهندسة API واستشارات الأداء.",
        contact_email: "راسلني",
        contact_whatsapp: "واتساب",
        contact_modal_title: "اختر الموضوع",
        contact_modal_desc: "اختر موضوعًا وسيتم فتح تطبيق البريد.",
        contact_modal_name: "اسمك",
        contact_modal_email: "بريدك الإلكتروني",
        contact_modal_message: "الرسالة",
        contact_modal_cancel: "إلغاء",
        contact_modal_send: "كتابة البريد",
        header_greeting: "مرحباً، أنا <span class='text-primary'>يوسف خالد</span>",
        header_roles: "مطور لارافيل كامل التكامل | مطور خلفية PHP | محلل بيانات",
        header_position: "مطور خلفية في شركة Evyx | طالب بكالوريوس",
        about_title: "نبذة عني",
        about_bio_title: "السيرة الذاتية",
        about_bio: "أنا يوسف خالد أنور، طالب في السنة النهائية بكلية العلوم، جامعة عين شمس، تخصص إحصاء وعلوم حاسب. أعمل حالياً كمطور خلفية في شركة Evyx، متخصص في لارافيل وPHP. حصلت على دبلوم في تطوير الويب كامل التكامل من أكاديمية SSD، ولدي خبرة واسعة كمطور مستقل ومتدرب في أكاديمية SSD. أقود قسم الخلفية في أكاديمية IEEE Future وأشارك المعرفة عبر قنواتي على يوتيوب وتيليجرام. هدفي هو بناء تطبيقات ويب قابلة للتطوير وفعالة.",
        about_skills_tab: "المهارات",
        about_experience_tab: "الخبرات",
        about_education_tab: "التعليم",
        skills_programming: "لغات البرمجة",
        skills_frameworks: "إطارات العمل",
        skills_webdev: "تطوير الويب",
        skills_databases: "قواعد البيانات",
        skills_algorithms: "الخوارزميات وهياكل البيانات",
        skills_data_analysis: "تحليل البيانات",
        skills_tools: "الأدوات والتقنيات",
        skills_parallel: "الحوسبة المتوازية",
        services_title: "خدماتي",
        services_laravel: "تطوير لارافيل كامل التكامل",
        services_laravel_desc: "بناء تطبيقات ويب شاملة باستخدام لارافيل للواجهة الأمامية والخلفية.",
        services_api: "تطوير واجهات برمجة التطبيقات REST",
        services_api_desc: "تصميم وتنفيذ واجهات برمجة تطبيقات REST قابلة للتطوير للتكامل السلس.",
        services_db: "إدارة قواعد البيانات",
        services_db_desc: "تطوير حلول قواعد بيانات فعالة باستخدام MySQL وMongoDB لمعالجة البيانات القوية.",
        portfolio_title: "مشاريع رئيسية",
        portfolio_ceaser: "سيزر",
        portfolio_ceaser_desc: "منصة إدارة أعمال ذكية مع لوحة تحكم لارافيل نوفا، تكامل رمز QR، وخرائط جوجل للمراقبة في الوقت الفعلي.",
        portfolio_lawyer: "اسأل محامي",
        portfolio_lawyer_desc: "منصة استشارات قانونية مع لوحة تحكم لارافيل نوفا لإدارة المحتوى الديناميكي.",
        portfolio_peking: "بيكينج",
        portfolio_peking_desc: "نظام إدارة مطاعم لفروع متعددة، يتعامل مع الطلبات داخل المطعم، والتيك أواي، والتوصيل.",
        portfolio_view: "عرض المشروع",
        portfolio_more: "رؤية المزيد من المشاريع",
        testimonials_title: "آراء العملاء",
        testimonial_1: "خبرة يوسف في تطوير لارافيل غيرت مشروعنا. اهتمامه بالتفاصيل واحترافيته كانت رائعة.",
        testimonial_1_author: "جون دو، مدير المشروع",
        testimonial_2: "العمل مع يوسف كان ممتعاً. حلوله الخلفية كانت قوية، ومحتواه التعليمي استثنائي.",
        testimonial_2_author: "جين سميث، مطور",
        contact_title: "اتصل بي",
        contact_cv: "تحميل السيرة الذاتية",
        contact_cv_backend: "سيرة ذاتية للباك اند",
        contact_name_placeholder: "اسمك",
        contact_email_placeholder: "بريدك الإلكتروني",
        contact_message_placeholder: "رسالتك",
        contact_submit: "إرسال",
        contact_success: "تم إرسال الرسالة بنجاح!",
        contact_error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        footer: "حقوق النشر © 2025 يوسف خالد. صنع بـ <i class='fa-solid fa-heart text-danger'></i>",
        knowledge_eyebrow: "مركز المعرفة",
        knowledge_title: "مواضيع خلفية عملية ومنظمة",
        knowledge_desc: "محاضرات ثنائية اللغة مع تصنيفات. اقرأ داخل الموقع أو حمّل PDF.",
        filter_all: "الكل",
        filter_database: "قواعد البيانات",
        filter_performance: "الأداء",
        filter_security: "الأمان",
        lecture_concurrency_title: "التزامن والأقفال في Laravel",
        lecture_concurrency_desc: "كيف تمنع تعارضات التحديث باستخدام المعاملات والأقفال.",
        lecture_read: "قراءة",
        lecture_pdf: "PDF",
        tag_database: "قواعد البيانات",
        knowledge_all: "عرض كل المحاضرات",
        freelance_eyebrow: "فريلانس",
        freelance_title: "مشاريع مستقلة خارج Evyx",
        freelance_desc: "عرض منفصل لمشاريع مستقلة بطابع بصري مختلف.",
        tag_freelance: "فريلانس",
        freelance_maktabty_desc: "منصة مكتبة تشمل المخزون والطلبات ولوحة الإدارة.",
        freelance_sgsolar_desc: "موقع خدمات الطاقة الشمسية مع كتالوج خدمات وجمع العملاء.",
        freelance_fifa_desc: "واجهة تفاعلية مع الجداول والإحصاءات واللقطات."
        ,
        freelance_yeesooh_desc: "وصف المشروع قادم قريبًا.",
        freelance_insave_desc: "وصف المشروع قادم قريبًا."
    }
};

const savedLang = localStorage.getItem('language') || 'en';
htmlRoot.setAttribute('lang', savedLang);
htmlRoot.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
if (langToggle) {
    langToggle.textContent = savedLang === 'ar' ? 'EN' : 'AR';
    updateTranslations(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = htmlRoot.getAttribute('lang');
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        htmlRoot.setAttribute('lang', newLang);
        htmlRoot.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('language', newLang);
        langToggle.textContent = newLang === 'ar' ? 'EN' : 'AR';
        updateTranslations(newLang);
    });
}

function updateTranslations(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const msgElement = document.getElementById('msg');
        const currentLang = htmlRoot.getAttribute('lang');
        
        if (!name || !email || !message) {
            msgElement.className = 'mt-3 text-danger';
            msgElement.textContent = currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields';
            return;
        }

        // Example using EmailJS
        emailjs.send('default_service', 'template_id', {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Youssef Khaled'
        })
        .then(function() {
            msgElement.className = 'mt-3 text-success';
            msgElement.textContent = translations[currentLang].contact_success;
            contactForm.reset();
            setTimeout(() => {
                msgElement.textContent = '';
            }, 5000);
        }, function(error) {
            console.error('Error sending email:', error);
            msgElement.className = 'mt-3 text-danger';
            msgElement.textContent = translations[currentLang].contact_error;
        });
    });
}

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Lecture section functionality
document.addEventListener('DOMContentLoaded', function() {
    // Lecture filtering
    const categoryButtons = document.querySelectorAll('.lecture-categories .btn');
    const lectureItems = document.querySelectorAll('.lecture-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter lectures
            lectureItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Lecture search
    const searchInput = document.getElementById('lectureSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
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
        });
    }
});

// Knowledge Hub filtering
document.addEventListener('DOMContentLoaded', function() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.knowledge-card');

    if (!chips.length || !cards.length) {
        return;
    }

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
            });
        });
    });
});

// Lecture view functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create modal for viewing lectures
    const modalHtml = `
    <div class="modal fade" id="lectureModal" tabindex="-1" aria-labelledby="lectureModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="lectureModalLabel">Lecture</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="htmlContent" style="display: none;">
                        <iframe id="lectureFrame" style="width: 100%; height: 80vh; border: none;"></iframe>
                    </div>
                    <div id="markdownContent" class="markdown-content" style="display: none;">
                        <!-- Markdown content will be loaded here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <a id="openInNewTab" href="#" target="_blank" class="btn btn-primary">Open in New Tab</a>
                </div>
            </div>
        </div>
    </div>`;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Initialize modal
    const lectureModal = new bootstrap.Modal(document.getElementById('lectureModal'));
    
    // Handle lecture view button clicks
    const viewLectureButtons = document.querySelectorAll('.view-lecture');
    viewLectureButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lecturePathDefault = this.getAttribute('data-lecture');
            const lecturePathAr = this.getAttribute('data-lecture-ar');
            const currentLang = htmlRoot.getAttribute('lang');
            const lecturePath = (currentLang === 'ar' && lecturePathAr) ? lecturePathAr : lecturePathDefault;
            const lectureType = this.getAttribute('data-type') || 
                                (lecturePath && lecturePath.endsWith('.md') ? 'markdown' : 'html');
            
            if (lecturePath && lecturePath !== '#') {
                // Set modal title based on lecture title
                const knowledgeCard = this.closest('.knowledge-card');
                const lectureTitleEl = knowledgeCard ? knowledgeCard.querySelector('h3') : null;
                document.getElementById('lectureModalLabel').textContent = lectureTitleEl ? lectureTitleEl.textContent.trim() : 'Lecture';
                
                // Set open in new tab link
                const openInNewTabBtn = document.getElementById('openInNewTab');
                openInNewTabBtn.href = lecturePath;
                
                // Handle different content types
                const htmlContent = document.getElementById('htmlContent');
                const markdownContent = document.getElementById('markdownContent');
                
                if (lectureType === 'html' || !lectureType) {
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
                            if (typeof marked !== 'undefined') {
                                markdownContent.innerHTML = marked.parse(text);
                                
                                // Apply syntax highlighting if Prism is available
                                if (typeof Prism !== 'undefined') {
                                    markdownContent.querySelectorAll('pre code').forEach((block) => {
                                        Prism.highlightElement(block);
                                    });
                                }
                            } else {
                                markdownContent.innerHTML = `<div class="alert alert-warning">Markdown parser not loaded. Please open in new tab.</div>`;
                            }
                        })
                        .catch(error => {
                            const isFile = window.location.protocol === 'file:';
                            const hint = isFile
                                ? 'Open the site with a local server (http://) or use “Open in New Tab”.'
                                : 'Please use “Open in New Tab”.';
                            markdownContent.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}. ${hint}</div>`;
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

// Contact email subject chooser (custom modal)
document.addEventListener('DOMContentLoaded', function() {
    const emailBtn = document.getElementById('contactEmailBtn');
    const modal = document.getElementById('contactModal');
    const optionsWrap = document.getElementById('contactModalOptions');
    const nameInput = document.getElementById('contactModalName');
    const emailInput = document.getElementById('contactModalEmail');
    const messageInput = document.getElementById('contactModalMessage');
    const sendBtn = document.getElementById('contactModalSend');
    if (!emailBtn || !modal || !optionsWrap || !sendBtn) {
        return;
    }

    const subjects = {
        en: [
            "Backend project inquiry",
            "API architecture consultation",
            "Performance & scaling help",
            "Freelance collaboration"
        ],
        ar: [
            "استفسار عن مشروع باك إند",
            "استشارة هندسة API",
            "مساعدة في الأداء والتوسع",
            "تعاون فريلانس"
        ]
    };

    function openModal() {
        const lang = htmlRoot.getAttribute('lang') || 'en';
        const list = subjects[lang] || subjects.en;
        optionsWrap.innerHTML = list.map((subject, i) => {
            const checked = i === 0 ? 'checked' : '';
            return `<label class=\"contact-option\"><input type=\"radio\" name=\"contactSubject\" value=\"${subject}\" ${checked}> <span>${subject}</span></label>`;
        }).join('');
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    emailBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openModal();
    });

    modal.addEventListener('click', function(event) {
        if (event.target && event.target.dataset && event.target.dataset.close) {
            closeModal();
        }
    });

    sendBtn.addEventListener('click', function() {
        const selected = optionsWrap.querySelector('input[name=\"contactSubject\"]:checked');
        const subject = selected ? selected.value : subjects.en[0];
        const lang = htmlRoot.getAttribute('lang') || 'en';
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const greeting = lang === 'ar' ? "مرحبًا يوسف،" : "Hi Youssef,";
        const bodyLines = [greeting, ""];
        if (name) bodyLines.push((lang === 'ar' ? "الاسم: " : "Name: ") + name);
        if (email) bodyLines.push((lang === 'ar' ? "البريد: " : "Email: ") + email);
        if (message) {
            bodyLines.push("");
            bodyLines.push(message);
        }
        const body = bodyLines.join("\\n");
        const mailto = `mailto:youssefblackendev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        closeModal();
    });
});
