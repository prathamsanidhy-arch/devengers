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

// @desc    Get AI guidance for a specific service
// @route   POST /api/ai/service-assistant
// @access  Private
const serviceAssistant = async (req, res) => {
  try {
    const { serviceName } = req.body;
    if (!serviceName) {
      return res.status(400).json({ success: false, message: 'Please provide a serviceName' });
    }
    const aiResult = await aiService.explainService(serviceName);
    res.json({ success: true, data: aiResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process chat message
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  console.log('--- [Controller: chat] Route Hit ---');
  console.log(`[Controller: chat] Incoming Request Body:`, JSON.stringify(req.body, null, 2));
  try {
    const { message, history } = req.body;
    if (!message) {
      console.log('[Controller: chat] Error: Missing message');
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }
    
    console.log(`[Controller: chat] Executing aiService.chatAssistant...`);
    const aiResult = await aiService.chatAssistant(message, history || []);
    
    console.log(`[Controller: chat] AI Service executed successfully. Parsed response:`, JSON.stringify(aiResult, null, 2));
    console.log(`[Controller: chat] Sending response to frontend.`);
    res.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('[Controller: chat] Exception caught! Full error stack:');
    console.error(error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

module.exports = {
  analyzeImage,
  serviceAssistant,
  chat
};
