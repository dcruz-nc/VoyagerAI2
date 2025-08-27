const RentalSession = require('../models/rentalSession');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');

async function cleanupOrphanedSessions() {
  const sessions = await RentalSession.find().lean();
  const orphanedIds = [];

  for (const session of sessions) {
    const [vehicleExists, userExists] = await Promise.all([
      Vehicle.exists({ _id: session.vehicle }),
      User.exists({ _id: session.user }),
    ]);

    if (!vehicleExists || !userExists) {
      orphanedIds.push(session._id);
    }
  }

  if (orphanedIds.length > 0) {
    await RentalSession.deleteMany({ _id: { $in: orphanedIds } });
    console.log(`🧹 Cleaned ${orphanedIds.length} orphaned rental session(s).`);
  }
}

module.exports = cleanupOrphanedSessions;
