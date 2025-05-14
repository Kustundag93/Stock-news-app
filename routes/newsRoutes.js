const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get news for a ticker
router.get('/', newsController.getYahooNews);

// AI ile en önemli 3 haberi belirle
router.post('/top-important', newsController.getTopImportantNews);

module.exports = router; 