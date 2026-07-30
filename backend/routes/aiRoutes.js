const express = require('express');
const router = express.Router();
const { analyzeImage, serviceAssistant, chat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeImage);
router.post('/service-assistant', protect, serviceAssistant);
router.post('/chat', protect, chat);

module.exports = router;
