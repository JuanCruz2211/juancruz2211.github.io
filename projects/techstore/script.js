/* ═══════════════════════════════════════════════════
   TechStore — Interactive JavaScript
   Features: Cart, Toast, Countdown, Scroll Animations,
   Smooth Scroll, Category Filter, Mobile Menu, Newsletter
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── DOM REFERENCES ─────────────────────────── */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const cartCountEl = document.getElementById('cartCount');
    const mobileCartCounts = document.querySelectorAll('.mobile-cart-count');
    const toast = document.getElementById('toast');
    const toastProductName = document.getElementById('toastProduct');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    let cartCount = 0;
    let toastTimeout = null;


    /* ─── NAVBAR SCROLL EFFECT ───────────────────── */
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check


    /* ─── MOBILE HAMBURGER MENU ──────────────────── */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* ─── SMOOTH SCROLL FOR NAV LINKS ────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* ─── SHOPPING CART ──────────────────────────── */
    function updateCartCount() {
        cartCountEl.textContent = cartCount;
        mobileCartCounts.forEach(el => el.textContent = cartCount);

        // Bump animation on cart badge
        cartCountEl.classList.add('bump');
        setTimeout(() => cartCountEl.classList.remove('bump'), 400);
    }

    function showToast(productName) {
        // Clear previous timeout if exists
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toast.classList.remove('show');
        }

        toastProductName.textContent = productName;

        // Small delay to allow re-trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.dataset.product;
            cartCount++;
            updateCartCount();
            showToast(productName);

            // Button click feedback
            btn.textContent = '✓ Agregado';
            btn.style.background = 'linear-gradient(135deg, #34D399, #0EA5E9)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'transparent';

            setTimeout(() => {
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    Agregar al Carrito
                `;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1500);
        });
    });


    /* ─── CATEGORY FILTER ────────────────────────── */
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;

            // Toggle active state
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Filter product cards with animation
            productCards.forEach(product => {
                const productCategory = product.dataset.category;

                if (category === 'all' || productCategory === category) {
                    product.style.display = '';
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';

                    requestAnimationFrame(() => {
                        product.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    });
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    /* ─── COUNTDOWN TIMER ────────────────────────── */
    // Set countdown to 2 days, 14 hours, 37 minutes, 52 seconds from now
    let totalSeconds = (2 * 24 * 60 * 60) + (14 * 60 * 60) + (37 * 60) + 52;

    const countDays = document.getElementById('countDays');
    const countHours = document.getElementById('countHours');
    const countMinutes = document.getElementById('countMinutes');
    const countSeconds = document.getElementById('countSeconds');

    function updateCountdown() {
        if (totalSeconds <= 0) {
            totalSeconds = (2 * 24 * 60 * 60) + (14 * 60 * 60) + (37 * 60) + 52; // Reset
        }

        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        countDays.textContent = String(days).padStart(2, '0');
        countHours.textContent = String(hours).padStart(2, '0');
        countMinutes.textContent = String(minutes).padStart(2, '0');

        // Add flip animation to seconds
        const newSec = String(seconds).padStart(2, '0');
        if (countSeconds.textContent !== newSec) {
            countSeconds.style.transform = 'scale(0.9)';
            countSeconds.style.opacity = '0.5';
            setTimeout(() => {
                countSeconds.textContent = newSec;
                countSeconds.style.transform = 'scale(1)';
                countSeconds.style.opacity = '1';
            }, 100);
        }

        totalSeconds--;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ─── SCROLL ANIMATIONS (Intersection Observer) ─ */
    const animElements = document.querySelectorAll('.anim-fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animElements.forEach(el => observer.observe(el));


    /* ─── NEWSLETTER FORM ────────────────────────── */
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email) {
            // Simulate submission
            newsletterForm.style.display = 'none';
            newsletterSuccess.classList.add('show');

            // Reset after 5 seconds
            setTimeout(() => {
                newsletterForm.style.display = '';
                newsletterSuccess.classList.remove('show');
                emailInput.value = '';
            }, 5000);
        }
    });


    /* ─── PRODUCT CARD GLOW EFFECT ON MOUSE MOVE ── */
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--glow-x', `${x}px`);
            card.style.setProperty('--glow-y', `${y}px`);
        });
    });


    /* ─── PARALLAX EFFECT ON HERO SHAPES ─────────── */
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                const shapes = document.querySelectorAll('.shape');
                shapes.forEach((shape, i) => {
                    const factor = (i + 1) * 0.3;
                    shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });


    /* ─── ACTIVE NAV LINK ON SCROLL ──────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });


    /* ─── SEARCH BAR VISUAL FEEDBACK ─────────────── */
    const searchInput = document.querySelector('.nav-search input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Visual-only: show a brief effect
                const searchBar = searchInput.closest('.nav-search');
                searchBar.style.borderColor = 'var(--cyan)';
                searchBar.style.boxShadow = '0 0 0 3px rgba(0, 210, 255, 0.15)';
                setTimeout(() => {
                    searchBar.style.borderColor = '';
                    searchBar.style.boxShadow = '';
                }, 1000);
            }
        });
    }

});
