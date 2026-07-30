require('dotenv').config();
const aiService = require('./services/aiService');
const fs = require('fs');

async function run() {
  try {
    // create a 1x1 pixel base64 image (transparent PNG)
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const mimeType = 'image/png';
    console.log('Testing aiService.analyzeComplaintImage...');
    const result = await aiService.analyzeComplaintImage(base64Image, mimeType);
    console.log('Result:', result);
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

run();
