#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式脚手架：生成新 layout 组件并提示需要手动注册的位置。
 *
 * 用法：
 *   node scripts/create-layout.mjs <role> <name>
 * 示例：
 *   node scripts/create-layout.mjs timeline v2
 *   -> 生成 packages/templates/src/base/timeline-v2.tsx
 */

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function pascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

function camelCase(str) {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function main() {
  const [role, name] = process.argv.slice(2);

  if (!role || !name) {
    console.error('用法：node scripts/create-layout.mjs <role> <name>');
    console.error('示例：node scripts/create-layout.mjs timeline v2');
    process.exit(1);
  }

  const layoutId = `${role}_${name}`;
  const fileName = `${role}-${name}.tsx`;
  const componentName = `${pascalCase(role)}${pascalCase(name)}`;
  const metaName = `${camelCase(role)}${pascalCase(name)}Meta`;
  const propsName = `${componentName}Props`;
  const destDir = path.join(rootDir, 'packages', 'templates', 'src', 'base');
  const destFile = path.join(destDir, fileName);

  if (existsSync(destFile)) {
    console.error(`错误：文件已存在 ${destFile}`);
    process.exit(1);
  }

  const template = `import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ${propsName} {
  title?: string;
  kicker?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const ${metaName}: LayoutMeta = {
  id: '${layoutId}',
  theme: 'base',
  role: '${role}',
  displayName: '${componentName}',
  description: 'TODO: 补充版式描述',
  needsMedia: false,
};

export function ${componentName}(props: ${propsName}): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-${role}-${name}">
      <div className="lp-${role}-${name}-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
            {title}
          </EditableField>
        )}
        <p className="lp-body">TODO: 在这里实现 ${componentName} 的版式结构</p>
      </div>
    </div>
  );
}
`;

  const testTemplate = `import { describe, expect, it } from 'vitest';
import { ${componentName}, ${metaName} } from './${role}-${name}.js';

describe('${layoutId}', () => {
  it('should have correct meta', () => {
    expect(${metaName}.id).toBe('${layoutId}');
    expect(${metaName}.role).toBe('${role}');
  });

  it('should render with title', () => {
    const result = ${componentName}({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
`;

  mkdir(destDir, { recursive: true }).then(() =>
    Promise.all([
      writeFile(destFile, template, 'utf-8'),
      writeFile(path.join(destDir, `${role}-${name}.test.tsx`), testTemplate, 'utf-8'),
    ])
  ).then(() => {
    console.log(`已生成版式组件：${destFile}`);
    console.log(`已生成测试文件：${path.join(destDir, `${role}-${name}.test.tsx`)}`);
    console.log('');
    console.log('接下来请手动完成以下注册：');
    console.log('');
    console.log(`1) packages/templates/src/index.ts`);
    console.log(`   添加：export * from './base/${role}-${name}.js';`);
    console.log('');
    console.log(`2) packages/templates/src/registry.tsx`);
    console.log(`   添加 import：`);
    console.log(`   import { ${componentName}, ${metaName}, type ${propsName} } from './base/${role}-${name}.js';`);
    console.log(`   添加 registerLayout：`);
    console.log(`   registerLayout<${propsName}>({ meta: ${metaName}, component: ${componentName} });`);
    console.log('');
    console.log(`3) packages/renderer/src/export-pptx.ts`);
    console.log(`   在 switch 中添加 case '${layoutId}':`);
    console.log(`   render${componentName}(pptxSlide, slide.props as unknown as ${propsName});`);
    console.log(`   并添加对应的 render${componentName} 函数。`);
    console.log('');
    console.log(`4) 为三个主题补充 CSS：`);
    console.log(`   - packages/themes/src/base/styles.css`);
    console.log(`   - packages/themes/src/dark-tech/styles.css`);
    console.log(`   - packages/themes/src/warm-business/styles.css`);
    console.log(`   建议类名：.lp-${role}-${name} { ... }`);
    console.log('');
    console.log('5) 如果该 role 需要加入 composer 候选列表，更新 packages/composer/src/index.ts');
  });
}

main();
