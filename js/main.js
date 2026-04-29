(() => {
  const data = window.PORTFOLIO_DATA;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  let activeWorkIndex = 0;

  function setText(selector, text) {
    const node = $(selector);
    if (node) node.textContent = text;
  }

  function createAnchor({ label, target, href }, className = "") {
    const anchor = document.createElement("a");
    anchor.className = className;
    anchor.textContent = label;
    anchor.href = href || target || "#";
    return anchor;
  }

  function renderNavigation() {
    const topNav = $("#topNav");
    const railNav = $("#railNav");
    topNav.innerHTML = "";
    railNav.innerHTML = "";

    data.nav.forEach((item, index) => {
      const topLink = createAnchor(item, "magnetic");
      const railLink = createAnchor(item, "magnetic");
      topLink.dataset.target = item.target;
      railLink.dataset.target = item.target;
      railLink.setAttribute("aria-label", item.label);
      railLink.textContent = "";
      if (index === 0) {
        topLink.classList.add("is-active");
        railLink.classList.add("is-active");
      }
      topNav.append(topLink);
      railNav.append(railLink);
    });

    const railSocials = $("#railSocials");
    railSocials.innerHTML = "";
    data.socials.slice(0, 3).forEach((item) => {
      const link = createAnchor({ label: item.label, href: item.href }, "magnetic");
      link.target = "_blank";
      link.rel = "noreferrer";
      railSocials.append(link);
    });
  }

  function renderHero() {
    setText("#heroEyebrow", data.hero.eyebrow);
    setText("#heroTitle", data.hero.title);
    setText("#heroSubtitle", data.hero.subtitle);
    setText("#heroIntro", data.hero.intro);
    setText("#personRole", data.person.role);
    setText("#personLocation", data.person.location);

    const portrait = $("#heroPortrait");
    portrait.src = data.person.portrait;
    portrait.alt = `${data.person.name}肖像`;

    const actions = $("#heroActions");
    actions.innerHTML = "";
    actions.append(createAnchor(data.hero.primaryAction, "btn primary magnetic"));
    actions.append(createAnchor(data.hero.secondaryAction, "btn ghost magnetic"));
  }

  function renderAbout() {
    setText("#aboutEyebrow", data.about.eyebrow);
    setText("#aboutTitle", data.about.title);

    const paragraphs = $("#aboutParagraphs");
    paragraphs.innerHTML = "";
    data.about.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      paragraphs.append(p);
    });

    const facts = $("#aboutFacts");
    facts.innerHTML = "";
    data.about.facts.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "fact-item";
      item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      facts.append(item);
    });
  }

  function renderTimeline(list, container) {
    container.innerHTML = "";
    list.forEach((item) => {
      const article = document.createElement("article");
      article.className = "timeline-item";
      article.innerHTML = `
        <div class="timeline-year">${item.year}</div>
        <div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
      `;
      container.append(article);
    });
  }

  function renderSkills() {
    const tools = $("#toolCloud");
    tools.innerHTML = "";
    data.tools.forEach((tool) => {
      const pill = document.createElement("span");
      pill.className = "tool-pill";
      pill.textContent = tool;
      tools.append(pill);
    });

    const bars = $("#skillBars");
    bars.innerHTML = "";
    data.skillGroups.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "skill-group";
      wrap.innerHTML = `<h3>${group.name}</h3>`;
      group.skills.forEach((skill) => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.innerHTML = `
          <span>${skill.label}</span>
          <div class="skill-track"><span style="--value: ${skill.value}%"></span></div>
          <strong>${skill.value}%</strong>
        `;
        wrap.append(row);
      });
      bars.append(wrap);
    });

    const stats = $("#statsRow");
    stats.innerHTML = "";
    data.stats.forEach(([value, label]) => {
      const item = document.createElement("div");
      item.className = "stat-item";
      item.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
      stats.append(item);
    });
  }

  function createWorkCard(work, index) {
    const button = document.createElement("button");
    button.className = "work-card";
    button.type = "button";
    button.dataset.index = index;
    button.setAttribute("aria-label", `预览 ${work.title}`);
    button.innerHTML = `
      <img src="${work.image}" alt="${work.title}" loading="lazy" />
      <span class="work-caption">
        <strong>${work.title}</strong>
        <span>${work.type} / ${work.year}</span>
      </span>
    `;
    button.addEventListener("click", () => openLightbox(index));
    return button;
  }

  function renderWorks() {
    const showcase = $("#showcase");
    showcase.innerHTML = "";
    const rows = [[], [], [], []];
    data.works.forEach((work, index) => rows[index % rows.length].push({ work, index }));

    rows.forEach((row, rowIndex) => {
      const rowEl = document.createElement("div");
      rowEl.className = `showcase-row${rowIndex % 2 ? " reverse" : ""}`;
      rowEl.style.setProperty("--duration", `${64 + rowIndex * 14}s`);

      const track = document.createElement("div");
      track.className = "showcase-track";
      [...row, ...row].forEach(({ work, index }) => track.append(createWorkCard(work, index)));

      rowEl.append(track);
      showcase.append(rowEl);
    });
  }

  function renderContact() {
    setText("#contactEyebrow", data.contact.eyebrow);
    setText("#contactTitle", data.contact.title);
    setText("#contactIntro", data.contact.intro);

    const action = $("#contactAction");
    action.textContent = data.contact.action.label;
    action.href = data.contact.action.href;

    const email = $("#contactEmail");
    email.textContent = data.person.email;
    email.href = `mailto:${data.person.email}`;

    const socials = $("#contactSocials");
    socials.innerHTML = "";
    data.socials.forEach((item) => {
      const link = createAnchor({ label: item.label, href: item.href }, "magnetic");
      link.target = "_blank";
      link.rel = "noreferrer";
      socials.append(link);
    });
  }

  function openLightbox(index) {
    activeWorkIndex = index;
    updateLightbox();
    const lightbox = $("#lightbox");
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
  }

  function closeLightbox() {
    const lightbox = $("#lightbox");
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) lightbox.hidden = true;
    }, 220);
  }

  function moveLightbox(direction) {
    activeWorkIndex = (activeWorkIndex + direction + data.works.length) % data.works.length;
    updateLightbox();
  }

  function updateLightbox() {
    const work = data.works[activeWorkIndex];
    $("#lightboxImage").src = work.image;
    $("#lightboxImage").alt = work.title;
    setText("#lightboxCounter", `${String(activeWorkIndex + 1).padStart(2, "0")} / ${String(data.works.length).padStart(2, "0")}`);
    setText("#lightboxTitle", work.title);
    setText("#lightboxMeta", `${work.type} · ${work.year}`);
    setText("#lightboxDescription", work.description);
  }

  function setupLightbox() {
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
    $("#lightboxNext").addEventListener("click", () => moveLightbox(1));
    $("#lightbox").addEventListener("click", (event) => {
      if (event.target.id === "lightbox") closeLightbox();
    });
    window.addEventListener("keydown", (event) => {
      if ($("#lightbox").hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    });
  }

  function setupMenu() {
    const toggle = $("#menuToggle");
    const links = $$("#topNav a");
    toggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupSectionObserver() {
    const sections = $$("[data-section]");
    const navLinks = [...$$(".topnav a"), ...$$(".rail-nav a")];
    const sectionIndex = $("#sectionIndex");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          const id = `#${section.id}`;
          sectionIndex.textContent = section.dataset.section;
          navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.target === id));
        });
      },
      { threshold: 0.48 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    const revealItems = [
      ".hero-copy",
      ".portrait-stage",
      ".section-title",
      ".about-content",
      ".timeline-item",
      ".skill-panel",
      ".works-heading",
      ".showcase-row",
      ".contact-copy",
      ".contact-panel",
    ];
    $$(revealItems.join(",")).forEach((node) => node.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    $$(".reveal").forEach((node) => observer.observe(node));
  }

  function setupCursor() {
    if (!pointerFine) return;
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };

    window.addEventListener("pointermove", (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
    });

    function tick() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    const refreshInteractive = () => {
      $$("a, button, .work-card").forEach((item) => {
        item.addEventListener("pointerenter", () => ring.classList.add("is-active"));
        item.addEventListener("pointerleave", () => ring.classList.remove("is-active"));
      });
    };
    refreshInteractive();

    $$(".magnetic").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        item.style.transform = `translate(${x}px, ${y}px)`;
      });
      item.addEventListener("pointerleave", () => {
        item.style.transform = "";
      });
    });
  }

  function setupCanvasBackground() {
    const canvas = $("#sceneBg");
    const ctx = canvas.getContext("2d");
    const pointer = { x: 0.55, y: 0.35 };
    let width = 0;
    let height = 0;
    let particles = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(90, Math.max(42, Math.round(width / 18))) }, (_, index) => ({
        x: (index * 139.7) % width,
        y: (index * 83.3) % height,
        vx: ((index % 7) - 3) * 0.035,
        vy: (((index + 3) % 9) - 4) * 0.03,
        r: 0.7 + (index % 4) * 0.22,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const glowX = pointer.x * width;
      const glowY = pointer.y * height;

      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = "rgba(199,255,98,0.11)";
      for (let i = 0; i < 7; i += 1) {
        const y = ((performance.now() * 0.008 + i * 160) % (height + 220)) - 110;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.28, y - 80, width * 0.58, y + 80, width, y - 20);
        ctx.stroke();
      }
      ctx.restore();

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const dist = Math.hypot(p.x - glowX, p.y - glowY);
        const alpha = Math.max(0.08, 0.42 - dist / 780);
        ctx.fillStyle = i % 5 === 0 ? `rgba(241,199,95,${alpha})` : `rgba(199,255,98,${alpha})`;
        ctx.fillRect(p.x, p.y, p.r, p.r);

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 118) {
            ctx.strokeStyle = `rgba(199,255,98,${0.08 * (1 - d / 118)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });

      if (!reduceMotion) requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / Math.max(1, width);
      pointer.y = event.clientY / Math.max(1, height);
    });
    resize();
    draw();
  }

  function boot() {
    renderNavigation();
    renderHero();
    renderAbout();
    renderTimeline(data.experience, $("#experienceList"));
    renderTimeline(data.education, $("#educationList"));
    renderSkills();
    renderWorks();
    renderContact();
    setupLightbox();
    setupMenu();
    setupSectionObserver();
    setupReveal();
    setupCanvasBackground();
    setupCursor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
