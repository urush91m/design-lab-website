window.__dlReady = true;
// Header background swap on scroll
const header = document.getElementById('site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
const bar = document.getElementById('scrollProgress');
const onProgress = () => {
  if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
};
window.addEventListener('scroll', () => { onScroll(); onProgress(); }, { passive: true });
window.addEventListener('resize', onProgress);
onScroll();
onProgress();

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
        note.textContent = 'Thanks, your project details are in. We\'ll be in touch soon.';
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

/* =====================================================================
   Interactive polish v2
   ===================================================================== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Gallery: every photo that can open in the viewer ---------- */
  const gallery = [
    ...document.querySelectorAll('.collage figure img'),
    ...document.querySelectorAll('.portfolio-tile img')
  ];
  const labelFor = (img) => {
    const tile = img.closest('.portfolio-tile');
    return tile ? (tile.getAttribute('data-label') || '') : '';
  };

  /* ---------- Hero headline: words rise in one by one ---------- */
  const title = document.querySelector('.hero-title');
  if (title && !reduce) {
    let i = 0;
    const frag = document.createDocumentFragment();
    title.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'wi';
          s.style.setProperty('--i', i++);
          s.textContent = part;
          frag.appendChild(s);
        });
      } else {
        frag.appendChild(n.cloneNode(true));
      }
    });
    title.replaceChildren(frag);
  }

  /* ---------- Desktop hero: scrolling photo reel (two columns, opposite directions) ---------- */
  const collageImgs = Array.from(document.querySelectorAll('.collage figure img'));
  const hero = document.querySelector('.hero');
  if (hero && collageImgs.length === 4) {
    const reel = document.createElement('div');
    reel.className = 'hero-reel';
    const makeCol = (indexes, down) => {
      const col = document.createElement('div');
      col.className = 'reel-col' + (down ? ' is-down' : '');
      const track = document.createElement('div');
      track.className = 'reel-track';
      [0, 1].forEach((copy) => {
        indexes.forEach((gi) => {
          const src = collageImgs[gi];
          const item = document.createElement('div');
          item.className = 'reel-item';
          item.dataset.g = String(gi);
          const img = document.createElement('img');
          img.src = src.getAttribute('src');
          img.width = src.getAttribute('width');
          img.height = src.getAttribute('height');
          img.decoding = 'async';
          if (copy === 0) {
            img.alt = src.alt;
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', src.alt);
          } else {
            img.alt = '';
            item.setAttribute('aria-hidden', 'true');
          }
          item.appendChild(img);
          track.appendChild(item);
        });
      });
      col.appendChild(track);
      return col;
    };
    reel.appendChild(makeCol([0, 3], false));
    reel.appendChild(makeCol([1, 2], true));
    hero.appendChild(reel);

    // Same scrolling pace in both columns, whatever their height
    const setPace = () => {
      reel.querySelectorAll('.reel-track').forEach((tr) => {
        const half = tr.scrollHeight / 2;
        if (half > 0) tr.style.setProperty('--dur', Math.max(24, half / 24) + 's');
      });
    };
    setPace();
    window.addEventListener('load', setPace);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(setPace, 250); });
  }

  /* ---------- Photo viewer ---------- */
  let lb, lbImg, lbCap, lbDots, current = 0, opener = null;
  const chev = (d) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';

  function buildViewer() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Close">' + chev('M6 6l12 12M18 6L6 18') + '</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">' + chev('M15 5l-7 7 7 7') + '</button>' +
      '<figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next photo">' + chev('M9 5l7 7-7 7') + '</button>' +
      '<div class="lb-dots" aria-hidden="true"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('.lb-fig img');
    lbCap = lb.querySelector('figcaption');
    lbDots = lb.querySelector('.lb-dots');
    gallery.forEach(() => lbDots.appendChild(document.createElement('i')));

    lb.querySelector('.lb-close').addEventListener('click', closeViewer);
    lb.querySelector('.lb-prev').addEventListener('click', () => go(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => go(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeViewer(); });

    // swipe
    let sx = null;
    lb.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    lb.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    });
    lb.addEventListener('pointercancel', () => { sx = null; });
  }

  function show(i, instant) {
    current = (i + gallery.length) % gallery.length;
    const src = gallery[current];
    const apply = () => {
      lbImg.src = src.currentSrc || src.src;
      lbImg.alt = src.alt;
      lbCap.textContent = labelFor(src);
      Array.from(lbDots.children).forEach((d, k) => d.classList.toggle('on', k === current));
      lb.classList.remove('swap');
    };
    if (instant) { apply(); return; }
    lb.classList.add('swap');
    setTimeout(apply, 150);
    // warm the neighbours
    [1, -1].forEach((d) => { const n = gallery[(current + d + gallery.length) % gallery.length]; new Image().src = n.currentSrc || n.src; });
  }
  function go(d) { show(current + d); }

  function openViewer(i, from) {
    if (!lb) buildViewer();
    opener = from || null;
    show(i, true);
    document.body.classList.add('lb-lock');
    requestAnimationFrame(() => {
      lb.classList.add('open');
      lb.querySelector('.lb-close').focus({ preventScroll: true });
    });
  }
  function closeViewer() {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.classList.remove('lb-lock');
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', (e) => {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Tab') {
      const f = Array.from(lb.querySelectorAll('button'));
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // Hook up: hero photos (phone/tablet grid), the desktop reel, and the work tiles
  collageImgs.forEach((img) => img.addEventListener('click', () => openViewer(gallery.indexOf(img), img)));
  document.addEventListener('click', (e) => {
    const item = e.target.closest && e.target.closest('.reel-item');
    if (item) openViewer(Number(item.dataset.g), item);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList.contains('reel-item')) {
      e.preventDefault();
      openViewer(Number(document.activeElement.dataset.g), document.activeElement);
    }
  });

  const zoomSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
  document.querySelectorAll('.portfolio-tile').forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    tile.tabIndex = 0;
    tile.setAttribute('role', 'button');
    tile.setAttribute('aria-label', tile.getAttribute('data-label') || img.alt);
    const z = document.createElement('span');
    z.className = 'tile-zoom';
    z.innerHTML = zoomSvg;
    tile.appendChild(z);
    const open = () => openViewer(gallery.indexOf(img), tile);
    tile.addEventListener('click', open);
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    // tilt toward the pointer (mouse only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
      tile.addEventListener('pointermove', (e) => {
        const r = tile.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tile.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        tile.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
      });
      tile.addEventListener('pointerleave', () => {
        tile.style.setProperty('--rx', '0deg');
        tile.style.setProperty('--ry', '0deg');
      });
    }
  });

  /* ---------- Contact: light follows the pointer ---------- */
  const contact = document.querySelector('.contact');
  if (contact && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    contact.addEventListener('pointermove', (e) => {
      const r = contact.getBoundingClientRect();
      contact.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      contact.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }
})();

