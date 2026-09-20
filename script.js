// Header background swap on scroll
const header = document.getElementById('site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll-reveal animations
const allReveals = Array.from(document.querySelectorAll('.reveal'));
const heroReveals = allReveals.filter(el => el.closest('.hero'));
const otherReveals = allReveals.filter(el => !el.closest('.hero'));

// Hero content animates in as soon as the page loads
requestAnimationFrame(() => {
  heroReveals.forEach(el => el.classList.add('is-visible'));
});

// Everything else animates in as it scrolls into view
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  otherReveals.forEach(el => observer.observe(el));
} else {
  // Fallback: no IntersectionObserver support, just show everything
  allReveals.forEach(el => el.classList.add('is-visible'));
}

// Contact form: friendly submit feedback (works once Formspree endpoint is set)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', async (e) => {
    if (form.action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      note.textContent = 'Connect a Formspree form ID in index.html to enable this form (see README).';
      return;
    }
    e.preventDefault();
    note.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        note.textContent = 'Thanks — your project details are in. We\'ll be in touch soon.';
        form.reset();
      } else {
        note.textContent = 'Something went wrong. Please try again or reach out on Instagram.';
      }
    } catch (err) {
      note.textContent = 'Something went wrong. Please try again or reach out on Instagram.';
    }
  });
}

// Services tabs (Photography / Videography / Content & Brand)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.service-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');

    tabButtons.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
      b.tabIndex = active ? 0 : -1;
    });

    tabPanels.forEach(panel => {
      const show = panel.id === `panel-${target}`;
      panel.hidden = !show;
    });
  });

  // Keyboard support: left/right arrows move between tabs
  btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const list = Array.from(tabButtons);
    const i = list.indexOf(btn);
    const next = e.key === 'ArrowRight' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
    list[next].focus();
    list[next].click();
  });
});
