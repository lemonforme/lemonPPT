// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * ⚠️ 渲染真源（SOURCE OF TRUTH）⚠️
 * renderer 经 @lemonppt/templates 实际调用本文件。
 * 镜像副本 `packages/themes/src/theme09/tokens.ts` 仅供 getTheme() 元数据使用。
 * 改配色请先改本文件，再同步：
 *   cp packages/templates/src/themes/theme09/tokens.ts packages/themes/src/theme09/tokens.ts
 *
 * theme09 设计 Token。
 * 风格：墨韵专色风 / Ink Rhythm · Spot-Color Editorial。
 *
 * ── 核心创新：双基底（substrate）──
 * 不同于其他主题的「单一底色 + 明暗翻转」，theme09 为每个版式**预分配基底**：
 *   paper 纸底 #F4F1EA —— 数据、表格、正文密集页（64 个版式）
 *   ink   墨底 #14161C —— 影像、章节、金句、跨页（47 个版式）
 * 翻页时形成杂志跨页的呼吸节奏。两套基底各有完整令牌组，专色在墨底上提亮
 * 饱和度以维持视觉重量一致（朱砂 #C8102E → #F04A62）。
 *
 * appearance（primary / muted）不翻转明暗，只调整**专色浓度与网点密度**。
 *
 * 所有色值、类名、装饰语汇均为原创，不复制 Dashi theme09 的实现、
 * 色值（#46e3c6 / #4a86ff 等）、类名（bg-deep / bg-blue 等）与 --acl- 前缀。
 */

export type Theme09Appearance = 'primary' | 'muted';
export type Theme09Substrate = 'paper' | 'ink';

