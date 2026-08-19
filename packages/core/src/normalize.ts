// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, RawDeckGoal, Slide, RawSlide, SlideRole } from './types.js';

const VALID_ROLES: SlideRole[] = [
  'cover', 'tableOfContents', 'metric', 'stats', 'chart', 'comparison', 'pricing',
  'process', 'timeline', 'roadmap', 'quote', 'testimonial', 'content', 'faq',
  'feature', 'team', 'partners', 'image', 'gallery', 'bento', 'table', 'tags',
  'filmstrip', 'swot', 'pest', 'closing',
];

function inferRoleFromLayout(layoutId: string): SlideRole | undefined {
  const parts = layoutId.split('_');
  if (parts.length >= 3) {
    const maybe = parts[1] as SlideRole;
    if (VALID_ROLES.includes(maybe)) return maybe;
  }
  return undefined;
}

/**
 * 预处理外部 Agent 传入的 goal.json，兼容 third-party PPT 等外部契约。
 * - 将 `themePack` 映射为 `theme`
 * - 未传 `pageCount` 时默认等于 slides.length
 * - 未传 `role` 时尝试从 layout ID 推断
 */
export function preprocessAgentGoal(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object') {
    throw new Error('goal must be a JSON object');
  }
  const raw = input as Record<string, unknown>;
  const goal: Record<string, unknown> = { ...raw };

  if (goal.themePack && !goal.theme) {
    goal.theme = goal.themePack;
  }
  delete goal.themePack;

  if (!goal.theme) {
    goal.theme = 'theme01';
  }

  const slides = Array.isArray(goal.slides) ? [...goal.slides] : [];
  goal.slides = slides.map((slide) => {
    if (!slide || typeof slide !== 'object') return slide;
    const s = { ...(slide as Record<string, unknown>) };
    if (!s.role && typeof s.layout === 'string') {
      const inferred = inferRoleFromLayout(s.layout);
      if (inferred) s.role = inferred;
    }
    if (!s.role) {
      s.role = 'content';
    }
    return s;
  });

  if (typeof goal.pageCount !== 'number') {
    goal.pageCount = slides.length;
  }

  return goal;
}

/**
 * 将旧版 layout ID 规范化。
 * 旧版使用 `minimal_xxx_v1`，新版改为 `xxx_v1`。
 */
export function normalizeLayoutId(layoutId: string): string {
  if (layoutId.startsWith('minimal_')) {
    return layoutId.slice('minimal_'.length);
  }
  return layoutId;
}

/**
 * 将旧版主题 ID 规范化。
 * 旧版使用 `minimal`，新版默认主题为 `theme01`。
 */
export function normalizeThemeId(themeId: string): string {
  if (themeId === 'minimal') {
    return 'theme01';
  }
  return themeId;
}

function normalizeSlide(slide: Slide): Slide {
  return {
    ...slide,
    layout: normalizeLayoutId(slide.layout),
  };
}

function normalizeRawSlide(slide: RawSlide): RawSlide {
  return {
    ...slide,
    layout: slide.layout ? normalizeLayoutId(slide.layout) : undefined,
  };
}

type ColorSchemeValue = 'light' | 'dark' | 'scheme-a' | 'scheme-b' | 'green' | 'yellow' | 'blue' | 'pink' | 'coral' | 'amber' | 'teal' | 'indigo' | 'violet' | 'volt' | 'magma' | 'nebula' | 'nova' | 'obsidian-gold' | 'ink-editorial';

const THEME05_SCHEMES: ColorSchemeValue[] = ['coral', 'amber', 'teal', 'indigo', 'violet'];
const THEME06_SCHEMES: ColorSchemeValue[] = ['volt', 'magma', 'nebula', 'nova'];

