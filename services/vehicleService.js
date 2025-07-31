const Vehicle = require('../models/vehicle');

async function syncVehicles(vehicleData) {
  for (const vehicle of vehicleData) {
    const existing = await Vehicle.findOne({ vin: vehicle.vin });

    const updatedVehicle = {
      ...vehicle,
      available: existing?.available ?? vehicle.available, // Preserve DB value if exists
    };

    await Vehicle.findOneAndUpdate(
      { vin: vehicle.vin },
      updatedVehicle,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Remove vehicles that aren't in the seed (if you still want this behavior)
  const vins = vehicleData.map(v => v.vin);
  await Vehicle.deleteMany({ vin: { $nin: vins } });

  console.log('✅ Vehicle sync complete');
}

module.exports = { syncVehicles };