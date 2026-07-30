// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, Slide as CoreSlide } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import PptxGenJS, { type Slide as PptxSlide } from 'pptxgenjs';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export interface PptxExportOptions {
  outFile: string;
  title?: string;
  subject?: string;
  author?: string;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  white: string;
  light: string;
  border: string; 
  surface: string;
  surfaceElevated: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

interface ThemeConfig {
  colorsLight: ThemeColors;
  colorsDark: ThemeColors;
  fonts: ThemeFonts;
  chartColors: string[];
  chartColorsDark?: string[];
}

interface ResolvedThemeConfig {
  colors: ThemeColors;
  fonts: ThemeFonts;
  chartColors: string[];
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  theme01: {
    colorsLight: {
      primary: '1D1D1F',
      secondary: '6E6E73',
      accent: '2563EB',
      white: 'FFFFFF',
      light: 'F3F4F6',
      border: 'E5E7EB',
      surface: 'FFFFFF',
      surfaceElevated: 'F9FAFB',
    },
    colorsDark: {
      primary: 'F0F0F5',
      secondary: 'C0C0CC',
      accent: '3B82F6',
      white: '1A1A20',
      light: '25252C',
      border: '3A3A44',
      surface: '1A1A20',
      surfaceElevated: '25252C',
    },
    fonts: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    chartColors: ['2563EB', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'],
    chartColorsDark: ['3B82F6', '34D399', 'FBBF24', 'F87171', 'A78BFA', 'F472B6'],
  },
  theme02: {
    colorsLight: {
      primary: 'F0F4F8',
      secondary: 'A0A8B0',
      accent: '00E5B0',
      white: '080A0E',
      light: '0F1218',
      border: '2A2E36',
      surface: '0F1218',
      surfaceElevated: '161A22',
    },
    colorsDark: {
      primary: 'F0F4F8',
      secondary: 'A0A8B0',
      accent: '00E5B0',
      white: '080A0E',
      light: '0F1218',
      border: '2A2E36',
      surface: '0F1218',
      surfaceElevated: '161A22',
    },
    fonts: { heading: 'Space Grotesk', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['00E5B0', 'FFD166', '00B4FF', 'FF6B6B', 'A78BFA', 'F472B6'],
  },
  theme03: {
    colorsLight: {
      primary: '05080D',
      secondary: '5A5E68',
      accent: '0077B6',
      white: 'F1F3F5',
      light: 'E5E8EB',
      border: 'D0D2D6',
      surface: 'FFFFFF',
      surfaceElevated: 'F1F3F5',
    },
    colorsDark: {
      primary: 'E8EDF3',
      secondary: '8A8F99',
      accent: '00B4FF',
      white: '05080D',
      light: '0D1118',
      border: '22262D',
      surface: '05080D',
      surfaceElevated: '0D1118',
    },
    fonts: { heading: 'Space Grotesk', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['00B4FF', 'FF2A6D', '8B5CF6', 'FF7B54', 'FF9F1C', '22D3EE'],
  },
  theme04: {
    colorsLight: {
      primary: '1A1A1A',
      secondary: '6B6B73',
      accent: '22A55C',
      white: 'FAFAF8',
      light: 'F1F1ED',
      border: 'E5E5E0',
      surface: 'FFFFFF',
      surfaceElevated: 'FAFAF8',
    },
    colorsDark: {
      primary: 'F4F4F5',
      secondary: 'A0A0A8',
      accent: '3ADE80',
      white: '0A0A0A',
      light: '121212',
      border: '2A2A2E',
      surface: '0A0A0A',
      surfaceElevated: '121212',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter', mono: 'Space Mono' },
    chartColors: ['3ADE80', 'FF6B9D', '4ECDC4', 'FFD166', 'A78BFA', 'FF8A5B'],
  },
};

function resolveThemeConfig(
  theme: string | undefined,
  language: string | undefined,
  colorScheme: string = 'light',
  appearance: string = 'dark',
): ResolvedThemeConfig {
  const config = THEME_CONFIGS[theme ?? ''] ?? THEME_CONFIGS.theme01;
  const effectiveColorScheme = colorScheme || (theme === 'theme02' || theme === 'theme03' ? 'scheme-a' : theme === 'theme04' ? 'green' : 'light');

  let isDark = false;
  let colors: ThemeColors;
  let chartColors: string[];

  if (theme === 'theme02') {
    isDark = true;
    colors = config.colorsDark;
    chartColors = config.chartColors;
  } else if (theme === 'theme03') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isSchemeB = effectiveColorScheme === 'scheme-b';
    const isLight03 = appearance === 'light';
    const accent = isSchemeB
      ? (isLight03 ? 'B45309' : 'FF9F1C')
      : (isLight03 ? '0077B6' : '00B4FF');
    const accent2 = isSchemeB
      ? (isLight03 ? '0077B6' : '00B4FF')
      : (isLight03 ? 'C2185B' : 'FF2A6D');
    const accentCool = isSchemeB
      ? (isLight03 ? '6B21A8' : '8B5CF6')
      : (isLight03 ? '6B21A8' : '8B5CF6');
    colors = {
      ...colors,
      accent,
      secondary: accent2,
    };
    chartColors = [accent, accent2, accentCool, isLight03 ? 'C2410C' : 'FF7B54', isLight03 ? 'B45309' : 'FF9F1C', isLight03 ? '0077B6' : '22D3EE'];
  } else if (theme === 'theme04') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isLight04 = appearance === 'light';
    const tone = ['green', 'yellow', 'blue', 'pink'].includes(colorScheme) ? colorScheme : 'green';
    const toneAccents: Record<string, { dark: string; light: string }> = {
      green: { dark: '3ADE80', light: '22A55C' },
      yellow: { dark: 'FFD166', light: 'D97706' },
      blue: { dark: '4ECDC4', light: '0D9488' },
      pink: { dark: 'FF6B9D', light: 'DB2777' },
    };
    const accent = toneAccents[tone][isLight04 ? 'light' : 'dark'];
    const accent2 = isLight04 ? 'DB2777' : 'FF6B9D';
    const accentCool = isLight04 ? '0D9488' : '4ECDC4';
    colors = {
      ...colors,
      accent,
      secondary: accent2,
    };
    chartColors = [accent, accent2, accentCool, isLight04 ? 'D97706' : 'FFD166', isLight04 ? '7C3AED' : 'A78BFA', isLight04 ? 'EA580C' : 'FF8A5B'];
  } else {
    isDark = effectiveColorScheme === 'dark';
    colors = isDark ? config.colorsDark : config.colorsLight;
    chartColors = isDark ? (config.chartColorsDark ?? config.chartColors) : config.chartColors;
  }

  const resolved: ResolvedThemeConfig = {
    colors,
    fonts: config.fonts,
    chartColors,
  };

  // 中文场景优先使用 Noto 中文字体，同时保留主题字体作为备选
  if (language === 'zh') {
    resolved.fonts = {
      heading: 'Noto Sans SC',
      body: 'Noto Sans SC',
      mono: 'Noto Sans SC',
    };
  }

  return resolved;
}

export let COLORS: ThemeColors = THEME_CONFIGS.theme01.colorsLight;
export let FONTS: ThemeFonts = THEME_CONFIGS.theme01.fonts;
export let CHART_COLORS: string[] = THEME_CONFIGS.theme01.chartColors;

export async function exportDeckToPptx(goal: DeckGoal, options: PptxExportOptions): Promise<void> {
  goal = normalizeDeckGoal(goal);
  const { outFile, title = goal.title, subject, author } = options;

  const theme = resolveThemeConfig(goal.theme, goal.language, goal.colorScheme, goal.appearance);
  COLORS = theme.colors;
  FONTS = theme.fonts;
  CHART_COLORS = theme.chartColors;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  for (const slide of goal.slides) {
    const pptxSlide = pptx.addSlide();
    (pptxSlide as unknown as { background: { color: string } }).background = { color: COLORS.surface };
    if (goal.theme === 'theme02' || goal.theme === 'theme03') {
      addTheme02Background(pptxSlide);
    } else if (goal.theme === 'theme04') {
      addTheme04Background(pptxSlide);
    }
    renderSlideToPptx(pptxSlide, slide);
  }

  try {
    await pptx.writeFile({ fileName: outFile });
  } finally {
    cleanupTempImages();
  }
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

/** 按 layoutId 索引的 PPTX 渲染器注册表。 */
const pptxRenderersByLayout = new Map<string, PptxRenderFn>();

function registerPptxLayoutRenderer(layoutId: string, renderFn: PptxRenderFn): void {
  pptxRenderersByLayout.set(layoutId, renderFn);
}

function resolvePptxRenderer(slide: CoreSlide): PptxRenderFn | undefined {
  return pptxRenderersByLayout.get(slide.layout);
}

function renderSlideToPptx(pptxSlide: PptxSlide, slide: CoreSlide): void {
  const renderer = resolvePptxRenderer(slide);
  if (renderer) {
    renderer(pptxSlide, slide.props);
    return;
  }

  pptxSlide.addText(`Unknown layout: ${slide.layout}`, {
    x: 0.5, y: 3.5, w: 9, h: 1,
    fontSize: 18, color: 'EF4444', align: 'center',
  });
}

// ---- Shared helpers --------------------------------------------------------

function addKicker(slide: PptxSlide, kicker: string | undefined, x = 0.8, y = 0.8): void {
  if (!kicker) return;
  slide.addText(kicker, {
    x, y, w: 8.4, h: 0.4,
    fontSize: 14, color: COLORS.accent, align: 'left',
    fontFace: FONTS.mono,
  });
}

/** 为 theme02 幻灯片添加深色霓虹渐变背景。 */
function addTheme02Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 160,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);
}

/** 为 theme04 幻灯片添加玻璃糖果渐变背景。 */
export function addTheme04Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 155,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);

  // 右上角糖果色弥散光晕
  slide.addShape('ellipse', {
    x: 7.2, y: -0.8, w: 3.8, h: 2.6,
    fill: {
      color: COLORS.accent,
      transparency: 88,
    },
  } as any);

  // 左下角冷色光晕
  slide.addShape('ellipse', {
    x: -1.2, y: 4.0, w: 3.4, h: 2.2,
    fill: {
      color: '4ECDC4',
      transparency: 90,
    },
  } as any);
}

/** theme02 玻璃卡片：深色表面 + 细边框 + 柔和阴影。 */
function addTheme02Card(slide: PptxSlide, x: number, y: number, w: number, h: number, radius = 0.15): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: radius,
    shadow: {
      type: 'outer',
      blur: 8,
      offset: 4,
      angle: 45,
      color: '000000',
      opacity: 0.35,
    },
  } as any);
}

