const fs = require('fs');
const path = require('path');
const svgPath = path.join(__dirname, 'Assets', 'SprogBlomsten.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

// Find alle unikke fill-værdier (inkl. fill-opacity som separate attribute)
const fillMatches = svg.match(/fill="([^"]+)"/g) || [];
const fills = {};
fillMatches.forEach(m => {
  const v = m.replace(/^fill="|"$/g, '');
  fills[v] = (fills[v] || 0) + 1;
});
console.log('Alle unikke fill-værdier i SprogBlomsten.svg:\n');
Object.entries(fills).sort((a,b) => b[1]-a[1]).forEach(([v,c]) => console.log(c + 'x  ' + v));

// Region-farver vi kender (ovaler)
const REGION_FILLS = ['#FEEFAE', '#B0F0F2', '#FEB5E2', '#FFC8A1', '#B0CAE3', '#B3E7CB', '#B3E8D0', '#1E1E1E', 'white', 'none'];
console.log('\n\nMørke/tekst-fills (skal blive hvide i dark mode):');
Object.entries(fills)
  .filter(([v]) => !REGION_FILLS.includes(v) && !v.startsWith('url'))
  .forEach(([v,c]) => console.log(c + 'x  ' + v));
