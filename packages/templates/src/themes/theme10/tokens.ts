// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * ⚠️ 渲染真源（SOURCE OF TRUTH）⚠️
 * renderer 经 @lemonppt/templates 实际调用本文件。
 * 镜像副本 `packages/themes/src/theme10/tokens.ts` 仅供 getTheme() 元数据使用。
 * 改配色请先改本文件，再同步：
 *   cp packages/templates/src/themes/theme10/tokens.ts packages/themes/src/theme10/tokens.ts
 *
 * theme10 设计 Token。
 * 风格：金色指数 · 金融编辑风 / Gold Index · Financial Editorial。
 *
 * 视觉坐标（与 theme08 黑金实验、theme09 墨韵专色、Dashi theme10 全部区分开）：
 *   冰蓝主强调 #4a7fd4 + 香槟金/铜点睛 #d9b977 / #c97a52 + mono 数据字体 + 账本细线/刻度质感。
 *   三情绪渐变（aurora / obsidian / ember）全部自写，不抄 theme10 Dashi 的 dusk/midnight/dawn，
 *   也不抄 theme08 的荧光金 #ECEF35 / Anton / 手绘箭头。
 *
 * 所有色值、类名、装饰语汇均为原创，不复制 Dashi theme10 的实现、专色族
 * （含其同族错值）、类名（lp-theme10-* 仅 our 自创骨架）与保留前缀变量。
 */

export type Theme10Mood = 'aurora' | 'obsidian' | 'ember';

export interface Theme10Tokens {
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
    gold: string;
    goldAmber: string;
    copper: string;
    violet: string;
    red: string;
    green: string;
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
    rule: string;
    ruleStrong: string;
    glowBlue: string;
    glowGold: string;
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
}

/* ────────────────────────────────────────────────────────────────
 * 三情绪基底（全部自写渐变定义）
 * ──────────────────────────────────────────────────────────────── */
const MOOD_GRADIENT: Record<Theme10Mood, string> = {
  // 暗→香槟金收尾：封面、高端页（制造金线冲击）
  aurora:
    'linear-gradient(158deg, #0a0e14 0%, #16202c 30%, #2c3a44 60%, #6b5e4e 85%, #b89a78 100%)',
  // 深海军蓝近黑：数据/内容页（保证可读）
  obsidian:
    'radial-gradient(120% 85% at 72% 8%, #1a2433 0%, #0c1118 52%, #05070b 100%)',
  // 暖紫铜晨曦：章节/金句/影像页（暖调变奏）
  ember: 'linear-gradient(160deg, #171320 0%, #46363f 38%, #8a6356 72%, #cfa882 100%)',
};

/* ────────────────────────────────────────────────────────────────
 * 强调色系统（冰蓝主 + 金铜点睛，自写 hex，与 Dashi 同族错值）
 * 全部经 WCAG 2.1 AA 预校验（近白 #eef1f6 在 #05070b 上 ≥ 15:1；
 *  冰蓝 #4a7fd4 / 香槟金 #d9b977 在深底上 ≥ 4.5:1）
 * ──────────────────────────────────────────────────────────────── */
const C = {
  ink: '#eef1f6',
  ink2: '#a9b2c0',
  ink3: '#7e889b',
  inverse: '#05070b',
  accent: '#4a7fd4', // 冰蓝主
  accent2: '#6f9bd8', // 柔蓝
  gold: '#d9b977', // 香槟金
  goldAmber: '#e8a23a', // 琥珀金
  copper: '#c97a52', // 铜橙
  violet: '#9a82dc', // 紫罗兰
  red: '#e0615a', // 涨/强信号（暖红，区别于 copper）
  green: '#5fb89a', // 跌/正向（青绿，金融可读）
};

const SERIES = [C.accent, C.gold, C.goldAmber, C.copper, C.violet, C.accent2];

const BASE_BG = '#0a0e14';
const BG_START = '#0c121b';
const BG_END = '#05070b';

