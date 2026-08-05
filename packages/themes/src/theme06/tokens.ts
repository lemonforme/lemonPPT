// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme06 设计 Token。
 * 风格：深色图谱风 / Dark Atlas。
 * 深色底 + 霓虹强调色 + 节点连线 + 高密度数据卡片，适合战略分析、产业研究、投融资报告。
 * 支持 4 套强调色方案（volt / magma / nebula / nova）与 light / dark 双外观。
 */
export interface Theme06Tokens {
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

function buildTokenCatalog(appearance: Theme06Appearance, colorScheme: Theme06ColorScheme): Theme06Tokens {
  const palette = schemePalettes[colorScheme][appearance];
  const isLight = appearance === 'light';
  return {
    id: 'theme06',
    displayName: 'Theme 06',
    description: '深色图谱风，霓虹强调色与节点连线，适合战略分析、产业研究与投融资报告',
    colors: {
      ink: isLight ? '#0F172A' : '#F2F4F7',
      ink2: isLight ? 'rgba(15, 23, 42, 0.68)' : 'rgba(242, 244, 247, 0.72)',
      ink3: isLight ? 'rgba(15, 23, 42, 0.44)' : 'rgba(242, 244, 247, 0.48)',
      textInverse: isLight ? '#F7F8FA' : '#05070A',
      accent: palette.accent,
      accent2: palette.accent2,
      accentCool: palette.accentCool,
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
      series: [palette.accent, palette.accent2, palette.accentCool, '#FF6B45', '#00E5B0', '#A855F7'],
      background: isLight ? '#F7F8FA' : '#0B0F17',
      backgroundGradientStart: isLight ? '#F7F8FA' : '#0B0F17',
      backgroundGradientEnd: isLight ? '#ECEFF3' : '#121926',
      surface: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
      surfaceStrong: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.10)',
      surfaceSolid: isLight ? '#FFFFFF' : '#151C27',
      surfaceElevated: isLight ? '#FFFFFF' : '#1A2330',
      border: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.10)',
      borderStrong: isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.18)',
      shadow: isLight ? '0 24px 60px rgba(0, 0, 0, 0.08)' : '0 24px 60px rgba(0, 0, 0, 0.50)',
      shadowSmall: isLight ? '0 8px 24px rgba(0, 0, 0, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.40)',
      nodeBg: isLight ? '#FFFFFF' : '#151C27',
      nodeBorder: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.18)',
      edge: isLight ? 'rgba(15, 23, 42, 0.20)' : 'rgba(255, 255, 255, 0.16)',
      focusGlow: isLight ? 'rgba(39, 130, 246, 0.35)' : 'rgba(182, 255, 43, 0.40)',
      panelLine: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
    },
    fonts: {
      heading: '"Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      body: '"Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      mono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
      en: '"Inter", "Space Mono", ui-monospace, monospace',
    },
    spacing: {
      pagePadding: '56px',
      sectionGap: '32px',
      elementGap: '14px',
      padTop: '72px',
      padBottom: '64px',
      cardPaddingLarge: '32px 36px',
      cardPaddingMedium: '22px 24px',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    fontSize: {
      display: '84px',
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

export const theme06Tokens = buildTokenCatalog('dark', 'volt');

export function getTheme06Tokens(appearance: Theme06Appearance = 'dark', colorScheme: Theme06ColorScheme = 'volt'): Theme06Tokens {
  return buildTokenCatalog(appearance, colorScheme);
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
  font: string;
  fontMono: string;
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
}

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

function makeCssTokens(appearance: Theme06Appearance = 'dark', colorScheme: Theme06ColorScheme = 'volt'): CssTokenSet {
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
  --lp-font: ${tokens.font};
  --lp-font-mono: ${tokens.fontMono};
  --lp-radius-small: ${tokens.radiusSmall};
  --lp-radius-medium: ${tokens.radiusMedium};
  --lp-radius-large: ${tokens.radiusLarge};
  --lp-radius-lg: ${tokens.radiusLarge};
  --lp-font-size-display: ${theme06Tokens.fontSize.display};
  --lp-font-size-display-small: ${theme06Tokens.fontSize.displaySmall};
  --lp-font-size-h1: ${theme06Tokens.fontSize.h1};
  --lp-font-size-h2: ${theme06Tokens.fontSize.h2};
  --lp-font-size-h3: ${theme06Tokens.fontSize.h3};
  --lp-font-size-body: ${theme06Tokens.fontSize.body};
  --lp-font-size-body-small: ${theme06Tokens.fontSize.bodySmall};
  --lp-font-size-caption: ${theme06Tokens.fontSize.caption};
  /* 常用布局别名，保持版式 CSS 与主题变量的解耦 */
  --lp-volt: var(--lp-accent);
  --lp-volt-dim: var(--lp-accent-2);
  --lp-volt-glow: var(--lp-focus-glow);
  --lp-card-border: var(--lp-border);
  --lp-card-radius: var(--lp-radius-large);
  --lp-card-surface: var(--lp-surface-solid);
  --lp-card-accent: color-mix(in srgb, var(--lp-accent) 10%, transparent);
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
