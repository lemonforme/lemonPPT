// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * ⚠️ 渲染真源（SOURCE OF TRUTH）⚠️
 * renderer 经 @lemonppt/templates 实际调用本文件。
 * 镜像副本 `packages/themes/src/theme11/tokens.ts` 仅供 getTheme() 元数据使用。
 * 改配色请先改本文件，再同步：
 *   cp packages/templates/src/themes/theme11/tokens.ts packages/themes/src/theme11/tokens.ts
 *
 * theme11 设计 Token。
 * 风格：流光科技 · 浅色扁平科技风 / Light Stream · Flat Tech。
 *
 * 视觉坐标（与 theme07 冷白调研、theme10 金色金融、third-party 全部区分开）：
 *   白/浅灰底 + 柔和弥散渐变 + 多彩强调色（青/紫/蓝/橙）+ 轻量圆角卡片 + 细网格/信号线。
 *   三情绪渐变（aurora / daylight / sunset）全部自写。
 *
 * 所有色值、类名、装饰语汇均为原创，不复制 third-party 的实现、专色族、类名
 * 与保留前缀变量。
 */

export type Theme11Mood = 'aurora' | 'daylight' | 'sunset';

export interface Theme11Tokens {
  id: string;
  displayName: string;
  description: string;
  colors: {
    ink: string;
    ink2: string;
    ink3: string;
    textInverse: string;
    accent: string;
    accent2: string;
    accent3: string;
    orange: string;
    red: string;
    green: string;
    violet: string;
    cyan: string;
    series: readonly string[];
    background: string;
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    surface: string;
    surfaceSoft: string;
    surfaceStrong: string;
    surfaceSolid: string;
    surfaceElevated: string;
    border: string;
    borderStrong: string;
    shadow: string;
    shadowSmall: string;
    shadowMedium: string;
    shadowLarge: string;
    shadowBlue: string;
    shadowCyan: string;
    shadowViolet: string;
    shadowOrange: string;
    shadowGreen: string;
    shadowRed: string;
    gridLine: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
    en: string;
  };
  spacing: {
    pagePadding: string;
    sectionGap: string;
    elementGap: string;
    padTop: string;
    padBottom: string;
    cardPaddingLarge: string;
    cardPaddingMedium: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  fontSize: {
    display: string;
    displaySmall: string;
    h1: string;
    h2: string;
    h3: string;
    body: string;
    bodySmall: string;
    caption: string;
  };
}

/* ────────────────────────────────────────────────────────────────
 * 三情绪基底（全部自写渐变定义，浅色底 + 弥散色块）
 * ──────────────────────────────────────────────────────────────── */
const MOOD_GRADIENT: Record<Theme11Mood, string> = {
  aurora:
    'radial-gradient(140% 120% at 12% 12%, #e0f7fa 0%, #e1f5fe 25%, #ede7f6 55%, #f3e5f5 80%, #ffffff 100%)',
  daylight:
    'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #e2e8f0 100%)',
  sunset:
    'linear-gradient(135deg, #fff8e1 0%, #ffe0b2 35%, #ffccbc 70%, #ffffff 100%)',
};

const C = {
  ink: '#1A202C',
  ink2: '#5A6578',
  ink3: '#8B95A5',
  inverse: '#FFFFFF',
  accent: '#00BCD4',
  accent2: '#7C4DFF',
  accent3: '#2979FF',
  orange: '#FF9100',
  red: '#FF5252',
  green: '#00C853',
  violet: '#7C4DFF',
  cyan: '#00BCD4',
};

const SERIES = [C.accent, C.accent2, C.accent3, C.orange, C.green, C.red];

/* 高饱和渐变卡片（与参考图对齐：蓝青、紫蓝、橙红、绿青） */
const GRADIENTS = {
  blueCyan: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)',
  violetBlue: 'linear-gradient(135deg, #7C4DFF 0%, #2979FF 100%)',
  orangeRed: 'linear-gradient(135deg, #FF9100 0%, #FF5252 100%)',
  greenCyan: 'linear-gradient(135deg, #00C853 0%, #00BCD4 100%)',
  violetPink: 'linear-gradient(135deg, #7C4DFF 0%, #FF5252 100%)',
  cyanBlue: 'linear-gradient(135deg, #00BCD4 0%, #2979FF 100%)',
};

