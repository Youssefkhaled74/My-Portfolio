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
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hide');
    }, 500);
});

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Theme Toggle System
const themeToggle = document.getElementById('themeToggle');
const htmlRoot = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlRoot.setAttribute('data-theme', savedTheme);
themeToggle.className = savedTheme === 'dark' ? 'fas fa-sun theme-toggle' : 'fas fa-moon theme-toggle';

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.className = newTheme === 'dark' ? 'fas fa-sun theme-toggle' : 'fas fa-moon theme-toggle';
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
    
    // Shrink navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.classList.add('navbar-shrink');
    } else {
        navbar.classList.remove('navbar-shrink');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Language Toggle System
const langToggle = document.getElementById('langToggle');
const translations = {
    en: {
        navbar_brand: "Youssef Khaled",
        nav_home: "Home",
        nav_about: "About",
        nav_services: "Services",
        nav_portfolio: "Portfolio",
        nav_testimonials: "Testimonials",
        nav_contact: "Contact",
        nav_backend: "Back-end Track",
        nav_laravel: "Laravel Advanced",
        nav_data: "Data Analysis",
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
        footer: "Copyright © 2025 Youssef Khaled. Made with <i class='fa-solid fa-heart text-danger'></i>"
    },
    ar: {
        navbar_brand: "يوسف خالد",
        nav_home: "الرئيسية",
        nav_about: "نبذة عني",
        nav_services: "خدماتي",
        nav_portfolio: "مشاريعي",
        nav_testimonials: "آراء العملاء",
        nav_contact: "اتصل بي",
        nav_backend: "مسار الخلفية",
        nav_laravel: "لارافيل متقدم",
        nav_data: "تحليل البيانات",
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
        footer: "حقوق النشر © 2025 يوسف خالد. صنع بـ <i class='fa-solid fa-heart text-danger'></i>"
    }
};

const savedLang = localStorage.getItem('language') || 'en';
htmlRoot.setAttribute('lang', savedLang);
htmlRoot.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
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
(function() {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
})();

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
