import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const themeDir = path.join(rootDir, 'packages/templates/src/themes/theme01');

function findFieldBounds(text, typePos) {
  let start = -1;
  let depth = 0;
  for (let i = typePos; i >= 0; i--) {
    const ch = text[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) { start = i; break; }
      depth--;
    }
  }
  let end = -1;
  if (start !== -1) {
    depth = 1;
    for (let i = start + 1; i < text.length; i++) {
      const ch = text[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
  }
  return [start, end];
}

function extractKey(fieldText) {
  const m = fieldText.match(/key\s*:\s*['"](\w+)['"]/);
  return m ? m[1] : null;
}

function findSchemaArrayFields(text) {
  const fields = [];
  const typePattern = /type\s*:\s*['"]array['"]/g;
  let m;
  while ((m = typePattern.exec(text)) !== null) {
    const [start, end] = findFieldBounds(text, m.index);
    if (start === -1 || end === -1) continue;
    const fieldText = text.slice(start, end + 1);
    const key = extractKey(fieldText);
    if (!key) continue;
    const itemSchemaMatch = fieldText.match(/itemSchema\s*:\s*\[([\s\S]*)\]/);
    const subKeys = [];
    if (itemSchemaMatch) {
      const keyPattern = /key\s*:\s*['"](\w+)['"]/g;
      let km;
      while ((km = keyPattern.exec(itemSchemaMatch[1])) !== null) {
        subKeys.push(km[1]);
      }
    }
    fields.push({ key, subKeys });
  }
  return fields;
}

function extractArrayProps(text) {
  const props = new Map();
  const pattern = /prop=\{[`"']([^`"']+\.\$\{index\}\.[^`"']+)[`"']\}/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const parts = m[1].replace(/\$\{index\}/g, 'INDEX').split('.');
    if (parts.length >= 3) {
      const arrayKey = parts[0];
      const subKey = parts[2];
      if (!props.has(arrayKey)) props.set(arrayKey, new Set());
      props.get(arrayKey).add(subKey);
    }
  }
  return props;
}

function main() {
  const files = fs.readdirSync(themeDir).filter((name) => name.endsWith('.tsx'));
  for (const file of files) {
    const text = fs.readFileSync(path.join(themeDir, file), 'utf-8');
    const props = extractArrayProps(text);
    const schemaFields = findSchemaArrayFields(text);
    if (props.size === 0) continue;

    const fieldMap = new Map(schemaFields.map((f) => [f.key, f]));
    const issues = [];
    for (const [arrayKey, subKeys] of props.entries()) {
      const field = fieldMap.get(arrayKey);
      if (!field) {
        issues.push(`组件使用 ${arrayKey}.xxx 但 schema 中无 ${arrayKey} 数组字段`);
      } else {
        for (const subKey of subKeys) {
          if (!field.subKeys.includes(subKey)) {
            issues.push(`组件使用 ${arrayKey}.${subKey} 但 schema itemSchema 缺少 ${subKey}（当前: ${field.subKeys.join(',') || '无'}）`);
          }
        }
      }
    }

    if (issues.length > 0) {
      console.log('\n' + file);
      issues.forEach((issue) => console.log('  - ' + issue));
    }
  }
}

main();
