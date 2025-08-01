const Vehicle = require('../models/Vehicle');

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


exports.rentals = (req, res)=>{
    res.render('./rentals/rentals', {
        currentPage: 'rentals',
        extraStyles: '/css/rentals.css',
        defaultStyles: true
    });
}

exports.payment = (req, res)=>{
    res.render('./rentals/payment', {
        currentPage: 'payment',
        extraStyles: '/css/rentals.css',
        defaultStyles: true
    });
};


