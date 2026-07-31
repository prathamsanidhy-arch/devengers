import fs from 'fs';
import path from 'path';

const extracted = JSON.parse(fs.readFileSync('extracted_strings.json', 'utf8'));
const translated = JSON.parse(fs.readFileSync('translated_strings.json', 'utf8'));

const enPath = path.join(process.cwd(), 'src/locales/en/common.json');
const hiPath = path.join(process.cwd(), 'src/locales/hi/common.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

for (const comp in extracted) {
  if (!enJson[comp]) enJson[comp] = {};
  for (const key in extracted[comp]) {
    enJson[comp][key] = extracted[comp][key];
  }
}

for (const comp in translated) {
  if (!hiJson[comp]) hiJson[comp] = {};
  for (const key in translated[comp]) {
    hiJson[comp][key] = translated[comp][key];
  }
}

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
console.log('Merged translation files');
