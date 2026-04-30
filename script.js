const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const siteHeader = document.getElementById("siteHeader");
const navLinks = Array.from(navMenu.querySelectorAll("a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealItems = document.querySelectorAll("[data-reveal]");
const typewriterText = document.getElementById("typewriterText");

const phrases = [
  "CI/CD Automation",
  "Cloud Infrastructure",
  "Containerization",
  "Observability"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function setHeaderState() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean"
    ? forceState
    : !navMenu.classList.contains("is-open");

  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
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
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initSectionTracking() {
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (active) {
        setActiveLink(active.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.2, 0.45, 0.7]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function runTypewriter() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    charIndex += 1;
    typewriterText.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      window.setTimeout(runTypewriter, 1200);
      return;
    }

    window.setTimeout(runTypewriter, 85);
    return;
  }

  charIndex -= 1;
  typewriterText.textContent = currentPhrase.slice(0, charIndex);

  if (charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(runTypewriter, 250);
    return;
  }

  window.setTimeout(runTypewriter, 40);
}

navToggle.addEventListener("click", () => {
  toggleMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 981) {
      toggleMenu(false);
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 981) {
    toggleMenu(false);
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });

setHeaderState();
setActiveLink("about");
initReveal();
initSectionTracking();
runTypewriter();
