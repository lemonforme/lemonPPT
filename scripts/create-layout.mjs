#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式脚手架：生成新 layout 组件，并自动完成注册、导出占位和主题提示。
 *
 * 用法：
 *   node scripts/create-layout.mjs <role> <name>
 * 示例：
 *   node scripts/create-layout.mjs timeline v2
 *   -> 生成 packages/templates/src/base/timeline-v2.tsx
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SPDX_HEADER = `// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
`;

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

function kebabCase(str) {
  return str.replace(/_/g, '-');
}

async function patchFile(filePath, patchFn) {
  const content = await readFile(filePath, 'utf-8');
  const newContent = patchFn(content);
  if (newContent === content) {
    console.warn(`⚠️ 未修改 ${filePath}`);
    return;
  }
  await writeFile(filePath, newContent, 'utf-8');
  console.log(`✅ 已更新 ${path.relative(rootDir, filePath)}`);
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

  const template = `${SPDX_HEADER}import type { LayoutMeta } from '@lemonppt/core';
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

  const testTemplate = `${SPDX_HEADER}import { describe, expect, it } from 'vitest';
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

  const baseExportLine = `export * from './base/${role}-${name}.js';\n`;
  const registryImportLine = `import { ${componentName}, ${metaName}, type ${propsName} } from './base/${role}-${name}.js';\n`;
  const registryRegisterLine = `registerLayout<${propsName}>({ meta: ${metaName}, component: ${componentName} });\n`;
  const composerCandidateLine = `  ${role}: ['${role}_v1'],\n`;
  const exportPptxCase = `    case '${layoutId}':\n      render${componentName}(pptxSlide, slide.props as unknown as ${propsName});\n      break;\n`;
  const exportPptxFunction = `\ninterface ${propsName} {\n  title?: string;\n  kicker?: string;\n  [key: string]: unknown;\n}\n\nfunction render${componentName}(slide: PptxSlide, props: ${propsName}): void {\n  addKicker(slide, props.kicker);\n  addTitle(slide, props.title ?? '${componentName}');\n  slide.addText('TODO: 在 export-pptx.ts 中实现 ${componentName} 的 PPTX 导出', {\n    x: 0.8, y: 2.6, w: 8.4, h: 2,\n    fontSize: 18, color: COLORS.secondary, align: 'left', valign: 'top',\n  });\n}\n`;

  const tasks = [];

  tasks.push(
    mkdir(destDir, { recursive: true }).then(() =>
      Promise.all([
        writeFile(destFile, template, 'utf-8'),
        writeFile(path.join(destDir, `${role}-${name}.test.tsx`), testTemplate, 'utf-8'),
      ])
    )
  );

  tasks.push(
    patchFile(path.join(rootDir, 'packages', 'templates', 'src', 'index.ts'), (content) => {
      if (content.includes(baseExportLine.trim())) return content;
      // Insert before the last base export to keep grouping
      const marker = "export * from './base/";
      const lastIdx = content.lastIndexOf(marker);
      if (lastIdx === -1) return content;
      const lineEnd = content.indexOf('\n', lastIdx) + 1;
      return content.slice(0, lineEnd) + baseExportLine + content.slice(lineEnd);
    })
  );

  tasks.push(
    patchFile(path.join(rootDir, 'packages', 'templates', 'src', 'registry.tsx'), (content) => {
      if (content.includes(registryImportLine.trim())) return content;
      const importMarker = "import type { LayoutMeta, Slide } from '@lemonppt/core';\n";
      const withImport = content.replace(importMarker, importMarker + registryImportLine);
      const registerMarker = '// 注册内置版式\n';
      return withImport.replace(registerMarker, registerMarker + registryRegisterLine);
    })
  );

  tasks.push(
    patchFile(path.join(rootDir, 'packages', 'composer', 'src', 'index.ts'), (content) => {
      if (content.includes(`'${layoutId}'`)) return content;
      // Append to existing role entry if present
      const existingRolePattern = new RegExp(`  ${role}: \\[(.*?)\\],\\n`);
      const match = content.match(existingRolePattern);
      if (match) {
        const items = match[1];
        const replacement = `  ${role}: [${items}, '${layoutId}'],\n`;
        return content.replace(existingRolePattern, replacement);
      }
      // Otherwise insert a new role entry at the top of the mapping
      const marker = `const ROLE_LAYOUT_CANDIDATES: Record<SlideRole, string[]> = {\n`;
      const insertIdx = content.indexOf(marker);
      if (insertIdx === -1) return content;
      const lineStart = insertIdx + marker.length;
      return content.slice(0, lineStart) + `  ${role}: ['${layoutId}'],\n` + content.slice(lineStart);
    })
  );

  tasks.push(
    patchFile(path.join(rootDir, 'packages', 'renderer', 'src', 'export-pptx.ts'), (content) => {
      if (content.includes(`case '${layoutId}'`)) return content;
      const switchMarker = '  switch (slide.layout) {\n';
      const switchIdx = content.indexOf(switchMarker);
      if (switchIdx !== -1) {
        content = content.slice(0, switchIdx + switchMarker.length) + exportPptxCase + content.slice(switchIdx + switchMarker.length);
      }
      return content + exportPptxFunction;
    })
  );

  Promise.all(tasks).then(() => {
    console.log('');
    console.log(`已生成版式组件：${destFile}`);
    console.log(`已生成测试文件：${path.join(destDir, `${role}-${name}.test.tsx`)}`);
    console.log('');
    console.log('下一步请手动完成：');
    console.log('');
    console.log('1) 完善组件实现');
    console.log(`   ${path.join('packages/templates/src/base', fileName)}`);
    console.log('');
    console.log('2) 完善 PPTX 导出实现');
    console.log(`   ${path.join('packages/renderer/src/export-pptx.ts')} 中的 render${componentName}`);
    console.log('');
    console.log('3) 为三个主题补充 CSS（建议类名 .lp-' + role + '-' + name + '）：');
    console.log('   - packages/themes/src/base/styles.css');
    console.log('   - packages/themes/src/dark-tech/styles.css');
    console.log('   - packages/themes/src/warm-business/styles.css');
    console.log('');
    console.log('4) composer 候选列表已自动新增一条单候选映射，如需多版式随机请调整');
    console.log(`   packages/composer/src/index.ts 中 ${role}: ['${layoutId}']`);
  }).catch((err) => {
    console.error('脚手架出错：', err);
    process.exit(1);
  });
}

main();