const BASE_BG = '#F8FAFC';
const BG_START = '#F8FAFC';
const BG_END = '#E2E8F0';

function buildTokenCatalog(): Theme11Tokens {
  return {
    id: 'theme11',
    displayName: 'Theme 11',
    description:
      '流光科技 · 浅色扁平科技风：白/浅灰底 + 柔和弥散渐变 + 多彩强调色 + 轻量圆角卡片 + 细网格/信号线，适合 SaaS、AI、科技产品路演与数据仪表盘',
    colors: {
      ink: C.ink,
      ink2: C.ink2,
      ink3: C.ink3,
      textInverse: C.inverse,
      accent: C.accent,
      accent2: C.accent2,
      accent3: C.accent3,
      orange: C.orange,
      red: C.red,
      green: C.green,
      violet: C.violet,
      cyan: C.cyan,
      series: SERIES,
      background: BASE_BG,
      backgroundGradientStart: BG_START,
      backgroundGradientEnd: BG_END,
      surface: '#FFFFFF',
      surfaceSoft: '#F1F5F9',
      surfaceStrong: '#E2E8F0',
      surfaceSolid: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      border: '#E2E8F0',
      borderStrong: '#CBD5E1',
      shadow: '0 22px 54px rgba(30, 41, 59, 0.14)',
      shadowSmall: '0 4px 24px rgba(30, 41, 59, 0.08)',
      shadowMedium: '0 12px 32px rgba(30, 41, 59, 0.12)',
      shadowLarge: '0 18px 44px rgba(30, 41, 59, 0.16)',
      shadowBlue: '0 12px 32px rgba(41, 121, 255, 0.25)',
      shadowCyan: '0 12px 32px rgba(0, 188, 212, 0.22)',
      shadowViolet: '0 12px 32px rgba(124, 77, 255, 0.22)',
      shadowOrange: '0 12px 32px rgba(255, 145, 0, 0.22)',
      shadowGreen: '0 12px 32px rgba(0, 200, 83, 0.22)',
      shadowRed: '0 12px 32px rgba(255, 82, 82, 0.22)',
      gridLine: 'rgba(30, 41, 59, 0.06)',
    },
    fonts: {
      heading: '"Inter", "Noto Sans SC", system-ui, sans-serif',
      body: '"Noto Sans SC", system-ui, sans-serif',
      mono: '"Space Mono", "IBM Plex Mono", ui-monospace, monospace',
      en: '"Inter", "SF Pro Display", system-ui, sans-serif',
    },
    spacing: {
      pagePadding: '60px',
      sectionGap: '30px',
      elementGap: '14px',
      padTop: '72px',
      padBottom: '68px',
      cardPaddingLarge: '30px 34px',
      cardPaddingMedium: '20px 24px',
    },
    borderRadius: {
      small: '8px',
      medium: '14px',
      large: '20px',
    },
    fontSize: {
      display: '104px',
      displaySmall: '72px',
      h1: '46px',
      h2: '32px',
      h3: '22px',
      body: '17px',
      bodySmall: '14px',
      caption: '12px',
    },
  };
}

export const theme11Tokens = buildTokenCatalog();

export function getTheme11Tokens(): Theme11Tokens {
  return buildTokenCatalog();
}

/* ────────────────────────────────────────────────────────────────
 * CSS 变量生成（被 render-editor-data.tsx / gallery.mjs 注入到 <style>）
 * ──────────────────────────────────────────────────────────────── */
