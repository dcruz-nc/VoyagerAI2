// Ensure DOM is loaded before executing
document.addEventListener('DOMContentLoaded', () => {
  console.log('💡 payment.js loaded');

  const bookedRangesElement = document.getElementById('bookedRangesJSON');
  const priceTextElement = document.querySelector('.vehicle-summary strong');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const form = document.querySelector('form');
  const priceContainer = document.getElementById('totalPrice');

  if (!bookedRangesElement || !priceTextElement || !startDateInput || !endDateInput || !form || !priceContainer) {
    console.warn('🚫 Missing required DOM elements — payment.js aborted.');
    return;
  }

  const bookedRanges = JSON.parse(bookedRangesElement.textContent);
  const pricePerDay = parseFloat(
    priceTextElement.textContent.replace('$', '').replace('/day', '')
  );

  // Normalize to remove time offset
  function normalize(date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  // Expand date ranges into individual days
  function expandDateRanges(ranges) {
    const disabledDates = [];
    ranges.forEach(range => {
      let current = normalize(range.start);
      const end = normalize(range.end);
      while (current <= end) {
        disabledDates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return disabledDates;
  }

  const disabledDates = expandDateRanges(bookedRanges);

  // Flatpickr init
  const startPicker = flatpickr(startDateInput, {
    minDate: 'today',
    disable: disabledDates,
    dateFormat: 'Y-m-d',
    onChange: selectedDates => {
      if (selectedDates.length) {
        endPicker.set('minDate', selectedDates[0]);
        updateTotalPrice();
      }
    }
  });

  const endPicker = flatpickr(endDateInput, {
    minDate: 'today',
    disable: disabledDates,
    dateFormat: 'Y-m-d',
    onChange: updateTotalPrice
  });

  // Check if a date falls within a booked range
  function isInBookedRange(dateStr) {
    const date = normalize(dateStr);
    return bookedRanges.some(range => {
      const start = normalize(range.start);
      const end = normalize(range.end);
      return date >= start && date <= end;
    });
  }

  // Calculate total price based on valid (non-booked) days
  function updateTotalPrice() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      priceContainer.textContent = '';
      return;
    }

    let start = normalize(startDate);
    const end = normalize(endDate);
    let dayCount = 0;

    while (start <= end) {
      const iso = start.toISOString().split('T')[0];
      if (!isInBookedRange(iso)) dayCount++;
      start.setDate(start.getDate() + 1);
    }

    const total = dayCount * pricePerDay;
    priceContainer.textContent = `Total: $${total.toFixed(2)} (${dayCount} day${dayCount !== 1 ? 's' : ''})`;
  }

  // Prevent form submission if selected dates include blocked days
  form.addEventListener('submit', e => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    let current = normalize(startDate);
    const end = normalize(endDate);

    while (current <= end) {
      const iso = current.toISOString().split('T')[0];
      if (isInBookedRange(iso)) {
        alert('❌ Selected dates include unavailable days. Please adjust your rental period.');
        e.preventDefault();
        return;
      }
      current.setDate(current.getDate() + 1);
    }
  });
});