export interface Theme09Tokens {
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
    /** 栏线（杂志细分栏线） */
    rule: string;
    /** 强栏线（题头下方的粗规线） */
    ruleStrong: string;
    /** 网点半调基色 */
    halftone: string;
    /** 纸纤维 / 墨面噪点 */
    grain: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
    en: string;
    hand: string;
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

/* ────────────────────────────────────────────────────────────────
 * 专色系统（原创印刷专色，全部经 WCAG 2.1 AA 预校验）
 *
 * 纸底 #F4F1EA 上（相对亮度 0.881）：
 *   朱砂 #C8102E → 5.22:1 ✅   靛青 #2B4A8B → 7.58:1 ✅
 *   芥黄 #7A5410 → 5.1:1 ✅    石绿 #355C4E → 4.8:1 ✅
 * 墨底 #14161C 上（相对亮度 0.008）：
 *   朱砂 #F47A93 → 7.2:1 ✅    靛青 #7E9BC8 → 6.3:1 ✅
 *   芥黄 #D9A83C → 8.2:1 ✅    石绿 #6FA894 → 6.56:1 ✅
 * 注：组件常把专色落于「比基底更深的芯片」（#3D2530/#30222C/#24262E/#31333A），
 * 故墨底 vermilion/indigo 已提亮、ink3 已提亮至 #BCB9B1 以保 ≥4.5:1。
 * ──────────────────────────────────────────────────────────────── */

/** 纸底专色 —— 浓墨重彩档（primary）
 * 注：sienna/mustard/celadon 已压深一档，确保落在浅纸芯片（#F0E6DC/#EEE7DA/#D7DDD5）上 ≥4.5:1 */
const PAPER_SPOT = {
  vermilion: '#C8102E', // 专色主：朱砂
  indigo: '#2B4A8B', // 专色次：靛青
  mustard: '#7A5410', // 点缀：芥黄（压深，浅底 ≥5.1:1）
  celadon: '#355C4E', // 点缀：石绿（压深，浅底 ≥4.8:1）
  plum: '#6D4C7D', // 序列五：紫棠
  sienna: '#97491C', // 序列六：赭石（压深，浅底 ≥5.0:1）
} as const;

/** 纸底专色 —— 淡墨档（muted，降饱和不降明度差） */
const PAPER_SPOT_MUTED = {
  vermilion: '#9C2233',
  indigo: '#3C5580',
  mustard: '#6A4810',
  celadon: '#2F5044',
  plum: '#61496D',
  sienna: '#83431C',
} as const;

/** 墨底专色 —— 提亮档（primary）
 * 注：vermilion/indigo 已提亮，确保落在最深芯片（#3D2530/#1B1E26）上 ≥4.5:1 */
const INK_SPOT = {
  vermilion: '#F47A93', // 朱砂提亮（#F04A62 → #F47A93，深芯片 ≥5.4:1）
  indigo: '#7E9BC8', // 靛青提亮（#5B82D6 → #7E9BC8，≥6.3:1）
  mustard: '#D9A83C',
  celadon: '#6FA894',
  plum: '#A98BC4',
  sienna: '#E08A5B',
} as const;

/** 墨底专色 —— 柔和档（muted） */
const INK_SPOT_MUTED = {
  vermilion: '#E08A9C',
  indigo: '#7E9BC8',
  mustard: '#C0A068',
  celadon: '#8AAFA0',
  plum: '#B0A0C4',
  sienna: '#CE9878',
} as const;

/** 纸底墨色阶 */
const PAPER_BASE = {
  bg: '#F4F1EA',
  bgStart: '#F8F6F0',
  bgEnd: '#EDE9DE',
  ink: '#14161C',
  ink2: '#3A3F4A',
  ink3: '#5C6270',
  inverse: '#F8F6F0',
  rgb: '20, 22, 28',
} as const;

/** 墨底墨色阶 */
const INK_BASE = {
  bg: '#14161C',
  bgStart: '#1B1E26',
  bgEnd: '#0D0F14',
  ink: '#F4F1EA',
  ink2: '#C9C6BE',
  ink3: '#BCB9B1', // 提亮（#8E8B84 → #BCB9B1，深芯片 ≥4.9:1）
  inverse: '#14161C',
  rgb: '244, 241, 234',
} as const;

function spotOf(substrate: Theme09Substrate, appearance: Theme09Appearance) {
  if (substrate === 'ink') return appearance === 'primary' ? INK_SPOT : INK_SPOT_MUTED;
  return appearance === 'primary' ? PAPER_SPOT : PAPER_SPOT_MUTED;
}

function buildTokenCatalog(
  substrate: Theme09Substrate = 'paper',
  appearance: Theme09Appearance = 'primary',
): Theme09Tokens {
  const isInk = substrate === 'ink';
  const base = isInk ? INK_BASE : PAPER_BASE;
  const spot = spotOf(substrate, appearance);
  /** 网点密度：muted 档降一级，让页面更安静 */
  const halftoneAlpha = appearance === 'primary' ? (isInk ? 0.16 : 0.13) : isInk ? 0.1 : 0.08;

  return {
    id: 'theme09',
    displayName: 'Theme 09',
    description:
      '墨韵专色风，米白纸底与深墨跨页双基底交替，专色朱砂与明朝体大字，适合品牌故事、人物访谈、企业形象册与年度特刊',
    colors: {
      ink: base.ink,
      ink2: base.ink2,
      ink3: base.ink3,
      textInverse: base.inverse,
      accent: spot.vermilion,
      accent2: spot.indigo,
      accentCool: spot.celadon,
      red: spot.vermilion,
      orange: spot.sienna,
      amber: spot.mustard,
      yellow: spot.mustard,
      teal: spot.celadon,
      green: spot.celadon,
      cyan: spot.indigo,
      blue: spot.indigo,
      indigo: spot.indigo,
      violet: spot.plum,
      purple: spot.plum,
      series: [spot.vermilion, spot.indigo, spot.mustard, spot.celadon, spot.plum, spot.sienna],
      background: base.bg,
      backgroundGradientStart: base.bgStart,
      backgroundGradientEnd: base.bgEnd,
      surface: `color-mix(in srgb, ${base.ink} ${isInk ? '10' : '4'}%, transparent)`,
      surfaceStrong: `color-mix(in srgb, ${base.ink} ${isInk ? '16' : '7'}%, transparent)`,
      surfaceSolid: isInk ? '#1C2027' : '#FDFCF8',
      surfaceElevated: isInk ? '#242932' : '#FFFFFF',
      border: `color-mix(in srgb, ${base.ink} ${isInk ? '22' : '14'}%, transparent)`,
      borderStrong: `color-mix(in srgb, ${base.ink} ${isInk ? '40' : '30'}%, transparent)`,
      shadow: isInk ? '0 22px 54px rgba(0, 0, 0, 0.55)' : '0 18px 44px rgba(20, 22, 28, 0.10)',
      shadowSmall: isInk ? '0 6px 20px rgba(0, 0, 0, 0.42)' : '0 5px 16px rgba(20, 22, 28, 0.07)',
      nodeBg: isInk ? '#1C2027' : '#FDFCF8',
      nodeBorder: `color-mix(in srgb, ${base.ink} ${isInk ? '30' : '20'}%, transparent)`,
      edge: `color-mix(in srgb, ${base.ink} ${isInk ? '34' : '26'}%, transparent)`,
      focusGlow: `color-mix(in srgb, ${spot.vermilion} 38%, transparent)`,
      panelLine: `color-mix(in srgb, ${base.ink} ${isInk ? '14' : '9'}%, transparent)`,
      accentBright: spot.vermilion,
      inversePanel: isInk ? '#F4F1EA' : '#14161C',
      inversePanelInk: isInk ? '#14161C' : '#F4F1EA',
      rule: `color-mix(in srgb, ${base.ink} ${isInk ? '26' : '18'}%, transparent)`,
      ruleStrong: `color-mix(in srgb, ${base.ink} ${isInk ? '55' : '48'}%, transparent)`,
      halftone: `color-mix(in srgb, ${base.ink} ${Math.round(halftoneAlpha * 100)}%, transparent)`,
      grain: `color-mix(in srgb, ${base.ink} ${isInk ? '5' : '3'}%, transparent)`,
    },
    fonts: {
      // 明朝体标题 —— 与 theme07/08 无衬线的最大字形分野
      heading: '"Noto Serif SC", "Songti SC", serif',
      body: '"Noto Sans SC", system-ui, sans-serif',
      mono: '"Space Mono", ui-monospace, monospace',
      en: '"Newsreader", Georgia, "Noto Serif SC", serif',
      hand: '"Caveat", "Noto Sans SC", cursive',
    },
    spacing: {
      pagePadding: '60px',
      sectionGap: '30px',
      elementGap: '14px',
      padTop: '72px',
      padBottom: '68px',
      cardPaddingLarge: '30px 34px',
      cardPaddingMedium: '20px 24px',
    },
    borderRadius: {
      // 印刷品几乎不用圆角 —— 直角是本主题的形态签名
      small: '0px',
      medium: '0px',
      large: '2px',
    },
    fontSize: {
      display: '104px',
      displaySmall: '72px',
      h1: '46px',
      h2: '32px',
      h3: '22px',
      body: '17px',
      bodySmall: '14px',
      caption: '12px',
    },
    effect: {
      riseDistance: '12px',
      riseDuration: '0.46s',
    },
  };
}

export const theme09Tokens = buildTokenCatalog('paper', 'primary');

export function getTheme09Tokens(
  substrate: Theme09Substrate = 'paper',
  appearance: Theme09Appearance = 'primary',
): Theme09Tokens {
  return buildTokenCatalog(substrate, appearance);
}

/* ────────────────────────────────────────────────────────────────
 * CSS 变量生成
 * ──────────────────────────────────────────────────────────────── */

function buildCssVars(substrate: Theme09Substrate, appearance: Theme09Appearance): string {
  const t = buildTokenCatalog(substrate, appearance);
  const c = t.colors;
  const isInk = substrate === 'ink';
  const base = isInk ? INK_BASE : PAPER_BASE;

  return `
  --lp-ink: ${c.ink};
  --lp-ink2: ${c.ink2};
  --lp-ink3: ${c.ink3};
  --lp-text-inverse: ${c.textInverse};
  --lp-accent: ${c.accent};
  --lp-accent-2: ${c.accent2};
  --lp-accent-cool: ${c.accentCool};
  --lp-red: ${c.red};
  --lp-orange: ${c.orange};
  --lp-amber: ${c.amber};
  --lp-yellow: ${c.yellow};
  --lp-teal: ${c.teal};
  --lp-green: ${c.green};
  --lp-cyan: ${c.cyan};
  --lp-blue: ${c.blue};
  --lp-indigo: ${c.indigo};
  --lp-violet: ${c.violet};
  --lp-purple: ${c.purple};
  --lp-series-1: ${c.series[0]};
  --lp-series-2: ${c.series[1]};
  --lp-series-3: ${c.series[2]};
  --lp-series-4: ${c.series[3]};
  --lp-series-5: ${c.series[4]};
  --lp-series-6: ${c.series[5]};
  --lp-bg: ${c.background};
  --lp-bg-gradient-start: ${c.backgroundGradientStart};
  --lp-bg-gradient-end: ${c.backgroundGradientEnd};
  --lp-surface: ${c.surface};
  --lp-surface-strong: ${c.surfaceStrong};
  --lp-surface-solid: ${c.surfaceSolid};
  --lp-surface-elevated: ${c.surfaceElevated};
  --lp-border: ${c.border};
  --lp-border-strong: ${c.borderStrong};
  --lp-shadow: ${c.shadow};
  --lp-shadow-sm: ${c.shadowSmall};
  --lp-shadow-inset: ${isInk ? '0 1px 0 rgba(255, 255, 255, 0.06) inset' : '0 1px 0 rgba(20, 22, 28, 0.04) inset'};
  --lp-overlay: color-mix(in srgb, ${base.ink} ${isInk ? '8' : '3'}%, transparent);
  --lp-overlay-strong: color-mix(in srgb, ${base.ink} ${isInk ? '14' : '6'}%, transparent);
  --lp-divider: ${c.rule};
  --lp-scrim: ${isInk ? 'rgba(13, 15, 20, 0.62)' : 'rgba(20, 22, 28, 0.52)'};
  --lp-image-overlay: ${
    isInk
      ? 'linear-gradient(180deg, rgba(13, 15, 20, 0.18) 0%, rgba(13, 15, 20, 0.86) 100%)'
      : 'linear-gradient(180deg, rgba(20, 22, 28, 0.10) 0%, rgba(20, 22, 28, 0.74) 100%)'
  };
  --lp-shadow-rgb: ${isInk ? '0, 0, 0' : '20, 22, 28'};
  --lp-stroke: ${c.border};
  --lp-white-alpha-80: rgba(255, 255, 255, 0.8);
  --lp-white-alpha-85: rgba(255, 255, 255, 0.85);
  --lp-white-alpha-90: rgba(255, 255, 255, 0.9);
  --lp-node-bg: ${c.nodeBg};
  --lp-node-border: ${c.nodeBorder};
  --lp-edge: ${c.edge};
  --lp-focus-glow: ${c.focusGlow};
  --lp-panel-line: ${c.panelLine};
  --lp-accent-bright: ${c.accentBright};
  --lp-inverse-panel: ${c.inversePanel};
  --lp-inverse-panel-ink: ${c.inversePanelInk};
  --lp-font: ${t.fonts.body};
  --lp-font-mono: ${t.fonts.mono};
  --lp-font-heading: ${t.fonts.heading};
  --lp-radius-small: ${t.borderRadius.small};
  --lp-radius-medium: ${t.borderRadius.medium};
  --lp-radius-large: ${t.borderRadius.large};
  --lp-radius-lg: ${t.borderRadius.large};
  --lp-font-size-display: ${t.fontSize.display};
  --lp-font-size-display-small: ${t.fontSize.displaySmall};
  --lp-font-size-h1: ${t.fontSize.h1};
  --lp-font-size-h2: ${t.fontSize.h2};
  --lp-font-size-h3: ${t.fontSize.h3};
  --lp-font-size-body: ${t.fontSize.body};
  --lp-font-size-body-small: ${t.fontSize.bodySmall};
  --lp-font-size-caption: ${t.fontSize.caption};
  /* 通用布局别名 */
  --lp-card-border: var(--lp-border);
  --lp-card-radius: var(--lp-radius-large);
  --lp-card-surface: var(--lp-surface-solid);
  --lp-card-accent: color-mix(in srgb, var(--lp-accent) 10%, transparent);
  --lp-card-accent-border: var(--lp-accent);
  --lp-on-accent: ${isInk ? '#14161C' : '#FFFFFF'};
  --lp-on-accent-soft: color-mix(in srgb, ${isInk ? '#14161C' : '#FFFFFF'} 88%, transparent);
  --lp-error: var(--lp-red);
  --lp-warning: var(--lp-amber);
  --lp-success: var(--lp-green);
  --lp-font-size-hero: var(--lp-font-size-display-small);
  --lp-font-size-hero-small: var(--lp-font-size-h1);
  --lp-font-size-subtitle: var(--lp-font-size-h3);
  --lp-font-size-small: var(--lp-font-size-body-small);
  --lp-font-display: ${t.fonts.heading};
  /* ── theme09 专有：印刷语汇 ── */
  --lp-t9-substrate: ${substrate};
  --lp-t9-en: ${t.fonts.en};
  --lp-t9-hand: ${t.fonts.hand};
  --lp-t9-rule: ${c.rule};
  --lp-t9-rule-strong: ${c.ruleStrong};
  --lp-t9-halftone: ${c.halftone};
  --lp-t9-grain: ${c.grain};
  --lp-t9-spot: ${c.accent};
  --lp-t9-spot-2: ${c.accent2};
  --lp-t9-spot-3: ${c.amber};
  --lp-t9-spot-4: ${c.teal};
  --lp-t9-dot-size: ${appearance === 'primary' ? '7px' : '9px'};
  --lp-t9-gutter: 2px;
  --lp-t9-crop: ${c.ruleStrong};
  --lp-t9-tape: color-mix(in srgb, ${c.amber} ${isInk ? '34' : '26'}%, transparent);
  `;
}

const SUBSTRATE_SELECTOR: Record<Theme09Substrate, string> = {
  paper: '.lp-theme09',
  ink: '.lp-theme09-sub-ink',
};

/**
 * 生成 theme09 完整 CSS 变量块。
 *
 * 层叠顺序（必须保持 paper 在前、ink 在后，否则墨底会被纸底覆盖）：
 *   1. :root 兜底（未设 data-theme 的场景，如画廊/快照）
 *   2. [data-theme] 兜底（未设 data-appearance）
 *   3. [data-appearance="primary"]
 *   4. [data-appearance="muted"]
 * 每组内：paper（.lp-theme09）→ ink（.lp-theme09-sub-ink）
 */
export function generateTheme09CssVariablesWithSchemesAndAppearance(): string {
  const T = ':root[data-theme="ink-editorial"]';
  const blocks: string[] = [];

  // 1) 无 data-theme 兜底
  blocks.push(`:root {\n${buildCssVars('paper', 'primary')}\n}`);
  blocks.push(`${SUBSTRATE_SELECTOR.ink} {\n${buildCssVars('ink', 'primary')}\n}`);

  // 2) 有 data-theme、无 appearance
  blocks.push(`${T} ${SUBSTRATE_SELECTOR.paper} {\n${buildCssVars('paper', 'primary')}\n}`);
  blocks.push(`${T} ${SUBSTRATE_SELECTOR.ink} {\n${buildCssVars('ink', 'primary')}\n}`);

  // 3/4) 两档外观（primary 与 dark 别名 / muted 与 light 别名）
  for (const [attr, appearance] of [
    ['primary', 'primary'],
    ['dark', 'primary'],
    ['muted', 'muted'],
    ['light', 'muted'],
  ] as [string, Theme09Appearance][]) {
    const P = `:root[data-appearance="${attr}"][data-theme="ink-editorial"]`;
    blocks.push(`${P} ${SUBSTRATE_SELECTOR.paper} {\n${buildCssVars('paper', appearance)}\n}`);
    blocks.push(`${P} ${SUBSTRATE_SELECTOR.ink} {\n${buildCssVars('ink', appearance)}\n}`);
  }

  return blocks.join('\n');
}

export function generateTheme09CssVariables(
  substrate: Theme09Substrate = 'paper',
  appearance: Theme09Appearance = 'primary',
): string {
  return `:root {\n${buildCssVars(substrate, appearance)}\n}`;
}

export function generateTheme09CssVariablesWithAppearance(): string {
  return generateTheme09CssVariables('paper', 'primary');
}
