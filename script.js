(function () {
  'use strict';

  // ===== LANGUAGE TOGGLE =====
  const html = document.documentElement;
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const langOther = document.getElementById('langOther');

  function setLang(lang) {
    html.lang = lang;
    const isDE = lang === 'de';
    langLabel.textContent = isDE ? 'DE' : 'EN';
    langOther.textContent = isDE ? 'EN' : 'DE';

    document.querySelectorAll('[data-de]').forEach(el => {
      const text = isDE ? el.dataset.de : el.dataset.en;
      if (text !== undefined) {
        // Use innerHTML for elements that may contain <br> tags
        if (text.includes('<br')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  langToggle.addEventListener('click', () => {
    setLang(html.lang === 'de' ? 'en' : 'de');
  });

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked (nav links or the logo)
  nav.querySelectorAll('.nav__link, .logo').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Logo scrolls to top. The header it points to (#top) is sticky, so it's
  // always "in view" and the native anchor jump never actually scrolls.
  document.querySelectorAll('.logo').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ===== FOOTER YEAR =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== CONTACT FORM (demo handler) =====
  const contactForm = document.getElementById('contactFormEl');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const isDE = html.lang === 'de';
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = isDE ? 'Gesendet ✓' : 'Sent ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = isDE ? 'Senden' : 'Send';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ===== SCROLL REVEALS =====
  // Fade-up section content as it enters the viewport (CSS gates this
  // behind prefers-reduced-motion, so reduced-motion users see it static)
  if ('IntersectionObserver' in window) {
    // Only elements without absolutely-positioned descendants — a transform
    // on an ancestor would re-anchor the divider panels
    const revealSelector = [
      '.section .section__eyebrow',
      '.section .section__title',
      '.section .section__sub',
      '.section .about__credentials',
      '.about__text > p',
      '.contact-info',
      '.contact-form-wrap',
      '.map-wrap'
    ].join(',');

    const revealTargets = Array.from(document.querySelectorAll(revealSelector));
    const staggerIndex = new Map();
    revealTargets.forEach(el => {
      const section = el.closest('section');
      const i = staggerIndex.get(section) || 0;
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', Math.min(i, 3) * 70 + 'ms');
      staggerIndex.set(section, i + 1);
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));

    // ===== NAV ACTIVE SECTION =====
    const navLinks = Array.from(document.querySelectorAll('.sidebar .nav__link'));
    const sectionForLink = id => navLinks.find(l => l.getAttribute('href') === '#' + id);

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = sectionForLink(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  // ===== HEADER SCROLL SHADOW =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(38,70,83,0.12)'
      : '0 4px 24px rgba(38,70,83,0.08)';
  }, { passive: true });

})();
