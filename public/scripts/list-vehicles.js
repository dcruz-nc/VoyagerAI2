// list-vehicles.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../../models/vehicle');

async function listVehicles() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // fetch all vehicles, selecting key fields
  const vehicles = await Vehicle.find()
    .select('vin make model year pricePerDay available')
    .lean();

  // print count and details
  console.log(`📋 Found ${vehicles.length} vehicles:\n`);
  console.table(vehicles);

  await mongoose.disconnect();  // close connection
}

listVehicles()
  .catch(err => {
    console.error('Error listing vehicles:', err);
    process.exit(1);
  })
  .then(() => process.exit(0));

