// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 视觉 Token 定义。
 * 作为单一事实来源，既用于生成 CSS 变量，也可供组件在 SSR 等无法读取 CSS 变量的场景兜底使用。
 * CSS 变量名与 theme01.css 中已有的变量保持一致，例如 --lp-blue、--lp-font 等。
 */
export interface Theme01Tokens {
  ink: string;
  ink2: string;
  ink3: string;
  white: string;
  blue100: string;
  gray700: string;
  red: string;
  blue: string;
  green: string;
  amber: string;
  violet: string;
  cyan: string;
  pink: string;
  orange: string;
  lime: string;
  gray600: string;
  gray500: string;
  gray400: string;
  gray200: string;
  gray100: string;
  bg: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  shadow: string;
  shadowSm: string;
  glowBlue: string;
  glowBlueStrong: string;
  glowBlueSubtle: string;
  glowBlueExtraStrong: string;
  glowAmber: string;
  glowViolet: string;
  glowVioletStrong: string;
  glowVioletSubtle: string;
  glowVioletExtraStrong: string;
  glowCyanSubtle: string;
  glowPinkSubtle: string;
  glowGreenSubtle: string;
  glowRedSubtle: string;
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

export const theme01Tokens = {
  ink: '#2a2a30',
  ink2: '#56565c',
  ink3: '#9a9ba4',
  white: '#ffffff',
  blue100: '#DBEAFE',
  gray700: '#374151',
  red: '#e15b4d',
  blue: '#5b9bd5',
  green: '#4caf8a',
  amber: '#e0a844',
  violet: '#7b6ad4',
  cyan: '#48a8c8',
  pink: '#d86aa3',
  orange: '#e67e22',
  lime: '#84cc16',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  bg: '#f4f6f9',
  bgGradientStart: '#f4f6f9',
  bgGradientEnd: '#eef1f6',
  surface: 'rgba(255, 255, 255, 0.55)',
  surfaceStrong: 'rgba(255, 255, 255, 0.72)',
  border: 'rgba(255, 255, 255, 0.72)',
  shadow: '0 24px 60px rgba(70, 72, 100, 0.13)',
  shadowSm: '0 8px 24px rgba(70, 72, 100, 0.1)',
  glowBlue: 'rgba(91, 155, 213, 0.22)',
  glowBlueStrong: 'rgba(91, 155, 213, 0.25)',
  glowBlueSubtle: 'rgba(91, 155, 213, 0.12)',
  glowBlueExtraStrong: 'rgba(91, 155, 213, 0.45)',
  glowAmber: 'rgba(224, 168, 68, 0.18)',
  glowViolet: 'rgba(123, 106, 212, 0.16)',
  glowVioletStrong: 'rgba(123, 106, 212, 0.25)',
  glowVioletSubtle: 'rgba(123, 106, 212, 0.12)',
  glowVioletExtraStrong: 'rgba(123, 106, 212, 0.45)',
  glowCyanSubtle: 'rgba(72, 168, 200, 0.12)',
  glowPinkSubtle: 'rgba(216, 106, 163, 0.12)',
  glowGreenSubtle: 'rgba(76, 175, 138, 0.16)',
  glowRedSubtle: 'rgba(225, 91, 77, 0.16)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.75) inset',
  overlay: 'rgba(0, 0, 0, 0.06)',
  overlayStrong: 'rgba(0, 0, 0, 0.12)',
  divider: 'rgba(0, 0, 0, 0.05)',
  scrim: 'rgba(0, 0, 0, 0.42)',
  imageOverlay: 'linear-gradient(180deg, rgba(244, 246, 249, 0.72) 0%, rgba(244, 246, 249, 0.92) 100%)',
  shadowRgb: '70, 72, 100',
  stroke: 'rgba(42, 42, 48, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
  font: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
  fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
  radiusSmall: '9px',
  radiusMedium: '18px',
  radiusLarge: '24px',
} as const satisfies Theme01Tokens;

/**
 * 组件默认使用的主色调序列，与 ECharts 等图表库配色保持一致。
 */
export const theme01ColorSequence = [
  theme01Tokens.blue,
  theme01Tokens.green,
  theme01Tokens.amber,
  theme01Tokens.red,
  theme01Tokens.violet,
  theme01Tokens.pink,
  theme01Tokens.cyan,
  theme01Tokens.orange,
  theme01Tokens.lime,
];

export const theme01DarkTokens = {
  ...theme01Tokens,
  ink: '#f0f0f5',
  ink2: '#c0c0cc',
  ink3: '#888899',
  bg: '#1a1a20',
  bgGradientStart: '#1a1a20',
  bgGradientEnd: '#25252c',
  surface: 'rgba(40, 40, 48, 0.60)',
  surfaceStrong: 'rgba(48, 48, 58, 0.78)',
  border: 'rgba(255, 255, 255, 0.10)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.28)',
  glowBlue: 'rgba(91, 155, 213, 0.14)',
  glowBlueStrong: 'rgba(91, 155, 213, 0.18)',
  glowBlueSubtle: 'rgba(91, 155, 213, 0.10)',
  glowBlueExtraStrong: 'rgba(91, 155, 213, 0.35)',
  glowAmber: 'rgba(224, 168, 68, 0.11)',
  glowViolet: 'rgba(123, 106, 212, 0.10)',
  glowVioletStrong: 'rgba(123, 106, 212, 0.18)',
  glowVioletSubtle: 'rgba(123, 106, 212, 0.10)',
  glowVioletExtraStrong: 'rgba(123, 106, 212, 0.35)',
  glowCyanSubtle: 'rgba(72, 168, 200, 0.10)',
  glowPinkSubtle: 'rgba(216, 106, 163, 0.10)',
  glowGreenSubtle: 'rgba(76, 175, 138, 0.14)',
  glowRedSubtle: 'rgba(225, 91, 77, 0.14)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.08) inset',
  overlay: 'rgba(255, 255, 255, 0.06)',
  overlayStrong: 'rgba(255, 255, 255, 0.10)',
  divider: 'rgba(255, 255, 255, 0.08)',
  scrim: 'rgba(0, 0, 0, 0.60)',
  imageOverlay: 'linear-gradient(180deg, rgba(26, 26, 32, 0.72) 0%, rgba(26, 26, 32, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.10)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
} as const satisfies Theme01Tokens;

export type Theme01ColorScheme = 'light' | 'dark';

function buildCssVarsFromTokens(tokens: Theme01Tokens): string {
  return `
  --lp-ink: ${tokens.ink};
  --lp-ink2: ${tokens.ink2};
  --lp-ink3: ${tokens.ink3};
  --lp-white: ${tokens.white};
  --lp-blue-100: ${tokens.blue100};
  --lp-gray-700: ${tokens.gray700};
  --lp-red: ${tokens.red};
  --lp-blue: ${tokens.blue};
  --lp-green: ${tokens.green};
  --lp-amber: ${tokens.amber};
  --lp-violet: ${tokens.violet};
  --lp-cyan: ${tokens.cyan};
  --lp-pink: ${tokens.pink};
  --lp-orange: ${tokens.orange};
  --lp-lime: ${tokens.lime};
  --lp-gray-600: ${tokens.gray600};
  --lp-gray-500: ${tokens.gray500};
  --lp-gray-400: ${tokens.gray400};
  --lp-gray-200: ${tokens.gray200};
  --lp-gray-100: ${tokens.gray100};
  --lp-bg: ${tokens.bg};
  --lp-bg-gradient-start: ${tokens.bgGradientStart};
  --lp-bg-gradient-end: ${tokens.bgGradientEnd};
  --lp-surface: ${tokens.surface};
  --lp-surface-strong: ${tokens.surfaceStrong};
  --lp-border: ${tokens.border};
  --lp-shadow: ${tokens.shadow};
  --lp-shadow-sm: ${tokens.shadowSm};
  --lp-glow-blue: ${tokens.glowBlue};
  --lp-glow-blue-strong: ${tokens.glowBlueStrong};
  --lp-glow-blue-subtle: ${tokens.glowBlueSubtle};
  --lp-glow-blue-extra-strong: ${tokens.glowBlueExtraStrong};
  --lp-glow-amber: ${tokens.glowAmber};
  --lp-glow-violet: ${tokens.glowViolet};
  --lp-glow-violet-strong: ${tokens.glowVioletStrong};
  --lp-glow-violet-subtle: ${tokens.glowVioletSubtle};
  --lp-glow-violet-extra-strong: ${tokens.glowVioletExtraStrong};
  --lp-glow-cyan-subtle: ${tokens.glowCyanSubtle};
  --lp-glow-pink-subtle: ${tokens.glowPinkSubtle};
  --lp-glow-green-subtle: ${tokens.glowGreenSubtle};
  --lp-glow-red-subtle: ${tokens.glowRedSubtle};
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
 * 生成可在 <style> 标签中使用的 CSS 变量字符串。
 * 变量名与 theme01.css 中已有的变量保持一致。
 * 支持 light / dark 两种配色方案。
 */
export function generateThemeCssVariables(scheme: Theme01ColorScheme = 'light'): string {
  return buildCssVarsFromTokens(scheme === 'dark' ? theme01DarkTokens : theme01Tokens);
}

/**
 * 生成同时包含 light 与 dark 两套变量的 CSS 字符串，
 * 通过 :root 与 :root[data-theme="dark"] 选择器切换。
 */
export function generateThemeCssVariablesWithDark(): string {
  return `
:root {
${buildCssVarsFromTokens(theme01Tokens)}
}
:root[data-theme="dark"] {
${buildCssVarsFromTokens(theme01DarkTokens)}
}
`.trim();
}
