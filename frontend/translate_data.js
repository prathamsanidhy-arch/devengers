import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const dataDir = path.join(process.cwd(), 'src/data');
const enPath = path.join(process.cwd(), 'src/locales/en/common.json');
const hiPath = path.join(process.cwd(), 'src/locales/hi/common.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

async function processData() {
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const moduleName = file.replace('.js', '');
      const filePath = path.join(dataDir, file);
      // Read the file as text and use regex to extract string values or use import
      const code = fs.readFileSync(filePath, 'utf8');
      
      // Simple regex approach to extract "title": "..."
      const keysToExtract = ['title', 'category', 'dept', 'description', 'time', 'purpose', 'eligibility', 'approxFees', 'importantNotes', 'recentUpdates', 'commonMistakes'];
      
      if (!enJson[moduleName]) enJson[moduleName] = {};
      if (!hiJson[moduleName]) hiJson[moduleName] = {};
      
      // Find all objects with an 'id'
      const idMatches = [...code.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
      for (const match of idMatches) {
        const id = match[1];
        if (!enJson[moduleName][id]) enJson[moduleName][id] = {};
        if (!hiJson[moduleName][id]) hiJson[moduleName][id] = {};
      }
      
      // Let's do a dynamic import
      // We have to compile it or just parse it.
      // Since it's ES module, we can import it.
      const fileUrl = pathToFileURL(filePath).href;
      try {
        const module = await import(fileUrl);
        const dataArr = module[Object.keys(module)[0]]; // e.g. servicesData
        
        if (Array.isArray(dataArr)) {
          for (const item of dataArr) {
            if (item.id) {
              enJson[moduleName][item.id] = {};
              hiJson[moduleName][item.id] = {};
              
              for (const key of keysToExtract) {
                if (item[key] && typeof item[key] === 'string') {
                  enJson[moduleName][item.id][key] = item[key];
                  hiJson[moduleName][item.id][key] = `[HI] ${item[key]}`; // Mock Hindi translation
                }
              }
            }
          }
        }
      } catch (e) {
        console.error("Error importing", file, e);
      }
    }
    
    fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
    fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
    console.log('Data strings added to translation files.');
  }
}

processData();
