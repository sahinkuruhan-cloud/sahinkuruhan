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
  var mobileNavQuery = window.matchMedia('(max-width: 900px)');

  function isMobileNav() {
    return mobileNavQuery.matches;
  }

  function navFocusables() {
    return navLinks
      ? Array.prototype.slice.call(navLinks.querySelectorAll('.nav__link'))
      : [];
  }

  // Keep the off-screen overlay out of the tab order on mobile when closed
  function syncNavInert() {
    if (!navLinks) return;
    var shouldBeInert = isMobileNav() && !navLinks.classList.contains('is-open');
    if (shouldBeInert) {
      navLinks.setAttribute('inert', '');
    } else {
      navLinks.removeAttribute('inert');
    }
  }

  function updateHamburgerLabel(isOpen) {
    if (!hamburger) return;
    var lang = document.documentElement.lang === 'en' ? 'en' : 'tr';
    var key = (isOpen ? 'labelClose' : 'labelOpen') + (lang === 'en' ? 'En' : 'Tr');
    var label = hamburger.dataset[key];
    if (label) hamburger.setAttribute('aria-label', label);
  }

  function openMenu() {
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    updateHamburgerLabel(true);
    document.body.style.overflow = 'hidden';
    syncNavInert();
    var focusables = navFocusables();
    if (focusables.length) focusables[0].focus();
  }

  function closeMenu(returnFocus) {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    updateHamburgerLabel(false);
    document.body.style.overflow = '';
    syncNavInert();
    if (returnFocus && hamburger) hamburger.focus();
  }

  function toggleMenu() {
    if (navLinks.classList.contains('is-open')) {
      closeMenu(true);
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when any nav link is clicked
  if (navLinks) {
    navFocusables().forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          closeMenu(false);
        }
      });
    });
  }

  // Keyboard handling: Escape closes, Tab is trapped while the menu is open
  document.addEventListener('keydown', function (e) {
    if (!navLinks || !navLinks.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeMenu(true);
      return;
    }

    if (e.key === 'Tab') {
      var focusables = navFocusables();
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Re-evaluate inert state when crossing the mobile breakpoint
  if (mobileNavQuery.addEventListener) {
    mobileNavQuery.addEventListener('change', function () {
      if (!isMobileNav() && navLinks.classList.contains('is-open')) {
        closeMenu(false);
      }
      syncNavInert();
    });
  }

  // Keep the hamburger label in sync when the language toggle fires
  document.addEventListener('languagechange:lds', function () {
    updateHamburgerLabel(navLinks && navLinks.classList.contains('is-open'));
  });

  syncNavInert();
  updateHamburgerLabel(false);

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
