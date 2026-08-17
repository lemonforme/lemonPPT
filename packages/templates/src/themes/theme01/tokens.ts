// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 视觉 Token 定义（espresso 暗色编辑风）。
 *
 * 作为单一事实来源，既用于生成 CSS 变量，也可供组件在 SSR 等无法读取 CSS 变量的场景兜底使用。
 * 设计语言：暖炭 / espresso 基底 + 陶土 terracotta 签名强调 + 奶油 cream 文字 + 大地色数据序列。
 * 与 theme08(黑+金) / theme09(深蓝) / theme10(黑曜+香槟铜) / theme02·06(绿·紫) 形成明确区分。
 *
 * 全部使用 --lp- 前缀，零 --acl-；不复制 theme09 的 #46e3c6 / #4a86ff / bg-deep / bg-blue 等红线色值或类名。
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
  /** 陶土强调的柔和版本（编辑语汇：标签底 / 聚光晕） */
  t1AccentSoft: string;
  /** 奶油色发丝线（编辑语汇：规线 / 中缝 / 分隔） */
  t1Hairline: string;
}

export const theme01Tokens = {
  ink: '#F2E9DC',
  ink2: '#C9BCA8',
  ink3: '#948875',
  white: '#F2E9DC',
  accent: '#C56A43',
  blue100: 'rgba(110, 155, 196, 0.18)',
  gray700: '#C9BCA8',
  red: '#C76B5A',
  blue: '#6E9BC4',
  green: '#8FAE84',
  amber: '#D9A441',
  violet: '#A07CAE',
  cyan: '#5FA8A0',
  pink: '#C98BA0',
  orange: '#C97E4E',
  lime: '#A7A85F',
  gray600: '#A89A85',
  gray500: '#948875',
  gray400: '#736B5C',
  gray200: 'rgba(242, 233, 220, 0.14)',
  gray100: 'rgba(242, 233, 220, 0.08)',
  bg: '#1E1B16',
  bgGradientStart: '#221E18',
  bgGradientEnd: '#15120E',
  surface: 'rgba(40, 35, 28, 0.62)',
  surfaceStrong: 'rgba(50, 44, 35, 0.80)',
  border: 'rgba(242, 233, 220, 0.14)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.38)',
  glowBlue: 'rgba(201, 106, 67, 0.18)',
  glowBlueStrong: 'rgba(201, 106, 67, 0.22)',
  glowBlueSubtle: 'rgba(201, 106, 67, 0.09)',
  glowBlueExtraStrong: 'rgba(201, 106, 67, 0.34)',
  glowAmber: 'rgba(217, 164, 65, 0.14)',
  glowViolet: 'rgba(160, 124, 174, 0.14)',
  glowVioletStrong: 'rgba(160, 124, 174, 0.20)',
  glowVioletSubtle: 'rgba(160, 124, 174, 0.08)',
  glowVioletExtraStrong: 'rgba(160, 124, 174, 0.32)',
  glowCyanSubtle: 'rgba(95, 168, 160, 0.10)',
  glowPinkSubtle: 'rgba(201, 139, 160, 0.10)',
  glowGreenSubtle: 'rgba(143, 174, 132, 0.12)',
  glowRedSubtle: 'rgba(199, 107, 90, 0.12)',
  shadowInset: '0 1px 0 rgba(242, 233, 220, 0.06) inset',
  overlay: 'rgba(242, 233, 220, 0.06)',
  overlayStrong: 'rgba(242, 233, 220, 0.10)',
  divider: 'rgba(242, 233, 220, 0.08)',
  scrim: 'rgba(0, 0, 0, 0.60)',
  imageOverlay: 'linear-gradient(180deg, rgba(30, 27, 22, 0.72) 0%, rgba(30, 27, 22, 0.92) 100%)',
  shadowRgb: '0, 0, 0',
  stroke: 'rgba(242, 233, 220, 0.12)',
  whiteAlpha80: 'rgba(242, 233, 220, 0.80)',
  whiteAlpha85: 'rgba(242, 233, 220, 0.85)',
  whiteAlpha90: 'rgba(242, 233, 220, 0.90)',
  font: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
  fontMono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
  radiusSmall: '9px',
  radiusMedium: '18px',
  radiusLarge: '24px',
  t1AccentSoft: 'rgba(201, 106, 67, 0.16)',
  t1Hairline: 'rgba(242, 233, 220, 0.16)',
} as const satisfies Theme01Tokens;

/**
 * 组件默认使用的主色调序列（大地色），与 ECharts 等图表库配色保持一致。
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

/**
 * 更深的 ink 变体（[data-theme="dark"]）—— espresso 暗色编辑风的“双基底”之一。
 * 与默认 :root（char 暖炭）形成翻页节奏；两者均为暗色，差异在基底深浅与表面强度。
 */
export const theme01DarkTokens = {
  ...theme01Tokens,
  bg: '#16130F',
  bgGradientStart: '#1A1611',
  bgGradientEnd: '#100D0A',
  surface: 'rgba(34, 30, 24, 0.66)',
  surfaceStrong: 'rgba(44, 39, 31, 0.84)',
  border: 'rgba(242, 233, 220, 0.12)',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.52)',
  shadowSm: '0 8px 24px rgba(0, 0, 0, 0.44)',
  t1Hairline: 'rgba(242, 233, 220, 0.13)',
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
 * 变量名与 theme01.css 中已有的变量保持一致。
 * 支持 light / dark 两种配色方案（theme01 暗色编辑风：light=暖炭 char，dark=深墨 ink）。
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