/* Testimonials: seamless, continuous slider with a soft spotlight on the card nearest the centre */
(function () {
  const mq = document.querySelector('.t-marquee');
  const track = document.querySelector('.t-track');
  if (!mq || !track) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const base = Array.from(track.children);
  const addSet = () => base.forEach((c) => {
    const k = c.cloneNode(true);
    k.setAttribute('aria-hidden', 'true');
    k.querySelectorAll('img').forEach((im) => { im.alt = ''; });
    track.appendChild(k);
  });
  addSet();
  const layout = () => {
    const setW = track.children[base.length].offsetLeft - track.children[0].offsetLeft;
    if (setW <= 0) return;
    let copies = Math.round(track.scrollWidth / setW);
    while (setW * (copies - 1) < mq.clientWidth + 40) { addSet(); copies++; }
    track.style.setProperty('--t-shift', (-setW) + 'px');
    track.style.setProperty('--t-dur', Math.max(26, setW / 38) + 's');
  };
  track.classList.add('is-looping');
  mq.classList.add('is-live');
  layout();
  window.addEventListener('load', layout);
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 200); });

  // spotlight: cards near the middle grow and brighten, the rest soften
  let raf = 0, visible = false;
  const tick = () => {
    const r = mq.getBoundingClientRect();
    const cx = r.left + r.width / 2, span = r.width * 0.62;
    const cards = track.children;
    for (let i = 0; i < cards.length; i++) {
      const b = cards[i].getBoundingClientRect();
      const d = Math.abs(b.left + b.width / 2 - cx) / span;
      cards[i].style.setProperty('--f', (1 - Math.min(1, d)).toFixed(3));
    }
    raf = requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      if (visible) { layout(); if (!raf) raf = requestAnimationFrame(tick); }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.02 });
    io.observe(mq);
  } else { raf = requestAnimationFrame(tick); }

  let tp;
  mq.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { mq.classList.add('is-paused'); clearTimeout(tp); } });
  const resume = (e) => { if (e.pointerType !== 'mouse') { clearTimeout(tp); tp = setTimeout(() => mq.classList.remove('is-paused'), 1800); } };
  mq.addEventListener('pointerup', resume);
  mq.addEventListener('pointercancel', resume);
})();
