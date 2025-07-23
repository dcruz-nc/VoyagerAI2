const express = require('express');
const controller = require('../controllers/rentalController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');

const router = express.Router();

// GET /rentals: get rentals page
router.get('/', isLoggedIn, controller.rentals);

// GET /rentals/browse: get rentals browse page
router.get('/browse', controller.browse);

// GET /rentals/payment: get rentals payment page
router.get('/payment', isLoggedIn, controller.payment);

module.exports = router;