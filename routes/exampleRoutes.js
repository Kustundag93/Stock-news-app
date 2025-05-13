const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');
const newsController = require('../controllers/newsController');

router.get('/example', exampleController.getExample);
router.get('/news', newsController.getYahooNews);
router.post('/interpret', newsController.interpretNews);
router.post('/interpret-link', newsController.interpretNewsFromLink);

module.exports = router; 