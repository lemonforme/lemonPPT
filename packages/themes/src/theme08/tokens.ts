// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * ⚠️ 镜像副本（MIRROR）⚠️
 * 渲染真源是 `packages/templates/src/themes/theme08/tokens.ts`（renderer 实际调用它）。
 * 本文件仅供 `getTheme()` 元数据与 `@lemonppt/themes` 已发布 API 使用；
 * 改配色请先改真源，再同步回来：
 *   cp packages/templates/src/themes/theme08/tokens.ts packages/themes/src/theme08/tokens.ts
 *
 * theme08 设计 Token。
 * 风格：黑金实验风 / Black Gold Experimental。
 * 深黑底 + 荧光金主强调 + 玫红/冷蓝/淡紫灰点缀，适合高端发布、品牌提案、实验性概念。
 * 数字使用展示型字体（Anton，项目字体库已内嵌 @font-face）增强冲击力；双背景 primary(深黑)/muted(象牙暖白)。
 * 所有色值/类名均为原创，不复制 Dashi theme08 具体实现与 --acl- 前缀。
 */

export interface Theme08Tokens {
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
    background: string;
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    surface: string;
    surfaceStrong: string;
    surfaceSolid: string;
    surfaceElevated: string;
    border: string;
    borderStrong: string;
    shadow: string;
    shadowSmall: string;
    nodeBg: string;
    nodeBorder: string;
    edge: string;
    focusGlow: string;
    panelLine: string;
    accentBright: string;
    inversePanel: string;
    inversePanelInk: string;
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
    riseDistance: string;
    riseDuration: string;
  };
}

export type Theme08Appearance = 'primary' | 'muted';

/**
 * 黑金实验风色板（原创设计，非复制 Dashi）。
 * primary：深黑底 + 荧光金高饱和点缀，强发布会海报感。
 * muted：象牙暖白底 + 古铜金强调，保持黑金调性的可读浅色外观。
 */
const obsidianGoldPalette = {
  accent: '#FFD23F',
  accent2: '#FF2D9B',
  accentCool: '#2BD2FF',
};

/** 浅色模式专用装饰亮金（用于辉光/渐变/条形等非文字元素） */
const LIGHT_ACCENT_BRIGHT = '#E8B633';
/** 浅色模式主强调古铜金（WCAG AA 正文达标） */
const LIGHT_ACCENT_READABLE = '#8F6608';

