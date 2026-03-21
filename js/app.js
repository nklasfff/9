/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DE 9 LIVSFASER — App Logic
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

(function () {
  'use strict';

  /* ═══ Scroll Reveal ═══ */
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  /* ═══ Header scroll effect ═══ */
  function initHeader() {
    const header = document.getElementById('appHeader');
    if (!header) return;

    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 30);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ═══ Check-in: single selection ═══ */
  function initCheckin() {
    const moods = document.querySelector('.checkin__moods');
    if (!moods) return;

    moods.addEventListener('click', (e) => {
      const btn = e.target.closest('.mood-btn');
      if (!btn) return;

      const wasActive = btn.classList.contains('active');

      moods.querySelectorAll('.mood-btn').forEach((b) => {
        b.classList.remove('active');
      });

      if (!wasActive) {
        btn.classList.add('active');
      }
    });
  }

  /* ═══ Init ═══ */
  function init() {
    initReveal();
    initHeader();
    initCheckin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
