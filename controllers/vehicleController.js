const Vehicle = require('../models/Vehicle');

// GET /vehicles - fetch all vehicles
exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

// GET /vehicles/available - fetch only available vehicles
exports.getAvailableVehicles = async (req, res, next) => {
  try {
    const availableVehicles = await Vehicle.find({ available: true });
    res.status(200).json(availableVehicles);
  } catch (error) {
    next(error); 
  }
};

// GET /vehicles/featured - fetch featured vehicles
exports.getFeaturedVehicles = async (req, res, next) => {
  try {
    const featuredVehicles = await Vehicle.find({ isFeatured: true });
    res.status(200).json(featuredVehicles);
  } catch (error) {
    next(error);
  }
};