function buildTokenCatalog(appearance: Theme08Appearance = 'primary'): Theme08Tokens {
  const isPrimary = appearance === 'primary';
  return {
    id: 'theme08',
    displayName: 'Theme 08',
    description: '黑金实验风，深黑底荧光金与高饱和点缀，适合高端发布、品牌提案与实验性概念表达',
    colors: {
      ink: isPrimary ? '#F7F4EA' : '#1A1812',
      ink2: isPrimary ? 'rgba(247, 244, 234, 0.74)' : 'rgba(26, 24, 18, 0.85)',
      ink3: isPrimary ? 'rgba(247, 244, 234, 0.58)' : 'rgba(26, 24, 18, 0.68)',
      textInverse: isPrimary ? '#14130D' : '#FBFAF4',
      accent: isPrimary ? obsidianGoldPalette.accent : LIGHT_ACCENT_READABLE,
      accent2: isPrimary ? obsidianGoldPalette.accent2 : '#C41B7A',
      accentCool: isPrimary ? obsidianGoldPalette.accentCool : '#0E8FA8',
      red: isPrimary ? '#FF4D4D' : '#C0392B',
      orange: isPrimary ? '#FF9F1C' : '#C25E00',
      amber: isPrimary ? '#FFC400' : '#B45309',
      yellow: isPrimary ? '#FFE34D' : '#9A7B00',
      teal: isPrimary ? '#2BE0C0' : '#0B7A85',
      green: isPrimary ? '#3DDC84' : '#15803D',
      cyan: isPrimary ? '#2BD2FF' : '#0E8FA8',
      blue: isPrimary ? '#4D9FFF' : '#0E6FB8',
      indigo: isPrimary ? '#7C6BFF' : '#4338CA',
      violet: isPrimary ? '#B98CFF' : '#7C3AED',
      purple: isPrimary ? '#C44DFF' : '#9333EA',
      series: isPrimary
        ? [obsidianGoldPalette.accent, obsidianGoldPalette.accent2, obsidianGoldPalette.accentCool, '#B98CFF', '#3DDC84', '#FF9F1C']
        : [LIGHT_ACCENT_READABLE, '#C41B7A', '#0E8FA8', '#7C3AED', '#15803D', '#C25E00'],
      background: isPrimary ? '#14130D' : '#FDFBF4',
      backgroundGradientStart: isPrimary ? '#1C1A12' : '#FAF7EE',
      backgroundGradientEnd: isPrimary ? '#0C0B07' : '#F5F0E4',
      surface: isPrimary ? 'rgba(255, 210, 63, 0.06)' : 'rgba(143, 102, 8, 0.05)',
      surfaceStrong: isPrimary ? 'rgba(255, 210, 63, 0.10)' : 'rgba(143, 102, 8, 0.08)',
      surfaceSolid: isPrimary ? '#211F17' : '#FFFFFF',
      surfaceElevated: isPrimary ? '#2C281E' : '#FFFFFF',
      border: isPrimary ? 'rgba(255, 210, 63, 0.20)' : 'rgba(26, 24, 18, 0.10)',
      borderStrong: isPrimary ? 'rgba(255, 210, 63, 0.40)' : 'rgba(26, 24, 18, 0.16)',
      shadow: isPrimary ? '0 24px 60px rgba(0, 0, 0, 0.55)' : '0 24px 60px rgba(20, 19, 13, 0.12)',
      shadowSmall: isPrimary ? '0 8px 24px rgba(0, 0, 0, 0.45)' : '0 8px 24px rgba(20, 19, 13, 0.06)',
      nodeBg: isPrimary ? '#211F17' : '#FFFFFF',
      nodeBorder: isPrimary ? 'rgba(255, 210, 63, 0.30)' : 'rgba(26, 24, 18, 0.14)',
      edge: isPrimary ? 'rgba(255, 210, 63, 0.28)' : 'rgba(26, 24, 18, 0.18)',
      focusGlow: isPrimary ? 'rgba(255, 210, 63, 0.45)' : 'rgba(143, 102, 8, 0.22)',
      panelLine: isPrimary ? 'rgba(255, 210, 63, 0.14)' : 'rgba(26, 24, 18, 0.08)',
      accentBright: isPrimary ? obsidianGoldPalette.accent : LIGHT_ACCENT_BRIGHT,
      inversePanel: isPrimary ? '#14130D' : '#FFFFFF',
      inversePanelInk: isPrimary ? '#F7F4EA' : '#1A1812',
    },
    fonts: {
      heading: '"Noto Sans SC", system-ui, sans-serif',
      body: '"Noto Sans SC", system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      en: '"Anton", "Noto Sans SC", sans-serif',
    },
    spacing: {
      pagePadding: '56px',
      sectionGap: '32px',
      elementGap: '14px',
      padTop: '76px',
      padBottom: '64px',
      cardPaddingLarge: '32px 36px',
      cardPaddingMedium: '22px 24px',
    },
    borderRadius: {
      small: '6px',
      medium: '10px',
      large: '14px',
    },
    fontSize: {
      display: '88px',
      displaySmall: '64px',
      h1: '48px',
      h2: '34px',
      h3: '24px',
      body: '18px',
      bodySmall: '15px',
      caption: '13px',
    },
    effect: {
      riseDistance: '14px',
      riseDuration: '0.5s',
    },
  };
}

export const theme08Tokens = buildTokenCatalog('primary');

export function getTheme08Tokens(appearance: Theme08Appearance = 'primary'): Theme08Tokens {
  return buildTokenCatalog(appearance);
}

interface CssTokenSet {
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
  accentBright: string;
  inversePanel: string;
  inversePanelInk: string;
  font: string;
  fontMono: string;
  fontHeading: string;
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
}

function makeCssTokens(appearance: Theme08Appearance = 'primary'): CssTokenSet {
  const tokens = buildTokenCatalog(appearance);
  const isPrimary = appearance === 'primary';
  return {
    ink: tokens.colors.ink,
    ink2: tokens.colors.ink2,
    ink3: tokens.colors.ink3,
    textInverse: tokens.colors.textInverse,
    accent: tokens.colors.accent,
    accent2: tokens.colors.accent2,
    accentCool: tokens.colors.accentCool,
    red: tokens.colors.red,
    orange: tokens.colors.orange,
    amber: tokens.colors.amber,
    yellow: tokens.colors.yellow,
    teal: tokens.colors.teal,
    green: tokens.colors.green,
    cyan: tokens.colors.cyan,
    blue: tokens.colors.blue,
    indigo: tokens.colors.indigo,
    violet: tokens.colors.violet,
    purple: tokens.colors.purple,
    series: tokens.colors.series,
    bg: tokens.colors.background,
    bgGradientStart: tokens.colors.backgroundGradientStart,
    bgGradientEnd: tokens.colors.backgroundGradientEnd,
    surface: tokens.colors.surface,
    surfaceStrong: tokens.colors.surfaceStrong,
    surfaceSolid: tokens.colors.surfaceSolid,
    surfaceElevated: tokens.colors.surfaceElevated,
    border: tokens.colors.border,
    borderStrong: tokens.colors.borderStrong,
    shadow: tokens.colors.shadow,
    shadowSm: tokens.colors.shadowSmall,
    shadowInset: isPrimary ? '0 1px 0 rgba(255, 255, 255, 0.08) inset' : '0 1px 0 rgba(0, 0, 0, 0.04) inset',
    overlay: isPrimary ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
    overlayStrong: isPrimary ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    divider: isPrimary ? 'rgba(255, 210, 63, 0.16)' : 'rgba(26, 24, 18, 0.08)',
    scrim: isPrimary ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)',
    imageOverlay: isPrimary
      ? 'linear-gradient(180deg, rgba(20, 19, 13, 0.72) 0%, rgba(20, 19, 13, 0.92) 100%)'
      : 'linear-gradient(180deg, rgba(237, 234, 244, 0.72) 0%, rgba(237, 234, 244, 0.92) 100%)',
    shadowRgb: isPrimary ? '0, 0, 0' : '26, 24, 18',
    stroke: isPrimary ? 'rgba(255, 210, 63, 0.20)' : 'rgba(26, 24, 18, 0.10)',
    whiteAlpha80: 'rgba(255, 255, 255, 0.8)',
    whiteAlpha85: 'rgba(255, 255, 255, 0.85)',
    whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
    nodeBg: tokens.colors.nodeBg,
    nodeBorder: tokens.colors.nodeBorder,
    edge: tokens.colors.edge,
    focusGlow: tokens.colors.focusGlow,
    panelLine: tokens.colors.panelLine,
    accentBright: tokens.colors.accentBright,
    inversePanel: tokens.colors.inversePanel,
    inversePanelInk: tokens.colors.inversePanelInk,
    font: tokens.fonts.body,
    fontMono: tokens.fonts.mono,
    fontHeading: tokens.fonts.heading,
    radiusSmall: tokens.borderRadius.small,
    radiusMedium: tokens.borderRadius.medium,
    radiusLarge: tokens.borderRadius.large,
  };
}

