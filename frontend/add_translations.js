import fs from 'fs';
import path from 'path';

const addTranslations = (enNew, hiNew) => {
  const enPath = path.join(process.cwd(), 'src/locales/en/common.json');
  const hiPath = path.join(process.cwd(), 'src/locales/hi/common.json');
  
  const enCurrent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const hiCurrent = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
  
  const enMerged = { ...enCurrent, ...enNew };
  const hiMerged = { ...hiCurrent, ...hiNew };
  
  fs.writeFileSync(enPath, JSON.stringify(enMerged, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiMerged, null, 2));
  console.log('Translations merged successfully');
};

const enAdd = {
  "services": {
    "title": "Citizen Service Hub",
    "subtitle": "Apply for certificates, pay bills, and manage civic documents.",
    "searchPlaceholder": "Search services...",
    "savedServices": "Saved Services",
    "recentlyViewed": "Recently Viewed",
    "recommendedForYou": "Recommended for You",
    "recommended": "Recommended",
    "yourSavedServices": "Your Saved Services",
    "allServices": "All Services",
    "categoryServices": "{{category}} Services",
    "noServicesFound": "No services found matching your criteria.",
    "noSavedServices": "You haven't saved any services yet.",
    "processingTime": "Processing Time",
    "department": "Department",
    "applyNow": "Apply Now",
    "all": "All",
    "identity": "Identity",
    "finance": "Finance",
    "transport": "Transport",
    "utilities": "Utilities",
    "revenue": "Revenue",
    "certificates": "Certificates",
    "taxation": "Taxation",
    "healthcare": "Healthcare",
    "saved": "Saved"
  }
};

const hiAdd = {
  "services": {
    "title": "नागरिक सेवा केंद्र",
    "subtitle": "प्रमाणपत्रों के लिए आवेदन करें, बिलों का भुगतान करें और नागरिक दस्तावेजों का प्रबंधन करें।",
    "searchPlaceholder": "सेवाएं खोजें...",
    "savedServices": "सहेजी गई सेवाएं",
    "recentlyViewed": "हाल ही में देखी गई",
    "recommendedForYou": "आपके लिए अनुशंसित",
    "recommended": "अनुशंसित",
    "yourSavedServices": "आपकी सहेजी गई सेवाएं",
    "allServices": "सभी सेवाएं",
    "categoryServices": "{{category}} सेवाएं",
    "noServicesFound": "आपके मानदंड से मेल खाने वाली कोई सेवा नहीं मिली।",
    "noSavedServices": "आपने अभी तक कोई सेवा नहीं सहेजी है।",
    "processingTime": "प्रसंस्करण समय",
    "department": "विभाग",
    "applyNow": "अभी आवेदन करें",
    "all": "सभी",
    "identity": "पहचान",
    "finance": "वित्त",
    "transport": "परिवहन",
    "utilities": "उपयोगिताएं",
    "revenue": "राजस्व",
    "certificates": "प्रमाणपत्र",
    "taxation": "कराधान",
    "healthcare": "स्वास्थ्य सेवा",
    "saved": "सहेजा गया"
  }
};

addTranslations(enAdd, hiAdd);
