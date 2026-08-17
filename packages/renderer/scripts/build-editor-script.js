import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..', 'dist', 'editor-script.js');
const outDir = path.join(__dirname, '..', 'dist', 'client');
const out = path.join(outDir, 'editor-script.js');

const content = fs.readFileSync(src, 'utf-8');
const match = content.match(/export const editorScript = `([\s\S]*)`;[\s\S]*$/);
if (!match) {
  throw new Error('export const editorScript = `...`; not found in ' + src);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, match[1].trimStart() + '\n');
console.log('Built', out);