function buildCssVarsFromTokens(tokens: CssTokenSet): string {
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
  --lp-accent-bright: ${tokens.accentBright};
  --lp-inverse-panel: ${tokens.inversePanel};
  --lp-inverse-panel-ink: ${tokens.inversePanelInk};
  --lp-font: ${tokens.font};
  --lp-font-mono: ${tokens.fontMono};
  --lp-font-heading: ${tokens.fontHeading};
  --lp-radius-small: ${tokens.radiusSmall};
  --lp-radius-medium: ${tokens.radiusMedium};
  --lp-radius-large: ${tokens.radiusLarge};
  --lp-radius-lg: ${tokens.radiusLarge};
  --lp-font-size-display: ${theme08Tokens.fontSize.display};
  --lp-font-size-display-small: ${theme08Tokens.fontSize.displaySmall};
  --lp-font-size-h1: ${theme08Tokens.fontSize.h1};
  --lp-font-size-h2: ${theme08Tokens.fontSize.h2};
  --lp-font-size-h3: ${theme08Tokens.fontSize.h3};
  --lp-font-size-body: ${theme08Tokens.fontSize.body};
  --lp-font-size-body-small: ${theme08Tokens.fontSize.bodySmall};
  --lp-font-size-caption: ${theme08Tokens.fontSize.caption};
  /* theme08 常用布局别名 */
  --lp-card-border: var(--lp-border);
  --lp-card-radius: var(--lp-radius-large);
  --lp-card-surface: var(--lp-surface-solid);
  --lp-card-accent: color-mix(in srgb, var(--lp-accent) 14%, transparent);
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
  --lp-font-display: "Anton", "Noto Sans SC", sans-serif;
  `;
}

export function generateTheme08CssVariables(appearance: Theme08Appearance = 'primary'): string {
  const tokens = makeCssTokens(appearance);
  return `:root {\n${buildCssVarsFromTokens(tokens)}\n}`;
}

export function generateTheme08CssVariablesWithAppearance(): string {
  return generateTheme08CssVariables('primary');
}

/**
 * 生成包含 primary + muted 双外观的完整 CSS 变量块，通过 data-appearance 切换。
 * 同时提供 light/dark 别名（编辑器浅色/深色按钮使用）。
 */
export function generateTheme08CssVariablesWithSchemesAndAppearance(): string {
  const appearances: Theme08Appearance[] = ['primary', 'muted'];
  const blocks: string[] = [];

  for (const appearance of appearances) {
    if (appearance === 'primary') {
      blocks.push(`:root[data-theme="obsidian-gold"] {\n${buildCssVarsFromTokens(makeCssTokens('primary'))}\n}`);
      blocks.push(`:root[data-appearance="primary"][data-theme="obsidian-gold"] {\n${buildCssVarsFromTokens(makeCssTokens('primary'))}\n}`);
    } else {
      blocks.push(`:root[data-appearance="muted"][data-theme="obsidian-gold"] {\n${buildCssVarsFromTokens(makeCssTokens('muted'))}\n}`);
    }
  }

  /* light/dark 别名（与编辑器按钮 data-appearance 值对齐） */
  blocks.push(`:root[data-appearance="light"][data-theme="obsidian-gold"] {\n${buildCssVarsFromTokens(makeCssTokens('muted'))}\n}`);
  blocks.push(`:root[data-appearance="dark"][data-theme="obsidian-gold"] {\n${buildCssVarsFromTokens(makeCssTokens('primary'))}\n}`);

  return blocks.join('\n');
}
