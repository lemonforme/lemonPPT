// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme04 视觉 Token（玻璃糖果风）。
 * 与 packages/themes/src/theme04/tokens.ts 保持同步，供模板组件与渲染器消费。
 * 支持 4 套糖果色调（green / yellow / blue / pink）与 light / dark 双外观。
 */
export interface Theme04Tokens {
  ink: string;
  ink2: string;
  ink3: string;
  textInverse: string;
  accent: string;
  accent2: string;
  accentCool: string;
  red: string;
  blue: string;
  green: string;
  yellow: string;
  violet: string;
  pink: string;
  orange: string;
  cyan: string;
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
  glowAccent: string;
  glowAccentStrong: string;
  glowAccentSubtle: string;
  glowCool: string;
  glowCoolStrong: string;
  glowCoolSubtle: string;
  glowWarm: string;
  glowWarmSubtle: string;
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

export type Theme04Appearance = 'light' | 'dark';
export type Theme04Tone = 'green' | 'yellow' | 'blue' | 'pink';

const darkBase = {
  ink: '#f4f4f5',
  ink2: 'rgba(244, 244, 245, 0.72)',
  ink3: 'rgba(244, 244, 245, 0.60)',
  textInverse: '#0a0a0a',
  bg: '#0a0a0a',
  bgGradientStart: '#0a0a0a',
  bgGradientEnd: '#121212',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceStrong: 'rgba(255, 255, 255, 0.12)',
  surfaceSolid: '#121212',
  border: 'rgba(255, 255, 255, 0.12)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.35)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
  overlay: 'rgba(255, 255, 255, 0.04)',
  overlayStrong: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.09)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(10, 10, 10, 0.72) 0%, rgba(10, 10, 10, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

const lightBase = {
  ink: '#1a1a1a',
  ink2: 'rgba(26, 26, 26, 0.72)',
  ink3: 'rgba(26, 26, 26, 0.66)',
  textInverse: '#fafaf8',
  bg: '#fafaf8',
  bgGradientStart: '#fafaf8',
  bgGradientEnd: '#f1f1ed',
  surface: 'rgba(0, 0, 0, 0.04)',
  surfaceStrong: 'rgba(0, 0, 0, 0.08)',
  surfaceSolid: '#ffffff',
  border: 'rgba(0, 0, 0, 0.10)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.10)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.07)',
  shadowInset: '0 1px 0 rgba(0, 0, 0, 0.08) inset',
  overlay: 'rgba(0, 0, 0, 0.04)',
  overlayStrong: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(26, 26, 26, 0.08)',
  scrim: 'rgba(255, 255, 255, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(250, 250, 248, 0.72) 0%, rgba(250, 250, 248, 0.92) 100%)',
  shadowRgb: '26, 26, 26',
  stroke: 'rgba(0, 0, 0, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

interface TonePalette {
  accent: string;
  accent2: string;
  accentCool: string;
}

const tonePalettes: Record<Theme04Tone, { dark: TonePalette; light: TonePalette }> = {
  green: {
    dark: { accent: '#3ade80', accent2: '#ff6b9d', accentCool: '#4ecdc4' },
    light: { accent: '#157a43', accent2: '#b81e63', accentCool: '#0a6b61' },
  },
  yellow: {
    dark: { accent: '#ffd166', accent2: '#ff6b9d', accentCool: '#4ecdc4' },
    light: { accent: '#d97706', accent2: '#db2777', accentCool: '#0d9488' },
  },
  blue: {
    dark: { accent: '#4ecdc4', accent2: '#ffd166', accentCool: '#ff6b9d' },
    light: { accent: '#0d9488', accent2: '#d97706', accentCool: '#db2777' },
  },
  pink: {
    dark: { accent: '#ff6b9d', accent2: '#4ecdc4', accentCool: '#ffd166' },
    light: { accent: '#db2777', accent2: '#0d9488', accentCool: '#d97706' },
  },
};

function makeTokens(appearance: Theme04Appearance = 'dark', tone: Theme04Tone = 'green') {
  const base = appearance === 'light' ? lightBase : darkBase;
  const palette = tonePalettes[tone][appearance];
  const { accent, accent2, accentCool } = palette;
  const isLight = appearance === 'light';
  return {
    accent,
    accent2,
    accentCool,
    red: isLight ? '#ef4444' : '#ff6b6b',
    blue: accentCool,
    green: accent,
    yellow: isLight ? '#9a5b00' : '#ffd166',
    violet: isLight ? '#7c3aed' : '#a78bfa',
    pink: accent2,
    orange: isLight ? '#ea580c' : '#ff8a5b',
    cyan: accentCool,
    series: [accent, accent2, accentCool, isLight ? '#d97706' : '#ffd166', isLight ? '#7c3aed' : '#a78bfa', isLight ? '#ea580c' : '#ff8a5b'],
    ...base,
    glowAccent: hexToRgba(accent, 0.20),
    glowAccentStrong: hexToRgba(accent, 0.30),
    glowAccentSubtle: hexToRgba(accent, 0.10),
    glowCool: hexToRgba(accent2, 0.16),
    glowCoolStrong: hexToRgba(accent2, 0.24),
    glowCoolSubtle: hexToRgba(accent2, 0.08),
    glowWarm: hexToRgba(accentCool, 0.12),
    glowWarmSubtle: hexToRgba(accentCool, 0.06),
    font: '"Space Grotesk", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    radiusSmall: '12px',
    radiusMedium: '20px',
    radiusLarge: '999px',
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildCssVarsFromTokens(tokens: ReturnType<typeof makeTokens>): string {
  return `
  --lp-ink: ${tokens.ink};
  --lp-ink2: ${tokens.ink2};
  --lp-ink3: ${tokens.ink3};
  --lp-text-inverse: ${tokens.textInverse};
  --lp-accent: ${tokens.accent};
  --lp-accent-2: ${tokens.accent2};
  --lp-accent-cool: ${tokens.accentCool};
  --lp-red: ${tokens.red};
  --lp-blue: ${tokens.blue};
  --lp-green: ${tokens.green};
  --lp-yellow: ${tokens.yellow};
  --lp-violet: ${tokens.violet};
  --lp-pink: ${tokens.pink};
  --lp-orange: ${tokens.orange};
  --lp-cyan: ${tokens.cyan};
  --lp-bg: ${tokens.bg};
  --lp-bg-gradient-start: ${tokens.bgGradientStart};
  --lp-bg-gradient-end: ${tokens.bgGradientEnd};
  --lp-surface: ${tokens.surface};
  --lp-surface-strong: ${tokens.surfaceStrong};
  --lp-surface-solid: ${tokens.surfaceSolid};
  --lp-border: ${tokens.border};
  --lp-shadow: ${tokens.shadow};
  --lp-shadow-sm: ${tokens.shadowSm};
  --lp-glow-accent: ${tokens.glowAccent};
  --lp-glow-accent-strong: ${tokens.glowAccentStrong};
  --lp-glow-accent-subtle: ${tokens.glowAccentSubtle};
  --lp-glow-cool: ${tokens.glowCool};
  --lp-glow-cool-strong: ${tokens.glowCoolStrong};
  --lp-glow-cool-subtle: ${tokens.glowCoolSubtle};
  --lp-glow-warm: ${tokens.glowWarm};
  --lp-glow-warm-subtle: ${tokens.glowWarmSubtle};
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
`.trim();
}

export function generateTheme04CssVariables(
  appearance: Theme04Appearance = 'dark',
  tone: Theme04Tone = 'green',
): string {
  return buildCssVarsFromTokens(makeTokens(appearance, tone));
}

/**
 * 生成同时包含 light / dark 外观与 4 套色调的 CSS 字符串。
 * 通过 :root 的 data-appearance 与 data-theme 属性切换。
 * theme04 使用 colorScheme 表示色调（green/yellow/blue/pink），appearance 表示深浅模式。
 */
export function generateTheme04CssVariablesWithTonesAndAppearance(): string {
  const darkGreen = buildCssVarsFromTokens(makeTokens('dark', 'green'));
  const darkYellow = buildCssVarsFromTokens(makeTokens('dark', 'yellow'));
  const darkBlue = buildCssVarsFromTokens(makeTokens('dark', 'blue'));
  const darkPink = buildCssVarsFromTokens(makeTokens('dark', 'pink'));
  const lightGreen = buildCssVarsFromTokens(makeTokens('light', 'green'));
  const lightYellow = buildCssVarsFromTokens(makeTokens('light', 'yellow'));
  const lightBlue = buildCssVarsFromTokens(makeTokens('light', 'blue'));
  const lightPink = buildCssVarsFromTokens(makeTokens('light', 'pink'));

  return `
:root {
${darkGreen}
}
:root[data-theme="yellow"] {
${darkYellow}
}
:root[data-theme="blue"] {
${darkBlue}
}
:root[data-theme="pink"] {
${darkPink}
}
:root[data-appearance="light"] {
${lightGreen}
}
:root[data-appearance="light"][data-theme="yellow"] {
${lightYellow}
}
:root[data-appearance="light"][data-theme="blue"] {
${lightBlue}
}
:root[data-appearance="light"][data-theme="pink"] {
${lightPink}
}
`.trim();
}

/**
 * 保持向后兼容的旧函数名：默认深绿。
 */
export function generateTheme04CssVariablesWithAppearance(): string {
  return generateTheme04CssVariablesWithTonesAndAppearance();
}
