// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 构建浏览器端导出所需的 vendor bundle。
 *
 * 将 html-to-image、pdf-lib、pptxgenjs 打包为 IIFE，并暴露到全局变量：
 *   - htmlToImage
 *   - PDFLib
 *   - PptxGenJS
 */

import esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outdir = path.resolve(__dirname, '../assets/vendor');
fs.mkdirSync(outdir, { recursive: true });

/**
 * 直接复制 dom-to-pptx 预构建 UMD bundle，避免与其内部 pptxgenjs 4.x 产生版本冲突。
 * MIT 许可证，保留原版权声明。详见 packages/dom-to-pptx/NOTICE。
 */
function copyDomToPptxBundle() {
  const mainPath = fileURLToPath(import.meta.resolve('dom-to-pptx'));
  const source = path.join(path.dirname(mainPath), 'dom-to-pptx.bundle.js');
  const dest = path.join(outdir, 'dom-to-pptx.bundle.js');
  if (!fs.existsSync(source)) {
    throw new Error('未找到 dom-to-pptx bundle，请先安装 dom-to-pptx@2.1.1');
  }
  fs.copyFileSync(source, dest);
  const stats = fs.statSync(dest);
  console.log(
    `Copied dom-to-pptx bundle: ${(stats.size / 1024 / 1024).toFixed(2)} MB -> assets/vendor/dom-to-pptx.bundle.js`,
  );
}

const vendorEntries = [
  {
    name: 'html-to-image',
    entry: 'html-to-image',
    globalName: 'htmlToImage',
  },
  {
    name: 'pdf-lib',
    entry: 'pdf-lib',
    globalName: 'PDFLib',
  },
  {
    name: 'pptxgenjs',
    entry: 'pptxgenjs',
    globalName: 'PptxGenJS',
  },
];

async function build() {
  copyDomToPptxBundle();

  for (const vendor of vendorEntries) {
    await esbuild.build({
      entryPoints: [vendor.entry],
      bundle: true,
      platform: 'browser',
      format: 'iife',
      globalName: vendor.globalName,
      outfile: path.join(outdir, `${vendor.name}.js`),
      target: 'es2019',
      minify: true,
      footer: {
        js: `var ${vendor.globalName} = ${vendor.globalName}.${vendor.globalName} || ${vendor.globalName};`,
      },
    });
    console.log(`Built vendor bundle: ${vendor.name} -> assets/vendor/${vendor.name}.js`);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
