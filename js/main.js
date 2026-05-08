(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function safeStorageGet(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be blocked in private/file contexts. Ignore safely.
    }
  }

  window.opentab = function opentab(tabName, eventOrElement) {
    const target = document.getElementById(tabName);
    if (!target) return;

    document.querySelectorAll(".tab-links").forEach(function (tab) {
      tab.classList.remove("active-links");
    });

    document.querySelectorAll(".tab-contents").forEach(function (content) {
      content.classList.remove("tab-active");
    });

    const trigger = eventOrElement && eventOrElement.currentTarget ? eventOrElement.currentTarget : eventOrElement;
    if (trigger && trigger.classList) {
      trigger.classList.add("active-links");
    }

    target.classList.add("tab-active");
  };

  window.openmenu = function openmenu() {
    const sideMenu = document.getElementById("sidemenu");
    if (sideMenu) sideMenu.style.right = "0";
  };

  window.closemenu = function closemenu() {
    const sideMenu = document.getElementById("sidemenu");
    if (sideMenu) sideMenu.style.right = "-200px";
  };

  function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    window.addEventListener(
      "load",
      function () {
        window.setTimeout(function () {
          preloader.classList.add("hide");
        }, prefersReducedMotion.matches ? 0 : 250);
      },
      { once: true }
    );
  }

  function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
      duration: prefersReducedMotion.matches ? 0 : 420,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 60,
      disable: function () {
        return prefersReducedMotion.matches || window.innerWidth < 700;
      },
    });
  }

  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const icon = toggle ? toggle.querySelector("i") : null;
    const savedTheme = safeStorageGet("theme", "dark");

    root.setAttribute("data-theme", savedTheme);

    function updateIcon(theme) {
      if (!icon) return;
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }

    updateIcon(savedTheme);

    if (!toggle) return;

    toggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      safeStorageSet("theme", next);
      updateIcon(next);
    });
  }

  function initScrollUI() {
    const scrollTopBtn = document.getElementById("scrollTop");
    const navbar = document.querySelector(".navbar");
    let ticking = false;

    function update() {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("active", scrollY > 300);
      }

      if (navbar) {
        navbar.classList.toggle("navbar-shrink", scrollY > 50);
      }

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      });
    }
  }

  function initKnowledgeFilters() {
    const chips = Array.from(document.querySelectorAll(".filter-chip"));
    const cards = Array.from(document.querySelectorAll(".knowledge-card[data-category]"));

    if (!chips.length || !cards.length) return;

    chips.forEach(function (chip) {
      chip.type = chip.type || "button";
      chip.addEventListener("click", function () {
        const filter = chip.dataset.filter || "all";

        chips.forEach(function (btn) {
          const isActive = btn === chip;
          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach(function (card) {
          const isVisible = filter === "all" || card.dataset.category === filter;
          card.hidden = !isVisible;
        });
      });
    });
  }

  function initLectureModal() {
    const viewButtons = Array.from(document.querySelectorAll(".view-lecture"));
    if (!viewButtons.length || typeof bootstrap === "undefined") return;

    const modalHtml =
      '<div class="modal fade" id="lectureModal" tabindex="-1" aria-labelledby="lectureModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog modal-xl modal-fullscreen-lg-down">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<h5 class="modal-title" id="lectureModalLabel">Lecture</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
      "</div>" +
      '<div class="modal-body">' +
      '<div id="htmlContent" style="display:none;"><iframe id="lectureFrame" title="Lecture preview" style="width:100%;height:80vh;border:none;"></iframe></div>' +
      '<div id="markdownContent" class="markdown-content" style="display:none;"></div>' +
      "</div>" +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
      '<a id="openInNewTab" href="#" target="_blank" rel="noopener" class="btn btn-primary">Open in New Tab</a>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modalEl = document.getElementById("lectureModal");
    const modal = new bootstrap.Modal(modalEl);
    const titleEl = document.getElementById("lectureModalLabel");
    const openInNewTab = document.getElementById("openInNewTab");
    const htmlContent = document.getElementById("htmlContent");
    const markdownContent = document.getElementById("markdownContent");
    const lectureFrame = document.getElementById("lectureFrame");

    viewButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();

        const defaultPath = button.getAttribute("data-lecture");
        const arabicPath = button.getAttribute("data-lecture-ar");
        const currentLang = root.lang || "en";
        const lecturePath = currentLang === "ar" && arabicPath ? arabicPath : defaultPath;
        const lectureType = button.getAttribute("data-type") || (lecturePath && lecturePath.endsWith(".md") ? "markdown" : "html");

        if (!lecturePath || lecturePath === "#") {
          window.alert("This lecture is coming soon! Stay tuned for updates.");
          return;
        }

        const card = button.closest(".knowledge-card");
        const title = card && card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "Lecture";
        titleEl.textContent = title;
        openInNewTab.href = lecturePath;

        if (lectureType === "markdown") {
          htmlContent.style.display = "none";
          lectureFrame.removeAttribute("src");
          markdownContent.style.display = "block";
          markdownContent.innerHTML = '<div class="alert alert-info">Loading...</div>';

          fetch(lecturePath)
            .then(function (response) {
              if (!response.ok) throw new Error("Unable to load lecture");
              return response.text();
            })
            .then(function (text) {
              markdownContent.innerHTML = typeof marked !== "undefined" ? marked.parse(text) : "<pre></pre>";
              if (typeof marked === "undefined") {
                markdownContent.querySelector("pre").textContent = text;
              }
            })
            .catch(function (error) {
              const hint = window.location.protocol === "file:" ? "Open the site through a local server or use Open in New Tab." : "Use Open in New Tab.";
              markdownContent.innerHTML = '<div class="alert alert-danger">Error loading content: ' + error.message + ". " + hint + "</div>";
            });
        } else {
          markdownContent.style.display = "none";
          markdownContent.innerHTML = "";
          htmlContent.style.display = "block";
          lectureFrame.src = lecturePath;
        }

        modal.show();
      });
    });
  }

  ready(function () {
    initPreloader();
    initAOS();
    initTheme();
    initScrollUI();
    initKnowledgeFilters();
    initLectureModal();
  });
})();