function buildCssVars(): string {
  const t = buildTokenCatalog();
  const c = t.colors;
  return `
  --lp-ink: ${c.ink};
  --lp-ink2: ${c.ink2};
  --lp-ink3: ${c.ink3};
  --lp-text-inverse: ${c.textInverse};
  --lp-accent: ${c.accent};
  --lp-accent-2: ${c.accent2};
  --lp-accent-3: ${c.accent3};
  --lp-orange: ${c.orange};
  --lp-red: ${c.red};
  --lp-green: ${c.green};
  --lp-violet: ${c.violet};
  --lp-cyan: ${c.cyan};
  --lp-series-1: ${c.series[0]};
  --lp-series-2: ${c.series[1]};
  --lp-series-3: ${c.series[2]};
  --lp-series-4: ${c.series[3]};
  --lp-series-5: ${c.series[4]};
  --lp-series-6: ${c.series[5]};
  --lp-bg: ${c.background};
  --lp-bg-gradient-start: ${c.backgroundGradientStart};
  --lp-bg-gradient-end: ${c.backgroundGradientEnd};
  --lp-surface: ${c.surface};
  --lp-surface-soft: ${c.surfaceSoft};
  --lp-surface-strong: ${c.surfaceStrong};
  --lp-surface-solid: ${c.surfaceSolid};
  --lp-surface-elevated: ${c.surfaceElevated};
  --lp-border: ${c.border};
  --lp-border-strong: ${c.borderStrong};
  --lp-shadow: ${c.shadow};
  --lp-shadow-small: ${c.shadowSmall};
  --lp-shadow-medium: ${c.shadowMedium};
  --lp-shadow-large: ${c.shadowLarge};
  --lp-shadow-blue: ${c.shadowBlue};
  --lp-shadow-cyan: ${c.shadowCyan};
  --lp-shadow-violet: ${c.shadowViolet};
  --lp-shadow-orange: ${c.shadowOrange};
  --lp-shadow-green: ${c.shadowGreen};
  --lp-shadow-red: ${c.shadowRed};
  --lp-grid-line: ${c.gridLine};
  /* 高饱和渐变卡片 */
  --lp-gradient-blue-cyan: ${GRADIENTS.blueCyan};
  --lp-gradient-violet-blue: ${GRADIENTS.violetBlue};
  --lp-gradient-orange-red: ${GRADIENTS.orangeRed};
  --lp-gradient-green-cyan: ${GRADIENTS.greenCyan};
  --lp-gradient-violet-pink: ${GRADIENTS.violetPink};
  --lp-gradient-cyan-blue: ${GRADIENTS.cyanBlue};
  --lp-font: ${t.fonts.body};
  --lp-font-mono: ${t.fonts.mono};
  --lp-font-heading: ${t.fonts.heading};
  --lp-radius-small: ${t.borderRadius.small};
  --lp-radius-medium: ${t.borderRadius.medium};
  --lp-radius-large: ${t.borderRadius.large};
  --lp-font-size-display: ${t.fontSize.display};
  --lp-font-size-display-small: ${t.fontSize.displaySmall};
  --lp-font-size-h1: ${t.fontSize.h1};
  --lp-font-size-h2: ${t.fontSize.h2};
  --lp-font-size-h3: ${t.fontSize.h3};
  --lp-font-size-body: ${t.fontSize.body};
  --lp-font-size-body-small: ${t.fontSize.bodySmall};
  --lp-font-size-caption: ${t.fontSize.caption};
  /* 通用布局别名 */
  --lp-card-border: var(--lp-border);
  --lp-card-radius: var(--lp-radius-large);
  --lp-card-surface: var(--lp-surface);
  --lp-card-shadow: var(--lp-shadow-small);
  --lp-on-accent: #FFFFFF;
  --lp-error: var(--lp-red);
  --lp-warning: var(--lp-orange);
  --lp-success: var(--lp-green);
  --lp-font-display: ${t.fonts.heading};
  /* theme11 专有 */
  --lp-t11-mood: daylight;
  --lp-t11-signal: var(--lp-accent);
  --lp-t11-grid: var(--lp-grid-line);
  `;
}

export function generateTheme11CssVariables(mood: Theme11Mood = 'daylight'): string {
  const blocks: string[] = [];
  blocks.push(`:root {\n${buildCssVars()}\n  --lp-t11-mood: daylight;\n}`);
  for (const m of ['aurora', 'daylight', 'sunset'] as Theme11Mood[]) {
    blocks.push(
      `.lp-theme11-mood-${m} {\n  --lp-mood-gradient: ${MOOD_GRADIENT[m]};\n  --lp-t11-mood: ${m};\n}`,
    );
  }
  blocks.push(`:root[data-mood="${mood}"] {\n${buildCssVars()}\n}`);
  return blocks.join('\n');
}
