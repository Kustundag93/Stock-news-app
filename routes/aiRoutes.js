const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Interpret news with AI
router.post('/interpret', newsController.interpretNews);

// Interpret news from link with AI
router.post('/interpret-link', newsController.interpretNewsFromLink);

module.exports = router; 