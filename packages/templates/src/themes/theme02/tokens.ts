// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme02 视觉 Token 定义。
 * 整体风格：深色霓虹科技风。
 * 支持两套强调色方案（scheme-a / scheme-b），通过 CSS 变量切换。
 */
export interface Theme02Tokens {
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
  amber: string;
  violet: string;
  cyan: string;
  pink: string;
  orange: string;
  lime: string;
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

interface AccentScheme {
  accent: string;
  accent2: string;
  accentCool: string;
}

const schemeA: AccentScheme = {
  accent: '#00e5b0',
  accent2: '#ffd166',
  accentCool: '#00b4ff',
};

const schemeB: AccentScheme = {
  accent: '#818cf8',
  accent2: '#ff8585',
  accentCool: '#67e8f9',
};

function makeTokens(scheme: AccentScheme): Theme02Tokens {
  return {
    ink: '#f0f4f8',
    ink2: 'rgba(240, 244, 248, 0.68)',
    ink3: 'rgba(240, 244, 248, 0.64)',
    textInverse: '#080a0e',
    accent: scheme.accent,
    accent2: scheme.accent2,
    accentCool: scheme.accentCool,
    red: '#ff6b6b',
    blue: '#60a5fa',
    green: '#4ade80',
    amber: '#fbbf24',
    violet: '#a78bfa',
    cyan: '#22d3ee',
    pink: '#f472b6',
    orange: '#fb923c',
    lime: '#a3e635',
    series: [scheme.accent, scheme.accent2, scheme.accentCool, '#ff6b6b', '#a78bfa', '#f472b6', '#22d3ee'],
    bg: '#080a0e',
    bgGradientStart: '#080a0e',
    bgGradientEnd: '#0d1016',
    surface: 'rgba(255, 255, 255, 0.055)',
    surfaceStrong: 'rgba(255, 255, 255, 0.10)',
    surfaceSolid: '#0f1218',
    border: 'rgba(255, 255, 255, 0.10)',
    shadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
    shadowSm: '0 8px 24px rgba(0, 0, 0, 0.35)',
    glowAccent: hexToRgba(scheme.accent, 0.22),
    glowAccentStrong: hexToRgba(scheme.accent, 0.32),
    glowAccentSubtle: hexToRgba(scheme.accent, 0.12),
    glowCool: hexToRgba(scheme.accentCool, 0.18),
    glowCoolStrong: hexToRgba(scheme.accentCool, 0.26),
    glowCoolSubtle: hexToRgba(scheme.accentCool, 0.10),
    glowWarm: hexToRgba(scheme.accent2, 0.14),
    glowWarmSubtle: hexToRgba(scheme.accent2, 0.08),
    shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
    overlay: 'rgba(255, 255, 255, 0.04)',
    overlayStrong: 'rgba(255, 255, 255, 0.08)',
    divider: 'rgba(255, 255, 255, 0.08)',
    scrim: 'rgba(0, 0, 0, 0.55)',
    imageOverlay: 'linear-gradient(180deg, rgba(8, 10, 14, 0.72) 0%, rgba(8, 10, 14, 0.92) 100%)',
    shadowRgb: '0, 0, 0',
    stroke: 'rgba(255, 255, 255, 0.10)',
    whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
    whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
    whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
    font: '"Space Grotesk", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    radiusSmall: '10px',
    radiusMedium: '16px',
    radiusLarge: '24px',
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const theme02TokensA = makeTokens(schemeA);
export const theme02TokensB = makeTokens(schemeB);

export type Theme02ColorScheme = 'scheme-a' | 'scheme-b';

export function getTheme02Tokens(scheme: Theme02ColorScheme): Theme02Tokens {
  return scheme === 'scheme-b' ? theme02TokensB : theme02TokensA;
}

function buildCssVarsFromTokens(tokens: Theme02Tokens): string {
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
  --lp-amber: ${tokens.amber};
  --lp-violet: ${tokens.violet};
  --lp-cyan: ${tokens.cyan};
  --lp-pink: ${tokens.pink};
  --lp-orange: ${tokens.orange};
  --lp-lime: ${tokens.lime};
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

/**
 * 生成 theme02 CSS 变量字符串。
 * 支持 scheme-a / scheme-b 两套强调色方案。
 */
export function generateTheme02CssVariables(scheme: Theme02ColorScheme = 'scheme-a'): string {
  return buildCssVarsFromTokens(getTheme02Tokens(scheme));
}

/**
 * 生成同时包含 scheme-a 与 scheme-b 两套变量的 CSS 字符串，
 * 通过 :root 与 :root[data-theme="scheme-b"] 选择器切换。
 */
export function generateTheme02CssVariablesWithSchemes(): string {
  return `
:root {
${buildCssVarsFromTokens(theme02TokensA)}
}
:root[data-theme="scheme-b"] {
${buildCssVarsFromTokens(theme02TokensB)}
}
`.trim();
}
