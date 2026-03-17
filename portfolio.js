    (function() {
      // theme
      const toggle = document.getElementById('themeToggle');
      const icon = document.getElementById('themeIcon');
      const body = document.body;
      function setTheme(theme) {
        if (theme === 'dark') { body.classList.add('dark-theme'); icon.classList.replace('fa-moon', 'fa-sun'); } 
        else { body.classList.remove('dark-theme'); icon.classList.replace('fa-sun', 'fa-moon'); }
        localStorage.setItem('theme', theme);
      }
      const saved = localStorage.getItem('theme') || 'light';
      setTheme(saved);
      toggle.addEventListener('click', () => {
        setTheme(body.classList.contains('dark-theme') ? 'light' : 'dark');
      });

      // typed
      const typed = document.getElementById('typed-role');
      const phrases = ['DevOps engineer', 'automation addict', 'cloud native', 'container enthusiast'];
      let i = 0, j = 0, deleting = false;
      function typeEffect() {
        const current = phrases[i];
        if (deleting) { j--; typed.textContent = current.substring(0, j); } 
        else { j++; typed.textContent = current.substring(0, j); }
        if (!deleting && j === current.length) { deleting = true; setTimeout(typeEffect, 1600); } 
        else if (deleting && j === 0) { deleting = false; i = (i + 1) % phrases.length; setTimeout(typeEffect, 200); } 
        else { setTimeout(typeEffect, deleting ? 40 : 80); }
      }
      typeEffect();

      // progress bars & scroll reveal
      const bars = document.querySelectorAll('.bar-fill');
      function fillBars() { bars.forEach(b => { let w = b.getAttribute('data-width'); if (w) b.style.width = w + '%'; }); }
      const fades = document.querySelectorAll('.fade-up');
      function checkFade() {
        fades.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 90) el.classList.add('appear'); });
      }
      window.addEventListener('load', () => { fillBars(); checkFade(); });
      window.addEventListener('scroll', checkFade);
      setTimeout(() => { fillBars(); checkFade(); }, 200);
    })();