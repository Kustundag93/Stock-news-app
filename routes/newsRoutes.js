const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get news for a ticker
router.get('/', newsController.getYahooNews);

module.exports = router; 