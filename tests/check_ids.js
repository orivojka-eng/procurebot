/**
 * Static DOM ID validation script for ProcureBot
 * Ensures all getElementById calls in src/app.js match real elements in index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '..', 'index.html');
const appJsPath = path.join(__dirname, '..', 'src', 'app.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Extract all getElementById calls
const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const usedIds = new Set();

while ((match = idRegex.exec(appJsContent)) !== null) {
  usedIds.add(match[1]);
}

console.log(`Checking ${usedIds.size} unique getElementById references in src/app.js...`);

let missingCount = 0;
usedIds.forEach(id => {
  const inHtml = htmlContent.includes(`id="${id}"`) || 
                 htmlContent.includes(`id='${id}'`) ||
                 id.startsWith('row-');

  if (!inHtml) {
    console.error(`❌ Missing ID in index.html: "${id}"`);
    missingCount++;
  }
});

if (missingCount === 0) {
  console.log(`✅ SUCCESS: All ${usedIds.size} element IDs verified in index.html!`);
  process.exit(0);
} else {
  console.error(`❌ FAILED: ${missingCount} element IDs missing in index.html.`);
  process.exit(1);
}
