const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const siteHeader = document.getElementById("siteHeader");
const navLinks = Array.from(navMenu.querySelectorAll("a"));
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = Array.from(document.querySelectorAll("main section[id]"));

function setHeaderState() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean"
    ? forceState
    : !navMenu.classList.contains("is-open");

  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("nav-open", shouldOpen);
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initSectionTracking() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (activeEntry) {
        setActiveLink(activeEntry.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.2, 0.4, 0.6]
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

navToggle.addEventListener("click", () => {
  toggleMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 980) {
      toggleMenu(false);
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 980) {
    toggleMenu(false);
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });

setHeaderState();
initReveal();
initSectionTracking();
setActiveLink("about");
