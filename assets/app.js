(() => {
  const d = window.PORTFOLIO_DATA;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const tags = (items) => `<div class="tags">${items.map(x => `<span>${x}</span>`).join("")}</div>`;
  const link = (href, label, cls = "text-link") => `<a class="${cls}" href="${href}" target="_blank" rel="noreferrer">${label} ↗</a>`;

  document.title = `${d.profile.name} — ${d.profile.title}`;
  const desc = `${d.profile.name} — ${d.profile.positioning}. ${d.profile.years} years building enterprise backend systems with Java, Kotlin, Spring, messaging and data platforms.`;
  const setMeta = (sel, content) => { const m = $(sel); if (m) m.setAttribute("content", content); };
  setMeta('meta[name="description"]', desc);
  setMeta('meta[property="og:title"]', `${d.profile.name} — ${d.profile.positioning}`);
  setMeta('meta[property="og:description"]', desc);
  setMeta('meta[name="twitter:title"]', `${d.profile.name} — ${d.profile.positioning}`);
  setMeta('meta[name="twitter:description"]', desc);
  setMeta('meta[property="og:image"]', d.profile.avatar);
  setMeta('meta[name="twitter:image"]', d.profile.avatar);

  $("#brand").textContent = d.profile.name;
  $("#hero-badge").textContent = `${d.profile.title} · ${d.profile.positioning} · ${d.profile.location}`;
  $("#hero-summary").textContent = d.profile.summary;
  $("#avatar").src = d.profile.avatar;
  $("#avatar").alt = `${d.profile.name} profile photo`;
  $("#cv-top").href = d.profile.cv;
  $("#github-top").href = d.profile.github;
  $("#linkedin-top").href = d.profile.linkedin;
  $("#email-top").href = `mailto:${d.profile.email}`;
  $("#nouraajd-hero-link").href = d.nouraajdCase.repo;

  $("#signals").replaceChildren(...d.heroSignals.map(s => {
    const n = el("article", "signal-card");
    n.innerHTML = `<strong>${s.value}</strong><span>${s.label}</span>`;
    return n;
  }));

  $("#capability-grid").replaceChildren(...d.capabilities.map(c => {
    const n = el("article", `cap-card${c.emphasis ? " cap-card--primary" : ""}`);
    n.innerHTML = `<h3>${c.title}</h3>${tags(c.items)}`;
    return n;
  }));

  $("#flagship-title").textContent = d.flagship.name;
  $("#flagship-eyebrow").textContent = d.flagship.eyebrow;
  $("#flagship-summary").textContent = d.flagship.summary;
  $("#flagship-tags").innerHTML = tags(d.flagship.tags);
  $("#flagship-decisions").innerHTML = d.flagship.decisions.map(x => `<li>${x}</li>`).join("");
  $("#flagship-quality").textContent = d.flagship.quality.join(" · ");
  $("#flagship-link").href = d.flagship.repo;

  const nouraajd = d.nouraajdCase;
  $("#nouraajd-title").textContent = nouraajd.name;
  $("#nouraajd-eyebrow").textContent = nouraajd.eyebrow;
  $("#nouraajd-summary").textContent = nouraajd.summary;
  $("#nouraajd-proofs").replaceChildren(...nouraajd.proofs.map(p => {
    const n = el("div", "proof-card");
    n.innerHTML = `<small>${p.label}</small><strong>${p.value}</strong>`;
    return n;
  }));
  $("#nouraajd-tags").innerHTML = tags(nouraajd.tags);
  $("#nouraajd-link").href = nouraajd.repo;
  $("#nouraajd-walkthrough").href = nouraajd.walkthrough;
  $("#nouraajd-media-link").href = nouraajd.walkthrough;
  $("#nouraajd-image").src = nouraajd.image;
  $("#nouraajd-image").alt = nouraajd.imageAlt;

  $("#kotlin-title").textContent = d.kotlinCase.name;
  $("#kotlin-eyebrow").textContent = d.kotlinCase.eyebrow;
  $("#kotlin-summary").textContent = d.kotlinCase.summary;
  $("#kotlin-tags").innerHTML = tags(d.kotlinCase.tags);
  $("#kotlin-decisions").innerHTML = d.kotlinCase.decisions.map(x => `<li>${x}</li>`).join("");
  $("#kotlin-link").href = d.kotlinCase.repo;
  const kotlinLive = $("#kotlin-live");
  if (d.kotlinCase.live) kotlinLive.href = d.kotlinCase.live;
  else kotlinLive.hidden = true;

  $("#jvm-lab-title").textContent = d.jvmLab.name;
  $("#jvm-lab-summary").textContent = d.jvmLab.summary;
  $("#jvm-lab-topics").innerHTML = tags(d.jvmLab.topics);
  $("#jvm-lab-link").href = d.jvmLab.repo;

  $("#experience-list").replaceChildren(...d.experience.map((r, i) => {
    const n = el("article", "role-card");
    n.innerHTML = `
      <div class="role-period">${r.period}</div>
      <div>
        <div class="role-index">0${i + 1}</div>
        <h3>${r.title}</h3>
        <div class="role-company">${r.company}</div>
        <p>${r.technical}</p>
        <p class="secondary">${r.secondary}</p>
        ${tags(r.stack)}
      </div>`;
    return n;
  }));

  const impact = d.impactStory;
  $("#impact-story").innerHTML = `
    <div class="kicker">Measured impact</div>
    <h3>${impact.title}</h3>
    <div class="impact-grid">
      <div><span>Problem</span><p>${impact.problem}</p></div>
      <div><span>Intervention</span><p>${impact.intervention}</p></div>
      <div><span>Outcome</span><p>${impact.outcome}</p></div>
    </div>`;

  $("#decision-grid").replaceChildren(...d.architectureDecisions.map(x => {
    const n = el("article", "decision-card");
    n.innerHTML = `
      <span class="source">${x.source}</span>
      <h3>${x.title}</h3>
      <dl><dt>Decision</dt><dd>${x.decision}</dd><dt>Trade-off</dt><dd>${x.tradeoff}</dd></dl>
      ${link(x.repo, "Source")}`;
    return n;
  }));

  $("#breadth-grid").replaceChildren(...d.breadth.map(x => {
    const n = el("article", "breadth-card");
    const image = x.image ? `<div class="project-media"><img src="${x.image}" loading="lazy" alt="${x.imageAlt}"></div>` : `<div class="project-media project-media--code" aria-hidden="true"><span>${x.category}</span></div>`;
    n.innerHTML = `
      ${image}
      <div class="breadth-body">
        <span class="source">${x.category}</span>
        <h3>${x.name}</h3>
        <p>${x.summary}</p>
        ${tags(x.tags)}
        <div class="inline-links">${link(x.repo, "Repository")}${x.secondaryRepo ? link(x.secondaryRepo, "Related repo") : ""}</div>
      </div>`;
    return n;
  }));

  $("#taxonomy").innerHTML = d.taxonomy.map(x => `<span>${x}</span>`).join("");

  $("#education-list").replaceChildren(...d.education.map(e => {
    const n = el("article", "education-card");
    n.innerHTML = `<div><span>${e.period}</span><h3>${e.institution}</h3><strong>${e.program}</strong><p>${e.detail}</p></div>`;
    return n;
  }));
  $("#certifications").innerHTML = d.certifications.map(x => `<li>${x}</li>`).join("");
  $("#cert-link").href = d.profile.linkedin;

  $("#principles-grid").replaceChildren(...d.principles.map(p => {
    const n = el("article", "principle-card");
    n.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p>`;
    return n;
  }));

  $("#cv-bottom").href = d.profile.cv;
  $("#github-bottom").href = d.profile.github;
  $("#linkedin-bottom").href = d.profile.linkedin;
  $("#email-bottom").href = `mailto:${d.profile.email}`;
  $("#email-label").textContent = d.profile.email;
  $("#footer-year").textContent = new Date().getFullYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: d.profile.name,
    jobTitle: d.profile.positioning,
    address: { "@type": "PostalAddress", addressLocality: "Kraków", addressCountry: "PL" },
    url: "https://lisu188.github.io/frontpage/",
    sameAs: [d.profile.github, d.profile.linkedin],
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "AGH University of Krakow" }],
    knowsAbout: ["Java", "Kotlin", "Spring Boot", "Kafka", "JMS", "Distributed systems", "JVM", "C++", "Python", "Game engines", "Reverse engineering"]
  };
  $("#jsonld").textContent = JSON.stringify(jsonLd);

  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).forEach(e => {
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%" });
  sections.forEach(s => observer.observe(s));
})();