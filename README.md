# Snakes Concrete LLC website

Plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser to preview, or upload the whole folder to any web host (Netlify, Vercel, cPanel, GitHub Pages).

## Pages (10)
index, about, services, stamped-decorative, gallery, process, service-areas, reviews-faq, booking (quote calculator and scheduling), contact.

## Files
- `css/styles.css`: all styling. Colors and fonts are at the top (`:root`).
- `js/config.js`: **the file you will edit most**: phone numbers, email, social links, EmailJS keys, and all quote calculator prices.
- `js/main.js`: navigation, scroll animations, gallery and lightbox, before/after sliders, call, WhatsApp and quick-answer chat widget.
- `js/quote.js`: quote calculator and booking.
- `assets/img/`: images.

## 1. Switch on quote emails (customer and owner both get one)
Browsers cannot send email on their own, so the site uses EmailJS (free plan, 200 emails a month, no server needed).
1. Create an account at emailjs.com and add an email service (Gmail works). Copy the **Service ID**.
2. Create **two templates**. In both, use these variables: `{{quote_number}}`, `{{customer_name}}`, `{{customer_phone}}`, `{{customer_email}}`, `{{address}}`, `{{service}}`, `{{size}}`, `{{finish}}`, `{{estimate_low}}`, `{{estimate_high}}`, `{{preferred_date}}`, `{{time_window}}`, `{{start_timeline}}`, `{{notes}}`, and `{{{breakdown_html}}}` (three braces so the table displays).
   - Customer template: set **To Email** to `{{to_email}}`, and reply-to to your business email. Write it like a quote ("Thanks for your request...").
   - Owner template: set **To Email** to `{{to_email}}`. Subject: `{{subject}}`. The contact form also uses this template.
3. Open `js/config.js` and fill in `publicKey`, `serviceId`, `customerTemplateId`, `ownerTemplateId`.
4. Submit a test booking. Until these are filled in, the site shows the customer a button that opens their own email app with the quote, so no request is lost.

## 2. Set your real prices
In `js/config.js` the `pricing` block holds every rate (per square foot, finishes, extras, steps, travel zones, minimum job). The numbers are **placeholders**, so replace them before launch.

## 3. Replace placeholders
- **Customer reviews** (home page and reviews-faq.html): sample text, marked with HTML comments. Replace with real reviews.
- **Before/after sliders**: `assets/img/placeholder-before-1..3.jpg` and `placeholder-after-1..3.jpg`. Keep the file names or edit the paths.
- **Stamped concrete swatches**: `stamped-slate.jpg`, `stamped-cobble.jpg`, `stamped-plank.jpg` are generated sample patterns, not your work. Replace them with your own stamped project photos.
- **Social links**: `config.js` points to search pages for now. Paste your real Facebook and TikTok URLs.
- **Gallery**: add a `<figure>` in `gallery.html` copying an existing one. Categories are in `data-c`.
- **Hero photo**: `assets/img/patio-mountain.jpg`, set in `index.html`.

## Accessibility and performance notes
Keyboard focus is visible, reduced-motion settings are respected (the hero truck stops and reveal effects switch off), images are lazy-loaded and compressed, and the layout is built mobile-first.
