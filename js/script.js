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
  // Submits to Formspree (see action= on the form tag) via fetch so we can
  // show the confirmation message without leaving the page.
  e.preventDefault();

  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  fetch(orderForm.action, {
    method: 'POST',
    body: new FormData(orderForm),
    headers: { Accept: 'application/json' }
  })
    .then(function (response) {
      if (response.ok) {
        confirmation.hidden = false;
        orderForm.reset();
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong submitting your order. Please try again or reach out directly.');
      }
    })
    .catch(function () {
      alert('Something went wrong submitting your order. Please try again or reach out directly.');
    });
});
