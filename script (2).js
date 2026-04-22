/* ============================================================
   MUNAGALA BALAJI — Portfolio JavaScript
   Features: Particles, Typing, Scroll Reveal, Skill Bars,
             Navbar, Hamburger, Form Validation, Smooth Scroll,
             Certificate Button Feedback, Mobile Touch Cards
   ============================================================ */

'use strict';

/* ============================================================
   1. PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const particles = [];
  const COUNT     = 80;                          // FIX: reduced from 90 → better perf on mobile
  const COLORS    = ['rgba(79,142,255,', 'rgba(155,92,255,', 'rgba(0,229,255,'];
  const MAX_DIST  = 130;

  /* Resize — debounced to avoid thrashing on mobile */
  let resizeTimer;
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, 100);
  }
  window.addEventListener('resize', resize);
  W = canvas.width  = window.innerWidth;   // immediate first run (no debounce)
  H = canvas.height = window.innerHeight;

  function makeParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.45,
      vy:    (Math.random() - 0.5) * 0.45,
      r:     Math.random() * 1.8 + 0.5,
      col:   COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  /* FIX: pause animation when tab is hidden — saves CPU/battery */
  let animId;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();
    });

    /* Connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,142,255,${opacity})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  /* Pause when tab is not visible */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  draw();
})();


/* ============================================================
   2. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Turning Business Data into Strategic Insights',
    'Data Analyst · BBA Graduate',
    'Marketing · HR · Business Analytics',
    'Transforming Numbers into Narratives',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let delay      = 80;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 38;                                // FIX: slightly faster delete feels snappier
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      delay      = 2200;                         // pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay      = 420;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 900);
})();


/* ============================================================
   3. STICKY NAVBAR — scroll class + active section highlight
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function onScroll() {
    /* Scrolled class for glass effect */
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    /* Active link — find the last section whose top is above the fold midpoint */
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 140) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialise on load
})();


/* ============================================================
   4. HAMBURGER MOBILE MENU
   ============================================================ */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('nav-links');
  if (!btn || !menu) return;

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  /* Close on nav link click */
  menu.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', closeMenu));

  /* FIX: also close menu when user clicks outside navbar on mobile */
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });
})();


/* ============================================================
   5. SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      /* Stagger siblings */
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal')
      );
      const idx   = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 100, 400);

      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. SKILL BAR ANIMATION — animate on scroll into view
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('animated'), 250);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ============================================================
   7. SMOOTH SCROLLING — internal anchor links only
   FIX: now skips certificate links (href ending in .pdf) so they
   don't get intercepted by the scroll handler
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ============================================================
   8. MOBILE TOUCH SUPPORT FOR PROJECT CARDS
   NEW: On touch devices hover doesn't work, so a tap toggles
   the card flip so users can still see the back + cert buttons
   ============================================================ */
(function initProjectCardTouch() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  /* Only activate on touch-capable devices */
  const isTouch = () => window.matchMedia('(hover: none)').matches;

  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (!isTouch()) return;

      /* Allow certificate button clicks to pass through */
      if (e.target.closest('.cert-btn')) return;

      /* Toggle flipped state */
      const isFlipped = card.classList.contains('flipped');
      /* Close all other cards first */
      cards.forEach(c => c.classList.remove('flipped'));
      if (!isFlipped) card.classList.add('flipped');
    });
  });
})();


/* ============================================================
   9. CERTIFICATE BUTTON FEEDBACK
   NEW: Shows a brief "Opening…" / "Downloading…" tooltip
   so the user knows their click registered
   ============================================================ */
(function initCertButtons() {
  document.querySelectorAll('.cert-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      /* Don't interfere with the actual link navigation */
      const isDownload = this.hasAttribute('download');
      const label      = isDownload ? '⬇ Downloading…' : '🔍 Opening…';
      const original   = this.innerHTML;

      this.innerHTML  = label;
      this.style.opacity = '0.7';
      this.style.pointerEvents = 'none';

      setTimeout(() => {
        this.innerHTML  = original;
        this.style.opacity = '';
        this.style.pointerEvents = '';
      }, 2000);
    });
  });
})();


/* ============================================================
   10. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const nameInput  = document.getElementById('f-name');
  const emailInput = document.getElementById('f-email');
  const msgInput   = document.getElementById('f-message');
  const errName    = document.getElementById('err-name');
  const errEmail   = document.getElementById('err-email');
  const errMsg     = document.getElementById('err-message');
  const successBox = document.getElementById('form-success');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function clearError(input, errEl) {
    input.classList.remove('error');
    errEl.textContent = '';
  }

  function showError(input, errEl, msg) {
    input.classList.add('error');
    errEl.textContent = msg;
  }

  /* Live clear errors as user types */
  nameInput.addEventListener('input',  () => clearError(nameInput,  errName));
  emailInput.addEventListener('input', () => clearError(emailInput, errEmail));
  msgInput.addEventListener('input',   () => clearError(msgInput,   errMsg));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg   = msgInput.value.trim();

    /* Validate name */
    if (!name) {
      showError(nameInput, errName, '⚠ Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showError(nameInput, errName, '⚠ Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError(nameInput, errName);
    }

    /* Validate email */
    if (!email) {
      showError(emailInput, errEmail, '⚠ Please enter your email.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError(emailInput, errEmail, '⚠ Enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, errEmail);
    }

    /* Validate message */
    if (!msg) {
      showError(msgInput, errMsg, '⚠ Please write a message.');
      valid = false;
    } else if (msg.length < 10) {
      showError(msgInput, errMsg, '⚠ Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError(msgInput, errMsg);
    }

    if (!valid) return;

    /* Simulate send (replace with real backend / EmailJS / Formspree when ready) */
    const submitBtn  = form.querySelector('button[type="submit"]');
    const origLabel  = submitBtn.textContent;
    submitBtn.textContent  = '⏳ Sending…';
    submitBtn.disabled     = true;

    setTimeout(() => {
      submitBtn.textContent  = origLabel;
      submitBtn.disabled     = false;
      form.reset();
      successBox.style.display = 'block';
      /* FIX: auto-hide success message after 5 seconds */
      setTimeout(() => { successBox.style.display = 'none'; }, 5000);
    }, 1400);
  });
})();


/* ============================================================
   11. NAV LOGO GLOW EFFECT
   ============================================================ */
(function initNavLogoGlow() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.filter = 'drop-shadow(0 0 12px rgba(79,142,255,0.8))';
  });
  logo.addEventListener('mouseleave', () => {
    logo.style.filter = '';
  });
})();
