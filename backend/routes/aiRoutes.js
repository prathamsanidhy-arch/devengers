const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeImage);

module.exports = router;
