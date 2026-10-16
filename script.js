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
        // Use innerHTML for elements that contain markup (<br>, <a>)
        if (text.includes('<')) {
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

  // ===== GOOGLE MAPS (click to load) =====
  // The site itself sets no cookies; the only third-party content is the
  // Google Maps embed. Its iframe carries data-src and only gets a src when
  // the visitor clicks "Karte laden" — that click is the consent. Nothing is
  // stored, so the map is gated again on every page view.
  const mapFrame = document.querySelector('.map[data-src]');
  const mapPlaceholder = document.getElementById('mapPlaceholder');
  const mapLoad = document.getElementById('mapLoad');

  if (mapFrame && mapLoad) {
    mapLoad.addEventListener('click', () => {
      mapFrame.src = mapFrame.dataset.src;
      mapFrame.hidden = false;
      mapPlaceholder.hidden = true;
    });
  }

  // ===== CONTACT FORM (Web3Forms) =====
  // Posts to api.web3forms.com via fetch; Web3Forms emails the message on.
  // Without JS the form's action/method still submit it the classic way.
  // On success the form is swapped for a confirmation panel; the panel and
  // the error box are static markup, so the language toggle covers them.
  const contactForm = document.getElementById('contactFormEl');
  if (contactForm) {
    const formTitle = document.getElementById('formTitle');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    const formReset = document.getElementById('formReset');
    const submitBtn = contactForm.querySelector('[type="submit"]');

    // Own validation instead of the browser's pop-ups, so the messages
    // follow the site's DE/EN toggle rather than the browser language.
    // Email check: local@domain.tld, no spaces, TLD at least 2 chars.
    const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
    const fields = [
      { input: document.getElementById('name'),    error: document.getElementById('nameError'),    isValid: v => v !== '' },
      { input: document.getElementById('email'),   error: document.getElementById('emailError'),   isValid: v => EMAIL_RE.test(v) },
      { input: document.getElementById('message'), error: document.getElementById('messageError'), isValid: v => v !== '' }
    ];
    const validateField = field => {
      const valid = field.isValid(field.input.value.trim());
      field.input.setAttribute('aria-invalid', String(!valid));
      field.error.hidden = valid;
      return valid;
    };
    const clearFieldErrors = () => fields.forEach(field => {
      field.input.removeAttribute('aria-invalid');
      field.error.hidden = true;
    });
    fields.forEach(field => {
      // Check when leaving a filled field; once flagged, re-check while typing
      field.input.addEventListener('blur', () => {
        if (field.input.value.trim()) validateField(field);
      });
      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    const setSending = sending => {
      submitBtn.disabled = sending;
      submitBtn.classList.toggle('is-sending', sending);
      const label = html.lang === 'de' ? submitBtn.dataset.de : submitBtn.dataset.en;
      submitBtn.textContent = sending ? (html.lang === 'de' ? 'Wird gesendet …' : 'Sending …') : label;
    };
    const showForm = show => {
      contactForm.hidden = !show;
      formTitle.hidden = !show;
      formSuccess.hidden = show;
    };

    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const invalid = fields.filter(field => !validateField(field));
      if (invalid.length) {
        invalid[0].input.focus();
        return;
      }
      formError.hidden = true;
      setSending(true);
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || res.status);
        contactForm.reset();
        clearFieldErrors();
        showForm(false);
        formSuccess.focus();
      } catch (err) {
        formError.hidden = false;
      } finally {
        setSending(false);
      }
    });

    formReset.addEventListener('click', () => {
      showForm(true);
      contactForm.querySelector('input:not([type="hidden"]):not(.form-honeypot)').focus();
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
      '.section .section__subhead',
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
    // Observe the whole <section>, not just the small anchor target it
    // scrolls to — a nav click lands the anchor right under the sticky
    // header, which sits outside a narrow "currently in view" band and
    // would otherwise never light up.
    const navLinks = Array.from(document.querySelectorAll('.sidebar .nav__link'));
    const linkForSection = new WeakMap();

    navLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      const section = target && target.closest('section');
      if (section) linkForSection.set(section, link);
    });

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = linkForSection.get(entry.target);
        if (!link) return;
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    }, { rootMargin: '-72px 0px -55% 0px' });

    navLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      const section = target && target.closest('section');
      if (section) sectionObserver.observe(section);
    });
  }

  // ===== FAB: only show once the hero call buttons have scrolled away =====
  const fab = document.querySelector('.fab');
  const heroCtas = document.querySelector('.hero__ctas');
  if (fab && heroCtas && 'IntersectionObserver' in window) {
    fab.classList.add('is-hidden');
    new IntersectionObserver(([entry]) => {
      fab.classList.toggle('is-hidden', entry.isIntersecting || entry.boundingClientRect.top > 0);
    }).observe(heroCtas);
  }

  // ===== HEADER SCROLL SHADOW =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(38,70,83,0.12)'
      : '0 4px 24px rgba(38,70,83,0.08)';
  }, { passive: true });

})();
