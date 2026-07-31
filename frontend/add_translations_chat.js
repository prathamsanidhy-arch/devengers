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
  console.log('Chatbot Translations merged successfully');
};

const enAdd = {
  "chatbot": {
    "greeting": "Namaste! I am your AI Citizen Assistant. How can I help you today?",
    "micDenied": "Microphone access denied. Please allow microphone permissions in your browser.",
    "speechUnsupported": "Speech recognition is not supported in this browser.",
    "errorMsg": "Sorry, I encountered an error. Please try again.",
    "serverErrorMsg": "Sorry, I encountered an error connecting to the server. Please try again.",
    "title": "AI Citizen Assistant",
    "online": "Online",
    "ttsOn": "Text-to-Speech ON",
    "ttsOff": "Text-to-Speech OFF",
    "qrDashboard": "Open Dashboard",
    "qrTrack": "Track Complaints",
    "qrSchemes": "Find Schemes",
    "voiceInput": "Voice Input",
    "listening": "Listening...",
    "placeholder": "Ask anything..."
  }
};

const hiAdd = {
  "chatbot": {
    "greeting": "नमस्ते! मैं आपका एआई नागरिक सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    "micDenied": "माइक्रोफ़ोन एक्सेस अस्वीकार कर दिया गया। कृपया अपने ब्राउज़र में माइक्रोफ़ोन अनुमति दें।",
    "speechUnsupported": "इस ब्राउज़र में वाक् पहचान समर्थित नहीं है।",
    "errorMsg": "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
    "serverErrorMsg": "क्षमा करें, सर्वर से जुड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    "title": "एआई नागरिक सहायक",
    "online": "ऑनलाइन",
    "ttsOn": "टेक्स्ट-टू-स्पीच चालू",
    "ttsOff": "टेक्स्ट-टू-स्पीच बंद",
    "qrDashboard": "डैशबोर्ड खोलें",
    "qrTrack": "शिकायतें ट्रैक करें",
    "qrSchemes": "योजनाएं खोजें",
    "voiceInput": "वॉयस इनपुट",
    "listening": "सुन रहा हूँ...",
    "placeholder": "कुछ भी पूछें..."
  }
};

addTranslations(enAdd, hiAdd);