function normalizeColorScheme(
  themeId: string,
  colorScheme: ColorSchemeValue | undefined,
): ColorSchemeValue | undefined {
  const theme = normalizeThemeId(themeId);
  if (theme === 'theme02' || theme === 'theme03') {
    return colorScheme === 'scheme-b' ? 'scheme-b' : 'scheme-a';
  }
  if (theme === 'theme04') {
    const tone = colorScheme ?? 'green';
    const validTones: ColorSchemeValue[] = ['green', 'yellow', 'blue', 'pink'];
    if (tone === 'scheme-a' || tone === 'scheme-b') return 'green';
    return validTones.includes(tone) ? tone : 'green';
  }
  if (theme === 'theme05') {
    const scheme = colorScheme ?? 'coral';
    if (scheme === 'light' || scheme === 'dark') return 'coral';
    return THEME05_SCHEMES.includes(scheme) ? scheme : 'coral';
  }
  if (theme === 'theme06') {
    const scheme = colorScheme ?? 'volt';
    if (scheme === 'light' || scheme === 'dark') return 'volt';
    return THEME06_SCHEMES.includes(scheme) ? scheme : 'volt';
  }
  if (theme === 'theme08') {
    // theme08 仅有单一配色方案「曜金」，深浅由 appearance(primary/muted) 控制
    return 'obsidian-gold';
  }
  if (theme === 'theme09') {
    // theme09 仅有单一配色方案「墨韵专色」；纸/墨基底由版式自身预分配，
    // appearance(primary/muted) 只调专色浓度与网点密度，不翻转明暗
    return 'ink-editorial';
  }
  if (colorScheme === 'obsidian-gold') {
    // 非 theme08 不认识该方案，退回浅色
    return 'light';
  }
  if (colorScheme === 'ink-editorial') {
    // 非 theme09 不认识该方案，退回浅色
    return 'light';
  }
  if (colorScheme === 'scheme-a' || colorScheme === 'scheme-b' ||
      colorScheme === 'green' || colorScheme === 'yellow' ||
      colorScheme === 'blue' || colorScheme === 'pink' ||
      colorScheme === 'coral' || colorScheme === 'amber' ||
      colorScheme === 'teal' || colorScheme === 'indigo' ||
      colorScheme === 'violet') {
    return 'light';
  }
  return colorScheme;
}

function normalizeAppearance(
  themeId: string,
  appearance: 'light' | 'dark' | 'primary' | 'muted' | undefined,
): 'light' | 'dark' | 'primary' | 'muted' | undefined {
  const theme = normalizeThemeId(themeId);
  if (theme === 'theme08') {
    // theme08 使用 primary(深/黑金) 与 muted(浅/暖金)，同时兼容 dark/light 写法
    return appearance === 'muted' || appearance === 'light' ? 'muted' : 'primary';
  }
  if (theme === 'theme09') {
    // theme09 使用 primary(浓专色) 与 muted(淡专色)，同时兼容 dark/light 写法
    return appearance === 'muted' || appearance === 'light' ? 'muted' : 'primary';
  }
  if (theme !== 'theme03' && theme !== 'theme04' && theme !== 'theme05') {
    return undefined;
  }
  return appearance === 'light' ? 'light' : 'dark';
}

/**
 * 规范化 DeckGoal，将旧版 layout 与 theme 命名映射到新版。
 */
export function normalizeDeckGoal(goal: DeckGoal): DeckGoal {
  const theme = normalizeThemeId(goal.theme);
  return {
    ...goal,
    theme,
    colorScheme: normalizeColorScheme(theme, goal.colorScheme),
    appearance: normalizeAppearance(theme, goal.appearance),
    slides: goal.slides.map(normalizeSlide),
  };
}

/**
 * 规范化 RawDeckGoal，将旧版 layout 与 theme 命名映射到新版。
 */
export function normalizeRawDeckGoal(goal: RawDeckGoal): RawDeckGoal {
  const theme = normalizeThemeId(goal.theme);
  return {
    ...goal,
    theme,
    colorScheme: normalizeColorScheme(theme, goal.colorScheme),
    appearance: normalizeAppearance(theme, goal.appearance),
    slides: goal.slides.map(normalizeRawSlide),
  };
}
