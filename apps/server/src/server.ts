// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { generateGoal } from '@lemonppt/agent-prompts';
import { preprocessAgentGoal, type DeckGoal } from '@lemonppt/core';
import {
  copyThemeAssets,
  exportGoalToPdf,
  exportGoalToPptx,
  inspectLayout,
  listThemes,
  queryLayouts,
  readGoalFromFile,
  renderGoalToDir,
  scaffoldGoalToFile,
  validateGoalSpec,
  writeSafePropsToFile,
} from '@lemonppt/cli';
import { getTheme } from '@lemonppt/themes';
import { renderEditorData } from '@lemonppt/renderer';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

function parseGoalBody(body: unknown, fallbackTheme = 'theme01'): DeckGoal {
  const goal = preprocessAgentGoal(body) as unknown as DeckGoal;
  const requested = typeof goal.theme === 'string' ? goal.theme : fallbackTheme;
  goal.theme = getTheme(requested) ? requested : fallbackTheme;
  return goal;
}

export interface ServerOptions {
  port: number;
  outputDir: string;
}

export function createServer(options: ServerOptions): Express {
  const app = express();
  app.use(express.json());

  // 请求日志
  app.use((req, _res, next) => {
    log('info', `${req.method} ${req.path}`, { ip: req.ip });
    next();
  });

  // 基础安全响应头
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  function handleError(err: unknown, req: Request, res: Response): void {
    const message = err instanceof Error ? err.message : String(err);
    log('error', `Request failed: ${req.method} ${req.path}`, { error: message });
    res.status(500).json({ success: false, error: message });
  }

  // 静态资源：输出目录
  app.use('/deck', express.static(options.outputDir));

  // 静态资源：首页/创建页
  app.use(express.static(path.join(__dirname, 'public')));

  // 健康检查
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'lemonPPT' });
  });

  // 渲染并保存
  app.post('/api/render', async (req, res) => {
    try {
      const goal = parseGoalBody(req.body);
      const result = await renderGoalToDir(goal, { outDir: options.outputDir });

      log('info', 'Rendered deck', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, assets: result.assets });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 导出 PPTX
  app.post('/api/export/pptx', async (req, res) => {
    try {
      const goal = parseGoalBody(req.body);
      const filePath = path.join(options.outputDir, 'deck.pptx');
      await exportGoalToPptx(goal, { outFile: filePath });

      log('info', 'Exported PPTX', { theme: goal.theme, slides: goal.slides.length });
      res.download(filePath, `${goal.title || 'presentation'}.pptx`);
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 导出 PDF
  app.post('/api/export/pdf', async (req, res) => {
    try {
      const goal = parseGoalBody(req.body);
      const filePath = path.join(options.outputDir, 'deck.pdf');
      await exportGoalToPdf(goal, { outFile: filePath });

      log('info', 'Exported PDF', { theme: goal.theme, slides: goal.slides.length });
      res.download(filePath, `${goal.title || 'presentation'}.pdf`);
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 首页重定向到创建页
  app.get('/', (_req, res) => {
    res.redirect('/create.html');
  });

  // 单页编辑器入口：所有主题共享同一页面，主题由前端根据 URL 或 API 动态加载
  app.get('/editor', (_req, res) => {
    res.sendFile(path.join(rootDir, 'packages', 'renderer', 'templates', 'editor.html'));
  });

  // 单页编辑器前端逻辑
  app.get('/editor.js', (_req, res) => {
    res.sendFile(path.join(rootDir, 'packages', 'renderer', 'templates', 'editor.js'));
  });

  // 编辑器渲染数据 API：返回单页编辑器所需的 EditorData，不再写静态文件
  app.get('/api/render-editor', async (req, res) => {
    try {
      const samplePath = path.join(rootDir, 'examples/sample-goal.json');
      const goal = await readGoalFromFile(samplePath);
      const themeId = String(req.query.theme || goal.theme || 'theme01');
      goal.theme = getTheme(themeId) ? themeId : 'theme01';

      const assetsDir = path.join(options.outputDir, 'assets');
      await copyThemeAssets(goal.theme, assetsDir);

      const data = renderEditorData(goal, { width: 1280, height: 720 });

      log('info', 'Rendered editor data', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, data });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  app.post('/api/render-editor', async (req, res) => {
    try {
      const goal = parseGoalBody(req.body);
      const themeId = String(req.query.theme || goal.theme || 'theme01');
      goal.theme = getTheme(themeId) ? themeId : 'theme01';

      const assetsDir = path.join(options.outputDir, 'assets');
      await copyThemeAssets(goal.theme, assetsDir);

      const data = renderEditorData(goal, { width: 1280, height: 720 });

      log('info', 'Rendered editor data', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, data });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 临时上传本地媒体（base64），返回可在 goal.json 中引用的 URL
  app.post('/api/stage-media', async (req, res) => {
    try {
      const { filename, data } = req.body as { filename?: string; data?: string };
      if (!filename || typeof data !== 'string') {
        res.status(400).json({ success: false, error: '缺少 filename 或 base64 data' });
        return;
      }
      const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const mediaDir = path.join(options.outputDir, 'media');
      await mkdir(mediaDir, { recursive: true });
      const filePath = path.join(mediaDir, safeName);
      await writeFile(filePath, Buffer.from(data, 'base64'));

      log('info', 'Staged media', { filename: safeName });
      res.json({ success: true, url: `/deck/media/${safeName}`, localPath: filePath });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 列出可用主题
  app.get('/api/list-themes', (_req, res) => {
    try {
      res.json({ success: true, themes: listThemes() });
    } catch (err) {
      handleError(err, _req, res);
    }
  });

  // 按主题与角色查询候选版式
  app.post('/api/layout-query', (req, res) => {
    try {
      const { theme, role, keyword, needsMedia, limit, seed } = req.body;
      if (!theme || !role) {
        res.status(400).json({ success: false, error: '缺少 theme 或 role 参数' });
        return;
      }
      const result = queryLayouts({ theme, role, keyword, needsMedia, limit, seed });
      res.json({ success: true, ...result });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 查看指定版式的字段契约
  app.post('/api/inspect-layout', (req, res) => {
    try {
      const { layoutId } = req.body;
      if (!layoutId) {
        res.status(400).json({ success: false, error: '缺少 layoutId 参数' });
        return;
      }
      const info = inspectLayout(layoutId);
      if (!info) {
        res.status(404).json({ success: false, error: `未找到版式 ${layoutId}` });
        return;
      }
      res.json({ success: true, ...info });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 生成 goal.json 骨架
  app.post('/api/goal-scaffold', async (req, res) => {
    try {
      const { title, goal, audience, owner, theme, pages, language, seed } = req.body;
      if (!title || !goal) {
        res.status(400).json({ success: false, error: '缺少 title 或 goal 参数' });
        return;
      }
      const result = await scaffoldGoalToFile({
        title,
        goal,
        audience,
        owner,
        theme,
        pages,
        language,
        seed,
      });
      res.json({ success: true, goal: result });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 规范化 goal.json 的 props
  app.post('/api/write-safe-props', async (req, res) => {
    try {
      const { goal } = req.body;
      if (!goal) {
        res.status(400).json({ success: false, error: '缺少 goal 参数' });
        return;
      }
      const tmpPath = path.join(options.outputDir, '.tmp-goal.json');
      await writeFile(tmpPath, JSON.stringify(goal, null, 2), 'utf-8');
      const result = await writeSafePropsToFile({ goalPath: tmpPath, write: true });
      res.json({ success: true, ...result });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 独立校验 goal.json 规范
  app.post('/api/validate-goal-spec', async (req, res) => {
    try {
      const { goal, strict = false } = req.body;
      if (!goal) {
        res.status(400).json({ success: false, error: '缺少 goal 参数' });
        return;
      }
      const tmpPath = path.join(options.outputDir, '.tmp-goal.json');
      await writeFile(tmpPath, JSON.stringify(goal, null, 2), 'utf-8');
      const result = await validateGoalSpec(tmpPath, strict);
      res.json({ success: true, ...result });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 生成 goal.json
  app.post('/api/generate-goal', async (req, res) => {
    try {
      const {
        input,
        pageCount = 8,
        theme = 'theme01',
        language = 'zh',
        apiKey,
        baseUrl,
        model,
      } = req.body;

      const result = await generateGoal({
        input,
        pageCount,
        theme,
        language,
        llm: {
          apiKey: apiKey || process.env.OPENAI_API_KEY,
          baseUrl: baseUrl || process.env.OPENAI_BASE_URL,
          model: model || process.env.OPENAI_MODEL,
        },
      });

      log('info', 'Generated goal', { input: String(input).slice(0, 40), pageCount });
      res.json({ success: true, goal: result.goal, source: result.source });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 全局错误处理
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : String(err);
    log('error', 'Unhandled error', { error: message });
    res.status(500).json({ success: false, error: message });
  });

  return app;
}
