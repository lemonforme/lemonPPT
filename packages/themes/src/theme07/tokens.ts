// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme07 设计 Token。
 * 风格：冷白调研风 / Cold White Research。
 * 冷白底 + 深墨文字 + 低饱和强调色 + 结构化数据卡片，适合白皮书、调研报告、竞品分析、学术/政策型表达。
 * 衬线标题增强学术感，单一冷白外观（接口预留 dark 扩展）。
 */
export interface Theme07Tokens {
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
    accentCool: string;
    red: string;
    orange: string;
    amber: string;
    yellow: string;
    teal: string;
    green: string;
    cyan: string;
    blue: string;
    indigo: string;
    violet: string;
    purple: string;
    series: readonly string[];
    background: string;
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    surface: string;
    surfaceStrong: string;
    surfaceSolid: string;
    surfaceElevated: string;
    border: string;
    borderStrong: string;
    shadow: string;
    shadowSmall: string;
    nodeBg: string;
    nodeBorder: string;
    edge: string;
    focusGlow: string;
    panelLine: string;
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
  effect: {
    riseDistance: string;
    riseDuration: string;
  };
}

export type Theme07Appearance = 'light' | 'dark';

/**
 * 冷白调研风色板（原创设计，非复制 third-party）。
 * 明亮鲜艳：电光蓝主色 + 翠绿辅色 + 暖橙警示，高饱和冷调，仍保持白底通透学术感。
 */
const coldWhitePalette = {
  // 强调色在白底上需满足 WCAG AA 文本对比度（>=4.5:1），原电光蓝/翠绿/暖橙均偏亮不达标，
  // 统一压暗为同色系深色：主色深海军蓝、辅色深绿、警示深橙。
  accent: '#0A66C2',
  accent2: '#0E7A5B',
  accentCool: '#C2410C',
};

function buildTokenCatalog(appearance: Theme07Appearance = 'light'): Theme07Tokens {
  const isLight = appearance === 'light';
  return {
    id: 'theme07',
    displayName: 'Theme 07',
    description: '冷白调研风，深墨文字与明亮鲜艳的强调色，适合白皮书、调研报告与学术/政策型表达',
    colors: {
      ink: isLight ? '#1A1D23' : '#F2F4F7',
      ink2: isLight ? 'rgba(26, 29, 35, 0.72)' : 'rgba(242, 244, 247, 0.72)',
      ink3: isLight ? 'rgba(26, 29, 35, 0.72)' : 'rgba(242, 244, 247, 0.72)',
      textInverse: isLight ? '#F8F9FA' : '#0D100F',
      accent: coldWhitePalette.accent,
      accent2: coldWhitePalette.accent2,
      accentCool: coldWhitePalette.accentCool,
      red: isLight ? '#C73E2F' : '#FF6B6B',
      orange: isLight ? '#C25E00' : '#FF9F43',
      amber: isLight ? '#B45309' : '#FFC700',
      yellow: isLight ? '#A16207' : '#FFD100',
      teal: isLight ? '#0B7A85' : '#00E5B0',
      green: isLight ? '#15803D' : '#22C55E',
      cyan: isLight ? '#0B7A85' : '#22D3EE',
      blue: isLight ? '#0A66C2' : '#3B82C4',
      indigo: isLight ? '#4338CA' : '#6366F1',
      violet: isLight ? '#7C2ED3' : '#A855F7',
      purple: isLight ? '#7C2ED3' : '#A855F7',
      series: [coldWhitePalette.accent, coldWhitePalette.accent2, coldWhitePalette.accentCool, '#7C5CFC', '#16BFD9', '#F24E7D'],
      background: isLight ? '#FFFFFF' : '#0D100F',
      backgroundGradientStart: isLight ? '#FFFFFF' : '#0D100F',
      backgroundGradientEnd: isLight ? '#F7F9FB' : '#151C27',
      surface: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
      surfaceStrong: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.10)',
      surfaceSolid: isLight ? '#FFFFFF' : '#151C27',
      surfaceElevated: isLight ? '#FFFFFF' : '#1A2330',
      border: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.10)',
      borderStrong: isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.18)',
      shadow: isLight ? '0 24px 60px rgba(26, 29, 35, 0.08)' : '0 24px 60px rgba(0, 0, 0, 0.50)',
      shadowSmall: isLight ? '0 8px 24px rgba(26, 29, 35, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.40)',
      nodeBg: isLight ? '#FFFFFF' : '#151C27',
      nodeBorder: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.18)',
      edge: isLight ? 'rgba(26, 29, 35, 0.20)' : 'rgba(255, 255, 255, 0.16)',
      focusGlow: isLight ? 'rgba(10, 102, 194, 0.28)' : 'rgba(10, 102, 194, 0.45)',
      panelLine: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
    },
    fonts: {
      heading: '"Source Serif Pro", "Noto Serif SC", Georgia, serif',
      body: '"Inter", "Noto Sans SC", system-ui, sans-serif',
      mono: '"JetBrains Mono", "Space Mono", ui-monospace, monospace',
      en: '"Inter", "JetBrains Mono", ui-monospace, monospace',
    },
    spacing: {
      pagePadding: '56px',
      sectionGap: '32px',
      elementGap: '14px',
      padTop: '72px',
      padBottom: '64px',
      cardPaddingLarge: '32px 36px',
      cardPaddingMedium: '22px 24px',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    fontSize: {
      display: '84px',
      displaySmall: '64px',
      h1: '48px',
      h2: '34px',
      h3: '24px',
      body: '18px',
      bodySmall: '15px',
      caption: '13px',
    },
    effect: {
      riseDistance: '14px',
      riseDuration: '0.5s',
    },
  };
}

