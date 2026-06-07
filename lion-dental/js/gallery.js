(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  if (!items.length) return;

  var lightbox   = document.getElementById('lightbox');
  var lbImg      = document.getElementById('lightboxImg');
  var lbCaption  = document.getElementById('lightboxCaption');
  var btnClose   = document.getElementById('lightboxClose');
  var btnPrev    = document.getElementById('lightboxPrev');
  var btnNext    = document.getElementById('lightboxNext');

  if (!lightbox || !lbImg) return;

  var currentIndex = -1;
  var lastFocused  = null;

  /* ---- Robustness: gracefully handle stock images that fail to load ---- */
  items.forEach(function (item) {
    var img = item.querySelector('.gallery__img');
    if (!img) return;
    img.addEventListener('error', function () {
      img.classList.add('is-broken');
      item.classList.add('is-broken');
    });
  });

  function render(index) {
    var item = items[index];
    if (!item) return;
    var full    = item.getAttribute('data-full');
    var thumb   = item.querySelector('.gallery__img');
    var caption = item.querySelector('.gallery__caption');

    lbImg.classList.remove('is-broken');
    lbImg.src = full || (thumb ? thumb.src : '');
    lbImg.alt = thumb ? thumb.alt : '';
    lbCaption.textContent = caption ? caption.textContent : '';
    currentIndex = index;
  }

  function open(index) {
    lastFocused = document.activeElement;
    render(index);
    lightbox.hidden = false;
    // Next frame so the transition plays
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
    var done = function () {
      lightbox.hidden = true;
      lightbox.removeEventListener('transitionend', done);
    };
    lightbox.addEventListener('transitionend', done);
    // Fallback if no transition fires (reduced motion)
    setTimeout(function () { if (!lightbox.classList.contains('is-open')) lightbox.hidden = true; }, 400);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function step(delta) {
    var next = (currentIndex + delta + items.length) % items.length;
    render(next);
  }

  /* ---- Keyboard: Esc closes, arrows navigate, Tab is trapped ---- */
  function onKeydown(e) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowRight':
        e.preventDefault();
        step(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        step(-1);
        break;
      case 'Tab':
        trapFocus(e);
        break;
    }
  }

  function trapFocus(e) {
    var focusables = [btnClose, btnPrev, btnNext];
    var first = focusables[0];
    var last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---- Wire up triggers ---- */
  items.forEach(function (item, index) {
    item.addEventListener('click', function () { open(index); });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });

  // Click on the backdrop (outside the figure) closes
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

})();
