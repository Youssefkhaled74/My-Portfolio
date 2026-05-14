(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function parseList(value) {
    if (!value) return [];
    return String(value).split("|").map(function (item) { return item.trim(); }).filter(Boolean);
  }

  function renderPills(items) {
    return items.map(function (item) { return "<span>" + item + "</span>"; }).join("");
  }

  ready(function () {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    var siteGlow = document.querySelector(".site-mouse-glow");
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card[data-project-id]"));
    var featured = document.querySelector(".featured-project[data-project-id]");

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

    function initFilters() {
      if (!tabs.length || !cards.length) return;
      var emptyState = document.querySelector(".projects-empty-message");

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var filter = tab.dataset.filter || "all";
          var visibleCount = 0;

          tabs.forEach(function (button) {
            var active = button === tab;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
          });

          cards.forEach(function (card) {
            var tags = (card.dataset.filters || "").toLowerCase().split(/\s+/).filter(Boolean);
            var visible = filter === "all" || tags.indexOf(filter) !== -1;
            card.hidden = !visible;
            card.classList.toggle("is-hidden", !visible);
            if (visible) visibleCount += 1;
          });

          if (emptyState) {
            emptyState.hidden = visibleCount > 0;
          }
        });
      });
    }

    function getProjectFromElement(element) {
      if (!element) return null;
      return {
        id: element.dataset.projectId || "",
        title: element.dataset.title || "Project",
        type: element.dataset.type || "Project",
        desc: element.dataset.desc || "",
        problem: element.dataset.problem || "",
        role: element.dataset.role || "",
        solution: element.dataset.solution || "",
        image: element.dataset.image || "",
        github: element.dataset.github || "",
        features: parseList(element.dataset.features),
        impact: parseList(element.dataset.impact),
        stack: parseList(element.dataset.stack)
      };
    }

    function setText(scope, selector, value) {
      var target = scope.querySelector(selector);
      if (target) target.textContent = value || "";
    }

    function setHTML(scope, selector, value) {
      var target = scope.querySelector(selector);
      if (target) target.innerHTML = value || "";
    }

    function setImage(scope, selector, src, alt) {
      var target = scope.querySelector(selector);
      if (!target || !src) return;
      target.src = src;
      target.alt = alt || "Project preview";
      target.loading = "lazy";
      target.decoding = "async";
    }

    function initModal() {
      var modal = document.getElementById("caseStudyModal");
      var closeTargets = Array.prototype.slice.call(document.querySelectorAll("[data-close-case-study]"));
      var triggerButtons = Array.prototype.slice.call(document.querySelectorAll("[data-open-case-study]"));
      var lastFocused = null;

      if (!modal || !triggerButtons.length) return;

      function populate(project) {
        if (!project) return;
        setImage(modal, "[data-modal-image]", project.image, project.title + " full preview");
        setText(modal, "[data-modal-title]", project.title);
        setText(modal, "[data-modal-type]", project.type);
        setText(modal, "[data-modal-desc]", project.desc);
        setText(modal, "[data-modal-problem]", project.problem);
        setText(modal, "[data-modal-role]", project.role);
        setText(modal, "[data-modal-solution]", project.solution);
        setHTML(modal, "[data-modal-features]", renderPills(project.features));
        setHTML(modal, "[data-modal-impact]", renderPills(project.impact));
        setHTML(modal, "[data-modal-stack]", renderPills(project.stack));

        var github = modal.querySelector("[data-modal-github]");
        if (github) {
          if (project.github) {
            github.hidden = false;
            github.href = project.github;
          } else {
            github.hidden = true;
            github.removeAttribute("href");
          }
        }
      }

      function openModalFrom(element) {
        var project = getProjectFromElement(element);
        if (!project) return;
        lastFocused = document.activeElement;
        populate(project);
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
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus({ preventScroll: true });
        }
      }

      triggerButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var targetId = button.dataset.projectTarget || "";
          var source = document.querySelector('[data-project-id="' + targetId + '"]') || featured;
          openModalFrom(source);
        });
      });

      closeTargets.forEach(function (target) { target.addEventListener("click", closeModal); });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
      });
    }

    initGlobalMouseGlow();
    initRevealObserver();
    initFilters();
    initModal();
  });
})();
