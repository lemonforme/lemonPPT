// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme05 视觉 Token（光谱报告风）。
 * 与 packages/themes/src/theme05/tokens.ts 保持同步，供模板组件与渲染器消费。
 * 支持 5 套光谱强调色（coral / amber / teal / indigo / violet）与 light / dark 双外观。
 */
export interface Theme05Tokens {
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
  border: string;
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
  font: string;
  fontMono: string;
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
}

export type Theme05Appearance = 'light' | 'dark';
export type Theme05ColorScheme = 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';

interface ColorSchemePalette {
  accent: string;
  accent2: string;
  accentCool: string;
}

const schemePalettes: Record<Theme05ColorScheme, { dark: ColorSchemePalette; light: ColorSchemePalette }> = {
  coral: {
    dark: { accent: '#E85D4E', accent2: '#F5A623', accentCool: '#4A58D9' },
    light: { accent: '#C73E2F', accent2: '#C47B08', accentCool: '#3A46B0' },
  },
  amber: {
    dark: { accent: '#F5A623', accent2: '#E85D4E', accentCool: '#0FA3B1' },
    light: { accent: '#C47B08', accent2: '#C73E2F', accentCool: '#0B7A85' },
  },
  teal: {
    dark: { accent: '#0FA3B1', accent2: '#4A58D9', accentCool: '#F5A623' },
    light: { accent: '#0B7A85', accent2: '#3A46B0', accentCool: '#C47B08' },
  },
  indigo: {
    dark: { accent: '#4A58D9', accent2: '#0FA3B1', accentCool: '#F5A623' },
    light: { accent: '#3A46B0', accent2: '#0B7A85', accentCool: '#C47B08' },
  },
  violet: {
    dark: { accent: '#7C3AED', accent2: '#F5A623', accentCool: '#0FA3B1' },
    light: { accent: '#5B25C1', accent2: '#C47B08', accentCool: '#0B7A85' },
  },
};

const darkBase = {
  ink: '#F4F4F5',
  ink2: 'rgba(244, 244, 245, 0.72)',
  ink3: 'rgba(244, 244, 245, 0.48)',
  textInverse: '#15151A',
  bg: '#15151A',
  bgGradientStart: '#15151A',
  bgGradientEnd: '#1E1E24',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceStrong: 'rgba(255, 255, 255, 0.12)',
  surfaceSolid: '#1E1E24',
  border: 'rgba(255, 255, 255, 0.12)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.35)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
  overlay: 'rgba(255, 255, 255, 0.04)',
  overlayStrong: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.09)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(21, 21, 26, 0.72) 0%, rgba(21, 21, 26, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

const lightBase = {
  ink: '#1A1A1A',
  ink2: 'rgba(26, 26, 26, 0.72)',
  ink3: 'rgba(26, 26, 26, 0.48)',
  textInverse: '#F7F4EF',
  bg: '#F7F4EF',
  bgGradientStart: '#F7F4EF',
  bgGradientEnd: '#EDE9E2',
  surface: 'rgba(0, 0, 0, 0.04)',
  surfaceStrong: 'rgba(0, 0, 0, 0.08)',
  surfaceSolid: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.10)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.10)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.07)',
  shadowInset: '0 1px 0 rgba(0, 0, 0, 0.08) inset',
  overlay: 'rgba(0, 0, 0, 0.04)',
  overlayStrong: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(26, 26, 26, 0.08)',
  scrim: 'rgba(255, 255, 255, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(247, 244, 239, 0.72) 0%, rgba(247, 244, 239, 0.92) 100%)',
  shadowRgb: '26, 26, 26',
  stroke: 'rgba(0, 0, 0, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

function makeCssTokens(appearance: Theme05Appearance = 'dark', colorScheme: Theme05ColorScheme = 'coral'): Theme05Tokens {
  const base = appearance === 'light' ? lightBase : darkBase;
  const palette = schemePalettes[colorScheme][appearance];
  const { accent, accent2, accentCool } = palette;
  const isLight = appearance === 'light';
  return {
    accent,
    accent2,
    accentCool,
    red: isLight ? '#C73E2F' : '#E85D4E',
    orange: isLight ? '#C25E00' : '#F5A623',
    amber: isLight ? '#C47B08' : '#F5A623',
    yellow: isLight ? '#A16207' : '#F5A623',
    teal: isLight ? '#0B7A85' : '#0FA3B1',
    green: isLight ? '#15803D' : '#22C55E',
    cyan: isLight ? '#0B7A85' : '#0FA3B1',
    blue: isLight ? '#3A46B0' : '#4A58D9',
    indigo: isLight ? '#3A46B0' : '#4A58D9',
    violet: isLight ? '#5B25C1' : '#7C3AED',
    purple: isLight ? '#5B25C1' : '#7C3AED',
    series: [accent, accent2, accentCool, '#E85D4E', '#0FA3B1', '#7C3AED'],
    ...base,
    font: '"Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    radiusSmall: '4px',
    radiusMedium: '8px',
    radiusLarge: '16px',
  };
}

function buildCssVarsFromTokens(tokens: Theme05Tokens): string {
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
  --lp-border: ${tokens.border};
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
  --lp-font: ${tokens.font};
  --lp-font-mono: ${tokens.fontMono};
  --lp-radius-small: ${tokens.radiusSmall};
  --lp-radius-medium: ${tokens.radiusMedium};
  --lp-radius-large: ${tokens.radiusLarge};
  --lp-radius-lg: ${tokens.radiusLarge};
  --lp-font-size-display: 96px;
  --lp-font-size-display-small: 76px;
  --lp-font-size-h1: 58px;
  --lp-font-size-h2: 42px;
  --lp-font-size-h3: 30px;
  --lp-font-size-body: 22px;
  --lp-font-size-body-small: 17px;
  --lp-font-size-caption: 14px;
  `;
}

/**
 * 生成指定外观与强调色的 CSS 变量块，可直接注入 <style>。
 * 输出包裹在 :root 选择器中，确保变量生效。
 */
export function generateTheme05CssVariables(
  appearance: Theme05Appearance = 'dark',
  colorScheme: Theme05ColorScheme = 'coral'
): string {
  const tokens = makeCssTokens(appearance, colorScheme);
  return `:root {\n${buildCssVarsFromTokens(tokens)}\n}`;
}

/**
 * 生成默认 dark + coral 的 CSS 变量块。
 */
export function generateTheme05CssVariablesWithAppearance(): string {
  return generateTheme05CssVariables('dark', 'coral');
}

/**
 * 生成包含 5 套强调色 × 2 种外观的完整 CSS 变量块。
 * 通过 :root 的 data-theme 与 data-appearance 属性切换，供编辑器和画廊使用。
 */
export function generateTheme05CssVariablesWithSchemesAndAppearance(): string {
  const schemes: Theme05ColorScheme[] = ['coral', 'amber', 'teal', 'indigo', 'violet'];
  const appearances: Theme05Appearance[] = ['dark', 'light'];
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
