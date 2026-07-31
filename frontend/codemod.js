import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const directories = ['src/pages', 'src/components'];
const ignoredFiles = ['Login.jsx', 'Register.jsx', 'Landing.jsx', 'Dashboard.jsx', 'Layout.jsx', 'Chatbot.jsx', 'Services.jsx'];
const ignoredStrings = ['Smart Bharat', 'UIDAI', 'DigiLocker', 'SmartBharat'];

const extracted = JSON.parse(fs.readFileSync('extracted_strings.json', 'utf-8'));

let filesModified = 0;
let keysAdded = 0;

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx') && !ignoredFiles.includes(f));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const code = fs.readFileSync(filePath, 'utf-8');
    
    if (code.includes('useTranslation')) return; // Already processed
    
    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx']
      });
      
      const componentName = file.replace('.jsx', '');
      const strMap = extracted[componentName] || {};
      
      // Reverse map
      const valToKey = {};
      for (const [k, v] of Object.entries(strMap)) {
        valToKey[v] = `${componentName}.${k}`;
      }
      
      let modified = false;
      let hasUseTranslationImport = false;
      
      traverse(ast, {
        ImportDeclaration(path) {
          if (path.node.source.value === 'react-i18next') {
            hasUseTranslationImport = true;
          }
        },
        JSXText(path) {
          const str = path.node.value.trim().replace(/\s+/g, ' ');
          if (valToKey[str]) {
            path.replaceWith(
              t.jsxExpressionContainer(
                t.callExpression(t.identifier('t'), [t.stringLiteral(valToKey[str])])
              )
            );
            modified = true;
            keysAdded++;
          }
        },
        JSXAttribute(path) {
          if (['placeholder', 'title', 'label', 'alt'].includes(path.node.name.name)) {
            if (path.node.value && path.node.value.type === 'StringLiteral') {
              const str = path.node.value.value.trim().replace(/\s+/g, ' ');
              if (valToKey[str]) {
                path.node.value = t.jsxExpressionContainer(
                  t.callExpression(t.identifier('t'), [t.stringLiteral(valToKey[str])])
                );
                modified = true;
                keysAdded++;
              }
            }
          }
        }
      });
      
      if (modified) {
        // Add import { useTranslation } from 'react-i18next';
        if (!hasUseTranslationImport) {
          const importDecl = t.importDeclaration(
            [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
            t.stringLiteral('react-i18next')
          );
          ast.program.body.unshift(importDecl);
        }
        
        // Find component function to insert const { t } = useTranslation();
        traverse(ast, {
          FunctionDeclaration(path) {
            if (path.node.id && path.node.id.name === componentName) {
              const hookCall = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.objectPattern([
                    t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)
                  ]),
                  t.callExpression(t.identifier('useTranslation'), [])
                )
              ]);
              path.node.body.body.unshift(hookCall);
            }
          },
          VariableDeclarator(path) {
            if (path.node.id.name === componentName && (path.node.init.type === 'ArrowFunctionExpression' || path.node.init.type === 'FunctionExpression')) {
              if (path.node.init.body.type === 'BlockStatement') {
                const hookCall = t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.objectPattern([
                      t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)
                    ]),
                    t.callExpression(t.identifier('useTranslation'), [])
                  )
                ]);
                path.node.init.body.body.unshift(hookCall);
              }
            }
          }
        });
        
        const output = generator(ast, {}, code);
        fs.writeFileSync(filePath, output.code);
        filesModified++;
      }
      
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
    }
  });
});

console.log(`Modified ${filesModified} files. Added ${keysAdded} translation usages.`);
