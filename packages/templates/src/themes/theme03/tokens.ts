// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme03 视觉 Token（代码编辑风）。
 * 与 packages/themes/src/theme03/tokens.ts 保持同步，供模板组件消费。
 */
export interface Theme03Tokens {
  ink: string;
  ink2: string;
  ink3: string;
  textInverse: string;
  textOnAccent: string;
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
  accent: '#00b4ff',
  accent2: '#ff5c8a',
  accentCool: '#8b5cf6',
};

const schemeB: AccentScheme = {
  accent: '#ff9f1c',
  accent2: '#00b4ff',
  accentCool: '#8b5cf6',
};

const darkBase = {
  ink: '#e8edf3',
  ink2: 'rgba(232, 237, 243, 0.66)',
  ink3: 'rgba(232, 237, 243, 0.60)',
  textInverse: '#05080d',
  textOnAccent: '#05080d',
  bg: '#05080d',
  bgGradientStart: '#05080d',
  bgGradientEnd: '#0d1118',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceStrong: 'rgba(255, 255, 255, 0.10)',
  surfaceSolid: '#0d1118',
  border: 'rgba(232, 237, 243, 0.12)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.50)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.40)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
  overlay: 'rgba(255, 255, 255, 0.04)',
  overlayStrong: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(232, 237, 243, 0.09)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(5, 8, 13, 0.72) 0%, rgba(5, 8, 13, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(232, 237, 243, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

const lightBase = {
  ink: '#05080d',
  ink2: 'rgba(5, 8, 13, 0.72)',
  ink3: 'rgba(5, 8, 13, 0.68)',
  textInverse: '#e8edf3',
  textOnAccent: '#ffffff',
  bg: '#f1f3f5',
  bgGradientStart: '#f1f3f5',
  bgGradientEnd: '#e5e8eb',
  surface: 'rgba(0, 0, 0, 0.04)',
  surfaceStrong: 'rgba(0, 0, 0, 0.08)',
  surfaceSolid: '#ffffff',
  border: 'rgba(5, 8, 13, 0.10)',
  shadow: '0 24px 60px rgba(5, 8, 13, 0.10)',
  shadowSm: '0 8px 24px rgba(5, 8, 13, 0.07)',
  shadowInset: '0 1px 0 rgba(0, 0, 0, 0.08) inset',
  overlay: 'rgba(0, 0, 0, 0.04)',
  overlayStrong: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(5, 8, 13, 0.08)',
  scrim: 'rgba(255, 255, 255, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(241, 243, 245, 0.72) 0%, rgba(241, 243, 245, 0.92) 100%)',
  shadowRgb: '5, 8, 13',
  stroke: 'rgba(5, 8, 13, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustSchemeForLight(scheme: AccentScheme): AccentScheme {
  return {
    accent: scheme.accent === '#00b4ff' ? '#006699' : scheme.accent === '#ff9f1c' ? '#b45309' : scheme.accent,
    accent2: scheme.accent2 === '#ff5c8a' ? '#a8184e' : scheme.accent2 === '#00b4ff' ? '#006699' : scheme.accent2,
    accentCool: scheme.accentCool === '#8b5cf6' ? '#6b21a8' : scheme.accentCool,
  };
}

function makeTokens(scheme: AccentScheme, appearance: Theme03Appearance = 'dark'): Theme03Tokens {
  const base = appearance === 'light' ? lightBase : darkBase;
  const effectiveScheme = appearance === 'light' ? adjustSchemeForLight(scheme) : scheme;
  const isLight = appearance === 'light';
  return {
    accent: effectiveScheme.accent,
    accent2: effectiveScheme.accent2,
    accentCool: effectiveScheme.accentCool,
    red: isLight ? '#c2185b' : '#ff4d7d',
    blue: isLight ? '#006699' : '#00b4ff',
    green: isLight ? '#006699' : '#22d3ee',
    amber: isLight ? '#b45309' : '#ff9f1c',
    violet: isLight ? '#6b21a8' : '#8b5cf6',
    cyan: isLight ? '#006699' : '#00b4ff',
    pink: isLight ? '#c2185b' : '#ff2a6d',
    orange: isLight ? '#c2410c' : '#ff7b54',
    lime: isLight ? '#006699' : '#00b4ff',
    series: [effectiveScheme.accent, effectiveScheme.accent2, effectiveScheme.accentCool, isLight ? '#c2410c' : '#ff7b54', isLight ? '#b45309' : '#ff9f1c', isLight ? '#006699' : '#22d3ee'],
    ...base,
    glowAccent: hexToRgba(scheme.accent, 0.20),
    glowAccentStrong: hexToRgba(scheme.accent, 0.30),
    glowAccentSubtle: hexToRgba(scheme.accent, 0.10),
    glowCool: hexToRgba(scheme.accent2, 0.16),
    glowCoolStrong: hexToRgba(scheme.accent2, 0.24),
    glowCoolSubtle: hexToRgba(scheme.accent2, 0.08),
    glowWarm: hexToRgba(scheme.accentCool, 0.12),
    glowWarmSubtle: hexToRgba(scheme.accentCool, 0.06),
    font: '"Space Grotesk", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    radiusSmall: '4px',
    radiusMedium: '8px',
    radiusLarge: '12px',
  };
}

export const theme03TokensA = makeTokens(schemeA);
export const theme03TokensB = makeTokens(schemeB);

export type Theme03ColorScheme = 'scheme-a' | 'scheme-b';
export type Theme03Appearance = 'light' | 'dark';

export function getTheme03Tokens(scheme: Theme03ColorScheme, appearance: Theme03Appearance = 'dark'): Theme03Tokens {
  return scheme === 'scheme-b' ? makeTokens(schemeB, appearance) : makeTokens(schemeA, appearance);
}

function buildCssVarsFromTokens(tokens: Theme03Tokens): string {
  return `
  --lp-ink: ${tokens.ink};
  --lp-ink2: ${tokens.ink2};
  --lp-ink3: ${tokens.ink3};
  --lp-text-inverse: ${tokens.textInverse};
  --lp-text-on-accent: ${tokens.textOnAccent};
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

export function generateTheme03CssVariables(scheme: Theme03ColorScheme = 'scheme-a', appearance: Theme03Appearance = 'dark'): string {
  return buildCssVarsFromTokens(getTheme03Tokens(scheme, appearance));
}

/**
 * 生成同时包含 scheme-a / scheme-b 与 light / dark 组合的 CSS 字符串，
 * 通过 :root 的 data-theme（scheme）与 data-appearance（light/dark）切换。
 */
export function generateTheme03CssVariablesWithSchemes(): string {
  const darkA = buildCssVarsFromTokens(getTheme03Tokens('scheme-a', 'dark'));
  const darkB = buildCssVarsFromTokens(getTheme03Tokens('scheme-b', 'dark'));
  const lightA = buildCssVarsFromTokens(getTheme03Tokens('scheme-a', 'light'));
  const lightB = buildCssVarsFromTokens(getTheme03Tokens('scheme-b', 'light'));

  return `
:root {
${darkA}
}
:root[data-theme="scheme-b"] {
${darkB}
}
:root[data-appearance="light"] {
${lightA}
}
:root[data-theme="scheme-b"][data-appearance="light"] {
${lightB}
}
`.trim();
}
