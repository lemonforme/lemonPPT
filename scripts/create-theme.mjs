#!/usr/bin/env node
/**
 * 主题脚手架：生成新主题目录、token、样式文件，并提示需要手动注册的位置。
 *
 * 用法：
 *   node scripts/create-theme.mjs <theme-id> "<display-name>"
 * 示例：
 *   node scripts/create-theme.mjs neon "霓虹科技"
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const themesDir = path.join(rootDir, 'packages', 'themes', 'src');

function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function camelCase(str) {
  return str
    .split(/[-_]/)
    .map((s, i) => (i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()))
    .join('');
}

function main() {
  const [themeId, displayName] = process.argv.slice(2);

  if (!themeId || !displayName) {
    console.error('用法：node scripts/create-theme.mjs <theme-id> "<display-name>"');
    console.error('示例：node scripts/create-theme.mjs neon "霓虹科技"');
    process.exit(1);
  }

  const themeDir = path.join(themesDir, themeId);

  if (existsSync(themeDir)) {
    console.error(`错误：主题目录已存在 ${themeDir}`);
    process.exit(1);
  }

  const tokenVarName = `${camelCase(themeId)}Tokens`;
  const baseStyles = path.join(themesDir, 'base', 'styles.css');
  const newStyles = path.join(themeDir, 'styles.css');

  const tokenTemplate = `/**
 * ${displayName} 主题设计 token
 */
export const ${tokenVarName} = {
  id: '${themeId}',
  displayName: '${displayName}',
  description: 'TODO: 补充主题描述',
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#3b82f6',
    muted: '#e2e8f0',
    text: '#0f172a',
    textInverse: '#ffffff',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    pagePadding: '48px',
    sectionGap: '32px',
    elementGap: '16px',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '20px',
  },
} as const;
`;

  mkdir(themeDir, { recursive: true }).then(() =>
    Promise.all([
      writeFile(path.join(themeDir, 'tokens.ts'), tokenTemplate, 'utf-8'),
      copyFile(baseStyles, newStyles),
    ])
  ).then(() => {
    console.log(`已生成主题目录：${themeDir}`);
    console.log(`已生成 token：${path.join(themeDir, 'tokens.ts')}`);
    console.log(`已复制基础样式：${newStyles}`);
    console.log('');
    console.log('接下来请手动完成以下注册：');
    console.log('');
    console.log(`1) packages/themes/src/index.ts`);
    console.log(`   添加 import：`);
    console.log(`   import { ${tokenVarName} } from './${themeId}/tokens.js';`);
    console.log(`   更新 themes 数组：`);
    console.log(`   export const themes = [baseTokens, darkTechTokens, warmBusinessTokens, ${tokenVarName}] as const;`);
    console.log(`   添加 export * from './${themeId}/tokens.js';`);
    console.log('');
    console.log(`2) 编辑 ${newStyles}`);
    console.log(`   将 base 主题样式改为 ${displayName} 的配色、字体和氛围。`);
    console.log('');
    console.log(`3) 更新 README.md / SKILL.md 中的可用主题列表`);
    console.log(`   添加：| ${themeId} | ${displayName} |`);
    console.log('');
    console.log('注意：新主题无需修改 CLI，getTheme(themeId) 会自动识别。');
  });
}

main();
