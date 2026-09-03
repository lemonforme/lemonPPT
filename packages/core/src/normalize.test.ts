// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import type { LayoutContract } from './types.js';
import { normalizeDeckGoal, normalizeLayoutId, normalizeThemeId } from './normalize.js';

describe('normalize', () => {
  it('should strip minimal_ prefix from layout id', () => {
    expect(normalizeLayoutId('minimal_cover_v1')).toBe('cover_v1');
    expect(normalizeLayoutId('cover_v1')).toBe('cover_v1');
  });

  it('should map minimal theme to theme01', () => {
    expect(normalizeThemeId('minimal')).toBe('theme01');
    expect(normalizeThemeId('theme01')).toBe('theme01');
  });

  it('should normalize old goal.json naming', () => {
    const goal = {
      title: '测试',
      goal: '测试',
      audience: '测试',
      theme: 'minimal',
      language: 'zh' as const,
      pageCount: 2,
      slides: [
        { role: 'cover' as const, layout: 'minimal_cover_v1', props: {} },
        { role: 'content' as const, layout: 'minimal_content_v1', props: {} },
      ],
    };

    const normalized = normalizeDeckGoal(goal);
    expect(normalized.theme).toBe('theme01');
    expect(normalized.slides[0].layout).toBe('cover_v1');
    expect(normalized.slides[1].layout).toBe('content_v1');
  });

  it('should be idempotent', () => {
    const goal = {
      title: '测试',
      goal: '测试',
      audience: '测试',
      theme: 'theme01',
      language: 'zh' as const,
      pageCount: 1,
      slides: [{ role: 'cover' as const, layout: 'cover_v1', props: {} }],
    };

    expect(normalizeDeckGoal(normalizeDeckGoal(goal))).toEqual(normalizeDeckGoal(goal));
  });

  it('should fill missing props from layout contract', () => {
    const contract: LayoutContract = {
      defaultProps: { title: 'Default Title', nested: { value: 42 } },
      controls: [
        { key: 'title', label: 'Title', type: 'text', defaultValue: 'Default Title' },
        { key: 'nested.value', label: 'Value', type: 'number', defaultValue: 42 },
      ],
    };
    const goal = {
      title: 'Test',
      goal: 'Test',
      audience: 'Test',
      theme: 'theme01',
      language: 'zh' as const,
      pageCount: 1,
      slides: [{ role: 'cover' as const, layout: 'cover_v1', props: { title: 'Custom' } }],
    };

    const normalized = normalizeDeckGoal(goal, () => contract);
    expect(normalized.slides[0].props.title).toBe('Custom');
    expect(normalized.slides[0].props.nested).toEqual({ value: 42 });
  });
});
