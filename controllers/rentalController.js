const Vehicle = require('../models/Vehicle');
const RentalSession = require('../models/rentalSession');

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
        // get sessions for current user & populate full vehicle details
        const sessions = await RentalSession
            .find({ user: req.user._id })
            .populate('vehicle')
            .lean();

        res.render('./rentals/rentals', {
            currentPage: 'rentals',
            extraStyles: '/css/rentals.css',
            defaultStyles: true,
            user: req.user,
            sessions
        });
    } catch (error) {
        next(error);
    }
}

exports.payment = (req, res) => {
    res.render('./rentals/payment', {
        currentPage: 'payment',
        extraStyles: '/css/rentals.css',
        defaultStyles: true
    });
};


