/**
 * UMO Supplementary Website — Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTabs();
  initSubtaskTabs();
  initGridToggle();
  initScrollAnimations();
  initVideoLazyLoad();
  initActiveNavTracking();
  initCarousels();
});

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
}

/* ===== COMPARISON TABS ===== */
function initTabs() {
  document.querySelectorAll('.comparison-tabs').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = container.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');

        // Auto-play video in active panel
        playVideosInElement(panel);
      });
    });
  });
}

/* ===== SUBTASK TABS ===== */
function initSubtaskTabs() {
  document.querySelectorAll('.subtask-tabs').forEach(tabGroup => {
    const section = tabGroup.closest('.section') || tabGroup.parentElement;
    const buttons = tabGroup.querySelectorAll('.subtask-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.subtask;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        section.querySelectorAll('.subtask-panel').forEach(p => {
          p.classList.remove('active');
        });
        const panel = section.querySelector(`[data-subtask-panel="${target}"]`);
        if (panel) {
          panel.classList.add('active');
          // Trigger animation
          panel.querySelectorAll('.glass-card, .demo-block').forEach(el => {
            el.classList.add('visible');
          });
        }
      });
    });
  });
}

/* ===== GRID TOGGLE ===== */
function initGridToggle() {
  document.querySelectorAll('.btn-grid-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const container = document.querySelector(`.comparison-tabs[data-group="${group}"]`);
      if (!container) return;

      container.classList.toggle('grid-view');
      btn.textContent = container.classList.contains('grid-view')
        ? 'Show Tab View'
        : 'Show All Side-by-Side';

      // Play all videos in grid view
      if (container.classList.contains('grid-view')) {
        playVideosInElement(container);
      }
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll(
    '.section-header, .glass-card, .demo-block'
  ).forEach(el => observer.observe(el));
}

/* ===== VIDEO LAZY LOAD ===== */
function initVideoLazyLoad() {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const video = container.querySelector('video');
          if (video) {
            video.play().catch(() => {});
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.video-placeholder').forEach(el => {
    videoObserver.observe(el);
  });
}

/* ===== ACTIVE NAV TRACKING ===== */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => {
    if (section.id) observer.observe(section);
  });
}

/* ===== CAROUSELS ===== */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (slides.length <= 1) {
      // Hide controls if only one slide
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsContainer) dotsContainer.style.display = 'none';
      return;
    }

    let current = 0;

    // Generate dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to example ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      dotsContainer.children[current].classList.remove('active');

      current = index;

      slides[current].classList.add('active');
      dotsContainer.children[current].classList.add('active');

      // Trigger visibility for scroll animations inside the new slide
      slides[current].querySelectorAll('.glass-card, .demo-block').forEach(el => {
        el.classList.add('visible');
      });

      // Auto-play videos in the new slide
      playVideosInElement(slides[current]);

      updateButtons();
    }

    function updateButtons() {
      if (prevBtn) prevBtn.classList.toggle('disabled', current === 0);
      if (nextBtn) nextBtn.classList.toggle('disabled', current === slides.length - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (current > 0) goTo(current - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (current < slides.length - 1) goTo(current + 1);
      });
    }

    updateButtons();
  });
}

/* ===== HELPERS ===== */
function playVideosInElement(el) {
  if (!el) return;
  el.querySelectorAll('video').forEach(v => {
    v.play().catch(() => {});
  });
}
