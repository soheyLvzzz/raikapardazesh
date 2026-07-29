  // Mark JS as available so CSS can safely hide .reveal elements pre-animation
  // (if this never runs, .reveal styles stay inert and content is fully visible)
  document.documentElement.classList.add('js');

  // ===== SCROLL REVEAL =====
  (function(){
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  })();

  // ===== HEADER SCROLL SHADOW =====
  (function(){
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // ===== PROJECTS SECTION CAROUSEL (Mobile) =====
  (function(){
    const carousel = document.getElementById('projectsCarousel');
    if (!carousel) return;
    
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('dragging');
      startX = e.pageX;
      startScroll = carousel.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove('dragging');
    });
    window.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      carousel.scrollLeft = startScroll - (e.pageX - startX);
    });
  })();

  // ===== TEAM SECTION CAROUSEL =====
  (function(){
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;
    const dots = document.querySelectorAll('#teamDots .team-dot');

    // Modern browsers report scrollLeft as negative (0..-max) inside an
    // RTL scroll container, instead of the familiar 0..max range. Detect
    // which convention this browser uses so centering/dots work either way.
    const initialScrollLeft = carousel.scrollLeft;
    carousel.scrollLeft = -9999;
    const isNegativeRTL = carousel.scrollLeft < 0;
    carousel.scrollLeft = initialScrollLeft;

    function scrollRange(){
      const max = carousel.scrollWidth - carousel.clientWidth;
      return isNegativeRTL ? { min: -max, max: 0 } : { min: 0, max: max };
    }

    function updateDots(){
      if (!dots.length) return;
      const { min, max } = scrollRange();
      const span = max - min;
      const progress = span > 0 ? (carousel.scrollLeft - min) / span : 0;
      const activeIndex = Math.round(progress * (dots.length - 1));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    }

    // center the track on load so the middle cards are focused
    // and one card bleeds past each edge
    const initRange = scrollRange();
    carousel.scrollLeft = (initRange.min + initRange.max) / 2;
    updateDots();

    carousel.addEventListener('scroll', updateDots);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const { min, max } = scrollRange();
        carousel.scrollTo({ left: min + (max - min) * (i / (dots.length - 1)), behavior: 'smooth' });
      });
    });

    // click-and-drag support for mouse users (touch/mobile scrolls natively)
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('dragging');
      startX = e.pageX;
      startScroll = carousel.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      carousel.scrollLeft = startScroll - (e.pageX - startX);
    });
  })();

  // ===== FOOTER BACK TO TOP =====
  (function(){
    const backToTopBtn = document.getElementById('backToTop');
    const topAnchor = document.getElementById('top');
    if (!backToTopBtn || !topAnchor) return;
    backToTopBtn.addEventListener('click', () => {
      topAnchor.scrollIntoView({ behavior: 'smooth' });
    });
  })();

// ============ کرسر کراس‌هیر مهندسی (Reticle) ============
(function() {
    'use strict';

    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHidden = false;

    // دریافت موقعیت ماوس
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (isHidden) {
            isHidden = false;
            cursor.classList.remove('hidden');
            cursor.classList.add('visible');
        }
    });

    // ===== افکت هاور روی عناصر تعاملی =====
    const hoverElements = document.querySelectorAll(
        'a, button, .btn, .services-card, .projects-card, .team-card, ' +
        '.about-block, .icon-circle-btn, .avatar-btn, .footer-social-btn, ' +
        '.footer-back-top, .footer-newsletter-btn, .partner-item, .team-dot, ' +
        '.hamburger, .partners-float-top, .services-card-link, .about-readmore'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
        });
    });

    // ===== افکت کلیک =====
    document.addEventListener('mousedown', function() {
        cursor.classList.add('click');
    });

    document.addEventListener('mouseup', function() {
        cursor.classList.remove('click');
    });

    // ===== مخفی شدن هنگام خروج ماوس از صفحه =====
    document.addEventListener('mouseleave', function() {
        isHidden = true;
        cursor.classList.add('hidden');
        cursor.classList.remove('visible');
    });

    document.addEventListener('mouseenter', function() {
        if (isHidden) {
            isHidden = false;
            cursor.classList.remove('hidden');
            cursor.classList.add('visible');
        }
    });

    // ===== انیمیشن دنبال‌کننده با حرکت نرم =====
    function animateCursor() {
        const diffX = mouseX - currentX;
        const diffY = mouseY - currentY;

        // ضریب 0.15 = حرکت نرم با تاخیر کم
        currentX += diffX * 0.15;
        currentY += diffY * 0.15;

        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // ===== روی موبایل/تاچ، کرسر سفارشی رو غیرفعال کن =====
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        document.querySelectorAll('*').forEach(el => el.style.cursor = 'auto');
    }

})();