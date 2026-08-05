// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { generateGoal } from '@lemonppt/agent-prompts';
import type { DeckGoal } from '@lemonppt/core';
import {
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
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

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
      const goal = req.body as DeckGoal;
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
      const goal = req.body as DeckGoal;
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
      const goal = req.body as DeckGoal;
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

  // 直接打开编辑器（使用 sample-goal.json 示例）
  app.get('/editor', async (req, res) => {
    try {
      const samplePath = path.join(rootDir, 'examples/sample-goal.json');
      const goal = await readGoalFromFile(samplePath);
      const themeId = String(req.query.theme || goal.theme || 'theme01');
      goal.theme = getTheme(themeId) ? themeId : 'theme01';

      await renderGoalToDir(goal, { outDir: options.outputDir, editable: true });

      log('info', 'Opened editor', { theme: goal.theme });
      res.redirect('/deck/editor.html');
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

  // 渲染可编辑版本
  app.post('/api/render-editor', async (req, res) => {
    try {
      const goal = req.body as DeckGoal;
      const result = await renderGoalToDir(goal, { outDir: options.outputDir, editable: true });

      log('info', 'Rendered editor', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, assets: result.assets });
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
