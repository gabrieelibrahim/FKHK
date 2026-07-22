/* ============================================================
   FKHK Website — Main JavaScript
   Interactivity, Animations & UI Logic
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — Scroll effect & active link
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Scroll: add .scrolled class when past 60px
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mobile-nav-link, #mob-login').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Update active nav link based on scroll position
  function updateActiveLink() {
    const sections = ['beranda', 'tentang', 'artikel', 'kegiatan', 'prestasi'];
    let current = '';

    sections.forEach(function (id) {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        current = id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
})();

/* ============================================================
   2. SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -10px 0px',
    }
  );

  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // Fallback / Initial check to show elements already in viewport
  function checkInitialVisibility() {
    fadeElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }

  // Run initial check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkInitialVisibility);
  } else {
    checkInitialVisibility();
  }
  window.addEventListener('load', checkInitialVisibility);
})();

/* ============================================================
   3. SMOOTH SCROLL — Anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   4. ACTIVITY TABS — Filter kegiatan
   ============================================================ */
(function initActivityTabs() {
  const tabs = document.querySelectorAll('.activities-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Toggle active tab
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.getAttribute('data-tab');
      const cards  = document.querySelectorAll('.activity-card');

      cards.forEach(function (card) {
        // Show all cards for 'semua', otherwise filter by category text
        if (filter === 'semua') {
          card.style.display = '';
          return;
        }

        const categoryEl = card.querySelector('.activity-category');
        if (!categoryEl) return;

        const text = categoryEl.textContent.toLowerCase();
        if (filter === 'mendatang' && text.includes('mendatang')) {
          card.style.display = '';
        } else if (filter === 'terlaksana' && text.includes('terlaksana')) {
          card.style.display = '';
        } else if (filter !== 'semua') {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   6. SUPPORTERS TRACK — Pause on hover
   ============================================================ */
(function initSupporters() {
  const track = document.getElementById('supporters-track');
  if (!track) return;

  track.addEventListener('mouseenter', function () {
    this.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', function () {
    this.style.animationPlayState = 'running';
  });
})();

/* ============================================================
   7. HERO PARALLAX — Subtle scroll effect on hero bg
   ============================================================ */
(function initParallax() {
  const heroImg = document.querySelector('.hero-bg img');
  if (!heroImg || window.innerWidth < 768) return;

  function onScroll() {
    const scrollY = window.scrollY;
    // Move image up slightly as user scrolls
    heroImg.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   8. NAVBAR — Close mobile menu on resize
   ============================================================ */
(function initResizeHandler() {
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      const hamburger  = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      if (!hamburger || !mobileMenu) return;

      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   9. ARTICLE CARDS — Read time calculation (demo)
   ============================================================ */
(function initArticleCards() {
  const excerpts = document.querySelectorAll('.article-excerpt');
  excerpts.forEach(function (el) {
    const wordCount = el.textContent.split(/\s+/).length;
    const minutes   = Math.max(1, Math.ceil(wordCount / 200));
    // Optionally append read time — kept minimal for now
    // You can enable this block if needed:
    // const readTime = document.createElement('span');
    // readTime.className = 'article-read-time';
    // readTime.textContent = minutes + ' menit baca';
    // el.parentElement.querySelector('.article-meta')?.appendChild(readTime);
  });
})();

/* ============================================================
   10. UTILITY — Debounce
   ============================================================ */
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

/* ============================================================
   11. FOOTER MAP — Hover color & badge (iframe-safe)
   CSS :hover doesn't fire when cursor is inside an iframe.
   We use mouseenter/mouseleave on the wrapper instead.
   ============================================================ */
(function initMapHover() {
  const mapWrap = document.querySelector('.footer-map-wrap');
  if (!mapWrap) return;

  mapWrap.addEventListener('mouseenter', () => {
    mapWrap.classList.add('is-hovered');
  });

  mapWrap.addEventListener('mouseleave', () => {
    mapWrap.classList.remove('is-hovered');
  });
})();

/* ============================================================
   12. ARTICLES SLIDER — Drag-to-scroll + Navigation Dots
   ============================================================ */
(function initArticlesSlider() {
  const slider = document.getElementById('articles-grid');
  const dotsContainer = document.getElementById('slider-dots');
  if (!slider || !dotsContainer) return;

  const cards = slider.querySelectorAll('.article-card');
  if (!cards.length) return;

  // --- Buat navigation dots ---
  const totalDots = cards.length;
  const dots = [];

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', function () {
      // Scroll ke kartu yang bersangkutan
      const card = cards[i];
      slider.scrollTo({
        left: card.offsetLeft - slider.offsetLeft - 4,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  // --- Update dot aktif saat scroll ---
  function updateActiveDot() {
    let closestIndex = 0;
    let minDist = Infinity;

    cards.forEach(function (card, idx) {
      const dist = Math.abs(card.getBoundingClientRect().left - slider.getBoundingClientRect().left);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = idx;
      }
    });

    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === closestIndex);
    });
  }

  slider.addEventListener('scroll', updateActiveDot, { passive: true });

  // --- Navigasi Tombol Panah (Kursor Panah) ---
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', function () {
      const scrollAmount = cards[0].offsetWidth + 24; // Lebar kartu + gap
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    btnNext.addEventListener('click', function () {
      const scrollAmount = cards[0].offsetWidth + 24;
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }
})();
