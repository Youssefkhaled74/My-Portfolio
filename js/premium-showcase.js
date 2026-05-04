(function () {
  const projects = Array.from(document.querySelectorAll("[data-project-row]"));
  const feature = document.querySelector("[data-project-feature]");
  const tabs = Array.from(document.querySelectorAll("[data-filter]"));
  const rows = Array.from(document.querySelectorAll("[data-kind]"));

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function parseStack(value) {
    if (!value) return [];
    return value
      .split("|")
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function renderTags(stackRaw) {
    const tags = parseStack(stackRaw).slice(0, 6);
    if (!tags.length) return "";
    return (
      '<div class="project-tags" aria-label="Project technologies">' +
      tags
        .map(function (tag) {
          return '<span class="project-tag-pill">' + escapeHTML(tag) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  const githubLinks = {
    "FIFA World Cup": "https://github.com/Youssefkhaled74/Php-FifaWorldCup.git",
    Yeesooh: "https://github.com/Youssefkhaled74/Laravel-YesOoh.git",
    Maktabty: "https://github.com/Youssefkhaled74/Maktabty.git",
    "In Save": "https://github.com/Youssefkhaled74/Laravel-KsaProject.git",
    "Lumi Cashier": "https://github.com/Youssefkhaled74/Lumi-Cashier.git",
    "SG Solar": "https://github.com/Youssefkhaled74/SGsolar-laravel.git",
  };

  function getProjectDetails(row) {
    const title = row.dataset.title || "Project";
    const defaultProblem = "The product needed a stable backend flow to support growth, cleaner operations, and maintainable delivery.";
    const defaultRole = "I designed and implemented backend architecture, API contracts, business logic, and admin operations.";
    const defaultSolution = "Implemented modular Laravel backend services with secure validation, clear data models, and scalable dashboard workflows.";
    const stack = parseStack(row.dataset.stack);
    return {
      title: title,
      type: row.dataset.kind === "evyx" ? "Evyx Product" : "Freelance Build",
      image: row.dataset.image || "",
      desc: row.dataset.desc || "",
      impact: row.dataset.impact ? row.dataset.impact.split("|") : [],
      features: row.dataset.impact ? row.dataset.impact.split("|") : [],
      stack: stack,
      problem: row.dataset.problem || defaultProblem,
      role: row.dataset.role || defaultRole,
      solution: row.dataset.solution || defaultSolution,
      github: row.dataset.github || githubLinks[title] || "",
    };
  }

  function updateFeatureStory(project) {
    feature.querySelector("[data-title]").textContent = project.title;
    feature.querySelector("[data-desc]").textContent = project.desc;
    feature.querySelector("[data-type]").textContent = project.type;
    feature.querySelector("[data-impact]").innerHTML = project.impact.map(function (x) {
      return "<span>" + escapeHTML(x) + "</span>";
    }).join("");
    feature.querySelector("[data-features]").innerHTML = project.features.map(function (x) {
      return "<span>" + escapeHTML(x) + "</span>";
    }).join("");
    feature.querySelector("[data-stack]").innerHTML = project.stack.map(function (x) {
      return "<span>" + escapeHTML(x) + "</span>";
    }).join("");
    feature.querySelector("[data-problem]").textContent = project.problem;
    feature.querySelector("[data-role]").textContent = project.role;
  }

  function activate(row) {
    projects.forEach(function (p) {
      p.classList.remove("active");
    });
    row.classList.add("active");

    if (!feature) return;
    const project = getProjectDetails(row);
    const featureImage = feature.querySelector("img");
    featureImage.src = row.dataset.image;
    featureImage.alt = row.dataset.title + " preview";
    updateFeatureStory(project);
    feature.dataset.currentTitle = project.title;
  }

  function ensureImageBox(image, extraClass) {
    if (!image || image.closest(".project-image-box")) return;
    const box = document.createElement("div");
    box.className = "project-image-box " + (extraClass || "");
    image.parentNode.insertBefore(box, image);
    box.appendChild(image);
  }

  projects.forEach(function (row, index) {
    ensureImageBox(row.querySelector("img"), "row-image-box");
    row.insertAdjacentHTML("beforeend", renderTags(row.dataset.stack));
    row.setAttribute("data-aos-delay", String(Math.min(index * 45, 260)));
    row.style.setProperty("--x", "50%");
    row.style.setProperty("--y", "50%");
    row.addEventListener("click", function () {
      activate(row);
    });
    row.addEventListener("mousemove", function (e) {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--x", e.clientX - r.left + "px");
      row.style.setProperty("--y", e.clientY - r.top + "px");
    });
    row.addEventListener("mouseleave", function () {
      row.style.setProperty("--x", "50%");
      row.style.setProperty("--y", "50%");
    });
  });

  if (projects[0]) activate(projects[0]);
  ensureImageBox(feature ? feature.querySelector("img") : null, "feature-image-box");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      rows.forEach(function (row) {
        row.style.display = filter === "all" || row.dataset.kind === filter ? "" : "none";
      });
      const first = rows.find(function (row) {
        return row.style.display !== "none";
      });
      if (first) activate(first);
    });
  });

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal-up").forEach(function (el) {
    io.observe(el);
  });

  document.querySelectorAll(".freelance-card,.project-feature").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      if (window.innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateX(" + y * -5 + "deg) rotateY(" + x * 7 + "deg) translateY(-8px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  const modal = document.getElementById("caseStudyModal");
  const openCaseStudy = document.querySelector("[data-open-case-study]");
  const closeTargets = Array.from(document.querySelectorAll("[data-close-case-study]"));

  function populateModal(project) {
    if (!modal) return;
    modal.querySelector("[data-modal-image]").src = project.image;
    modal.querySelector("[data-modal-image]").alt = project.title + " full preview";
    modal.querySelector("[data-modal-title]").textContent = project.title;
    modal.querySelector("[data-modal-type]").textContent = project.type;
    modal.querySelector("[data-modal-desc]").textContent = project.desc;
    modal.querySelector("[data-modal-problem]").textContent = project.problem;
    modal.querySelector("[data-modal-role]").textContent = project.role;
    modal.querySelector("[data-modal-solution]").textContent = project.solution;
    modal.querySelector("[data-modal-features]").innerHTML = project.features.map(function (x) { return "<span>" + escapeHTML(x) + "</span>"; }).join("");
    modal.querySelector("[data-modal-impact]").innerHTML = project.impact.map(function (x) { return "<span>" + escapeHTML(x) + "</span>"; }).join("");
    modal.querySelector("[data-modal-stack]").innerHTML = project.stack.map(function (x) { return "<span>" + escapeHTML(x) + "</span>"; }).join("");
    const github = modal.querySelector("[data-modal-github]");
    if (project.github) {
      github.href = project.github;
      github.style.display = "";
    } else {
      github.style.display = "none";
    }
  }

  function openModal() {
    const active = document.querySelector(".project-row.active");
    if (!active || !modal) return;
    populateModal(getProjectDetails(active));
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (openCaseStudy) {
    openCaseStudy.addEventListener("click", openModal);
  }
  closeTargets.forEach(function (target) {
    target.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });
})();
