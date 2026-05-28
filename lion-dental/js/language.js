(function () {
  'use strict';

  const STORAGE_KEY = 'lds-lang';
  const DEFAULT_LANG = 'tr';

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    // Update all text nodes that have data-tr / data-en
    document.querySelectorAll('[data-tr][data-en]').forEach(function (el) {
      const text = el.dataset[lang];
      if (text !== undefined) {
        el.textContent = text;
      }
    });

    // Update page <title>
    const titleEl = document.querySelector('title');
    if (titleEl) {
      titleEl.textContent = lang === 'en'
        ? 'Lion Dental Art Studio | Dental Prosthetics Laboratory'
        : 'Lion Dental Art Studio | Diş Protez Laboratuvarı';
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'en'
        ? 'Lion Dental Art Studio – Premium zirconia crowns, laminate veneers, and CAD/CAM prosthetics for dental professionals.'
        : 'Lion Dental Art Studio – Diş hekimleri için premium zirkonyum kuron, lamine veneer ve CAD/CAM protez çözümleri.');
    }

    // Update toggle UI
    const activeLabelEl = document.getElementById('langActive');
    const otherLabelEl  = document.getElementById('langOther');
    if (activeLabelEl && otherLabelEl) {
      activeLabelEl.textContent = lang.toUpperCase();
      otherLabelEl.textContent  = lang === 'tr' ? 'EN' : 'TR';
    }
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'tr' ? 'en' : 'tr');
  }

  function init() {
    // Apply stored / default language on load
    applyLanguage(currentLang);

    // Wire up toggle button
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', toggleLanguage);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
