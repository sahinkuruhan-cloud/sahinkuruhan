(function () {
  'use strict';

  /* ---- Selectors ---- */
  var nav        = document.getElementById('nav');
  var hamburger  = document.getElementById('hamburger');
  var navLinks   = document.getElementById('navLinks');

  /* ===================================
     NAV — Scroll effect
  =================================== */
  var lastScrollY = 0;

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  /* ===================================
     MOBILE MENU
  =================================== */
  function openMenu() {
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (navLinks.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when any nav link is clicked
  if (navLinks) {
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          closeMenu();
        }
      });
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('is-open')) {
      closeMenu();
      if (hamburger) hamburger.focus();
    }
  });

  /* ===================================
     SMOOTH SCROLL (for older browsers)
  =================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var navH = (nav ? nav.offsetHeight : 76);
      var targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

})();
