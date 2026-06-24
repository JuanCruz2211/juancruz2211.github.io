/* ═══════════════════════════════════════════════════════
   LUZ NATURAL — FOTOGRAFÍA DE AUTOR
   Premium Photography Portfolio Script
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM Elements ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.portfolio__item');
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  let currentLightboxIndex = 0;
  let visibleItems = [...galleryItems];


  /* ═══════════════════════════════════════════════════
     SMOOTH SCROLL
     ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      // Close mobile menu if open
      closeMobileMenu();

      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });


  /* ═══════════════════════════════════════════════════
     NAVIGATION — Scroll Effect
     ═══════════════════════════════════════════════════ */
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });


  /* ═══════════════════════════════════════════════════
     HAMBURGER MENU
     ═══════════════════════════════════════════════════ */
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* ═══════════════════════════════════════════════════
     SCROLL REVEAL ANIMATIONS
     ═══════════════════════════════════════════════════ */
  function createRevealObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Staggered delay for sibling reveals
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('.reveal');
          const index = [...siblings].indexOf(entry.target);
          const delay = index * 120;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    // Observe gallery items too
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    galleryItems.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = `opacity 0.7s ${i * 0.08}s var(--ease-out-expo), transform 0.7s ${i * 0.08}s var(--ease-out-expo)`;
      galleryObserver.observe(item);
    });
  }

  createRevealObserver();


  /* ═══════════════════════════════════════════════════
     PORTFOLIO FILTER
     ═══════════════════════════════════════════════════ */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'todos' || category === filter) {
          item.classList.remove('hidden');
          // Re-animate appearance
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo)';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.classList.add('hidden');
        }
      });

      // Update visible items list for lightbox
      updateVisibleItems();
    });
  });

  function updateVisibleItems() {
    visibleItems = [...galleryItems].filter(item => !item.classList.contains('hidden'));
  }


  /* ═══════════════════════════════════════════════════
     LIGHTBOX
     ═══════════════════════════════════════════════════ */

  // Gallery data for lightbox
  const galleryData = [];
  galleryItems.forEach(item => {
    const bg = item.querySelector('.portfolio__img').style.background;
    const overlay = item.querySelector('.portfolio__overlay');
    galleryData.push({
      background: bg,
      category: overlay.querySelector('.portfolio__overlay-category').textContent,
      title: overlay.querySelector('.portfolio__overlay-title').textContent,
      desc: overlay.querySelector('.portfolio__overlay-desc').textContent,
      dataIndex: parseInt(item.dataset.index)
    });
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function updateLightboxContent() {
    const visibleData = visibleItems.map(item => {
      const idx = parseInt(item.dataset.index);
      return galleryData[idx];
    });

    if (currentLightboxIndex < 0) currentLightboxIndex = visibleData.length - 1;
    if (currentLightboxIndex >= visibleData.length) currentLightboxIndex = 0;

    const data = visibleData[currentLightboxIndex];
    if (!data) return;

    lightboxImage.style.background = data.background;
    lightboxImage.style.backgroundSize = 'cover';
    lightboxCategory.textContent = data.category;
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${visibleData.length}`;
  }

  function nextSlide() {
    currentLightboxIndex++;
    updateLightboxContent();
  }

  function prevSlide() {
    currentLightboxIndex--;
    updateLightboxContent();
  }

  // Gallery item click → open lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const itemIdx = visibleItems.indexOf(item);
      openLightbox(itemIdx);
    });
  });

  // Lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextSlide);
  lightboxPrev.addEventListener('click', prevSlide);

  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
    }
  });


  /* ═══════════════════════════════════════════════════
     STAT COUNTER ANIMATION
     ═══════════════════════════════════════════════════ */
  function animateCounters() {
    const counters = document.querySelectorAll('.about__stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = 2000;
          const startTime = performance.now();

          function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
          }

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);

            el.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  animateCounters();


  /* ═══════════════════════════════════════════════════
     CONTACT FORM
     ═══════════════════════════════════════════════════ */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate form submission
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Enviando...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Show success toast
      showToast('¡Mensaje enviado con éxito! Te respondo pronto.');

      // Reset form
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  function showToast(message) {
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }


  /* ═══════════════════════════════════════════════════
     HERO PARALLAX (subtle)
     ═══════════════════════════════════════════════════ */
  const heroContent = document.querySelector('.hero__content');
  const heroDecoLeft = document.querySelector('.hero__decoration--left');
  const heroDecoRight = document.querySelector('.hero__decoration--right');

  function handleHeroParallax() {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrollY > heroHeight) return;

    const progress = scrollY / heroHeight;

    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroContent.style.opacity = 1 - progress * 1.2;
    }

    if (heroDecoLeft) {
      heroDecoLeft.style.transform = `translate(${scrollY * -0.05}px, ${scrollY * -0.08}px)`;
    }

    if (heroDecoRight) {
      heroDecoRight.style.transform = `translate(${scrollY * 0.05}px, ${scrollY * 0.08}px)`;
    }
  }

  window.addEventListener('scroll', handleHeroParallax, { passive: true });


  /* ═══════════════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHTING
     ═══════════════════════════════════════════════════ */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + nav.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          if (scrollPos >= top && scrollPos < bottom) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  /* ═══════════════════════════════════════════════════
     INITIAL HERO ANIMATION
     ═══════════════════════════════════════════════════ */
  function initHeroAnimation() {
    const reveals = document.querySelectorAll('.hero .reveal');
    reveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + i * 200);
    });
  }

  // Start hero animation after a brief page-load pause
  setTimeout(initHeroAnimation, 200);


  /* ═══════════════════════════════════════════════════
     TOUCH SWIPE FOR LIGHTBOX (Mobile)
     ═══════════════════════════════════════════════════ */
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < swipeThreshold) return;

    if (diff > 0) {
      nextSlide(); // Swipe left → next
    } else {
      prevSlide(); // Swipe right → prev
    }
  }

});
