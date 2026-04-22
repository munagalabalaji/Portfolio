/* ============================================================
   MUNAGALA BALAJI — Portfolio JavaScript
   Features: Particles, Typing, Scroll Reveal, Skill Bars,
             Navbar, Form Validation, Smooth Scroll
   ============================================================ */

'use strict';

/* ============================================================
   1. PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT    = 90;
  const COLORS   = ['rgba(79,142,255,', 'rgba(155,92,255,', 'rgba(0,229,255,'];
  const MAX_DIST = 140;

  /* Resize handler */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* Particle factory */
  function makeParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.45,
      vy:   (Math.random() - 0.5) * 0.45,
      r:    Math.random() * 1.8 + 0.5,
      col:  COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  /* Initialise */
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  /* Draw frame */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Move & draw dots */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();
    });

    /* Draw connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,142,255,${opacity})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ============================================================
   2. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el       = document.getElementById('typing-text');
  const phrases  = [
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
      delay = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      /* Pause at end */
      delay      = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay      = 400;
    }

    setTimeout(type, delay);
  }

  /* Small initial delay */
  setTimeout(type, 800);
})();


/* ============================================================
   3. STICKY NAVBAR — scroll class + active link highlight
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  /* Scroll class */
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Active section highlight */
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   4. HAMBURGER MOBILE MENU
   ============================================================ */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  /* Close when a link is clicked */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ============================================================
   5. SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger siblings by index in their parent */
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx      = siblings.indexOf(entry.target);
        const delay    = Math.min(idx * 100, 400); // cap stagger at 400ms

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. SKILL BAR ANIMATION — triggered on scroll into view
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Small delay for polish */
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ============================================================
   7. SMOOTH SCROLLING — anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ============================================================
   8. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  if (!form) return;

  const nameInput   = document.getElementById('f-name');
  const emailInput  = document.getElementById('f-email');
  const msgInput    = document.getElementById('f-message');
  const errName     = document.getElementById('err-name');
  const errEmail    = document.getElementById('err-email');
  const errMsg      = document.getElementById('err-message');
  const successBox  = document.getElementById('form-success');

  /* Validators */
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

  /* Live clear on input */
  nameInput.addEventListener('input',  () => clearError(nameInput,  errName));
  emailInput.addEventListener('input', () => clearError(emailInput, errEmail));
  msgInput.addEventListener('input',   () => clearError(msgInput,   errMsg));

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg   = msgInput.value.trim();

    /* Name */
    if (!name) {
      showError(nameInput, errName, '⚠ Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showError(nameInput, errName, '⚠ Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError(nameInput, errName);
    }

    /* Email */
    if (!email) {
      showError(emailInput, errEmail, '⚠ Please enter your email.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError(emailInput, errEmail, '⚠ Enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, errEmail);
    }

    /* Message */
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

    /* Simulate send */
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled    = false;
      form.reset();
      successBox.style.display = 'block';
      setTimeout(() => { successBox.style.display = 'none'; }, 5000);
    }, 1200);
  });
})();


/* ============================================================
   9. NEON GLOW ON NAV LOGO — subtle pulse on hover
   ============================================================ */
(function navLogoEffect() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.textShadow = '0 0 20px rgba(79,142,255,0.7)';
  });
  logo.addEventListener('mouseleave', () => {
    logo.style.textShadow = 'none';
  });
})();
