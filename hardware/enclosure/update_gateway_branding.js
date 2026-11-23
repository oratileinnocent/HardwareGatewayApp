const fs = require('fs');
const filePath = 'generate_stl.js';

let code = fs.readFileSync(filePath, 'utf8');

// 1. Add G, E, Y cases to addText
const caseGEY = `        case 'G':
          this.addStroke(curX + charW, startY + charH, curX, startY + charH, strokeT, z0, z1);
          this.addStroke(curX, startY + charH, curX, startY, strokeT, z0, z1);
          this.addStroke(curX, startY, curX + charW, startY, strokeT, z0, z1);
          this.addStroke(curX + charW, startY, curX + charW, startY + charH * 0.5, strokeT, z0, z1);
          this.addStroke(curX + charW * 0.5, startY + charH * 0.5, curX + charW, startY + charH * 0.5, strokeT, z0, z1);
          break;
        case 'E':
          this.addStroke(curX, startY, curX, startY + charH, strokeT, z0, z1);
          this.addStroke(curX, startY + charH, curX + charW, startY + charH, strokeT, z0, z1);
          this.addStroke(curX, startY + charH * 0.5, curX + charW * 0.75, startY + charH * 0.5, strokeT, z0, z1);
          this.addStroke(curX, startY, curX + charW, startY, strokeT, z0, z1);
          break;
        case 'Y':
          this.addStroke(curX, startY + charH, curX + charW * 0.5, startY + charH * 0.5, strokeT, z0, z1);
          this.addStroke(curX + charW, startY + charH, curX + charW * 0.5, startY + charH * 0.5, strokeT, z0, z1);
          this.addStroke(curX + charW * 0.5, startY + charH * 0.5, curX + charW * 0.5, startY, strokeT, z0, z1);
          break;
        case 'A':`;

code = code.replace("        case 'A':", caseGEY);

// 2. Replace ESP32-S3 text call with Gateway
const targetOld = "stl.addText('ESP32-S3', OUTER_W / 2 - 11.0, OUTER_L - 9.5, 1.8, 2.8, 0.55, lidCeilingT - 0.1, lidCeilingT + 0.35, 0.7);";
const targetNew = `const brandText = 'GATEWAY';
  const bCharW = 1.9, bCharH = 2.8, bStrokeT = 0.55, bSpacing = 0.7;
  const bTotalW = brandText.length * bCharW + (brandText.length - 1) * bSpacing;
  const bStartX = OUTER_W / 2 - bTotalW / 2;
  stl.addText(brandText, bStartX, OUTER_L - 9.5, bCharW, bCharH, bStrokeT, lidCeilingT - 0.1, lidCeilingT + 0.35, bSpacing);`;

if (!code.includes(targetOld)) {
  console.error('Target text not found!');
  process.exit(1);
}

code = code.replace(targetOld, targetNew);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated generate_stl.js with Gateway branding!');
