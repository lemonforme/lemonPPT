// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme07 视觉 Token（冷白调研风）。
 * 与 packages/themes/src/theme07/tokens.ts 保持同步，供模板组件与渲染器消费。
 * 冷白底 + 深墨文字 + 低饱和强调色 + 衬线标题，适合白皮书、调研报告、学术/政策型表达。
 * 单一 light 外观（接口预留 dark 扩展）。
 */
export interface Theme07Tokens {
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

export type Theme07Appearance = 'light' | 'dark';

/**
 * 冷白调研风色板（原创设计，非复制 Dashi）。
 * 明亮鲜艳：电光蓝主色 + 翠绿辅色 + 暖橙警示，高饱和冷调，仍保持白底通透学术感。
 */
const coldWhitePalette = {
  accent: '#0A66C2',
  accent2: '#0E7A5B',
  accentCool: '#C2410C',
};

const lightBase = {
  ink: '#1A1D23',
  ink2: 'rgba(26, 29, 35, 0.72)',
  ink3: 'rgba(26, 29, 35, 0.72)',
  textInverse: '#F8F9FA',
  bg: '#FFFFFF',
  bgGradientStart: '#FFFFFF',
  bgGradientEnd: '#F7F9FB',
  surface: 'rgba(0, 0, 0, 0.03)',
  surfaceStrong: 'rgba(0, 0, 0, 0.06)',
  surfaceSolid: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.08)',
  borderStrong: 'rgba(0, 0, 0, 0.14)',
  shadow: '0 24px 60px rgba(26, 29, 35, 0.08)',
  shadowSm: '0 8px 24px rgba(26, 29, 35, 0.05)',
  shadowInset: '0 1px 0 rgba(0, 0, 0, 0.04) inset',
  overlay: 'rgba(0, 0, 0, 0.02)',
  overlayStrong: 'rgba(0, 0, 0, 0.04)',
  divider: 'rgba(26, 29, 35, 0.08)',
  scrim: 'rgba(255, 255, 255, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(248, 249, 250, 0.72) 0%, rgba(248, 249, 250, 0.92) 100%)',
  shadowRgb: '26, 29, 35',
  stroke: 'rgba(0, 0, 0, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  nodeBg: '#FFFFFF',
  nodeBorder: 'rgba(0, 0, 0, 0.12)',
  edge: 'rgba(26, 29, 35, 0.20)',
  focusGlow: 'rgba(14, 134, 230, 0.28)',
  panelLine: 'rgba(0, 0, 0, 0.06)',
};

const darkBase = {
  ink: '#F2F4F7',
  ink2: 'rgba(242, 244, 247, 0.72)',
  ink3: 'rgba(242, 244, 247, 0.48)',
  textInverse: '#0D100F',
  bg: '#0D100F',
  bgGradientStart: '#0D100F',
  bgGradientEnd: '#151C27',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceStrong: 'rgba(255, 255, 255, 0.10)',
  surfaceSolid: '#151C27',
  surfaceElevated: '#1A2330',
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.50)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.40)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
  overlay: 'rgba(255, 255, 255, 0.04)',
  overlayStrong: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.09)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(13, 16, 15, 0.72) 0%, rgba(13, 16, 15, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  nodeBg: '#151C27',
  nodeBorder: 'rgba(255, 255, 255, 0.18)',
  edge: 'rgba(255, 255, 255, 0.16)',
  focusGlow: 'rgba(14, 134, 230, 0.45)',
  panelLine: 'rgba(255, 255, 255, 0.08)',
};

function makeCssTokens(appearance: Theme07Appearance = 'light'): Theme07Tokens {
  const base = appearance === 'light' ? lightBase : darkBase;
  const { accent, accent2, accentCool } = coldWhitePalette;
  const isLight = appearance === 'light';
  return {
    accent,
    accent2,
    accentCool,
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
    series: [accent, accent2, accentCool, '#7C5CFC', '#16BFD9', '#F24E7D'],
    ...base,
    font: '"Inter", "Noto Sans SC", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", "Space Mono", ui-monospace, monospace',
    fontHeading: '"Source Serif Pro", "Noto Serif SC", Georgia, serif',
    radiusSmall: '4px',
    radiusMedium: '8px',
    radiusLarge: '12px',
  };
}

function buildCssVarsFromTokens(tokens: Theme07Tokens): string {
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
  --lp-font-size-display: 84px;
  --lp-font-size-display-small: 64px;
  --lp-font-size-h1: 48px;
  --lp-font-size-h2: 34px;
  --lp-font-size-h3: 24px;
  --lp-font-size-body: 18px;
  --lp-font-size-body-small: 15px;
  --lp-font-size-caption: 13px;
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
  /* 间距与动效 */
  --lp-page-padding: 56px;
  --lp-section-gap: 32px;
  --lp-element-gap: 14px;
  --lp-pad-top: 72px;
  --lp-pad-bottom: 64px;
  --lp-rise-distance: 14px;
  --lp-rise-duration: 0.5s;
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
 * 通过 :root 的 data-theme 与 data-appearance 属性切换，供编辑器和画廊使用。
 */
export function generateTheme07CssVariablesWithSchemesAndAppearance(): string {
  const appearances: Theme07Appearance[] = ['light', 'dark'];
  const blocks: string[] = [];

  for (const appearance of appearances) {
    // 默认 light 用无 data-appearance 的选择器；同时生成带 data-appearance=light 的显式选择器（编辑器切换时需要）
    if (appearance === 'light') {
      blocks.push(`:root[data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('light'))}\n}`);
      blocks.push(`:root[data-appearance="light"][data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('light'))}\n}`);
    } else {
      blocks.push(`:root[data-appearance="dark"][data-theme="cold-white"] {\n${buildCssVarsFromTokens(makeCssTokens('dark'))}\n}`);
    }
  }

  return blocks.join('\n');
}
