const aiService = require('../services/aiService');

// @desc    Discover government schemes based on profile
// @route   POST /api/schemes/discover
// @access  Private
const discoverSchemes = async (req, res) => {
  try {
    const profileData = req.body;

    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide user profile data' });
    }

    const schemes = await aiService.discoverSchemes(profileData);

    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  discoverSchemes,
};