function addTitle(slide: PptxSlide, title: string, x = 0.8, y = 1.3, w = 8.4, h = 0.9, fontSize = 44): void {
  slide.addText(title, {
    x, y, w, h,
    fontSize, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
}

interface SimpleInsight {
  value?: string;
  label?: string;
  description?: string;
}

function renderInsightPanel(slide: PptxSlide, insight: SimpleInsight | undefined, x: number, y: number, w: number, h: number): void {
  if (!insight || (!insight.value && !insight.label && !insight.description)) return;

  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.15,
  });

  let cursorY = y + 0.25;
  if (insight.value) {
    slide.addText(insight.value, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.65,
      fontSize: 36, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    cursorY += 0.62;
  }
  if (insight.label) {
    slide.addText(insight.label, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cursorY += 0.38;
  }
  if (insight.description) {
    slide.addText(insight.description, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: h - (cursorY - y) - 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

function addBulletList(slide: PptxSlide, items: string[], x: number, y: number, w: number, maxItems = 8): number {
  const list = items.slice(0, maxItems);
  let cy = y;
  for (const item of list) {
    slide.addShape('ellipse', {
      x: x + 0.05, y: cy + 0.16, w: 0.1, h: 0.1,
      fill: { color: COLORS.accent },
    });
    slide.addText(item, {
      x: x + 0.3, y: cy, w: w - 0.3, h: 0.55,
      fontSize: 20, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cy += 0.7;
  }
  return cy;
}

let exportTmpDir: string | null = null;
const dataUriToTempPath = new Map<string, string>();

function getExportTmpDir(): string | null {
  if (!exportTmpDir) {
    try {
      exportTmpDir = mkdtempSync(path.join(tmpdir(), 'lemonppt-'));
    } catch {
      return null;
    }
  }
  return exportTmpDir;
}

function dataUriToTempFile(url: string): string | undefined {
  const cached = dataUriToTempPath.get(url);
  if (cached) return cached;

  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return undefined;

  const mime = match[1];
  const base64 = match[2];
  const ext =
    mime === 'image/svg+xml' ? 'svg' :
    mime === 'image/png' ? 'png' :
    mime === 'image/jpeg' ? 'jpg' :
    mime === 'image/webp' ? 'webp' : 'bin';

  try {
    const buffer = Buffer.from(base64, 'base64');
    const tmpDir = getExportTmpDir();
    if (!tmpDir) return undefined;
    const fileName = `img-${crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16)}.${ext}`;
    const filePath = path.join(tmpDir, fileName);
    writeFileSync(filePath, buffer);
    dataUriToTempPath.set(url, filePath);
    return filePath;
  } catch {
    return undefined;
  }
}

function addImageMaybe(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number): void {
  if (!url) return;

  let pathOrUrl = url;
  if (url.startsWith('data:')) {
    const tempPath = dataUriToTempFile(url);
    if (!tempPath) {
      slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle' });
      return;
    }
    pathOrUrl = tempPath;
  }

  // pptxgenjs 在 Node 环境无法直接下载远程 URL，仅当为本地文件或 base64 时可用。
  try {
    slide.addImage({ path: pathOrUrl, x, y, w, h, sizing: { type: 'crop', w, h } });
  } catch {
    slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle' });
  }
}

function cleanupTempImages(): void {
  dataUriToTempPath.clear();
  if (exportTmpDir) {
    try {
      rmSync(exportTmpDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
    exportTmpDir = null;
  }
}

// ---- Layout renderers ------------------------------------------------------

interface CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
}

function renderCoverV1(slide: PptxSlide, props: CoverV1Props): void {
  if (props.image) addImageMaybe(slide, props.image, 0, 0, 10, 5.625);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y: 2.0, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.5, w: 8, h: 1.2,
    fontSize: 54, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.8, w: 7, h: 0.8,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  if (props.date) {
    slide.addText(props.date, {
      x: 1, y: 5.0, w: 8, h: 0.3,
      fontSize: 14, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface TableOfContentsV1Props {
  kicker?: string;
  title: string;
  items?: string[];
}

function renderTableOfContentsV1(slide: PptxSlide, props: TableOfContentsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.4;
  items.forEach((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    slide.addText(number, {
      x: 0.8, y, w: 0.8, h: 0.45,
      fontSize: 18, color: COLORS.accent, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item, {
      x: 1.7, y, w: 7.8, h: 0.45,
      fontSize: 26, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.75;
  });
}

interface MetricV1Props {
  label?: string;
  value: string;
  unit?: string;
  description?: string;
}

function renderMetricV1(slide: PptxSlide, props: MetricV1Props): void {
  if (props.label) {
    slide.addText(props.label, {
      x: 1, y: 1.8, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  const metricText = props.unit ? `${props.value} ${props.unit}` : props.value;
  slide.addText(metricText, {
    x: 1, y: 2.4, w: 8, h: 1.4,
    fontSize: 90, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.description) {
    slide.addText(props.description, {
      x: 1.5, y: 4.1, w: 7, h: 0.8,
      fontSize: 20, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

interface StatsV1Props {
  kicker?: string;
  title: string;
  stats?: { label?: string; value?: string; unit?: string; change?: string }[];
  showInsight?: boolean;
  insight?: SimpleInsight;
}

function renderStatsV1(slide: PptxSlide, props: StatsV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const cardW = (mainW - 0.4) / 2;
  const startX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title, startX, 1.3, mainW);
  const stats = (props.stats || []).slice(0, 4);
  const positions = [
    { x: startX, y: 2.5 },
    { x: startX + cardW + 0.2, y: 2.5 },
    { x: startX, y: 4.0 },
    { x: startX + cardW + 0.2, y: 4.0 },
  ];
  stats.forEach((stat, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: cardW, h: 1.3,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    const valueText = [stat.value, stat.unit].filter(Boolean).join(' ');
    slide.addText(valueText || '-', {
      x: pos.x + 0.2, y: pos.y + 0.15, w: cardW - 0.4, h: 0.55,
      fontSize: 30, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(stat.label || '', {
      x: pos.x + 0.2, y: pos.y + 0.75, w: cardW - 1.0, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.body,
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: pos.x + cardW - 1.0, y: pos.y + 0.75, w: 0.8, h: 0.35,
        fontSize: 14, color: COLORS.accent, align: 'right',
        fontFace: FONTS.mono,
      });
    }
  });

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface ChartV1InsightItem {
  label?: string;
  value?: string;
}

interface ChartV1Insight {
  headline?: string;
  subheadline?: string;
  items?: ChartV1InsightItem[];
  badge?: { text?: string; tone?: 'accent' | 'success' | 'warning' };
}

interface ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  insight?: ChartV1Insight;
  footnote?: string;
}

function renderChartV1(slide: PptxSlide, props: ChartV1Props): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const labels = props.labels || [];
  const data = props.data || [];
  const insight = props.insight || {};
  const hasInsight = !!insight.headline || !!insight.subheadline || (insight.items && insight.items.length > 0) || !!insight.badge?.text;

  if (labels.length === 0 || data.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const chartType = props.type || 'bar';
  const chartColors = chartType === 'pie'
    ? data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length])
    : [COLORS.accent];
  const chartData = [
    {
      name: props.title || '',
      labels,
      values: data,
    },
  ];

  const chartW = hasInsight ? 5.6 : 8.4;
  slide.addChart(chartType as 'bar' | 'line' | 'pie', chartData, {
    x: 0.6, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: 'FFFFFF', transparency: 40 },
      line: { color: 'E5E7EB', width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.5;
    if (insight.headline) {
      slide.addText(insight.headline, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.primary,
      });
      cursorY += 0.6;
    }
    if (insight.subheadline) {
      slide.addText(insight.subheadline, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }

    if (insight.items && insight.items.length > 0) {
      cursorY += 0.1;
      insight.items.forEach((item) => {
        slide.addText(item.label || '', {
          x: 6.7, y: cursorY, w: 1.3, h: 0.28,
          fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        });
        slide.addText(item.value || '', {
          x: 8.0, y: cursorY, w: 1.3, h: 0.28,
          fontSize: 12, fontFace: FONTS.body, bold: true, color: COLORS.primary, align: 'right',
        });
        cursorY += 0.34;
      });
    }

    if (insight.badge?.text) {
      const badgeColor = insight.badge.tone === 'success' ? '10B981' : insight.badge.tone === 'warning' ? 'F59E0B' : COLORS.accent;
      cursorY += 0.1;
      slide.addShape('roundRect', {
        x: 6.7, y: cursorY, w: 2.0, h: 0.32,
        fill: { color: badgeColor },
        rectRadius: 0.16,
      });
      slide.addText(insight.badge.text, {
        x: 6.7, y: cursorY, w: 2.0, h: 0.32,
        fontSize: 10, fontFace: FONTS.body, bold: true, color: 'FFFFFF',
        align: 'center', valign: 'middle',
      });
    }
  }

  if (props.footnote || props.unit) {
    const footerText = [props.unit ? `单位：${props.unit}` : '', props.footnote || ''].filter(Boolean).join(' · ');
    slide.addText(footerText, {
      x: 0.6, y: 5.75, w: 8.9, h: 0.3,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
    });
  }
}

interface ChartTreemapProps {
  title?: string;
  kicker?: string;
  data?: Array<{ name: string; value: number; children?: Array<{ name: string; value: number }> }>;
}

function renderChartTreemap(slide: PptxSlide, props: ChartTreemapProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  // 把树状数据拍平为 (name, value) 列表，按 value 降序取前 10
  const flat = raw.flatMap((item) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child) => ({ name: `${item.name} / ${child.name}`, value: child.value }));
    }
    return [{ name: item.name, value: item.value }];
  });
  const sorted = flat.sort((a, b) => b.value - a.value).slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数据', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ChartSankeyProps {
  title?: string;
  kicker?: string;
  data?: Array<{ source: string; target: string; value: number }>;
}

function renderChartSankey(slide: PptxSlide, props: ChartSankeyProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const aggregated = new Map<string, number>();
  raw.forEach((link) => {
    const key = `${link.source} → ${link.target}`;
    aggregated.set(key, (aggregated.get(key) ?? 0) + link.value);
  });
  const sorted = Array.from(aggregated.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '流量', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ChartSunburstProps {
  title?: string;
  kicker?: string;
  data?: Array<{ name: string; value: number; children?: Array<{ name: string; value: number }> }>;
}

function renderChartSunburst(slide: PptxSlide, props: ChartSunburstProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const flat = raw.flatMap((item) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child) => ({ name: `${item.name} / ${child.name}`, value: child.value }));
    }
    return [{ name: item.name, value: item.value }];
  });
  const sorted = flat.sort((a, b) => b.value - a.value).slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数据', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ChartGaugeProps {
  title?: string;
  kicker?: string;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  insight?: ChartInsight;
}

function renderChartGauge(slide: PptxSlide, props: ChartGaugeProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const value = props.value ?? 0;
  const min = props.min ?? 0;
  const max = Math.max(props.max ?? 100, min + 1);
  const unit = props.unit || '';
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  slide.addText(`${value}${unit}`, {
    x: 0, y: 2.4, w: 10, h: 1.0,
    fontSize: 48, bold: true, color: COLORS.accent,
    align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(`${percentage.toFixed(1)}%`, {
    x: 0, y: 3.4, w: 10, h: 0.5,
    fontSize: 18, color: COLORS.secondary,
    align: 'center', valign: 'middle', fontFace: FONTS.body,
  });

  // pptxgenjs 3.12 运行时支持 doughnut，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('doughnut' as 'pie', [
    { name: '已完成', labels: ['已完成', '未完成'], values: [percentage, 100 - percentage] },
  ], {
    x: 3, y: 4.0, w: 4, h: 1.5,
    chartColors: [COLORS.accent, COLORS.border],
    showValue: false,
    holeSize: 60,
  } as any);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);
  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

interface ChartHeatmapProps {
  title?: string;
  kicker?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[string, string, number]>;
  insight?: ChartInsight;
}

function renderChartHeatmap(slide: PptxSlide, props: ChartHeatmapProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const flat = raw.map((cell) => ({ name: `${cell[0]} / ${cell[1]}`, value: cell[2] }));
  const sorted = flat.sort((a, b) => b.value - a.value).slice(0, 12);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  slide.addChart('bar', [{ name: props.title || '热度', labels, values }], {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

interface ChartInsight {
  value?: string;
  label?: string;
  description?: string;
}

interface ChartFunnelProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  data?: Array<{ name: string; value: number }>;
  insight?: ChartInsight;
  footnote?: string;
}

function renderChartFunnel(slide: PptxSlide, props: ChartFunnelProps): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const insight = props.insight || {};
  const hasInsight = !!insight.value || !!insight.label || !!insight.description;

  if (raw.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = raw.map((d) => d.name);
  const values = raw.map((d) => d.value);
  const chartColors = raw.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // PptxGenJS 没有真正的漏斗图，使用横向柱状图模拟漏斗层级
  slide.addChart('bar', [{ name: props.title || '漏斗', labels, values }], {
    x: 0.6, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: 'FFFFFF', transparency: 40 },
      line: { color: 'E5E7EB', width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.primary,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.75, w: 8.9, h: 0.3,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
    });
  }
}

interface ChartRadarProps {
  title?: string;
  kicker?: string;
  indicators?: Array<{ name: string; max: number }>;
  data?: Array<{ name: string; value: number[] }>;
  insight?: ChartInsight;
}

function renderChartRadar(slide: PptxSlide, props: ChartRadarProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const indicators = props.indicators || [];
  const datasets = props.data || [];

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (indicators.length === 0 || datasets.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = indicators.map((i) => i.name);
  const chartData = datasets.map((d) => ({
    name: d.name,
    labels,
    values: d.value,
  }));
  const chartColors = datasets.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // pptxgenjs 3.12 运行时支持 radar，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('radar' as any, chartData, {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  } as any);

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

interface ChartGraphProps {
  title?: string;
  kicker?: string;
  nodes?: Array<{ name: string; value?: number; category?: number }>;
  links?: Array<{ source: string; target: string; value?: number }>;
  categories?: Array<{ name: string }>;
}

function renderChartGraph(slide: PptxSlide, props: ChartGraphProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const nodes = props.nodes || [];
  if (nodes.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const sorted = [...nodes]
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 12);
  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value ?? 0);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '节点权重', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ChartBar3dProps {
  title?: string;
  kicker?: string;
  labels?: string[];
  data?: number[];
}

function renderChartBar3d(slide: PptxSlide, props: ChartBar3dProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const labels = props.labels || [];
  const data = props.data || [];
  if (labels.length === 0 || data.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const chartColors = data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  slide.addChart('bar', [{ name: props.title || '数值', labels, values: data }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ChartWordcloudProps {
  title?: string;
  kicker?: string;
  words?: Array<{ name: string; value: number }>;
}

function renderChartWordcloud(slide: PptxSlide, props: ChartWordcloudProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const words = props.words || [];
  if (words.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const sorted = [...words].sort((a, b) => b.value - a.value).slice(0, 12);
  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '词频', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ContentV1Props {
  kicker?: string;
  title: string;
  points?: string[];
}

function renderContentV1(slide: PptxSlide, props: ContentV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  addBulletList(slide, props.points || [], 0.8, 2.8, 8.4);
}

interface ContentV2Props {
  kicker?: string;
  title: string;
  leftPoints?: string[];
  rightPoints?: string[];
}

function renderContentV2(slide: PptxSlide, props: ContentV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  slide.addText('左栏', {
    x: 0.8, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  slide.addText('右栏', {
    x: 5.2, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  addBulletList(slide, props.leftPoints || [], 0.8, 2.9, 4.0);
  addBulletList(slide, props.rightPoints || [], 5.2, 2.9, 4.0);
}

interface ComparisonV1Props {
  kicker?: string;
  title: string;
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
}

function renderComparisonV1(slide: PptxSlide, props: ComparisonV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  renderComparisonColumns(slide, props.leftTitle || '方案 A', props.leftPoints || [], props.rightTitle || '方案 B', props.rightPoints || []);
}

function renderComparisonColumns(
  slide: PptxSlide,
  leftTitle: string,
  leftPoints: string[],
  rightTitle: string,
  rightPoints: string[]
): void {
  slide.addText(leftTitle, {
    x: 0.8, y: 2.4, w: 4.0, h: 0.5,
    fontSize: 24, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  slide.addText(rightTitle, {
    x: 5.2, y: 2.4, w: 4.0, h: 0.5,
    fontSize: 24, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  addBulletList(slide, leftPoints, 0.8, 3.0, 4.0);
  addBulletList(slide, rightPoints, 5.2, 3.0, 4.0);
}

interface ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
}

function renderProcessV1(slide: PptxSlide, props: ProcessV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const steps = props.steps || [];
  const count = steps.length;
  if (count === 0) {
    slide.addText('（暂无流程步骤）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const stepWidth = 8.4 / count;
  steps.forEach((step, index) => {
    const x = 0.8 + index * stepWidth;
    slide.addShape('ellipse', {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fontSize: 22, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(step, {
      x: x + 0.1, y: 3.5, w: stepWidth - 0.2, h: 1.2,
      fontSize: 18, color: COLORS.primary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface TimelineV1Props {
  kicker?: string;
  title: string;
  milestones?: { date?: string; title?: string; description?: string }[];
}

function renderTimelineV1(slide: PptxSlide, props: TimelineV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const milestones = (props.milestones || []).slice(0, 4);
  const count = milestones.length || 1;
  const stepWidth = 8.4 / count;
  milestones.forEach((m, index) => {
    const cx = 0.8 + stepWidth * index + stepWidth / 2;
    slide.addShape('ellipse', {
      x: cx - 0.2, y: 3.0, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addShape('line', {
      x1: 0.8 + stepWidth * index, y1: 3.2, x2: 0.8 + stepWidth * (index + 1), y2: 3.2,
      line: { color: COLORS.border, width: 2 },
    });
    slide.addText(m.date || '', {
      x: cx - stepWidth / 2 + 0.1, y: 2.4, w: stepWidth - 0.2, h: 0.4,
      fontSize: 12, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(m.title || '', {
      x: cx - stepWidth / 2 + 0.1, y: 3.6, w: stepWidth - 0.2, h: 0.4,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(m.description || '', {
      x: cx - stepWidth / 2 + 0.1, y: 4.05, w: stepWidth - 0.2, h: 0.8,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface RoadmapV1Props {
  kicker?: string;
  title: string;
  phases?: { title?: string; description?: string; status?: string }[];
}

function renderRoadmapV1(slide: PptxSlide, props: RoadmapV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const phases = (props.phases || []).slice(0, 4);
  let y = 2.1;
  phases.forEach((phase, index) => {
    const statusColor = phase.status === '已完成' ? COLORS.accent : COLORS.secondary;
    slide.addShape('rect', {
      x: 0.8, y, w: 0.2, h: 0.7,
      fill: { color: statusColor },
    });
    slide.addText(`${index + 1}. ${phase.title || ''}`, {
      x: 1.1, y, w: 7.8, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(phase.description || '', {
      x: 1.1, y: y + 0.38, w: 7.8, h: 0.45,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.8;
  });
}

interface QuoteV1Props {
  quote: string;
  author?: string;
  source?: string;
}

function renderQuoteV1(slide: PptxSlide, props: QuoteV1Props): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 2.0, w: 8, h: 2.2,
    fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.source].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 4.4, w: 8, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
}

function renderQuoteV2(slide: PptxSlide, props: QuoteV2Props): void {
  slide.addShape('rect', {
    x: 0.6, y: 1.5, w: 0.15, h: 2.8,
    fill: { color: COLORS.accent },
  });
  slide.addText(`“${props.quote}”`, {
    x: 1.0, y: 1.8, w: 8.0, h: 2.0,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.role].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1.0, y: 4.0, w: 8.0, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface TestimonialV1Props {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
}

function renderTestimonialV1(slide: PptxSlide, props: TestimonialV1Props): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 1.8, w: 8, h: 2.2,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  if (props.avatarUrl) addImageMaybe(slide, props.avatarUrl, 4.5, 4.1, 1, 1);
  const attribution = [props.author, props.role, props.company].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 5.0, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface FaqV1Props {
  kicker?: string;
  title: string;
  items?: { q?: string; a?: string }[];
}

function renderFaqV1(slide: PptxSlide, props: FaqV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.0;
  items.forEach((item) => {
    slide.addText(`Q: ${item.q || ''}`, {
      x: 0.8, y, w: 8.4, h: 0.32,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`A: ${item.a || ''}`, {
      x: 0.8, y: y + 0.37, w: 8.4, h: 0.43,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.85;
  });
}

interface FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
}

function renderFeatureV1(slide: PptxSlide, props: FeatureV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const features = (props.features || []).slice(0, 3);
  const cardWidth = 2.6;
  const gap = 0.3;
  const startX = (10 - (features.length * cardWidth + (features.length - 1) * gap)) / 2;
  features.forEach((feature, index) => {
    const x = startX + index * (cardWidth + gap);
    slide.addShape('rect', {
      x, y: 2.8, w: cardWidth, h: 2.2,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(feature.title || '', {
      x: x + 0.15, y: 3.0, w: cardWidth - 0.3, h: 0.5,
      fontSize: 20, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(feature.description || '', {
      x: x + 0.15, y: 3.6, w: cardWidth - 0.3, h: 1.2,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface FeatureV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: { title?: string; description?: string }[];
  footer?: string;
}

function renderFeatureV2(slide: PptxSlide, props: FeatureV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.6, y: 1.5, w: 8.8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.imageUrl) addImageMaybe(slide, props.imageUrl, 0.6, 2.2, 4.2, 3.0);
  const items = (props.items || []).slice(0, 5);
  items.forEach((item, index) => {
    const y = 2.2 + index * 0.95;
    slide.addShape('rect', {
      x: 5.2, y, w: 4.2, h: 0.85,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(item.title || '', {
      x: 5.35, y: y + 0.08, w: 3.9, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true,
      fontFace: FONTS.heading,
    });
    slide.addText(item.description || '', {
      x: 5.35, y: y + 0.36, w: 3.9, h: 0.4,
      fontSize: 11, color: COLORS.secondary, valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footer) {
    slide.addText(props.footer, {
      x: 0.6, y: 5.4, w: 8.8, h: 0.3,
      fontSize: 11, color: COLORS.secondary,
      fontFace: FONTS.mono,
    });
  }
}

interface TeamV1Props {
  kicker?: string;
  title: string;
  members?: { name?: string; role?: string; bio?: string; imageUrl?: string }[];
}

function renderTeamV1(slide: PptxSlide, props: TeamV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const members = (props.members || []).slice(0, 4);
  const cardWidth = 2.0;
  const gap = 0.4;
  const startX = (10 - (members.length * cardWidth + (members.length - 1) * gap)) / 2;
  members.forEach((member, index) => {
    const x = startX + index * (cardWidth + gap);
    if (member.imageUrl) addImageMaybe(slide, member.imageUrl, x + 0.5, 2.7, 1, 1);
    slide.addText(member.name || '', {
      x, y: 3.85, w: cardWidth, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role || '', {
      x, y: 4.2, w: cardWidth, h: 0.3,
      fontSize: 12, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    slide.addText(member.bio || '', {
      x, y: 4.55, w: cardWidth, h: 0.55,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface PartnersV1Props {
  kicker?: string;
  title: string;
  partners?: { name?: string; logoUrl?: string }[];
}

function renderPartnersV1(slide: PptxSlide, props: PartnersV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const partners = (props.partners || []).slice(0, 8);
  const cols = 4;
  const cellW = 2.0;
  const cellH = 1.1;
  const gapX = 0.4;
  const gapY = 0.3;
  const startX = (10 - (cols * cellW + (cols - 1) * gapX)) / 2;
  partners.forEach((partner, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (cellW + gapX);
    const y = 2.5 + row * (cellH + gapY);
    slide.addShape('rect', {
      x, y, w: cellW, h: cellH,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    if (partner.logoUrl) addImageMaybe(slide, partner.logoUrl, x + 0.25, y + 0.15, cellW - 0.5, cellH - 0.5);
    slide.addText(partner.name || '', {
      x, y: y + cellH - 0.25, w: cellW, h: 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  });
}

interface PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: { name?: string; price?: string; period?: string; features?: string[]; cta?: string }[];
}

function renderPricingV1(slide: PptxSlide, props: PricingV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const tiers = (props.tiers || []).slice(0, 3);
  const cardWidth = 2.5;
  const gap = 0.35;
  const startX = (10 - (tiers.length * cardWidth + (tiers.length - 1) * gap)) / 2;
  tiers.forEach((tier, index) => {
    const x = startX + index * (cardWidth + gap);
    const isHighlight = index === 1;
    slide.addShape('rect', {
      x, y: 2.6, w: cardWidth, h: 2.6,
      fill: { color: isHighlight ? COLORS.accent : COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(tier.name || '', {
      x, y: 2.8, w: cardWidth, h: 0.4,
      fontSize: 18, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
      x, y: 3.25, w: cardWidth, h: 0.5,
      fontSize: 24, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    const features = (tier.features || []).slice(0, 3);
    let fy = 3.85;
    features.forEach((feature) => {
      slide.addText(feature, {
        x: x + 0.15, y: fy, w: cardWidth - 0.3, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.white : COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
      fy += 0.35;
    });
    if (tier.cta) {
      slide.addText(tier.cta, {
        x: x + 0.3, y: 4.8, w: cardWidth - 0.6, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.accent : COLORS.white,
        fill: isHighlight ? { color: COLORS.white } : { color: COLORS.accent },
        align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

interface ImageV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

function renderImageV1(slide: PptxSlide, props: ImageV1Props): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: '000000', transparency: 40 },
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.4, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.white, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.5, w: 7, h: 0.7,
      fontSize: 22, color: COLORS.white, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

interface SwotV1Props {
  title: string;
  kicker?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
}

function renderSwotV1(slide: PptxSlide, props: SwotV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '优势 Strengths', text: props.strength || '' },
    { title: '劣势 Weaknesses', text: props.weakness || '' },
    { title: '机会 Opportunities', text: props.opportunity || '' },
    { title: '威胁 Threats', text: props.threat || '' },
  ]);
}

interface PestV1Props {
  title: string;
  kicker?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
}

function renderPestV1(slide: PptxSlide, props: PestV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '政治 Political', text: props.political || '' },
    { title: '经济 Economic', text: props.economic || '' },
    { title: '社会 Social', text: props.social || '' },
    { title: '技术 Technological', text: props.technological || '' },
  ]);
}

function render2x2Grid(slide: PptxSlide, cells: { title: string; text: string }[]): void {
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.1 },
    { x: 5.2, y: 4.1 },
  ];
  cells.forEach((cell, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.4,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(cell.title, {
      x: pos.x + 0.15, y: pos.y + 0.1, w: 3.7, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(cell.text, {
      x: pos.x + 0.15, y: pos.y + 0.5, w: 3.7, h: 0.8,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface ClosingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  email?: string;
  link?: string;
}

function renderClosing(slide: PptxSlide, props: ClosingProps): void {
  let y = 2.2;
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    y += 0.5;
  }
  slide.addText(props.title, {
    x: 1, y, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  y += 1.1;
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y, w: 7, h: 0.6,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
    y += 0.9;
  }
  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.5, y, w: 3, h: 0.6,
      fill: { color: COLORS.accent },
      rectRadius: 0.3,
    });
    slide.addText(props.cta, {
      x: 3.5, y, w: 3, h: 0.6,
      fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    y += 0.9;
  }
  const lines = [props.contact, props.email, props.link].filter(Boolean) as string[];
  lines.forEach((line) => {
    slide.addText(line, {
      x: 1, y, w: 8, h: 0.35,
      fontSize: 16, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    y += 0.45;
  });
}

interface TeamV2Props {
  title?: string;
  kicker?: string;
  members?: { name?: string; role?: string; bio?: string; avatar?: string }[];
  [key: string]: unknown;
}

function renderTeamV2(slide: PptxSlide, props: TeamV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Team');
  const members = props.members ?? [];
  const maxMembers = 4;
  const cardW = 2.05;
  const gap = 0.3;
  const startX = 0.6;
  const y = 2.4;
  const h = 3.2;
  members.slice(0, maxMembers).forEach((member, index) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.35, y: y + 0.25, w: 0.7, h: 0.7,
      fill: { color: COLORS.border },
    });
    slide.addText(member.name ?? `Member ${index + 1}`, {
      x: x + 0.15, y: y + 1.05, w: cardW - 0.3, h: 0.35,
      fontSize: 17, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role ?? '', {
      x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.3,
      fontSize: 13, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(member.bio ?? '', {
      x: x + 0.15, y: y + 1.85, w: cardW - 0.3, h: 1.25,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface QuoteV3Props {
  quote: string;
  author?: string;
  role?: string;
  source?: string;
}

function renderQuoteV3(slide: PptxSlide, props: QuoteV3Props): void {
  slide.addText('"', {
    x: 0.8, y: 1.0, w: 1.5, h: 1.5,
    fontSize: 120, color: COLORS.accent, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  slide.addText(props.quote, {
    x: 2.0, y: 1.6, w: 7.2, h: 2.6,
    fontSize: 28, color: COLORS.primary, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  const meta = [props.author, props.role].filter(Boolean).join(' · ');
  if (meta) {
    slide.addText(meta, {
      x: 2.0, y: 4.4, w: 7.2, h: 0.4,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.body,
    });
  }
  if (props.source) {
    slide.addText(props.source, {
      x: 2.0, y: 4.85, w: 7.2, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}


interface ComparisonRow {
  feature?: string;
  left?: string;
  right?: string;
}

interface ComparisonV3Props {
  title?: string;
  kicker?: string;
  leftTitle?: string;
  rightTitle?: string;
  rows?: ComparisonRow[];
  [key: string]: unknown;
}

function renderComparisonV3(slide: PptxSlide, props: ComparisonV3Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'ComparisonV3');

  const rows = (props.rows ?? []).slice(0, 3);
  const startY = 2.5;
  const rowH = 0.75;
  const col1W = 3.2;
  const col2W = 2.8;
  const col3W = 2.8;
  const gap = 0.1;
  const startX = 0.8;

  slide.addShape('rect', {
    x: startX, y: startY, w: col1W, h: 0.5,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addShape('rect', {
    x: startX + col1W + gap, y: startY, w: col2W, h: 0.5,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent, width: 1 },
  });
  slide.addShape('rect', {
    x: startX + col1W + gap + col2W + gap, y: startY, w: col3W, h: 0.5,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  });

  slide.addText('维度', {
    x: startX, y: startY, w: col1W, h: 0.5,
    fontSize: 12, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.body,
  });
  slide.addText(props.leftTitle ?? '方案 A', {
    x: startX + col1W + gap, y: startY, w: col2W, h: 0.5,
    fontSize: 12, color: '#ffffff', bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(props.rightTitle ?? '方案 B', {
    x: startX + col1W + gap + col2W + gap, y: startY, w: col3W, h: 0.5,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  rows.forEach((row, index) => {
    const y = startY + 0.6 + index * rowH;
    const bg = index % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;

    slide.addShape('rect', {
      x: startX, y, w: col1W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addShape('rect', {
      x: startX + col1W + gap, y, w: col2W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addShape('rect', {
      x: startX + col1W + gap + col2W + gap, y, w: col3W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });

    slide.addText(row.feature ?? '', {
      x: startX + 0.15, y, w: col1W - 0.3, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText(row.left ?? '', {
      x: startX + col1W + gap + 0.1, y, w: col2W - 0.2, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText(row.right ?? '', {
      x: startX + col1W + gap + col2W + gap + 0.1, y, w: col3W - 0.2, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
  });
}


// ---- Theme01 P3 special layout renderers ----------------------------------

interface Theme01BentoV1Props {
  kicker?: string;
  title?: string;
  items?: { title?: string; description?: string; span?: 'small' | 'medium' | 'large'; imageUrl?: string }[];
}

function renderTheme01BentoV1(slide: PptxSlide, props: Theme01BentoV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Bento');
  const items = (props.items || []).slice(0, 4);
  if (items.length === 0) {
    slide.addText('（暂无 Bento 内容）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const positions = [
    { x: 0.8, y: 2.4, w: 4.0, h: 2.8 },
    { x: 5.2, y: 2.4, w: 4.0, h: 1.3 },
    { x: 5.2, y: 3.9, w: 1.9, h: 1.3 },
    { x: 7.3, y: 3.9, w: 1.9, h: 1.3 },
  ];

  items.forEach((item, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    });
    if (item.imageUrl) addImageMaybe(slide, item.imageUrl, pos.x + 0.08, pos.y + 0.08, pos.w - 0.16, pos.h * 0.45);
    slide.addText(item.title || '', {
      x: pos.x + 0.15, y: pos.y + pos.h * 0.55, w: pos.w - 0.3, h: 0.45,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(item.description || '', {
      x: pos.x + 0.15, y: pos.y + pos.h * 0.55 + 0.45, w: pos.w - 0.3, h: 0.6,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface Theme01GalleryV1Props {
  kicker?: string;
  title?: string;
  images?: { url?: string; caption?: string }[];
}

function renderTheme01GalleryV1(slide: PptxSlide, props: Theme01GalleryV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Gallery');
  const images = (props.images || []).slice(0, 4);
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.0 },
    { x: 5.2, y: 4.0 },
  ];
  images.forEach((image, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, pos.x + 0.08, pos.y + 0.08, 3.84, 0.9);
    if (image.caption) {
      slide.addText(image.caption, {
        x: pos.x, y: pos.y + 1.05, w: 4.0, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
    }
  });
}

interface Theme01TableV1Props {
  kicker?: string;
  title?: string;
  headers?: string[];
  rows?: string[][];
  highlightFirstColumn?: boolean;
}

function renderTheme01TableV1(slide: PptxSlide, props: Theme01TableV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Table');
  const headers = props.headers || [];
  const rows = (props.rows || []).slice(0, 6);
  if (rows.length === 0) {
    slide.addText('（暂无表格数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const colCount = Math.max(headers.length, rows[0]?.length || 1);
  const tableW = 8.4;
  const startX = 0.8;
  const startY = 2.5;
  const rowH = 0.45;
  const colW = tableW / colCount;

  // Header
  headers.forEach((header, index) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(header, {
      x, y: startY, w: colW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  });

  // Rows
  rows.forEach((row, rowIndex) => {
    const y = startY + rowH * (rowIndex + 1);
    const bg = rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;
    row.forEach((cell, colIndex) => {
      const x = startX + colIndex * colW;
      slide.addShape('rect', {
        x, y, w: colW, h: rowH,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(cell ?? '', {
        x: x + 0.06, y, w: colW - 0.12, h: rowH,
        fontSize: 11, color: props.highlightFirstColumn && colIndex === 0 ? COLORS.primary : COLORS.secondary,
        bold: props.highlightFirstColumn && colIndex === 0,
        align: colIndex === 0 ? 'left' : 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    });
  });
}

interface Theme01TagsV1Props {
  kicker?: string;
  title?: string;
  tags?: { label?: string; value?: number; tone?: 'neutral' | 'positive' | 'negative' | 'accent' }[];
}

function renderTheme01TagsV1(slide: PptxSlide, props: Theme01TagsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Tags');
  const tags = (props.tags || []).slice(0, 18);
  if (tags.length === 0) {
    slide.addText('（暂无标签）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const toneColors: Record<string, { text: string; bg: string }> = {
    positive: { text: '10B981', bg: 'D1FAE5' },
    negative: { text: 'EF4444', bg: 'FEE2E2' },
    accent: { text: COLORS.accent, bg: 'DBEAFE' },
  };

  let x = 0.8;
  let y = 2.5;
  const maxW = 8.4;
  const gap = 0.15;
  const tagH = 0.42;

  tags.forEach((tag) => {
    const label = tag.label ?? '';
    const valueText = tag.value !== undefined && tag.value > 0 ? ` ${tag.value}` : '';
    const text = `${label}${valueText}`;
    const textW = Math.min(Math.max(text.length * 0.09 + 0.3, 0.7), 2.2);
    const tone = toneColors[tag.tone ?? ''] ?? { text: COLORS.secondary, bg: COLORS.surfaceElevated };
    const color = tone.text;
    const bgColor = tone.bg;

    if (x + textW > 0.8 + maxW) {
      x = 0.8;
      y += tagH + gap;
    }

    slide.addShape('roundRect', {
      x, y, w: textW, h: tagH,
      fill: { color: bgColor },
      line: { color: tag.tone ? color : COLORS.border, width: 1 },
      rectRadius: 0.21,
    });
    slide.addText(text, {
      x, y, w: textW, h: tagH,
      fontSize: 11, color, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    x += textW + gap;
  });
}

interface Theme01FilmstripV1Props {
  kicker?: string;
  title?: string;
  images?: { url?: string; caption?: string }[];
}

function renderTheme01FilmstripV1(slide: PptxSlide, props: Theme01FilmstripV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Filmstrip');
  const images = (props.images || []).slice(0, 5);
  if (images.length === 0) {
    slide.addText('（暂无影像）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const gap = 0.2;
  const frameW = (8.4 - gap * (images.length - 1)) / images.length;
  const startX = 0.8;
  const y = 2.5;
  const imgH = 2.2;

  images.forEach((image, index) => {
    const x = startX + index * (frameW + gap);
    slide.addShape('rect', {
      x, y, w: frameW, h: imgH + 0.5,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, x + 0.06, y + 0.06, frameW - 0.12, imgH);
    if (image.caption) {
      slide.addText(image.caption, {
        x, y: y + imgH + 0.08, w: frameW, h: 0.35,
        fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

// ---- Theme01 P0/P1 变体适配渲染器 -----------------------------------------

interface Theme01ContentV3Props {
  kicker?: string;
  title?: string;
  columns?: { title?: string; text?: string }[];
}

function renderTheme01ContentV3(slide: PptxSlide, props: Theme01ContentV3Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '内容');
  const columns = (props.columns || []).slice(0, 3);
  const count = columns.length || 1;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.5;
  const h = 3.0;

  columns.forEach((column, index) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(column.title || '', {
      x: x + 0.16, y: y + 0.2, w: cardW - 0.32, h: 0.45,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(column.text || '', {
      x: x + 0.16, y: y + 0.75, w: cardW - 0.32, h: 1.9,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface Theme01MetricV2Props {
  kicker?: string;
  title?: string;
  metrics?: { value?: string; unit?: string; label?: string }[];
}

function renderTheme01MetricV2(slide: PptxSlide, props: Theme01MetricV2Props): void {
  const stats = (props.metrics || []).map((m) => ({
    label: m.label || '',
    value: m.value || '0',
    unit: m.unit || '',
  }));
  renderStatsV1(slide, { kicker: props.kicker, title: props.title ?? '关键指标', stats });
}

interface Theme01ComparisonV2Props {
  kicker?: string;
  title?: string;
  cards?: { label?: string; score?: number; max?: number; note?: string }[];
}

function renderTheme01ComparisonV2(slide: PptxSlide, props: Theme01ComparisonV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '评分对比');
  const cards = (props.cards || []).slice(0, 4);
  const count = cards.length || 1;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.5;
  const h = 3.0;

  cards.forEach((card, index) => {
    const score = typeof card.score === 'number' ? card.score : 0;
    const max = typeof card.max === 'number' && card.max > 0 ? card.max : 100;
    const pct = Math.min(100, Math.max(0, (score / max) * 100));
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(card.label || '', {
      x: x + 0.16, y: y + 0.2, w: cardW - 0.32, h: 0.45,
      fontSize: 17, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${score} / ${max}`, {
      x: x + 0.16, y: y + 0.75, w: cardW - 0.32, h: 0.4,
      fontSize: 22, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addShape('rect', {
      x: x + 0.16, y: y + 1.25, w: cardW - 0.32, h: 0.12,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: x + 0.16, y: y + 1.25, w: (cardW - 0.32) * (pct / 100), h: 0.12,
      fill: { color: COLORS.accent },
    });
    if (card.note) {
      slide.addText(card.note, {
        x: x + 0.16, y: y + 1.55, w: cardW - 0.32, h: 1.15,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });
}

interface Theme01ConclusionV1Props {
  title?: string;
  subtitle?: string;
  points?: string[];
}

function renderTheme01ConclusionV1(slide: PptxSlide, props: Theme01ConclusionV1Props): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left', fontFace: FONTS.mono,
    });
  }
  addTitle(slide, props.title ?? '结论', 0.8, 1.25);
  const points = (props.points || []).slice(0, 4);
  if (points.length === 0) return;

  const count = points.length;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.6;
  const h = 2.6;

  points.forEach((point, index) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(String(index + 1), {
      x: x + 0.16, y: y + 0.16, w: 0.6, h: 0.5,
      fontSize: 28, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(point, {
      x: x + 0.16, y: y + 0.85, w: cardW - 0.32, h: 1.55,
      fontSize: 16, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface Theme01AppendixV1Props {
  title?: string;
  subtitle?: string;
  sources?: { label?: string; value?: string }[];
}

function renderTheme01AppendixV1(slide: PptxSlide, props: Theme01AppendixV1Props): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left', fontFace: FONTS.mono,
    });
  }
  addTitle(slide, props.title ?? '附录 / 数据来源', 0.8, 1.25);
  const sources = (props.sources || []).slice(0, 8);
  if (sources.length === 0) return;

  let cy = 2.4;
  for (const source of sources) {
    const label = source.label ? `[${source.label}] ` : '';
    slide.addText(`${label}${source.value || ''}`, {
      x: 0.8, y: cy, w: 8.4, h: 0.55,
      fontSize: 15, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cy += 0.65;
  }
}

interface Theme01ScorecardV1Props {
  kicker?: string;
  title?: string;
  items?: { label?: string; score?: number; max?: number; note?: string }[];
}

function renderTheme01ScorecardV1(slide: PptxSlide, props: Theme01ScorecardV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '评分卡');
  const items = (props.items || []).slice(0, 5);
  if (items.length === 0) return;

  const startY = 2.3;
  const rowH = 0.65;
  const barH = 0.12;
  const maxW = 8.4;

  items.forEach((item, index) => {
    const y = startY + index * rowH;
    const score = typeof item.score === 'number' ? item.score : 0;
    const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
    const pct = Math.min(100, Math.max(0, (score / max) * 100));

    slide.addText(item.label || '', {
      x: 0.8, y, w: 4.5, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${score} / ${max}`, {
      x: 5.4, y, w: 1.8, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.4, w: maxW, h: barH,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.4, w: maxW * (pct / 100), h: barH,
      fill: { color: COLORS.accent },
    });
  });
}

interface Theme01ChapterV3Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

function renderTheme01ChapterV3(slide: PptxSlide, props: Theme01ChapterV3Props): void {
  addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '000000', transparency: 40 },
  });

  const titleH = 0.9;
  const subtitleH = props.subtitle ? 0.45 : 0;
  const cardH = 0.9 + titleH + subtitleH + 0.7;
  const cardY = (5.625 - cardH) / 2;

  slide.addShape('rect', {
    x: 1.5, y: cardY, w: 7, h: cardH,
    fill: { color: 'FFFFFF', transparency: 15 },
    line: { color: 'FFFFFF', width: 1 },
    rectRadius: 0.15,
  });

  let cy = cardY + 0.35;
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1.75, y: cy, w: 6.5, h: 0.35,
      fontSize: 13, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    cy += 0.45;
  }
  slide.addText(props.title, {
    x: 1.75, y: cy, w: 6.5, h: titleH,
    fontSize: 40, color: COLORS.white, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  cy += titleH + 0.1;
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.75, y: cy, w: 6.5, h: subtitleH,
      fontSize: 18, color: COLORS.white, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

interface Theme01TrendV1Props {
  kicker?: string;
  title?: string;
  series?: { name?: string; data?: { label?: string; value?: number }[] }[];
}

function renderTheme01TrendV1(slide: PptxSlide, props: Theme01TrendV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '趋势');
  const series = (props.series || []).slice(0, 4);
  const allLabels = Array.from(
    new Set(series.flatMap((s) => (s.data || []).map((p) => p.label || '')))
  ).filter(Boolean);

  if (allLabels.length === 0 || series.length === 0) {
    slide.addText('（暂无趋势数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const chartData = series.map((s) => ({
    name: s.name || '系列',
    labels: allLabels,
    values: allLabels.map((label) => {
      const point = (s.data || []).find((p) => p.label === label);
      return typeof point?.value === 'number' ? point.value : 0;
    }),
  }));

  slide.addChart('line' as 'line', chartData, {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors: CHART_COLORS,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface Theme01RankingV1Props {
  kicker?: string;
  title?: string;
  items?: { label?: string; value?: number }[];
  unit?: string;
}

function renderTheme01RankingV1(slide: PptxSlide, props: Theme01RankingV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '排名');
  const items = (props.items || [])
    .filter((item) => typeof item.value === 'number')
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 8);

  if (items.length === 0) {
    slide.addText('（暂无排名数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = items.map((item) => item.label || '');
  const values = items.map((item) => item.value ?? 0);
  const chartColors = items.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数值', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 11,
  });
}

interface Theme01GanttV1Props {
  kicker?: string;
  title?: string;
  phases?: string[];
  tasks?: { name?: string; start?: number; end?: number; color?: string }[];
}

function renderTheme01GanttV1(slide: PptxSlide, props: Theme01GanttV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '甘特排期');
  const tasks = (props.tasks || []).slice(0, 8);
  const phases = (props.phases?.length ? props.phases : ['Q1', 'Q2', 'Q3', 'Q4']).slice(0, 6);
  const chartColors = ['2563EB', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899', '06B6D4', '84CC16'];

  if (tasks.length === 0) {
    slide.addText('（暂无排期数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const endX = 9.2;
  const totalW = endX - startX;
  const headerY = 2.3;
  const bodyY = 2.85;
  const rowH = 0.42;
  const phaseW = totalW / phases.length;

  // phase header
  phases.forEach((phase, i) => {
    const x = startX + i * phaseW;
    slide.addText(phase, {
      x, y: headerY, w: phaseW, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
    if (i > 0) {
      slide.addShape('line', {
        x1: x, y1: headerY, x2: x, y2: bodyY + tasks.length * rowH,
        line: { color: COLORS.border, width: 1 },
      });
    }
  });

  // tasks
  tasks.forEach((task, index) => {
    const y = bodyY + index * rowH;
    const start = Math.max(0, Math.min(100, task.start ?? 0));
    const end = Math.max(start, Math.min(100, task.end ?? 100));
    const barX = startX + (start / 100) * totalW;
    const barW = ((end - start) / 100) * totalW;
    const color = task.color ? task.color.replace('#', '') : chartColors[index % chartColors.length];

    slide.addText(task.name || '', {
      x: 0.8, y, w: 2.0, h: rowH,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addShape('rect', {
      x: barX, y: y + 0.08, w: Math.max(0.05, barW), h: 0.26,
      fill: { color },
      rectRadius: 0.05,
    });
  });
}

interface Theme01QuadrantV1Props {
  kicker?: string;
  title?: string;
  xAxis?: string;
  yAxis?: string;
  quadrants?: { label?: string; items?: string[] }[];
}

function renderTheme01QuadrantV1(slide: PptxSlide, props: Theme01QuadrantV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '四象限分析');
  const quadrants = (props.quadrants || []).slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const colors = ['2563EB', '10B981', 'F59E0B', 'EF4444'];

  if (quadrants.length === 0) {
    slide.addText('（暂无四象限数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.4;
  const gap = 0.2;
  const cardW = (8.4 - gap) / 2;
  const cardH = (2.8 - gap) / 2;

  quadrants.forEach((q, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    const color = colors[index % colors.length];

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addShape('rect', {
      x, y, w: cardW, h: 0.08,
      fill: { color },
      rectRadius: 0.1,
    });
    slide.addText(q.label || defaultLabels[index] || '', {
      x: x + 0.14, y: y + 0.2, w: cardW - 0.28, h: 0.4,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    const items = (q.items || []).slice(0, 4);
    if (items.length > 0) {
      slide.addText(items.join('\n'), {
        x: x + 0.14, y: y + 0.65, w: cardW - 0.28, h: cardH - 0.8,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });

  if (props.xAxis) {
    slide.addText(props.xAxis, {
      x: startX, y: 5.35, w: 8.4, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
  }
  if (props.yAxis) {
    slide.addText(props.yAxis, {
      x: 0.2, y: startY + 1.25, w: 0.4, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01RiskV1Props {
  kicker?: string;
  title?: string;
  items?: { risk?: string; impact?: string; response?: string }[];
}

function renderTheme01RiskV1(slide: PptxSlide, props: Theme01RiskV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '风险研判');
  const items = (props.items || []).slice(0, 4);

  if (items.length === 0) {
    slide.addText('（暂无风险数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.35;
  const gap = 0.22;
  const cardW = (8.4 - gap) / 2;
  const cardH = (2.8 - gap) / 2;

  items.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(String(index + 1).padStart(2, '0'), {
      x: x + cardW - 0.55, y: y + 0.12, w: 0.45, h: 0.35,
      fontSize: 14, color: COLORS.accent, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item.risk || '', {
      x: x + 0.14, y: y + 0.12, w: cardW - 0.7, h: 0.45,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`影响：${item.impact || ''}`, {
      x: x + 0.14, y: y + 0.62, w: cardW - 0.28, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`应对：${item.response || ''}`, {
      x: x + 0.14, y: y + 1.0, w: cardW - 0.28, h: cardH - 1.15,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface Theme01OutlookV1Props {
  kicker?: string;
  title?: string;
  items?: { title?: string; trend?: string; action?: string }[];
}

function renderTheme01OutlookV1(slide: PptxSlide, props: Theme01OutlookV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '投资展望');
  const items = (props.items || []).slice(0, 3);

  if (items.length === 0) {
    slide.addText('（暂无展望数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const y = 2.35;
  const gap = 0.2;
  const cardW = (8.4 - gap * (items.length - 1)) / items.length;
  const cardH = 2.8;

  items.forEach((item, index) => {
    const x = startX + index * (cardW + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.2, y: y + 0.18, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + cardW / 2 - 0.2, y: y + 0.18, w: 0.4, h: 0.4,
      fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.title || '', {
      x: x + 0.14, y: y + 0.72, w: cardW - 0.28, h: 0.45,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`趋势：${item.trend || ''}`, {
      x: x + 0.14, y: y + 1.25, w: cardW - 0.28, h: 0.55,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`行动：${item.action || ''}`, {
      x: x + 0.14, y: y + 1.85, w: cardW - 0.28, h: cardH - 2.05,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface Theme01RegionV1Props {
  kicker?: string;
  title?: string;
  regions?: { name?: string; value?: string; change?: string; note?: string }[];
}

function renderTheme01RegionV1(slide: PptxSlide, props: Theme01RegionV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '地区/市场分布');
  const regions = (props.regions || []).slice(0, 6);

  if (regions.length === 0) {
    slide.addText('（暂无地区数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.35;
  const gap = 0.2;
  const cols = regions.length <= 4 ? 3 : 3;
  const rows = Math.ceil(regions.length / cols);
  const cardW = (8.4 - gap * (cols - 1)) / cols;
  const cardH = (2.8 - gap * (rows - 1)) / rows;

  regions.forEach((region, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(region.name || '', {
      x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(region.value || '', {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.55,
      fontSize: 24, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (region.change) {
      slide.addText(region.change, {
        x: x + 0.12, y: y + 1.05, w: cardW - 0.24, h: 0.3,
        fontSize: 12, color: COLORS.accent, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
    if (region.note) {
      slide.addText(region.note, {
        x: x + 0.12, y: y + 1.4, w: cardW - 0.24, h: cardH - 1.55,
        fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });
}

interface Theme01RoadmapV1Props {
  kicker?: string;
  title?: string;
  phases?: { phase?: string; items?: string[] }[];
}

function renderTheme01RoadmapV1(slide: PptxSlide, props: Theme01RoadmapV1Props): void {
  const phases = (props.phases || []).map((p) => ({
    title: p.phase || '',
    description: (p.items || []).join('\n'),
  }));
  renderRoadmapV1(slide, { kicker: props.kicker, title: props.title ?? '路线图', phases });
}

interface Theme01TeamV2Props {
  kicker?: string;
  title?: string;
  members?: { name?: string; role?: string; bio?: string; imageUrl?: string }[];
}

function renderTheme01TeamV2(slide: PptxSlide, props: Theme01TeamV2Props): void {
  const members = (props.members || []).map((m) => ({ ...m, avatar: m.imageUrl }));
  renderTeamV2(slide, { kicker: props.kicker, title: props.title ?? '团队', members });
}

interface Theme01TimelineV1Props {
  kicker?: string;
  title?: string;
  events?: { date?: string; title?: string; description?: string }[];
}

function renderTheme01TimelineV1(slide: PptxSlide, props: Theme01TimelineV1Props): void {
  const milestones = props.events || [];
  renderTimelineV1(slide, { kicker: props.kicker, title: props.title ?? '时间轴', milestones });
}

// ---- Theme01 recently added layout renderers -------------------------------

interface Theme01MetricBigProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  unit?: string;
  context?: string;
  metrics?: { value?: string; label?: string; accent?: boolean }[];
  footnote?: string;
  showInsight?: boolean;
  insight?: SimpleInsight;
}

function renderTheme01MetricBig(slide: PptxSlide, props: Theme01MetricBigProps): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const mainX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '核心指标', mainX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: mainX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const valueText = [props.value, props.unit].filter(Boolean).join(' ') || '0';
  slide.addText(valueText, {
    x: mainX, y: 2.7, w: mainW, h: 1.2,
    fontSize: hasInsight ? 60 : 72, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  if (props.context) {
    slide.addText(props.context, {
      x: mainX + (hasInsight ? 0.7 : 0.7), y: 4.0, w: hasInsight ? mainW - 1.4 : 7.0, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).filter((m) => m != null && (m.value || m.label)).slice(0, 4);
  if (metrics.length > 0) {
    const count = metrics.length;
    const gap = 0.25;
    const cardW = (mainW - gap * (count - 1)) / count;
    const startX = mainX;
    const y = 4.85;
    const h = 0.65;

    metrics.forEach((metric, index) => {
      const x = startX + index * (cardW + gap);
      const bg = metric.accent ? COLORS.accent : COLORS.surfaceElevated;
      const textColor = metric.accent ? COLORS.white : COLORS.primary;
      slide.addShape('rect', {
        x, y, w: cardW, h,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      });
      slide.addText(metric.value || '', {
        x: x + 0.1, y: y + 0.08, w: cardW - 0.2, h: 0.32,
        fontSize: 18, color: textColor, bold: true, align: 'center', valign: 'top',
        fontFace: FONTS.heading,
      });
      slide.addText(metric.label || '', {
        x: x + 0.1, y: y + 0.36, w: cardW - 0.2, h: 0.24,
        fontSize: 11, color: metric.accent ? COLORS.white : COLORS.secondary, align: 'center', valign: 'top',
        fontFace: FONTS.body,
      });
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: mainX, y: 5.7, w: mainW, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface Theme01ChartDonutSegment {
  label?: string;
  labelEn?: string;
  value?: string;
  percent?: string;
  color?: string;
}

interface Theme01ChartDonutProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  total?: { value?: string; label?: string };
  segments?: Theme01ChartDonutSegment[];
  insight?: ChartInsight;
  footnote?: string;
}

function renderTheme01ChartDonut(slide: PptxSlide, props: Theme01ChartDonutProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '环形图');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const rawSegments = (props.segments || [])
    .filter((s) => s != null && !!(s.label || s.value))
    .map((s) => ({ ...s }))
    .sort((a, b) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  if (rawSegments.length === 0) {
    slide.addText('（暂无环形图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const totalValue = rawSegments.reduce((sum, s) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  const segments = rawSegments.map((s, i) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return {
      ...s,
      percent: s.percent || `${pct}%`,
      numericValue: n,
      color: s.color || `var(--lp-${['blue', 'green', 'amber', 'red', 'violet'][i % 5]})`,
    };
  });

  const labels = segments.map((s) => s.label || '');
  const values = segments.map((s) => s.numericValue);
  const chartColors = segments.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 4.2 : 4.8;
  slide.addChart('doughnut' as 'pie', [
    { name: props.title || '', labels, values },
  ], {
    x: 0.6, y: 2.4, w: chartW, h: 3.0,
    chartColors,
    showValue: false,
    holeSize: 60,
  } as any);

  const total = props.total || { value: String(totalValue), label: '合计' };
  const centerX = 0.6 + chartW / 2;
  slide.addText(total.value || String(totalValue), {
    x: centerX - 1.8, y: 3.4, w: 3.6, h: 0.6,
    fontSize: 28, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(total.label || '合计', {
    x: centerX - 1.8, y: 4.0, w: 3.6, h: 0.3,
    fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.body,
  });

  // 右侧图例列表
  const legendX = hasInsight ? 5.0 : 5.7;
  const legendW = hasInsight ? 2.6 : 3.3;
  let legendY = 2.5;
  segments.forEach((segment, index) => {
    const color = chartColors[index % chartColors.length];
    slide.addShape('ellipse', {
      x: legendX, y: legendY + 0.08, w: 0.18, h: 0.18,
      fill: { color },
    });
    slide.addText(segment.label || '', {
      x: legendX + 0.3, y: legendY, w: legendW - 1.4, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (segment.labelEn) {
      slide.addText(segment.labelEn, {
        x: legendX + 0.3, y: legendY + 0.26, w: legendW - 1.4, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
    slide.addText(segment.percent || '', {
      x: legendX + legendW - 1.0, y: legendY, w: 0.9, h: 0.28,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(segment.value || '', {
      x: legendX + legendW - 1.0, y: legendY + 0.26, w: 0.9, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    legendY += segment.labelEn ? 0.65 : 0.5;
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 8.0, y: 2.3, w: 2.4, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 8.2, y: cursorY, w: 2.0, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.7, w: 8.8, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01TableDataProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  columns?: { key?: string; label?: string; align?: 'left' | 'right' | 'center' }[];
  rows?: Record<string, string>[];
  highlightRow?: number;
  highlightRows?: number[];
  footnote?: string;
}

function renderTheme01TableData(slide: PptxSlide, props: Theme01TableDataProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '数据表格');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const columns = (props.columns || []).filter((c) => c.key && c.label);
  const rows = (props.rows || []).filter((r) => r != null).slice(0, 12);
  const effectiveHighlightRow = props.highlightRow ?? (Array.isArray(props.highlightRows) && props.highlightRows.length ? props.highlightRows[0] : undefined);

  if (columns.length === 0 || rows.length === 0) {
    slide.addText('（暂无表格数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const tableW = 8.4;
  const startX = 0.8;
  const startY = 2.55;
  const rowH = 0.42;
  const colW = tableW / columns.length;

  columns.forEach((column, index) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(column.label || '', {
      x, y: startY, w: colW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, align: column.align || 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  });

  rows.forEach((row, rowIndex) => {
    const y = startY + rowH * (rowIndex + 1);
    const isHighlight = effectiveHighlightRow === rowIndex;
    const bg = isHighlight ? 'DBEAFE' : (rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated);
    columns.forEach((column, colIndex) => {
      const x = startX + colIndex * colW;
      slide.addShape('rect', {
        x, y, w: colW, h: rowH,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(row[column.key || ''] ?? '', {
        x: x + 0.06, y, w: colW - 0.12, h: rowH,
        fontSize: 11, color: isHighlight ? COLORS.accent : COLORS.primary,
        bold: isHighlight,
        align: column.align || 'left', valign: 'middle',
        fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.75, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01CaseStudyProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  intro?: string;
  rounds?: { date?: string; round?: string; valuation?: string; amount?: string }[];
  quote?: string;
  quoteAuthor?: string;
  footnote?: string;
}

function renderTheme01CaseStudy(slide: PptxSlide, props: Theme01CaseStudyProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '案例');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  if (props.intro) {
    slide.addText(props.intro, {
      x: 0.8, y: 2.45, w: 8.4, h: 0.6,
      fontSize: 14, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const rounds = (props.rounds || [])
    .filter((r) => r != null && (r.date || r.round || r.amount))
    .slice(0, 6);

  if (rounds.length > 0) {
    const startY = props.intro ? 3.2 : 2.55;
    const rowH = 0.55;
    const colW = 8.4 / 4;
    const startX = 0.8;

    const headers = ['日期', '轮次', '估值', '金额'];
    headers.forEach((header, index) => {
      const x = startX + index * colW;
      slide.addShape('rect', {
        x, y: startY, w: colW, h: 0.35,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(header, {
        x, y: startY, w: colW, h: 0.35,
        fontSize: 11, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.heading,
      });
    });

    rounds.forEach((round, rowIndex) => {
      const y = startY + 0.35 + rowIndex * rowH;
      const cells = [round.date || '', round.round || '', round.valuation || '', round.amount || ''];
      cells.forEach((cell, colIndex) => {
        const x = startX + colIndex * colW;
        const bg = rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;
        slide.addShape('rect', {
          x, y, w: colW, h: rowH,
          fill: { color: bg },
          line: { color: COLORS.border, width: 1 },
        });
        slide.addText(cell, {
          x: x + 0.06, y, w: colW - 0.12, h: rowH,
          fontSize: 11, color: COLORS.primary, align: 'center', valign: 'middle',
          fontFace: FONTS.body,
        });
      });
    });
  }

  if (props.quote) {
    slide.addText(`“${props.quote}”`, {
      x: 0.8, y: 4.85, w: 8.4, h: 0.55,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (props.quoteAuthor) {
      slide.addText(`—— ${props.quoteAuthor}`, {
        x: 0.8, y: 5.35, w: 8.4, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.7, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01SpotlightGridColumn {
  tag?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface Theme01SpotlightGridProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  columns?: Theme01SpotlightGridColumn[];
  footnote?: string;
}

function renderTheme01SpotlightGrid(slide: PptxSlide, props: Theme01SpotlightGridProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '主题聚焦');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.15, w: 8.4, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const columns = (props.columns || []).slice(0, 4);
  if (columns.length === 0) {
    slide.addText('（暂无内容）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const colW = 8.4 / columns.length;
  const startX = 0.8;
  const startY = 2.7;
  const cardH = 3.0;
  columns.forEach((col, index) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW - 0.15, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    if (col.tag) {
      slide.addText(col.tag, {
        x: x + 0.15, y: startY + 0.15, w: colW - 0.45, h: 0.3,
        fontSize: 12, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
    if (col.imageUrl) {
      addImageMaybe(slide, col.imageUrl, x + 0.15, startY + 0.55, colW - 0.45, 1.0);
    }
    slide.addText(col.title || '', {
      x: x + 0.15, y: startY + 1.65, w: colW - 0.45, h: 0.45,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(col.description || '', {
      x: x + 0.15, y: startY + 2.1, w: colW - 0.45, h: 0.75,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01MetricTriptychPanel {
  index?: string;
  title?: string;
  value?: string;
  subtitle?: string;
  chartType?: 'bar' | 'line' | 'area';
  chartData?: number[];
}

interface Theme01MetricTriptychProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  panels?: Theme01MetricTriptychPanel[];
  footnote?: string;
}

function renderTheme01MetricTriptych(slide: PptxSlide, props: Theme01MetricTriptychProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '指标总览');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.15, w: 8.4, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const panels = (props.panels || []).slice(0, 3);
  if (panels.length === 0) {
    slide.addText('（暂无指标）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const panelW = 8.4 / panels.length;
  const startX = 0.8;
  const startY = 2.7;
  const cardH = 3.0;
  panels.forEach((panel, index) => {
    const x = startX + index * panelW;
    slide.addShape('rect', {
      x, y: startY, w: panelW - 0.15, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(panel.index || String(index + 1).padStart(2, '0'), {
      x: x + 0.15, y: startY + 0.15, w: 0.6, h: 0.35,
      fontSize: 14, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(panel.title || '', {
      x: x + 0.15, y: startY + 0.55, w: panelW - 0.45, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(panel.value || '', {
      x: x + 0.15, y: startY + 0.95, w: panelW - 0.45, h: 0.6,
      fontSize: 32, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    // 简化迷你图：用一组小方块表示趋势
    const values = (panel.chartData || []).filter((v): v is number => typeof v === 'number');
    if (values.length > 1) {
      const max = Math.max(...values, 1);
      const min = Math.min(...values, 0);
      const range = max - min || 1;
      const barW = (panelW - 0.6) / values.length * 0.7;
      const gap = (panelW - 0.6) / values.length * 0.3;
      values.forEach((v, i) => {
        const barH = Math.max(((v - min) / range) * 0.6, 0.08);
        slide.addShape('rect', {
          x: x + 0.15 + i * (barW + gap),
          y: startY + 2.4 - barH,
          w: barW,
          h: barH,
          fill: { color: COLORS.accent },
        });
      });
    }
    slide.addText(panel.subtitle || '', {
      x: x + 0.15, y: startY + 2.45, w: panelW - 0.45, h: 0.4,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme01DiptychContrastSide {
  label?: string;
  labelEn?: string;
  imageUrl?: string;
}

interface Theme01DiptychContrastComparison {
  leftValue?: string;
  leftLabel?: string;
  rightValue?: string;
  rightLabel?: string;
}

interface Theme01DiptychContrastCenterCard {
  title?: string;
  comparisons?: Theme01DiptychContrastComparison[];
  conclusion?: string;
}

interface Theme01DiptychContrastProps {
  kicker?: string;
  title?: string;
  left?: Theme01DiptychContrastSide;
  right?: Theme01DiptychContrastSide;
  centerCard?: Theme01DiptychContrastCenterCard;
  footnote?: string;
}

function renderTheme01DiptychContrast(slide: PptxSlide, props: Theme01DiptychContrastProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '双联对比');
  const left = props.left || {};
  const right = props.right || {};
  const centerCard = props.centerCard || {};
  const comparisons = (centerCard.comparisons || []).slice(0, 3);

  // 左右背景区
  slide.addShape('rect', {
    x: 0.8, y: 2.3, w: 4.0, h: 3.6,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  slide.addShape('rect', {
    x: 5.2, y: 2.3, w: 4.0, h: 3.6,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  if (left.imageUrl) addImageMaybe(slide, left.imageUrl, 0.9, 2.4, 3.8, 2.6);
  if (right.imageUrl) addImageMaybe(slide, right.imageUrl, 5.3, 2.4, 3.8, 2.6);

  slide.addText(left.labelEn || '', {
    x: 0.8, y: 2.45, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  slide.addText(left.label || '', {
    x: 0.8, y: 5.1, w: 4.0, h: 0.5,
    fontSize: 22, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(right.labelEn || '', {
    x: 5.2, y: 2.45, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  slide.addText(right.label || '', {
    x: 5.2, y: 5.1, w: 4.0, h: 0.5,
    fontSize: 22, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  // 中央结论卡
  slide.addShape('rect', {
    x: 3.3, y: 2.7, w: 3.4, h: 2.8,
    fill: { color: COLORS.surface },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  if (centerCard.title) {
    slide.addText(centerCard.title, {
      x: 3.5, y: 2.85, w: 3.0, h: 0.4,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  comparisons.forEach((item, index) => {
    const y = 3.35 + index * 0.55;
    slide.addText(item.leftValue || '', {
      x: 3.5, y, w: 1.0, h: 0.25,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'right', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.leftLabel || '', {
      x: 3.5, y: y + 0.22, w: 1.0, h: 0.18,
      fontSize: 9, color: COLORS.secondary, align: 'right', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText('VS', {
      x: 4.6, y, w: 0.8, h: 0.25,
      fontSize: 10, color: COLORS.accent, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
    slide.addText(item.rightValue || '', {
      x: 5.5, y, w: 1.0, h: 0.25,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.rightLabel || '', {
      x: 5.5, y: y + 0.22, w: 1.0, h: 0.18,
      fontSize: 9, color: COLORS.secondary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
  });
  if (centerCard.conclusion) {
    slide.addText(centerCard.conclusion, {
      x: 3.5, y: 4.95, w: 3.0, h: 0.45,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

// ---- PPTX renderer registration -------------------------------------------

// Theme01 主题专属版式渲染器注册
registerPptxLayoutRenderer('theme01_cover_v1', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_cover_v2', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_cover_v3', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_cover_v4', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_table_of_contents_v1', renderTableOfContentsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_table_of_contents_v2', renderTableOfContentsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_metric_v1', renderMetricV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_metric_v2', renderTheme01MetricV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_metric_v3', renderMetricV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_stats_v1', renderStatsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_v1', renderChartV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_treemap', renderChartTreemap as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_sankey', renderChartSankey as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_sunburst', renderChartSunburst as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_gauge', renderChartGauge as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_heatmap', renderChartHeatmap as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_funnel', renderChartFunnel as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_radar', renderChartRadar as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_graph', renderChartGraph as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_bar3d', renderChartBar3d as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_wordcloud', renderChartWordcloud as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chart_donut', renderTheme01ChartDonut as PptxRenderFn);
registerPptxLayoutRenderer('theme01_metric_big', renderTheme01MetricBig as PptxRenderFn);
registerPptxLayoutRenderer('theme01_metric_triptych', renderTheme01MetricTriptych as PptxRenderFn);
registerPptxLayoutRenderer('theme01_table_data', renderTheme01TableData as PptxRenderFn);
registerPptxLayoutRenderer('theme01_case_study', renderTheme01CaseStudy as PptxRenderFn);
registerPptxLayoutRenderer('theme01_spotlight_grid', renderTheme01SpotlightGrid as PptxRenderFn);
registerPptxLayoutRenderer('theme01_content_v1', renderContentV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_content_v2', renderContentV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_content_v3', renderTheme01ContentV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_content_v4', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_comparison_v1', renderComparisonV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_comparison_v2', renderTheme01ComparisonV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_comparison_v3', renderComparisonV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_diptych_contrast', renderTheme01DiptychContrast as PptxRenderFn);
registerPptxLayoutRenderer('theme01_process_v1', renderProcessV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_timeline_v1', renderTheme01TimelineV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_roadmap_v1', renderTheme01RoadmapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_quote_v1', renderQuoteV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_quote_v2', renderQuoteV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_quote_v3', renderQuoteV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_testimonial_v1', renderTestimonialV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_faq_v1', renderFaqV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_feature_v1', renderFeatureV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_feature_v2', renderFeatureV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_team_v1', renderTeamV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_team_v2', renderTheme01TeamV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_partners_v1', renderPartnersV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_pricing_v1', renderPricingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_image_v1', renderImageV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_gallery_v1', renderTheme01GalleryV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_closing_v2', renderClosing as PptxRenderFn);
registerPptxLayoutRenderer('theme01_conclusion_v1', renderTheme01ConclusionV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_appendix_v1', renderTheme01AppendixV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chapter_v1', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chapter_v2', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_chapter_v3', renderTheme01ChapterV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_gantt_v1', renderTheme01GanttV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_trend_v1', renderTheme01TrendV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_ranking_v1', renderTheme01RankingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_quadrant_v1', renderTheme01QuadrantV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_risk_v1', renderTheme01RiskV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_outlook_v1', renderTheme01OutlookV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_region_v1', renderTheme01RegionV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_scorecard_v1', renderTheme01ScorecardV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_bento_v1', renderTheme01BentoV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_table_v1', renderTheme01TableV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_tags_v1', renderTheme01TagsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_filmstrip_v1', renderTheme01FilmstripV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_swot_v1', renderSwotV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme01_pest_v1', renderPestV1 as PptxRenderFn);

// ---- Theme02 adapters ------------------------------------------------------

interface Theme02ChapterV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  number?: string;
}

function renderTheme02ChapterV1(slide: PptxSlide, props: Theme02ChapterV1Props): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  if (props.number) {
    slide.addText(props.number, {
      x: 0.8, y: 2.4, w: 8.4, h: 1.0,
      fontSize: 72, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: props.number ? 3.6 : 2.4, w: 8.4, h: 0.8,
      fontSize: 22, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

interface Theme02ChapterV2Props {
  number?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
}

function renderTheme02ChapterV2(slide: PptxSlide, props: Theme02ChapterV2Props): void {
  addTheme02Card(slide, 0.8, 1.0, 8.4, 3.8, 0.2);
  if (props.kicker) addKicker(slide, props.kicker, 0.8, 1.2);
  if (props.number) {
    slide.addText(props.number, {
      x: 0.8, y: 1.8, w: 8.4, h: 1.4,
      fontSize: 96, color: COLORS.accent, bold: true, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 0.8, y: props.number ? 3.3 : 1.8, w: 8.4, h: 0.9,
      fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.2, y: props.title ? 4.3 : 3.0, w: 7.6, h: 0.6,
      fontSize: 20, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

interface Theme02QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
  source?: string;
}

function renderTheme02QuoteV2(slide: PptxSlide, props: Theme02QuoteV2Props): void {
  addTheme02Card(slide, 0.9, 1.4, 8.2, 3.2, 0.15);
  slide.addText(`“${props.quote}”`, {
    x: 1.1, y: 1.7, w: 7.8, h: 2.0,
    fontSize: 32, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.role, props.source].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1.1, y: 3.85, w: 7.8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme02NumberShowcaseV1Props {
  kicker?: string;
  title?: string;
  value?: string;
  unit?: string;
  description?: string;
  footnote?: string;
}

function renderTheme02NumberShowcaseV1(slide: PptxSlide, props: Theme02NumberShowcaseV1Props): void {
  addTheme02Card(slide, 1.2, 1.1, 7.6, 3.8, 0.2);
  if (props.kicker) addKicker(slide, props.kicker, 0.8, 1.0);
  if (props.title) {
    slide.addText(props.title, {
      x: 0.8, y: 1.5, w: 8.4, h: 0.7,
      fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  const valueY = props.title ? 2.35 : 1.7;
  slide.addText(props.value ?? '', {
    x: 0.8, y: valueY, w: 8.4, h: 1.5,
    fontSize: 80, color: COLORS.accent, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.8, y: valueY + 1.35, w: 8.4, h: 0.35,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 1.2, y: props.unit ? valueY + 1.85 : valueY + 1.55, w: 7.6, h: 0.7,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.35, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme02ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  insight?: ChartV1Insight;
  footnote?: string;
}

function renderTheme02ChartV1(slide: PptxSlide, props: Theme02ChartV1Props): void {
  const adapted: ChartV1Props = {
    ...props,
    type: props.type === 'area' ? 'line' : props.type,
  };
  renderChartV1(slide, adapted);
}

interface Theme02ContentV1Props {
  title?: string;
  subtitle?: string;
  kicker?: string;
  bullets?: string[];
}

function renderTheme02ContentV1(slide: PptxSlide, props: Theme02ContentV1Props): void {
  renderContentV1(slide, {
    kicker: props.kicker,
    title: props.title ?? '',
    points: props.bullets || [],
  });
}

interface Theme02DeltaItem {
  label?: string;
  previous?: number;
  current?: number;
  unit?: string;
}

interface Theme02DeltaV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02DeltaItem[];
  footnote?: string;
  showInsight?: boolean;
  insight?: SimpleInsight;
}

function renderTheme02DeltaV1(slide: PptxSlide, props: Theme02DeltaV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const startX = 0.8;

  if (props.kicker) addKicker(slide, props.kicker, startX);
  if (props.title) addTitle(slide, props.title, startX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: startX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无对照数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const cols = Math.min(items.length, 3);
  const rows = Math.ceil(items.length / cols);
  const cardW = (mainW - 0.25 * (cols - 1)) / cols;
  const cardH = rows === 1 ? 2.6 : 1.25;
  const startY = 2.5;
  items.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (cardW + 0.25);
    const y = startY + row * (cardH + 0.25);
    const previous = Number(item.previous) || 0;
    const current = Number(item.current) || 0;
    const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    const positive = delta >= 0;
    addTheme02Card(slide, x, y, cardW, cardH, 0.1);
    slide.addText(item.label || '', {
      x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`${current}${item.unit ? ` ${item.unit}` : ''}`, {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.45,
      fontSize: 24, color: positive ? COLORS.accent : 'FF6B6B', bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${positive ? '+' : ''}${delta.toFixed(1)}%`, {
      x: x + 0.12, y: y + 1.0, w: cardW - 0.24, h: 0.3,
      fontSize: 12, color: positive ? COLORS.accent : 'FF6B6B', align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: startX, y: 5.75, w: mainW, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface Theme02TableOfContentsV1Props {
  title?: string;
  subtitle?: string;
  items?: Array<{ title: string; page?: string }>;
}

function renderTheme02TableOfContentsV1(slide: PptxSlide, props: Theme02TableOfContentsV1Props): void {
  renderTableOfContentsV1(slide, {
    title: props.title ?? '目录',
    kicker: props.subtitle,
    items: (props.items || []).map((item) => item.title),
  });
}

interface Theme02ImageV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  image: string;
  caption?: string;
}

function renderTheme02ImageV1(slide: PptxSlide, props: Theme02ImageV1Props): void {
  renderImageV1(slide, {
    title: props.title ?? '',
    subtitle: props.subtitle,
    imageUrl: props.image,
  });
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.8, y: 5.25, w: 8.4, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface Theme02QuoteV1Props {
  quote: string;
  author?: string;
  role?: string;
  avatar?: string;
}

function renderTheme02QuoteV1(slide: PptxSlide, props: Theme02QuoteV1Props): void {
  renderTestimonialV1(slide, {
    quote: props.quote,
    author: props.author,
    role: props.role,
    avatarUrl: props.avatar,
  });
}

interface Theme02BentoV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ label: string; value: string; unit?: string; size?: 'small' | 'medium' | 'large' }>;
  showInsight?: boolean;
  insight?: SimpleInsight;
}

function renderTheme02BentoV1(slide: PptxSlide, props: Theme02BentoV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const startX = 0.8;

  if (props.kicker) addKicker(slide, props.kicker, startX);
  if (props.title) addTitle(slide, props.title, startX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: startX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const cardW = (mainW - 0.4) / 2;
  const positions = [
    { x: startX, y: 2.5, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 2.5, w: cardW, h: 1.3 },
    { x: startX, y: 4.0, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 4.0, w: cardW, h: 1.3 },
    { x: startX, y: 5.5, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 5.5, w: cardW, h: 1.3 },
  ];
  items.forEach((item, index) => {
    const pos = positions[index];
    if (!pos) return;
    addTheme02Card(slide, pos.x, pos.y, pos.w, pos.h, 0.1);
    const valueText = `${item.value}${item.unit ? ` ${item.unit}` : ''}`;
    slide.addText(valueText, {
      x: pos.x + 0.12, y: pos.y + 0.12, w: pos.w - 0.24, h: 0.45,
      fontSize: 24, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(item.label, {
      x: pos.x + 0.12, y: pos.y + 0.62, w: pos.w - 0.24, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface Theme02ProcessV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Array<{ title?: string; description?: string }>;
}

function renderTheme02ProcessV1(slide: PptxSlide, props: Theme02ProcessV1Props): void {
  const steps = (props.steps || []).map((s) => s.title || '').filter(Boolean);
  renderProcessV1(slide, {
    kicker: props.kicker,
    title: props.title,
    steps,
  });
}

interface Theme02ProgressItem {
  label?: string;
  value?: number;
  max?: number;
  unit?: string;
}

interface Theme02ProgressV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02ProgressItem[];
}

function renderTheme02ProgressV1(slide: PptxSlide, props: Theme02ProgressV1Props): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无进度数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  let y = 2.5;
  items.forEach((item) => {
    const value = Number(item.value) || 0;
    const max = Number(item.max) || 100;
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    slide.addText(item.label || '', {
      x: 0.8, y, w: 5.0, h: 0.3,
      fontSize: 14, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`${value}${item.unit ? ` ${item.unit}` : ''} (${pct.toFixed(1)}%)`, {
      x: 5.8, y, w: 3.4, h: 0.3,
      fontSize: 14, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.35, w: 8.4, h: 0.12,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.35, w: 8.4 * (pct / 100), h: 0.12,
      fill: { color: COLORS.accent },
    });
    y += 0.65;
  });
}

// Theme02 版式复用 theme01 的渲染函数，视觉差异由主题色板控制
registerPptxLayoutRenderer('theme02_cover_v1', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_cover_v2', renderCoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chapter_v1', renderTheme02ChapterV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chapter_v2', renderTheme02ChapterV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_metric_big', renderTheme01MetricBig as PptxRenderFn);
registerPptxLayoutRenderer('theme02_number_showcase_v1', renderTheme02NumberShowcaseV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_v1', renderTheme02ChartV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_funnel', renderChartFunnel as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_donut', renderTheme01ChartDonut as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_heatmap', renderChartHeatmap as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_radar', renderChartRadar as PptxRenderFn);
registerPptxLayoutRenderer('theme02_chart_gauge', renderChartGauge as PptxRenderFn);
registerPptxLayoutRenderer('theme02_content_v1', renderTheme02ContentV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_delta_v1', renderTheme02DeltaV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_closing_v1', renderClosing as PptxRenderFn);
registerPptxLayoutRenderer('theme02_table_of_contents_v1', renderTheme02TableOfContentsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_metrics_v1', renderStatsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_team_v1', renderTeamV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_timeline_v1', renderTimelineV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_comparison_v1', renderComparisonV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_image_v1', renderTheme02ImageV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_quote_v1', renderTheme02QuoteV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_quote_v2', renderTheme02QuoteV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_bento_v1', renderTheme02BentoV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_feature_v1', renderFeatureV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_gallery_v1', renderTheme01GalleryV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_pricing_v1', renderPricingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_process_v1', renderTheme02ProcessV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_progress_v1', renderTheme02ProgressV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_roadmap_v1', renderTheme01RoadmapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_swot_v1', renderSwotV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_faq_v1', renderFaqV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_filmstrip_v1', renderTheme01FilmstripV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_partners_v1', renderPartnersV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_pest_v1', renderPestV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_stats_v1', renderStatsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_table_v1', renderTheme01TableV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_tags_v1', renderTheme01TagsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme02_testimonial_v1', renderTestimonialV1 as PptxRenderFn);

// ---- theme03 PPTX renderers ------------------------------------------------

interface Theme03TopbarProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
}

interface Theme03FooterProps {
  footnoteLeft?: string;
  footnoteRight?: string;
}

function theme03TitleText(title: string): { text: string; options: Record<string, unknown> }[] {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part) => {
    const match = part.match(/^\{\{(.+)\}\}$/);
    if (match) {
      return { text: match[1], options: { color: COLORS.accent, bold: true } };
    }
    return { text: part, options: { color: COLORS.primary, bold: true } };
  });
}

function addTheme03Topbar(slide: PptxSlide, props: Theme03TopbarProps): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addText(tagText, {
      x: 0.84375, y: 0.71875, w: 4, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
      valign: 'middle',
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 5.15625, y: 0.71875, w: 4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
      align: 'right', valign: 'middle',
    });
  }
}

function addTheme03Footer(slide: PptxSlide, props: Theme03FooterProps): void {
  const y = 5.625 - 0.65625;
  slide.addShape('line', {
    x1: 0.84375, y1: y - 0.1, x2: 9.15625, y2: y - 0.1,
    line: { color: COLORS.border, width: 1 },
  });
  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: 0.84375, y: y, w: 4, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      valign: 'top',
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 5.15625, y: y, w: 4, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      align: 'right', valign: 'top',
    });
  }
}

function renderTheme03CoverV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.5, w: 7.0, h: 1.4,
    fontSize: 54, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.95, w: 6.5, h: 0.8,
      fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body,
      valign: 'top',
    });
  }
  const metricX = 7.2;
  slide.addText(props.metricValue ?? '', {
    x: metricX, y: 2.2, w: 2.5, h: 0.8,
    fontSize: 72, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    valign: 'bottom',
  });
  slide.addText(props.metricUnit ?? '', {
    x: metricX + 1.4, y: 2.6, w: 1.0, h: 0.3,
    fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'bottom',
  });
  if (props.metricLabel) {
    slide.addText(props.metricLabel, {
      x: metricX, y: 3.05, w: 2.5, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
  }
  if (props.stats && props.stats.length > 0) {
    const statY = 4.1;
    const statW = 2.6;
    props.stats.slice(0, 3).forEach((stat: any, idx: number) => {
      const x = 0.84375 + idx * (statW + 0.3);
      slide.addText(`${stat.value}${stat.unit ?? ''}`, {
        x, y: statY, w: statW, h: 0.35,
        fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(stat.label ?? '', {
        x, y: statY + 0.38, w: statW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.number ?? '', {
    x: 0.84375, y: 1.6, w: 2.2, h: 1.4,
    fontSize: 110, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.numberEnglish) {
    slide.addText(props.numberEnglish, {
      x: 2.6, y: 1.8, w: 0.3, h: 2.0,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      valign: 'top',
    } as any);
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 3.1, y: 1.7, w: 5.8, h: 0.9,
    fontSize: 42, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.description) {
    slide.addText(props.description, {
      x: 3.1, y: 2.65, w: 5.0, h: 0.8,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const itemY = 3.8;
    props.items.slice(0, 4).forEach((item: any, idx: number) => {
      slide.addText(`${item.number ?? idx + 1}  ${item.title ?? ''}`, {
        x: 3.1 + idx * 2.1, y: itemY, w: 2.0, h: 0.3,
        fontSize: 12, color: COLORS.primary, fontFace: FONTS.body,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.columns && props.columns.length > 0) {
    const colW = 8.3 / Math.min(props.columns.length, 3);
    const startY = 2.9;
    props.columns.slice(0, 3).forEach((col: any, idx: number) => {
      const x = 0.84375 + idx * colW;
      addTheme02Card(slide, x, startY, colW - 0.25, 2.1, 0.08);
      slide.addText(col.title ?? '', {
        x: x + 0.15, y: startY + 0.15, w: colW - 0.55, h: 0.3,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      if (col.points && col.points.length > 0) {
        const points = Array.isArray(col.points[0]) ? col.points : col.points.map((p: any) => typeof p === 'string' ? p : p.value);
        slide.addText(points.map((p: string) => `• ${p}`).join('\n'), {
          x: x + 0.15, y: startY + 0.55, w: colW - 0.55, h: 1.4,
          fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricBig(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(`${props.value ?? ''}${props.unit ?? ''}`, {
    x: 0.84375, y: 1.7, w: 4.5, h: 1.1,
    fontSize: 88, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.label) {
    slide.addText(props.label, {
      x: 0.84375, y: 2.8, w: 4.5, h: 0.5,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.84375, y: 3.3, w: 4.5, h: 0.6,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.showInsight && props.insight) {
    addTheme02Card(slide, 5.6, 1.7, 3.4, 2.3, 0.08);
    slide.addShape('line', {
      x1: 5.6, y1: 1.7, x2: 5.6, y2: 4.0,
      line: { color: COLORS.accent, width: 3 },
    });
    slide.addText(props.insight.label ?? '', {
      x: 5.8, y: 1.9, w: 3.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
    slide.addText(props.insight.value ?? '', {
      x: 5.8, y: 2.2, w: 3.0, h: 0.5,
      fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(props.insight.description ?? '', {
      x: 5.8, y: 2.75, w: 3.0, h: 1.0,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.metrics && props.metrics.length > 0) {
    const statY = 4.35;
    const statW = 8.3 / Math.min(props.metrics.length, 3);
    props.metrics.slice(0, 3).forEach((metric: any, idx: number) => {
      const x = 0.84375 + idx * statW;
      slide.addShape('line', {
        x1: x, y1: statY - 0.05, x2: x + statW - 0.3, y2: statY - 0.05,
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(`${metric.value}${metric.unit ?? ''}`, {
        x, y: statY + 0.05, w: statW - 0.3, h: 0.35,
        fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(metric.label ?? '', {
        x, y: statY + 0.42, w: statW - 0.3, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RankingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const max = Math.max(...props.items.map((i: any) => Number(i.maxValue || i.value) || 0));
    const rowH = 0.38;
    const startY = 2.55;
    props.items.slice(0, 6).forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      const isTop = idx === 0;
      const value = Number(item.value) || 0;
      const pct = max ? value / max : 0;
      slide.addText(item.rank ?? `${idx + 1}`, {
        x: 0.84375, y, w: 0.4, h: 0.3,
        fontSize: 11, color: isTop ? COLORS.accent : COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(item.name ?? '', {
        x: 1.3, y, w: 1.8, h: 0.3,
        fontSize: 13, color: isTop ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(item.category ?? '', {
        x: 3.2, y, w: 1.2, h: 0.3,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addShape('roundRect', {
        x: 4.5, y: y + 0.1, w: 3.2, h: 0.12,
        fill: { color: COLORS.surfaceElevated },
        rectRadius: 0.06,
      } as any);
      if (pct > 0) {
        slide.addShape('roundRect', {
          x: 4.5, y: y + 0.1, w: 3.2 * pct, h: 0.12,
          fill: { color: isTop ? COLORS.accent : COLORS.secondary },
          rectRadius: 0.06,
        } as any);
      }
      slide.addText(`${item.value}${props.unit ?? ''}`, {
        x: 7.9, y, w: 0.8, h: 0.3,
        fontSize: 12, color: isTop ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.mono,
        align: 'right',
      });
    });
  }
  if (props.insightLabel || props.insightText) {
    const insightY = 4.85;
    slide.addText(props.insightLabel ?? '', {
      x: 0.84375, y: insightY, w: 1.0, h: 0.25,
      fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
    });
    slide.addText(props.insightText ?? '', {
      x: 1.8, y: insightY, w: 7.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText('“', {
    x: 0.84375, y: 1.5, w: 1.0, h: 0.8,
    fontSize: 90, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: 1.4, y: 2.0, w: 7.5, h: 1.4,
    fontSize: 38, fontFace: FONTS.heading, valign: 'top',
  });
  const attrParts = [props.author, props.title, props.source].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 1.4, y: 3.55, w: 7.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CaseV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 4.5, y: 1.4, w: 4.9, h: 0.7,
    fontSize: 34, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 4.5, y: 2.1, w: 4.9, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 4.5, y: 2.45, w: 4.9, h: 0.6,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme02Card(slide, 0.84375, 1.4, 3.3, 3.6, 0.08);
  slide.addText('点击上传案例配图', {
    x: 0.84375, y: 2.9, w: 3.3, h: 0.3,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
  });
  if (props.milestones && props.milestones.length > 0) {
    const startY = 3.2;
    props.milestones.slice(0, 3).forEach((m: any, idx: number) => {
      const y = startY + idx * 0.55;
      slide.addShape('ellipse', {
        x: 4.5, y: y + 0.05, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
      });
      slide.addText(m.date ?? '', {
        x: 4.75, y, w: 1.0, h: 0.18,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
      });
      slide.addText(m.title ?? '', {
        x: 4.75, y: y + 0.2, w: 2.5, h: 0.18,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 4.5, y: 4.55, w: 4.9, h: 0.4,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ClosingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.title ?? '感谢阅读', {
    x: 0.84375, y: 1.7, w: 4.5, h: 1.0,
    fontSize: 54, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.7, w: 4.0, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 0.84375, y: 3.3, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  const columns = [
    { title: props.leftColumnTitle, items: props.leftColumnItems },
    { title: props.rightColumnTitle, items: props.rightColumnItems },
  ];
  const colW = 2.0;
  columns.forEach((col, idx) => {
    if (!col.title && (!col.items || col.items.length === 0)) return;
    const x = 5.4 + idx * (colW + 0.4);
    slide.addText(col.title ?? '', {
      x, y: 1.7, w: colW, h: 0.25,
      fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    if (col.items && col.items.length > 0) {
      slide.addText(col.items.join('\n'), {
        x, y: 2.05, w: colW, h: 1.8,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  });
  addTheme03Footer(slide, props);
}

function renderTheme03TableOfContentsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const startY = 2.85;
    const rowH = 0.52;
    props.items.slice(0, 8).forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      addTheme02Card(slide, 0.84375, y, 8.3125, 0.42, 0.06);
      slide.addText(item.title ?? '', {
        x: 1.05, y: y + 0.09, w: 3.8, h: 0.24,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'middle',
      });
      slide.addText(item.page ?? '', {
        x: 8.0, y: y + 0.09, w: 0.9, h: 0.24,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.stats && props.stats.length > 0) {
    const items = props.stats.slice(0, 8);
    const cols = items.length <= 4 ? Math.min(items.length, 4) : 4;
    const rows = Math.ceil(items.length / cols);
    const cardW = (8.3125 - (cols - 1) * 0.25) / cols;
    const cardH = rows === 1 ? 1.8 : 1.25;
    const startY = 2.9;
    items.forEach((stat: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + 0.25);
      const y = startY + row * (cardH + 0.25);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const valueText = `${stat.value ?? ''}${stat.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.15, y: y + 0.25, w: cardW - 0.3, h: 0.4,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (stat.change) {
        slide.addText(stat.change, {
          x: x + cardW - 1.1, y: y + 0.28, w: 0.95, h: 0.3,
          fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(stat.label ?? '', {
        x: x + 0.15, y: y + 0.72, w: cardW - 0.3, h: 0.35,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FeatureV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.features && props.features.length > 0) {
    const items = props.features.slice(0, 6);
    const cols = Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);
    const cardW = (8.3125 - (cols - 1) * 0.28) / cols;
    const cardH = rows === 1 ? 2.2 : 1.55;
    const startY = 2.85;
    items.forEach((feature: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + 0.28);
      const y = startY + row * (cardH + 0.28);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(feature.number ?? String(idx + 1).padStart(2, '0'), {
        x: x + 0.15, y: y + 0.15, w: 0.8, h: 0.35,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(feature.title ?? '', {
        x: x + 0.15, y: y + 0.58, w: cardW - 0.3, h: 0.32,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(feature.description ?? '', {
        x: x + 0.15, y: y + 0.95, w: cardW - 0.3, h: cardH - 1.1,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ImageV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const imgY = 2.85;
  const imgH = 2.6;
  addTheme02Card(slide, 0.84375, imgY, 8.3125, imgH, 0.1);
  if (props.image) {
    try {
      slide.addImage({ path: props.image, x: 0.94375, y: imgY + 0.1, w: 8.1125, h: imgH - 0.2 });
    } catch {
      slide.addText('（图片无法加载）', {
        x: 0.84375, y: imgY + 1.1, w: 8.3125, h: 0.4,
        fontSize: 14, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    }
  } else {
    slide.addText('点击上传架构图 / 系统图', {
      x: 0.84375, y: imgY + 1.1, w: 8.3125, h: 0.4,
      fontSize: 13, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.84375, y: imgY + imgH + 0.15, w: 8.3125, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChartDonut(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '环形图'), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const rawSegments = (props.segments || [])
    .filter((s: any) => s != null && !!(s.label || s.value))
    .map((s: any) => ({ ...s }))
    .sort((a: any, b: any) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  if (rawSegments.length === 0) {
    slide.addText('（暂无环形图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    addTheme03Footer(slide, props);
    return;
  }

  const totalValue = rawSegments.reduce((sum: number, s: any) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  const segments = rawSegments.map((s: any) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return { ...s, percent: `${pct}%`, numericValue: n };
  });

  const labels = segments.map((s: any) => s.label || '');
  const values = segments.map((s: any) => s.numericValue);
  const chartColors = segments.map((_: any, i: number) => CHART_COLORS[i % CHART_COLORS.length]);

  const showInsight = props.showInsight !== false;
  const insight = props.insight;
  const hasInsight = showInsight && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 4.0 : 4.8;
  slide.addChart('doughnut' as 'pie', [
    { name: props.title || '', labels, values },
  ], {
    x: 0.6, y: 2.4, w: chartW, h: 3.0,
    chartColors,
    showValue: false,
    holeSize: 60,
  } as any);

  const total = props.total || { value: String(totalValue), label: '合计' };
  const centerX = 0.6 + chartW / 2;
  slide.addText(total.value || String(totalValue), {
    x: centerX - 1.8, y: 3.4, w: 3.6, h: 0.6,
    fontSize: 28, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(total.label || '合计', {
    x: centerX - 1.8, y: 4.0, w: 3.6, h: 0.3,
    fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.body,
  });

  const legendX = hasInsight ? 4.8 : 5.6;
  const legendW = hasInsight ? 2.6 : 3.2;
  let legendY = 2.5;
  segments.forEach((segment: any, index: number) => {
    const color = chartColors[index % chartColors.length];
    slide.addShape('ellipse', {
      x: legendX, y: legendY + 0.08, w: 0.18, h: 0.18,
      fill: { color },
    } as any);
    slide.addText(segment.label || '', {
      x: legendX + 0.3, y: legendY, w: legendW - 1.4, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (segment.labelEn) {
      slide.addText(segment.labelEn, {
        x: legendX + 0.3, y: legendY + 0.26, w: legendW - 1.4, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
    slide.addText(segment.percent || '', {
      x: legendX + legendW - 1.0, y: legendY, w: 0.9, h: 0.28,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(segment.value || '', {
      x: legendX + legendW - 1.0, y: legendY + 0.26, w: 0.9, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    legendY += segment.labelEn ? 0.65 : 0.5;
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 7.6, y: 2.3, w: 2.4, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    } as any);

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 7.8, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 7.8, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 7.8, y: cursorY, w: 2.0, h: 1.5,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary, valign: 'top',
      });
    }
  }

  addTheme03Footer(slide, props);
}

function renderTheme03ChartBar(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '柱状图'), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const bars = (props.bars || [])
    .filter((b: any) => b != null && !!(b.label || b.value))
    .map((b: any) => ({ ...b }));

  if (bars.length === 0) {
    slide.addText('（暂无柱状图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    addTheme03Footer(slide, props);
    return;
  }

  const values = bars.map((b: any) => parseFloat(String(b.value || '0').replace(/,/g, '')) || 0);
  const max = Math.max(...values, 1);
  const topIndex = values.indexOf(max);
  const labels = bars.map((b: any) => b.label || '');
  const chartColors = bars.map((_: any, i: number) => (i === topIndex ? COLORS.accent : COLORS.secondary));

  const showInsight = props.showInsight !== false;
  const insight = props.insight;
  const hasInsight = showInsight && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 6.4 : 8.4;
  const chartX = 0.84375;

  slide.addChart('bar' as 'bar', [
    { name: props.title || '', labels, values },
  ], {
    x: chartX, y: 2.55, w: chartW, h: 3.0,
    chartColors,
    barDir: 'col',
    barGrouping: 'clustered',
    showValue: true,
    dataLabelPosition: 'outEnd',
    dataLabelFontSize: 10,
    dataLabelColor: COLORS.primary,
  } as any);

  if (hasInsight) {
    const insightX = chartX + chartW + 0.3;
    slide.addShape('roundRect', {
      x: insightX, y: 2.55, w: 2.4, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    } as any);

    let cursorY = 2.85;
    if (insight.value) {
      slide.addText(insight.value, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 1.5,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary, valign: 'top',
      });
    }
  }

  addTheme03Footer(slide, props);
}

function renderTheme03ChartFallback(slide: PptxSlide, props: any, label: string): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? label), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const insight = props.insight;
  const hasInsight = props.showInsight !== false && insight && (insight.value || insight.label || insight.description);
  const placeholderW = hasInsight ? 5.4 : 6;
  const placeholderX = hasInsight ? 1.1 : 2;
  slide.addText(`（${label}占位：请在编辑器中查看完整图表）`, {
    x: placeholderX, y: 3.2, w: placeholderW, h: 0.8,
    fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
    fontFace: FONTS.body,
  });
  if (hasInsight) {
    const panelX = 6.9;
    const panelY = 2.55;
    const panelW = 2.2;
    const panelH = 3.05;
    slide.addShape('roundRect', {
      x: panelX, y: panelY, w: panelW, h: panelH,
      fill: { color: COLORS.surface },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    slide.addShape('rect', {
      x: panelX, y: panelY, w: 0.05, h: panelH,
      fill: { color: COLORS.accent },
    } as any);
    let currentY = panelY + 0.25;
    if (insight.value) {
      slide.addText(insight.value, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: 0.45,
        fontSize: 26, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      currentY += 0.45;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: 0.3,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      currentY += 0.35;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: panelH - (currentY - panelY) - 0.2,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChartV1(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '通用图表');
}

function renderTheme03TrendV1(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '趋势图');
}

function renderTheme03ChartRadar(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '雷达图');
}

function renderTheme03ChartFunnel(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '漏斗图');
}

function renderTheme03ChartGauge(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '仪表盘');
}

function renderTheme03ChartHeatmap(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '热力图');
}

function renderTheme03ChartTreemap(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '矩形树图');
}

function renderTheme03ChartWordcloud(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '词云');
}

function renderTheme03ChartBar3d(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '3D 柱状图');
}

function renderTheme03ChartGraph(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '关系图');
}

function renderTheme03ChartSankey(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '桑基图');
}

function renderTheme03ChartSunburst(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '旭日图');
}

function renderTheme03TeamV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const members = (props.members || []).filter((m: any) => m != null).slice(0, 6);
  if (members.length > 0) {
    const cols = members.length <= 4 ? 4 : 3;
    const rows = Math.ceil(members.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.25 : 1.55;
    const startY = 2.85;
    members.forEach((member: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const avatarSize = 0.6875;
      const avatarX = x + (cardW - avatarSize) / 2;
      const avatarY = y + 0.18;
      if (member.image) {
        addImageMaybe(slide, member.image, avatarX, avatarY, avatarSize, avatarSize);
      }
      slide.addText(member.name ?? '', {
        x, y: avatarY + avatarSize + 0.12, w: cardW, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText(member.role ?? '', {
        x, y: avatarY + avatarSize + 0.42, w: cardW, h: 0.22,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
      if (member.bio) {
        slide.addText(member.bio, {
          x: x + 0.12, y: avatarY + avatarSize + 0.68, w: cardW - 0.24, h: cardH - (avatarY + avatarSize + 0.68 - y) - 0.12,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03PartnersV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const partners = (props.partners || []).filter((p: any) => p != null).slice(0, 8);
  if (partners.length > 0) {
    const cols = 4;
    const rows = Math.ceil(partners.length / cols);
    const gapX = 0.25;
    const gapY = 0.25;
    const cardW = (8.3125 - (cols - 1) * gapX) / cols;
    const cardH = rows === 1 ? 1.35 : 1.15;
    const startY = 2.85;
    partners.forEach((partner: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      const logoH = 0.55;
      if (partner.logo) {
        addImageMaybe(slide, partner.logo, x + 0.2, y + 0.15, cardW - 0.4, logoH);
      }
      slide.addText(partner.name ?? '', {
        x, y: y + logoH + 0.22, w: cardW, h: 0.22,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function getTheme03PricingFeatureValue(feature: { value?: string } | string | undefined): string | undefined {
  if (feature == null) return undefined;
  if (typeof feature === 'string') return feature;
  return feature.value;
}

function renderTheme03PricingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tiers = (props.tiers || []).filter((t: any) => t != null).slice(0, 4);
  if (tiers.length > 0) {
    const cols = tiers.length <= 3 ? 3 : 4;
    const rows = Math.ceil(tiers.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.5 : 1.9;
    const startY = 2.85;
    tiers.forEach((tier: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const isHighlight = tier.highlight === true;
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: isHighlight ? COLORS.accent : COLORS.border }, rectRadius: 0.04,
      } as any);
      if (isHighlight) {
        slide.addText('推荐', {
          x: x + cardW - 0.6, y: y + 0.12, w: 0.5, h: 0.18,
          fontSize: 9, color: COLORS.accent, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(tier.name ?? '', {
        x, y: y + 0.22, w: cardW, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
        x, y: y + 0.55, w: cardW, h: 0.32,
        fontSize: 20, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      const features = (tier.features || []).slice(0, 5).map(getTheme03PricingFeatureValue).filter(Boolean) as string[];
      let fy = y + 0.98;
      features.forEach((feature: string) => {
        slide.addText(feature, {
          x: x + 0.12, y: fy, w: cardW - 0.24, h: 0.24,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
        });
        fy += 0.26;
      });
      if (tier.cta) {
        slide.addText(tier.cta, {
          x: x + 0.2, y: y + cardH - 0.38, w: cardW - 0.4, h: 0.26,
          fontSize: 10, color: isHighlight ? COLORS.white : COLORS.accent,
          fill: isHighlight ? { color: COLORS.accent } : { color: COLORS.surfaceElevated },
          line: { color: isHighlight ? COLORS.accent : COLORS.border, width: 1 },
          align: 'center', valign: 'middle', fontFace: FONTS.body,
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function getTheme03ComparisonValue(item: { value?: string } | string | undefined): string | undefined {
  if (item == null) return undefined;
  if (typeof item === 'string') return item;
  return item.value;
}

function renderTheme03ComparisonV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const colW = 3.75;
  const gap = 0.4;
  const vsW = 0.5;
  const totalW = colW * 2 + gap * 2 + vsW;
  const startX = (10 - totalW) / 2;
  const y = 2.9;
  const colH = 2.5;

  addTheme02Card(slide, startX, y, colW, colH, 0.08);
  slide.addShape('roundRect', {
    x: startX, y, w: colW, h: 0.08,
    fill: { color: COLORS.secondary }, rectRadius: 0.04,
  } as any);
  slide.addText(props.leftTitle ?? '方案 A', {
    x: startX, y: y + 0.18, w: colW, h: 0.32,
    fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  const leftItems = (props.leftItems || []).map(getTheme03ComparisonValue).filter(Boolean) as string[];
  slide.addText(leftItems.map((i) => `• ${i}`).join('\n'), {
    x: startX + 0.15, y: y + 0.62, w: colW - 0.3, h: colH - 0.8,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
  });

  slide.addShape('ellipse', {
    x: startX + colW + gap + (vsW - 0.4) / 2, y: y + colH / 2 - 0.2, w: 0.4, h: 0.4,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText('VS', {
    x: startX + colW + gap, y: y + colH / 2 - 0.2, w: vsW, h: 0.4,
    fontSize: 12, color: COLORS.secondary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });

  const rightX = startX + colW + gap + vsW + gap;
  addTheme02Card(slide, rightX, y, colW, colH, 0.08);
  slide.addShape('roundRect', {
    x: rightX, y, w: colW, h: 0.08,
    fill: { color: COLORS.accent }, rectRadius: 0.04,
  } as any);
  slide.addText(props.rightTitle ?? '方案 B', {
    x: rightX, y: y + 0.18, w: colW, h: 0.32,
    fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  const rightItems = (props.rightItems || []).map(getTheme03ComparisonValue).filter(Boolean) as string[];
  slide.addText(rightItems.map((i) => `• ${i}`).join('\n'), {
    x: rightX + 0.15, y: y + 0.62, w: colW - 0.3, h: colH - 0.8,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
  });

  addTheme03Footer(slide, props);
}

function renderTheme03GalleryV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const images = (props.images || []).slice(0, 4);
  if (images.length > 0) {
    const cols = images.length <= 2 ? images.length : 2;
    const rows = Math.ceil(images.length / cols);
    const gapX = 0.28;
    const gapY = 0.24;
    const cardW = (8.3125 - (cols - 1) * gapX) / cols;
    const cardH = rows === 1 ? 2.6 : 1.55;
    const startY = 2.85;
    images.forEach((image: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      if (image.url) {
        try {
          slide.addImage({ path: image.url, x: x + 0.1, y: y + 0.22, w: cardW - 0.2, h: cardH - 0.54 });
        } catch {
          slide.addText('（图片）', {
            x: x + 0.1, y: y + 0.6, w: cardW - 0.2, h: 0.3,
            fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
          });
        }
      }
      if (image.caption) {
        slide.addText(image.caption, {
          x: x + 0.1, y: y + cardH - 0.28, w: cardW - 0.2, h: 0.22,
          fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03NumberShowcaseV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top', align: 'center',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.15, w: 8.3, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top', align: 'center',
    });
  }
  const value = props.value ?? '';
  const unit = props.unit ?? '';
  const valueWidth = value.length > 3 ? 6.0 : 4.0;
  slide.addText(value, {
    x: (10 - valueWidth) / 2, y: 2.7, w: valueWidth, h: 1.2,
    fontSize: 100, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    align: 'center', valign: 'middle',
  });
  if (unit) {
    slide.addText(unit, {
      x: (10 - valueWidth) / 2 + valueWidth + 0.1, y: 3.4, w: 1.2, h: 0.4,
      fontSize: 22, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
      valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 1.5, y: 4.05, w: 7.0, h: 0.6,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top', align: 'center',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03BentoV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const gap = 0.22;
    const areaW = 8.3125;
    const areaH = 2.4;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const size = item.size || 'medium';
      const isLarge = size === 'large';
      const isSmall = size === 'small';
      const w = isLarge ? (areaW - gap) / 2 : isSmall ? (areaW - gap * 3) / 4 : (areaW - gap) / 2;
      const h = isLarge ? areaH : (areaH - gap) / 2;
      const colSpan = isLarge ? 2 : isSmall ? 1 : 2;
      const col = idx % (4 / colSpan);
      const row = Math.floor(idx / (4 / colSpan));
      const x = 0.84375 + col * (w + gap);
      const y = startY + row * (h + gap);
      addTheme02Card(slide, x, y, w, h, 0.08);
      slide.addShape('roundRect', {
        x, y, w, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const valueText = `${item.value ?? ''}${item.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.15, y: y + 0.25, w: w - 0.3, h: 0.5,
        fontSize: isLarge ? 36 : 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(item.label ?? '', {
        x: x + 0.15, y: y + h - 0.45, w: w - 0.3, h: 0.3,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuadrantV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.xAxis || props.yAxis) {
    slide.addText([props.xAxis, props.yAxis].filter(Boolean).join('   |   '), {
      x: 0.84375, y: 2.62, w: 7.5, h: 0.22,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  const quadrants = (props.quadrants || []).slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const colors = [COLORS.accent, COLORS.secondary, CHART_COLORS[2] || COLORS.secondary, COLORS.secondary];
  if (quadrants.length > 0) {
    const cols = 2;
    const gap = 0.24;
    const cardW = (8.3125 - gap) / cols;
    const cardH = 1.35;
    const startY = 2.95;
    quadrants.forEach((q: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: colors[idx % colors.length] }, rectRadius: 0.04,
      } as any);
      slide.addText(q.label || defaultLabels[idx] || '', {
        x: x + 0.15, y: y + 0.16, w: cardW - 0.3, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
      const items = (q.items || []).slice(0, 4).map((item: any) => typeof item === 'string' ? item : item?.value).filter(Boolean);
      if (items.length > 0) {
        slide.addText(items.map((i: string) => `> ${i}`).join('\n'), {
          x: x + 0.15, y: y + 0.52, w: cardW - 0.3, h: cardH - 0.65,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TableV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const headers = (props.headers || []).slice(0, 8);
  const rows = (props.rows || []).slice(0, 8);
  if (headers.length > 0 || rows.length > 0) {
    const tableY = 2.85;
    const tableH = 2.6;
    addTheme02Card(slide, 0.84375, tableY, 8.3125, tableH, 0.08);
    const colCount = Math.max(headers.length, rows[0]?.length || 1);
    const colW = 8.3125 / colCount;
    const headerH = 0.42;
    const rowH = (tableH - headerH) / Math.max(rows.length, 1);
    if (headers.length > 0) {
      headers.forEach((header: string, idx: number) => {
        slide.addText(header, {
          x: 0.84375 + idx * colW + 0.1, y: tableY, w: colW - 0.2, h: headerH,
          fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'middle',
        });
      });
    }
    rows.forEach((row: string[], rIdx: number) => {
      const y = tableY + headerH + rIdx * rowH;
      row.forEach((cell: string, cIdx: number) => {
        const isHighlight = props.highlightFirstColumn && cIdx === 0;
        slide.addText(cell ?? '', {
          x: 0.84375 + cIdx * colW + 0.1, y, w: colW - 0.2, h: rowH,
          fontSize: 12, color: isHighlight ? COLORS.primary : COLORS.secondary, bold: isHighlight,
          fontFace: FONTS.body, valign: 'middle',
        });
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TestimonialV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const cardX = 0.84375;
  const cardW = 8.3125;
  const cardY = 1.65;
  const cardH = 3.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addText('“', {
    x: cardX + 0.35, y: cardY + 0.25, w: 0.8, h: 0.7,
    fontSize: 72, color: COLORS.accent, fontFace: FONTS.heading,
    valign: 'top',
  });
  slide.addText(props.quote ?? '', {
    x: cardX + 0.7, y: cardY + 0.55, w: cardW - 1.4, h: 1.6,
    fontSize: 26, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.avatarUrl) {
    try {
      slide.addImage({ path: props.avatarUrl, x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7 });
    } catch {
      slide.addShape('ellipse', {
        x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7,
        fill: { color: COLORS.border },
      } as any);
    }
  } else {
    slide.addShape('ellipse', {
      x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7,
      fill: { color: COLORS.border },
    } as any);
  }
  const metaY = cardY + 2.45;
  if (props.author) {
    slide.addText(props.author, {
      x: cardX + 1.6, y: metaY, w: 4, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.role || props.company) {
    slide.addText([props.role, props.company].filter(Boolean).join(' · '), {
      x: cardX + 1.6, y: metaY + 0.28, w: 4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TagsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tags = (props.tags || []).slice(0, 24);
  if (tags.length > 0) {
    const cardY = 2.8;
    const cardH = 2.55;
    addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
    const cols = 4;
    const rows = Math.ceil(tags.length / cols);
    const tagW = 1.9;
    const tagH = 0.34;
    const gapX = (8.3125 - cols * tagW) / (cols + 1);
    const gapY = (cardH - rows * tagH) / (rows + 1);
    tags.forEach((tag: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + gapX + col * (tagW + gapX);
      const y = cardY + gapY + row * (tagH + gapY);
      const label = typeof tag === 'string' ? tag : tag.label ?? '';
      const value = typeof tag === 'string' ? undefined : tag.value;
      const text = value ? `${label}  ${value}` : label;
      slide.addShape('roundRect', {
        x, y, w: tagW, h: tagH,
        fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 }, rectRadius: 0.06,
      } as any);
      slide.addText(text, {
        x: x + 0.08, y, w: tagW - 0.16, h: tagH,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ProgressV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || [])
    .filter((item: any) => item != null)
    .map((item: any) => {
      const value = Number(item.value) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.round((value / max) * 1000) / 10) : 0;
      return { ...item, value, max, pct };
    })
    .slice(0, 6);
  if (items.length > 0) {
    const cardY = 2.8;
    const cardH = 2.55;
    addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
    const itemH = cardH / items.length;
    items.forEach((item: any, idx: number) => {
      const y = cardY + idx * itemH;
      const labelY = y + 0.12;
      slide.addText(item.label ?? '', {
        x: 0.99375, y: labelY, w: 4, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`${item.value}${item.unit ?? ''}`, {
        x: 5.5, y: labelY, w: 1.2, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(`${item.pct}%`, {
        x: 6.8, y: labelY, w: 1.2, h: 0.28,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      const barY = y + 0.45;
      const barH = 0.1;
      const barW = 8.0125;
      slide.addShape('roundRect', {
        x: 0.99375, y: barY, w: barW, h: barH,
        fill: { color: COLORS.border }, rectRadius: 0.05,
      } as any);
      if (item.pct > 0) {
        slide.addShape('roundRect', {
          x: 0.99375, y: barY, w: barW * (item.pct / 100), h: barH,
          fill: { color: COLORS.accent }, rectRadius: 0.05,
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FaqV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 8);
  if (items.length > 0) {
    const cols = 2;
    const rows = Math.ceil(items.length / cols);
    const gapX = 0.28;
    const gapY = 0.22;
    const cardW = (8.3125 - gapX) / cols;
    const cardH = rows <= 2 ? 1.35 : 1.05;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('rect', {
        x, y, w: 0.06, h: cardH,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText('Q', {
        x: x + 0.12, y: y + 0.12, w: 0.22, h: 0.22,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.q ?? '', {
        x: x + 0.4, y: y + 0.1, w: cardW - 0.55, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText('A', {
        x: x + 0.12, y: y + 0.42, w: 0.22, h: 0.2,
        fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.a ?? '', {
        x: x + 0.4, y: y + 0.42, w: cardW - 0.55, h: cardH - 0.58,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ProcessV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const steps = (props.steps || []).filter((s: any) => s != null);
  if (steps.length > 0) {
    const items = steps.slice(0, 6);
    const count = items.length;
    const gap = 0.22;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 1.95;
    const startY = 2.9;
    items.forEach((step: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: startY + 0.12, w: 0.5, h: 0.28,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(step.title ?? '', {
        x: x + 0.12, y: startY + 0.44, w: cardW - 0.24, h: 0.35,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(step.description ?? '', {
        x: x + 0.12, y: startY + 0.84, w: cardW - 0.24, h: cardH - 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      if (idx < items.length - 1) {
        slide.addShape('line', {
          x1: x + cardW + 0.02, y1: startY + cardH / 2, x2: x + cardW + gap - 0.02, y2: startY + cardH / 2,
          line: { color: COLORS.accent, width: 2 },
        });
        slide.addShape('triangle', {
          x: x + cardW + gap - 0.08, y: startY + cardH / 2 - 0.08, w: 0.16, h: 0.16,
          fill: { color: COLORS.accent },
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TimelineV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const milestones = (props.milestones || []).filter((m: any) => m != null && !!(m.date || m.title)).slice(0, 6);
  if (milestones.length > 0) {
    const count = milestones.length;
    const stepWidth = 8.3125 / count;
    const lineY = 3.55;
    slide.addShape('line', {
      x1: 0.84375, y1: lineY, x2: 9.15625, y2: lineY,
      line: { color: COLORS.border, width: 2 },
    });
    milestones.forEach((m: any, idx: number) => {
      const cx = 0.84375 + stepWidth * idx + stepWidth / 2;
      const isTop = idx % 2 === 0;
      const cardW = Math.min(stepWidth - 0.2, 2.0);
      const cardH = 1.15;
      const cardY = isTop ? lineY - 1.35 : lineY + 0.35;
      slide.addShape('ellipse', {
        x: cx - 0.12, y: lineY - 0.12, w: 0.24, h: 0.24,
        fill: { color: COLORS.accent },
      });
      slide.addText(m.date ?? '', {
        x: cx - stepWidth / 2 + 0.05, y: isTop ? lineY + 0.35 : lineY - 0.65, w: stepWidth - 0.1, h: 0.3,
        fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      addTheme02Card(slide, cx - cardW / 2, cardY, cardW, cardH, 0.08);
      slide.addText(m.title ?? '', {
        x: cx - cardW / 2 + 0.1, y: cardY + 0.1, w: cardW - 0.2, h: 0.3,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      slide.addText(m.description ?? '', {
        x: cx - cardW / 2 + 0.1, y: cardY + 0.44, w: cardW - 0.2, h: cardH - 0.58,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RoadmapV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const phases = (props.phases || []).filter((p: any) => p != null && !!(p.phase || (p.items && p.items.length > 0))).slice(0, 6);
  if (phases.length > 0) {
    const count = phases.length;
    const gap = 0.22;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 2.05;
    const startY = 2.9;
    phases.forEach((phase: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x: x + cardW / 2 - 0.22, y: startY - 0.18, w: 0.44, h: 0.36,
        fill: { color: COLORS.accent }, rectRadius: 0.18,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW / 2 - 0.22, y: startY - 0.18, w: 0.44, h: 0.36,
        fontSize: 12, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(phase.phase ?? '', {
        x: x + 0.12, y: startY + 0.28, w: cardW - 0.24, h: 0.35,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      const items = (phase.items || []).filter((i: any) => i != null).slice(0, 5);
      items.forEach((item: any, itemIdx: number) => {
        const value = typeof item === 'string' ? item : (item.value ?? '');
        slide.addText('• ' + value, {
          x: x + 0.12, y: startY + 0.72 + itemIdx * 0.24, w: cardW - 0.24, h: 0.22,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      });
      if (idx < phases.length - 1) {
        slide.addShape('line', {
          x1: x + cardW + 0.02, y1: startY + cardH / 2, x2: x + cardW + gap - 0.02, y2: startY + cardH / 2,
          line: { color: COLORS.accent, width: 2 },
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03SwotV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cells = [
    { key: 'S', subtitle: '优势', value: props.strength ?? '' },
    { key: 'W', subtitle: '劣势', value: props.weakness ?? '' },
    { key: 'O', subtitle: '机会', value: props.opportunity ?? '' },
    { key: 'T', subtitle: '威胁', value: props.threat ?? '' },
  ];
  const positions = [
    { x: 0.84375, y: 2.85 },
    { x: 5.15625, y: 2.85 },
    { x: 0.84375, y: 4.25 },
    { x: 5.15625, y: 4.25 },
  ];
  cells.forEach((cell, idx) => {
    const pos = positions[idx];
    addTheme02Card(slide, pos.x, pos.y, 4.0, 1.25, 0.08);
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 0.06, h: 1.25,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(cell.key, {
      x: pos.x + 0.12, y: pos.y + 0.1, w: 0.35, h: 0.32,
      fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'left', valign: 'top',
    });
    slide.addText(cell.subtitle, {
      x: pos.x + 0.5, y: pos.y + 0.12, w: 1.5, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(cell.value, {
      x: pos.x + 0.12, y: pos.y + 0.48, w: 3.76, h: 0.68,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  const value = props.value ?? '';
  const unit = props.unit ?? '';
  const valueWidth = value.length > 4 ? 5.0 : 3.5;
  slide.addText(value, {
    x: 0.84375, y: 2.2, w: valueWidth, h: 1.1,
    fontSize: 88, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (unit) {
    slide.addText(unit, {
      x: 0.84375 + valueWidth + 0.1, y: 2.8, w: 1.5, h: 0.4,
      fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.84375, y: 3.45, w: 6.0, h: 0.7,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 6);
  if (metrics.length > 0) {
    const cols = Math.min(metrics.length, 3);
    const rows = Math.ceil(metrics.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.4 : 1.1;
    const startY = 2.85;
    metrics.forEach((metric: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(`${metric.value ?? ''}${metric.unit ?? ''}`, {
        x: x + 0.15, y: y + 0.18, w: cardW - 0.3, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (metric.change) {
        slide.addText(metric.change, {
          x: x + cardW - 0.95, y: y + 0.2, w: 0.8, h: 0.25,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(metric.label ?? '', {
        x: x + 0.15, y: y + cardH - 0.45, w: cardW - 0.3, h: 0.3,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  const cardX = 0.84375;
  const cardW = 8.3125;
  const cardY = 2.5;
  const cardH = 2.0;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.08);
  slide.addShape('roundRect', {
    x: cardX + 0.25, y: cardY + 0.45, w: 0.9, h: 0.9,
    fill: { color: COLORS.accent }, rectRadius: 0.12,
  } as any);
  slide.addText(props.icon ?? '01', {
    x: cardX + 0.25, y: cardY + 0.55, w: 0.9, h: 0.7,
    fontSize: 28, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });
  slide.addText(`${props.value ?? ''}${props.unit ?? ''}`, {
    x: cardX + 1.4, y: cardY + 0.35, w: 6.0, h: 0.7,
    fontSize: 54, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.description) {
    slide.addText(props.description, {
      x: cardX + 1.4, y: cardY + 1.1, w: 6.2, h: 0.7,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricTriptych(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const panels = (props.panels || []).filter((p: any) => p != null).slice(0, 3);
  if (panels.length > 0) {
    const count = panels.length;
    const gap = 0.24;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 2.4;
    const startY = 2.8;
    panels.forEach((panel: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addText(panel.index ?? String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: startY + 0.12, w: 0.6, h: 0.25,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(panel.title ?? '', {
        x: x + 0.75, y: startY + 0.12, w: cardW - 0.9, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`${panel.value ?? ''}`, {
        x: x + 0.12, y: startY + 0.55, w: cardW - 0.24, h: 0.55,
        fontSize: 32, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      const data = (panel.chartData || []).filter((v: any) => typeof v === 'number').slice(0, 8);
      if (data.length >= 2) {
        const chartY = startY + 1.2;
        const chartH = 0.55;
        const max = Math.max(...data, 1);
        const step = (cardW - 0.34) / data.length;
        const barW = step * 0.6;
        data.forEach((v: number, i: number) => {
          const h = chartH * (v / max);
          slide.addShape('roundRect', {
            x: x + 0.12 + i * step + (step - barW) / 2,
            y: chartY + chartH - h,
            w: barW,
            h: Math.max(h, 0.05),
            fill: { color: COLORS.accent },
            rectRadius: 0.02,
          } as any);
        });
      }
      if (panel.subtitle) {
        slide.addText(panel.subtitle, {
          x: x + 0.12, y: startY + cardH - 0.45, w: cardW - 0.24, h: 0.35,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ScorecardV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 8);
  if (items.length > 0) {
    const cols = items.length > 4 ? 2 : 1;
    const gapX = 0.4;
    const gapY = 0.28;
    const colW = (8.3125 - gapX * (cols - 1)) / cols;
    const rows = Math.ceil(items.length / cols);
    const rowH = (2.6 - gapY * (rows - 1)) / rows;
    const startY = 2.8;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (colW + gapX);
      const y = startY + row * (rowH + gapY);
      const score = Number(item.score) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;
      slide.addText(item.label ?? '', {
        x, y, w: colW - 1.2, h: 0.25,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`${score} / ${max}`, {
        x: x + colW - 1.1, y, w: 1.1, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addShape('roundRect', {
        x, y: y + 0.32, w: colW, h: 0.08,
        fill: { color: COLORS.border }, rectRadius: 0.04,
      } as any);
      if (pct > 0) {
        slide.addShape('roundRect', {
          x, y: y + 0.32, w: colW * (pct / 100), h: 0.08,
          fill: { color: COLORS.accent }, rectRadius: 0.04,
        } as any);
      }
      if (item.note) {
        slide.addText(item.note, {
          x, y: y + 0.5, w: colW, h: rowH - 0.6,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03AppendixV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const sources = (props.sources || []).filter((s: any) => s != null).slice(0, 10);
  if (sources.length > 0) {
    const startY = 2.85;
    sources.forEach((source: any, idx: number) => {
      const y = startY + idx * 0.34;
      slide.addShape('line', {
        x1: 0.84375, y1: y + 0.32, x2: 9.15625, y2: y + 0.32,
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(source.label ?? '', {
        x: 0.84375, y, w: 2.5, h: 0.25,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(source.value ?? '', {
        x: 3.5, y, w: 5.5, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CaseStudy(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.3,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const leftW = 5.0;
  if (props.intro) {
    slide.addText(props.intro, {
      x: 0.84375, y: 2.7, w: leftW, h: 0.7,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const rounds = (props.rounds || []).filter((r: any) => r != null && !!(r.date || r.round || r.amount)).slice(0, 6);
  if (rounds.length > 0) {
    const startY = 3.55;
    rounds.forEach((round: any, idx: number) => {
      const y = startY + idx * 0.5;
      slide.addShape('ellipse', {
        x: 0.84375, y: y + 0.05, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(round.date ?? '', {
        x: 1.05, y, w: 1.0, h: 0.2,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(round.round ?? '', {
        x: 1.05, y: y + 0.2, w: 1.8, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(round.valuation ?? '', {
        x: 3.0, y: y + 0.05, w: 1.3, h: 0.2,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(round.amount ?? '', {
        x: 3.0, y: y + 0.25, w: 1.3, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
    });
  }
  if (props.quote) {
    const cardX = 6.0;
    const cardY = 2.7;
    const cardW = 3.15625;
    const cardH = 1.9;
    addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.08);
    slide.addText('“', {
      x: cardX + 0.15, y: cardY + 0.1, w: 0.5, h: 0.4,
      fontSize: 36, color: COLORS.accent, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(props.quote, {
      x: cardX + 0.25, y: cardY + 0.45, w: cardW - 0.45, h: 1.0,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    if (props.quoteAuthor) {
      slide.addText(`—— ${props.quoteAuthor}`, {
        x: cardX + 0.25, y: cardY + cardH - 0.4, w: cardW - 0.45, h: 0.25,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
      });
    }
  }
  addTheme03Footer(slide, props);
}

function renderTheme03OutlookV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 3);
  if (items.length > 0) {
    const cols = items.length;
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = 2.3;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 0.12, w: 0.4, h: 0.4,
        fill: { color: COLORS.accent }, rectRadius: 0.2,
      } as any);
      slide.addText(String(idx + 1), {
        x: x + 0.12, y: startY + 0.15, w: 0.4, h: 0.34,
        fontSize: 14, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.title ?? '', {
        x: x + 0.62, y: startY + 0.15, w: cardW - 0.8, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`趋势：${item.trend ?? ''}`, {
        x: x + 0.12, y: startY + 0.65, w: cardW - 0.24, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`行动：${item.action ?? ''}`, {
        x: x + 0.12, y: startY + 0.95, w: cardW - 0.24, h: 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RegionV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const regions = (props.regions || []).filter((r: any) => r != null).slice(0, 6);
  if (regions.length > 0) {
    const cols = Math.min(regions.length, 3);
    const rows = Math.ceil(regions.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.3 : 1.05;
    const startY = 2.85;
    regions.forEach((region: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(region.name ?? '', {
        x: x + 0.15, y: y + 0.12, w: cardW - 0.55, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(region.change ?? '', {
        x: x + cardW - 0.9, y: y + 0.14, w: 0.75, h: 0.25,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(`${region.value ?? ''}`, {
        x: x + 0.15, y: y + cardH - 0.7, w: cardW - 0.3, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (region.note) {
        slide.addText(region.note, {
          x: x + 0.15, y: y + cardH - 0.32, w: cardW - 0.3, h: 0.3,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RiskV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 4);
  if (items.length > 0) {
    const cols = Math.min(items.length, 2);
    const rows = Math.ceil(items.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.3 : 1.05;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('rect', {
        x, y, w: 0.06, h: cardH,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(item.risk ?? '', {
        x: x + 0.15, y: y + 0.12, w: cardW - 0.7, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`影响：${item.impact ?? ''}`, {
        x: x + 0.15, y: y + 0.5, w: cardW - 0.3, h: 0.22,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`应对：${item.response ?? ''}`, {
        x: x + 0.15, y: y + 0.76, w: cardW - 0.3, h: cardH - 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03SpotlightGrid(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).filter((c: any) => c != null).slice(0, 4);
  if (columns.length > 0) {
    const cols = columns.length <= 2 ? columns.length : 2;
    const rows = Math.ceil(columns.length / cols);
    const gapX = 0.24;
    const gapY = 0.24;
    const cardW = (8.3125 - gapX * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.6 : 1.25;
    const startY = 2.85;
    columns.forEach((col: any, idx: number) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = 0.84375 + c * (cardW + gapX);
      const y = startY + r * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      if (col.tag) {
        slide.addText(col.tag, {
          x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.22,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
        });
      }
      slide.addShape('roundRect', {
        x: x + 0.12,
        y: y + 0.36,
        w: cardW - 0.24,
        h: cardH - 0.9,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.06,
      } as any);
      slide.addText('（图片）', {
        x: x + 0.12,
        y: y + 0.36 + (cardH - 0.9) / 2 - 0.12,
        w: cardW - 0.24,
        h: 0.24,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono, valign: 'middle',
      });
      slide.addText(col.title ?? '', {
        x: x + 0.12, y: y + cardH - 0.45, w: cardW - 0.24, h: 0.25,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ConclusionV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const points = (props.points || [])
    .map((p: any) => typeof p === 'string' ? p : p?.item)
    .filter(Boolean)
    .slice(0, 4);
  if (points.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const count = points.length;
  const gap = 0.22;
  const cardW = (8.3125 - gap * (count - 1)) / count;
  const startX = 0.84375;
  const y = 2.85;
  const h = 2.55;
  points.forEach((point: string, idx: number) => {
    const x = startX + idx * (cardW + gap);
    addTheme02Card(slide, x, y, cardW, h, 0.08);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: y + 0.14, w: 0.6, h: 0.32,
      fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
    });
    slide.addText(point, {
      x: x + 0.12, y: y + 0.58, w: cardW - 0.24, h: h - 0.74,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03DiptychContrast(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const left = props.left || {};
  const right = props.right || {};
  const centerCard = props.centerCard || {};
  const comparisons = (centerCard.comparisons || []).slice(0, 3);

  // 左右背景区
  const sideY = 2.85;
  const sideW = 2.5;
  const sideH = 2.55;
  addTheme02Card(slide, 0.84375, sideY, sideW, sideH, 0.08);
  addTheme02Card(slide, 6.65625, sideY, sideW, sideH, 0.08);
  if (left.imageUrl) {
    try {
      slide.addImage({ path: left.imageUrl, x: 0.94375, y: sideY + 0.1, w: sideW - 0.2, h: sideH - 0.9 });
    } catch {
      // ignore
    }
  }
  if (right.imageUrl) {
    try {
      slide.addImage({ path: right.imageUrl, x: 6.75625, y: sideY + 0.1, w: sideW - 0.2, h: sideH - 0.9 });
    } catch {
      // ignore
    }
  }
  slide.addText(left.labelEn || '', {
    x: 0.84375, y: sideY + 0.12, w: sideW, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono,
  });
  slide.addText(left.label || '', {
    x: 0.84375, y: sideY + sideH - 0.6, w: sideW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(right.labelEn || '', {
    x: 6.65625, y: sideY + 0.12, w: sideW, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono,
  });
  slide.addText(right.label || '', {
    x: 6.65625, y: sideY + sideH - 0.6, w: sideW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  // 中央结论卡
  const centerX = 3.59375;
  const centerW = 2.8125;
  const centerH = 2.55;
  addTheme02Card(slide, centerX, sideY, centerW, centerH, 0.08);
  if (centerCard.title) {
    slide.addText(centerCard.title, {
      x: centerX + 0.12, y: sideY + 0.14, w: centerW - 0.24, h: 0.32,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
  }
  comparisons.forEach((item: any, index: number) => {
    const y = sideY + 0.55 + index * 0.58;
    slide.addText(item.leftValue || '', {
      x: centerX + 0.12, y, w: 0.9, h: 0.22,
      fontSize: 13, color: COLORS.secondary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.leftLabel || '', {
      x: centerX + 0.12, y: y + 0.2, w: 0.9, h: 0.16,
      fontSize: 9, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText('VS', {
      x: centerX + centerW / 2 - 0.25, y, w: 0.5, h: 0.22,
      fontSize: 10, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(item.rightValue || '', {
      x: centerX + centerW - 1.02, y, w: 0.9, h: 0.22,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'left', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.rightLabel || '', {
      x: centerX + centerW - 1.02, y: y + 0.2, w: 0.9, h: 0.16,
      fontSize: 9, color: COLORS.secondary, align: 'left', valign: 'middle', fontFace: FONTS.body,
    });
  });
  if (centerCard.conclusion) {
    slide.addText(centerCard.conclusion, {
      x: centerX + 0.12, y: sideY + centerH - 0.55, w: centerW - 0.24, h: 0.45,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FilmstripV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const images = (props.images || []).slice(0, 5);
  if (images.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const gap = 0.2;
  const frameW = (8.3125 - gap * (images.length - 1)) / images.length;
  const startX = 0.84375;
  const y = 2.85;
  const imgH = 2.0;
  images.forEach((image: any, index: number) => {
    const x = startX + index * (frameW + gap);
    addTheme02Card(slide, x, y, frameW, imgH + 0.5, 0.08);
    slide.addShape('roundRect', {
      x, y, w: frameW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(String(index + 1).padStart(2, '0'), {
      x: x + frameW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
    });
    if (image.url) {
      try {
        slide.addImage({ path: image.url, x: x + 0.08, y: y + 0.22, w: frameW - 0.16, h: imgH - 0.22 });
      } catch {
        slide.addText('（图片）', {
          x: x + 0.08, y: y + imgH / 2, w: frameW - 0.16, h: 0.3,
          fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
        });
      }
    }
    if (image.caption) {
      slide.addText(image.caption, {
        x, y: y + imgH + 0.08, w: frameW, h: 0.3,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });
  addTheme03Footer(slide, props);
}

function renderTheme03GanttV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tasks = (props.tasks || []).slice(0, 8);
  const phases = (props.phases?.length ? props.phases : ['Q1', 'Q2', 'Q3', 'Q4']).slice(0, 6);
  const chartColors = ['00B4FF', 'FF2A6D', '8B5CF6', '8A8F99', '22D3EE', 'FF9F1C', 'FF7B54', '6B21A8'];
  const cardY = 2.85;
  const cardH = 2.55;
  addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
  if (tasks.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }

  const startX = 0.84375;
  const endX = 9.15625;
  const totalW = endX - startX;
  const headerY = cardY + 0.2;
  const bodyY = cardY + 0.65;
  const rowH = (cardH - 0.85) / Math.max(tasks.length, 1);
  const phaseW = totalW / phases.length;

  phases.forEach((phase: string, i: number) => {
    const x = startX + i * phaseW;
    slide.addText(phase, {
      x, y: headerY, w: phaseW, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    if (i > 0) {
      slide.addShape('line', {
        x1: x, y1: headerY, x2: x, y2: cardY + cardH - 0.1,
        line: { color: COLORS.border, width: 1 },
      });
    }
  });

  tasks.forEach((task: any, index: number) => {
    const y = bodyY + index * rowH;
    const start = Math.max(0, Math.min(100, task.start ?? 0));
    const end = Math.max(start, Math.min(100, task.end ?? 100));
    const barX = startX + (start / 100) * totalW;
    const barW = ((end - start) / 100) * totalW;
    const color = task.color ? task.color.replace('#', '') : chartColors[index % chartColors.length];
    slide.addText(task.name || '', {
      x: startX + 0.1, y, w: 1.8, h: rowH,
      fontSize: 11, color: COLORS.primary, align: 'left', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addShape('rect', {
      x: Math.max(startX + 2.0, barX), y: y + rowH * 0.25, w: Math.max(0.04, barW), h: rowH * 0.5,
      fill: { color }, rectRadius: 0.04,
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03PestV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cells = [
    { key: 'P', subtitle: '政治环境', value: props.political ?? '', color: COLORS.accent },
    { key: 'E', subtitle: '经济环境', value: props.economic ?? '', color: COLORS.secondary },
    { key: 'S', subtitle: '社会环境', value: props.social ?? '', color: '8B5CF6' },
    { key: 'T', subtitle: '技术环境', value: props.technological ?? '', color: '8A8F99' },
  ];
  const positions = [
    { x: 0.84375, y: 2.85 },
    { x: 5.15625, y: 2.85 },
    { x: 0.84375, y: 4.25 },
    { x: 5.15625, y: 4.25 },
  ];
  cells.forEach((cell, idx) => {
    const pos = positions[idx];
    addTheme02Card(slide, pos.x, pos.y, 4.0, 1.25, 0.08);
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 0.06, h: 1.25,
      fill: { color: cell.color },
    } as any);
    slide.addText(cell.key, {
      x: pos.x + 0.12, y: pos.y + 0.1, w: 0.35, h: 0.32,
      fontSize: 18, color: cell.color, bold: true, fontFace: FONTS.mono, align: 'left', valign: 'top',
    });
    slide.addText(cell.subtitle, {
      x: pos.x + 0.5, y: pos.y + 0.12, w: 1.5, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(cell.value, {
      x: pos.x + 0.12, y: pos.y + 0.48, w: 3.76, h: 0.68,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03StatsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const stats = (props.stats || []).filter((s: any) => s != null).slice(0, 6);
  if (stats.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const cols = Math.min(stats.length, 3);
  const rows = Math.ceil(stats.length / cols);
  const gap = 0.24;
  const cardW = (8.3125 - (cols - 1) * gap) / cols;
  const cardH = rows === 1 ? 2.55 : 1.15;
  const startY = 2.85;
  stats.forEach((stat: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 0.84375 + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    addTheme02Card(slide, x, y, cardW, cardH, 0.08);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(`${stat.value ?? ''}${stat.unit ?? ''}`, {
      x: x + 0.12, y: y + 0.14, w: cardW - 0.24, h: 0.45,
      fontSize: 26, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: x + cardW - 0.95, y: y + 0.16, w: 0.8, h: 0.25,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
    }
    slide.addText(stat.label ?? '', {
      x: x + 0.12, y: y + cardH - 0.42, w: cardW - 0.24, h: 0.28,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03TableData(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).filter((c: any) => c.key && c.label);
  const rows = (props.rows || []).filter((r: any) => r != null).slice(0, 12);
  const effectiveHighlightRow = props.highlightRow ?? (Array.isArray(props.highlightRows) && props.highlightRows.length ? props.highlightRows[0] : undefined);

  const tableY = 2.85;
  const tableH = 2.55;
  addTheme02Card(slide, 0.84375, tableY, 8.3125, tableH, 0.08);

  if (columns.length === 0 || rows.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }

  const tableW = 8.3125;
  const startX = 0.84375;
  const headerH = 0.42;
  const rowH = (tableH - headerH) / Math.max(rows.length, 1);
  const colW = tableW / columns.length;

  columns.forEach((column: any, index: number) => {
    const x = startX + index * colW;
    slide.addText(column.label || '', {
      x: x + 0.1, y: tableY, w: colW - 0.2, h: headerH,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: column.align || 'left', valign: 'middle',
    });
  });

  rows.forEach((row: any, rowIndex: number) => {
    const y = tableY + headerH + rowIndex * rowH;
    const isHighlight = effectiveHighlightRow === rowIndex;
    columns.forEach((column: any, colIndex: number) => {
      const x = startX + colIndex * colW;
      slide.addText(row[column.key || ''] ?? '', {
        x: x + 0.1, y, w: colW - 0.2, h: rowH,
        fontSize: 11, color: isHighlight ? COLORS.accent : COLORS.secondary,
        bold: isHighlight,
        align: column.align || 'left', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.number ?? String(props._slideIdx ?? 1).padStart(2, '0'), {
    x: 0.84375, y: 1.55, w: 2.6, h: 1.5,
    fontSize: 120, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 3.6, y: 1.7, w: 5.5, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 3.6, y: props.kicker ? 2.0 : 1.7, w: 5.5, h: 1.0,
    fontSize: 46, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 3.6, y: 3.05, w: 5.0, h: 0.7,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '05080D', transparency: 55 },
  } as any);
  const cardW = 6.5;
  const cardH = 2.4;
  const cardX = 0.84375;
  const cardY = 2.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.25, y: cardY + (props.kicker ? 0.55 : 0.25), w: cardW - 0.5, h: 0.9,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.25, y: cardY + 1.55, w: cardW - 0.5, h: 0.6,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ClosingV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const centerX = 5.0;
  const cardW = 6.5;
  const cardH = 3.2;
  const cardX = centerX - cardW / 2;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center',
    });
  }
  slide.addText(theme03TitleText(props.title ?? '感谢阅读'), {
    x: cardX + 0.3, y: cardY + (props.kicker ? 0.65 : 0.3), w: cardW - 0.6, h: 0.9,
    fontSize: 48, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.5, y: cardY + 1.6, w: cardW - 1.0, h: 0.5,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
    });
  }
  if (props.cta) {
    slide.addText(props.cta, {
      x: cardX + 2.0, y: cardY + 2.2, w: 2.5, h: 0.35,
      fontSize: 13, color: COLORS.white, fill: { color: COLORS.accent },
      align: 'center', valign: 'middle', fontFace: FONTS.body,
    } as any);
  }
  const contacts = [props.contact, props.email, props.link].filter(Boolean).join('  ·  ');
  if (contacts) {
    slide.addText(contacts, {
      x: cardX + 0.3, y: cardY + 2.75, w: cardW - 0.6, h: 0.22,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ComparisonV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cards = (props.cards || []).slice(0, 4);
  if (cards.length > 0) {
    const cols = cards.length <= 2 ? 2 : Math.min(cards.length, 4);
    const rows = Math.ceil(cards.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.4 : 1.5;
    const startY = 2.85;
    cards.forEach((card: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(card.label ?? '', {
        x: x + 0.15, y: y + 0.18, w: cardW - 0.3, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      const score = typeof card.score === 'number' ? card.score : Number(card.score) || 0;
      const max = (typeof card.max === 'number' && card.max > 0) ? card.max : Number(card.max) || 100;
      slide.addText(`${score} / ${max}`, {
        x: x + 0.15, y: y + 0.55, w: cardW - 0.3, h: 0.35,
        fontSize: 28, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      const pct = Math.min(100, Math.max(0, (score / max) * 100));
      addTheme02Card(slide, x + 0.15, y + 0.98, cardW - 0.3, 0.1, 0.05);
      slide.addShape('roundRect', {
        x: x + 0.15, y: y + 0.98, w: (cardW - 0.3) * (pct / 100), h: 0.1,
        fill: { color: COLORS.accent }, rectRadius: 0.05,
      } as any);
      if (card.note) {
        slide.addText(card.note, {
          x: x + 0.15, y: y + 1.2, w: cardW - 0.3, h: cardH - 1.35,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ComparisonV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const rows = (props.rows || []).slice(0, 6);
  if (rows.length > 0) {
    const tableY = 2.85;
    const tableH = 2.5;
    const tableW = 8.3125;
    const rowH = tableH / (rows.length + 1);
    const colW = tableW / 3;
    addTheme02Card(slide, 0.84375, tableY, tableW, tableH, 0.08);
    const headers = ['维度', props.leftTitle ?? '方案 A', props.rightTitle ?? '方案 B'];
    headers.forEach((header: string, idx: number) => {
      slide.addText(header, {
        x: 0.84375 + idx * colW + 0.1, y: tableY, w: colW - 0.2, h: rowH,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: idx === 0 ? 'left' : 'center', valign: 'middle',
      });
    });
    rows.forEach((row: any, rowIndex: number) => {
      const y = tableY + (rowIndex + 1) * rowH;
      [row.feature, row.left, row.right].forEach((cell: any, idx: number) => {
        slide.addText(cell ?? '', {
          x: 0.84375 + idx * colW + 0.1, y, w: colW - 0.2, h: rowH,
          fontSize: 12, color: idx === 0 ? COLORS.primary : COLORS.secondary,
          bold: idx === 0,
          align: idx === 0 ? 'left' : 'center', valign: 'middle', fontFace: FONTS.body,
        });
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const left = (props.leftPoints || []).slice(0, 6);
  const right = (props.rightPoints || []).slice(0, 6);
  const colW = 3.9;
  const colH = 2.5;
  const startY = 2.85;
  const gap = 0.5;
  [left, right].forEach((points, colIdx) => {
    const x = 0.84375 + colIdx * (colW + gap);
    addTheme02Card(slide, x, startY, colW, colH, 0.08);
    slide.addText(points.map((p: any) => `• ${p}`).join('\n'), {
      x: x + 0.2, y: startY + 0.2, w: colW - 0.4, h: colH - 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).slice(0, 3);
  if (columns.length > 0) {
    const colW = (8.3125 - (columns.length - 1) * 0.25) / columns.length;
    const startY = 2.85;
    columns.forEach((col: any, idx: number) => {
      const x = 0.84375 + idx * (colW + 0.25);
      addTheme02Card(slide, x, startY, colW, 2.4, 0.08);
      slide.addShape('roundRect', {
        x, y: startY, w: colW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(col.title ?? '', {
        x: x + 0.15, y: startY + 0.2, w: colW - 0.3, h: 0.35,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      if (col.text) {
        slide.addText(col.text, {
          x: x + 0.15, y: startY + 0.65, w: colW - 0.3, h: 1.6,
          fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV4(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const cardW = 8.3125;
  const cardH = 3.0;
  const cardX = 0.84375;
  const cardY = 1.6;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.3, y: cardY + (props.kicker ? 0.65 : 0.3), w: cardW - 0.6, h: 1.4,
    fontSize: 54, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.3, y: cardY + 2.1, w: cardW - 0.6, h: 0.6,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  if (props.image) {
    addImageMaybe(slide, props.image, 0, 0, 10, 5.625);
  }
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '05080D', transparency: 50 },
  } as any);
  const cardW = 5.2;
  const cardH = 3.2;
  const cardX = 0.84375;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.25, y: cardY + (props.kicker ? 0.55 : 0.25), w: cardW - 0.5, h: 1.2,
    fontSize: 48, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.25, y: cardY + 1.85, w: cardW - 0.5, h: 0.6,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.date) {
    slide.addText(props.date, {
      x: cardX + 0.25, y: cardY + 2.65, w: cardW - 0.5, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const mainW = 5.4;
  const mainH = 3.2;
  const mainX = 0.84375;
  const mainY = 1.4;
  addTheme02Card(slide, mainX, mainY, mainW, mainH, 0.12);
  slide.addShape('line', {
    x1: mainX, y1: mainY, x2: mainX, y2: mainY + mainH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: mainX + 0.25, y: mainY + 0.25, w: mainW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: mainX + 0.25, y: mainY + (props.kicker ? 0.55 : 0.25), w: mainW - 0.5, h: 1.4,
    fontSize: 44, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: mainX + 0.25, y: mainY + 2.0, w: mainW - 0.5, h: 0.8,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const bentoW = 2.5;
  const bentoH = 1.5;
  const bentoX = mainX + mainW + 0.25;
  addTheme02Card(slide, bentoX, mainY, bentoW, bentoH, 0.08);
  slide.addText(props.presenter ?? 'lemonPPT Research', {
    x: bentoX + 0.15, y: mainY + 0.55, w: bentoW - 0.3, h: 0.4,
    fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'middle',
  });
  addTheme02Card(slide, bentoX, mainY + bentoH + 0.2, bentoW, bentoH, 0.08);
  slide.addText([props.date, 'Theme 03'].filter(Boolean).join(' · '), {
    x: bentoX + 0.15, y: mainY + bentoH + 0.75, w: bentoW - 0.3, h: 0.4,
    fontSize: 13, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV4(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.kicker || 'FEATURED STORY', {
    x: 0.84375, y: 1.55, w: 4.0, h: 0.25,
    fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
  });
  slide.addText(props.edition || 'ED. 01', {
    x: 5.5, y: 1.55, w: 3.5, h: 0.25,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
  });
  slide.addShape('line', {
    x1: 0.84375, y1: 1.85, x2: 9.15625, y2: 1.85,
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 2.05, w: 8.3125, h: 1.4,
    fontSize: 72, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 3.55, w: 6.5, h: 0.6,
      fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addText([props.date, 'lemonPPT'].filter(Boolean).join(' · '), {
    x: 0.84375, y: 4.5, w: 4.0, h: 0.25,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono,
  });
  addTheme03Footer(slide, props);
}

function renderTheme03FeatureV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const imgW = 3.4;
  const imgH = 2.6;
  const imgX = 0.84375;
  const imgY = 2.75;
  addTheme02Card(slide, imgX, imgY, imgW, imgH, 0.08);
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX + 0.1, imgY + 0.1, imgW - 0.2, imgH - 0.2);
  } else {
    slide.addText('点击上传图片', {
      x: imgX, y: imgY + imgH / 2 - 0.15, w: imgW, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  const cardsX = imgX + imgW + 0.35;
  const cardsW = 4.6;
  const items = (props.items || []).slice(0, 5);
  if (items.length > 0) {
    const cardH = items.length <= 3 ? 0.75 : 0.6;
    const gap = 0.12;
    items.forEach((item: any, idx: number) => {
      const y = imgY + idx * (cardH + gap);
      addTheme02Card(slide, cardsX, y, cardsW, cardH, 0.06);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: cardsX + 0.12, y: y + 0.12, w: 0.6, h: 0.4,
        fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(item.title ?? '', {
        x: cardsX + 0.8, y: y + 0.08, w: cardsW - 0.95, h: 0.25,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      if (item.description) {
        slide.addText(item.description, {
          x: cardsX + 0.8, y: y + 0.32, w: cardsW - 0.95, h: cardH - 0.42,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  if (props.footer) {
    slide.addText(props.footer, {
      x: 0.84375, y: 5.05, w: 8.3125, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText('“', {
    x: 0.84375, y: 1.4, w: 1.0, h: 1.0,
    fontSize: 100, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  const cardX = 1.9;
  const cardW = 7.25;
  const cardH = 3.2;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 1.6,
    fontSize: 34, fontFace: FONTS.heading, valign: 'top',
  });
  const attrParts = [props.author, props.role, props.source].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: cardX + 0.25, y: cardY + 2.6, w: cardW - 0.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: 0.84375, y: 1.5, w: 8.3125, h: 2.0,
    fontSize: 56, fontFace: FONTS.heading, valign: 'top',
  });
  slide.addShape('line', {
    x1: 0.84375, y1: 3.65, x2: 2.5, y2: 3.65,
    line: { color: COLORS.accent, width: 2 },
  });
  const attrParts = [props.author, props.role].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 0.84375, y: 3.85, w: 6.0, h: 0.3,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TableOfContentsV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '目录'), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).slice(0, 8);
  if (items.length > 0) {
    const startY = 2.85;
    const rowH = 0.48;
    items.forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      addTheme02Card(slide, 0.84375, y, 8.3125, 0.4, 0.06);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 1.05, y: y + 0.08, w: 0.5, h: 0.24,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'middle',
      });
      slide.addText(item ?? '', {
        x: 1.6, y: y + 0.08, w: 6.8, h: 0.24,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TeamV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const members = (props.members || []).filter((m: any) => m != null).slice(0, 3);
  if (members.length > 0) {
    const cols = members.length;
    const gap = 0.3;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = 2.6;
    const startY = 2.85;
    members.forEach((member: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y: startY, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const avatarSize = 0.9;
      const avatarX = x + (cardW - avatarSize) / 2;
      const avatarY = startY + 0.2;
      if (member.imageUrl) {
        addImageMaybe(slide, member.imageUrl, avatarX, avatarY, avatarSize, avatarSize);
      } else {
        slide.addShape('ellipse', {
          x: avatarX, y: avatarY, w: avatarSize, h: avatarSize,
          fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 },
        } as any);
        slide.addText((member.name ?? '?').charAt(0), {
          x: avatarX, y: avatarY + 0.25, w: avatarSize, h: 0.4,
          fontSize: 24, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
        });
      }
      slide.addText(member.name ?? '', {
        x: x, y: avatarY + avatarSize + 0.12, w: cardW, h: 0.28,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText(member.role ?? '', {
        x: x, y: avatarY + avatarSize + 0.45, w: cardW, h: 0.22,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
      if (member.bio) {
        slide.addText(member.bio, {
          x: x + 0.12, y: avatarY + avatarSize + 0.75, w: cardW - 0.24, h: 0.8,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

// ---- Theme04 renderers -----------------------------------------------------

export function renderTheme04Title(title: string): string {
  return title.replace(/\{\{([^}]+)\}\}/g, '$1');
}

function renderTheme04CoverV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.75, w: 8, h: 1.2,
    fontSize: 52, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.0, w: 7, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.4;
    const startX = (10 - metrics.length * cardW - (metrics.length - 1) * 0.25) / 2;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + 0.25);
      slide.addShape('roundRect', {
        x, y: 4.0, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.15, w: cardW, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.62, w: cardW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterV1(slide: PptxSlide, props: any): void {
  slide.addShape('ellipse', {
    x: 7.2, y: 1.6, w: 2.2, h: 2.2,
    fill: { color: COLORS.accent, transparency: 85 },
  } as any);

  if (props.tag) {
    slide.addShape('roundRect', {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(props.number ?? '', {
    x: 1, y: 1.6, w: 8, h: 1.4,
    fontSize: 110, color: COLORS.accent, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 3.05, w: 8, h: 0.8,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.85, w: 7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ContentV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 4.2, h: 1.0,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 4.2, h: 0.7,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const cardW = 4.1;
    const startX = 5.05;
    items.forEach((item: any, idx: number) => {
      const y = 0.85 + idx * 0.78;
      slide.addShape('roundRect', {
        x: startX, y, w: cardW, h: 0.68,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(item.title ?? '', {
        x: startX + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.22,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: startX + 0.12, y: y + 0.34, w: cardW - 0.24, h: 0.26,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04MetricV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addText(props.value ?? '', {
    x: 0.65, y: 2.45, w: 4.0, h: 1.0,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 3.2, y: 2.95, w: 1.5, h: 0.35,
      fontSize: 22, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 3.5, w: 4.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 2.05;
    const gap = 0.18;
    const startX = 0.65;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y: 4.05, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.2, w: cardW, h: 0.45,
        fontSize: 26, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.68, w: cardW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }
}

function renderTheme04ChartV1(slide: PptxSlide, props: any): void {
  const tagText = [props.kicker, props.topRightMeta].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.2, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.2, h: 0.32,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = props.labels || [];
  const data = props.data || [];
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.6 : 8.7;

  if (labels.length > 0 && data.length > 0) {
    const chartType = props.type === 'line' ? 'line' : 'bar';
    slide.addChart(chartType as 'bar' | 'line', [{
      name: props.title || '',
      labels: labels.map((l: any) => (typeof l === 'string' ? l : l.item ?? '')),
      values: data.map((d: any) => (typeof d === 'number' ? d : Number(d.item ?? 0) || 0)),
    }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    slide.addShape('roundRect', {
      x: 6.45, y: 2.25, w: 2.9, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 2.45;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: 6.65, y: cursorY, w: 2.5, h: 2.2 - cursorY + 2.25,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }
}

function renderTheme04QuoteV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  slide.addText('“', {
    x: 0.65, y: 1.25, w: 1.0, h: 0.7,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.quote ?? ''), {
    x: 0.65, y: 2.0, w: 4.6, h: 1.6,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  if (props.image) {
    addImageMaybe(slide, props.image, 5.4, 1.0, 3.95, 3.6);
  } else {
    slide.addShape('roundRect', {
      x: 5.4, y: 1.0, w: 3.95, h: 3.6,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  const attrParts = [props.author, props.role].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 0.65, y: 3.75, w: 4.6, h: 0.25,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
}

function renderTheme04ImageV1(slide: PptxSlide, props: any): void {
  if (props.image) {
    addImageMaybe(slide, props.image, 0.65, 0.65, 5.4, 4.45);
  } else {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.65, w: 5.4, h: 4.45,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 6.35, y: 0.78, w: 3.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 6.35, y: 1.2, w: 3.0, h: 1.0,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 6.35, y: 2.25, w: 3.0, h: 0.9,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 6.35, y: 3.4, w: 3.0, h: 0.4,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ClosingV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.7, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.75, w: 7, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.8, y: 3.65, w: 2.4, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    slide.addText(props.cta, {
      x: 3.8, y: 3.65, w: 2.4, h: 0.42,
      fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 1, y: 4.45, w: 8, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TableOfContentsV1(slide: PptxSlide, props: any): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 4.2, h: 1.0,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  const items = (props.items || []).slice(0, 8);
  if (items.length > 0) {
    const cardW = 4.1;
    const startX = 5.05;
    items.forEach((item: any, idx: number) => {
      const y = 0.85 + idx * 0.58;
      slide.addShape('roundRect', {
        x: startX, y, w: cardW, h: 0.5,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: startX + 0.12, y: y + 0.08, w: 0.5, h: 0.34,
        fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.title ?? '', {
        x: startX + 0.7, y: y + 0.08, w: cardW - 1.2, h: 0.34,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.page) {
        slide.addText(String(item.page), {
          x: startX + cardW - 0.5, y: y + 0.1, w: 0.4, h: 0.3,
          fontSize: 11, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
        });
      }
    });
  }
}

function renderTheme04FeatureV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const cols = Math.min(items.length, 3);
    const gap = 0.2;
    const cardW = (8.7 - gap * (cols - 1)) / cols;
    const startY = 2.35;
    const cardH = items.length > 3 ? 1.25 : 2.2;
    const toneColors: Record<string, string> = {
      green: COLORS.accent,
      pink: COLORS.secondary || 'FF6B9D',
      blue: CHART_COLORS[2] || '4ECDC4',
      yellow: CHART_COLORS[3] || 'FFD166',
    };

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const color = toneColors[item.tone ?? 'green'] || COLORS.accent;

      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addShape('roundRect', {
        x: x + 0.12, y: y + 0.12, w: 0.32, h: 0.18,
        fill: { color }, rectRadius: 0.09,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: y + 0.1, w: 0.32, h: 0.22,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', fontFace: FONTS.mono,
      });
      slide.addText(item.title ?? '', {
        x: x + 0.12, y: y + 0.42, w: cardW - 0.24, h: 0.32,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.12, y: y + 0.78, w: cardW - 0.24, h: cardH - 0.92,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04BentoV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const startY = 2.35;
    const cardH = items.length <= 4 ? 1.35 : 0.95;
    const gap = 0.18;

    if (items.length <= 2) {
      const cardW = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const x = 0.65 + idx * (cardW + gap);
        renderTheme04BentoCard(slide, item, x, startY, cardW, cardH + 0.5);
      });
    } else if (items.length === 3) {
      renderTheme04BentoCard(slide, items[0], 0.65, startY, 4.25, 2.2 + 0.5);
      renderTheme04BentoCard(slide, items[1], 5.08, startY, 4.25, 1.05 + 0.25);
      renderTheme04BentoCard(slide, items[2], 5.08, startY + 1.35, 4.25, 1.05 + 0.25);
    } else if (items.length === 4) {
      const cardW = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 0.65 + col * (cardW + gap);
        const y = startY + row * (cardH + gap);
        renderTheme04BentoCard(slide, item, x, y, cardW, cardH);
      });
    } else {
      const cols = 3;
      const cardW = (8.7 - gap * (cols - 1)) / cols;
      items.forEach((item: any, idx: number) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 0.65 + col * (cardW + gap);
        const y = startY + row * (cardH + gap);
        renderTheme04BentoCard(slide, item, x, y, cardW, cardH);
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04BentoCard(slide: PptxSlide, item: any, x: number, y: number, w: number, h: number): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  slide.addText(`${item.value ?? ''}${item.unit ?? ''}`, {
    x: x + 0.14, y: y + 0.16, w: w - 0.28, h: 0.55,
    fontSize: 32, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(item.label ?? '', {
    x: x + 0.14, y: y + 0.72, w: w - 0.28, h: 0.25,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
  });
}

function renderTheme04TeamV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const members = (props.members || []).slice(0, 6);
  if (members.length > 0) {
    const cols = members.length <= 4 ? members.length : 4;
    const rows = members.length <= 4 ? 1 : 2;
    const gap = 0.18;
    const cardW = (8.7 - gap * (cols - 1)) / cols;
    const startY = 2.35;
    const cardH = rows === 1 ? 2.55 : 1.15;

    members.forEach((member: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      renderTheme04TeamCard(slide, member, x, y, cardW, cardH);
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TeamCard(slide: PptxSlide, member: any, x: number, y: number, w: number, h: number): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);

  const avatarSize = 0.8;
  const avatarX = x + (w - avatarSize) / 2;
  const avatarY = y + 0.22;
  if (member.image) {
    addImageMaybe(slide, member.image, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    slide.addShape('ellipse', {
      x: avatarX, y: avatarY, w: avatarSize, h: avatarSize,
      fill: { color: COLORS.border },
    } as any);
  }

  slide.addText(member.name ?? '', {
    x, y: avatarY + avatarSize + 0.14, w, h: 0.28,
    fontSize: 14, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(member.role ?? '', {
    x, y: avatarY + avatarSize + 0.42, w, h: 0.22,
    fontSize: 10, color: COLORS.accent, align: 'center', fontFace: FONTS.mono,
  });
  if (member.bio) {
    slide.addText(member.bio, {
      x: x + 0.1, y: avatarY + avatarSize + 0.68, w: w - 0.2, h: 0.5,
      fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ChartDonut(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const segments = (props.segments || []).slice(0, 8).filter((s: any) => s && (s.label || s.value));
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.0 : 8.0;
  const chartX = 0.65;
  const chartY = 2.3;

  if (segments.length > 0) {
    const total = segments.reduce((sum: number, s: any) => sum + (Number(String(s.value || '0').replace(/,/g, '')) || 0), 0);
    const data = segments.map((s: any) => ({
      name: s.label || '',
      labels: [s.label || ''],
      values: [Number(String(s.value || '0').replace(/,/g, '')) || 0],
    }));

    slide.addChart('pie', data, {
      x: chartX, y: chartY, w: chartW, h: 3.0,
      chartColors: CHART_COLORS.slice(0, segments.length),
      holeSize: 55,
      showValue: false,
      showLegend: false,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    } as any);

    const centerText = props.total?.value ?? (total > 0 ? String(total) : '');
    const centerLabel = props.total?.label ?? '合计';
    if (centerText) {
      slide.addText(centerText, {
        x: chartX, y: chartY + 1.15, w: chartW, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(centerLabel, {
        x: chartX, y: chartY + 1.6, w: chartW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
      });
    }
  } else {
    slide.addText('（暂无图表数据）', {
      x: chartX, y: chartY + 1.2, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const legendX = chartX + chartW + 0.25;
  const legendW = hasInsight ? 2.9 : 3.0;
  if (segments.length > 0) {
    segments.slice(0, 5).forEach((s: any, idx: number) => {
      const y = chartY + idx * 0.48;
      const color = CHART_COLORS[idx % CHART_COLORS.length];
      slide.addShape('ellipse', {
        x: legendX, y: y + 0.1, w: 0.16, h: 0.16,
        fill: { color },
      } as any);
      slide.addText(s.label || '', {
        x: legendX + 0.24, y, w: legendW - 0.24, h: 0.22,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      const pct = totalForSegments(segments, s);
      slide.addText(`${pct}%`, {
        x: legendX + 0.24, y: y + 0.22, w: legendW - 0.24, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    const insightY = chartY + 2.6;
    slide.addShape('roundRect', {
      x: legendX, y: insightY, w: legendW, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);
    let cursorY = insightY + 0.14;
    if (insight.value) {
      slide.addText(insight.value, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 0.4,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.42;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 0.2,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.22;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 1.3 - cursorY + insightY - 0.1,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function totalForSegments(segments: any[], current: any): string {
  const total = segments.reduce((sum, s) => sum + (Number(String(s.value || '0').replace(/,/g, '')) || 0), 0);
  const value = Number(String(current.value || '0').replace(/,/g, '')) || 0;
  if (total <= 0) return '0';
  return String(Math.round((value / total) * 100));
}

function renderTheme04MetricBig(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const heroW = hasInsight ? 5.8 : 8.7;

  slide.addText(`${props.value ?? ''}${props.unit ?? ''}${props.suffix ?? ''}`, {
    x: 0.65, y: 1.6, w: heroW, h: 1.0,
    fontSize: 68, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 2.55, w: heroW, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 2.9, w: heroW - 0.5, h: 0.8,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    const ix = 6.65;
    const iw = 2.7;
    slide.addShape('roundRect', {
      x: ix, y: 1.6, w: iw, h: 2.1,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 1.78;
    if (insight.label) {
      slide.addText(insight.label, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 0.2,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
      });
      cursorY += 0.24;
    }
    if (insight.value) {
      slide.addText(insight.value, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.52;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 2.1 - cursorY + 1.6 - 0.2,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const gap = 0.18;
    const cardW = (8.7 - gap * (metrics.length - 1)) / metrics.length;
    const y = 4.05;
    metrics.forEach((m: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 1.05,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: y + 0.18, w: cardW, h: 0.42,
        fontSize: 26, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: y + 0.62, w: cardW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ProcessV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 6);
  if (steps.length > 0) {
    const gap = 0.14;
    const cardW = (8.7 - gap * (steps.length - 1)) / steps.length;
    const y = 2.6;
    const h = 2.2;

    steps.forEach((step: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);

      slide.addShape('ellipse', {
        x: x + 0.14, y: y + 0.16, w: 0.34, h: 0.34,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.14, y: y + 0.16, w: 0.34, h: 0.34,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.mono,
      });

      slide.addText(step.title ?? '', {
        x: x + 0.14, y: y + 0.6, w: cardW - 0.28, h: 0.5,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (step.description) {
        slide.addText(step.description, {
          x: x + 0.14, y: y + 1.1, w: cardW - 0.28, h: 0.9,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }

      if (idx < steps.length - 1) {
        const arrowX = x + cardW + gap / 2 - 0.1;
        slide.addShape('triangle', {
          x: arrowX, y: y + h / 2 - 0.12, w: 0.2, h: 0.24,
          fill: { color: COLORS.accent },
        } as any);
      }
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04GalleryV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 4);
  if (images.length > 0) {
    const startY = 2.35;
    const areaH = 2.8;
    const gap = 0.16;

    if (images.length === 1) {
      addImageMaybe(slide, images[0].url, 0.65, startY, 8.7, areaH);
      if (images[0].caption) {
        slide.addText(images[0].caption, {
          x: 0.65, y: startY + areaH - 0.4, w: 8.7, h: 0.3,
          fontSize: 11, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    } else if (images.length === 2) {
      const w = (8.7 - gap) / 2;
      images.forEach((img: any, idx: number) => {
        addImageMaybe(slide, img.url, 0.65 + idx * (w + gap), startY, w, areaH);
      });
    } else if (images.length === 3) {
      const w = (8.7 - gap) / 2;
      addImageMaybe(slide, images[0].url, 0.65, startY, w, areaH);
      addImageMaybe(slide, images[1].url, 0.65 + w + gap, startY, w, (areaH - gap) / 2);
      addImageMaybe(slide, images[2].url, 0.65 + w + gap, startY + (areaH + gap) / 2, w, (areaH - gap) / 2);
    } else {
      const w = (8.7 - gap) / 2;
      const h = (areaH - gap) / 2;
      images.forEach((img: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        addImageMaybe(slide, img.url, 0.65 + col * (w + gap), startY + row * (h + gap), w, h);
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04StatsV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.7,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.7, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const stats = (props.stats ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const startY = 2.2;
  stats.forEach((stat: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 2.6,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.15, y: startY + 0.15, w: 0.6, h: 0.3,
      fontSize: 14, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(stat.label?.split('·')[0]?.trim() ?? '', {
      x: x + 0.8, y: startY + 0.18, w: 1.7, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
    const valueText = `${stat.value ?? ''}${stat.unit ?? ''}`;
    slide.addText(valueText, {
      x: x + 0.15, y: startY + 0.7, w: 2.4, h: 0.7,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    slide.addText(stat.label ?? '', {
      x: x + 0.15, y: startY + 1.45, w: 2.4, h: 0.4,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
    if (stat.badge) {
      slide.addText(stat.badge, {
        x: x + 0.15, y: startY + 1.95, w: 1.6, h: 0.3,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 1.92, w: 1.66, h: 0.34,
        fill: { color: COLORS.accent }, rectRadius: 0.17,
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ComparisonV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sides = (props.sides ?? []).slice(0, 2);
  const cardW = 4.15;
  const gap = 0.4;
  sides.forEach((side: any, idx: number) => {
    const x = 0.65 + idx * (cardW + gap);
    const toneColor = idx === 0 ? COLORS.accent : COLORS.secondary;
    slide.addShape('roundRect', {
      x, y: 2.05, w: cardW, h: 3.15,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    slide.addShape('ellipse', {
      x: x + 0.2, y: 2.3, w: 0.42, h: 0.42,
      fill: { color: toneColor },
    });
    slide.addText(side.icon === 'cross' ? '×' : '✓', {
      x: x + 0.2, y: 2.32, w: 0.42, h: 0.4,
      fontSize: 18, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(side.label ?? '', {
      x: x + 0.75, y: 2.25, w: cardW - 1.0, h: 0.25,
      fontSize: 15, color: toneColor, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(side.title ?? '', {
      x: x + 0.75, y: 2.5, w: cardW - 1.0, h: 0.3,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });

    (side.items ?? []).slice(0, 5).forEach((item: any, itemIdx: number) => {
      const y = 2.95 + itemIdx * 0.42;
      slide.addShape('ellipse', {
        x: x + 0.28, y: y + 0.1, w: 0.08, h: 0.08,
        fill: { color: toneColor },
      });
      slide.addText(item.title ?? '', {
        x: x + 0.5, y, w: cardW - 0.7, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.5, y: y + 0.2, w: cardW - 0.7, h: 0.18,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  });
}

function renderTheme04TableV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cols = (props.columns ?? ['融资轮次', '事件笔数', '平均单笔', '规模对比']).slice(0, 4);
  const rows = (props.rows ?? []).slice(0, 8);
  const maxRatio = Math.max(1, ...rows.map((r: any) => Number(r.ratio) || 0));
  const startY = 2.0;
  const rowH = 0.35;
  const tableW = 8.7;

  slide.addShape('roundRect', {
    x: 0.65, y: startY, w: tableW, h: 0.35 + rows.length * rowH + (props.summary ? rowH : 0),
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);

  const colX = [0.75, 2.4, 4.1, 5.7];
  const colW = [1.5, 1.5, 1.4, 2.85];
  cols.forEach((col: string, idx: number) => {
    slide.addText(col, {
      x: colX[idx], y: startY + 0.05, w: colW[idx], h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
  });

  rows.forEach((row: any, idx: number) => {
    const y = startY + 0.35 + idx * rowH;
    slide.addText(row.name ?? '', {
      x: colX[0], y: y + 0.05, w: colW[0], h: 0.25,
      fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(row.count ?? '', {
      x: colX[1], y: y + 0.05, w: colW[1], h: 0.25,
      fontSize: 11, color: COLORS.primary, align: 'right', fontFace: FONTS.body,
    });
    slide.addText(row.avg ?? '', {
      x: colX[2], y: y + 0.05, w: colW[2], h: 0.25,
      fontSize: 11, color: COLORS.primary, align: 'right', fontFace: FONTS.body,
    });
    const barW = ((Number(row.ratio) || 0) / maxRatio) * (colW[3] - 0.2);
    if (barW > 0) {
      slide.addShape('roundRect', {
        x: colX[3], y: y + 0.12, w: barW, h: 0.1,
        fill: { color: COLORS.accent }, rectRadius: 0.05,
      } as any);
    }
  });

  if (props.summary) {
    const y = startY + 0.35 + rows.length * rowH;
    slide.addText(props.summary.label ?? '', {
      x: colX[0], y: y + 0.05, w: colW[0], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(props.summary.count ?? '', {
      x: colX[1], y: y + 0.05, w: colW[1], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(props.summary.avg ?? '', {
      x: colX[2], y: y + 0.05, w: colW[2], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
    });
  }
}

function renderTheme04TimelineV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const phases = (props.phases ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const trackY = 2.2;
  const cardY = 3.0;

  slide.addShape('line', {
    x1: startX + 0.3, y1: trackY, x2: startX + phases.length * (cardW + gap) - gap - 0.3, y2: trackY,
    line: { color: COLORS.border, width: 2 },
  } as any);

  phases.forEach((phase: any, idx: number) => {
    const cx = startX + idx * (cardW + gap) + cardW / 2;
    slide.addShape('ellipse', {
      x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
      fill: { color: COLORS.accent },
      line: { color: COLORS.surface, width: 3 },
    });
    slide.addText(String(idx + 1), {
      x: cx - 0.18, y: trackY - 0.16, w: 0.36, h: 0.36,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(phase.period ?? '', {
      x: startX + idx * (cardW + gap), y: trackY + 0.3, w: cardW, h: 0.2,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });

    const x = startX + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: cardY, w: cardW, h: 1.9,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW - 0.55, y: cardY + 0.1, w: 0.5, h: 0.4,
      fontSize: 22, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    if (phase.badge) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: cardY + 0.12, w: 1.0, h: 0.24,
        fill: { color: COLORS.accent }, rectRadius: 0.12,
      } as any);
      slide.addText(phase.badge, {
        x: x + 0.12, y: cardY + 0.12, w: 1.0, h: 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
    slide.addText(phase.title ?? '', {
      x: x + 0.12, y: cardY + 0.5, w: cardW - 0.24, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (phase.description) {
      slide.addText(phase.description, {
        x: x + 0.12, y: cardY + 0.85, w: cardW - 0.24, h: 0.85,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04RoadmapV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const baseY = 2.2;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  steps.forEach((step: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const y = baseY + idx * 0.22;
    const color = toneColors[step.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 2.55,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(step.period ?? '', {
      x: x + 0.12, y: y + 0.12, w: 1.4, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
    slide.addText(String(idx + 1), {
      x: x + cardW - 0.45, y: y + 0.08, w: 0.35, h: 0.35,
      fontSize: 18, color, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(step.title ?? '', {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (step.subtitle) {
      slide.addText(step.subtitle, {
        x: x + 0.12, y: y + 0.88, w: cardW - 0.24, h: 0.25,
        fontSize: 12, color, bold: true, fontFace: FONTS.body,
      });
    }
    if (step.description) {
      slide.addText(step.description, {
        x: x + 0.12, y: y + 1.2, w: cardW - 0.24, h: 0.95,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04RankingV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 8);
  const maxScore = Math.max(1, ...items.map((i: any) => Number(i.score) || 0));
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const rowH = 0.46;
  const startY = 2.05;

  items.forEach((item: any, idx: number) => {
    const y = startY + idx * rowH;
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x: 0.65, y: y + 0.06, w: 0.36, h: 0.36,
      fill: { color }, rectRadius: 0.18,
    } as any);
    slide.addText(String(item.rank ?? idx + 1), {
      x: 0.65, y: y + 0.08, w: 0.36, h: 0.34,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.name ?? '', {
      x: 1.15, y: y + 0.05, w: 2.4, h: 0.22,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (item.category) {
      slide.addText(item.category, {
        x: 1.15, y: y + 0.27, w: 2.4, h: 0.18,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
    }
    slide.addShape('roundRect', {
      x: 3.7, y: y + 0.18, w: 3.6, h: 0.12,
      fill: { color: COLORS.border }, rectRadius: 0.06,
    } as any);
    const barW = ((Number(item.score) || 0) / maxScore) * 3.6;
    if (barW > 0) {
      slide.addShape('roundRect', {
        x: 3.7, y: y + 0.18, w: barW, h: 0.12,
        fill: { color }, rectRadius: 0.06,
      } as any);
    }
    slide.addText(`${item.value ?? ''}${props.unit ?? ''}`, {
      x: 7.45, y: y + 0.05, w: 1.9, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });
  });
}

function renderTheme04CaseV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 4.5, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 4.2, h: 0.55,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 4.2, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.badge) {
    slide.addShape('roundRect', {
      x: 0.65, y: 1.95, w: 2.2, h: 0.28,
      fill: { color: COLORS.accent }, rectRadius: 0.14,
    } as any);
    slide.addText(props.badge, {
      x: 0.65, y: 1.95, w: 2.2, h: 0.28,
      fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }
  addImageMaybe(slide, props.imageUrl, 0.65, 2.35, 4.2, 1.4);
  if (props.quote) {
    slide.addText(props.quote, {
      x: 0.65, y: 3.85, w: 4.2, h: 0.85,
      fontSize: 11, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.75, w: 4.2, h: 0.2,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const milestones = (props.milestones ?? []).slice(0, 5);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  if (milestones.length > 0) {
    const lineH = milestones.length * 0.85;
    slide.addShape('line', {
      x1: 5.55, y1: 1.0, x2: 5.55, y2: 1.0 + lineH,
      line: { color: COLORS.border, width: 2 },
    } as any);
    milestones.forEach((m: any, idx: number) => {
      const y = 1.0 + idx * 0.85;
      const color = toneColors[m.tone ?? 'green'] || COLORS.accent;
      slide.addShape('ellipse', {
        x: 5.42, y, w: 0.26, h: 0.26,
        fill: { color },
      } as any);
      slide.addText(m.date ?? '', {
        x: 5.85, y: y - 0.02, w: 3.5, h: 0.2,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(m.title ?? '', {
        x: 5.85, y: y + 0.2, w: 3.5, h: 0.25,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      if (m.subtitle) {
        slide.addText(m.subtitle, {
          x: 5.85, y: y + 0.45, w: 3.5, h: 0.2,
          fontSize: 10, color, bold: true, fontFace: FONTS.body,
        });
      }
      if (m.description) {
        slide.addText(m.description, {
          x: 5.85, y: y + 0.65, w: 3.5, h: 0.2,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04QuadrantV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const quadrants = (props.quadrants ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const gridX = 1.2;
  const gridY = 2.05;
  const gridW = 7.6;
  const gridH = 3.25;
  const cardW = (gridW - 0.2) / 2;
  const cardH = (gridH - 0.2) / 2;

  slide.addShape('line', {
    x1: gridX + gridW / 2, y1: gridY, x2: gridX + gridW / 2, y2: gridY + gridH,
    line: { color: COLORS.border, width: 1, dash: 'dash' },
  } as any);
  slide.addShape('line', {
    x1: gridX, y1: gridY + gridH / 2, x2: gridX + gridW, y2: gridY + gridH / 2,
    line: { color: COLORS.border, width: 1, dash: 'dash' },
  } as any);

  slide.addText(props.yAxisLabel ?? '资本热度', {
    x: 0.45, y: gridY + gridH / 2 - 0.3, w: 0.6, h: 0.6,
    fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
  });
  const yLabels = (props.yAxisLabels ?? ['低', '高']) as string[];
  const xLabels = (props.xAxisLabels ?? ['低 / 待验证', '高']) as string[];
  slide.addText(yLabels[1] ?? '', {
    x: gridX - 0.4, y: gridY - 0.2, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(yLabels[0] ?? '', {
    x: gridX - 0.4, y: gridY + gridH - 0.2, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(props.xAxisLabel ?? '商业兑现度', {
    x: gridX + gridW / 2 - 0.6, y: gridY + gridH + 0.1, w: 1.2, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addText(xLabels[0] ?? '', {
    x: gridX, y: gridY + gridH + 0.1, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
  });
  slide.addText(xLabels[1] ?? '', {
    x: gridX + gridW - 0.6, y: gridY + gridH + 0.1, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.body,
  });

  quadrants.forEach((q: any, idx: number) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = gridX + col * (cardW + 0.2);
    const y = gridY + row * (cardH + 0.2);
    const color = toneColors[q.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addShape('ellipse', {
      x: x + 0.12, y: y + 0.12, w: 0.16, h: 0.16,
      fill: { color },
    } as any);
    slide.addText(q.title ?? '', {
      x: x + 0.35, y: y + 0.08, w: cardW - 0.8, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW - 0.5, y: y + 0.08, w: 0.4, h: 0.3,
      fontSize: 14, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    if (q.description) {
      slide.addText(q.description, {
        x: x + 0.12, y: y + 0.42, w: cardW - 0.24, h: cardH - 0.9,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
    (q.tags ?? []).slice(0, 5).forEach((tag: string, tidx: number) => {
      const tx = x + 0.12 + tidx * 0.95;
      const ty = y + cardH - 0.35;
      slide.addShape('roundRect', {
        x: tx, y: ty, w: 0.9, h: 0.22,
        fill: { color: COLORS.surface },
        line: { color },
        rectRadius: 0.11,
      } as any);
      slide.addText(tag, {
        x: tx, y: ty, w: 0.9, h: 0.22,
        fontSize: 8, color, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });
}

function renderTheme04AgendaV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const cardW = 2.05;
  const gap = 0.2;
  const startX = 0.65;
  const startY = 2.35;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 2.45,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(item.part ?? '', {
      x, y: startY + 0.12, w: cardW, h: 0.2,
      fontSize: 10, color, bold: true, align: 'center', fontFace: FONTS.mono,
    });
    slide.addText(String(idx + 1), {
      x: x + cardW - 0.4, y: startY + 0.1, w: 0.3, h: 0.3,
      fontSize: 16, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(item.title ?? '', {
      x: x + 0.1, y: startY + 0.45, w: cardW - 0.2, h: 0.35,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: startY + 0.85, w: cardW - 0.2, h: 1.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footnoteParts = [props.badge, props.footnote].filter(Boolean);
  if (footnoteParts.length > 0) {
    slide.addText(footnoteParts.join(' · '), {
      x: 0.65, y: 5.05, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverIndexV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.75, w: 4.2, h: 1.3,
    fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.1, w: 4.2, h: 0.6,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const cardW = 1.85;
  const gap = 0.15;
  const startX = 5.25;
  const startY = 1.3;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 3.65,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(item.number ?? '', {
      x, y: startY + 0.2, w: cardW, h: 0.5,
      fontSize: 28, color, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    slide.addText(item.title ?? '', {
      x: x + 0.1, y: startY + 0.8, w: cardW - 0.2, h: 0.45,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: startY + 1.3, w: cardW - 0.2, h: 1.8,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: 0.65, y: 5.35, w: 4.2, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 5.25, y: 5.35, w: 4.1, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterV2(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 4.8, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 4.8, h: 1.0,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 4.8, h: 0.35,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 2.8, w: 4.8, h: 1.2,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addShape('line', {
    x1: 5.5, y1: 1.0, x2: 5.5, y2: 4.6,
    line: { color: COLORS.border, width: 2 },
  } as any);
  slide.addText(props.number ?? '', {
    x: 5.6, y: 1.2, w: 3.8, h: 2.8,
    fontSize: 120, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
}

function renderTheme04ImageQuoteV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  slide.addText('"', {
    x: 0.55, y: 0.8, w: 0.6, h: 0.6,
    fontSize: 60, color: COLORS.accent, fontFace: FONTS.heading,
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 1.0, w: 5.0, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.quote ?? ''), {
    x: 0.65, y: 1.3, w: 5.0, h: 2.4,
    fontSize: 26, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.source) {
    slide.addText(props.source, {
      x: 0.65, y: 3.85, w: 5.0, h: 0.35,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.25, w: 5.0, h: 0.2,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sealX = 6.2;
  const sealY = 1.4;
  const sealR = 1.2;
  slide.addShape('ellipse', {
    x: sealX, y: sealY, w: sealR * 2, h: sealR * 2,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.accent, width: 2 },
  } as any);
  slide.addText('资本大年 · CONFIRMED', {
    x: sealX, y: sealY + 0.35, w: sealR * 2, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addText(props.value ?? '', {
    x: sealX, y: sealY + 0.65, w: sealR * 2, h: 0.7,
    fontSize: 44, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: sealX, y: sealY + 1.35, w: sealR * 2, h: 0.2,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  }
  if (props.valueLabel) {
    slide.addText(props.valueLabel, {
      x: sealX, y: sealY + 1.6, w: sealR * 2, h: 0.2,
      fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04EditorialV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.05, w: 4.3, h: 0.55,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 4.3, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addImageMaybe(slide, props.imageUrl, 0.65, 2.0, 4.3, 1.65);
  if (props.quote) {
    slide.addText(props.quote, {
      x: 0.65, y: 3.75, w: 4.3, h: 0.85,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.65, w: 4.3, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  items.forEach((item: any, idx: number) => {
    const y = 1.05 + idx * 1.1;
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x: 5.35, y, w: 4.0, h: 1.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color },
      rectRadius: 0.12,
    } as any);
    if (item.label) {
      slide.addText(item.label, {
        x: 5.47, y: y + 0.1, w: 0.5, h: 0.2,
        fontSize: 10, color, bold: true, fontFace: FONTS.mono,
      });
    }
    if (item.title) {
      slide.addText(item.title, {
        x: 5.47, y: y + 0.3, w: 3.75, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    }
    if (item.description) {
      slide.addText(item.description, {
        x: 5.47, y: y + 0.58, w: 3.75, h: 0.35,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footerParts = [props.footnoteLeft, props.footnoteRight].filter(Boolean);
  if (footerParts.length > 0) {
    slide.addText(footerParts.join(' · '), {
      x: 0.65, y: 5.3, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TriptychV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.05, w: 8.7, h: 0.5,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const panels = (props.panels ?? []).slice(0, 3);
  const gap = 0.25;
  const cardW = (8.7 - gap * (panels.length - 1)) / panels.length;
  const startX = 0.65;
  const startY = 1.95;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  panels.forEach((panel: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[panel.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 3.25,
      fill: { color: COLORS.surfaceElevated },
      line: { color },
      rectRadius: 0.12,
    } as any);
    addImageMaybe(slide, panel.imageUrl, x, startY, cardW, 2.05);
    if (panel.label) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 0.12, w: 0.55, h: 0.24,
        fill: { color }, rectRadius: 0.12,
      } as any);
      slide.addText(panel.label, {
        x: x + 0.12, y: startY + 0.12, w: 0.55, h: 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
    if (panel.title) {
      slide.addText(panel.title, {
        x: x + 0.12, y: startY + 2.15, w: cardW - 0.24, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    }
    if (panel.description) {
      slide.addText(panel.description, {
        x: x + 0.12, y: startY + 2.45, w: cardW - 0.24, h: 0.6,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footerParts = [props.footnoteLeft, props.footnoteRight].filter(Boolean);
  if (footerParts.length > 0) {
    slide.addText(footerParts.join(' · '), {
      x: 0.65, y: 5.3, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04GanttV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const periods = (props.periods ?? []).slice(0, 8);
  const lanes = (props.lanes ?? []).slice(0, 6);
  const colCount = Math.max(2, periods.length);
  const laneNameW = 1.5;
  const gridX = 0.65 + laneNameW;
  const gridW = 8.7 - laneNameW;
  const colW = gridW / colCount;
  const rowH = 0.55;
  const startY = 2.05;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  slide.addShape('roundRect', {
    x: 0.65, y: startY, w: 8.7, h: 0.45 + lanes.length * rowH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);

  periods.forEach((period: string, idx: number) => {
    slide.addText(period, {
      x: gridX + idx * colW, y: startY + 0.08, w: colW, h: 0.3,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.mono,
    });
  });

  lanes.forEach((lane: any, lidx: number) => {
    const y = startY + 0.45 + lidx * rowH;
    slide.addText(lane.name ?? '', {
      x: 0.75, y, w: laneNameW - 0.2, h: rowH,
      fontSize: 11, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    for (let i = 0; i < colCount; i++) {
      slide.addShape('line', {
        x1: gridX + i * colW, y1: y, x2: gridX + i * colW, y2: y + rowH,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    }

    (lane.tasks || []).filter((t: any) => t != null).slice(0, 6).forEach((task: any) => {
      const start = Math.max(0, Math.min(colCount - 1, Number(task.start) || 0));
      const end = Math.max(start + 1, Math.min(colCount, Number(task.end) || start + 1));
      const color = toneColors[task.tone ?? 'green'] || COLORS.accent;
      const barX = gridX + start * colW + 0.05;
      const barW = (end - start) * colW - 0.1;
      slide.addShape('roundRect', {
        x: barX, y: y + 0.12, w: barW, h: rowH - 0.24,
        fill: { color }, rectRadius: 0.08,
      } as any);
      slide.addText(task.name ?? '', {
        x: barX, y: y + 0.12, w: barW, h: rowH - 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04RadarV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels ?? []).slice(0, 8);
  const datasets = (props.datasets ?? []).slice(0, 4);
  const centerX = 5.0;
  const centerY = 3.15;
  const radius = 1.45;
  const angleStep = (Math.PI * 2) / Math.max(labels.length, 1);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  // grid circles
  [0.25, 0.5, 0.75, 1].forEach((r) => {
    slide.addShape('ellipse', {
      x: centerX - radius * r, y: centerY - radius * r * 0.75, w: radius * 2 * r, h: radius * 2 * r * 0.75,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 0.5 },
    } as any);
  });

  // axis lines + labels
  labels.forEach((label: string, idx: number) => {
    const angle = -Math.PI / 2 + idx * angleStep;
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius * 0.75;
    slide.addShape('line', {
      x1: centerX, y1: centerY, x2: x2, y2: y2,
      line: { color: COLORS.border, width: 0.5 },
    } as any);
    const lx = centerX + Math.cos(angle) * (radius + 0.35);
    const ly = centerY + Math.sin(angle) * (radius + 0.35) * 0.75 - 0.08;
    slide.addText(label, {
      x: lx - 0.6, y: ly, w: 1.2, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  });

  // datasets
  datasets.forEach((ds: any) => {
    const color = toneColors[ds.tone ?? 'green'] || COLORS.accent;
    const data = (ds.data || []).slice(0, labels.length);
    const points = data.map((v: number, idx: number) => {
      const angle = -Math.PI / 2 + idx * angleStep;
      const r = (Math.max(0, Math.min(100, Number(v) || 0)) / 100) * radius;
      return { x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r * 0.75 };
    });
    if (points.length > 2) {
      points.forEach((p: any, idx: number) => {
        const next = points[(idx + 1) % points.length];
        slide.addShape('line', {
          x1: p.x, y1: p.y, x2: next.x, y2: next.y,
          line: { color, width: 2 },
        } as any);
      });
      points.forEach((p: any) => {
        slide.addShape('ellipse', {
          x: p.x - 0.04, y: p.y - 0.04, w: 0.08, h: 0.08,
          fill: { color },
        } as any);
      });
    }
  });

  // legend
  datasets.forEach((ds: any, idx: number) => {
    const color = toneColors[ds.tone ?? 'green'] || COLORS.accent;
    const y = 2.4 + idx * 0.28;
    slide.addShape('ellipse', {
      x: 7.3, y, w: 0.12, h: 0.12,
      fill: { color },
    } as any);
    slide.addText(ds.name ?? '', {
      x: 7.5, y: y - 0.02, w: 1.85, h: 0.18,
      fontSize: 11, color: COLORS.primary, fontFace: FONTS.body,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04HeatmapV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const xLabels = (props.xLabels ?? []).slice(0, 8);
  const yLabels = (props.yLabels ?? []).slice(0, 8);
  const cells = (props.cells ?? []).filter((c: any) => c != null).slice(0, 64);
  const maxValue = Math.max(1, ...cells.map((c: any) => Number(c.value) || 0));
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const mainColor = toneColors[props.colorTone ?? 'green'] || COLORS.accent;

  const labelW = 1.4;
  const gridX = 0.65 + labelW;
  const gridY = 2.0;
  const gridW = 8.7 - labelW - 0.65;
  const gridH = 2.8;
  const colW = gridW / Math.max(xLabels.length, 1);
  const rowH = gridH / Math.max(yLabels.length, 1);

  // x labels
  xLabels.forEach((label: string, idx: number) => {
    slide.addText(label, {
      x: gridX + idx * colW, y: gridY - 0.3, w: colW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.mono,
    });
  });

  // y labels
  yLabels.forEach((label: string, idx: number) => {
    slide.addText(label, {
      x: 0.65, y: gridY + idx * rowH + rowH / 2 - 0.1, w: labelW - 0.1, h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  });

  // cells
  cells.forEach((cell: any) => {
    const cx = Math.max(0, Math.min(xLabels.length - 1, Number(cell.x) || 0));
    const cy = Math.max(0, Math.min(yLabels.length - 1, Number(cell.y) || 0));
    const value = Math.max(0, Math.min(maxValue, Number(cell.value) || 0));
    const ratio = value / maxValue;
    const x = gridX + cx * colW + 0.02;
    const y = gridY + cy * rowH + 0.02;
    const w = colW - 0.04;
    const h = rowH - 0.04;
    // interpolate color
    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    });
    const bgHex = COLORS.surfaceElevated.replace('#', '').replace(/^0x/, '');
    const fgHex = mainColor.replace('#', '').replace(/^0x/, '');
    const bg = hexToRgb(bgHex.length === 6 ? bgHex : '121212');
    const fg = hexToRgb(fgHex.length === 6 ? fgHex : '3ade80');
    const r = Math.round(bg.r + (fg.r - bg.r) * ratio);
    const g = Math.round(bg.g + (fg.g - bg.g) * ratio);
    const b = Math.round(bg.b + (fg.b - bg.b) * ratio);
    const fillColor = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color: fillColor }, rectRadius: 0.04,
    } as any);
    slide.addText(String(value), {
      x, y, w, h,
      fontSize: 10, color: ratio > 0.5 ? COLORS.white : COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverGhostV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  // 超大幽灵数字
  slide.addText(props.ghostNumber ?? '', {
    x: 0, y: 1.2, w: 10, h: 3.0,
    fontSize: 220, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.9, w: 8, h: 1.2,
    fontSize: 52, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.1, w: 7, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.4;
    const startX = (10 - metrics.length * cardW - (metrics.length - 1) * 0.25) / 2;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + 0.25);
      slide.addShape('roundRect', {
        x, y: 4.0, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.15, w: cardW, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.62, w: cardW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CardsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.9,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.05, w: 8.7, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cards = (props.cards || []).slice(0, 4);
  if (cards.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = cards.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.75;
  const cardH = 2.6;

  cards.forEach((card: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = card.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    // 卡片背景
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // 顶部彩色条
    slide.addShape('roundRect', {
      x: x + 0.08, y: y + 0.08, w: cardW - 0.16, h: 0.06,
      fill: { color }, rectRadius: 0.03,
    } as any);

    // 标签与指标
    const tagText = [card.tag, card.value ? `${card.value}${card.unit || ''}` : ''].filter(Boolean).join(' · ');
    if (tagText) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: y + 0.22, w: cardW - 0.24, h: 0.26,
        fill: { color: COLORS.border, transparency: 70 }, rectRadius: 0.13,
      } as any);
      slide.addText(tagText, {
        x: x + 0.12, y: y + 0.22, w: cardW - 0.24, h: 0.26,
        fontSize: 9, color, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }

    slide.addText(card.title ?? '', {
      x: x + 0.12, y: y + 0.6, w: cardW - 0.24, h: 0.5,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
    if (card.description) {
      slide.addText(card.description, {
        x: x + 0.12, y: y + 1.1, w: cardW - 0.24, h: 1.3,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04GaugesV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.9,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.05, w: 8.7, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const gauges = (props.gauges || []).slice(0, 3);
  if (gauges.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = gauges.length;
  const gap = 0.25;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.75;
  const cardH = 2.6;

  gauges.forEach((g: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = g.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const value = Math.max(0, Math.min(100, Number(g.value) || 0));

    // 卡片背景
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // 半圆仪表盘：使用 doughnut 图表并只取下半部分
    const chartSize = Math.min(cardW - 0.4, 1.6);
    const chartX = x + (cardW - chartSize) / 2;
    const chartY = y + 0.2;
    slide.addChart('doughnut' as 'pie', [
      { name: '已完成', labels: ['已完成', '未完成'], values: [value, 100 - value] },
    ], {
      x: chartX, y: chartY, w: chartSize, h: chartSize * 0.65,
      chartColors: [color, COLORS.border],
      showValue: false,
      holeSize: 60,
      showLegend: false,
      showTitle: false,
      dataLabelPosition: 'none',
    } as any);

    // 中心数值
    slide.addText(`${value}${g.unit || ''}`, {
      x, y: y + 0.85, w: cardW, h: 0.55,
      fontSize: 32, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });

    // 标签
    slide.addText(g.label ?? '', {
      x: x + 0.12, y: y + cardH - 0.6, w: cardW - 0.24, h: 0.4,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  });
}

function renderTheme04CoverBentoV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.55, w: 8, h: 0.9,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.45, w: 7, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const isLight = COLORS.white === 'FAFAF8';
    const toneColors: Record<string, string> = {
      green: COLORS.accent,
      pink: isLight ? 'DB2777' : 'FF6B9D',
      blue: isLight ? '0D9488' : '4ECDC4',
      yellow: isLight ? 'D97706' : 'FFD166',
    };

    const gridW = 8.7;
    const gridH = 2.1;
    const gridX = 0.65;
    const gridY = 3.0;
    const gap = 0.16;

    // 2x2 bento: large cell spans left column, others stack on right
    const leftW = gridW * 0.55;
    const rightW = gridW - leftW - gap;
    const rightH = (gridH - gap) / 2;

    items.forEach((item: any, idx: number) => {
      const tone = item.tone || 'green';
      const color = toneColors[tone] ?? COLORS.accent;
      const size = item.size || 'medium';
      let x = gridX;
      let y = gridY;
      let w = leftW;
      let h = gridH;
      let valueSize = 38;

      if (idx === 0) {
        x = gridX;
        y = gridY;
        w = leftW;
        h = gridH;
        valueSize = size === 'large' ? 44 : 38;
      } else if (idx === 1) {
        x = gridX + leftW + gap;
        y = gridY;
        w = rightW;
        h = rightH;
        valueSize = size === 'large' ? 32 : 26;
      } else if (idx === 2) {
        const hasFourth = items.length > 3;
        x = gridX + leftW + gap;
        y = gridY + rightH + gap;
        w = hasFourth ? (rightW - gap) / 2 : rightW;
        h = rightH;
        valueSize = size === 'large' ? 28 : 24;
      } else {
        x = gridX + leftW + gap + (rightW + gap) / 2;
        y = gridY + rightH + gap;
        w = (rightW - gap) / 2;
        h = rightH;
        valueSize = 22;
      }

      slide.addShape('roundRect', {
        x, y, w, h,
        fill: { color: COLORS.surfaceElevated },
        line: { color, width: 1.5 },
        rectRadius: 0.12,
      } as any);

      const valueText = `${item.value ?? ''}${item.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.14, y: y + 0.18, w: w - 0.28, h: h * 0.55,
        fontSize: valueSize, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.14, y: y + h - 0.5, w: w - 0.28, h: 0.35,
        fontSize: 11, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverMagazineV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  // Left column: title, subtitle, metadata
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.35, w: 4.3, h: 1.1,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.45, w: 4.3, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metadata = (props.metadata || []).slice(0, 4);
  if (metadata.length > 0) {
    metadata.forEach((m: any, idx: number) => {
      const y = 3.05 + idx * 0.42;
      slide.addText(m.label ?? '', {
        x: 0.65, y, w: 1.5, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addText(m.value ?? '', {
        x: 2.2, y, w: 2.75, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addShape('line', {
        x1: 0.65, y1: y + 0.28, x2: 4.95, y2: y + 0.28,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    });
  }

  // Right column: image card + caption
  const imageX = 5.35;
  const imageY = 1.2;
  const imageW = 4.0;
  const imageH = 3.4;
  slide.addShape('roundRect', {
    x: imageX, y: imageY, w: imageW, h: imageH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  if (props.image) {
    addImageMaybe(slide, props.image, imageX + 0.12, imageY + 0.12, imageW - 0.24, imageH - 0.24);
  } else {
    slide.addShape('roundRect', {
      x: imageX + 0.12, y: imageY + 0.12, w: imageW - 0.24, h: imageH - 0.24,
      fill: { color: COLORS.surface },
      rectRadius: 0.08,
    } as any);
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: imageX, y: imageY + imageH + 0.12, w: imageW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterSplitV1(slide: PptxSlide, props: any): void {
  const visualX = 0;
  const visualY = 0;
  const visualW = 6.0;
  const visualH = 5.625;

  if (props.image) {
    addImageMaybe(slide, props.image, visualX, visualY, visualW, visualH);
  } else {
    slide.addShape('rect', {
      x: visualX, y: visualY, w: visualW, h: visualH,
      fill: { color: COLORS.surfaceElevated },
    } as any);
  }

  // Right content area
  slide.addText(props.number ?? '', {
    x: 6.45, y: 1.4, w: 3.1, h: 0.7,
    fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 6.45, y: 2.05, w: 3.1, h: 0.9,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 6.45, y: 3.0, w: 3.1, h: 0.7,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addShape('line', {
    x1: 6.45, y1: 3.85, x2: 8.95, y2: 3.85,
    line: { color: COLORS.accent, width: 3 },
  } as any);
}

function renderTheme04ChapterNumberedV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.5, w: 8.7, h: 1.6,
    fontSize: 140, color: COLORS.accent, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 3.25, w: 8, h: 0.8,
    fontSize: 42, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 4.05, w: 7, h: 0.45,
      fontSize: 15, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  // Decorative circle
  slide.addShape('ellipse', {
    x: 7.6, y: 0.6, w: 1.4, h: 1.4,
    fill: { color: COLORS.accent, transparency: 85 },
  } as any);
}

function renderTheme04DeltaV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };
  const tone = props.tone || 'green';
  const color = toneColors[tone] ?? COLORS.accent;

  const cardW = 5.0;
  const cardH = 2.2;
  const cardX = (10 - cardW) / 2;
  const cardY = 2.65;

  slide.addShape('roundRect', {
    x: cardX, y: cardY, w: cardW, h: cardH,
    fill: { color: COLORS.surfaceElevated },
    line: { color, width: 2 },
    rectRadius: 0.16,
  } as any);

  const valueText = `${props.value ?? ''}${props.unit ?? ''}`;
  slide.addText(valueText, {
    x: cardX, y: cardY + 0.25, w: cardW, h: 1.0,
    fontSize: 72, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.label) {
    slide.addText(props.label, {
      x: cardX, y: cardY + cardH - 0.55, w: cardW, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const delta = props.delta ?? '';
  const isUp = !String(delta).startsWith('-');
  const arrow = isUp ? '▲' : '▼';
  slide.addText(`${arrow}  ${delta}`, {
    x: cardX + cardW + 0.35, y: cardY + 0.55, w: 2.2, h: 0.6,
    fontSize: 28, color, bold: true, fontFace: FONTS.heading,
  });
  if (props.deltaLabel) {
    slide.addText(props.deltaLabel, {
      x: cardX + cardW + 0.35, y: cardY + 1.15, w: 2.2, h: 0.3,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
}

function renderTheme04VersusV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const sides = [
    { key: 'left', side: props.left || {}, x: 0.65 },
    { key: 'right', side: props.right || {}, x: 5.45 },
  ];

  sides.forEach(({ side, x }: { side: any; x: number }) => {
    const tone = side.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y: 2.65, w: 4.0, h: 2.4,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 2 },
      rectRadius: 0.16,
    } as any);

    slide.addText(side.label ?? '', {
      x: x + 0.2, y: 2.85, w: 3.6, h: 0.35,
      fontSize: 14, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(`${side.value ?? ''}${side.unit ?? ''}`, {
      x: x + 0.2, y: 3.25, w: 3.6, h: 0.85,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  });

  // VS badge
  slide.addShape('ellipse', {
    x: 4.35, y: 3.35, w: 1.3, h: 1.3,
    fill: { color: COLORS.accent },
  } as any);
  slide.addText('VS', {
    x: 4.35, y: 3.35, w: 1.3, h: 1.3,
    fontSize: 24, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TrioV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 3);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = items.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.6;
  const cardH = 2.55;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // Top colored bar
    slide.addShape('roundRect', {
      x: x + 0.08, y: y + 0.08, w: cardW - 0.16, h: 0.06,
      fill: { color }, rectRadius: 0.03,
    } as any);

    // Image placeholder or actual image
    const imgH = cardW * 0.55;
    if (item.image) {
      addImageMaybe(slide, item.image, x + 0.1, y + 0.22, cardW - 0.2, imgH);
    } else {
      slide.addShape('roundRect', {
        x: x + 0.1, y: y + 0.22, w: cardW - 0.2, h: imgH,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 1, dash: 'dash' },
        rectRadius: 0.08,
      } as any);
    }

    const textY = y + 0.28 + imgH;
    if (item.role) {
      slide.addText(item.role, {
        x: x + 0.12, y: textY, w: cardW - 0.24, h: 0.22,
        fontSize: 9, color, bold: true, fontFace: FONTS.mono,
      });
    }
    slide.addText(item.name ?? '', {
      x: x + 0.12, y: textY + 0.22, w: cardW - 0.24, h: 0.32,
      fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.12, y: textY + 0.54, w: cardW - 0.24, h: cardH - (textY + 0.54 - y) - 0.12,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04PolaroidV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 4);
  if (images.length === 0) return;

  const areaX = 0.65;
  const areaY = 2.45;
  const areaW = 8.7;
  const areaH = 2.6;
  const gap = 0.2;

  if (images.length === 1) {
    const cardW = 3.6;
    const cardH = 2.6;
    const x = areaX + (areaW - cardW) / 2;
    const y = areaY;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    if (images[0].image) {
      addImageMaybe(slide, images[0].image, x + 0.14, y + 0.14, cardW - 0.28, cardH - 0.62);
    }
    if (images[0].caption) {
      slide.addText(images[0].caption, {
        x, y: y + cardH - 0.48, w: cardW, h: 0.34,
        fontSize: 11, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
  } else if (images.length === 2) {
    const cardW = (areaW - gap) / 2;
    const cardH = 2.6;
    images.forEach((img: any, idx: number) => {
      const x = areaX + idx * (cardW + gap);
      const y = areaY;
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.08,
      } as any);
      if (img.image) {
        addImageMaybe(slide, img.image, x + 0.12, y + 0.12, cardW - 0.24, cardH - 0.62);
      }
      if (img.caption) {
        slide.addText(img.caption, {
          x, y: y + cardH - 0.46, w: cardW, h: 0.34,
          fontSize: 10, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  } else {
    const cardW = (areaW - gap) / 2;
    const cardH = (areaH - gap) / 2;
    images.forEach((img: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = areaX + col * (cardW + gap);
      const y = areaY + row * (cardH + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.06,
      } as any);
      if (img.image) {
        addImageMaybe(slide, img.image, x + 0.1, y + 0.1, cardW - 0.2, cardH - 0.52);
      }
      if (img.caption) {
        slide.addText(img.caption, {
          x, y: y + cardH - 0.4, w: cardW, h: 0.3,
          fontSize: 9, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04VerdictV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.45, w: 8, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.35, w: 7, h: 0.45,
      fontSize: 15, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  // Seal
  const sealX = 4.0;
  const sealY = 2.95;
  const sealR = 0.9;
  slide.addShape('ellipse', {
    x: sealX, y: sealY, w: sealR * 2, h: sealR * 2,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.verdictLabel) {
    slide.addText(props.verdictLabel, {
      x: sealX, y: sealY + 0.35, w: sealR * 2, h: 0.25,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  slide.addText(props.verdict ?? '', {
    x: sealX, y: sealY + 0.6, w: sealR * 2, h: 0.7,
    fontSize: 36, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.8, y: 4.85, w: 2.4, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    slide.addText(props.cta, {
      x: 3.8, y: 4.85, w: 2.4, h: 0.42,
      fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 1, y: 5.35, w: 8, h: 0.2,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  item: any;
}

function layoutTreemap(items: any[], x: number, y: number, w: number, h: number): TreemapRect[] {
  const validItems = (items || []).filter((it) => (it.value ?? 0) > 0);
  if (validItems.length === 0) return [];
  if (validItems.length === 1) {
    return [{ x, y, w, h, item: validItems[0] }];
  }

  const total = validItems.reduce((sum, it) => sum + (it.value ?? 0), 0);
  const sorted = [...validItems].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // Split direction: favor the longer dimension
  const vertical = w >= h;
  const results: TreemapRect[] = [];
  let currentPos = vertical ? x : y;
  const primary = vertical ? w : h;

  sorted.forEach((item, idx) => {
    const ratio = (item.value ?? 0) / total;
    const size = idx === sorted.length - 1 ? (vertical ? x + w - currentPos : y + h - currentPos) : primary * ratio;
    if (vertical) {
      results.push({ x: currentPos, y, w: size, h, item });
      currentPos += size;
    } else {
      results.push({ x, y: currentPos, w, h: size, item });
      currentPos += size;
    }
  });

  return results;
}

function renderTheme04TreemapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 12);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const rects = layoutTreemap(items, chartX + 0.06, chartY + 0.06, chartW - 0.12, chartH - 0.12);
  rects.forEach(({ x, y, w, h, item }) => {
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    if (w < 0.15 || h < 0.15) return;

    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color },
      rectRadius: 0.06,
    } as any);

    const label = `${item.name ?? ''}\n${item.value ?? ''} ${props.unit ?? ''}`;
    const fontSize = Math.min(13, Math.max(8, Math.min(w, h) * 6));
    slide.addText(label, {
      x: x + 0.04, y: y + 0.04, w: w - 0.08, h: h - 0.08,
      fontSize, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04ScoreboardV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 5);
  const rows = (props.rows || []).slice(0, 8);
  if (metrics.length === 0 || rows.length === 0) return;

  const tableX = 0.65;
  const tableY = 2.45;
  const tableW = 8.7;
  const tableH = 2.7;
  const rowH = tableH / (rows.length + 1);
  const rankW = 0.5;
  const nameW = 1.8;
  const metricW = (tableW - rankW - nameW) / metrics.length;

  // Header
  slide.addShape('roundRect', {
    x: tableX, y: tableY, w: tableW, h: rowH,
    fill: { color: COLORS.surface },
    rectRadius: 0.08,
  } as any);

  const headers = ['#', '玩家', ...metrics.map((m: any) => m.label)];
  headers.forEach((text, idx) => {
    const x = idx === 0 ? tableX : idx === 1 ? tableX + rankW : tableX + rankW + nameW + (idx - 2) * metricW;
    const w = idx === 0 ? rankW : idx === 1 ? nameW : metricW;
    slide.addText(text, {
      x: x + 0.06, y: tableY, w: w - 0.12, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });

  rows.forEach((row: any, ridx: number) => {
    const y = tableY + (ridx + 1) * rowH;
    const cells = [String(row.rank ?? ridx + 1), row.name ?? '', ...(row.values || []).slice(0, metrics.length)];
    cells.forEach((text, cidx) => {
      const x = cidx === 0 ? tableX : cidx === 1 ? tableX + rankW : tableX + rankW + nameW + (cidx - 2) * metricW;
      const w = cidx === 0 ? rankW : cidx === 1 ? nameW : metricW;
      slide.addText(String(text ?? ''), {
        x: x + 0.06, y, w: w - 0.12, h: rowH,
        fontSize: 10, color: COLORS.primary, bold: cidx === 1, valign: 'middle', fontFace: FONTS.body,
      });
    });

    if (ridx < rows.length - 1) {
      slide.addShape('line', {
        x1: tableX, y1: y + rowH, x2: tableX + tableW, y2: y + rowH,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ScorecardsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const cards = (props.cards || []).slice(0, 6);
  if (cards.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = cards.length;
  const cols = count <= 2 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const gap = 0.18;
  const cardW = (8.7 - (cols - 1) * gap) / cols;
  const cardH = (2.7 - (rows - 1) * gap) / rows;
  const startX = 0.65;
  const startY = 2.45;

  cards.forEach((card: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    const tone = card.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(card.title ?? '', {
      x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.28,
      fontSize: 11, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(`${card.value ?? ''}${card.unit ?? ''}`, {
      x: x + 0.12, y: y + 0.45, w: cardW - 0.24, h: 0.55,
      fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (card.subtitle) {
      slide.addText(card.subtitle, {
        x: x + 0.12, y: y + cardH - 0.45, w: cardW - 0.24, h: 0.32,
        fontSize: 10, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MatrixV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const yAxisW = 0.35;
  const gridX = 1.0;
  const gridY = 2.45;
  const gridW = 8.0;
  const gridH = 2.65;

  // Y axis
  slide.addText(props.yAxis?.high || '高', {
    x: 0.6, y: gridY, w: yAxisW, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addShape('line', {
    x1: gridX - 0.08, y1: gridY + 0.15, x2: gridX - 0.08, y2: gridY + gridH - 0.15,
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText(props.yAxis?.low || '低', {
    x: 0.6, y: gridY + gridH - 0.35, w: yAxisW, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });

  // Cards grid
  const cols = 2;
  const rows = 2;
  const gap = 0.14;
  const cardW = (gridW - gap) / cols;
  const cardH = (gridH - gap) / rows;

  items.forEach((item: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = gridX + col * (cardW + gap);
    const y = gridY + row * (cardH + gap);
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(item.title ?? '', {
      x: x + 0.1, y: y + 0.15, w: cardW - 0.2, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: y + 0.5, w: cardW - 0.2, h: cardH - 0.6,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  // X axis
  slide.addShape('line', {
    x1: gridX + 0.1, y1: gridY + gridH + 0.1, x2: gridX + gridW - 0.1, y2: gridY + gridH + 0.1,
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText(props.xAxis?.low || '低', {
    x: gridX, y: gridY + gridH + 0.14, w: 1.0, h: 0.2,
    fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
  });
  slide.addText(props.xAxis?.high || '高', {
    x: gridX + gridW - 1.0, y: gridY + gridH + 0.14, w: 1.0, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04LayersV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const layers = (props.layers || []).slice(0, 5);
  if (layers.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const startX = 1.0;
  const startY = 2.45;
  const maxW = 8.0;
  const gap = 0.12;
  const layerH = (2.75 - (layers.length - 1) * gap) / layers.length;

  layers.forEach((layer: any, idx: number) => {
    const tone = layer.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const w = maxW * (1 - idx * 0.08);
    const x = startX + (maxW - w) / 2;
    const y = startY + idx * (layerH + gap);

    slide.addShape('roundRect', {
      x, y, w, h: layerH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.1,
    } as any);

    slide.addText(layer.title ?? '', {
      x: x + 0.2, y, w: 2.0, h: layerH,
      fontSize: 14, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.heading,
    });

    const items = (layer.items || []).slice(0, 5);
    const itemStartX = x + 2.2;
    const itemW = (w - 2.4) / Math.max(items.length, 1);
    items.forEach((item: string, iidx: number) => {
      slide.addShape('roundRect', {
        x: itemStartX + iidx * itemW + 0.04, y: y + 0.12, w: itemW - 0.08, h: layerH - 0.24,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 0.5 },
        rectRadius: 0.06,
      } as any);
      slide.addText(item ?? '', {
        x: itemStartX + iidx * itemW + 0.04, y: y + 0.12, w: itemW - 0.08, h: layerH - 0.24,
        fontSize: 8, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ScatterV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 16);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.3, right: 0.3, bottom: 0.5, left: 0.7 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const xs = items.map((item: any) => Number(item.x) || 0);
  const ys = items.map((item: any) => Number(item.y) || 0);
  const maxX = Math.max(1, ...xs);
  const maxY = Math.max(1, ...ys);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const x = plotX + (i / 4) * plotW;
    const y = plotY + (i / 4) * plotH;
    slide.addShape('line', {
      x1: x, y1: plotY, x2: x, y2: plotY + plotH,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
  }

  // Axis labels
  slide.addText(props.xAxisLabel || '', {
    x: plotX + plotW / 2 - 1, y: chartY + chartH - 0.38, w: 2, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(props.yAxisLabel || '', {
    x: chartX + 0.05, y: plotY + plotH / 2 - 0.25, w: 0.5, h: 0.5,
    fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
  });

  const maxValue = Math.max(1, ...items.map((item: any) => Number(item.value) || 0));
  items.forEach((item: any) => {
    const x = plotX + ((Number(item.x) || 0) / maxX) * plotW;
    const y = plotY + plotH - ((Number(item.y) || 0) / maxY) * plotH;
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const size = Math.max(0.12, Math.min(0.34, ((Number(item.value) || 0) / maxValue) * 0.28 + 0.1));

    slide.addShape('ellipse', {
      x: x - size / 2, y: y - size / 2, w: size, h: size,
      fill: { color },
    } as any);

    slide.addText(item.name ?? '', {
      x: x - 0.6, y: y - size / 2 - 0.22, w: 1.2, h: 0.18,
      fontSize: 8, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  });
}

function renderTheme04SlopeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const maxRank = Math.max(1, ...items.map((item: any) => Math.max(Number(item.previous) || 0, Number(item.current) || 0)));
  const leftX = chartX + 1.2;
  const rightX = chartX + chartW - 1.2;
  const axisTop = chartY + 0.3;
  const axisBottom = chartY + chartH - 0.4;
  const axisH = axisBottom - axisTop;

  // Axes
  slide.addShape('line', {
    x1: leftX, y1: axisTop, x2: leftX, y2: axisBottom,
    line: { color: COLORS.border, width: 2 },
  } as any);
  slide.addShape('line', {
    x1: rightX, y1: axisTop, x2: rightX, y2: axisBottom,
    line: { color: COLORS.border, width: 2 },
  } as any);

  slide.addText(props.previousLabel || '前期', {
    x: leftX - 0.8, y: axisTop - 0.25, w: 1.6, h: 0.2,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(props.currentLabel || '当期', {
    x: rightX - 0.8, y: axisTop - 0.25, w: 1.6, h: 0.2,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });

  items.forEach((item: any) => {
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const y1 = axisTop + ((Number(item.previous) - 1) / Math.max(1, maxRank - 1)) * axisH;
    const y2 = axisTop + ((Number(item.current) - 1) / Math.max(1, maxRank - 1)) * axisH;

    slide.addShape('line', {
      x1: leftX, y1, x2: rightX, y2,
      line: { color, width: 2.5 },
    } as any);

    slide.addShape('ellipse', {
      x: leftX - 0.08, y: y1 - 0.08, w: 0.16, h: 0.16,
      fill: { color },
    } as any);
    slide.addShape('ellipse', {
      x: rightX - 0.08, y: y2 - 0.08, w: 0.16, h: 0.16,
      fill: { color },
    } as any);

    slide.addText(`${item.name} (${item.current})`, {
      x: rightX + 0.15, y: y2 - 0.1, w: 1.8, h: 0.2,
      fontSize: 9, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04WaterfallV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const startValue = Number(props.startValue) || 0;
  const positiveColor = isLight ? '22A55C' : '3ADE80';
  const negativeColor = isLight ? 'DB2777' : 'FF6B9D';
  const totalColor = COLORS.secondary;

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.3, right: 0.25, bottom: 0.6, left: 0.8 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const values = items.map((item: any) => Number(item.value) || 0);
  const running = [startValue];
  values.forEach((v: number) => running.push(running[running.length - 1] + v));
  const endValue = running[running.length - 1];
  const maxValue = Math.max(startValue, endValue, ...running);
  const minValue = Math.min(0, startValue, endValue, ...running);
  const valueRange = Math.max(1, maxValue - minValue);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round(minValue + (valueRange * i) / 4)), {
      x: chartX + 0.05, y: y - 0.08, w: 0.7, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const barCount = items.length + 1;
  const slotW = plotW / barCount;
  const barW = slotW * 0.55;

  // Start bar
  const startH = ((startValue - minValue) / valueRange) * plotH;
  slide.addShape('roundRect', {
    x: plotX + (slotW - barW) / 2, y: plotY + plotH - startH, w: barW, h: startH,
    fill: { color: totalColor }, rectRadius: 0.04,
  } as any);
  slide.addText(props.startLabel || '起点', {
    x: plotX, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(String(startValue), {
    x: plotX + (slotW - barW) / 2, y: plotY + plotH - startH - 0.22, w: barW, h: 0.18,
    fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });

  let current = startValue;
  items.forEach((item: any, idx: number) => {
    const value = Number(item.value) || 0;
    const prevY = plotY + plotH - ((current - minValue) / valueRange) * plotH;
    current += value;
    const nextY = plotY + plotH - ((current - minValue) / valueRange) * plotH;
    const barH = Math.abs(nextY - prevY);
    const y = Math.min(prevY, nextY);
    const color = value >= 0 ? positiveColor : negativeColor;
    const x = plotX + (idx + 1) * slotW + (slotW - barW) / 2;

    slide.addShape('roundRect', {
      x, y, w: barW, h: barH,
      fill: { color }, rectRadius: 0.04,
    } as any);

    slide.addText(item.label ?? '', {
      x: plotX + (idx + 1) * slotW, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
      fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
    slide.addText(String(value > 0 ? `+${value}` : value), {
      x, y: y - 0.22, w: barW, h: 0.18,
      fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  });

  // End total
  const endH = ((endValue - minValue) / valueRange) * plotH;
  slide.addShape('roundRect', {
    x: plotX + (barCount - 1) * slotW + (slotW - barW) / 2, y: plotY + plotH - endH, w: barW, h: endH,
    fill: { color: totalColor }, rectRadius: 0.04,
  } as any);
  slide.addText(props.endLabel || '合计', {
    x: plotX + (barCount - 1) * slotW, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(String(endValue), {
    x: plotX + (barCount - 1) * slotW + (slotW - barW) / 2, y: plotY + plotH - endH - 0.22, w: barW, h: 0.18,
    fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });
}

function renderTheme04RegionV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const sorted = [...items].sort((a: any, b: any) => (Number(b.value) || 0) - (Number(a.value) || 0));
  const maxValue = Math.max(1, ...sorted.map((item: any) => Number(item.value) || 0));
  const rowH = chartH / sorted.length;
  const labelW = 1.4;
  const plotX = chartX + labelW + 0.2;
  const plotW = chartW - labelW - 1.2;

  sorted.forEach((item: any, idx: number) => {
    const y = chartY + idx * rowH;
    const value = Number(item.value) || 0;
    const barW = (value / maxValue) * plotW;
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addText(item.name ?? '', {
      x: chartX + 0.15, y, w: labelW, h: rowH,
      fontSize: 11, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });

    slide.addShape('roundRect', {
      x: plotX, y: y + rowH * 0.22, w: Math.max(0.04, barW), h: rowH * 0.56,
      fill: { color }, rectRadius: 0.04,
    } as any);

    slide.addText(`${value} ${props.unit ?? ''}`, {
      x: plotX + barW + 0.08, y, w: 1.0, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04ValuechartV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const stages = (props.stages || []).slice(0, 4);
  if (stages.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  if (props.name) {
    slide.addShape('roundRect', {
      x: 4.0, y: 2.15, w: 2.0, h: 0.38,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.19,
    } as any);
    slide.addText(props.name, {
      x: 4.0, y: 2.15, w: 2.0, h: 0.38,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  }

  const count = stages.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const cardH = 2.4;
  const startX = 0.65;
  const startY = 2.75;

  stages.forEach((stage: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const y = startY;
    const tone = stage.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(stage.label ?? '', {
      x: x + 0.12, y: y + 0.18, w: cardW - 0.24, h: 0.28,
      fontSize: 11, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(String(stage.value ?? ''), {
      x: x + 0.12, y: y + 0.55, w: cardW - 0.24, h: 0.7,
      fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (stage.description) {
      slide.addText(stage.description, {
        x: x + 0.12, y: y + 1.35, w: cardW - 0.24, h: 0.85,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < count - 1) {
      slide.addShape('arrow', {
        x: x + cardW + 0.04, y: y + cardH / 2 - 0.1, w: 0.14, h: 0.2,
        fill: { color: COLORS.secondary },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04FilmstripV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 8);
  if (images.length === 0) return;

  const count = images.length;
  const gap = 0.16;
  const frameW = (8.7 - (count - 1) * gap) / count;
  const frameH = 2.8;
  const startX = 0.65;
  const startY = 2.5;

  images.forEach((item: any, idx: number) => {
    const x = startX + idx * (frameW + gap);
    const y = startY;

    slide.addShape('roundRect', {
      x, y, w: frameW, h: frameH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);

    const imgUrl = item.image || '';
    if (imgUrl && imgUrl.startsWith('data:')) {
      const tmpPath = dataUriToTempFile(imgUrl);
      if (tmpPath) {
        slide.addImage({ path: tmpPath, x: x + 0.08, y: y + 0.08, w: frameW - 0.16, h: frameH - 0.5 });
      }
    } else {
      slide.addShape('rect', {
        x: x + 0.08, y: y + 0.08, w: frameW - 0.16, h: frameH - 0.5,
        fill: { color: COLORS.surface },
      } as any);
    }

    if (item.caption) {
      slide.addText(item.caption, {
        x, y: y + frameH - 0.4, w: frameW, h: 0.3,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04GroupbarsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const rawLabels = (props.labels || []).slice(0, 8);
  const labels = rawLabels.map((label: any) => (typeof label === 'string' ? label : label?.item) ?? '');
  const series = (props.series || []).slice(0, 4).map((s: any) => ({
    ...s,
    data: (s.data || []).map((d: any) => Number(typeof d === 'number' ? d : d?.item) || 0),
  }));
  if (labels.length === 0 || series.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.25, right: 0.2, bottom: 0.55, left: 0.6 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const allValues = series.flatMap((s: any) => (s.data || []).slice(0, labels.length));
  const maxValue = Math.max(1, ...allValues.map((v: any) => Number(v) || 0));

  // Y axis grid lines
  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round((maxValue * i) / 4)), {
      x: chartX + 0.05, y: y - 0.08, w: 0.5, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  // Bars
  const groupW = plotW / labels.length;
  const barGap = groupW * 0.15;
  const barW = (groupW - barGap) / series.length;

  labels.forEach((label: any, gidx: number) => {
    const groupX = plotX + gidx * groupW + barGap / 2;
    series.forEach((s: any, sidx: number) => {
      const value = Number((s.data || [])[gidx]) || 0;
      const h = (value / maxValue) * plotH;
      const x = groupX + sidx * barW;
      const y = plotY + plotH - h;
      const tone = s.tone || 'green';
      const color = toneColors[tone] ?? COLORS.accent;

      slide.addShape('roundRect', {
        x, y, w: barW * 0.85, h,
        fill: { color },
        rectRadius: 0.03,
      } as any);
    });

    slide.addText(label ?? '', {
      x: plotX + gidx * groupW, y: plotY + plotH + 0.06, w: groupW, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  });

  // Legend
  const legendY = chartY + chartH - 0.35;
  const legendItemW = 1.6;
  const totalLegendW = series.length * legendItemW;
  let legendX = chartX + (chartW - totalLegendW) / 2;
  series.forEach((s: any) => {
    const tone = s.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    slide.addShape('roundRect', {
      x: legendX, y: legendY + 0.04, w: 0.12, h: 0.12,
      fill: { color }, rectRadius: 0.02,
    } as any);
    slide.addText(s.name ?? '', {
      x: legendX + 0.18, y: legendY, w: 1.4, h: 0.2,
      fontSize: 9, color: COLORS.secondary, valign: 'middle', fontFace: FONTS.body,
    });
  legendX += legendItemW;
  });
}

function renderTheme04DiptychV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 3.5, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 3.8, h: 1.1,
    fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 3.8, h: 0.6,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.statement) {
    slide.addShape('roundRect', {
      x: 0.65, y: 3.05, w: 3.8, h: 1.4,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(props.statement, {
      x: 0.85, y: 3.2, w: 3.4, h: 1.1,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }

  const rightX = 4.8;
  const rightW = 4.55;
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX, 0.9, rightW, 2.2);
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const cols = items.length <= 2 ? 1 : 2;
    const rows = Math.ceil(items.length / cols);
    const cardW = (rightW - (cols - 1) * 0.15) / cols;
    const cardH = (2.4 - (rows - 1) * 0.15) / rows;
    items.forEach((item: any, idx: number) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = rightX + c * (cardW + 0.15);
      const y = 3.25 + r * (cardH + 0.15);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      if (item.label) {
        slide.addText(item.label, {
          x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.22,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.1, y: y + 0.34, w: cardW - 0.2, h: cardH - 0.45,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04VoicesV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const voices = (props.voices || []).slice(0, 3);
  if (voices.length > 0) {
    const cardW = 2.7;
    const gap = 0.25;
    const totalW = voices.length * cardW + (voices.length - 1) * gap;
    let x = (10 - totalW) / 2;
    voices.forEach((voice: any) => {
      slide.addShape('roundRect', {
        x, y: 2.45, w: cardW, h: 2.45,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      if (voice.quote) {
        slide.addText(voice.quote, {
          x: x + 0.2, y: 2.7, w: cardW - 0.4, h: 1.45,
          fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
        });
      }
      if (voice.author) {
        slide.addText(voice.author, {
          x: x + 0.2, y: 4.25, w: cardW - 0.4, h: 0.22,
          fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
        });
      }
      if (voice.role) {
        slide.addText(voice.role, {
          x: x + 0.2, y: 4.48, w: cardW - 0.4, h: 0.2,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
        });
      }
      x += cardW + gap;
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.15, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04AnnotatedV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const imgX = 0.65;
  const imgY = 2.35;
  const imgW = 8.7;
  const imgH = 2.75;
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX, imgY, imgW, imgH);
  } else {
    slide.addShape('roundRect', {
      x: imgX, y: imgY, w: imgW, h: imgH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  const annotations = (props.annotations || []).slice(0, 5);
  annotations.forEach((a: any, idx: number) => {
    const x = imgX + ((a.x ?? 50) / 100) * imgW;
    const y = imgY + ((a.y ?? 50) / 100) * imgH;
    slide.addShape('ellipse', {
      x: x - 0.1, y: y - 0.1, w: 0.2, h: 0.2,
      fill: { color: COLORS.accent },
    } as any);
    const labelY = idx % 2 === 0 ? y - 0.55 : y + 0.2;
    slide.addShape('roundRect', {
      x: x - 0.65, y: labelY, w: 1.3, h: 0.42,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.06,
    } as any);
    const text = a.label && a.description ? `${a.label} · ${a.description}` : (a.description || a.label || '');
    slide.addText(text, {
      x: x - 0.6, y: labelY + 0.05, w: 1.2, h: 0.32,
      fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ImagestoryV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 4);
  if (steps.length > 0) {
    const cardW = 2.0;
    const gap = 0.28;
    const totalW = steps.length * cardW + (steps.length - 1) * gap;
    let x = (10 - totalW) / 2;
    steps.forEach((step: any, idx: number) => {
      slide.addShape('roundRect', {
        x, y: 2.45, w: cardW, h: 2.55,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      if (step.image) {
        addImageMaybe(slide, step.image, x + 0.12, 2.6, cardW - 0.24, 1.35);
      }
      if (step.label) {
        slide.addText(step.label, {
          x: x + 0.12, y: 4.05, w: cardW - 0.24, h: 0.2,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
      if (step.caption) {
        slide.addText(step.caption, {
          x: x + 0.12, y: 4.28, w: cardW - 0.24, h: 0.55,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      if (idx < steps.length - 1) {
        slide.addShape('arrow', {
          x: x + cardW + 0.04, y: 3.65, w: gap - 0.08, h: 0.14,
          fill: { color: COLORS.accent },
        } as any);
      }
      x += cardW + gap;
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04DumbbellV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  if (items.length === 0) return;

  const chartX = 0.65;
  const chartY = 2.4;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotX = chartX + 1.6;
  const plotY = chartY + 0.25;
  const plotW = chartW - 1.9;
  const plotH = chartH - 0.55;
  const allEnds = items.map((i: any) => Number(i.end) || 0);
  const maxValue = Math.max(1, ...allEnds) * 1.05;

  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round((maxValue * i) / 4)), {
      x: chartX + 0.1, y: y - 0.08, w: 1.4, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const rowH = plotH / items.length;
  const barH = rowH * 0.45;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  items.forEach((item: any, idx: number) => {
    const start = Number(item.start) || 0;
    const end = Number(item.end) || 0;
    const y = plotY + idx * rowH + (rowH - barH) / 2;
    const startW = (start / maxValue) * plotW;
    const endW = (end / maxValue) * plotW;
    const color = toneColors[item.tone || 'green'] ?? COLORS.accent;

    slide.addText(item.name ?? '', {
      x: chartX + 0.1, y, w: 1.4, h: barH,
      fontSize: 10, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });

    slide.addShape('roundRect', {
      x: plotX, y, w: startW, h: barH,
      fill: { color: COLORS.secondary },
      rectRadius: 0.03,
    } as any);
    if (endW > startW) {
      slide.addShape('roundRect', {
        x: plotX + startW, y, w: endW - startW, h: barH,
        fill: { color },
        rectRadius: [0, 0.03, 0.03, 0],
      } as any);
    }
    slide.addText(String(end), {
      x: plotX + endW + 0.06, y, w: 0.8, h: barH,
      fontSize: 10, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.heading,
    });
  });

  const legendY = chartY + chartH - 0.32;
  const legendItems = [props.startLabel || '起点', props.endLabel || '终点'];
  const legendColors = [COLORS.secondary, COLORS.accent];
  let legendX = chartX + (chartW - 2.4) / 2;
  legendItems.forEach((label: string, idx: number) => {
    slide.addShape('roundRect', {
      x: legendX, y: legendY + 0.04, w: 0.12, h: 0.12,
      fill: { color: legendColors[idx] }, rectRadius: 0.02,
    } as any);
    slide.addText(label, {
      x: legendX + 0.18, y: legendY, w: 0.9, h: 0.2,
      fontSize: 9, color: COLORS.secondary, valign: 'middle', fontFace: FONTS.body,
    });
    legendX += 1.2;
  });
}

function renderTheme04PyramidV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) return;

  const chartX = 0.65;
  const chartY = 2.4;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const maxValue = Math.max(1, ...items.map((i: any) => Number(i.value) || 0));
  const rowH = chartH / items.length;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  items.forEach((item: any, idx: number) => {
    const value = Number(item.value) || 0;
    const ratio = value / maxValue;
    const y = chartY + idx * rowH + rowH * 0.1;
    const h = rowH * 0.8;
    const w = Math.max(0.6, chartW * 0.85 * ratio);
    const x = chartX + (chartW - w) / 2;
    const color = toneColors[item.tone || 'green'] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color },
      rectRadius: 0.06,
    } as any);
    slide.addText(`${item.label ?? ''} · ${value} ${props.unit ?? ''}`, {
      x, y, w, h,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  });
}

function renderTheme04RiskchainV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const risks = (props.risks || []).slice(0, 6);
  if (risks.length === 0) return;

  const gap = 0.12;
  const cardW = (8.7 - gap * (risks.length - 1)) / risks.length;
  const y = 2.55;
  const h = 2.25;
  const impactColors: Record<string, string> = {
    high: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    medium: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
    low: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
  };
  const impactLabels: Record<string, string> = { high: '高风险', medium: '中风险', low: '低风险' };

  risks.forEach((risk: any, idx: number) => {
    const x = 0.65 + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: y + 0.14, w: 0.34, h: 0.26,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });

    const impact = risk.impact || 'medium';
    const impactColor = impactColors[impact] ?? COLORS.accent;
    slide.addShape('roundRect', {
      x: x + cardW - 0.82, y: y + 0.14, w: 0.7, h: 0.24,
      fill: { color: impactColor }, rectRadius: 0.12,
    } as any);
    slide.addText(impactLabels[impact] ?? '', {
      x: x + cardW - 0.82, y: y + 0.14, w: 0.7, h: 0.24,
      fontSize: 8, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });

    slide.addText(risk.label ?? '', {
      x: x + 0.12, y: y + 0.54, w: cardW - 0.24, h: 0.42,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (risk.description) {
      slide.addText(risk.description, {
        x: x + 0.12, y: y + 0.98, w: cardW - 0.24, h: 0.9,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < risks.length - 1) {
      const arrowX = x + cardW + gap / 2 - 0.1;
      slide.addShape('triangle', {
        x: arrowX, y: y + h / 2 - 0.12, w: 0.2, h: 0.24,
        fill: { color: COLORS.accent },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MetroV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const stops = (props.stops || []).slice(0, 6);
  if (stops.length === 0) return;

  const trackY = 3.15;
  const trackH = 0.12;
  slide.addShape('roundRect', {
    x: 0.65, y: trackY, w: 8.7, h: trackH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.06,
  } as any);

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const stepX = 8.7 / (stops.length > 1 ? stops.length - 1 : 1);
  stops.forEach((stop: any, idx: number) => {
    const x = 0.65 + (stops.length > 1 ? idx * stepX : 8.7 / 2);
    const color = toneColors[stop.tone || 'green'] ?? COLORS.accent;

    slide.addShape('ellipse', {
      x: x - 0.14, y: trackY + trackH / 2 - 0.14, w: 0.28, h: 0.28,
      fill: { color },
      line: { color: COLORS.white, width: 2 },
    } as any);

    const cardY = idx % 2 === 0 ? trackY - 1.35 : trackY + trackH + 0.2;
    slide.addShape('roundRect', {
      x: x - 0.85, y: cardY, w: 1.7, h: 1.1,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);
    slide.addText(stop.label ?? '', {
      x: x - 0.78, y: cardY + 0.12, w: 1.56, h: 0.32,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
    if (stop.description) {
      slide.addText(stop.description, {
        x: x - 0.78, y: cardY + 0.46, w: 1.56, h: 0.55,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.lineLabel) {
    slide.addShape('roundRect', {
      x: 4.5, y: trackY - 0.22, w: 1.0, h: 0.24,
      fill: { color: COLORS.accent }, rectRadius: 0.12,
    } as any);
    slide.addText(props.lineLabel, {
      x: 4.5, y: trackY - 0.22, w: 1.0, h: 0.24,
      fontSize: 8, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ShowcaseV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const imgX = 0.65;
  const imgY = 2.35;
  const imgW = 8.7;
  const imgH = 2.75;

  slide.addShape('roundRect', {
    x: imgX, y: imgY, w: imgW, h: imgH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX + 0.08, imgY + 0.08, imgW - 0.16, imgH - 0.16);
  }

  if (props.caption) {
    slide.addShape('roundRect', {
      x: imgX + 0.2, y: imgY + imgH - 0.62, w: imgW - 0.4, h: 0.42,
      fill: { color: '000000' },
      rectRadius: 0.08,
    } as any);
    slide.addText(props.caption, {
      x: imgX + 0.25, y: imgY + imgH - 0.6, w: imgW - 0.5, h: 0.38,
      fontSize: 11, color: COLORS.white, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

registerPptxLayoutRenderer('theme04_cover_v1', renderTheme04CoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chapter_v1', renderTheme04ChapterV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_content_v1', renderTheme04ContentV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_metric_v1', renderTheme04MetricV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chart_v1', renderTheme04ChartV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_quote_v1', renderTheme04QuoteV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_image_v1', renderTheme04ImageV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_closing_v1', renderTheme04ClosingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_table_of_contents_v1', renderTheme04TableOfContentsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_feature_v1', renderTheme04FeatureV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_bento_v1', renderTheme04BentoV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_team_v1', renderTheme04TeamV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chart_donut', renderTheme04ChartDonut as PptxRenderFn);
registerPptxLayoutRenderer('theme04_metric_big', renderTheme04MetricBig as PptxRenderFn);
registerPptxLayoutRenderer('theme04_process_v1', renderTheme04ProcessV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_gallery_v1', renderTheme04GalleryV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_stats_v1', renderTheme04StatsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_comparison_v1', renderTheme04ComparisonV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_table_v1', renderTheme04TableV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_timeline_v1', renderTheme04TimelineV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_roadmap_v1', renderTheme04RoadmapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_ranking_v1', renderTheme04RankingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_case_v1', renderTheme04CaseV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_quadrant_v1', renderTheme04QuadrantV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_agenda_v1', renderTheme04AgendaV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_cover_index_v1', renderTheme04CoverIndexV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chapter_v2', renderTheme04ChapterV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_image_quote_v1', renderTheme04ImageQuoteV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_editorial_v1', renderTheme04EditorialV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_triptych_v1', renderTheme04TriptychV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_gantt_v1', renderTheme04GanttV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_radar_v1', renderTheme04RadarV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_heatmap_v1', renderTheme04HeatmapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_cover_ghost_v1', renderTheme04CoverGhostV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_cards_v1', renderTheme04CardsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_gauges_v1', renderTheme04GaugesV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_cover_bento_v1', renderTheme04CoverBentoV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_cover_magazine_v1', renderTheme04CoverMagazineV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chapter_split_v1', renderTheme04ChapterSplitV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_chapter_numbered_v1', renderTheme04ChapterNumberedV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_delta_v1', renderTheme04DeltaV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_versus_v1', renderTheme04VersusV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_trio_v1', renderTheme04TrioV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_polaroid_v1', renderTheme04PolaroidV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_verdict_v1', renderTheme04VerdictV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_treemap_v1', renderTheme04TreemapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_scoreboard_v1', renderTheme04ScoreboardV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_scorecards_v1', renderTheme04ScorecardsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_matrix_v1', renderTheme04MatrixV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_layers_v1', renderTheme04LayersV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_groupbars_v1', renderTheme04GroupbarsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_scatter_v1', renderTheme04ScatterV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_slope_v1', renderTheme04SlopeV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_waterfall_v1', renderTheme04WaterfallV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_region_v1', renderTheme04RegionV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_valuechart_v1', renderTheme04ValuechartV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_filmstrip_v1', renderTheme04FilmstripV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_diptych_v1', renderTheme04DiptychV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_voices_v1', renderTheme04VoicesV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_annotated_v1', renderTheme04AnnotatedV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_imagestory_v1', renderTheme04ImagestoryV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_dumbbell_v1', renderTheme04DumbbellV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_pyramid_v1', renderTheme04PyramidV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_riskchain_v1', renderTheme04RiskchainV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_metro_v1', renderTheme04MetroV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme04_showcase_v1', renderTheme04ShowcaseV1 as PptxRenderFn);

registerPptxLayoutRenderer('theme03_cover_v1', renderTheme03CoverV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chapter_v1', renderTheme03ChapterV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_content_v1', renderTheme03ContentV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metric_big', renderTheme03MetricBig as PptxRenderFn);
registerPptxLayoutRenderer('theme03_ranking_v1', renderTheme03RankingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_quote_v1', renderTheme03QuoteV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_case_v1', renderTheme03CaseV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_closing_v1', renderTheme03ClosingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_table_of_contents_v1', renderTheme03TableOfContentsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metrics_v1', renderTheme03MetricsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_feature_v1', renderTheme03FeatureV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_image_v1', renderTheme03ImageV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_donut', renderTheme03ChartDonut as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_bar', renderTheme03ChartBar as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_v1', renderTheme03ChartV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_trend_v1', renderTheme03TrendV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_radar', renderTheme03ChartRadar as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_funnel', renderTheme03ChartFunnel as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_gauge', renderTheme03ChartGauge as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_heatmap', renderTheme03ChartHeatmap as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_treemap', renderTheme03ChartTreemap as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_wordcloud', renderTheme03ChartWordcloud as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_bar3d', renderTheme03ChartBar3d as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_graph', renderTheme03ChartGraph as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_sankey', renderTheme03ChartSankey as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chart_sunburst', renderTheme03ChartSunburst as PptxRenderFn);
registerPptxLayoutRenderer('theme03_team_v1', renderTheme03TeamV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_partners_v1', renderTheme03PartnersV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_pricing_v1', renderTheme03PricingV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_comparison_v1', renderTheme03ComparisonV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_faq_v1', renderTheme03FaqV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_gallery_v1', renderTheme03GalleryV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_number_showcase_v1', renderTheme03NumberShowcaseV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_bento_v1', renderTheme03BentoV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_quadrant_v1', renderTheme03QuadrantV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_table_v1', renderTheme03TableV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_testimonial_v1', renderTheme03TestimonialV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_tags_v1', renderTheme03TagsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_progress_v1', renderTheme03ProgressV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_process_v1', renderTheme03ProcessV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_timeline_v1', renderTheme03TimelineV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_roadmap_v1', renderTheme03RoadmapV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_swot_v1', renderTheme03SwotV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metric_v1', renderTheme03MetricV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metric_v2', renderTheme03MetricV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metric_v3', renderTheme03MetricV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_metric_triptych', renderTheme03MetricTriptych as PptxRenderFn);
registerPptxLayoutRenderer('theme03_scorecard_v1', renderTheme03ScorecardV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_appendix_v1', renderTheme03AppendixV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_case_study', renderTheme03CaseStudy as PptxRenderFn);
registerPptxLayoutRenderer('theme03_outlook_v1', renderTheme03OutlookV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_region_v1', renderTheme03RegionV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_risk_v1', renderTheme03RiskV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_spotlight_grid', renderTheme03SpotlightGrid as PptxRenderFn);
registerPptxLayoutRenderer('theme03_conclusion_v1', renderTheme03ConclusionV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_diptych_contrast', renderTheme03DiptychContrast as PptxRenderFn);
registerPptxLayoutRenderer('theme03_filmstrip_v1', renderTheme03FilmstripV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_gantt_v1', renderTheme03GanttV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_pest_v1', renderTheme03PestV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_stats_v1', renderTheme03StatsV1 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_table_data', renderTheme03TableData as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chapter_v2', renderTheme03ChapterV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_chapter_v3', renderTheme03ChapterV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_closing_v2', renderTheme03ClosingV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_comparison_v2', renderTheme03ComparisonV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_comparison_v3', renderTheme03ComparisonV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_content_v2', renderTheme03ContentV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_content_v3', renderTheme03ContentV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_content_v4', renderTheme03ContentV4 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_cover_v2', renderTheme03CoverV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_cover_v3', renderTheme03CoverV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_cover_v4', renderTheme03CoverV4 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_feature_v2', renderTheme03FeatureV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_quote_v2', renderTheme03QuoteV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_quote_v3', renderTheme03QuoteV3 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_table_of_contents_v2', renderTheme03TableOfContentsV2 as PptxRenderFn);
registerPptxLayoutRenderer('theme03_team_v2', renderTheme03TeamV2 as PptxRenderFn);
