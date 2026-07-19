import { generateGoal } from '@lemonppt/agent-prompts';
import type { DeckGoal } from '@lemonppt/core';
import {
  exportGoalToPdf,
  exportGoalToPptx,
  readGoalFromFile,
  renderGoalToDir,
} from '@lemonppt/cli';
import { getTheme } from '@lemonppt/themes';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
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
      const themeId = String(req.query.theme || goal.theme || 'base');
      goal.theme = getTheme(themeId) ? themeId : 'base';

      await renderGoalToDir(goal, { outDir: options.outputDir, editable: true });

      log('info', 'Opened editor', { theme: goal.theme });
      res.redirect('/deck/editor.html');
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 生成 goal.json
  app.post('/api/generate-goal', async (req, res) => {
    try {
      const { input, pageCount = 8, theme = 'base', language = 'zh', apiKey } = req.body;

      const result = await generateGoal({
        input,
        pageCount,
        theme,
        language,
        llm: {
          apiKey: apiKey || process.env.OPENAI_API_KEY,
          baseUrl: process.env.OPENAI_BASE_URL,
          model: process.env.OPENAI_MODEL,
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
