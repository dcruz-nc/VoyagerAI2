document.addEventListener('DOMContentLoaded', () => {
    console.log("Policies script loaded");
  const setMsg = (el, msg, ok) => { el.textContent = msg; el.className = "output " + (ok ? "eligible" : "not-eligible"); };

  window.checkAge = function() {
    const age = +document.getElementById("age").value;
    setMsg(document.getElementById("ageResult"),
      age >= 19 ? "✅ Eligible to rent." : "❌ Not eligible (must be 19+).",
      age >= 19);
  }

  window.checkRefund = function() {
    const hrs = +document.getElementById("cancelHours").value;
    setMsg(document.getElementById("refundResult"),
      hrs >= 24 ? "✅ Full refund." :
      hrs > 0 ? "⚠️ 50% refund." : "❌ No refund.",
      hrs >= 24);
  }

  window.checkInsurance = function() {
    const val = document.querySelector('input[name="insurance"]:checked');
    if (!val) return setMsg(insuranceResult, "❗ Select insurance option.", false);
    const msgMap = {
      basic: "✅ Basic ($10/day) selected.",
      standard: "✅ Standard ($20/day) selected.",
      premium: "✅ Premium ($30/day) selected.",
      none: "❌ You’re responsible for damages."
    };
    setMsg(insuranceResult, msgMap[val.value], val.value !== "none");
  }

  window.checkFuel = function() {
    const val = document.getElementById("fuelStatus").value;
    setMsg(fuelResult,
      val === "full" ? "✅ No fuel charges." :
      val === "low" ? "❌ Fuel charges apply." : "❗ Select fuel status.",
      val === "full");
  }

  window.calculateLateFee = function() {
    const hrs = +document.getElementById("lateHours").value;
    setMsg(lateResult,
      hrs <= 0 ? "✅ No late fee." : `⚠️ Late fee: $${hrs * 10}`,
      hrs <= 0);
  }

  window.submitPolicy = function() {
    const age = +document.getElementById("age").value;
    const insurance = document.querySelector('input[name="insurance"]:checked');
    if (!age || !insurance) return setMsg(submitMsg, "❗ Fill age and insurance.", false);
    if (age < 19) return setMsg(submitMsg, "❌ Cannot submit: age under 19.", false);
    setMsg(submitMsg, "✅ Policies submitted successfully!", true);
  }
});