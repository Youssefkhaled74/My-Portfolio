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

  function activate(row) {
    projects.forEach(function (p) {
      p.classList.remove("active");
    });
    row.classList.add("active");

    if (!feature) return;
    const featureImage = feature.querySelector("img");
    featureImage.src = row.dataset.image;
    featureImage.alt = row.dataset.title + " preview";
    feature.querySelector("[data-title]").textContent = row.dataset.title;
    feature.querySelector("[data-desc]").textContent = row.dataset.desc;
    feature.querySelector("[data-type]").textContent = row.dataset.kind === "evyx" ? "Evyx Product" : "Freelance Build";
    feature.querySelector("[data-impact]").innerHTML = row.dataset.impact
      .split("|")
      .map(function (x) {
        return "<span>" + escapeHTML(x) + "</span>";
      })
      .join("");
    feature.querySelector("[data-stack]").innerHTML = parseStack(row.dataset.stack)
      .map(function (x) {
        return "<span>" + escapeHTML(x) + "</span>";
      })
      .join("");
  }

  projects.forEach(function (row, index) {
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
})();
