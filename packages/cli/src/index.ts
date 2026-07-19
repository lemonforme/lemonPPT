import { generateGoal } from '@lemonppt/agent-prompts';
import type { DeckGoal } from '@lemonppt/core';
import {
  exportDeckToPdf,
  exportDeckToPptx,
  renderDeck,
  type RenderOptions,
} from '@lemonppt/renderer';
import { getTheme } from '@lemonppt/themes';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface GenerateCliOptions {
  /** 用户输入的主题/需求 */
  input: string;
  /** 页数，默认 8 */
  pageCount?: number;
  /** 主题 ID，默认 minimal */
  theme?: string;
  /** 语言，默认 zh */
  language?: 'zh' | 'en';
  /** OpenAI 兼容 API Key */
  apiKey?: string;
  /** OpenAI 兼容 Base URL */
  baseUrl?: string;
  /** 模型名称 */
  model?: string;
  /** 输出文件路径，默认 ./goal.json */
  outFile?: string;
}

export interface RenderCliOptions extends RenderOptions {
  /** 输出目录，默认 ./output */
  outDir?: string;
  /** 是否开启浏览器端编辑 */
  editable?: boolean;
}

export interface ExportCliOptions {
  /** 输出文件路径 */
  outFile: string;
}

function resolveTheme(themeId?: string): string {
  const id = themeId || 'minimal';
  return getTheme(id) ? id : 'minimal';
}

async function copyThemeAssets(themeId: string, assetsDir: string): Promise<void> {
  const theme = resolveTheme(themeId);
  await mkdir(assetsDir, { recursive: true });
  const cssSource = resolvePackagePath('@lemonppt/themes', 'src', theme, 'styles.css');
  const cssDest = path.join(assetsDir, `${theme}.css`);
  await copyFile(cssSource, cssDest);
}

function resolvePackagePath(pkg: string, ...segments: string[]): string {
  const mainUrl = import.meta.resolve(pkg);
  const pkgRoot = path.resolve(path.dirname(fileURLToPath(mainUrl)), '..');
  return path.join(pkgRoot, ...segments);
}

/**
 * 生成 goal.json 并可选写入文件。
 */
export async function generateGoalToFile(options: GenerateCliOptions): Promise<DeckGoal> {
  const {
    input,
    pageCount = 8,
    theme = 'minimal',
    language = 'zh',
    apiKey,
    baseUrl,
    model,
    outFile,
  } = options;

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

  if (outFile) {
    await mkdir(path.dirname(path.resolve(outFile)), { recursive: true });
    await writeFile(path.resolve(outFile), JSON.stringify(result.goal, null, 2), 'utf-8');
  }

  return result.goal;
}

/**
 * 从文件读取 goal.json。
 */
export async function readGoalFromFile(filePath: string): Promise<DeckGoal> {
  const raw = await readFile(path.resolve(filePath), 'utf-8');
  const parsed = JSON.parse(raw) as DeckGoal;
  parsed.theme = resolveTheme(parsed.theme);
  return parsed;
}

/**
 * 渲染 deck 到输出目录。
 */
export async function renderGoalToDir(
  goal: DeckGoal,
  options: RenderCliOptions = {},
): Promise<{ html: string; indexPath: string; assetsDir: string; assets: string[] }> {
  const { outDir = './output', editable = false, width, height } = options;
  const outputDir = path.resolve(outDir);
  const assetsDir = path.join(outputDir, 'assets');

  const result = renderDeck(goal, { width, height, editable });
  await copyThemeAssets(goal.theme, assetsDir);

  const indexName = editable ? 'editor.html' : 'index.html';
  const indexPath = path.join(outputDir, indexName);
  await mkdir(outputDir, { recursive: true });
  await writeFile(indexPath, result.html, 'utf-8');

  return { html: result.html, indexPath, assetsDir, assets: result.assets };
}

/**
 * 导出 goal 为 PPTX。
 */
export async function exportGoalToPptx(
  goal: DeckGoal,
  options: ExportCliOptions,
): Promise<void> {
  const outFile = path.resolve(options.outFile);
  await mkdir(path.dirname(outFile), { recursive: true });
  await exportDeckToPptx(goal, { outFile });
}

/**
 * 导出 goal 为 PDF。
 */
export async function exportGoalToPdf(
  goal: DeckGoal,
  options: ExportCliOptions,
): Promise<void> {
  const outFile = path.resolve(options.outFile);
  await mkdir(path.dirname(outFile), { recursive: true });
  await exportDeckToPdf(goal, { outFile });
}
