# Design Lab — Website

Static site for Design Lab (photography & videography). Plain HTML/CSS/JS — no build step required.

## Files
- `index.html` — all page content and structure
- `styles.css` — the full design system
- `script.js` — nav toggle, scroll header, contact form handling
- `assets/` — put your real photos here

## Replace before launch
1. Swap the six placeholder blocks in the "Work" section (`.portfolio-tile`) for real `<img>` tags pointing at photos in `assets/`.
2. Add real photos to the About section frame if you'd like (currently a color placeholder).
3. Update the Instagram link in the Contact section.
4. Connect the contact form to Formspree (see below) by replacing `YOUR_FORM_ID` in `index.html`.

## Contact form (no server needed)
GitHub Pages only serves static files, so the contact form needs a third-party form backend:
1. Go to formspree.io and sign up free.
2. Create a new form, copy the endpoint it gives you (looks like `https://formspree.io/f/abc123`).
3. In `index.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"` and replace `YOUR_FORM_ID` with your real ID.
4. Submissions will arrive in your email and in the Formspree dashboard.
