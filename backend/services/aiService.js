const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeComplaintImage = async (base64Image, mimeType) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an expert civic AI assistant for Smart Bharat.
  Analyze the following image of a civic issue (e.g., pothole, garbage, broken pipe, power outage).
  Generate a JSON response containing the following fields:
  - title: A short, clear title for the complaint.
  - description: A detailed professional description of the issue seen in the image.
  - category: Must be one of exactly these: "Infrastructure", "Water & Sanitation", "Electricity", "Waste Management", "Others".
  - priority: Estimate the severity. Must be one of: "Low", "Medium", "High", "Critical".
  - department: The responsible government department (e.g., "Municipal Corporation", "Water Board").
  - confidenceScore: A number from 0 to 100 indicating how confident you are in this analysis.

  IMPORTANT: Return ONLY valid JSON, no markdown formatting blocks.
  `;

  const imageParts = [
    {
      inlineData: {
        data: base64Image,
        mimeType
      }
    }
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    // sanitize response to ensure valid JSON parsing
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error('Failed to analyze image with AI');
  }
};

const discoverSchemes = async (profileData) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
  You are an expert Indian Government Scheme Advisor for Smart Bharat.
  Given the following citizen profile, recommend 3 to 5 highly relevant government schemes (Central or State level).
  
  Citizen Profile:
  ${JSON.stringify(profileData, null, 2)}

  Return a JSON array of objects. Each object MUST have the following strict structure:
  {
    "schemeName": "Name of the Scheme",
    "benefits": ["Benefit 1", "Benefit 2"],
    "whyEligible": "A clear, simple explanation of why this citizen qualifies based on their profile.",
    "eligibilityConditions": ["Condition 1", "Condition 2"],
    "requiredDocuments": ["Aadhar Card", "Income Certificate", "etc"],
    "howToApply": "Step-by-step simple instructions on how to apply.",
    "importantNotes": "Any deadlines or caveats (or null if none)",
    "confidenceScore": 95
  }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error (Schemes):", error);
    throw new Error('Failed to discover schemes');
  }
};

module.exports = {
  analyzeComplaintImage,
  discoverSchemes
};
