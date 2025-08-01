const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();


// GET all vehicles
router.get('/', vehicleController.getAllVehicles);

// GET available vehicles
router.get('/available', vehicleController.getAvailableVehicles);

// GET Featured vehicles
router.get('/featured', vehicleController.getAvailableVehicles);

module.exports = router;