export const theme07Tokens = buildTokenCatalog('light');

export function getTheme07Tokens(appearance: Theme07Appearance = 'light'): Theme07Tokens {
  return buildTokenCatalog(appearance);
}

interface CssTokenSet {
  ink: string;
  ink2: string;
  ink3: string;
  textInverse: string;
  accent: string;
  accent2: string;
  accentCool: string;
  red: string;
  orange: string;
  amber: string;
  yellow: string;
  teal: string;
  green: string;
  cyan: string;
  blue: string;
  indigo: string;
  violet: string;
  purple: string;
  series: readonly string[];
  bg: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  surface: string;
  surfaceStrong: string;
  surfaceSolid: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  shadow: string;
  shadowSm: string;
  shadowInset: string;
  overlay: string;
  overlayStrong: string;
  divider: string;
  scrim: string;
  imageOverlay: string;
  shadowRgb: string;
  stroke: string;
  whiteAlpha80: string;
  whiteAlpha85: string;
  whiteAlpha90: string;
  nodeBg: string;
  nodeBorder: string;
  edge: string;
  focusGlow: string;
  panelLine: string;
  font: string;
  fontMono: string;
  fontHeading: string;
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
}

function makeCssTokens(appearance: Theme07Appearance = 'light'): CssTokenSet {
  const tokens = buildTokenCatalog(appearance);
  const isLight = appearance === 'light';
  return {
    ink: tokens.colors.ink,
    ink2: tokens.colors.ink2,
    ink3: tokens.colors.ink3,
    textInverse: tokens.colors.textInverse,
    accent: tokens.colors.accent,
    accent2: tokens.colors.accent2,
    accentCool: tokens.colors.accentCool,
    red: tokens.colors.red,
    orange: tokens.colors.orange,
    amber: tokens.colors.amber,
    yellow: tokens.colors.yellow,
    teal: tokens.colors.teal,
    green: tokens.colors.green,
    cyan: tokens.colors.cyan,
    blue: tokens.colors.blue,
    indigo: tokens.colors.indigo,
    violet: tokens.colors.violet,
    purple: tokens.colors.purple,
    series: tokens.colors.series,
    bg: tokens.colors.background,
    bgGradientStart: tokens.colors.backgroundGradientStart,
    bgGradientEnd: tokens.colors.backgroundGradientEnd,
    surface: tokens.colors.surface,
    surfaceStrong: tokens.colors.surfaceStrong,
    surfaceSolid: tokens.colors.surfaceSolid,
    surfaceElevated: tokens.colors.surfaceElevated,
    border: tokens.colors.border,
    borderStrong: tokens.colors.borderStrong,
    shadow: tokens.colors.shadow,
    shadowSm: tokens.colors.shadowSmall,
    shadowInset: isLight ? '0 1px 0 rgba(0, 0, 0, 0.04) inset' : '0 1px 0 rgba(255, 255, 255, 0.08) inset',
    overlay: isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.04)',
    overlayStrong: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
    divider: isLight ? 'rgba(26, 29, 35, 0.08)' : 'rgba(255, 255, 255, 0.09)',
    scrim: isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.55)',
    imageOverlay: isLight
      ? 'linear-gradient(180deg, rgba(248, 249, 250, 0.72) 0%, rgba(248, 249, 250, 0.92) 100%)'
      : 'linear-gradient(180deg, rgba(13, 16, 15, 0.72) 0%, rgba(13, 16, 15, 0.92) 100%)',
    shadowRgb: isLight ? '26, 29, 35' : '0, 0, 0',
    stroke: isLight ? 'rgba(0, 0, 0, 0.10)' : 'rgba(255, 255, 255, 0.12)',
    whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
    whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
    whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
    nodeBg: tokens.colors.nodeBg,
    nodeBorder: tokens.colors.nodeBorder,
    edge: tokens.colors.edge,
    focusGlow: tokens.colors.focusGlow,
    panelLine: tokens.colors.panelLine,
    font: tokens.fonts.body,
    fontMono: tokens.fonts.mono,
    fontHeading: tokens.fonts.heading,
    radiusSmall: tokens.borderRadius.small,
    radiusMedium: tokens.borderRadius.medium,
    radiusLarge: tokens.borderRadius.large,
  };
}

