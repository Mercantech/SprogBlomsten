const fs = require('fs');
const path = require('path');
const svgPath = path.join(__dirname, 'Assets', 'Venn.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

const tags = {};
const tagMatches = svg.match(/<(\w+)(\s|>)/g) || [];
tagMatches.forEach(m => {
  const tag = m.replace(/[<\s>]/g, '');
  tags[tag] = (tags[tag] || 0) + 1;
});
console.log('Element counts:', tags);

const ids = svg.match(/id="([^"]+)"/g) || [];
const uniqueIds = [...new Set(ids)].slice(0, 80);
console.log('\nIDs (sample):', uniqueIds.join('\n'));

const pathCount = (svg.match(/<path\s/g) || []).length;
const gCount = (svg.match(/<g\s/g) || []).length;
console.log('\nTotal path elements:', pathCount);
console.log('Total g elements:', gCount);

// Structure - find g and path with id
const gWithId = svg.match(/<g[^>]*id="[^"]*"[^>]*>/g) || [];
console.log('\nG with id (first 20):', gWithId.slice(0, 20));

const pathWithId = svg.match(/<path[^>]*id="[^"]*"[^>]*>/g) || [];
console.log('\nPath with id (first 20):', pathWithId.slice(0, 20));

// Main content structure - first 2000 chars after defs
const afterDefs = svg.split('</defs>')[1];
if (afterDefs) {
  const start = afterDefs.substring(0, 2500);
  console.log('\nStart of content:', start);
}
