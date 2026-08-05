// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

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

type ColorSchemeValue = 'light' | 'dark' | 'scheme-a' | 'scheme-b' | 'green' | 'yellow' | 'blue' | 'pink' | 'coral' | 'amber' | 'teal' | 'indigo' | 'violet' | 'volt' | 'magma' | 'nebula' | 'nova';

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
  appearance: 'light' | 'dark' | undefined,
): 'light' | 'dark' | undefined {
  const theme = normalizeThemeId(themeId);
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
