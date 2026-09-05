(() => {
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const header = document.querySelector(".nav");
  let scheduled = false;

  const update = () => {
    scheduled = false;
    const boundary = (header?.getBoundingClientRect().bottom ?? 0) + 100;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const current = atBottom ? sections.at(-1) : sections.filter(section => section.getBoundingClientRect().top <= boundary).at(-1);
    links.forEach(link => {
      const active = current && link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("active", Boolean(active));
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("hashchange", schedule);
  document.addEventListener("toggle", schedule, true);
  update();
})();
