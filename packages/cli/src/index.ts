// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { generateGoal } from '@lemonppt/agent-prompts';
import type { DeckGoal } from '@lemonppt/core';
import { normalizeDeckGoal, preprocessAgentGoal, validateDeckGoal, validateDeckGoalContent, validateSlideCount } from '@lemonppt/core';
import {
  exportDeckToPdf,
  exportDeckToPptx,
  renderDeck,
  renderEditorData,
  type RenderOptions,
} from '@lemonppt/renderer';
import { getTheme, themes } from '@lemonppt/themes';

import { getLayout, getLayoutSchema, listLayoutsByRoleAndTheme } from '@lemonppt/templates';
import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface GenerateCliOptions {
  /** 用户输入的主题/需求 */
  input: string;
  /** 页数，默认 8 */
  pageCount?: number;
  /** 主题 ID，默认 theme01 */
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
  const id = themeId || 'theme01';
  return getTheme(id) ? id : 'theme01';
}

export async function copyThemeAssets(themeId: string, assetsDir: string): Promise<void> {
  const theme = resolveTheme(themeId);
  await mkdir(assetsDir, { recursive: true });
  const cssSource = resolvePackagePath('@lemonppt/themes', 'src', theme, 'styles.css');
  const cssDest = path.join(assetsDir, `${theme}.css`);
  await copyFile(cssSource, cssDest);

  // 复制字体资源，使 @font-face 引用在输出目录中可用
  const fontsSource = resolvePackagePath('@lemonppt/renderer', 'assets', 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  // 复制浏览器可执行 bundle（IIFE 格式），支持静态文件模式下结构编辑
  const clientRenderSource = resolvePackagePath('@lemonppt/renderer', 'dist', 'client', 'client-render.js');
  const clientRenderDest = path.join(assetsDir, 'client-render.js');
  await copyFile(clientRenderSource, clientRenderDest);

  // 复制 ECharts 主题脚本
  const themeEChartsSource = resolvePackagePath('@lemonppt/renderer', 'dist', 'client', 'theme-echarts.js');
  const themeEChartsDest = path.join(assetsDir, 'theme-echarts.js');
  await copyFile(themeEChartsSource, themeEChartsDest);

  // 复制 jQuery，供编辑器初始化自定义滚动条样式类
  const jquerySource = resolvePackagePath('jquery', 'dist', 'jquery.min.js');
  const jqueryDest = path.join(assetsDir, 'jquery.min.js');
  await copyFile(jquerySource, jqueryDest);

  // 复制编辑器交互脚本，供单页编辑器动态初始化
  const editorScriptSource = resolvePackagePath('@lemonppt/renderer', 'dist', 'client', 'editor-script.js');
  const editorScriptDest = path.join(assetsDir, 'editor-script.js');
  await copyFile(editorScriptSource, editorScriptDest);
}

export interface StageMediaOptions {
  /** 源文件路径 */
  filePath: string;
  /** 输出目录，默认 ./output */
  outDir?: string;
}

export interface StageMediaResult {
  /** 安全化后的文件名 */
  filename: string;
  /** 本地绝对路径 */
  localPath: string;
  /** 相对于输出目录的引用路径 */
  relativePath: string;
}

/**
 * 把本地媒体文件复制到输出目录的 media/ 下，供 goal.json 引用。
 */
export async function stageMediaToFile(options: StageMediaOptions): Promise<StageMediaResult> {
  const outDir = options.outDir || './output';
  const originalName = path.basename(options.filePath);
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const mediaDir = path.join(outDir, 'media');
  await mkdir(mediaDir, { recursive: true });
  const localPath = path.resolve(path.join(mediaDir, safeName));
  await copyFile(options.filePath, localPath);
  return {
    filename: safeName,
    localPath,
    relativePath: path.join('media', safeName),
  };
}

function resolvePackagePath(pkg: string, ...segments: string[]): string {
  // 优先通过 package.json 定位包根（第三方 npm 包）
  try {
    const pkgJsonUrl = import.meta.resolve(`${pkg}/package.json`);
    const pkgRoot = path.dirname(fileURLToPath(pkgJsonUrl));
    return path.join(pkgRoot, ...segments);
  } catch {
    // 工作区包可能未导出 package.json，回退到主入口的父目录的父目录
    const mainUrl = import.meta.resolve(pkg);
    const pkgRoot = path.resolve(path.dirname(fileURLToPath(mainUrl)), '..');
    return path.join(pkgRoot, ...segments);
  }
}

/**
 * 生成 goal.json 并可选写入文件。
 */
export async function generateGoalToFile(options: GenerateCliOptions): Promise<DeckGoal> {
  const {
    input,
    pageCount = 8,
    theme = 'theme01',
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
  const parsed = preprocessAgentGoal(JSON.parse(raw)) as unknown as DeckGoal;
  parsed.theme = resolveTheme(parsed.theme);
  return normalizeDeckGoal(parsed);
}

/**
 * 渲染 deck 到输出目录。
 * editable 模式下使用单页编辑器架构：复制 server 的 editor.html/editor.js，
 * 内嵌 renderEditorData 生成的 EditorData，资源路径使用相对路径。
 */
export async function renderGoalToDir(
  goal: DeckGoal,
  options: RenderCliOptions = {},
): Promise<{ html: string; indexPath: string; assetsDir: string; assets: string[] }> {
  const { outDir = './output', editable = false, width, height } = options;
  const outputDir = path.resolve(outDir);
  const assetsDir = path.join(outputDir, 'assets');

  await copyThemeAssets(goal.theme, assetsDir);
  await mkdir(outputDir, { recursive: true });

  if (editable) {
    const data = renderEditorData(goal, { width: width ?? 1280, height: height ?? 720 });
    const rendererTemplatesDir = resolvePackagePath('@lemonppt/renderer', 'templates');

    let editorHtml = await readFile(path.join(rendererTemplatesDir, 'editor.html'), 'utf-8');
    let editorJs = await readFile(path.join(rendererTemplatesDir, 'editor.js'), 'utf-8');

    // 静态文件模式下使用相对资源路径
    editorHtml = editorHtml.replace(/\/deck\/assets\//g, './assets/');
    editorHtml = editorHtml.replace(/src="\/editor\.js"/g, 'src="./editor.js"');

    // 内嵌 EditorData，让 editor.js 在静态模式下无需请求 API
    const embeddedData = `<script>
window.__lemonPPT_assetsBase = './assets/';
window.__lemonPPT_editorData = ${JSON.stringify(data)};
</script>`;
    editorHtml = editorHtml.replace('</head>', `${embeddedData}\n</head>`);

    const indexPath = path.join(outputDir, 'editor.html');
    await writeFile(indexPath, editorHtml, 'utf-8');
    await writeFile(path.join(outputDir, 'editor.js'), editorJs, 'utf-8');

    const assets = [
      './assets/fonts/fonts.css',
      `./assets/${data.theme}.css`,
      './assets/jquery.min.js',
      './assets/editor-script.js',
      './assets/client-render.js',
      './assets/theme-echarts.js',
    ];
    return { html: editorHtml, indexPath, assetsDir, assets };
  }

  const result = renderDeck(goal, { width, height });
  const indexPath = path.join(outputDir, 'index.html');
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

/**
 * 列出所有可用主题。
 */
export function listThemes(): { id: string; name: string }[] {
  return themes.map((t) => ({ id: t.id, name: (t as { displayName?: string }).displayName || t.id }));
}

/**
 * 按主题与角色查询候选版式。
 */
export function queryLayouts(options: {
  theme: string;
  role: string;
  keyword?: string;
  needsMedia?: boolean;
  limit?: number;
  seed?: string;
}): {
  theme: string;
  role: string;
  count: number;
  layouts: { layout: string; displayName: string; description: string; needsMedia: boolean }[];
} {
  const { theme, role, keyword, needsMedia, limit = 8, seed = `lemon-${Date.now()}` } = options;

  let layouts = listLayoutsByRoleAndTheme(role as import('@lemonppt/core').SlideRole, theme);
  if (keyword) {
    const kw = keyword.toLowerCase();
    layouts = layouts.filter((m) =>
      [m.id, m.displayName, m.description || '', ...(m.tags || []), m.contentShape || '']
        .join(' ')
        .toLowerCase()
        .includes(kw)
    );
  }
  if (needsMedia) {
    layouts = layouts.filter((m) => m.needsMedia);
  }

  // 按 seed 做可复现的伪随机排序
  let s = 0;
  const seedStr = `${seed}-${role}-${theme}`;
  for (let i = 0; i < seedStr.length; i++) {
    s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  if (s === 0) s = 123456789;
  let x = s, y = 362436069, z = 521288629, w = 88675123;
  const random = () => {
    const t = x ^ (x << 11);
    x = y; y = z; z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 0xffffffff;
  };

  const copy = [...layouts];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const picked = copy.slice(0, limit);

  return {
    theme,
    role,
    count: picked.length,
    layouts: picked.map((m) => ({
      layout: m.id,
      displayName: m.displayName,
      description: m.description || '',
      needsMedia: m.needsMedia,
    })),
  };
}

/**
 * 查看指定版式的字段契约。
 */
export function inspectLayout(layoutId: string): {
  layout: string;
  displayName: string;
  theme: string;
  role: string;
  description: string;
  needsMedia: boolean;
  mediaSlots: { name: string; fieldPath: string; canPresetMedia: boolean }[];
  tags: string[];
  contentShape: string;
  fields: { key: string; label: string; type: string; defaultValue?: unknown }[];
} | null {
  const registered = getLayout(layoutId);
  const schema = getLayoutSchema(layoutId);
  if (!registered || !schema) return null;
  const meta = registered.meta;

  function simplifyField(field: { key: string; label: string; type: string; defaultValue?: unknown; itemSchema?: unknown[] }): { key: string; label: string; type: string; defaultValue?: unknown } {
    const out: { key: string; label: string; type: string; defaultValue?: unknown } = {
      key: field.key,
      label: field.label,
      type: field.type,
    };
    if (field.defaultValue !== undefined) out.defaultValue = field.defaultValue;
    return out;
  }

  return {
    layout: meta.id,
    displayName: meta.displayName,
    theme: meta.theme,
    role: meta.role,
    description: meta.description || '',
    needsMedia: meta.needsMedia,
    mediaSlots: meta.mediaSlots || [],
    tags: meta.tags || [],
    contentShape: meta.contentShape || '',
    fields: schema.fields.map(simplifyField),
  };
}

function createSeededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  }
  if (s === 0) s = 123456789;
  let x = s;
  let y = 362436069;
  let z = 521288629;
  let w = 88675123;
  return () => {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 0xffffffff;
  };
}

function chooseRoles(pageCount: number, seed: string): string[] {
  const random = createSeededRandom(seed);
  if (pageCount < 3) {
    return Array.from({ length: pageCount }, () => 'content');
  }
  const roles = ['cover'];
  if (pageCount >= 4) roles.push('tableOfContents');
  const contentRoles = ['content', 'metric', 'chart', 'process', 'comparison', 'feature', 'timeline', 'quote', 'image', 'table', 'stats'];
  const remaining = pageCount - roles.length - 1;
  for (let i = 0; i < remaining; i++) {
    const idx = Math.floor(random() * contentRoles.length);
    roles.push(contentRoles[idx]);
  }
  roles.push('closing');
  return roles;
}

/**
 * 生成只含 role 的 goal.json 骨架。
 */
export async function scaffoldGoalToFile(options: {
  title: string;
  goal: string;
  audience?: string;
  owner?: string;
  theme?: string;
  pages?: number;
  language?: 'zh' | 'en';
  seed?: string;
  outFile?: string;
}): Promise<DeckGoal> {
  const {
    title,
    goal,
    audience = '内部团队',
    owner,
    theme = 'theme01',
    pages = 8,
    language = 'zh',
    seed = `lemon-${Date.now()}`,
    outFile,
  } = options;

  const roles = chooseRoles(pages, seed);
  const { composeDeckFromRaw: compose } = await import('@lemonppt/composer');
  const result = compose({
    title,
    goal,
    audience,
    owner,
    theme,
    language,
    pageCount: pages,
    randomSeed: seed,
    slides: roles.map((role) => ({ role: role as import('@lemonppt/core').SlideRole, props: {} })),
  });

  if (outFile) {
    await mkdir(path.dirname(path.resolve(outFile)), { recursive: true });
    await writeFile(path.resolve(outFile), JSON.stringify(result, null, 2), 'utf-8');
  }

  return result;
}

function getDefaultValue(field: { type: string; defaultValue?: unknown; min?: number; options?: { value: string }[] }): unknown {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case 'text':
    case 'textarea':
      return '';
    case 'number':
    case 'slider':
      return field.min ?? 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'select':
      return field.options?.[0]?.value ?? '';
    case 'image':
    case 'color':
      return '';
    case 'object':
      return {};
    default:
      return '';
  }
}

function normalizePropsWithSchema(props: Record<string, unknown>, fields: { key: string; type: string; defaultValue?: unknown; itemSchema?: unknown[] }[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const knownKeys = new Set<string>();

  for (const field of fields || []) {
    const key = field.key;
    knownKeys.add(key);
    const current = props[key];

    if (field.type === 'array' && field.itemSchema) {
      if (!Array.isArray(current)) {
        result[key] = [];
      } else {
        result[key] = current.map((item) =>
          item && typeof item === 'object'
            ? normalizePropsWithSchema(item as Record<string, unknown>, field.itemSchema as { key: string; type: string; defaultValue?: unknown; itemSchema?: unknown[] }[])
            : item
        );
      }
    } else if (current === undefined || current === null) {
      result[key] = getDefaultValue(field);
    } else {
      result[key] = current;
    }
  }

  for (const key of Object.keys(props)) {
    if (!knownKeys.has(key) && !key.startsWith('_')) {
      result[key] = props[key];
    }
  }

  return result;
}

/**
 * 规范化 goal.json 的 props。
 */
export async function writeSafePropsToFile(options: { goalPath: string; write?: boolean }): Promise<{
  valid: boolean;
  layoutChanges: { index: number; from: string; to: string }[];
  unknownFields: { index: number; layout: string; keys: string[] }[];
  goal: DeckGoal;
}> {
  const { goalPath, write } = options;
  const preprocessed = preprocessAgentGoal(JSON.parse(await readFile(path.resolve(goalPath), 'utf-8'))) as unknown as DeckGoal & { slides: { role: string; layout?: string; props: Record<string, unknown> }[] };

  const { composeDeckFromRaw: compose } = await import('@lemonppt/composer');
  const composed = compose({
    title: preprocessed.title,
    goal: preprocessed.goal,
    audience: preprocessed.audience,
    owner: preprocessed.owner,
    theme: preprocessed.theme,
    language: preprocessed.language,
    colorScheme: preprocessed.colorScheme,
    appearance: preprocessed.appearance,
    pageCount: preprocessed.pageCount,
    randomSeed: preprocessed.randomSeed,
    slides: preprocessed.slides.map((s) => ({ role: s.role as import('@lemonppt/core').SlideRole, layout: s.layout, props: s.props })),
  });

  const layoutChanges: { index: number; from: string; to: string }[] = [];
  const unknownFields: { index: number; layout: string; keys: string[] }[] = [];

  const safeSlides = composed.slides.map((slide, index) => {
    const originalLayout = preprocessed.slides[index]?.layout;
    const registered = getLayout(slide.layout);
    const schema = registered ? getLayoutSchema(slide.layout) : undefined;

    if (originalLayout && originalLayout !== slide.layout) {
      layoutChanges.push({ index: index + 1, from: originalLayout, to: slide.layout });
    }

    if (!schema) return { ...slide, props: slide.props };

    const normalized = normalizePropsWithSchema(slide.props || {}, schema.fields as { key: string; type: string; defaultValue?: unknown; itemSchema?: unknown[] }[]);
    const unknownKeys = Object.keys(slide.props || {}).filter((k) => !schema.fields.some((f) => f.key === k) && !k.startsWith('_'));
    if (unknownKeys.length > 0) {
      unknownFields.push({ index: index + 1, layout: slide.layout, keys: unknownKeys });
    }

    return { ...slide, props: normalized };
  });

  const safeGoal: DeckGoal = { ...composed, slides: safeSlides };
  const validation = validateDeckGoal(safeGoal);

  if (write) {
    await writeFile(path.resolve(goalPath), JSON.stringify(safeGoal, null, 2), 'utf-8');
  }

  if (!validation.success) {
    throw new Error(`goal.json 校验失败: ${JSON.stringify(validation.errors?.format())}`);
  }

  return { valid: true, layoutChanges, unknownFields, goal: safeGoal };
}

/**
 * 校验 goal.json 规范。
 */
export async function validateGoalSpec(goalPath: string, strict?: boolean): Promise<{
  valid: boolean;
  errors: { type: string; detail: unknown }[];
  warnings: string[];
}> {
  const raw = preprocessAgentGoal(JSON.parse(await readFile(path.resolve(goalPath), 'utf-8'))) as unknown as DeckGoal;

  const result = {
    valid: false,
    errors: [] as { type: string; detail: unknown }[],
    warnings: [] as string[],
  };

  const validation = validateDeckGoal(raw);
  if (!validation.success || !validation.data) {
    result.errors.push({ type: 'schema', detail: validation.errors?.format() });
    return result;
  }

  const goal = validation.data;
  const countErrors = validateSlideCount({ pageCount: goal.pageCount, slides: goal.slides });
  if (countErrors.length > 0) {
    result.errors.push(...countErrors.map((msg) => ({ type: 'count', detail: msg })));
  }

  const contentWarnings = validateDeckGoalContent(goal);
  if (contentWarnings.length > 0) {
    if (strict) {
      result.errors.push(...contentWarnings.map((msg) => ({ type: 'content', detail: msg })));
    } else {
      result.warnings.push(...contentWarnings);
    }
  }

  const firstSlide = goal.slides[0];
  const lastSlide = goal.slides[goal.slides.length - 1];
  if (firstSlide?.role !== 'cover') result.warnings.push('第一页建议使用 cover 角色');
  if (lastSlide?.role !== 'closing') result.warnings.push('最后一页建议使用 closing 角色');

  if (result.errors.length === 0) {
    result.valid = true;
  }

  return result;
}

export interface ValidateDeckOptions {
  /** 渲染输出目录（应包含 index.html） */
  deckDir: string;
  /** 可选的 goal.json 路径，用于比对页数 */
  goalPath?: string;
}

export interface ValidateDeckResult {
  valid: boolean;
  slides: number;
  errors: string[];
  warnings: string[];
}

/**
 * 校验渲染后的 HTML deck 结构是否完整。
 */
export async function validateDeck(options: ValidateDeckOptions): Promise<ValidateDeckResult> {
  const result: ValidateDeckResult = { valid: false, slides: 0, errors: [], warnings: [] };
  const indexPath = path.resolve(options.deckDir, 'index.html');
  if (!existsSync(indexPath)) {
    result.errors.push(`deck index.html not found: ${indexPath}`);
    return result;
  }

  const html = await readFile(indexPath, 'utf-8');
  if (html.length < 100) {
    result.errors.push('index.html is too short, render may have failed');
    return result;
  }

  // 估算 slide 数量：通过 lp-slide-wrapper 容器
  const wrapperMatches = html.match(/class="[^"]*\blp-slide-wrapper\b[^"]*"/g) ?? [];
  const indexMatches = html.match(/data-slide-index="\d+"/g) ?? [];
  result.slides = Math.max(wrapperMatches.length, indexMatches.length);

  if (result.slides === 0) {
    result.errors.push('no slides found in index.html');
  }

  if (options.goalPath) {
    const goal = JSON.parse(await readFile(path.resolve(options.goalPath), 'utf-8')) as DeckGoal;
    const expected = goal.slides.length;
    if (result.slides !== expected) {
      result.errors.push(`slide count mismatch: deck=${result.slides}, goal=${expected}`);
    }
  }

  if (!html.includes('</html>')) {
    result.warnings.push('index.html may be truncated (missing closing </html>)');
  }

  if (result.errors.length === 0) {
    result.valid = true;
  }
  return result;
}

export interface ValidateCopyOptions {
  goalPath: string;
  deckDir: string;
}

export interface ValidateCopyResult {
  valid: boolean;
  missing: string[];
  checked: number;
  errors: string[];
}

function collectTextStrings(value: unknown): string[] {
  const results: string[] = [];
  function walk(v: unknown): void {
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed.length >= 4) results.push(trimmed);
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === 'object') {
      Object.values(v).forEach(walk);
    }
  }
  walk(value);
  return [...new Set(results)];
}

/**
 * 校验 goal.json 中的文案是否都出现在渲染后的 HTML 中。
 */
export async function validateGoalCopy(options: ValidateCopyOptions): Promise<ValidateCopyResult> {
  const result: ValidateCopyResult = { valid: false, missing: [], checked: 0, errors: [] };
  const indexPath = path.resolve(options.deckDir, 'index.html');
  if (!existsSync(indexPath)) {
    result.errors.push(`deck index.html not found: ${indexPath}`);
    return result;
  }

  const goal = JSON.parse(await readFile(path.resolve(options.goalPath), 'utf-8')) as DeckGoal;
  const html = await readFile(indexPath, 'utf-8');

  const texts = collectTextStrings(goal.slides.map((s) => s.props));
  result.checked = texts.length;
  const normalizedHtml = html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
  for (const text of texts) {
    const normalizedText = text.replace(/\s+/g, ' ');
    if (!normalizedHtml.includes(normalizedText)) {
      result.missing.push(text.slice(0, 80));
    }
  }

  if (result.missing.length > 0) {
    result.errors.push(`${result.missing.length} / ${result.checked} text snippets missing in rendered HTML`);
  } else if (result.checked === 0) {
    result.errors.push('no text found in goal.json to validate');
  } else {
    result.valid = true;
  }

  return result;
}
