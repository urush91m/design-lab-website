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
