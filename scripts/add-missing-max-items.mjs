import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = path.resolve(__dirname, '../packages/templates/src/themes/theme01');

const maxItemsMap = {
  sources: 10,
  labels: 12,
  data: 12,
  nodes: 20,
  links: 30,
  xAxis: 10,
  yAxis: 10,
  indicators: 10,
  value: 10,
  children: 20,
  words: 50,
  colors: 10,
  leftPoints: 6,
  rightPoints: 6,
  phases: 6,
  tiers: 4,
  features: 8,
  items: 6,
  headers: 8,
  events: 8
};

function getKeyName(prop) {
  const key = prop.name;
  if (!key) return null;
  if (ts.isIdentifier(key) || ts.isStringLiteral(key)) return key.text;
  return null;
}

function getStringValue(prop) {
  if (!ts.isPropertyAssignment(prop)) return null;
  const init = prop.initializer;
  if (ts.isStringLiteral(init)) return init.text;
  return null;
}

function hasProperty(obj, name) {
  return obj.properties.some((p) => getKeyName(p) === name);
}

function findMissingMaxItems(source) {
  const result = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const keyProp = node.properties.find((p) => getKeyName(p) === 'key');
      const typeProp = node.properties.find((p) => getKeyName(p) === 'type');
      if (keyProp && typeProp && getStringValue(typeProp) === 'array') {
        const key = getStringValue(keyProp);
        if (key && !hasProperty(node, 'maxItems') && maxItemsMap[key] !== undefined) {
          result.push({ typeProp, key, limit: maxItemsMap[key] });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return result;
}

const files = fs.readdirSync(themeDir).filter((name) => name.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(themeDir, file);
  const text = fs.readFileSync(filePath, 'utf-8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fields = findMissingMaxItems(source);
  if (fields.length === 0) continue;

  // 按 end 位置降序，避免插入点偏移
  const sorted = fields
    .map((f) => {
      const end = f.typeProp.end;
      // 检查 type 值后是否已有逗号
      const afterType = text.slice(end);
      const hasComma = /^\s*,/.test(afterType);
      const insertPos = hasComma ? end + 1 : end;
      const insertText = hasComma
        ? `\n      maxItems: ${f.limit},`
        : `,\n      maxItems: ${f.limit},`;
      return { insertPos, insertText, key: f.key, limit: f.limit };
    })
    .sort((a, b) => b.insertPos - a.insertPos);

  let result = text;
  for (const { insertPos, insertText } of sorted) {
    result = result.slice(0, insertPos) + insertText + result.slice(insertPos);
  }

  fs.writeFileSync(filePath, result, 'utf-8');
  console.log('updated', file, sorted.map((f) => `${f.key}=${f.limit}`).reverse().join(', '));
}

console.log('done');
