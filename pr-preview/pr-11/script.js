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
        // Use innerHTML for strings carrying markup (e.g. an accent <span>)
        if (/<[a-z][\s\S]*>/i.test(text)) {
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

  // ===== 3D DEPTH ENTRANCE =====
  // panes rise out of depth (rotateX + translateZ) as they enter the
  // viewport — one-shot, staggered per section, gated by reduced-motion
  // via the .depth-in CSS itself.
  if ('IntersectionObserver' in window) {
    const depthSelector = [
      '.section .eyebrow',
      '.section .section__title',
      '.section .section__sub',
      '.section .check-list',
      '.split__panel',
      '.contact-info',
      '.contact-form-wrap',
      '.map-wrap'
    ].join(',');

    const depthTargets = Array.from(document.querySelectorAll(depthSelector));
    const staggerIndex = new Map();
    depthTargets.forEach(el => {
      const section = el.closest('section');
      const i = staggerIndex.get(section) || 0;
      el.classList.add('depth-in');
      el.style.setProperty('--depth-delay', Math.min(i, 3) * 90 + 'ms');
      staggerIndex.set(section, i + 1);
    });

    const depthObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          depthObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    depthTargets.forEach(el => depthObserver.observe(el));

    // ===== NAV ACTIVE SECTION =====
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

  // ===== DEVELOPING PHOTOS =====
  // each print starts foggy/desaturated and "develops" into full clarity
  // the first time it scrolls into view.
  const photoCards = document.querySelectorAll('.photo-card');
  if ('IntersectionObserver' in window && photoCards.length) {
    const photoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-developed');
          photoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    photoCards.forEach(card => photoObserver.observe(card));
  } else {
    photoCards.forEach(card => card.classList.add('is-developed'));
  }

  // ===== SCROLL PARALLAX =====
  // background depth layers drift at different speeds as the page scrolls.
  const parallaxEls = Array.from(document.querySelectorAll('.parallax'));
  if (parallaxEls.length && !prefersReducedMotion) {
    let ticking = false;
    function updateParallax() {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = (center - vh / 2) / vh;
        const depth = parseFloat(el.dataset.depth || '0.2');
        el.style.setProperty('--py', (progress * depth * -160).toFixed(2) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // ===== PHOTO PHYSICS TILT =====
  // hovered photos and glass panels lean toward the cursor and spring
  // back with a light damped-spring feel — desktop pointers only.
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const inner = el.querySelector('.photo-card, .icon-panel') || el;
      const stiffness = 0.14;
      const damping = 0.72;
      const maxTranslate = 14;
      const maxRotate = 7;

      let tx = 0, ty = 0, rx = 0, ry = 0;
      let vtx = 0, vty = 0, vrx = 0, vry = 0;
      let targetX = 0, targetY = 0, targetRX = 0, targetRY = 0;
      let raf = null;

      function tick() {
        vtx = (vtx + (targetX - tx) * stiffness) * damping;
        vty = (vty + (targetY - ty) * stiffness) * damping;
        vrx = (vrx + (targetRX - rx) * stiffness) * damping;
        vry = (vry + (targetRY - ry) * stiffness) * damping;
        tx += vtx; ty += vty; rx += vrx; ry += vry;
        inner.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

        const settled = Math.abs(vtx) + Math.abs(vty) + Math.abs(vrx) + Math.abs(vry) < 0.02;
        const atRest = !targetX && !targetY && !targetRX && !targetRY;
        if (!(settled && atRest)) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
        }
      }
      function ensureLoop() { if (!raf) raf = requestAnimationFrame(tick); }

      el.addEventListener('pointermove', e => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = px * maxTranslate * 2;
        targetY = py * maxTranslate * 2;
        targetRY = px * maxRotate * 2;
        targetRX = -py * maxRotate * 2;
        el.style.setProperty('--mx', (px + 0.5) * 100 + '%');
        el.style.setProperty('--my', (py + 0.5) * 100 + '%');
        ensureLoop();
      });
      el.addEventListener('pointerleave', () => {
        targetX = targetY = targetRX = targetRY = 0;
        ensureLoop();
      });
    });
  }

  // ===== TOPBAR SCROLL SHADOW =====
  const topbar = document.getElementById('topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      topbar.style.boxShadow = window.scrollY > 8
        ? '0 20px 60px -30px rgba(0,0,0,0.6)'
        : 'none';
    }, { passive: true });
  }

})();
