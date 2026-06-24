/* ═══════════════════════════════════════════════════════════
   DataPulse — Panel de Control
   Interactive Dashboard Script
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────── DOM REFERENCES ────────────────────────────
  const sidebar      = document.getElementById('sidebar');
  const sidebarToggle= document.getElementById('sidebarToggle');
  const mobileMenuBtn= document.getElementById('mobileMenuBtn');
  const overlay      = document.getElementById('sidebarOverlay');
  const notifBtn     = document.getElementById('notifBtn');
  const notifDropdown= document.getElementById('notifDropdown');
  const barTooltip   = document.getElementById('barTooltip');
  const dateEl       = document.getElementById('currentDate');

  // ──────────────────────────── CURRENT DATE ────────────────────────────
  function setCurrentDate() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formatted = now.toLocaleDateString('es-AR', options);
    // Capitalize first letter
    dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  setCurrentDate();

  // ──────────────────────────── SIDEBAR TOGGLE ────────────────────────────
  // Desktop collapse
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Mobile open/close
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  });

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', closeMobileSidebar);

  // Sidebar nav active state
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      // Close mobile sidebar on nav click
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });

  // ──────────────────────────── NOTIFICATION DROPDOWN ────────────────────────────
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
      notifDropdown.classList.remove('show');
    }
  });

  // ──────────────────────────── PERIOD SELECTOR ────────────────────────────
  const periodBtns = document.querySelectorAll('.period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Optionally re-animate KPI values
      animateCounters();
      animateBars();
    });
  });

  // ──────────────────────────── KPI COUNTER ANIMATION ────────────────────────────
  function animateCounters() {
    const kpiValues = document.querySelectorAll('.kpi-card__value');

    kpiValues.forEach(el => {
      const target   = parseFloat(el.dataset.target);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const sep      = el.dataset.separator || '';
      const decimals = parseInt(el.dataset.decimals) || 0;
      const duration = 1800;
      const startTime = performance.now();

      function formatNumber(num) {
        if (decimals > 0) {
          return num.toFixed(decimals);
        }
        // Argentine thousand separator (dot)
        if (sep === '.') {
          return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return Math.round(num).toString();
      }

      function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        el.textContent = prefix + formatNumber(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ──────────────────────────── BAR CHART ANIMATION ────────────────────────────
  function animateBars() {
    const bars = document.querySelectorAll('.bar-chart__bar');
    bars.forEach((bar, i) => {
      bar.classList.remove('animated');
      // Stagger
      setTimeout(() => {
        bar.classList.add('animated');
      }, 80 * i);
    });
  }

  // ──────────────────────────── BAR CHART TOOLTIP ────────────────────────────
  const barCols = document.querySelectorAll('.bar-chart__col');
  const barChart = document.getElementById('barChart');

  barCols.forEach(col => {
    col.addEventListener('mouseenter', (e) => {
      const value = col.dataset.value;
      const month = col.dataset.month;
      barTooltip.innerHTML = `<strong>${month}</strong>: ${value}`;
      barTooltip.style.opacity = '1';
      positionTooltip(e, col);
    });

    col.addEventListener('mousemove', (e) => {
      positionTooltip(e, col);
    });

    col.addEventListener('mouseleave', () => {
      barTooltip.style.opacity = '0';
    });
  });

  function positionTooltip(e, col) {
    const chartRect = barChart.getBoundingClientRect();
    const colRect   = col.getBoundingClientRect();
    const tipWidth  = barTooltip.offsetWidth;

    let left = colRect.left - chartRect.left + colRect.width / 2 - tipWidth / 2;
    let top  = colRect.top - chartRect.top - 45;

    // Keep within chart bounds
    if (left < 0) left = 0;
    if (left + tipWidth > chartRect.width) left = chartRect.width - tipWidth;
    if (top < 0) top = 10;

    barTooltip.style.left = left + 'px';
    barTooltip.style.top  = top + 'px';
  }

  // ──────────────────────────── SCROLL ANIMATIONS ────────────────────────────
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.anim-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay per section
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ──────────────────────────── SEARCH BAR INTERACTION ────────────────────────────
  const searchInput = document.querySelector('.topbar__search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.style.maxWidth = '520px';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.style.maxWidth = '420px';
    });
  }

  // ──────────────────────────── TABLE ROW CLICK ────────────────────────────
  document.querySelectorAll('.data-table tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      // Toggle selected visual cue
      document.querySelectorAll('.data-table tbody tr').forEach(r => {
        r.style.boxShadow = '';
      });
      row.style.boxShadow = 'inset 3px 0 0 var(--accent-blue)';
    });
  });

  // ──────────────────────────── INIT ON LOAD ────────────────────────────
  function init() {
    // Initial scroll animations
    initScrollAnimations();

    // Counter animation triggered by IntersectionObserver
    const kpiGrid = document.querySelector('.kpi-grid');
    const kpiObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          animateBars();
          kpiObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (kpiGrid) kpiObserver.observe(kpiGrid);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ──────────────────────────── KEYBOARD SHORTCUTS ────────────────────────────
  document.addEventListener('keydown', (e) => {
    // Ctrl+K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    // Escape → close dropdowns / mobile sidebar
    if (e.key === 'Escape') {
      notifDropdown.classList.remove('show');
      closeMobileSidebar();
      searchInput.blur();
    }
  });

})();
