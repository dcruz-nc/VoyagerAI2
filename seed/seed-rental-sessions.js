// seed-rental-sessions.js
require('dotenv').config();

const mongoose = require('mongoose');
const RentalSession = require('../models/rentalSession');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');

// to get a random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// to pick a random element from an array
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedRentalSession() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // clear all existing sessions
  await RentalSession.deleteMany({});
  console.log('🗑️ Cleared all rental sessions');

  // load user and vehicle IDs
  const users = await User.find().select('_id').lean();
  const vehicles = await Vehicle.find().select('_id').lean();
  const userIds = users.map(u => u._id);
  const vehicleIds = vehicles.map(v => v._id);

  if (!userIds.length || !vehicleIds.length) {
    console.error('No users or vehicles found. Seed some users/vehicles first.');
    process.exit(1);
  }

  // generate sessions
  const now = new Date();
  const sessions = [];
  const NUM_SESSIONS = 50;

  for (let i = 0; i < NUM_SESSIONS; i++) {
    const userId = sample(userIds);
    const vehicleId = sample(vehicleIds);

    const start = randomDate(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    const durationDays = 1 + Math.floor(Math.random() * 10);
    const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);

    let status;
    if (Math.random() < 0.1) {
      status = 'cancelled';
    } else if (end < now) {
      status = 'completed';
    } else {
      status = 'active';
    }

    sessions.push({ user: userId, vehicle: vehicleId, startDate: start, endDate: end, status });
  }

  // insert the rental sessions into MongoDB
  await RentalSession.insertMany(sessions);
  console.log(`✅ Inserted ${sessions.length} rental sessions.`);

  // Print the rental sessions
  const rs = await RentalSession.find().lean();
  console.table(rs);
  await mongoose.disconnect();
}

seedRentalSession()
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  })
  .then(() => process.exit(0));