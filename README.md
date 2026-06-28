# The Banana Bread House — Website

A simple, elegant, mobile-friendly home bakery website built with plain HTML, CSS, and JavaScript. No frameworks, no build step — ready to deploy as-is on Netlify.

## 1. File Structure

```
banana-bread-house/
├── index.html          # All page content/sections
├── css/
│   └── style.css       # All styling (colors, fonts, layout, mobile responsiveness)
├── js/
│   └── script.js       # Form handling + footer year
├── images/              # Put your photos here
│   ├── hero-loaf.jpg              (placeholder — large hero photo)
│   ├── original-loaf.jpg          (placeholder — add your photo)
│   ├── chocolate-chip-loaf.jpg    (placeholder — add your photo)
│   └── walnut-loaf.jpg            (placeholder — add your photo)
└── README.md
```

### Where to edit things
- **Prices:** in `index.html`, search for `PRICE PLACEHOLDER` — three spots, one per product card. Replace `$__` with your real price.
- **Images:** drop your photos into the `images/` folder using the exact filenames above (or update the `src=` paths in `index.html` if you rename them).
- **Text/copy:** look for `EDIT TEXT` comments in `index.html` (currently the Our Story section).
- **Colors:** all colors are defined once at the top of `css/style.css` under `:root` (`--color-yellow`, `--color-brown`, `--color-cream`, `--color-blue-accent`). Change them there and the whole site updates.
- **Payment info / footer:** the footer in `index.html` has an `EDIT` comment where you can add specific Venmo/Zelle handles if you want them displayed publicly.

## 2. Netlify Deployment Steps

**Option A — Drag and drop (fastest, no account setup beyond signing up):**
1. Go to [https://app.netlify.com](https://app.netlify.com) and log in or sign up (free).
2. From your Netlify dashboard, go to **Sites** and drag the entire `banana-bread-house` folder onto the page where it says "Drag and drop your site output folder here."
3. Netlify will deploy instantly and give you a live URL like `random-name-123.netlify.app`.
4. (Optional) Go to **Site settings → Change site name** to pick a custom subdomain, or add your own custom domain under **Domain management**.

**Option B — Git-based deploy (better if you'll keep updating the site):**
1. Push this folder to a GitHub repository.
2. In Netlify, click **Add new site → Import an existing project**, connect GitHub, and select the repo.
3. Leave build command blank and set publish directory to `/` (root), since there's no build step.
4. Click **Deploy**. Every future `git push` will auto-redeploy the site.

## 3. Connecting the Order Form (Free Options)

Right now, `js/script.js` just shows a "Thank you" message on the page — **it does not send orders anywhere yet**. Pick one option below:

### Option A — Formspree (easiest, sends straight to your email)
1. Go to [https://formspree.io](https://formspree.io) and create a free account.
2. Create a new form and copy the unique endpoint URL it gives you (looks like `https://formspree.io/f/xxxxxxx`).
3. In `index.html`, update the form opening tag:
   ```html
   <form id="order-form" class="order-form" action="https://formspree.io/f/xxxxxxx" method="POST">
   ```
4. In `js/script.js`, delete or comment out the line `e.preventDefault();` inside the submit handler so the form actually submits to Formspree instead of just showing the on-page message.
5. Submit a test order — Formspree will email you the details, and you can also view submissions in your Formspree dashboard. Free tier allows a limited number of submissions per month.

### Option B — Netlify Forms (built in, free, no extra signup)
1. In `index.html`, add `data-netlify="true"` and a `name` attribute to the form tag:
   ```html
   <form id="order-form" class="order-form" name="order" data-netlify="true" method="POST">
   ```
2. Add this hidden input right inside the form (Netlify needs it to detect the form at build time):
   ```html
   <input type="hidden" name="form-name" value="order">
   ```
3. In `js/script.js`, remove the `e.preventDefault();` line so the form submits normally.
4. Redeploy to Netlify. Go to **Site settings → Forms** in your Netlify dashboard to view submissions, and set up **Form notifications** there to get an email every time someone orders.

### Option C — Google Sheets (free, good if you want orders in a spreadsheet)
1. Create a new Google Sheet with column headers matching the form fields (Name, Email, Phone, Product, Quantity, Pickup Date, Pickup Time, Notes, Payment Method).
2. In the Sheet, go to **Extensions → Apps Script**, delete the placeholder code, and paste a script that listens for POST requests and appends a row using `SpreadsheetApp` (many free tutorials online show this exact ~15-line script — search "Google Apps Script form to Google Sheet web app").
3. Deploy the script as a **Web App** (Deploy → New deployment → Web app), set access to "Anyone," and copy the resulting web app URL.
4. In `js/script.js`, replace the confirmation-only logic with a `fetch()` POST call to that URL, sending the form data as JSON or form-encoded data, then show the confirmation message after the request succeeds.
5. This requires a little JavaScript editing — if you'd like, share your Apps Script web app URL and I can write the exact `fetch()` code for you.

**Recommendation:** Start with Formspree or Netlify Forms — both take under 10 minutes and need no coding beyond the small edits above. Move to Google Sheets later only if you specifically want orders auto-logged in a spreadsheet.
