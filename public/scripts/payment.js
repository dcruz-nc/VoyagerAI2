document.addEventListener('DOMContentLoaded', () => {
  console.log('Payment script loaded');

  const prices = { Tesla: 79, Civic: 45, Jeep: 72, RAV4: 52, Mustang: 89 };
  let total = 0;

  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const priceDisplay = document.getElementById('price');
  const resultDisplay = document.getElementById('result');

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (startDateInput && endDateInput) {
    startDateInput.min = todayStr;
    endDateInput.min = todayStr;

    startDateInput.addEventListener('change', () => {
      if (startDateInput.value) {
        endDateInput.min = startDateInput.value;
        if (endDateInput.value && endDateInput.value < startDateInput.value) {
          endDateInput.value = startDateInput.value;
        }
      } else {
        endDateInput.min = todayStr;
      }
      updatePrice();
    });

    endDateInput.addEventListener('change', () => {
      updatePrice();
    });
  }

  const cardNumInput = document.getElementById('cardNum');

if (cardNumInput) {
  cardNumInput.addEventListener('input', (e) => {
    let value = e.target.value;
    // Remove all non-digit characters (including spaces)
    value = value.replace(/\D/g, '');

    // Insert space every 4 digits
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';

    e.target.value = formattedValue;
  });
}


  // When car selection changes, update price
  const carSelect = document.getElementById('car');
  if (carSelect) {
    carSelect.addEventListener('change', () => {
      updatePrice();
    });
  }

  // Calculate number of days (inclusive)
  function getDaysCount(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Calculate difference in milliseconds
    const diffTime = endDate - startDate;
    if (diffTime < 0) return 0;
    // Convert ms to days and add 1 to be inclusive
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  function updatePrice() {
    const car = carSelect.value;
    const dailyPrice = prices[car] || 0;
    const start = startDateInput.value;
    const end = endDateInput.value;

    if (car && start && end) {
      const days = getDaysCount(start, end);
      if (days > 0) {
        total = dailyPrice * days;
        priceDisplay.textContent = `Total Price: $${total} (${days} day${days > 1 ? 's' : ''} at $${dailyPrice}/day)`;
        resultDisplay.textContent = '';
        return;
      }
    }
    total = 0;
    priceDisplay.textContent = '';
  }

  window.showPrice = updatePrice;

  window.pay = function() {
  const card = document.getElementById("cardType").value;
  const num = document.getElementById("cardNum").value.trim();
  const exp = document.getElementById("exp").value;
  const cvc = document.getElementById("cvc").value.trim();
  const result = document.getElementById("result");

  const startDate = startDateInput ? startDateInput.value : null;
  const endDate = endDateInput ? endDateInput.value : null;

  if (!total || !card || !num || !exp || !cvc || !startDate || !endDate) {
    result.textContent = "❗ Please fill out all fields including rental dates.";
    result.style.color = "red";
    return;
  }

  if (startDate > endDate) {
    result.textContent = "❗ Rental end date must be the same or after start date.";
    result.style.color = "red";
    return;
  }

  // Charge exactly the total price calculated
  result.textContent = `✅ Payment successful with ${card}. Charged $${total}. Thank you!`;
  result.style.color = "green";
}
});


/*
function getDaysCount(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  if (diffTime < 0) return 0;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Test cases:
console.assert(getDaysCount('2025-08-01', '2025-08-01') === 1, 'Test 1 Failed');
console.assert(getDaysCount('2025-08-01', '2025-08-05') === 5, 'Test 2 Failed');
console.assert(getDaysCount('2025-08-05', '2025-08-01') === 0, 'Test 3 Failed');

console.log('All simple tests passed!');
*/
