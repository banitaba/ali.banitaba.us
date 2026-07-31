(function () {
  const data = window.SITE_DATA;
  const body = document.body;

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function text(value) {
    return String(value || "");
  }

  function setActiveNav() {
    const page = body.dataset.page;
    qsa("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === page);
    });
  }

  function renderWorkGrid() {
    const grid = qs("[data-work-grid]");
    if (!grid) return;

    grid.innerHTML = data.projects.map((project) => `
      <article class="work-card">
        <a href="${project.slug}.html" aria-label="View ${project.title}">
          <img src="${project.cover}" alt="${project.title}">
          <span class="work-meta">${project.year}</span>
          <h2>${project.title}</h2>
          <p>${project.tagline}</p>
        </a>
      </article>
    `).join("");
  }

  function renderAbout() {
    const target = qs("[data-about]");
    if (!target) return;

    target.innerHTML = `
      <p class="lead">${data.about.intro}</p>
      ${data.about.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    `;
  }

  function renderProject() {
    const target = qs("[data-project-content]");
    if (!target) return;

    const slug = body.dataset.project;
    const project = data.projects.find((item) => item.slug === slug);
    if (!project) {
      target.innerHTML = "<p>Project not found.</p>";
      return;
    }

    document.title = `${data.name} - ${project.title}`;
    target.innerHTML = `
      <header class="project-header">
        <p class="eyebrow">${project.year}</p>
        <h1>${project.title}</h1>
        <p class="project-tagline">${project.tagline}</p>
      </header>
      <figure class="hero-image">
        <img src="${project.cover}" alt="${project.title}">
      </figure>
      <section class="project-copy">
        <div>
          <h2>${project.subtitle}</h2>
          ${project.meta.map((item) => `<p class="meta-line">${item}</p>`).join("")}
        </div>
        <div>
          <p>${project.description}</p>
          <p><strong>Software:</strong> ${project.software}</p>
        </div>
      </section>
      <section class="image-stack" aria-label="${project.title} images">
        ${project.images.map((image, index) => `
          <button class="image-button" type="button" data-lightbox="${image}" aria-label="Open image ${index + 1}">
            <img src="${image}" alt="${project.title} image ${index + 1}">
          </button>
        `).join("")}
      </section>
    `;
  }

  function setupContactForm() {
    const form = qs("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = text(formData.get("name"));
      const email = text(formData.get("email"));
      const message = text(formData.get("message"));
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    });
  }

  function setupLightbox() {
    const lightbox = qs("[data-lightbox-dialog]");
    const image = qs("[data-lightbox-image]");
    const close = qs("[data-lightbox-close]");
    if (!lightbox || !image || !close) return;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lightbox]");
      if (!button) return;
      image.src = button.dataset.lightbox;
      lightbox.classList.add("open");
      close.focus();
    });

    close.addEventListener("click", () => {
      lightbox.classList.remove("open");
      image.removeAttribute("src");
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close.click();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) close.click();
    });
  }

  function setFooterYear() {
    qsa("[data-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  }

  setActiveNav();
  renderWorkGrid();
  renderAbout();
  renderProject();
  setupContactForm();
  setupLightbox();
  setFooterYear();
})();
