/* ═══════════════════════════════════════════════════════
   JUAN CRUZ ESCOBAR — Portfolio JavaScript
   Vanilla JS — No dependencies
   ═══════════════════════════════════════════════════════ */

;(function () {
  'use strict';

  /* ─── UTILITIES ────────────────────────────────────── */

  /**
   * Debounce helper — limits how often `fn` fires.
   */
  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  /**
   * Select helper
   */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ─── PRELOADER ────────────────────────────────────── */

  function initPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    const hide = () => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    };

    // Block scroll while loading
    document.body.style.overflow = 'hidden';

    // Hide after animation (min 2s, or when page loads, whichever is later)
    window.addEventListener('load', () => {
      setTimeout(hide, 1800);
    });

    // Fallback: hide after 4s no matter what
    setTimeout(hide, 4000);
  }

  /* ─── NAVBAR ───────────────────────────────────────── */

  function initNavbar() {
    const header = $('#header');
    if (!header) return;

    const SCROLL_THRESHOLD = 60;

    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', debounce(onScroll, 10), { passive: true });
    onScroll(); // run once on init
  }

  /* ─── ACTIVE NAV LINK ──────────────────────────────── */

  function initActiveLink() {
    const sections = $$('section[id]');
    const links = $$('.nav__link');
    if (!sections.length || !links.length) return;

    const opts = { rootMargin: '-40% 0px -55% 0px', threshold: 0 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, opts);

    sections.forEach((s) => observer.observe(s));
  }

  /* ─── MOBILE MENU ──────────────────────────────────── */

  function initMobileMenu() {
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    if (!toggle || !menu) return;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close when clicking a menu link
    $$('.nav__link', menu).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close when clicking overlay
    overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  /* ─── SMOOTH SCROLL ────────────────────────────────── */

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = $(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─── TYPING EFFECT ────────────────────────────────── */

  function initTypingEffect() {
    const el = $('#typingText');
    if (!el) return;

    const phrases = [
      'Desarrollador Web',
      'Diseño Responsivo',
      'Experiencias Digitales',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
      const current = phrases[phraseIdx];

      if (isDeleting) {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 45;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIdx === current.length) {
        // Pause at end of word
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }

    // Start after a short delay
    setTimeout(type, 1200);
  }

  /* ─── SCROLL ANIMATIONS (Intersection Observer) ──── */

  function initScrollAnimations() {
    const els = $$('.animate-on-scroll');
    if (!els.length) return;

    const opts = { rootMargin: '0px 0px -80px 0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // only animate once
        }
      });
    }, opts);

    els.forEach((el) => observer.observe(el));
  }

  /* ─── STATS COUNTER ────────────────────────────────── */

  function initStatsCounter() {
    const section = $('#statsSection');
    if (!section) return;

    let counted = false;

    function animateCounters() {
      if (counted) return;
      counted = true;

      $$('.stat-card__number', section).forEach((counter) => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 2000; // ms
        const start = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutQuart for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 4);
          counter.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(step);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
  }

  /* ─── CONTACT FORM ─────────────────────────────────── */

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const nameInput = $('#contactName');
    const emailInput = $('#contactEmail');
    const messageInput = $('#contactMessage');
    const submitBtn = $('#submitBtn');
    const successMsg = $('#formSuccess');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setError(field, show) {
      const group = field.closest('.form-group');
      if (show) {
        group.classList.add('has-error');
        field.classList.add('error');
      } else {
        group.classList.remove('has-error');
        field.classList.remove('error');
      }
    }

    // Clear error on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => setError(input, false));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        setError(nameInput, true);
        valid = false;
      }

      // Validate email
      if (!validateEmail(emailInput.value.trim())) {
        setError(emailInput, true);
        valid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        setError(messageInput, true);
        valid = false;
      }

      if (!valid) return;

      // Enviar datos reales a formsubmit.co
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      fetch("https://formsubmit.co/ajax/juancruz311567@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nombre: nameInput.value.trim(),
            Email: emailInput.value.trim(),
            Mensaje: messageInput.value.trim(),
            _subject: "Nuevo mensaje de contacto desde tu Portfolio!"
        })
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (data.success === "true" || data.success) {
            successMsg.classList.add('show');
            form.reset();
            // Ocultar mensaje despues de 5s
            setTimeout(() => {
              successMsg.classList.remove('show');
            }, 5000);
        } else {
            alert("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
        }
      })
      .catch(error => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        console.error(error);
        alert("Ocurrió un error en el servidor. Por favor, escribime directamente a mi email.");
      });
    });
  }

  /* ─── HERO PARTICLES ───────────────────────────────── */

  function initParticles() {
    const container = $('#heroParticles');
    if (!container) return;

    const PARTICLE_COUNT = 30;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 12;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: 0;
      `;

      container.appendChild(p);
    }
  }

  /* ─── PARALLAX-LIKE HERO EFFECT ────────────────────── */

  function initHeroParallax() {
    const hero = $('.hero__content');
    const geo = $('.hero__geo');
    if (!hero || !geo) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = hero.closest('.hero').offsetHeight;

            if (scrollY < heroHeight) {
              const factor = scrollY / heroHeight;
              hero.style.transform = `translateY(${scrollY * 0.15}px)`;
              hero.style.opacity = 1 - factor * 0.6;
              geo.style.transform = `translateY(${scrollY * 0.08}px)`;
            }

            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ─── INIT EVERYTHING ──────────────────────────────── */

  function init() {
    initPreloader();
    initNavbar();
    initActiveLink();
    initMobileMenu();
    initSmoothScroll();
    initTypingEffect();
    initScrollAnimations();
    initStatsCounter();
    initContactForm();
    initParticles();
    initHeroParallax();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
