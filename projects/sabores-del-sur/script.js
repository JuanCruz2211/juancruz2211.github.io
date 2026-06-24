/* ==========================================================
   SABORES DEL SUR — Premium Patagonian Restaurant Scripts
   ========================================================== */

;(function () {
  'use strict';

  /* ── DOM References ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const navHeader      = $('#navHeader');
  const hamburger      = $('#hamburger');
  const navLinks       = $('#navLinks');
  const navLinkItems   = $$('.nav-link');
  const cursorDot      = $('.cursor-dot');
  const cursorRing     = $('.cursor-ring');
  const scrollProgress = $('.scroll-progress');
  const backToTop      = $('#backToTop');
  const menuTabs       = $$('.menu-tab');
  const menuGrids      = $$('.menu-grid');
  const form           = $('#reservationForm');
  const formSuccess    = $('#formSuccess');
  const newResBtn      = $('#newReservation');
  const submitBtn      = $('#submitBtn');
  const heroParticles  = $('.hero-particles');

  /* ── Utility: Throttle ── */
  function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /* ── Utility: Debounce ── */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ═══════════════════════════════════════════
     1. CUSTOM CURSOR (Desktop only)
     ═══════════════════════════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth lag for ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveEls = $$('a, button, .menu-item, .gallery-item, input, select, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* ═══════════════════════════════════════════
     2. NAVIGATION — Scroll & Hamburger
     ═══════════════════════════════════════════ */

  // Scrolled state
  function handleNavScroll() {
    if (window.scrollY > 80) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active link tracking
  const sections = $$('section[id]');
  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════
     3. SCROLL PROGRESS BAR
     ═══════════════════════════════════════════ */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }

  /* ═══════════════════════════════════════════
     4. BACK TO TOP BUTTON
     ═══════════════════════════════════════════ */
  function toggleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════════
     5. SCROLL EVENT HANDLER (combined)
     ═══════════════════════════════════════════ */
  const onScroll = throttle(() => {
    handleNavScroll();
    updateScrollProgress();
    toggleBackToTop();
    updateActiveLink();
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });

  // Init on load
  handleNavScroll();
  updateScrollProgress();

  /* ═══════════════════════════════════════════
     6. INTERSECTION OBSERVER — Scroll Animations
     ═══════════════════════════════════════════ */
  const animatedEls = $$('.anim-fade-up, .anim-slide-left, .anim-slide-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedEls.forEach(el => observer.observe(el));

  /* ═══════════════════════════════════════════
     7. ANIMATED COUNTERS
     ═══════════════════════════════════════════ */
  const statNumbers = $$('.stat-number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target > 9999) {
        // Format with dot separator for large numbers
        el.textContent = current.toLocaleString('es-AR');
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ═══════════════════════════════════════════
     8. MENU TABS
     ═══════════════════════════════════════════ */
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update tab states
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update grid visibility
      menuGrids.forEach(grid => {
        grid.classList.remove('active');
        if (grid.dataset.menu === category) {
          grid.classList.add('active');

          // Re-trigger animations for newly visible items
          const items = $$('.anim-fade-up', grid);
          items.forEach((item, i) => {
            item.classList.remove('visible');
            setTimeout(() => item.classList.add('visible'), i * 80);
          });
        }
      });
    });
  });

  /* ═══════════════════════════════════════════
     9. RESERVATION FORM — Validation
     ═══════════════════════════════════════════ */
  const validators = {
    nombre: (val) => val.trim().length >= 2 ? '' : 'Ingresá tu nombre completo',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Ingresá un email válido',
    telefono: (val) => val.trim().length >= 8 ? '' : 'Ingresá un número de teléfono válido',
    fecha: (val) => {
      if (!val) return 'Seleccioná una fecha';
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today ? '' : 'La fecha debe ser hoy o posterior';
    },
    hora: (val) => val ? '' : 'Seleccioná un horario',
    comensales: (val) => val ? '' : 'Seleccioná la cantidad de comensales',
  };

  // Real-time validation on blur
  Object.keys(validators).forEach(field => {
    const input = $(`#${field}`);
    if (!input) return;

    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', debounce(() => {
      const group = input.closest('.form-group');
      if (group.classList.contains('error')) {
        validateField(field);
      }
    }, 300));
  });

  function validateField(field) {
    const input = $(`#${field}`);
    const errorEl = $(`#${field}Error`);
    const group = input.closest('.form-group');
    const error = validators[field](input.value);

    if (error) {
      group.classList.add('error');
      errorEl.textContent = error;
      return false;
    } else {
      group.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }
  }

  function validateAll() {
    let valid = true;
    Object.keys(validators).forEach(field => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) {
      // Scroll to first error
      const firstError = $('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate sending
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 1500);
  });

  // New reservation button
  newResBtn.addEventListener('click', () => {
    form.reset();
    $$('.form-group').forEach(g => g.classList.remove('error'));
    form.style.display = '';
    formSuccess.classList.remove('show');
  });

  // Set min date to today
  const fechaInput = $('#fecha');
  if (fechaInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    fechaInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  /* ═══════════════════════════════════════════
     10. HERO PARTICLES
     ═══════════════════════════════════════════ */
  function createParticles() {
    if (!heroParticles) return;

    const count = window.innerWidth < 768 ? 8 : 15;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 4 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 6;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;

      heroParticles.appendChild(particle);
    }
  }
  createParticles();

  /* ═══════════════════════════════════════════
     11. PARALLAX EFFECTS (subtle)
     ═══════════════════════════════════════════ */
  const heroContent = $('.hero-content');

  function handleParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Hero parallax (only within hero section)
    if (heroContent && scrollY < vh) {
      const factor = scrollY * 0.3;
      heroContent.style.transform = `translateY(${factor}px)`;
      heroContent.style.opacity = 1 - (scrollY / vh) * 0.8;
    }
  }

  window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });

  /* ═══════════════════════════════════════════
     12. SMOOTH SCROLL for all anchor links
     ═══════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ═══════════════════════════════════════════
     13. GALLERY HOVER EFFECTS
     ═══════════════════════════════════════════ */
  $$('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
      $$('.gallery-item').forEach(other => {
        if (other !== this) other.style.opacity = '0.6';
      });
    });
    item.addEventListener('mouseleave', function () {
      $$('.gallery-item').forEach(other => {
        other.style.opacity = '1';
      });
    });
  });

  /* ═══════════════════════════════════════════
     14. INITIAL HERO ANIMATIONS (staggered)
     ═══════════════════════════════════════════ */
  window.addEventListener('load', () => {
    const heroAnimEls = $$('.hero .anim-fade-up');
    heroAnimEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 300 + i * 150);
    });
  });

  /* ═══════════════════════════════════════════
     15. KEYBOARD ACCESSIBILITY
     ═══════════════════════════════════════════ */
  document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

})();
