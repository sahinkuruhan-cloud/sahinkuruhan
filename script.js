document.addEventListener('DOMContentLoaded', () => {
  // --- Erişilebilirlik: hareketi azalt bayrağı ---
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');
  const prefersReducedMotion = reduceMotionQuery.matches;

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIconOpen = document.getElementById('menu-icon-open');
  const mobileMenuIconClose = document.getElementById('menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        mobileMenuIconOpen.classList.add('hidden');
        mobileMenuIconClose.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuIconOpen.classList.remove('hidden');
        mobileMenuIconClose.classList.add('hidden');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuIconOpen.classList.remove('hidden');
        mobileMenuIconClose.classList.add('hidden');
      });
    });
  }

  // --- Sticky Navbar Transition ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('py-3', 'shadow-2xl', 'shadow-indigo-950/20');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('py-3', 'shadow-2xl', 'shadow-indigo-950/20');
      header.classList.add('py-5');
    }
  });

  // --- Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Portfolio Filter Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
        b.classList.add('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800/50');
      });

      // Add active class to clicked button
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
      btn.classList.remove('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800/50');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden-item');
        } else {
          item.classList.add('hidden-item');
        }
      });
    });
  });

  // --- Click to Copy Email ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = copyEmailBtn.getAttribute('data-email');
      navigator.clipboard.writeText(emailText).then(() => {
        // Show visual feedback (tooltip)
        const tooltip = document.getElementById('copy-tooltip');
        if (tooltip) {
          tooltip.textContent = 'Kopyalandı!';
          tooltip.classList.remove('opacity-0');
          tooltip.classList.add('opacity-100');
          
          setTimeout(() => {
            tooltip.textContent = 'Kopyala';
            tooltip.classList.add('opacity-0');
            tooltip.classList.remove('opacity-100');
          }, 2000);
        }
        showToast('E-posta adresi panoya kopyalandı! 📋');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // --- Contact Form Submission & Toast Notification ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Lütfen tüm alanları doldurun ⚠️', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Gönderiliyor...
      `;

      const templateParams = {
        from_name: name,
        reply_to: email,
        message: message,
      };

      emailjs.send('service_m6i4gdu', 'template_vvmarfk', templateParams)
        .then(() => {
          showToast('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım. 🚀');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        })
        .catch((err) => {
          console.error('EmailJS Error:', err);
          showToast('Mesaj gönderilemedi. Lütfen tekrar deneyin. ❌', 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        });
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message, type = 'success') {
    // Check if container exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `glass-panel text-white py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-auto border-l-4 ${
      type === 'success' ? 'border-emerald-500' : 'border-red-500'
    }`;
    toast.innerHTML = `
      <span class="text-sm font-medium">${message}</span>
      <button class="text-slate-400 hover:text-white ml-2 focus:outline-none" aria-label="Kapat">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-10px]');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 4000);
  }

  // --- Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-indigo-400', 'active-nav-link');
            link.classList.remove('text-slate-400');
          } else {
            link.classList.remove('text-indigo-400', 'active-nav-link');
            link.classList.add('text-slate-400');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-10% 0px -50% 0px'
  });

  sections.forEach(sec => activeLinkObserver.observe(sec));

  // --- Hero Terminal: Typewriter Animasyonu ---
  // Söz dizimi renklendirmesi token bazında korunur.
  const terminalLines = [
    { tokens: [{ t: 'const', c: 'text-pink-500' }, { t: ' developer ' }, { t: '=', c: 'text-slate-400' }, { t: ' {' }] },
    { indent: 'pl-4', tokens: [{ t: 'name:', c: 'text-slate-400' }, { t: ' ' }, { t: "'Şahin Kuruhan'", c: 'text-emerald-400' }, { t: ',' }] },
    { indent: 'pl-4', tokens: [{ t: 'role:', c: 'text-slate-400' }, { t: ' ' }, { t: "'Frontend Developer & Designer'", c: 'text-emerald-400' }, { t: ',' }] },
    { indent: 'pl-4', tokens: [{ t: 'experience:', c: 'text-slate-400' }, { t: ' ' }, { t: '4', c: 'text-cyan-400' }, { t: ', ' }, { t: '// in years', c: 'text-slate-500' }] },
    { indent: 'pl-4', tokens: [{ t: 'skills:', c: 'text-slate-400' }, { t: ' [' }] },
    { indent: 'pl-8', tokens: [{ t: "'JavaScript'", c: 'text-emerald-400' }, { t: ', ' }, { t: "'React.js'", c: 'text-emerald-400' }, { t: ', ' }, { t: "'CSS/Tailwind'", c: 'text-emerald-400' }, { t: ',' }] },
    { indent: 'pl-8', tokens: [{ t: "'UI/UX Design'", c: 'text-emerald-400' }, { t: ', ' }, { t: "'Git'", c: 'text-emerald-400' }, { t: ', ' }, { t: "'Figma'", c: 'text-emerald-400' }] },
    { indent: 'pl-4', tokens: [{ t: '],' }] },
    { indent: 'pl-4', tokens: [{ t: 'motto:', c: 'text-slate-400' }, { t: ' ' }, { t: "'Clean code. Seamless interfaces.'", c: 'text-emerald-400' }] },
    { tokens: [{ t: '};' }] },
    { extra: 'mt-4', tokens: [{ t: '// Web sitesi optimize edildi.', c: 'text-slate-500' }] },
    { tokens: [{ t: 'console', c: 'text-pink-500' }, { t: '.' }, { t: 'log', c: 'text-cyan-400' }, { t: '(developer.motto);' }] },
    { extra: 'mt-2 text-slate-500', tokens: [{ t: '> "Clean code. Seamless interfaces."' }] },
  ];

  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    // DOM iskeletini bir kez kur: satır div'leri + boş token span'leri
    const charQueue = []; // { span, char }
    terminalLines.forEach((line) => {
      const lineEl = document.createElement('div');
      lineEl.className = ['term-line', line.indent, line.extra].filter(Boolean).join(' ');
      line.tokens.forEach((tok) => {
        const span = document.createElement('span');
        if (tok.c) span.className = tok.c;
        lineEl.appendChild(span);
        for (const ch of tok.t) charQueue.push({ span, char: ch });
      });
      terminalBody.appendChild(lineEl);
    });

    if (prefersReducedMotion) {
      // Hareket azaltılmışsa: tüm metni anında doldur, imleç yok
      charQueue.forEach((q) => { q.span.textContent += q.char; });
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      terminalBody.appendChild(cursor);

      let started = false;
      const typeNext = (i) => {
        if (i >= charQueue.length) {
          // İmleci son satırın sonuna sabitle
          charQueue[charQueue.length - 1].span.parentElement.appendChild(cursor);
          return;
        }
        const { span, char } = charQueue[i];
        span.textContent += char;
        span.parentElement.appendChild(cursor); // imleç yazım konumunda
        // Satır sonunda (yeni paragrafa geçişte) hafif duraklama
        const next = charQueue[i + 1];
        const lineBreak = next && next.span.parentElement !== span.parentElement;
        const delay = lineBreak ? 140 : 16 + Math.random() * 14;
        setTimeout(() => typeNext(i + 1), delay);
      };

      // Hero görünür olunca bir kez başlat (üst-fold olduğu için anında çalışır)
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const typeObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
              started = true;
              typeNext(0);
              typeObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25 });
        typeObserver.observe(heroEl);
      } else {
        typeNext(0);
      }
    }
  }

  // --- Scroll: Kademeli (stagger) Reveal ---
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  if (staggerContainers.length) {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child, i) => {
            child.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 85}ms`;
          });
          entry.target.classList.add('active');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    staggerContainers.forEach((el) => staggerObserver.observe(el));
  }

  // --- Mikro Etkileşim: Manyetik Butonlar (yalnız hassas işaretçi + hareket açık) ---
  if (!prefersReducedMotion && finePointerQuery.matches) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    // --- Mikro Etkileşim: Kart imleç spotlight + hafif 3B tilt ---
    document.querySelectorAll('.tilt-card').forEach((card) => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rx = (0.5 - py) * 6;
          const ry = (px - 0.5) * 6;
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  // --- Scroll-linked Parallax (hafif) ---
  if (!prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      let ticking = false;
      const applyParallax = () => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
        });
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      }, { passive: true });
    }
  }
});
