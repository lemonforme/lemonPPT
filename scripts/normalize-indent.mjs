import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = path.resolve(__dirname, '../packages/templates/src/themes/theme01');

const files = fs.readdirSync(themeDir).filter((name) => name.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(themeDir, file);
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');
  const normalized = lines.map((line) => {
    const leading = line.match(/^(\s*)/)[1];
    if (leading.length === 0) return line;
    // 将空格按4个一组转为2个一组；制表符保持原样
    const spaces = leading.replace(/\t/g, '__TAB__');
    if (spaces.length % 4 !== 0) return line;
    const newLeading = ' '.repeat(spaces.length / 2).replace(/__TAB__/g, '\t');
    return newLeading + line.slice(leading.length);
  });
  const result = normalized.join('\n');
  if (result !== text) {
    fs.writeFileSync(filePath, result, 'utf-8');
    console.log('normalized', file);
  }
}

console.log('done');
