// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import {
  listLayoutsByTheme,
  resolveLayout,
} from '../../registry.js';
// eslint-disable-next-line import/no-relative-packages
import { selectLayoutForRole } from '../../../../composer/src/index.js';
import { generateTheme08CssVariablesWithSchemesAndAppearance } from './tokens.js';
import { bestTextColorForBg, wcagContrastRatio } from './contrast.js';

const THEME08_KEY_IDS = [
  'theme08_cover_v1',
  'theme08_chapter_v1',
  'theme08_heatmap_v1',
  'theme08_waterfall_v1',
  'theme08_closing_v1',
  'theme08_metrics_v1',
  'theme08_quote_v1',
  'theme08_contents_v1',
];

describe('theme08 版式注册', () => {
  it('至少注册 39 个 theme08 版式', () => {
    const layouts = listLayoutsByTheme('theme08');
    expect(layouts.length).toBeGreaterThanOrEqual(39);
  });

  it('核心版式均已注册', () => {
    const ids = listLayoutsByTheme('theme08').map((l) => l.id);
    for (const id of THEME08_KEY_IDS) {
      expect(ids, `缺少版式 ${id}`).toContain(id);
    }
  });

  it('resolveLayout(role, theme08) 返回 theme08 变体', () => {
    // 说明：theme08_chapter_v1 在元数据中注册为 role 'content'（黑金实验风将章节页归为内容变体）
    for (const role of ['cover', 'content', 'closing', 'quote', 'stats'] as const) {
      const layout = resolveLayout(role, 'theme08');
      expect(layout, `role=${role} 未解析到 theme08 版式`).toBeDefined();
      expect(layout?.meta.id.startsWith('theme08_')).toBe(true);
    }
  });
});

describe('theme08 composer 接线（P0-4 回归护栏）', () => {
  it('selectLayoutForRole 在 theme08 下只返回 theme08 版式', () => {
    const roles = ['cover', 'content', 'stats', 'quote', 'closing', 'feature', 'team'] as const;
    for (const role of roles) {
      const id = selectLayoutForRole(role, 'seed-x', 0, 'theme08');
      expect(id.startsWith('theme08_'), `role=${role} 返回了非 theme08 版式: ${id}`).toBe(true);
    }
  });
});

describe('theme08 字体内嵌护栏（P1-A）', () => {
  const css = generateTheme08CssVariablesWithSchemesAndAppearance();
  it('展示字体使用项目内嵌的 Anton，而非未内嵌的 Bebas Neue', () => {
    expect(css).toContain('"Anton"');
    expect(css, '仍引用了未内嵌的 Bebas Neue').not.toContain('Bebas');
  });
});

describe('theme08 对比度工具（P1-B 护栏）', () => {
  it('浅粉/饱和红底使用深字，避免“浅底白字”不可读', () => {
    // 旧实现把这些浅粉当成“深色”用白字，导致 2.2:1 不可读
    expect(bestTextColorForBg('#FF8F8F')).toBe('rgb(10,10,12)');
    expect(bestTextColorForBg('#FF7B7B')).toBe('rgb(10,10,12)');
    expect(bestTextColorForBg('#FF6B9D')).toBe('rgb(10,10,12)');
    expect(bestTextColorForBg('#E83B22')).toBe('rgb(10,10,12)');
  });

  it('暗底使用白字', () => {
    expect(bestTextColorForBg('#14130D')).toBe('#fff');
    expect(bestTextColorForBg('#2C2924')).toBe('#fff');
  });

  it('非法色值回退为深字', () => {
    expect(bestTextColorForBg('not-a-color')).toBe('rgb(10,10,12)');
  });

  it('WCAG 对比度计算正确', () => {
    expect(wcagContrastRatio('#ffffff', '#14130D')).toBeGreaterThan(4.5);
    // 浅粉底 + 白字应被判为不达标（ratio < 4.5）
    expect(wcagContrastRatio('#ffffff', '#FF8F8F')).toBeLessThan(4.5);
  });
});
