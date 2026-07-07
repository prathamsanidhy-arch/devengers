const express = require('express');
const router = express.Router();
const { discoverSchemes } = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/discover', protect, discoverSchemes);

module.exports = router;
