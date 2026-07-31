import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const traverse = require('@babel/traverse').default;

const directories = ['src/pages', 'src/components'];
const ignoredFiles = ['Login.jsx', 'Register.jsx', 'Landing.jsx'];
const ignoredStrings = ['Smart Bharat', 'UIDAI', 'DigiLocker', 'SmartBharat'];

const extracted = {};

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx') && !ignoredFiles.includes(f));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const code = fs.readFileSync(filePath, 'utf-8');
    
    // Ignore already translated files if we want, but let's just parse all
    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx']
      });
      
      const componentName = file.replace('.jsx', '');
      if (!extracted[componentName]) extracted[componentName] = {};
      
      let counter = 1;
      
      const addString = (str) => {
        str = str.trim().replace(/\s+/g, ' ');
        if (!str || str.length < 2) return;
        if (/^[0-9\W_]+$/.test(str)) return; // Ignore symbols/numbers
        if (ignoredStrings.some(i => str.includes(i))) return;
        
        // Generate key
        const key = str.split(' ').slice(0, 4).map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).filter(Boolean).join('_') || `str_${counter++}`;
        
        // Don't overwrite if already exists, unless we want to map unique strings
        if (!Object.values(extracted[componentName]).includes(str)) {
           // Find unique key
           let finalKey = key;
           let k = 1;
           while(extracted[componentName][finalKey]) {
             finalKey = `${key}_${k++}`;
           }
           extracted[componentName][finalKey] = str;
        }
      };
      
      traverse(ast, {
        JSXText(path) {
          addString(path.node.value);
        },
        JSXAttribute(path) {
          if (['placeholder', 'title', 'label', 'alt'].includes(path.node.name.name)) {
            if (path.node.value && path.node.value.type === 'StringLiteral') {
              addString(path.node.value.value);
            }
          }
        }
      });
    } catch (e) {
      console.error(`Error parsing ${file}:`, e.message);
    }
  });
});

fs.writeFileSync('extracted_strings.json', JSON.stringify(extracted, null, 2));
console.log('Extracted strings to extracted_strings.json');