function buildCssVarsFromTokens(tokens: CssTokenSet): string {
  return `
  --lp-ink: ${tokens.ink};
  --lp-ink2: ${tokens.ink2};
  --lp-ink3: ${tokens.ink3};
  --lp-text-inverse: ${tokens.textInverse};
  --lp-accent: ${tokens.accent};
  --lp-accent-2: ${tokens.accent2};
  --lp-accent-cool: ${tokens.accentCool};
  --lp-red: ${tokens.red};
  --lp-orange: ${tokens.orange};
  --lp-amber: ${tokens.amber};
  --lp-yellow: ${tokens.yellow};
  --lp-teal: ${tokens.teal};
  --lp-green: ${tokens.green};
  --lp-cyan: ${tokens.cyan};
  --lp-blue: ${tokens.blue};
  --lp-indigo: ${tokens.indigo};
  --lp-violet: ${tokens.violet};
  --lp-purple: ${tokens.purple};
  --lp-series-1: ${tokens.series[0]};
  --lp-series-2: ${tokens.series[1]};
  --lp-series-3: ${tokens.series[2]};
  --lp-series-4: ${tokens.series[3]};
  --lp-series-5: ${tokens.series[4]};
  --lp-series-6: ${tokens.series[5]};
  --lp-bg: ${tokens.bg};
  --lp-bg-gradient-start: ${tokens.bgGradientStart};
  --lp-bg-gradient-end: ${tokens.bgGradientEnd};
  --lp-surface: ${tokens.surface};
  --lp-surface-strong: ${tokens.surfaceStrong};
  --lp-surface-solid: ${tokens.surfaceSolid};
  --lp-surface-elevated: ${tokens.surfaceElevated};
  --lp-border: ${tokens.border};
  --lp-border-strong: ${tokens.borderStrong};
  --lp-shadow: ${tokens.shadow};
  --lp-shadow-sm: ${tokens.shadowSm};
  --lp-shadow-inset: ${tokens.shadowInset};
  --lp-overlay: ${tokens.overlay};
  --lp-overlay-strong: ${tokens.overlayStrong};
  --lp-divider: ${tokens.divider};
  --lp-scrim: ${tokens.scrim};
  --lp-image-overlay: ${tokens.imageOverlay};
  --lp-shadow-rgb: ${tokens.shadowRgb};
  --lp-stroke: ${tokens.stroke};
  --lp-white-alpha-80: ${tokens.whiteAlpha80};
  --lp-white-alpha-85: ${tokens.whiteAlpha85};
  --lp-white-alpha-90: ${tokens.whiteAlpha90};
  --lp-node-bg: ${tokens.nodeBg};
  --lp-node-border: ${tokens.nodeBorder};
  --lp-edge: ${tokens.edge};
  --lp-focus-glow: ${tokens.focusGlow};
  --lp-panel-line: ${tokens.panelLine};
  --lp-font: ${tokens.font};
  --lp-font-mono: ${tokens.fontMono};
  --lp-font-heading: ${tokens.fontHeading};
  --lp-radius-small: ${tokens.radiusSmall};
  --lp-radius-medium: ${tokens.radiusMedium};
  --lp-radius-large: ${tokens.radiusLarge};
  --lp-radius-lg: ${tokens.radiusLarge};
  --lp-font-size-display: ${theme07Tokens.fontSize.display};
  --lp-font-size-display-small: ${theme07Tokens.fontSize.displaySmall};
  --lp-font-size-h1: ${theme07Tokens.fontSize.h1};
  --lp-font-size-h2: ${theme07Tokens.fontSize.h2};
  --lp-font-size-h3: ${theme07Tokens.fontSize.h3};
  --lp-font-size-body: ${theme07Tokens.fontSize.body};
  --lp-font-size-body-small: ${theme07Tokens.fontSize.bodySmall};
  --lp-font-size-caption: ${theme07Tokens.fontSize.caption};
  /* theme07 常用布局别名 */
  --lp-card-border: var(--lp-border);
  --lp-card-radius: var(--lp-radius-large);
  --lp-card-surface: var(--lp-surface-solid);
  --lp-card-accent: color-mix(in srgb, var(--lp-accent) 10%, transparent);
  --lp-card-accent-border: var(--lp-accent);
  --lp-on-accent: var(--lp-text-inverse);
  --lp-on-accent-soft: color-mix(in srgb, var(--lp-text-inverse) 72%, transparent);
  --lp-error: var(--lp-red);
  --lp-warning: var(--lp-amber);
  --lp-success: var(--lp-green);
  --lp-font-size-hero: var(--lp-font-size-display-small);
  --lp-font-size-hero-small: var(--lp-font-size-h1);
  --lp-font-size-subtitle: var(--lp-font-size-h3);
  --lp-font-size-small: var(--lp-font-size-body-small);
  `;
}

/**
 * 生成指定外观的 CSS 变量块，可直接注入 <style>。
 */
export function generateTheme07CssVariables(appearance: Theme07Appearance = 'light'): string {
  const tokens = makeCssTokens(appearance);
  return `:root {\n${buildCssVarsFromTokens(tokens)}\n}`;
}

/**
 * 生成默认 light 的 CSS 变量块。
 */
export function generateTheme07CssVariablesWithAppearance(): string {
  return generateTheme07CssVariables('light');
}

/**
 * 生成包含 light + dark 外观的完整 CSS 变量块。
 * 通过 :root 的 data-appearance 属性切换。
 */
export function generateTheme07CssVariablesWithSchemesAndAppearance(): string {
  const appearances: Theme07Appearance[] = ['light', 'dark'];
  const blocks: string[] = [];

  for (const appearance of appearances) {
    if (appearance === 'light') {
      blocks.push(`:root[data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('light'))}\n}`);
      blocks.push(`:root[data-appearance="light"][data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('light'))}\n}`);
    } else {
      blocks.push(`:root[data-appearance="dark"][data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('dark'))}\n}`);
    }
  }

  return blocks.join('\n');
}
