// Ensure DOM is loaded before executing
document.addEventListener('DOMContentLoaded', () => {
  console.log('💳 Modern payment.js loaded');

  const bookedRangesElement = document.getElementById('bookedRangesJSON');
  const priceTextElement = document.querySelector('.vehicle-summary strong');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const form = document.querySelector('form');
  const priceContainer = document.getElementById('totalPrice');
  const cardNumInput = document.getElementById('cardNum');
  const cvcInput = document.getElementById('cvc');

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

  // Enhanced card number formatting
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // Enhanced CVC input
  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

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

  // Enhanced date picker configuration
  const startPicker = flatpickr(startDateInput, {
    minDate: 'today',
    disable: disabledDates,
    dateFormat: 'Y-m-d',
    onChange: selectedDates => {
      if (selectedDates.length) {
        endPicker.set('minDate', selectedDates[0]);
        updateTotalPrice();
        addVisualFeedback(startDateInput, 'valid');
      }
    },
    onOpen: () => addVisualFeedback(startDateInput, 'focus'),
    onClose: () => removeVisualFeedback(startDateInput)
  });

  const endPicker = flatpickr(endDateInput, {
    minDate: 'today',
    disable: disabledDates,
    dateFormat: 'Y-m-d',
    onChange: selectedDates => {
      if (selectedDates.length) {
        updateTotalPrice();
        addVisualFeedback(endDateInput, 'valid');
      }
    },
    onOpen: () => addVisualFeedback(endDateInput, 'focus'),
    onClose: () => removeVisualFeedback(endDateInput)
  });

  function isInBookedRange(dateStr) {
    return disabledDates.includes(dateStr);
  }

  function updateTotalPrice() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      priceContainer.textContent = '';
      priceContainer.style.display = 'none';
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
    priceContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
        <span>💰</span>
        <span>Total: $${total.toFixed(2)} (${dayCount} day${dayCount !== 1 ? 's' : ''})</span>
      </div>
    `;
    priceContainer.style.display = 'block';
    
    // Add animation
    priceContainer.style.animation = 'none';
    priceContainer.offsetHeight; // Trigger reflow
    priceContainer.style.animation = 'fadeInUp 0.5s ease-out';
  }

  // Visual feedback functions
  function addVisualFeedback(input, type) {
    input.classList.remove('input-error', 'input-valid', 'input-focus');
    input.classList.add(`input-${type}`);
  }

  function removeVisualFeedback(input) {
    input.classList.remove('input-focus');
  }

  // Enhanced form validation
  form.addEventListener('submit', e => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      e.preventDefault();
      showNotification('Please select both start and end dates', 'error');
      return;
    }

    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const iso = current.toISOString().split('T')[0];
      if (isInBookedRange(iso)) {
        e.preventDefault();
        showNotification('❌ Selected dates include unavailable days. Please adjust your rental period.', 'error');
        return;
      }
      current.setDate(current.getDate() + 1);
    }

    // Show success notification
    showNotification('✅ Processing your payment...', 'success');
  });

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;

    // Set background based on type
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .input-focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
    }

    .input-valid {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
    }

    .input-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
    }

    .notification {
      font-family: 'Inter', sans-serif;
    }
  `;
  document.head.appendChild(style);

  console.log('🚀 Enhanced payment form ready');
  console.log('Disabled Dates:', disabledDates);
  console.log('Booked Ranges:', bookedRanges);
});
