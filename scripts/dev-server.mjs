#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 本地开发服务器，支持 editor 的重新渲染、导出与播放。
 * 用法: node scripts/dev-server.mjs [goalPath] [port]
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, copyFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDeck, renderEditorData, exportDeckToPptxScreenshot, exportDeckToPdf } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output');

const inputFile = process.argv[2] || path.join(rootDir, 'examples', 'sample-goal.json');
const port = Number(process.argv[3]) || 8766;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function loadGoal() {
  return JSON.parse(await readFile(inputFile, 'utf-8'));
}

async function copyThemeAssets(theme, destAssetsDir) {
  await mkdir(destAssetsDir, { recursive: true });
  const cssSource = path.join(rootDir, 'packages/themes/src', theme, 'styles.css');
  const cssDest = path.join(destAssetsDir, `${theme}.css`);
  await copyFile(cssSource, cssDest);

  const fontsSource = path.join(rootDir, 'packages/renderer/assets/fonts');
  const fontsDest = path.join(destAssetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });
}

async function copyAllThemeAssets(destAssetsDir) {
  await mkdir(destAssetsDir, { recursive: true });
  for (const theme of ['theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06', 'theme07', 'theme08', 'theme09', 'theme10']) {
    const cssSource = path.join(rootDir, 'packages/themes/src', theme, 'styles.css');
    const cssDest = path.join(destAssetsDir, `${theme}.css`);
    await copyFile(cssSource, cssDest);
  }
  const fontsSource = path.join(rootDir, 'packages/renderer/assets/fonts');
  const fontsDest = path.join(destAssetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  // 同步 client-render.js，避免构建后浏览器仍使用旧 bundle
  const clientRenderSource = path.join(rootDir, 'packages/renderer/dist/client/client-render.js');
  const clientRenderDest = path.join(destAssetsDir, 'client-render.js');
  await copyFile(clientRenderSource, clientRenderDest);

  // 同步 theme-echarts.js，使编辑器中的图表能按需初始化
  const themeEchartsSource = path.join(rootDir, 'packages/renderer/dist/client/theme-echarts.js');
  const themeEchartsDest = path.join(destAssetsDir, 'theme-echarts.js');
  await copyFile(themeEchartsSource, themeEchartsDest);

  // 同步编辑器交互脚本
  const editorScriptSource = path.join(rootDir, 'packages/renderer/dist/client/editor-script.js');
  const editorScriptDest = path.join(destAssetsDir, 'editor-script.js');
  await copyFile(editorScriptSource, editorScriptDest);

  // 同步 jQuery
  const jquerySource = path.join(rootDir, 'node_modules/jquery/dist/jquery.min.js');
  const jqueryDest = path.join(destAssetsDir, 'jquery.min.js');
  await copyFile(jquerySource, jqueryDest);
}

async function writeEditorHtml(goal) {
  const data = renderEditorData(goal, { width: 1280, height: 720 });
  const assetsDir = path.join(outputDir, 'assets');
  await copyAllThemeAssets(assetsDir);

  const templatesDir = path.join(rootDir, 'packages/renderer/templates');
  let editorHtml = await readFile(path.join(templatesDir, 'editor.html'), 'utf-8');
  let editorJs = await readFile(path.join(templatesDir, 'editor.js'), 'utf-8');

  // 静态文件模式下使用相对资源路径
  editorHtml = editorHtml.replace(/\/deck\/assets\//g, './assets/');
  editorHtml = editorHtml.replace(/src="\/editor\.js"/g, 'src="./editor.js"');

  const embeddedData = `<script>
window.__lemonPPT_assetsBase = './assets/';
window.__lemonPPT_editorData = ${JSON.stringify(data)};
</script>`;
  editorHtml = editorHtml.replace('</head>', `${embeddedData}\n</head>`);

  await writeFile(path.join(outputDir, 'editor.html'), editorHtml, 'utf-8');
  await writeFile(path.join(outputDir, 'editor.js'), editorJs, 'utf-8');
}

async function writeDeckHtml(goal) {
  const result = renderDeck(goal, { editable: false });
  const deckDir = path.join(outputDir, 'deck');
  const assetsDir = path.join(deckDir, 'assets');
  await mkdir(deckDir, { recursive: true });
  await copyThemeAssets(goal.theme || 'theme01', assetsDir);
  await writeFile(path.join(deckDir, 'index.html'), result.html, 'utf-8');
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf-8');
  return JSON.parse(text);
}

function send(res, status, data, contentType) {
  const headers = contentType ? { 'Content-Type': contentType } : {};
  res.writeHead(status, headers);
  res.end(data);
}

async function serveStatic(reqPath, res) {
  // 安全：限制在 outputDir 内
  const safePath = path.normalize(reqPath).replace(/^\.\./, '');
  let filePath = path.join(outputDir, safePath);
  if (safePath === '/' || safePath === '/editor') {
    filePath = path.join(outputDir, 'editor.html');
  } else if (safePath === '/deck' || safePath === '/deck/') {
    filePath = path.join(outputDir, 'deck', 'index.html');
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME_TYPES[ext] || 'application/octet-stream');
  } catch (err) {
    if (err.code === 'ENOENT') {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    } else {
      send(res, 500, String(err), 'text/plain; charset=utf-8');
    }
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);

    if (req.method === 'POST' && url.pathname === '/api/render-editor') {
      const goal = await readJsonBody(req);
      await writeEditorHtml(goal);
      send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/render') {
      const goal = await readJsonBody(req);
      await writeDeckHtml(goal);
      send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/export/pptx') {
      const goal = await readJsonBody(req);
      const outFile = path.join(outputDir, 'presentation.pptx');
      await exportDeckToPptxScreenshot(goal, { outFile });
      const data = await readFile(outFile);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="presentation.pptx"',
      });
      res.end(data);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/export/pdf') {
      const goal = await readJsonBody(req);
      const outFile = path.join(outputDir, 'presentation.pdf');
      await exportDeckToPdf(goal, { outFile });
      const data = await readFile(outFile);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="presentation.pdf"',
      });
      res.end(data);
      return;
    }

    await serveStatic(url.pathname, res);
  } catch (err) {
    console.error(err);
    send(res, 500, String(err), 'text/plain; charset=utf-8');
  }
});

await writeEditorHtml(await loadGoal());

server.listen(port, () => {
  console.log(`lemonPPT dev server running at http://localhost:${port}/editor`);
  console.log(`goal source: ${inputFile}`);
});
