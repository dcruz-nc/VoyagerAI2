const express = require('express');
const controller = require('../controllers/rentalController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');

const router = express.Router();

// GET /rentals/browse: get rentals browse page
router.get('/browse', controller.browse);

// GET /rentals: get rentals page
router.get('/', isLoggedIn, controller.rentals);

module.exports = router;