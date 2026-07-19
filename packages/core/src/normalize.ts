import type { DeckGoal, RawDeckGoal, Slide, RawSlide } from './types.js';

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
 * 旧版使用 `minimal`，新版改为 `base`。
 */
export function normalizeThemeId(themeId: string): string {
  if (themeId === 'minimal') {
    return 'base';
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

/**
 * 规范化 DeckGoal，将旧版 layout 与 theme 命名映射到新版。
 */
export function normalizeDeckGoal(goal: DeckGoal): DeckGoal {
  return {
    ...goal,
    theme: normalizeThemeId(goal.theme),
    slides: goal.slides.map(normalizeSlide),
  };
}

/**
 * 规范化 RawDeckGoal，将旧版 layout 与 theme 命名映射到新版。
 */
export function normalizeRawDeckGoal(goal: RawDeckGoal): RawDeckGoal {
  return {
    ...goal,
    theme: normalizeThemeId(goal.theme),
    slides: goal.slides.map(normalizeRawSlide),
  };
}
