(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    var projects = Array.prototype.slice.call(document.querySelectorAll("[data-project-row]"));
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var siteGlow = document.querySelector(".site-mouse-glow");
    var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    function initGlobalMouseGlow() {
      if (!siteGlow || prefersReducedMotion.matches || isCoarsePointer) return;

      var rafId = 0;
      function updateGlow(x, y) {
        document.documentElement.style.setProperty("--mx", x + "px");
        document.documentElement.style.setProperty("--my", y + "px");
      }

      window.addEventListener("mousemove", function (event) {
        if (rafId) return;
        var nextX = event.clientX;
        var nextY = event.clientY;
        rafId = window.requestAnimationFrame(function () {
          updateGlow(nextX, nextY);
          rafId = 0;
        });
      });

      updateGlow(window.innerWidth * 0.5, window.innerHeight * 0.42);
    }

    initGlobalMouseGlow();

    var feature = document.querySelector("[data-project-feature]");
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

    if (!projects.length) return;

    var githubLinks = {
      "FIFA World Cup": "https://github.com/Youssefkhaled74/Php-FifaWorldCup.git",
      "Yeesooh": "https://github.com/Youssefkhaled74/Laravel-YesOoh.git",
      "Maktabty": "https://github.com/Youssefkhaled74/Maktabty.git",
      "In Save": "https://github.com/Youssefkhaled74/Laravel-KsaProject.git",
      "Lumi Cashier": "https://github.com/Youssefkhaled74/Lumi-Cashier.git",
      "SG Solar": "https://github.com/Youssefkhaled74/SGsolar-laravel.git"
    };

    var projectMeta = {
      "Ask Lawyer": {
        problem: "Legal consultations need trust, clear request tracking, and controlled dashboard operations.",
        solution: "A Laravel backend with request flows, roles, notifications, and admin visibility for service handling.",
        features: "Consultation requests|Admin workflow|Notifications|Role-based access"
      },
      "Backoffice": {
        problem: "Internal teams need a reliable control layer for users, records, reports, and daily operations.",
        solution: "A structured dashboard backend that keeps operational data organized and easy to manage.",
        features: "Operations dashboard|User records|Reporting|Admin UX"
      },
      "Ceaser": {
        problem: "Restaurant platforms need branch, menu, QR, and location logic to work together cleanly.",
        solution: "A Laravel backend with menu management, QR flows, map integration, and multi-branch operations.",
        features: "QR menus|Branch logic|Google Maps|Dashboard control"
      },
      "Egypin": {
        problem: "Digital product operations need secure validation, clean orders, and admin-level visibility.",
        solution: "A backend structure for order processing, user actions, validation, and dashboard management.",
        features: "Order flow|Validation|Admin dashboard|Product operations"
      },
      "Empon": {
        problem: "Business apps need modular endpoints that can support app and dashboard workflows together.",
        solution: "A modular Laravel API layer with authentication, clean endpoints, and maintainable modules.",
        features: "Authentication|Modular backend|REST endpoints|Dashboard actions"
      },
      "Ezzelmnofy": {
        problem: "Content and service platforms need simple content management without messy backend structure.",
        solution: "A Laravel content backend with categories, media handling, and dashboard-based management.",
        features: "CMS logic|Categories|Media handling|Admin control"
      },
      "Fakka": {
        problem: "Transaction-focused products need auditability, validation, and clear admin visibility.",
        solution: "A transaction-aware backend with records, validations, and dashboard monitoring.",
        features: "Transactions|Audit records|Validation|Admin visibility"
      },
      "Lamavie": {
        problem: "Commerce products need catalog, orders, and mobile-ready API flows.",
        solution: "A Laravel commerce backend with catalog management, order logic, and clean API delivery.",
        features: "Catalog|Orders|Mobile APIs|Admin management"
      },
      "Maxliss": {
        problem: "Product showcase platforms need clean content structure and easy operational updates.",
        solution: "A dashboard-managed backend for products, sections, content, and structured data.",
        features: "Product showcase|CMS dashboard|Structured data|Admin control"
      },
      "Peking": {
        problem: "Restaurant products need menu, ordering, branch, and dashboard flows in one backend.",
        solution: "A restaurant backend with menu systems, order structure, and branch operations.",
        features: "Menu system|Orders|Branch operations|Dashboard"
      },
      "FIFA World Cup": {
        problem: "Tournament data needs a clear interface for groups, teams, matches, and statistics.",
        solution: "A native PHP tournament platform that organizes World Cup data and screens.",
        features: "Groups|Teams|Statistics|Native PHP"
      },
      "Yeesooh": {
        problem: "A creative company needed a professional website to present services and portfolio work.",
        solution: "A Laravel website with service presentation, portfolio sections, and a simple contact journey.",
        features: "Company website|Services|Portfolio|Contact flow"
      },
      "Maktabty": {
        problem: "Library operations need inventory, book records, users, and order handling in one place.",
        solution: "A PHP/MySQL platform for inventory, books, orders, users, and admin management.",
        features: "Inventory|Books|Orders|Admin dashboard"
      },
      "In Save": {
        problem: "Lost-item reporting needs a fast, organized workflow for users and support teams.",
        solution: "A Laravel-based reporting flow designed around item details, location context, and follow-up.",
        features: "Lost items|Reporting flow|Security support|API backend"
      },
      "Lumi Cashier": {
        problem: "Sales teams need fast cashier flows, invoice handling, and daily operational reports.",
        solution: "A Laravel POS-style backend for products, invoices, daily sales, and reporting.",
        features: "Cashier flow|Invoices|Daily reports|Sales operations"
      },
      "SG Solar": {
        problem: "A solar services business needed a credible website that turns service interest into leads.",
        solution: "A Laravel service website with catalog presentation, lead collection, and contact conversion.",
        features: "Services catalog|Lead collection|Business website|Contact conversion"
      }
    };

    function escapeHTML(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[character];
      });
    }

    function parseList(value) {
      if (!value) return [];
      return String(value).split("|").map(function (item) { return item.trim(); }).filter(Boolean);
    }

    function renderPills(items, className) {
      var list = Array.isArray(items) ? items : parseList(items);
      var attr = className ? ' class="' + className + '"' : "";
      return list.map(function (item) { return "<span" + attr + ">" + escapeHTML(item) + "</span>"; }).join("");
    }

    function setText(selector, value, scope) {
      var element = (scope || document).querySelector(selector);
      if (element) element.textContent = value || "";
    }

    function setHTML(selector, value, scope) {
      var element = (scope || document).querySelector(selector);
      if (element) element.innerHTML = value || "";
    }

    function setImage(image, src, alt) {
      if (!image || !src) return;
      if (image.getAttribute("src") !== src) image.src = src;
      image.alt = alt || "Project preview";
      image.loading = "lazy";
      image.decoding = "async";
    }

    function ensureImageBox(image, extraClass) {
      if (!image) return null;
      image.loading = image.loading || "lazy";
      image.decoding = image.decoding || "async";

      var existing = image.closest(".project-image-box");
      if (existing) {
        if (extraClass) existing.classList.add(extraClass);
        return existing;
      }

      var box = document.createElement("div");
      box.className = "project-image-box" + (extraClass ? " " + extraClass : "");
      image.parentNode.insertBefore(box, image);
      box.appendChild(image);
      return box;
    }

    function getProject(row) {
      var title = row.dataset.title || "Project";
      var meta = projectMeta[title] || {};
      var stack = parseList(row.dataset.stack);
      var impact = parseList(row.dataset.impact);
      var features = parseList(row.dataset.features || meta.features).length ? parseList(row.dataset.features || meta.features) : impact;

      return {
        title: title,
        type: row.dataset.kind === "evyx" ? "Evyx Product" : "Freelance Build",
        image: row.dataset.image || "",
        desc: row.dataset.desc || "",
        impact: impact,
        features: features,
        stack: stack,
        problem: row.dataset.problem || meta.problem || "The product needed a stable backend flow, cleaner operations, and reliable delivery.",
        role: row.dataset.role || "Backend architecture, API contracts, business logic, database structure, and admin operations.",
        solution: row.dataset.solution || meta.solution || "A maintainable Laravel backend with secure validation, clean modules, and dashboard-ready workflows.",
        github: row.dataset.github || githubLinks[title] || ""
      };
    }

    function updateFeature(project) {
      if (!feature) return;
      setImage(feature.querySelector("img"), project.image, project.title + " preview");
      setText("[data-title]", project.title, feature);
      setText("[data-desc]", project.desc, feature);
      setText("[data-type]", project.type, feature);
      setText("[data-problem]", project.problem, feature);
      setText("[data-role]", project.role, feature);
      setHTML("[data-impact]", renderPills(project.impact, ""), feature);
      setHTML("[data-features]", renderPills(project.features, ""), feature);
      setHTML("[data-stack]", renderPills(project.stack, ""), feature);

      var body = feature.querySelector(".feature-body");
      if (body && !prefersReducedMotion.matches) {
        body.classList.remove("is-changing");
        window.requestAnimationFrame(function () { body.classList.add("is-changing"); });
      }
    }

    function addStackTags(row) {
      if (row.querySelector(".project-tags")) return;
      var tags = parseList(row.dataset.stack).slice(0, 4);
      if (!tags.length) return;
      var element = document.createElement("div");
      element.className = "project-tags";
      element.setAttribute("aria-label", "Project technologies");
      element.innerHTML = renderPills(tags, "project-tag-pill");
      row.appendChild(element);
    }

    function activate(row, options) {
      var config = Object.assign({ scroll: false }, options || {});
      projects.forEach(function (item) {
        var active = item === row;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateFeature(getProject(row));
      if (config.scroll && feature && window.innerWidth < 992) {
        feature.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
    }

    function initRows() {
      projects.forEach(function (row) {
        ensureImageBox(row.querySelector("img"), "row-image-box");
        addStackTags(row);
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-pressed", row.classList.contains("active") ? "true" : "false");

        row.addEventListener("click", function () { activate(row, { scroll: false }); });
        row.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate(row, { scroll: true });
          }
        });
      });
    }

    function initTabs() {
      tabs.forEach(function (tab) {
        tab.type = "button";
        tab.setAttribute("aria-pressed", tab.classList.contains("active") ? "true" : "false");
        tab.addEventListener("click", function () {
          var filter = tab.dataset.filter || "all";
          var firstVisible = null;

          tabs.forEach(function (button) {
            var active = button === tab;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
          });

          projects.forEach(function (row) {
            var visible = filter === "all" || row.dataset.kind === filter;
            row.classList.toggle("is-hidden", !visible);
            row.hidden = !visible;
            if (visible && !firstVisible) firstVisible = row;
          });

          if (firstVisible) activate(firstVisible, { scroll: false });
        });
      });
    }

    function initRevealObserver() {
      var items = Array.prototype.slice.call(document.querySelectorAll(".reveal-up"));
      if (!items.length) return;
      if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
        items.forEach(function (item) { item.classList.add("in-view"); });
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
      items.forEach(function (item) { observer.observe(item); });
    }

    function initModal() {
      var modal = document.getElementById("caseStudyModal");
      var openButton = document.querySelector("[data-open-case-study]");
      var closeTargets = Array.prototype.slice.call(document.querySelectorAll("[data-close-case-study]"));
      var lastFocused = null;
      if (!modal || !openButton) return;

      function populate(project) {
        setImage(modal.querySelector("[data-modal-image]"), project.image, project.title + " full preview");
        setText("[data-modal-title]", project.title, modal);
        setText("[data-modal-type]", project.type, modal);
        setText("[data-modal-desc]", project.desc, modal);
        setText("[data-modal-problem]", project.problem, modal);
        setText("[data-modal-role]", project.role, modal);
        setText("[data-modal-solution]", project.solution, modal);
        setHTML("[data-modal-features]", renderPills(project.features, ""), modal);
        setHTML("[data-modal-impact]", renderPills(project.impact, ""), modal);
        setHTML("[data-modal-stack]", renderPills(project.stack, ""), modal);

        var github = modal.querySelector("[data-modal-github]");
        if (github) {
          if (project.github) {
            github.href = project.github;
            github.hidden = false;
          } else {
            github.hidden = true;
            github.removeAttribute("href");
          }
        }
      }

      function openModal() {
        var active = document.querySelector(".project-row.active:not([hidden])") || projects[0];
        if (!active) return;
        lastFocused = document.activeElement;
        populate(getProject(active));
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        var close = modal.querySelector("[data-close-case-study]");
        if (close) close.focus({ preventScroll: true });
      }

      function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus({ preventScroll: true });
      }

      openButton.addEventListener("click", openModal);
      closeTargets.forEach(function (target) { target.addEventListener("click", closeModal); });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
      });
    }

    ensureImageBox(feature ? feature.querySelector("img") : null, "feature-image-box");
    document.querySelectorAll(".freelance-card > img, .case-modal img").forEach(function (img) {
      img.loading = img.loading || "lazy";
      img.decoding = "async";
    });

    initRows();
    initTabs();
    initRevealObserver();
    initModal();

    var initiallyActive = projects.filter(function (row) { return !row.hidden; }).find(function (row) { return row.classList.contains("active"); }) || projects[0];
    if (initiallyActive) activate(initiallyActive, { scroll: false });
  });
})();
