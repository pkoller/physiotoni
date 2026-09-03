(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

  // ===== MOBILE NAV (full-screen takeover) =====
  const hamburger = document.getElementById('hamburger');
  const navPanel = document.getElementById('navPanel');

  function closeNav() {
    navPanel.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  });

  navPanel.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.querySelectorAll('.logo').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  document.addEventListener('click', e => {
    if (!navPanel.contains(e.target) && !hamburger.contains(e.target)) {
      closeNav();
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
  if ('IntersectionObserver' in window) {
    const revealSelector = [
      '.section .chip',
      '.section .section__title',
      '.section .section__sub',
      '.section .check-list',
      '.split__panel',
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
      el.style.setProperty('--reveal-delay', Math.min(i, 3) * 80 + 'ms');
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
    // Observe the whole <section>, not the small anchor target it scrolls to.
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const linksForSection = new WeakMap();

    navLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      const section = target && target.closest('section');
      if (!section) return;
      const list = linksForSection.get(section) || [];
      list.push(link);
      linksForSection.set(section, list);
    });

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const links = linksForSection.get(entry.target);
        if (!links) return;
        navLinks.forEach(l => l.classList.remove('is-active'));
        links.forEach(l => l.classList.add('is-active'));
      });
    }, { rootMargin: '-72px 0px -55% 0px' });

    const observedSections = new Set();
    navLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      const section = target && target.closest('section');
      if (section && !observedSections.has(section)) {
        sectionObserver.observe(section);
        observedSections.add(section);
      }
    });
  }

  // ===== MAGNETIC BUTTONS =====
  // Buttons nudge toward the cursor on hover — desktop pointers only,
  // and skipped entirely for reduced-motion users.
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.btn--magnetic').forEach(btn => {
      const strength = 0.35;
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ===== HERO CURSOR GLOW =====
  const hero = document.querySelector('.hero');
  const heroGlow = document.getElementById('heroGlow');
  if (hero && heroGlow && hasFinePointer && !prefersReducedMotion) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroGlow.style.setProperty('--x', x + '%');
      heroGlow.style.setProperty('--y', y + '%');
    });
  }

  // ===== TOPBAR SCROLL SHADOW =====
  const topbar = document.getElementById('topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      topbar.style.boxShadow = window.scrollY > 8
        ? '0 6px 0 rgba(12,15,13,0.08)'
        : 'none';
    }, { passive: true });
  }

})();
