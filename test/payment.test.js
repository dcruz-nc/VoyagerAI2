// Pure function from your code
function getDaysCount(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  if (diffTime < 0) return 0;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Tests for getDaysCount
console.assert(getDaysCount('2025-08-01', '2025-08-01') === 1, 'Test 1 Failed');
console.assert(getDaysCount('2025-08-01', '2025-08-05') === 5, 'Test 2 Failed');
console.assert(getDaysCount('2025-08-05', '2025-08-01') === 0, 'Test 3 Failed');


// Card number formatter function from your input listener
function formatCardNumber(input) {
  let value = input.replace(/\D/g, '');
  return value.match(/.{1,4}/g)?.join(' ') || '';
}

// Tests for formatCardNumber
console.assert(formatCardNumber('1234123412341234') === '1234 1234 1234 1234', 'Card Format Test 1 Failed');
console.assert(formatCardNumber('1234-1234-1234-1234') === '1234 1234 1234 1234', 'Card Format Test 2 Failed');
console.assert(formatCardNumber('') === '', 'Card Format Test 3 Failed');

console.log('All simple tests passed!');
