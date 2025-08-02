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

  const rawBookedRanges = JSON.parse(bookedRangesElement.textContent);
  const bookedRanges = rawBookedRanges.map(range => ({
    start: range.start.split('T')[0], // 'YYYY-MM-DD'
    end: range.end.split('T')[0]
  }));

  const pricePerDay = parseFloat(
    priceTextElement.textContent.replace('$', '').replace('/day', '')
  );

  function expandDateRanges(ranges) {
    const disabledDates = [];
    ranges.forEach(range => {
      let current = new Date(range.start);
      const end = new Date(range.end);
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        disabledDates.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
    });
    return disabledDates;
  }

  const disabledDates = expandDateRanges(bookedRanges);

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

  function isInBookedRange(dateStr) {
    return disabledDates.includes(dateStr);
  }

  function updateTotalPrice() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      priceContainer.textContent = '';
      return;
    }

    let current = new Date(startDate);
    const end = new Date(endDate);
    let dayCount = 0;

    while (current <= end) {
      const iso = current.toISOString().split('T')[0];
      if (!isInBookedRange(iso)) dayCount++;
      current.setDate(current.getDate() + 1);
    }

    const total = dayCount * pricePerDay;
    priceContainer.textContent = `Total: $${total.toFixed(2)} (${dayCount} day${dayCount !== 1 ? 's' : ''})`;
  }

  form.addEventListener('submit', e => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    let current = new Date(startDate);
    const end = new Date(endDate);

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

  console.log('Disabled Dates:', disabledDates);
  console.log('Booked Ranges:', bookedRanges);
});
