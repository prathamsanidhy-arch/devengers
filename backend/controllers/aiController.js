const aiService = require('../services/aiService');

// @desc    Analyze complaint image via AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeImage = async (req, res) => {
  try {
    // Increase body size limit for base64 strings in server.js or manually handle large bodies.
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ success: false, message: 'Please provide base64 image and mimeType' });
    }

    const aiResult = await aiService.analyzeComplaintImage(imageBase64, mimeType);

    res.json({ success: true, data: aiResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzeImage,
};
