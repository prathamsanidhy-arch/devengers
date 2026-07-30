export const servicesData = [
  {
    id: 'pan-card',
    title: 'PAN Card',
    category: 'Finance',
    iconName: 'CreditCard',
    time: '10-15 Days',
    dept: 'Income Tax Department',
    color: 'bg-indigo-100 text-indigo-600',
    description: 'A Permanent Account Number (PAN) is a ten-character alphanumeric identifier, issued in the form of a laminated "PAN card", by the Indian Income Tax Department.',
    purpose: 'Essential for financial transactions, filing income tax returns, and as a proof of identity.',
    eligibility: 'Any Indian citizen, NRI, or foreign citizen who pays taxes in India.',
    approxFees: '₹107 for Indian communication address',
    documents: [
      { id: 'pan-doc-1', name: 'Aadhaar Card' },
      { id: 'pan-doc-2', name: 'Passport Size Photo' },
      { id: 'pan-doc-3', name: 'Address Proof' }
    ],
    faqs: [
      { q: 'Is it mandatory to link Aadhaar with PAN?', a: 'Yes, it is mandatory for all Indian citizens.' },
      { q: 'Can I apply for a PAN card online?', a: 'Yes, you can apply through the NSDL or UTIITSL website.' }
    ],
    importantNotes: 'Ensure the name on the PAN application perfectly matches your Aadhaar card to avoid rejection.',
    recentUpdates: 'Aadhaar-PAN linking deadline was strictly enforced. Non-linked PAN cards become inoperative.',
    commonMistakes: 'Mismatch of name or date of birth between Aadhaar and application form.',
    officialWebsite: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
  },
  {
    id: 'aadhaar-card',
    title: 'Aadhaar Card',
    category: 'Identity',
    iconName: 'Shield',
    time: '3-5 Days',
    dept: 'UIDAI',
    color: 'bg-amber-100 text-amber-600',
    description: 'Aadhaar is a 12-digit individual identification number issued by the Unique Identification Authority of India on behalf of the Government of India.',
    purpose: 'Used as a primary proof of identity and address across India for various government and non-government services.',
    eligibility: 'Any resident of India, including infants.',
    approxFees: 'Free for enrollment, ₹50 for demographic updates.',
    documents: [
      { id: 'aadhaar-doc-1', name: 'Proof of Identity (e.g. Passport, PAN)' },
      { id: 'aadhaar-doc-2', name: 'Proof of Address (e.g. Utility Bill)' },
      { id: 'aadhaar-doc-3', name: 'Proof of Date of Birth' }
    ],
    faqs: [
      { q: 'How can I update my address?', a: 'You can update it online through the UIDAI portal if your mobile number is linked.' }
    ],
    importantNotes: 'Keep your mobile number linked to Aadhaar updated at all times.',
    recentUpdates: 'Document update is free online for Aadhaar cards issued more than 10 years ago.',
    commonMistakes: 'Submitting blurred or outdated documents for updates.',
    officialWebsite: 'https://myaadhaar.uidai.gov.in/'
  },
  {
    id: 'passport',
    title: 'Passport Application',
    category: 'Identity',
    iconName: 'Shield',
    time: '15-30 Days',
    dept: 'Ministry of External Affairs',
    color: 'bg-blue-100 text-blue-600',
    description: 'An Indian passport is issued by the Ministry of External Affairs to citizens of India for the purpose of international travel.',
    purpose: 'International travel and strong proof of citizenship and identity.',
    eligibility: 'All Indian citizens.',
    approxFees: '₹1500 for a standard 36-page passport',
    documents: [
      { id: 'passport-doc-1', name: 'Aadhaar Card' },
      { id: 'passport-doc-2', name: 'Birth Certificate or Matriculation Certificate' },
      { id: 'passport-doc-3', name: 'Address Proof' }
    ],
    faqs: [
      { q: 'Is police verification mandatory?', a: 'Yes, police verification is required for fresh passports, usually done post-issuance for Tatkaal.' }
    ],
    importantNotes: 'Tatkaal applications are processed faster but require extra fees.',
    recentUpdates: 'DigiLocker integration allows fetching documents directly without hard copies.',
    commonMistakes: 'Providing incorrect address or mismatched signatures.',
    officialWebsite: 'https://www.passportindia.gov.in/'
  },
  {
    id: 'driving-license',
    title: 'Driving License',
    category: 'Transport',
    iconName: 'Car',
    time: '7-14 Days',
    dept: 'RTO / Ministry of Road Transport',
    color: 'bg-emerald-100 text-emerald-600',
    description: 'A driving license is an official document permitting a specific individual to operate one or more types of motorized vehicles.',
    purpose: 'Legal permission to drive and acts as a valid identity proof.',
    eligibility: '18+ years of age (16+ for gearless vehicles).',
    approxFees: '₹200 - ₹500 depending on the state',
    documents: [
      { id: 'dl-doc-1', name: 'Learner\'s License' },
      { id: 'dl-doc-2', name: 'Age Proof (Aadhaar/Birth Certificate)' },
      { id: 'dl-doc-3', name: 'Address Proof' },
      { id: 'dl-doc-4', name: 'Passport Size Photo' }
    ],
    faqs: [
      { q: 'Do I need a Learner\'s License first?', a: 'Yes, you must hold a Learner\'s License for at least 30 days before applying.' }
    ],
    importantNotes: 'A physical driving test is mandatory at the RTO.',
    recentUpdates: 'Many RTO services are now fully faceless in several states.',
    commonMistakes: 'Failing to bring the vehicle of the correct class for the driving test.',
    officialWebsite: 'https://parivahan.gov.in/parivahan/'
  },
  {
    id: 'voter-id',
    title: 'Voter ID',
    category: 'Identity',
    iconName: 'FileBadge',
    time: '15-45 Days',
    dept: 'Election Commission of India',
    color: 'bg-teal-100 text-teal-600',
    description: 'The Indian voter ID card is issued by the Election Commission of India. Its main purpose is as identity proof while casting votes.',
    purpose: 'Voting rights and general identity verification.',
    eligibility: 'Indian citizen of 18 years or older.',
    approxFees: 'Free',
    documents: [
      { id: 'voter-doc-1', name: 'Passport Size Photo' },
      { id: 'voter-doc-2', name: 'Age Proof' },
      { id: 'voter-doc-3', name: 'Address Proof' }
    ],
    faqs: [
      { q: 'Can I vote if I do not have my Voter ID?', a: 'Yes, if your name is on the electoral roll, you can use other IDs like Aadhaar or PAN to vote.' }
    ],
    importantNotes: 'Form 6 is used for new voter registration.',
    recentUpdates: 'You can now link Aadhaar with your Voter ID via Form 6B.',
    commonMistakes: 'Registering in multiple constituencies, which is illegal.',
    officialWebsite: 'https://voters.eci.gov.in/'
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    category: 'Certificates',
    iconName: 'FileText',
    time: '7-21 Days',
    dept: 'Municipal Corporation',
    color: 'bg-rose-100 text-rose-600',
    description: 'A birth certificate is a vital record that documents the birth of a person. It is the first right of a child and establishes their identity.',
    purpose: 'Proof of age, citizenship, and identity for school admissions, passports, etc.',
    eligibility: 'Any individual born in India.',
    approxFees: 'Nominal fees (₹20-₹100 depending on state)',
    documents: [
      { id: 'birth-doc-1', name: 'Hospital Discharge Proof' },
      { id: 'birth-doc-2', name: 'Parents\' Identity Proof (Aadhaar)' },
      { id: 'birth-doc-3', name: 'Marriage Certificate of Parents (if required)' }
    ],
    faqs: [
      { q: 'Is there a time limit to register a birth?', a: 'Yes, it must be registered within 21 days of occurrence.' }
    ],
    importantNotes: 'Late registration requires an affidavit and a higher fee.',
    recentUpdates: 'Digital birth certificates are increasingly available via DigiLocker.',
    commonMistakes: 'Spelling mistakes in parents\' names.',
    officialWebsite: 'https://crsorgi.gov.in/'
  },
  {
    id: 'income-certificate',
    title: 'Income Certificate',
    category: 'Revenue',
    iconName: 'FileText',
    time: '7-10 Days',
    dept: 'Revenue Department',
    color: 'bg-purple-100 text-purple-600',
    description: 'An official statement provided by the state government confirming the annual income of a person or a family.',
    purpose: 'Required for scholarships, fee concessions, and reserving quotas for EWS.',
    eligibility: 'Citizens needing proof of their economic status.',
    approxFees: '₹15 - ₹50 depending on the state',
    documents: [
      { id: 'income-doc-1', name: 'Aadhaar Card' },
      { id: 'income-doc-2', name: 'Salary Slips or ITR' },
      { id: 'income-doc-3', name: 'Affidavit from Notary' }
    ],
    faqs: [
      { q: 'How long is an income certificate valid?', a: 'Usually valid for one financial year (April to March).' }
    ],
    importantNotes: 'Ensure the income details match your actual filings to avoid legal issues.',
    recentUpdates: 'Many states offer instant certificates if linked with E-KYC.',
    commonMistakes: 'Failing to include income from all sources (e.g., agriculture, rent).',
    officialWebsite: 'https://www.india.gov.in/topics/rural-and-urban-development'
  },
  {
    id: 'caste-certificate',
    title: 'Caste Certificate',
    category: 'Revenue',
    iconName: 'Scroll',
    time: '15-30 Days',
    dept: 'Revenue Department',
    color: 'bg-orange-100 text-orange-600',
    description: 'Documentary proof of an individual belonging to a specific caste, as listed under the Indian Constitution (SC, ST, OBC).',
    purpose: 'Availing reservations in education and government jobs.',
    eligibility: 'Citizens belonging to reserved categories.',
    approxFees: 'Nominal fee (varies by state)',
    documents: [
      { id: 'caste-doc-1', name: 'Identity Proof (Aadhaar)' },
      { id: 'caste-doc-2', name: 'Address Proof' },
      { id: 'caste-doc-3', name: 'Blood Relative\'s Caste Certificate' }
    ],
    faqs: [
      { q: 'What if no relative has a caste certificate?', a: 'You can provide ancestral land records or a local enquiry will be conducted.' }
    ],
    importantNotes: 'OBC applicants may also need to provide a Non-Creamy Layer (NCL) certificate.',
    recentUpdates: 'Central vs State caste lists can differ; apply for the one you need.',
    commonMistakes: 'Applying for a Central Government job with a State-specific caste certificate.',
    officialWebsite: 'https://www.india.gov.in'
  },
  {
    id: 'domicile-certificate',
    title: 'Domicile Certificate',
    category: 'Revenue',
    iconName: 'Home',
    time: '10-20 Days',
    dept: 'Revenue Department',
    color: 'bg-pink-100 text-pink-600',
    description: 'A document issued by the state government proving that a person is a resident of a particular state/UT.',
    purpose: 'State-level quotas in educational institutions and government jobs.',
    eligibility: 'Residents who have lived in the state for a specified number of years (varies).',
    approxFees: 'Nominal fee',
    documents: [
      { id: 'domicile-doc-1', name: 'Aadhaar Card' },
      { id: 'domicile-doc-2', name: 'Proof of continuous residence (Ration card, utility bills)' },
      { id: 'domicile-doc-3', name: 'School Leaving Certificate' }
    ],
    faqs: [
      { q: 'Is domicile the same as residence certificate?', a: 'Yes, they serve the same purpose in most states.' }
    ],
    importantNotes: 'A person can possess a domicile certificate from only one state.',
    recentUpdates: 'Some states have simplified the process for students via schools.',
    commonMistakes: 'Not maintaining consecutive years of address proofs.',
    officialWebsite: 'https://www.india.gov.in'
  },
  {
    id: 'water-connection',
    title: 'Water Connection',
    category: 'Utilities',
    iconName: 'Droplets',
    time: '10-20 Days',
    dept: 'Municipal Corporation',
    color: 'bg-cyan-100 text-cyan-600',
    description: 'Application for a new municipal water supply connection to a residential or commercial property.',
    purpose: 'To secure legally supplied, safe drinking water.',
    eligibility: 'Property owners or authorized tenants.',
    approxFees: 'Varies based on pipe size and property type',
    documents: [
      { id: 'water-doc-1', name: 'Property Tax Receipt' },
      { id: 'water-doc-2', name: 'Ownership Document (Sale Deed)' },
      { id: 'water-doc-3', name: 'Identity Proof' }
    ],
    faqs: [
      { q: 'Can a tenant apply?', a: 'Yes, with an NOC from the property owner.' }
    ],
    importantNotes: 'Illegal connections can result in heavy fines and legal action.',
    recentUpdates: 'Online portals now allow tracking the status of the connection.',
    commonMistakes: 'Not clearing previous property tax dues before applying.',
    officialWebsite: 'https://mohua.gov.in/'
  },
  {
    id: 'electricity-bill',
    title: 'Electricity Bill',
    category: 'Utilities',
    iconName: 'Zap',
    time: 'Instant',
    dept: 'State Electricity Board',
    color: 'bg-yellow-100 text-yellow-600',
    description: 'View and pay your monthly electricity consumption bills online.',
    purpose: 'Maintain uninterrupted power supply to your premises.',
    eligibility: 'Registered consumers with a valid Consumer Number.',
    approxFees: 'As per consumption',
    documents: [
      { id: 'elec-doc-1', name: 'Consumer Number / Account ID' }
    ],
    faqs: [
      { q: 'Are there charges for online payment?', a: 'Most UPI/Debit payments are free, credit cards might have a small surcharge.' }
    ],
    importantNotes: 'Pay before the due date to avoid late payment surcharges.',
    recentUpdates: 'Smart meters allow prepaid recharging in many cities.',
    commonMistakes: 'Entering the wrong consumer number.',
    officialWebsite: 'https://www.bharatbillpay.com/'
  },
  {
    id: 'property-tax',
    title: 'Property Tax',
    category: 'Taxation',
    iconName: 'Home',
    time: 'Instant',
    dept: 'Municipal Corporation',
    color: 'bg-rose-100 text-rose-600',
    description: 'Annual tax paid to the local government or municipal corporation by the owner of real estate.',
    purpose: 'Funding local infrastructure like roads, sewage, and parks.',
    eligibility: 'All property owners.',
    approxFees: 'Based on property size, location, and type',
    documents: [
      { id: 'prop-doc-1', name: 'Property ID / Khata Number' }
    ],
    faqs: [
      { q: 'Do I get a rebate for early payment?', a: 'Yes, many municipalities offer a 5% to 10% rebate for early payments.' }
    ],
    importantNotes: 'Keep the payment receipt safely, it acts as a strong proof of ownership.',
    recentUpdates: 'Geo-tagging of properties is becoming mandatory in several cities.',
    commonMistakes: 'Not updating property records after adding new floors/construction.',
    officialWebsite: 'https://mohua.gov.in/'
  },
  {
    id: 'sewer-connection',
    title: 'Sewer Connection',
    category: 'Utilities',
    iconName: 'Droplets',
    time: '15-30 Days',
    dept: 'Municipal Corporation',
    color: 'bg-gray-100 text-gray-600',
    description: 'Application for connecting the household wastewater line to the municipal sewerage network.',
    purpose: 'Proper sanitation and waste disposal.',
    eligibility: 'Property owners in areas with an active sewer network.',
    approxFees: 'Varies by municipality',
    documents: [
      { id: 'sewer-doc-1', name: 'Property Ownership Proof' },
      { id: 'sewer-doc-2', name: 'Identity Proof' },
      { id: 'sewer-doc-3', name: 'Latest Property Tax Receipt' }
    ],
    faqs: [
      { q: 'Is it mandatory to connect to the sewer line?', a: 'Yes, if a line exists in your street, septic tanks must be phased out.' }
    ],
    importantNotes: 'A site inspection will be conducted before approval.',
    recentUpdates: 'Integration with water connection applications for a single-window process.',
    commonMistakes: 'Hiring unauthorized plumbers to connect to the main line.',
    officialWebsite: 'https://mohua.gov.in/'
  },
  {
    id: 'marriage-certificate',
    title: 'Marriage Certificate',
    category: 'Certificates',
    iconName: 'HeartPulse',
    time: '15-30 Days',
    dept: 'Registrar of Marriages',
    color: 'bg-red-100 text-red-600',
    description: 'An official statement that two people are married. It is registered under the Hindu Marriage Act, 1955 or the Special Marriage Act, 1954.',
    purpose: 'Required for joint visas, changing name, and claiming spouse benefits.',
    eligibility: 'Couples legally married in India.',
    approxFees: '₹100 - ₹500',
    documents: [
      { id: 'marriage-doc-1', name: 'Wedding Invitation Card' },
      { id: 'marriage-doc-2', name: 'Address Proof of both parties' },
      { id: 'marriage-doc-3', name: 'Joint Photograph' },
      { id: 'marriage-doc-4', name: 'Aadhaar Cards' }
    ],
    faqs: [
      { q: 'Is a marriage certificate mandatory?', a: 'Yes, the Supreme Court of India has made registration of marriages mandatory.' }
    ],
    importantNotes: 'Witnesses with valid ID proofs must be present at the registrar office.',
    recentUpdates: 'Online registration followed by a single physical visit is now the norm.',
    commonMistakes: 'Not carrying the original documents on the date of appointment.',
    officialWebsite: 'https://services.india.gov.in/'
  },
  {
    id: 'death-certificate',
    title: 'Death Certificate',
    category: 'Certificates',
    iconName: 'FileText',
    time: '7-21 Days',
    dept: 'Municipal Corporation',
    color: 'bg-slate-100 text-slate-600',
    description: 'An official document issued by the government, which declares cause of death, location of death, time of death and some other personal information about the deceased.',
    purpose: 'Settlement of property inheritance, insurance claims, and bank accounts.',
    eligibility: 'Next of kin of the deceased.',
    approxFees: 'Nominal fee',
    documents: [
      { id: 'death-doc-1', name: 'Hospital Death Slip or Cremation Ground Receipt' },
      { id: 'death-doc-2', name: 'Aadhaar of Deceased' },
      { id: 'death-doc-3', name: 'Applicant Identity Proof' }
    ],
    faqs: [
      { q: 'Who registers the death if it occurs at home?', a: 'The head of the household must inform the local registrar within 21 days.' }
    ],
    importantNotes: 'Ensure multiple copies are requested as they will be required at various institutions.',
    recentUpdates: 'Hospitals now directly push death data to the municipal registry portal.',
    commonMistakes: 'Delaying registration beyond 21 days, which requires magisterial order.',
    officialWebsite: 'https://crsorgi.gov.in/'
  },
  {
    id: 'pension',
    title: 'Pension',
    category: 'Finance',
    iconName: 'CreditCard',
    time: '30-45 Days',
    dept: 'Department of Pension',
    color: 'bg-green-100 text-green-600',
    description: 'Assistance for senior citizens, widows, or differently-abled individuals under various government schemes (e.g. IGNOAPS).',
    purpose: 'Financial security and social welfare.',
    eligibility: 'Based on age (usually 60+), disability, or widowhood, often with income caps.',
    approxFees: 'Free',
    documents: [
      { id: 'pension-doc-1', name: 'Age Proof / Disability Certificate / Death Certificate of Spouse' },
      { id: 'pension-doc-2', name: 'Income Certificate' },
      { id: 'pension-doc-3', name: 'Bank Passbook' }
    ],
    faqs: [
      { q: 'Do I need to verify my life status?', a: 'Yes, a Life Certificate (Jeevan Pramaan) must be submitted annually.' }
    ],
    importantNotes: 'Aadhaar seeding with the bank account is mandatory for receiving pension via DBT.',
    recentUpdates: 'Face authentication via smartphone is now accepted for Jeevan Pramaan.',
    commonMistakes: 'Forgetting the annual Life Certificate submission, leading to paused pension.',
    officialWebsite: 'https://jeevanpramaan.gov.in/'
  },
  {
    id: 'health-card',
    title: 'Health Card',
    category: 'Healthcare',
    iconName: 'HeartPulse',
    time: 'Instant - 7 Days',
    dept: 'Ministry of Health',
    color: 'bg-red-50 text-red-600',
    description: 'ABHA (Ayushman Bharat Health Account) or PM-JAY card for health records and insurance coverage.',
    purpose: 'Digital health records and access to free medical treatment up to 5 Lakhs (if eligible).',
    eligibility: 'ABHA is for everyone; PM-JAY has specific income/demographic criteria.',
    approxFees: 'Free',
    documents: [
      { id: 'health-doc-1', name: 'Aadhaar Card' },
      { id: 'health-doc-2', name: 'Mobile Number linked to Aadhaar' },
      { id: 'health-doc-3', name: 'Ration Card (for PM-JAY)' }
    ],
    faqs: [
      { q: 'Can I generate ABHA online?', a: 'Yes, instantly using your Aadhaar number.' }
    ],
    importantNotes: 'Keep your ABHA number handy during hospital visits to digitize your prescriptions.',
    recentUpdates: 'ABHA is now integrated with the CoWIN and Aarogya Setu apps.',
    commonMistakes: 'Creating multiple ABHA accounts instead of linking previous records.',
    officialWebsite: 'https://abha.abdm.gov.in/'
  }
];
