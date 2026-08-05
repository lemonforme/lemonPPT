// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme03 设计 Token。
 * 风格：代码编辑风 / Editorial Code。
 * 深色背景、高对比、强字重、等宽标签，适合技术方案、开发者大会、投研报告。
 * 支持 scheme-a（赛博青柠 + 电光粉）与 scheme-b（琥珀金 + 青绿紫）两套强调色方案，
 * 以及 light / dark 两种深浅外观模式。
 */
export interface Theme03Tokens {
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
    blue: string;
    green: string;
    amber: string;
    violet: string;
    cyan: string;
    pink: string;
    orange: string;
    lime: string;
    series: readonly string[];
    background: string;
    surface: string;
    surfaceStrong: string;
    surfaceSolid: string;
    border: string;
    shadow: string;
    shadowSmall: string;
    glowA: string;
    glowB: string;
    glowC: string;
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
    glassBlur: string;
    glassBorder: string;
    riseDistance: string;
    riseDuration: string;
  };
}

export const theme03Tokens = {
  id: 'theme03',
  displayName: 'Theme 03',
  description: '代码编辑风，深色高对比，电光蓝与电光粉双强调色，适合技术方案与投研报告',
  colors: {
    ink: '#e8edf3',
    ink2: 'rgba(232, 237, 243, 0.66)',
    ink3: 'rgba(232, 237, 243, 0.40)',
    textInverse: '#05080d',
    accent: '#00b4ff',
    accent2: '#ff2a6d',
    accentCool: '#8b5cf6',
    red: '#ff2a6d',
    blue: '#00b4ff',
    green: '#22d3ee',
    amber: '#ff9f1c',
    violet: '#8b5cf6',
    cyan: '#00b4ff',
    pink: '#ff2a6d',
    orange: '#ff7b54',
    lime: '#00b4ff',
    series: ['#00b4ff', '#ff2a6d', '#8b5cf6', '#ff7b54', '#ff9f1c', '#22d3ee'],
    background: '#05080d',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceStrong: 'rgba(255, 255, 255, 0.10)',
    surfaceSolid: '#0d1118',
    border: 'rgba(232, 237, 243, 0.12)',
    shadow: '0 24px 60px rgba(0, 0, 0, 0.50)',
    shadowSmall: '0 8px 24px rgba(0, 0, 0, 0.40)',
    glowA: 'rgba(0, 180, 255, 0.20)',
    glowB: 'rgba(255, 42, 109, 0.16)',
    glowC: 'rgba(139, 92, 246, 0.12)',
  },
  fonts: {
    heading: '"Space Grotesk", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    body: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    mono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    en: '"Space Grotesk", "Space Mono", ui-monospace, monospace',
  },
  spacing: {
    pagePadding: '108px',
    sectionGap: '40px',
    elementGap: '20px',
    padTop: '92px',
    padBottom: '84px',
    cardPaddingLarge: '52px 60px',
    cardPaddingMedium: '32px 28px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  fontSize: {
    display: '104px',
    displaySmall: '80px',
    h1: '62px',
    h2: '46px',
    h3: '34px',
    body: '24px',
    bodySmall: '18px',
    caption: '14px',
  },
  effect: {
    glassBlur: 'blur(28px) saturate(150%)',
    glassBorder: '1px solid rgba(240, 241, 245, 0.14)',
    riseDistance: '18px',
    riseDuration: '0.6s',
  },
} as const;

interface AccentScheme {
  accent: string;
  accent2: string;
  accentCool: string;
}

const schemeA: AccentScheme = {
  accent: '#00b4ff',
  accent2: '#ff2a6d',
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
  ink3: 'rgba(232, 237, 243, 0.40)',
  textInverse: '#05080d',
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
  ink3: 'rgba(5, 8, 13, 0.52)',
  textInverse: '#e8edf3',
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

function adjustSchemeForLight(scheme: AccentScheme): AccentScheme {
  return {
    accent: scheme.accent === '#00b4ff' ? '#0077b6' : scheme.accent === '#ff9f1c' ? '#b45309' : scheme.accent,
    accent2: scheme.accent2 === '#ff2a6d' ? '#c2185b' : scheme.accent2 === '#00b4ff' ? '#0077b6' : scheme.accent2,
    accentCool: scheme.accentCool === '#8b5cf6' ? '#6b21a8' : scheme.accentCool,
  };
}

function makeTokens(scheme: AccentScheme, appearance: Theme03Appearance = 'dark') {
  const base = appearance === 'light' ? lightBase : darkBase;
  const effectiveScheme = appearance === 'light' ? adjustSchemeForLight(scheme) : scheme;
  const isLight = appearance === 'light';
  return {
    accent: effectiveScheme.accent,
    accent2: effectiveScheme.accent2,
    accentCool: effectiveScheme.accentCool,
    red: isLight ? '#c2185b' : '#ff2a6d',
    blue: isLight ? '#0077b6' : '#00b4ff',
    green: isLight ? '#0077b6' : '#22d3ee',
    amber: isLight ? '#b45309' : '#ff9f1c',
    violet: isLight ? '#6b21a8' : '#8b5cf6',
    cyan: isLight ? '#0077b6' : '#00b4ff',
    pink: isLight ? '#c2185b' : '#ff2a6d',
    orange: isLight ? '#c2410c' : '#ff7b54',
    lime: isLight ? '#0077b6' : '#00b4ff',
    series: [effectiveScheme.accent, effectiveScheme.accent2, effectiveScheme.accentCool, isLight ? '#c2410c' : '#ff7b54', isLight ? '#b45309' : '#ff9f1c', isLight ? '#0077b6' : '#22d3ee'],
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

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const theme03TokensA = makeTokens(schemeA);
export const theme03TokensB = makeTokens(schemeB);

export type Theme03ColorScheme = 'scheme-a' | 'scheme-b';
export type Theme03Appearance = 'light' | 'dark';

export function getTheme03Tokens(scheme: Theme03ColorScheme, appearance: Theme03Appearance = 'dark') {
  return scheme === 'scheme-b' ? makeTokens(schemeB, appearance) : makeTokens(schemeA, appearance);
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
 * 生成 theme03 CSS 变量字符串。
 * 支持 scheme-a / scheme-b 两套强调色方案与 light / dark 外观模式。
 */
export function generateTheme03CssVariables(scheme: Theme03ColorScheme = 'scheme-a', appearance: Theme03Appearance = 'dark'): string {
  return buildCssVarsFromTokens(getTheme03Tokens(scheme, appearance));
}

/**
 * 生成同时包含 scheme-a / scheme-b 与 light / dark 组合的 CSS 字符串，
 * 通过 :root 的 data-theme（scheme）与 data-appearance（light/dark）切换。
 *
 * 变量块优先级顺序（后覆盖前）：
 * 1. :root — scheme-a + dark
 * 2. [data-theme="scheme-b"] — scheme-b + dark
 * 3. [data-appearance="light"] — scheme-a + light
 * 4. [data-theme="scheme-b"][data-appearance="light"] — scheme-b + light
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
