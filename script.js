const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navbar = document.getElementById("navbar");
const navLinks = navMenu.querySelectorAll("a");
const typewriterEl = document.getElementById("typewriter");
const contactForm = document.getElementById("contactForm");

const typewriterPhrases = [
  "DevOps Engineer",
  "MCA Student @ Chaitanya University",
  "CI/CD Enthusiast",
  "Docker & Linux Geek"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 110;

function toggleMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean"
    ? forceOpen
    : !navMenu.classList.contains("is-open");

  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("nav-open", shouldOpen);
}

function setNavbarState() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 18);
}

function runTypewriter() {
  const currentPhrase = typewriterPhrases[phraseIndex];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typewriterEl.textContent = currentPhrase.slice(0, charIndex);

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeDelay = 1700;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    typeDelay = 280;
  } else {
    typeDelay = isDeleting ? 45 : 95;
  }

  window.setTimeout(runTypewriter, typeDelay);
}

function initReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!context || prefersReducedMotion) {
    return;
  }

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let streams = [];
  let animationFrameId = null;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: random(0, width),
      y: random(0, height),
      radius: random(1, 2.4),
      speedY: random(0.15, 0.55),
      alpha: random(0.12, 0.42)
    };
  }

  function createStream() {
    return {
      x: random(0, width),
      y: random(-height, height),
      length: random(70, 180),
      speedY: random(0.8, 1.8),
      alpha: random(0.05, 0.14)
    };
  }

  function resizeCanvas() {
    const hero = canvas.parentElement;
    const rect = hero.getBoundingClientRect();

    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = Math.max(28, Math.floor(width / 34));
    const streamCount = Math.max(14, Math.floor(width / 90));

    particles = Array.from({ length: particleCount }, createParticle);
    streams = Array.from({ length: streamCount }, createStream);
  }

  function drawBackgroundGlow() {
    const gradient = context.createRadialGradient(
      width * 0.22,
      height * 0.18,
      0,
      width * 0.22,
      height * 0.18,
      width * 0.48
    );

    gradient.addColorStop(0, "rgba(31, 92, 153, 0.16)");
    gradient.addColorStop(1, "rgba(31, 92, 153, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawBackgroundGlow();

    streams.forEach((stream) => {
      stream.y += stream.speedY;

      if (stream.y - stream.length > height) {
        Object.assign(stream, createStream(), { y: -stream.length });
      }

      const streamGradient = context.createLinearGradient(
        stream.x,
        stream.y - stream.length,
        stream.x,
        stream.y
      );

      streamGradient.addColorStop(0, "rgba(0, 255, 171, 0)");
      streamGradient.addColorStop(1, `rgba(0, 255, 171, ${stream.alpha})`);

      context.strokeStyle = streamGradient;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(stream.x, stream.y - stream.length);
      context.lineTo(stream.x, stream.y);
      context.stroke();
    });

    particles.forEach((particle) => {
      particle.y += particle.speedY;

      if (particle.y - particle.radius > height) {
        particle.y = -particle.radius;
        particle.x = random(0, width);
      }

      context.beginPath();
      context.fillStyle = `rgba(229, 237, 245, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    animationFrameId = window.requestAnimationFrame(draw);
  }

  resizeCanvas();
  draw();

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    draw();
  });
}

navToggle.addEventListener("click", () => {
  toggleMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 960) {
      toggleMenu(false);
    }
  });
});

window.addEventListener("scroll", setNavbarState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 960) {
    toggleMenu(false);
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.alert("Thank you for reaching out! Your message has been noted.");
  contactForm.reset();
});

setNavbarState();
runTypewriter();
initReveal();
initHeroCanvas();
