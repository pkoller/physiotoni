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

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
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

  // ===== HEADER SCROLL SHADOW =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(38,70,83,0.12)'
      : '0 4px 24px rgba(38,70,83,0.08)';
  }, { passive: true });

})();
