document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment script loaded');
    const prices = { Tesla: 79, Civic: 45, Jeep: 72, RAV4: 52, Mustang: 89 };
    let total = 0;

    window.showPrice = function() {
      const car = document.getElementById("car").value;
      total = prices[car] || 0;
      document.getElementById("price").textContent = car ? `Total Price: $${total}` : '';
      document.getElementById("result").textContent = '';
    }

    window.pay = function() {
      const amount = parseFloat(document.getElementById("amount").value);
      const card = document.getElementById("cardType").value;
      const num = document.getElementById("cardNum").value.trim();
      const exp = document.getElementById("exp").value;
      const cvc = document.getElementById("cvc").value.trim();
      const result = document.getElementById("result");

      if (!total || !card || !amount || !num || !exp || !cvc) {
        result.textContent = "❗ Please fill out all fields.";
        result.style.color = "red";
        return;
      }

      if (amount === total) {
        result.textContent = `✅ Payment successful with ${card}. Thank you!`;
        result.style.color = "green";
      } else if (amount > total) {
        const change = (amount - total).toFixed(2);
        result.textContent = `✅ Payment successful! Your change is $${change}.`;
        result.style.color = "green";
      } else {
        result.textContent = `❌ Payment failed. You need to pay at least $${total}.`;
        result.style.color = "red";
      }
    }
});