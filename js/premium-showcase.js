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
    const projects = Array.from(document.querySelectorAll("[data-project-row]"));
    const feature = document.querySelector("[data-project-feature]");
    const tabs = Array.from(document.querySelectorAll("[data-filter]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!projects.length) return;

    const githubLinks = {
      "FIFA World Cup": "https://github.com/Youssefkhaled74/Php-FifaWorldCup.git",
      Yeesooh: "https://github.com/Youssefkhaled74/Laravel-YesOoh.git",
      Maktabty: "https://github.com/Youssefkhaled74/Maktabty.git",
      "In Save": "https://github.com/Youssefkhaled74/Laravel-KsaProject.git",
      "Lumi Cashier": "https://github.com/Youssefkhaled74/Lumi-Cashier.git",
      "SG Solar": "https://github.com/Youssefkhaled74/SGsolar-laravel.git",
    };

    function escapeHTML(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[character];
      });
    }

    function parseList(value) {
      if (!value) return [];
      return String(value)
        .split("|")
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);
    }

    function renderPills(items, className) {
      const list = Array.isArray(items) ? items : parseList(items);
      const classAttr = className ? ' class="' + className + '"' : "";
      if (!list.length) return "";
      return list
        .map(function (item) {
          return "<span" + classAttr + ">" + escapeHTML(item) + "</span>";
        })
        .join("");
    }

    function getProject(row) {
      const title = row.dataset.title || "Project";
      const impact = parseList(row.dataset.impact);
      const stack = parseList(row.dataset.stack);
      const type = row.dataset.kind === "evyx" ? "Evyx Product" : "Freelance Build";

      return {
        title: title,
        type: type,
        image: row.dataset.image || "",
        desc: row.dataset.desc || "",
        impact: impact,
        features: parseList(row.dataset.features).length ? parseList(row.dataset.features) : impact,
        stack: stack,
        problem: row.dataset.problem || "The product needed a stable backend flow to support growth, cleaner operations, and maintainable delivery.",
        role: row.dataset.role || "I designed and implemented backend architecture, API contracts, business logic, and admin operations.",
        solution: row.dataset.solution || "Implemented modular Laravel backend services with secure validation, clear data models, and scalable dashboard workflows.",
        github: row.dataset.github || githubLinks[title] || "",
      };
    }

    function setText(selector, value, scope) {
      const element = (scope || document).querySelector(selector);
      if (element) element.textContent = value || "";
    }

    function setHTML(selector, value, scope) {
      const element = (scope || document).querySelector(selector);
      if (element) element.innerHTML = value || "";
    }

    function setImage(image, src, alt) {
      if (!image || !src) return;
      if (image.getAttribute("src") !== src) {
        image.src = src;
      }
      image.alt = alt || "Project preview";
      image.loading = "lazy";
      image.decoding = "async";
    }

    function updateFeature(project) {
      if (!feature) return;

      const image = feature.querySelector("img");
      const body = feature.querySelector(".feature-body");

      setImage(image, project.image, project.title + " preview");
      setText("[data-title]", project.title, feature);
      setText("[data-desc]", project.desc, feature);
      setText("[data-type]", project.type, feature);
      setText("[data-problem]", project.problem, feature);
      setText("[data-role]", project.role, feature);
      setHTML("[data-impact]", renderPills(project.impact, ""), feature);
      setHTML("[data-features]", renderPills(project.features, ""), feature);
      setHTML("[data-stack]", renderPills(project.stack, ""), feature);

      feature.dataset.currentTitle = project.title;

      if (body && !prefersReducedMotion.matches) {
        body.classList.remove("is-changing");
        void body.offsetWidth;
        body.classList.add("is-changing");
      }
    }

    function ensureImageBox(image, extraClass) {
      if (!image) return null;

      image.loading = image.loading || "lazy";
      image.decoding = image.decoding || "async";

      const existing = image.closest(".project-image-box");
      if (existing) {
        if (extraClass) existing.classList.add(extraClass);
        return existing;
      }

      const box = document.createElement("div");
      box.className = "project-image-box" + (extraClass ? " " + extraClass : "");
      image.parentNode.insertBefore(box, image);
      box.appendChild(image);
      return box;
    }

    function addStackTags(row) {
      if (row.querySelector(".project-tags")) return;

      const stack = parseList(row.dataset.stack).slice(0, 5);
      if (!stack.length) return;

      const tags = document.createElement("div");
      tags.className = "project-tags";
      tags.setAttribute("aria-label", "Project technologies");
      tags.innerHTML = renderPills(stack, "project-tag-pill");
      row.appendChild(tags);
    }

    function activate(row, options) {
      const config = Object.assign({ scroll: false }, options || {});

      projects.forEach(function (projectRow) {
        const active = projectRow === row;
        projectRow.classList.toggle("active", active);
        projectRow.setAttribute("aria-pressed", String(active));
      });

      updateFeature(getProject(row));

      if (config.scroll && feature && window.innerWidth < 992) {
        feature.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
    }

    function attachPointerGlow(row) {
      if (!canHover.matches || prefersReducedMotion.matches) return;

      let frame = 0;
      let nextX = "50%";
      let nextY = "50%";

      function apply() {
        row.style.setProperty("--x", nextX);
        row.style.setProperty("--y", nextY);
        frame = 0;
      }

      row.addEventListener(
        "pointermove",
        function (event) {
          const rect = row.getBoundingClientRect();
          nextX = event.clientX - rect.left + "px";
          nextY = event.clientY - rect.top + "px";

          if (!frame) {
            frame = window.requestAnimationFrame(apply);
          }
        },
        { passive: true }
      );

      row.addEventListener("pointerleave", function () {
        nextX = "50%";
        nextY = "50%";
        if (!frame) frame = window.requestAnimationFrame(apply);
      });
    }

    function initRows() {
      projects.forEach(function (row, index) {
        const image = row.querySelector("img");
        ensureImageBox(image, "row-image-box");
        addStackTags(row);

        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-pressed", row.classList.contains("active") ? "true" : "false");
        row.style.setProperty("--x", "50%");
        row.style.setProperty("--y", "50%");

        if (!row.hasAttribute("data-aos-delay")) {
          row.setAttribute("data-aos-delay", String(Math.min(index * 35, 220)));
        }

        row.addEventListener("click", function () {
          activate(row, { scroll: false });
        });

        row.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate(row, { scroll: true });
          }
        });

        attachPointerGlow(row);
      });
    }

    function initTabs() {
      tabs.forEach(function (tab) {
        tab.type = "button";
        tab.setAttribute("aria-pressed", tab.classList.contains("active") ? "true" : "false");

        tab.addEventListener("click", function () {
          const filter = tab.dataset.filter || "all";
          let firstVisible = null;

          tabs.forEach(function (button) {
            const active = button === tab;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
          });

          projects.forEach(function (row) {
            const visible = filter === "all" || row.dataset.kind === filter;
            row.classList.toggle("is-hidden", !visible);
            row.hidden = !visible;
            if (visible && !firstVisible) firstVisible = row;
          });

          if (firstVisible) activate(firstVisible, { scroll: false });
        });
      });
    }

    function initRevealObserver() {
      const revealItems = Array.from(document.querySelectorAll(".reveal-up"));
      if (!revealItems.length) return;

      if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) {
          item.classList.add("in-view");
        });
        return;
      }

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    }

    function initModal() {
      const modal = document.getElementById("caseStudyModal");
      const openButton = document.querySelector("[data-open-case-study]");
      const closeTargets = Array.from(document.querySelectorAll("[data-close-case-study]"));
      let lastFocused = null;

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

        const github = modal.querySelector("[data-modal-github]");
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
        const active = document.querySelector(".project-row.active") || projects[0];
        if (!active) return;

        lastFocused = document.activeElement;
        populate(getProject(active));
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const close = modal.querySelector("[data-close-case-study]");
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

      openButton.addEventListener("click", openModal);

      closeTargets.forEach(function (target) {
        target.addEventListener("click", closeModal);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("open")) {
          closeModal();
        }
      });
    }

    projects.forEach(function (row) {
      const img = row.querySelector("img");
      if (img) {
        img.loading = "lazy";
        img.decoding = "async";
      }
    });

    if (feature) {
      const featureImg = feature.querySelector("img");
      ensureImageBox(featureImg, "feature-image-box");
    }

    document.querySelectorAll(".freelance-card > img, .project-feature img, .case-modal img").forEach(function (img) {
      img.loading = img.closest(".case-modal") ? "lazy" : img.loading || "lazy";
      img.decoding = "async";
    });

    initRows();
    initTabs();
    initRevealObserver();
    initModal();

    const initiallyActive = projects.find(function (row) {
      return row.classList.contains("active") && !row.hidden;
    }) || projects[0];

    if (initiallyActive) {
      activate(initiallyActive, { scroll: false });
    }
  });
})();
