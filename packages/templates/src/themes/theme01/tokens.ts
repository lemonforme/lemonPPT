// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 视觉 Token 定义（Vivid Pop · 活力波普）。
 *
 * 作为单一事实来源，既用于生成 CSS 变量，也可供组件在 SSR 等无法读取 CSS 变量的场景兜底使用。
 * 设计语言：浅白浅灰底 + 明亮红/黄/青/蓝等高饱和强调 + 图标+彩色标题组 + 细边框胶囊 + 维恩圆 + 零大卡片。
 * 与 theme09(墨韵专色) / theme10(金色金融) / theme11(流光科技) 形成明确区分。
 *
 * 全部使用 --lp- 前缀；不复制其它主题的签名色值或类名。
 */

export interface Theme01Tokens {
  ink: string;
  ink2: string;
  ink3: string;
  white: string;
  accent: string;
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
  /** 强调色的柔和版本（标签底 / 聚光晕） */
  t1AccentSoft: string;
  /** 深色发丝线（规线 / 中缝 / 分隔） */
  t1Hairline: string;
}

export const theme01Tokens = {
  ink: '#1F2937',
  ink2: '#6B7280',
  ink3: '#9CA3AF',
  white: '#FFFFFF',
  accent: '#EF4444',
  blue100: 'rgba(59, 130, 246, 0.12)',
  gray700: '#6B7280',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#14B8A6',
  amber: '#FBBF24',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#F472B6',
  orange: '#FB923C',
  lime: '#A3E635',
  gray600: '#9CA3AF',
  gray500: '#B0B7C3',
  gray400: '#D1D5DB',
  gray200: 'rgba(31, 41, 55, 0.08)',
  gray100: 'rgba(31, 41, 55, 0.04)',
  bg: '#FFFFFF',
  bgGradientStart: '#FFFFFF',
  bgGradientEnd: '#FEF3C7',
  surface: '#FFFFFF',
  surfaceStrong: '#F3F4F6',
  border: 'rgba(31, 41, 55, 0.12)',
  shadow: '0 12px 32px rgba(31, 41, 55, 0.08)',
  shadowSm: '0 4px 12px rgba(31, 41, 55, 0.06)',
  glowBlue: 'rgba(59, 130, 246, 0.12)',
  glowBlueStrong: 'rgba(59, 130, 246, 0.18)',
  glowBlueSubtle: 'rgba(59, 130, 246, 0.08)',
  glowBlueExtraStrong: 'rgba(59, 130, 246, 0.24)',
  glowAmber: 'rgba(251, 191, 36, 0.12)',
  glowViolet: 'rgba(139, 92, 246, 0.12)',
  glowVioletStrong: 'rgba(139, 92, 246, 0.18)',
  glowVioletSubtle: 'rgba(139, 92, 246, 0.08)',
  glowVioletExtraStrong: 'rgba(139, 92, 246, 0.24)',
  glowCyanSubtle: 'rgba(20, 184, 166, 0.08)',
  glowPinkSubtle: 'rgba(244, 114, 182, 0.08)',
  glowGreenSubtle: 'rgba(20, 184, 166, 0.08)',
  glowRedSubtle: 'rgba(239, 68, 68, 0.08)',
  shadowInset: '0 1px 0 rgba(255, 255, 255, 0.60) inset',
  overlay: 'rgba(31, 41, 55, 0.04)',
  overlayStrong: 'rgba(31, 41, 55, 0.08)',
  divider: 'rgba(31, 41, 55, 0.08)',
  scrim: 'rgba(31, 41, 55, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(31, 41, 55, 0.55) 0%, rgba(31, 41, 55, 0.85) 100%)',
  shadowRgb: '31, 41, 55',
  stroke: 'rgba(31, 41, 55, 0.12)',
  whiteAlpha80: 'rgba(255, 255, 255, 0.80)',
  whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.90)',
  font: '"Nunito", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
  fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
  radiusSmall: '8px',
  radiusMedium: '16px',
  radiusLarge: '28px',
  t1AccentSoft: 'rgba(239, 68, 68, 0.12)',
  t1Hairline: 'rgba(31, 41, 55, 0.12)',
} as const satisfies Theme01Tokens;

/**
 * 组件默认使用的主色调序列，与 ECharts 等图表库配色保持一致。
 */
export const theme01ColorSequence = [
  theme01Tokens.accent,
  theme01Tokens.amber,
  theme01Tokens.green,
  theme01Tokens.blue,
  theme01Tokens.violet,
  theme01Tokens.pink,
  theme01Tokens.orange,
  theme01Tokens.lime,
];

/**
 * 深色变体（Vivid Pop 暗夜版）—— 深紫 Slate 底 + 同等强调色提亮。
 */
export const theme01DarkTokens = {
  ...theme01Tokens,
  bg: '#1E1B2E',
  bgGradientStart: '#252139',
  bgGradientEnd: '#18152A',
  surface: '#2A2640',
  surfaceStrong: '#36324D',
  border: 'rgba(255, 255, 255, 0.10)',
  shadow: '0 18px 40px rgba(0, 0, 0, 0.30)',
  shadowSm: '0 6px 16px rgba(0, 0, 0, 0.22)',
  divider: 'rgba(255, 255, 255, 0.08)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  imageOverlay: 'linear-gradient(180deg, rgba(30, 27, 46, 0.60) 0%, rgba(30, 27, 46, 0.88) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(255, 255, 255, 0.10)',
  t1AccentSoft: 'rgba(239, 68, 68, 0.20)',
  t1Hairline: 'rgba(255, 255, 255, 0.12)',
} as const satisfies Theme01Tokens;

export type Theme01ColorScheme = 'light' | 'dark';

function buildCssVarsFromTokens(tokens: Theme01Tokens): string {
  return `
  --lp-ink: ${tokens.ink};
  --lp-ink2: ${tokens.ink2};
  --lp-ink3: ${tokens.ink3};
  --lp-white: ${tokens.white};
  --lp-accent: ${tokens.accent};
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
  --lp-t1-accent-soft: ${tokens.t1AccentSoft};
  --lp-t1-hairline: ${tokens.t1Hairline};
`.trim();
}

/**
 * 生成可在 <style> 标签中使用的 CSS 变量字符串。
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
