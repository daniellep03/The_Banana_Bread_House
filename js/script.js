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
const orderItems = document.getElementById('order-items');
const addItemBtn = document.getElementById('add-item-btn');
const pickupDateInput = document.getElementById('pickup-date');

// ===== Multiple loaves per order =====
// Each row lets the customer pick a different loaf + quantity.
// Fields are renamed (product_1/quantity_1, product_2/quantity_2, ...)
// so Formspree receives every line item in the email.
const loafOptionsHtml = document.querySelector('.item-product').innerHTML;

function renumberItems() {
  const rows = orderItems.querySelectorAll('.order-item');
  rows.forEach(function (row, index) {
    const n = index + 1;
    row.querySelector('.item-product').name = 'product_' + n;
    row.querySelector('.item-quantity').name = 'quantity_' + n;
    row.querySelector('.remove-item-btn').hidden = rows.length === 1;
  });
}

addItemBtn.addEventListener('click', function () {
  const row = document.createElement('div');
  row.className = 'order-item';
  row.innerHTML =
    '<select class="item-product" required>' + loafOptionsHtml + '</select>' +
    '<input type="number" class="item-quantity" min="1" value="1" required>' +
    '<button type="button" class="remove-item-btn">&times;</button>';
  orderItems.appendChild(row);
  renumberItems();
});

orderItems.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-item-btn')) {
    e.target.closest('.order-item').remove();
    renumberItems();
  }
});

// ===== Pickup is Fridays and Saturdays only =====
pickupDateInput.addEventListener('input', function () {
  if (!pickupDateInput.value) {
    pickupDateInput.setCustomValidity('');
    return;
  }
  // Parse as local date (avoid UTC off-by-one from "YYYY-MM-DD" parsing)
  const parts = pickupDateInput.value.split('-').map(Number);
  const day = new Date(parts[0], parts[1] - 1, parts[2]).getDay(); // 0=Sun ... 6=Sat
  if (day === 5 || day === 6) {
    pickupDateInput.setCustomValidity('');
  } else {
    pickupDateInput.setCustomValidity('Pickup is only available on Fridays and Saturdays. Please choose one of those days.');
  }
});

orderForm.addEventListener('submit', function (e) {
  // Submits to Formspree (see action= on the form tag) via fetch so we can
  // show the confirmation message without leaving the page.
  e.preventDefault();

  pickupDateInput.dispatchEvent(new Event('input'));

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
        // Collapse back to a single loaf row after a successful order
        orderItems.querySelectorAll('.order-item').forEach(function (row, index) {
          if (index > 0) row.remove();
        });
        renumberItems();
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong submitting your order. Please try again or reach out directly.');
      }
    })
    .catch(function () {
      alert('Something went wrong submitting your order. Please try again or reach out directly.');
    });
});
