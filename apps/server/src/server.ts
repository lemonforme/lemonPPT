import { generateGoal } from '@lemonppt/agent-prompts';
import type { DeckGoal } from '@lemonppt/core';
import { getTheme } from '@lemonppt/themes';
import { exportDeckToPdf, exportDeckToPptx, renderDeck } from '@lemonppt/renderer';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
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

  function resolveTheme(themeId?: string): string {
    const id = themeId || 'minimal';
    return getTheme(id) ? id : 'minimal';
  }

  async function copyThemeAssets(themeId: string, assetsDir: string): Promise<void> {
    const theme = resolveTheme(themeId);
    await mkdir(assetsDir, { recursive: true });
    const cssSource = path.join(rootDir, 'packages/themes/src', theme, 'styles.css');
    const cssDest = path.join(assetsDir, `${theme}.css`);
    await copyFile(cssSource, cssDest);
  }

  function handleError(err: unknown, req: Request, res: Response): void {
    const message = err instanceof Error ? err.message : String(err);
    log('error', `Request failed: ${req.method} ${req.path}`, { error: message });
    res.status(500).json({ success: false, error: message });
  }

  // 静态资源：输出目录
  app.use('/deck', express.static(options.outputDir));

  // 健康检查
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'lemonPPT' });
  });

  // 渲染并保存
  app.post('/api/render', async (req, res) => {
    try {
      const goal = req.body as DeckGoal;
      const result = renderDeck(goal);

      const assetsDir = path.resolve(options.outputDir, 'assets');
      await copyThemeAssets(goal.theme, assetsDir);

      await writeFile(path.join(options.outputDir, 'index.html'), result.html, 'utf-8');

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
      await exportDeckToPptx(goal, { outFile: filePath });

      log('info', 'Exported PPTX', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, file: '/deck/deck.pptx' });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 导出 PDF
  app.post('/api/export/pdf', async (req, res) => {
    try {
      const goal = req.body as DeckGoal;
      const filePath = path.join(options.outputDir, 'deck.pdf');
      await exportDeckToPdf(goal, { outFile: filePath });

      log('info', 'Exported PDF', { theme: goal.theme, slides: goal.slides.length });
      res.json({ success: true, file: '/deck/deck.pdf' });
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 直接打开编辑器（使用 sample-goal.json 示例）
  app.get('/editor', async (req, res) => {
    try {
      const samplePath = path.join(rootDir, 'examples/sample-goal.json');
      const goal = JSON.parse(await readFile(samplePath, 'utf-8')) as DeckGoal;
      const theme = resolveTheme(String(req.query.theme || goal.theme || 'minimal'));
      goal.theme = theme;
      const result = renderDeck(goal, { editable: true });

      const assetsDir = path.resolve(options.outputDir, 'assets');
      await copyThemeAssets(goal.theme, assetsDir);

      await writeFile(path.join(options.outputDir, 'editor.html'), result.html, 'utf-8');

      log('info', 'Opened editor', { theme });
      res.redirect('/deck/editor.html');
    } catch (err) {
      handleError(err, req, res);
    }
  });

  // 生成 goal.json
  app.post('/api/generate-goal', async (req, res) => {
    try {
      const { input, pageCount = 8, theme = 'minimal', language = 'zh' } = req.body;

      const result = await generateGoal({
        input,
        pageCount,
        theme,
        language,
        llm: {
          apiKey: process.env.OPENAI_API_KEY,
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
      goal.theme = resolveTheme(goal.theme);
      const result = renderDeck(goal, { editable: true });

      const assetsDir = path.resolve(options.outputDir, 'assets');
      await copyThemeAssets(goal.theme, assetsDir);

      await writeFile(path.join(options.outputDir, 'editor.html'), result.html, 'utf-8');

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
