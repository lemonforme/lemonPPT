import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = path.resolve(__dirname, '../packages/templates/src/themes/theme01');

const files = fs.readdirSync(themeDir).filter((name) => name.endsWith('.tsx'));

for (const file of files) {
  const text = fs.readFileSync(path.join(themeDir, file), 'utf-8');
  const arrayPattern = /type\s*:\s*['"]array['"]/g;
  let m;
  while ((m = arrayPattern.exec(text)) !== null) {
    // 从 type: 'array' 位置向前找字段开始
    let start = -1;
    let depth = 0;
    for (let i = m.index; i >= 0; i--) {
      const ch = text[i];
      if (ch === '}') depth++;
      else if (ch === '{') {
        if (depth === 0) { start = i; break; }
        depth--;
      }
    }
    if (start === -1) continue;
    // 找字段结束
    let end = -1;
    depth = 1;
    for (let i = start + 1; i < text.length; i++) {
      const ch = text[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end === -1) continue;
    const fieldText = text.slice(start, end + 1);
    const hasMax = /maxItems\s*:/.test(fieldText);
    const hasMin = /minItems\s*:/.test(fieldText);
    if (!hasMax || !hasMin) {
      const keyMatch = fieldText.match(/key\s*:\s*['"](\w+)['"]/);
      console.log(file, keyMatch ? keyMatch[1] : '?', { maxItems: hasMax, minItems: hasMin });
    }
  }
}
