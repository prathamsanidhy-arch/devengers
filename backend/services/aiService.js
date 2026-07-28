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
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error('Failed to analyze image with AI');
  }
};

const getRuleBasedSchemes = (profile) => {
  const schemes = [];
  
  if (profile.personalStatus?.farmer || profile.farmerStatus === 'Yes') {
    schemes.push({
      schemeName: "PM Kisan Samman Nidhi",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 95,
      estimatedProcessingTime: "30-45 Days",
      benefitSummary: "₹6,000 per year transferred in three equal installments directly to the bank accounts of farmer families.",
      whyEligible: "You identified as a farmer, which is the primary criterion for this income support scheme.",
      applicationTips: ["Ensure your Aadhaar is linked with your bank account.", "Have your land holding papers ready."],
      requiredDocuments: ["Aadhaar Card", "Land Holding Papers", "Bank Account Details"],
      importantNotes: "Only small and marginal farmer families with cultivable landholding are eligible.",
      suggestedNextSteps: "Visit the PM Kisan portal or your nearest CSC to register."
    });
  }

  if (profile.housingStatus === 'Homeless' || profile.housingStatus === 'Rental') {
    schemes.push({
      schemeName: "PM Awas Yojana (PMAY)",
      eligibilityBadge: profile.annualIncome < 300000 ? "Eligible" : "Partially Eligible",
      eligibilityPercentage: profile.annualIncome < 300000 ? 90 : 60,
      estimatedProcessingTime: "3-6 Months",
      benefitSummary: "Credit-linked subsidy for purchasing or constructing a pucca house.",
      whyEligible: `You currently live in a ${profile.housingStatus} setup, making you a target beneficiary for housing schemes.`,
      applicationTips: ["Keep your income certificate updated.", "Female ownership of the property is highly encouraged and sometimes mandatory."],
      requiredDocuments: ["Aadhaar Card", "Income Certificate", "Bank Account"],
      importantNotes: "The subsidy amount depends on your income category (EWS, LIG, MIG).",
      suggestedNextSteps: "Check your name in the SECC-2011 data or apply through a CSC."
    });
  }

  if (profile.annualIncome < 250000 || profile.socialCategory === 'SC' || profile.socialCategory === 'ST') {
     schemes.push({
      schemeName: "Ayushman Bharat PM-JAY",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 92,
      estimatedProcessingTime: "15 Days",
      benefitSummary: "Health insurance cover of up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
      whyEligible: "Your income level and social category align with the target demographics for free health coverage.",
      applicationTips: ["You don't need to apply if your name is in the SECC 2011 list.", "Just get your Ayushman Card made at a hospital or CSC."],
      requiredDocuments: ["Aadhaar Card", "Ration Card", "Mobile Number"],
      importantNotes: "Pre-existing diseases are covered from day one.",
      suggestedNextSteps: "Visit pmjay.gov.in to check your eligibility using your mobile number or ration card."
    });
  }

  if (profile.personalStatus?.womanEntrepreneur || profile.socialCategory === 'SC' || profile.socialCategory === 'ST') {
    schemes.push({
      schemeName: "Stand Up India",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 88,
      estimatedProcessingTime: "1-2 Months",
      benefitSummary: "Bank loans between ₹10 lakh and ₹1 crore for setting up a greenfield enterprise.",
      whyEligible: "As a woman entrepreneur or SC/ST applicant, you qualify for this enterprise support scheme.",
      applicationTips: ["Prepare a solid business plan.", "Ensure you are not in default to any bank."],
      requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Plan", "Caste Certificate (if applicable)"],
      importantNotes: "The enterprise can be in manufacturing, services, or the trading sector.",
      suggestedNextSteps: "Approach your nearest bank branch or apply via the Stand Up India portal."
    });
  }

  if (profile.personalStatus?.businessOwner || profile.employmentStatus === 'Self-Employed') {
    schemes.push({
      schemeName: "PM MUDRA Yojana",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 85,
      estimatedProcessingTime: "30 Days",
      benefitSummary: "Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.",
      whyEligible: "You are a business owner/self-employed, which fits the MUDRA scheme's target for small enterprise funding.",
      applicationTips: ["Decide whether you need Shishu (up to ₹50K), Kishore (₹50K-₹5L), or Tarun (₹5L-₹10L) loan.", "Maintain a good credit history."],
      requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Proof", "Bank Statement"],
      importantNotes: "No collateral is required for MUDRA loans.",
      suggestedNextSteps: "Visit the Udyamimitra portal or your current bank to apply."
    });
  }

  if (profile.familyMembers > 2 && profile.maritalStatus === 'Married') {
    schemes.push({
      schemeName: "Sukanya Samriddhi Yojana",
      eligibilityBadge: "Partially Eligible",
      eligibilityPercentage: 70,
      estimatedProcessingTime: "1-2 Days",
      benefitSummary: "High-interest savings scheme for the girl child under the Beti Bachao Beti Padhao campaign.",
      whyEligible: "As a married individual with a family, if you have a girl child under 10 years, you can open this account.",
      applicationTips: ["Open the account as early as possible to maximize returns.", "Minimum deposit is just ₹250 per year."],
      requiredDocuments: ["Girl Child's Birth Certificate", "Parent's Aadhaar Card", "Parent's PAN Card"],
      importantNotes: "Account can be opened in any post office or authorized commercial bank.",
      suggestedNextSteps: "Visit your nearest post office with the required documents."
    });
  }

  if (profile.age >= 18 && profile.age <= 40 && profile.employmentStatus !== 'Retired') {
    schemes.push({
      schemeName: "Atal Pension Yojana (APY)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 95,
      estimatedProcessingTime: "7 Days",
      benefitSummary: "Guaranteed minimum pension of ₹1,000 to ₹5,000 per month after age 60.",
      whyEligible: `Your age (${profile.age}) is within the eligible bracket (18-40 years) for subscribing to APY.`,
      applicationTips: ["Set up auto-debit from your savings account.", "The earlier you join, the lower your monthly contribution."],
      requiredDocuments: ["Aadhaar Card", "Savings Bank Account"],
      importantNotes: "You must not be a member of any statutory social security scheme or a taxpayer to get government co-contribution.",
      suggestedNextSteps: "Contact your bank branch to fill out the APY registration form."
    });
  }

  if (!profile.utilities?.lpg && (profile.areaType === 'Rural' || profile.annualIncome < 200000)) {
    schemes.push({
      schemeName: "PM Ujjwala Yojana",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 90,
      estimatedProcessingTime: "15-20 Days",
      benefitSummary: "Free LPG connection to women of Below Poverty Line (BPL) families.",
      whyEligible: "You don't currently have an LPG connection and meet the income/area criteria.",
      applicationTips: ["The connection must be in the name of an adult woman of the family."],
      requiredDocuments: ["Aadhaar Card", "Ration Card", "Bank Account Details", "Passport Size Photo"],
      importantNotes: "Subsidies are provided on the first few refills.",
      suggestedNextSteps: "Visit your nearest LPG distributor to submit the KYC form."
    });
  }

  if (profile.occupation && (profile.occupation.toLowerCase().includes('vendor') || profile.occupation.toLowerCase().includes('hawker'))) {
    schemes.push({
      schemeName: "PM SVANidhi",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 95,
      estimatedProcessingTime: "15-30 Days",
      benefitSummary: "Collateral-free working capital loan of up to ₹10,000 for street vendors.",
      whyEligible: "Your occupation as a vendor makes you directly eligible for this micro-credit facility.",
      applicationTips: ["Regular repayment rewards you with an increased loan limit next time.", "Digital transactions offer cashback."],
      requiredDocuments: ["Aadhaar Card", "Vending Certificate / ID Card", "Bank Account"],
      importantNotes: "Interest subsidy of 7% per annum is credited directly to your account on timely repayment.",
      suggestedNextSteps: "Apply online at pmsvanidhi.mohua.gov.in."
    });
  }

  if (profile.personalStatus?.student || profile.studentStatus === 'Yes') {
    schemes.push({
      schemeName: "National Scholarship Portal (NSP)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 90,
      estimatedProcessingTime: "Depends on academic cycle",
      benefitSummary: "Single window for various Central and State Government scholarships.",
      whyEligible: "As a student, you can access numerous scholarships based on your merit, category, and income.",
      applicationTips: ["Ensure your Aadhaar is seeded with your bank account for DBT.", "Keep your income and caste certificates ready."],
      requiredDocuments: ["Aadhaar Card", "Income Certificate", "Marksheet", "Bank Passbook", "Caste Certificate (if applicable)"],
      importantNotes: "Deadlines strictly follow the academic year schedule.",
      suggestedNextSteps: "Register on scholarships.gov.in and find the scheme that matches your course."
    });
  }

  if (profile.age >= 15 && profile.age <= 35 && profile.employmentStatus === 'Unemployed') {
     schemes.push({
      schemeName: "PM Kaushal Vikas Yojana (PMKVY)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 88,
      estimatedProcessingTime: "Varies by course",
      benefitSummary: "Free industry-relevant skill training to help secure a better livelihood.",
      whyEligible: "Your age and employment status make you an ideal candidate for skill development programs.",
      applicationTips: ["Choose a course that has high demand in your local area.", "Attend classes regularly as assessment is mandatory for certification."],
      requiredDocuments: ["Aadhaar Card", "Bank Account", "Passport Size Photo"],
      importantNotes: "Placement assistance is provided upon successful course completion.",
      suggestedNextSteps: "Find a nearby training center via the Skill India portal."
    });
  }

  if (profile.age >= 18 && profile.employmentStatus === 'Self-Employed' && profile.annualIncome < 500000) {
      schemes.push({
      schemeName: "PM Employment Generation Programme (PMEGP)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 80,
      estimatedProcessingTime: "1-2 Months",
      benefitSummary: "Credit-linked subsidy program aimed at generating self-employment opportunities through micro-enterprises.",
      whyEligible: "You are of age and self-employed with an income level that qualifies for enterprise subsidies.",
      applicationTips: ["Your project cost should not exceed ₹50 lakh for manufacturing and ₹20 lakh for the service sector.", "Complete the EDP training."],
      requiredDocuments: ["Aadhaar Card", "Project Report", "Caste/Special Category Certificate", "Education Proof"],
      importantNotes: "Beneficiary contribution is only 5-10% of the project cost.",
      suggestedNextSteps: "Apply online on the KVIC portal."
    });
  }

  if (profile.personalStatus?.businessOwner) {
    schemes.push({
      schemeName: "Startup India Seed Fund Scheme",
      eligibilityBadge: "Partially Eligible",
      eligibilityPercentage: 60,
      estimatedProcessingTime: "2-3 Months",
      benefitSummary: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
      whyEligible: "You are a business owner; if your business is DPIIT-recognized, you can apply for seed funding.",
      applicationTips: ["Ensure your business is incorporated as a Private Limited Company or LLP.", "Register on the Startup India portal first."],
      requiredDocuments: ["DPIIT Recognition Certificate", "Incorporation Certificate", "Pitch Deck"],
      importantNotes: "The startup must not be older than 2 years at the time of application.",
      suggestedNextSteps: "Get DPIIT recognition and apply via the Startup India portal."
    });
  }

  if (profile.occupation && ['artisan', 'craftsman', 'carpenter', 'blacksmith', 'weaver', 'tailor'].some(occ => profile.occupation.toLowerCase().includes(occ))) {
     schemes.push({
      schemeName: "PM Vishwakarma Yojana",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 98,
      estimatedProcessingTime: "30 Days",
      benefitSummary: "Support for traditional artisans and craftspeople including recognition, skill upgradation, toolkit incentive, and credit support.",
      whyEligible: `Your occupation aligns perfectly with the traditional trades supported by PM Vishwakarma.`,
      applicationTips: ["Register through your local Gram Panchayat or Urban Local Body.", "Avail the 5-7 days basic training to get the toolkit incentive."],
      requiredDocuments: ["Aadhaar Card", "Bank Account Details", "Ration Card"],
      importantNotes: "Loans up to ₹3 lakh are provided at a concessional interest rate of 5%.",
      suggestedNextSteps: "Visit the PM Vishwakarma portal or a local CSC to enroll."
    });
  }

  if (profile.areaType === 'Rural' && !profile.utilities?.internet) {
      schemes.push({
      schemeName: "PM Gramin Digital Saksharta Abhiyaan (PMGDISHA)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 90,
      estimatedProcessingTime: "10 Days",
      benefitSummary: "Free digital literacy training to rural citizens to help them operate computers/tablets and use the internet.",
      whyEligible: "As a rural resident without internet access, you qualify for this digital empowerment scheme.",
      applicationTips: ["Find a local CSC offering the PMGDISHA course.", "Training duration is 20 hours."],
      requiredDocuments: ["Aadhaar Card"],
      importantNotes: "Only one person per eligible household can be trained.",
      suggestedNextSteps: "Contact your nearest Common Service Centre (CSC)."
    });
  }

  if (schemes.length === 0) {
    schemes.push({
      schemeName: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 99,
      estimatedProcessingTime: "1 Day",
      benefitSummary: "Accidental death and disability insurance cover of ₹2 lakh for a premium of just ₹20 per year.",
      whyEligible: "This scheme is universally available to all bank account holders between 18 and 70 years of age.",
      applicationTips: ["Enable auto-debit from your savings account to ensure continuous coverage."],
      requiredDocuments: ["Aadhaar Card", "Bank Account"],
      importantNotes: "The premium is deducted automatically in May every year.",
      suggestedNextSteps: "Visit your bank branch or use net banking to enroll."
    });
    
    schemes.push({
      schemeName: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
      eligibilityBadge: "Eligible",
      eligibilityPercentage: 99,
      estimatedProcessingTime: "1 Day",
      benefitSummary: "Life insurance cover of ₹2 lakh for a premium of ₹436 per year.",
      whyEligible: "Universally available to all bank account holders between 18 and 50 years of age.",
      applicationTips: ["Can be bundled with PMSBY.", "Ensure sufficient balance in May for auto-debit."],
      requiredDocuments: ["Aadhaar Card", "Bank Account"],
      importantNotes: "Coverage is valid for one year and renewable.",
      suggestedNextSteps: "Enroll through your bank branch or online banking."
    });
  }

  return schemes.sort((a,b) => b.eligibilityPercentage - a.eligibilityPercentage).slice(0, 5);
}

const discoverSchemes = async (profileData) => {
  if (!process.env.GEMINI_API_KEY) {
    return getRuleBasedSchemes(profileData);
  }

  try {
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
      "eligibilityBadge": "Eligible" or "Partially Eligible" or "Not Eligible",
      "eligibilityPercentage": Number between 50 and 99,
      "estimatedProcessingTime": "e.g., 15-30 Days",
      "benefitSummary": "Short 2 sentence summary of what the scheme provides.",
      "whyEligible": "Personalized explanation of why this citizen qualifies.",
      "applicationTips": ["Tip 1", "Tip 2"],
      "requiredDocuments": ["Aadhar Card", "Income Certificate"],
      "importantNotes": "Important caveat or deadline (or null)",
      "suggestedNextSteps": "Clear call to action on how to apply."
    }
    }
    `;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Gemini AI Error (Schemes):", error);
    return getRuleBasedSchemes(profileData);
  }
};

module.exports = {
  analyzeComplaintImage,
  discoverSchemes
};