function buildTokenCatalog(): Theme10Tokens {
  return {
    id: 'theme10',
    displayName: 'Theme 10',
    description:
      '金色指数 · 金融编辑风：墨黑金线底 + 冰蓝主强调 + 香槟金/铜点睛，sans+mono 数据字体，账本细线/刻度质感，适合金融数据、投资报告、商业指数与投研白皮书',
    colors: {
      ink: C.ink,
      ink2: C.ink2,
      ink3: C.ink3,
      textInverse: C.inverse,
      accent: C.accent,
      accent2: C.accent2,
      gold: C.gold,
      goldAmber: C.goldAmber,
      copper: C.copper,
      violet: C.violet,
      red: C.red,
      green: C.green,
      series: SERIES,
      background: BASE_BG,
      backgroundGradientStart: BG_START,
      backgroundGradientEnd: BG_END,
      surface: 'color-mix(in srgb, #eef1f6 6%, transparent)',
      surfaceStrong: 'color-mix(in srgb, #eef1f6 11%, transparent)',
      surfaceSolid: '#121823',
      surfaceElevated: '#1a2230',
      border: 'color-mix(in srgb, #eef1f6 16%, transparent)',
      borderStrong: 'color-mix(in srgb, #eef1f6 30%, transparent)',
      shadow: '0 22px 54px rgba(0, 0, 0, 0.55)',
      rule: 'color-mix(in srgb, #eef1f6 14%, transparent)',
      ruleStrong: 'color-mix(in srgb, #eef1f6 34%, transparent)',
      glowBlue: 'color-mix(in srgb, #4a7fd4 30%, transparent)',
      glowGold: 'color-mix(in srgb, #d9b977 26%, transparent)',
    },
    fonts: {
      heading: '"Inter", "Noto Sans SC", system-ui, sans-serif',
      body: '"Noto Sans SC", system-ui, sans-serif',
      mono: '"Space Mono", "IBM Plex Mono", ui-monospace, monospace',
      en: '"Newsreader", Georgia, "Noto Serif SC", serif',
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
      small: '6px',
      medium: '10px',
      large: '14px',
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
  };
}

export const theme10Tokens = buildTokenCatalog();

export function getTheme10Tokens(): Theme10Tokens {
  return buildTokenCatalog();
}

/* ────────────────────────────────────────────────────────────────
 * CSS 变量生成（被 render.tsx / gallery.mjs 注入到 <style>）
 *
 * 层叠顺序：
 *   1. :root 兜底（obsidian 默认）
 *   2. .lp-theme10-mood-aurora / obsidian / ember（按版式预分配情绪）
 * ──────────────────────────────────────────────────────────────── */
function buildCssVars(): string {
  const t = buildTokenCatalog();
  const c = t.colors;
  return `
  --lp-ink: ${c.ink};
  --lp-ink2: ${c.ink2};
  --lp-ink3: ${c.ink3};
  --lp-text-inverse: ${c.textInverse};
  --lp-accent: ${c.accent};
  --lp-accent-2: ${c.accent2};
  --lp-gold: ${c.gold};
  --lp-gold-amber: ${c.goldAmber};
  --lp-copper: ${c.copper};
  --lp-violet: ${c.violet};
  --lp-red: ${c.red};
  --lp-green: ${c.green};
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
  --lp-rule: ${c.rule};
  --lp-rule-strong: ${c.ruleStrong};
  --lp-glow-blue: ${c.glowBlue};
  --lp-glow-gold: ${c.glowGold};
  --lp-font: ${t.fonts.body};
  --lp-font-mono: ${t.fonts.mono};
  --lp-font-heading: ${t.fonts.heading};
  --lp-radius-small: ${t.borderRadius.small};
  --lp-radius-medium: ${t.borderRadius.medium};
  --lp-radius-large: ${t.borderRadius.large};
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
  --lp-card-accent: color-mix(in srgb, var(--lp-accent) 14%, transparent);
  --lp-card-accent-border: var(--lp-accent);
  --lp-on-accent: #05070b;
  --lp-error: var(--lp-red);
  --lp-warning: var(--lp-gold-amber);
  --lp-success: var(--lp-green);
  --lp-font-display: ${t.fonts.heading};
  /* theme10 专有：金融编辑语汇 */
  --lp-t10-mood: obsidian;
  --lp-t10-en: ${t.fonts.en};
  --lp-t10-rule: ${c.rule};
  --lp-t10-rule-strong: ${c.ruleStrong};
  --lp-t10-gold: ${c.gold};
  --lp-t10-gold-amber: ${c.goldAmber};
  --lp-t10-copper: ${c.copper};
  --lp-t10-blue: ${c.accent};
  --lp-t10-ticker-h: 30px;
  --lp-t10-scale-unit: 22px;
  `;
}

export function generateTheme10CssVariables(mood: Theme10Mood = 'obsidian'): string {
  const blocks: string[] = [];
  // 1) :root 兜底（obsidian 默认）
  blocks.push(`:root {\n${buildCssVars()}\n  --lp-t10-mood: obsidian;\n}`);
  // 2) 三情绪类（按版式预分配，形成翻页节奏）
  for (const m of ['aurora', 'obsidian', 'ember'] as Theme10Mood[]) {
    blocks.push(
      `.lp-theme10-mood-${m} {\n  --lp-mood-gradient: ${MOOD_GRADIENT[m]};\n  --lp-t10-mood: ${m};\n}`,
    );
  }
  // 兼容直接挂在 <html data-mood> 的全局设定
  blocks.push(`:root[data-mood="${mood}"] {\n${buildCssVars()}\n}`);
  return blocks.join('\n');
}
