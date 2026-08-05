// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme06 视觉 Token（深色图谱风）。
 * 与 packages/themes/src/theme06/tokens.ts 保持同步，供模板组件与渲染器消费。
 * 支持 4 套强调色方案（volt / magma / nebula / nova）与 light / dark 双外观。
 */
export interface Theme06Tokens {
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
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
}

export type Theme06Appearance = 'light' | 'dark';
export type Theme06ColorScheme = 'volt' | 'magma' | 'nebula' | 'nova';

interface ColorSchemePalette {
  accent: string;
  accent2: string;
  accentCool: string;
}

const schemePalettes: Record<Theme06ColorScheme, { dark: ColorSchemePalette; light: ColorSchemePalette }> = {
  volt: {
    dark: { accent: '#B6FF2B', accent2: '#00E5B0', accentCool: '#2E9FFF' },
    light: { accent: '#7BC800', accent2: '#009E7A', accentCool: '#1A6FD6' },
  },
  magma: {
    dark: { accent: '#FF6B45', accent2: '#FFC700', accentCool: '#00C2FF' },
    light: { accent: '#D94E2B', accent2: '#C78F00', accentCool: '#008FBF' },
  },
  nebula: {
    dark: { accent: '#2E9FFF', accent2: '#A855F7', accentCool: '#22D3EE' },
    light: { accent: '#1A6FD6', accent2: '#7C2ED3', accentCool: '#0B9FB8' },
  },
  nova: {
    dark: { accent: '#FFD100', accent2: '#FF6B45', accentCool: '#00E5B0' },
    light: { accent: '#C78F00', accent2: '#D94E2B', accentCool: '#009E7A' },
  },
};

const darkBase = {
  ink: '#F2F4F7',
  ink2: 'rgba(242, 244, 247, 0.72)',
  ink3: 'rgba(242, 244, 247, 0.48)',
  textInverse: '#05070A',
  bg: '#0B0F17',
  bgGradientStart: '#0B0F17',
  bgGradientEnd: '#121926',
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
  imageOverlay: 'linear-gradient(180deg, rgba(11, 15, 23, 0.72) 0%, rgba(11, 15, 23, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  nodeBg: '#151C27',
  nodeBorder: 'rgba(255, 255, 255, 0.18)',
  edge: 'rgba(255, 255, 255, 0.16)',
  focusGlow: 'rgba(182, 255, 43, 0.40)',
  panelLine: 'rgba(255, 255, 255, 0.08)',
};

const lightBase = {
  ink: '#0F172A',
  ink2: 'rgba(15, 23, 42, 0.68)',
  ink3: 'rgba(15, 23, 42, 0.44)',
  textInverse: '#F7F8FA',
  bg: '#F7F8FA',
  bgGradientStart: '#F7F8FA',
  bgGradientEnd: '#ECEFF3',
  surface: 'rgba(0, 0, 0, 0.04)',
  surfaceStrong: 'rgba(0, 0, 0, 0.08)',
  surfaceSolid: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.08)',
  borderStrong: 'rgba(0, 0, 0, 0.14)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.08)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.05)',
  shadowInset: '0 1px 0 rgba(0, 0, 0, 0.06) inset',
  overlay: 'rgba(0, 0, 0, 0.03)',
  overlayStrong: 'rgba(0, 0, 0, 0.06)',
  divider: 'rgba(15, 23, 42, 0.08)',
  scrim: 'rgba(255, 255, 255, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(247, 248, 250, 0.72) 0%, rgba(247, 248, 250, 0.92) 100%)',
  shadowRgb: '15, 23, 42',
  stroke: 'rgba(0, 0, 0, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  nodeBg: '#FFFFFF',
  nodeBorder: 'rgba(0, 0, 0, 0.12)',
  edge: 'rgba(15, 23, 42, 0.20)',
  focusGlow: 'rgba(39, 130, 246, 0.35)',
  panelLine: 'rgba(0, 0, 0, 0.06)',
};

function makeCssTokens(appearance: Theme06Appearance = 'dark', colorScheme: Theme06ColorScheme = 'volt'): Theme06Tokens {
  const base = appearance === 'light' ? lightBase : darkBase;
  const palette = schemePalettes[colorScheme][appearance];
  const { accent, accent2, accentCool } = palette;
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
    blue: isLight ? '#1A6FD6' : '#2E9FFF',
    indigo: isLight ? '#4338CA' : '#6366F1',
    violet: isLight ? '#7C2ED3' : '#A855F7',
    purple: isLight ? '#7C2ED3' : '#A855F7',
    series: [accent, accent2, accentCool, '#FF6B45', '#00E5B0', '#A855F7'],
    ...base,
    font: '"Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    radiusSmall: '4px',
    radiusMedium: '8px',
    radiusLarge: '12px',
  };
}

function buildCssVarsFromTokens(tokens: Theme06Tokens): string {
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
  `;
}

/**
 * 生成指定外观与强调色的 CSS 变量块，可直接注入 <style>。
 * 输出包裹在 :root 选择器中，确保变量生效。
 */
export function generateTheme06CssVariables(
  appearance: Theme06Appearance = 'dark',
  colorScheme: Theme06ColorScheme = 'volt'
): string {
  const tokens = makeCssTokens(appearance, colorScheme);
  return `:root {\n${buildCssVarsFromTokens(tokens)}\n}`;
}

/**
 * 生成默认 dark + volt 的 CSS 变量块。
 */
export function generateTheme06CssVariablesWithAppearance(): string {
  return generateTheme06CssVariables('dark', 'volt');
}

/**
 * 生成包含 4 套强调色 × 2 种外观的完整 CSS 变量块。
 * 通过 :root 的 data-theme 与 data-appearance 属性切换，供编辑器和画廊使用。
 */
export function generateTheme06CssVariablesWithSchemesAndAppearance(): string {
  const schemes: Theme06ColorScheme[] = ['volt', 'magma', 'nebula', 'nova'];
  const appearances: Theme06Appearance[] = ['dark', 'light'];
  const blocks: string[] = [];

  for (const appearance of appearances) {
    for (const scheme of schemes) {
      const selector = appearance === 'dark'
        ? `:root[data-theme="${scheme}"]`
        : `:root[data-appearance="light"][data-theme="${scheme}"]`;
      blocks.push(`${selector} {\n${buildCssVarsFromTokens(makeCssTokens(appearance, scheme))}\n}`);
    }
  }

  return blocks.join('\n');
}
