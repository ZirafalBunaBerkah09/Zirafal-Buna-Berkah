/* ==========================================================
   PT ZIRAFAL BUNA BERKAH — script.js
   ========================================================== */
(function () {
  'use strict';

  /* ============ 1. HAMBURGER MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (!hamburger || !navMenu) return;
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============ 2. NAVBAR SCROLL EFFECT ============ */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ 3. BACK TO TOP ============ */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ 4. SMOOTH SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============ 5. ACTIVE NAVIGATION ============ */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentId = 'home';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ============ 6. INTERSECTION OBSERVER (REVEAL) ============ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('active'));
  }

  /* ============ 7. COUNTER ANIMATION ============ */
  const counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    const cObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  } else {
    counters.forEach(c => {
      c.textContent = (c.getAttribute('data-target') || '0') + (c.getAttribute('data-suffix') || '');
    });
  }

  /* ============ 8. FORM VALIDATION ============ */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(field, message) {
    const errEl = document.querySelector('.form-error[data-for="' + field + '"]');
    if (errEl) errEl.textContent = message || '';
  }

  function validateForm() {
    if (!form) return false;
    let valid = true;
    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const telepon = form.telepon.value.trim();
    const subjek = form.subjek.value.trim();
    const pesan = form.pesan.value.trim();

    ['nama','email','telepon','subjek','pesan'].forEach(f => setError(f, ''));

    if (nama.length < 2) { setError('nama', 'Nama minimal 2 karakter.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Format email tidak valid.'); valid = false; }
    if (!/^[0-9+\-\s()]{8,20}$/.test(telepon)) { setError('telepon', 'Nomor telepon tidak valid.'); valid = false; }
    if (subjek.length < 3) { setError('subjek', 'Subjek minimal 3 karakter.'); valid = false; }
    if (pesan.length < 10) { setError('pesan', 'Pesan minimal 10 karakter.'); valid = false; }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (formSuccess) { formSuccess.classList.remove('show'); formSuccess.textContent = ''; }

      if (!validateForm()) return;

      if (formSuccess) {
        formSuccess.textContent = 'Terima kasih. Pesan Anda telah diterima.';
        formSuccess.classList.add('show');
      }
      form.reset();
      setTimeout(() => {
        if (formSuccess) formSuccess.classList.remove('show');
      }, 6000);
    });

    form.querySelectorAll('input,textarea').forEach(input => {
      input.addEventListener('input', () => {
        const name = input.getAttribute('name');
        if (name) setError(name, '');
      });
    });
  }

  /* ============ 9. TAHUN OTOMATIS DI FOOTER (opsional) ============ */
  // Sudah hardcoded 2026 di HTML

})();