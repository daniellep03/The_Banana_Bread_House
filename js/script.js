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

// ===== PRICES =====
// Update these if your prices change. Keep keys matching the <option value="">
// text exactly in index.html's loaf <select> options.
const PRICES = {
  'The Original Loaf': 14,
  'Chocolate Chip Banana Bread': 15,
  'Walnut Banana Bread': 16
};

// ===== PICKUP SCHEDULE =====
// Edit the time-slot lists here if pickup hours ever change.
const PICKUP_TIMES = {
  5: ['6:00 PM - 8:00 PM'], // Friday
  6: ['10:00 AM - 2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'] // Saturday
};
const HOW_MANY_WEEKS_AHEAD = 3; // how many upcoming Fri/Sat dates to list

const orderForm = document.getElementById('order-form');
const confirmation = document.getElementById('form-confirmation');
const orderItems = document.getElementById('order-items');
const addItemBtn = document.getElementById('add-item-btn');
const pickupDateSelect = document.getElementById('pickup-date');
const pickupTimeSelect = document.getElementById('pickup-time');
const paymentMethodSelect = document.getElementById('payment-method');
const venmoQrBlock = document.getElementById('venmo-qr-block');
const totalAmountEl = document.getElementById('order-total-amount');

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

function updateTotal() {
  let total = 0;
  orderItems.querySelectorAll('.order-item').forEach(function (row) {
    const product = row.querySelector('.item-product').value;
    const qty = parseInt(row.querySelector('.item-quantity').value, 10) || 0;
    const price = PRICES[product] || 0;
    total += price * qty;
  });
  totalAmountEl.textContent = '$' + total.toFixed(2).replace(/\.00$/, '');
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
  updateTotal();
});

orderItems.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-item-btn')) {
    e.target.closest('.order-item').remove();
    renumberItems();
    updateTotal();
  }
});

orderItems.addEventListener('change', function (e) {
  if (e.target.classList.contains('item-product') || e.target.classList.contains('item-quantity')) {
    updateTotal();
  }
});
orderItems.addEventListener('input', function (e) {
  if (e.target.classList.contains('item-quantity')) {
    updateTotal();
  }
});

// ===== Pickup date options: next few upcoming Fridays and Saturdays =====
function formatDateLabel(date) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return dayName + ', ' + monthDay;
}

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function buildPickupDateOptions() {
  const upcoming = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7 * HOW_MANY_WEEKS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay(); // 5 = Friday, 6 = Saturday
    if (day === 5 || day === 6) {
      upcoming.push(d);
    }
  }

  upcoming.forEach(function (date) {
    const option = document.createElement('option');
    option.value = toIsoDate(date);
    option.dataset.day = date.getDay();
    option.textContent = formatDateLabel(date);
    pickupDateSelect.appendChild(option);
  });
}

function updatePickupTimeOptions() {
  const selected = pickupDateSelect.selectedOptions[0];
  pickupTimeSelect.innerHTML = '';

  if (!selected || !selected.dataset.day) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Select a pickup date first';
    pickupTimeSelect.appendChild(placeholder);
    pickupTimeSelect.disabled = true;
    return;
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = 'Select a pickup time';
  pickupTimeSelect.appendChild(placeholder);

  const times = PICKUP_TIMES[Number(selected.dataset.day)] || [];
  times.forEach(function (time) {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    pickupTimeSelect.appendChild(option);
  });

  pickupTimeSelect.disabled = false;
}

pickupDateSelect.addEventListener('change', updatePickupTimeOptions);
buildPickupDateOptions();

// ===== Venmo QR: show only when Venmo is the selected payment method =====
paymentMethodSelect.addEventListener('change', function () {
  venmoQrBlock.hidden = paymentMethodSelect.value !== 'Venmo';
});

// ===== Order form submission =====
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
        // Collapse back to a single loaf row after a successful order
        orderItems.querySelectorAll('.order-item').forEach(function (row, index) {
          if (index > 0) row.remove();
        });
        renumberItems();
        updateTotal();
        updatePickupTimeOptions();
        venmoQrBlock.hidden = true;
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong submitting your order. Please try again or reach out directly.');
      }
    })
    .catch(function () {
      alert('Something went wrong submitting your order. Please try again or reach out directly.');
    });
});
