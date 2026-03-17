const fs = require('fs');
const file = 'c:\\crypto-site\\src\\app\\dashboard\\investments\\page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/yield: '\d+%',/g, "yield: '20%',");
txt = txt.replace(/Annual Yield/g, "Monthly Return");
txt = txt.replace(/Potential Monthly ROI \(10\%\)/g, "Potential Monthly ROI (20%)");
txt = txt.replace(/\* 0\.1\)/g, "* 0.2)");

const oldMathMatch = /\(\(\(parseFloat\(investAmount\) \* \(parseFloat\(selectedProduct\.yield\) \/ 100\)\) \/ 12\)/g;
txt = txt.replace(oldMathMatch, "((parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100))");

const annualMathMatch = /\(parseFloat\(investAmount\) \* \(parseFloat\(selectedProduct\.yield\) \/ 100\)\)\.toLocaleString/g;
txt = txt.replace(annualMathMatch, "(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100) * 12).toLocaleString");

txt = txt.replace(/fixed yield/g, "fixed monthly return");

fs.writeFileSync(file, txt);
console.log('Update complete');
