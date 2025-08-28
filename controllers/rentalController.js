const Vehicle = require('../models/vehicle');
const RentalSession = require('../models/rentalSession');
const cleanupOrphanedSessions = require('../utils/sessionCleanup');

// GET /rentals/browse - Show only available vehicles
exports.browse = async (req, res, next) => {
    try {
        const availableVehicles = await Vehicle.find({ available: true });
        const vehiclesWithEncodedNames = availableVehicles.map(vehicle => {
            const displayName = `${vehicle.make} ${vehicle.model}`;
            return {
                ...vehicle._doc, // flatten Mongoose doc
                displayName,
                encodedName: encodeURIComponent(displayName)
            };
        });

        res.render('rentals/browse', {
            availableVehicles: vehiclesWithEncodedNames,
            currentPage: 'browse',
            defaultStyles: true
        });
    } catch (error) {
        next(error);
    }
};

exports.rentals = async (req, res, next) => {
    try {
        await cleanupOrphanedSessions(); // 🧹 run cleanup first

        // get sessions for current user & populate full vehicle details
        const sessions = await RentalSession
            .find({ user: req.user._id })
            .populate('vehicle')
            .lean();

        const validSessions = sessions.filter(session => session.vehicle);

        res.render('./rentals/rentals', {
            currentPage: 'rentals',
            extraStyles: '/css/rentals.css',
            defaultStyles: true,
            user: req.user,
            sessions: validSessions
        });
    } catch (error) {
        next(error);
    }
}

exports.payment = async (req, res, next) => {
  try {
    await cleanupOrphanedSessions(); // 🧹 run cleanup first

    const { vehicleId } = req.query;

    if (!vehicleId) {
      req.flash('error', 'No vehicle selected');
      return res.redirect('/rentals/browse');
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) {
      req.flash('error', 'Vehicle not found');
      return res.redirect('/rentals/browse');
    }

    const rentalSessions = await RentalSession.find({
      vehicle: vehicleId,
      status: { $in: ['active', 'completed'] }
    }).lean();

    const bookedRanges = rentalSessions.map(session => ({
      start: session.startDate.toISOString().split('T')[0],
      end: session.endDate.toISOString().split('T')[0]
    }));

    res.render('./rentals/payment', {
      currentPage: 'payment',
              extraStyles: '/css/style.css',
      defaultStyles: true,
      vehicle,
      bookedRanges
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmRental = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    const userId = req.session.user;

    // Validate no overlap
    const overlappingSession = await RentalSession.findOne({
      vehicle: vehicleId,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (overlappingSession) {
      req.flash('error', 'Selected dates overlap with another rental');
      return res.redirect(`/rentals/payment?vehicleId=${vehicleId}`);
    }

    // Save rental session
    const newSession = new RentalSession({
      user: userId,
      vehicle: vehicleId,
      startDate,
      endDate,
      status: 'active'
    });

    await newSession.save();

    req.flash('success', 'Rental confirmed!');
    res.redirect('/rentals');
  } catch (err) {
    next(err);
  }
};


