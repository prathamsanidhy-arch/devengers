require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function findBestModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    console.log("All Models with generateContent:");
    const supportedModels = data.models.filter(m => 
      m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
    );
    
    supportedModels.forEach(m => console.log(m.name));
    
    const flashModels = supportedModels.filter(m => m.name.includes("flash"));
    
    // Simple heuristic for "best" flash model: prioritize stable versions over previews, newest version number.
    // Let's print flash models and we can pick the best one programmatically or manually.
    console.log("\nFlash Models:");
    flashModels.forEach(m => console.log(m.name));
    
    // We'll consider gemini-3.5-flash or gemini-2.0-flash as candidates.
    let bestModel = flashModels.find(m => m.name === 'models/gemini-3.5-flash');
    if (!bestModel) bestModel = flashModels.find(m => m.name === 'models/gemini-2.0-flash');
    if (!bestModel && flashModels.length > 0) bestModel = flashModels[0];
    
    console.log(`\nBest Flash Model identified: ${bestModel ? bestModel.name : 'None'}`);
  } catch (err) {
    console.error(err);
  }
}

findBestModel();
