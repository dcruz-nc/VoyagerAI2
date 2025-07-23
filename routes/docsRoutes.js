const express = require('express');
const axios = require('axios');
const controller = require('../controllers/docsController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;


const router = express.Router();

// GET /docs/support: send html form for creating a new user account
router.get('/support', controller.support);

// POST /api/contact: handle contact form submissions
router.post('/api/contact', controller.handleContactForm);

// GET /docs/faq: render FAQ page
router.get('/faq', controller.faq);

// GET /docs/policies: render policies page
router.get('/policies', controller.policies);

// GET /docs/mission: render mission page
router.get('/mission', controller.mission);

// POST /api/chat: handle chat messages to OpenAI
router.post('/api/chat', controller.chat);

module.exports = router;