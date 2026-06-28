// ============================================
// THE BANANA BREAD HOUSE — SCRIPT
// ============================================

// Auto-update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', function () {
  mainNav.classList.toggle('open');
});

// Close mobile nav after clicking a link
mainNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    mainNav.classList.remove('open');
  });
});

// Order form handling
const orderForm = document.getElementById('order-form');
const confirmation = document.getElementById('form-confirmation');

orderForm.addEventListener('submit', function (e) {
  // NOTE: This currently just shows a confirmation message on the page.
  // It does NOT send the order anywhere yet.
  //
  // To make this form actually deliver orders to your email or a
  // Google Sheet, see README.md for two free options:
  //   1. Formspree (easiest — sends to your email)
  //   2. Netlify Forms (built in, no signup)
  //   3. Google Sheets via a Google Apps Script web app
  //
  // If you set up Formspree or Netlify Forms instead, remove the
  // preventDefault() below and let the form submit normally to that service.
  e.preventDefault();

  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  confirmation.hidden = false;
  orderForm.reset();
  confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
