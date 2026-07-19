import { describe, expect, it } from 'vitest';
import { normalizeDeckGoal, normalizeLayoutId, normalizeThemeId } from './normalize.js';

describe('normalize', () => {
  it('should strip minimal_ prefix from layout id', () => {
    expect(normalizeLayoutId('minimal_cover_v1')).toBe('cover_v1');
    expect(normalizeLayoutId('cover_v1')).toBe('cover_v1');
  });

  it('should map minimal theme to base', () => {
    expect(normalizeThemeId('minimal')).toBe('base');
    expect(normalizeThemeId('dark-tech')).toBe('dark-tech');
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
    expect(normalized.theme).toBe('base');
    expect(normalized.slides[0].layout).toBe('cover_v1');
    expect(normalized.slides[1].layout).toBe('content_v1');
  });

  it('should be idempotent', () => {
    const goal = {
      title: '测试',
      goal: '测试',
      audience: '测试',
      theme: 'base',
      language: 'zh' as const,
      pageCount: 1,
      slides: [{ role: 'cover' as const, layout: 'cover_v1', props: {} }],
    };

    expect(normalizeDeckGoal(normalizeDeckGoal(goal))).toEqual(normalizeDeckGoal(goal));
  });
});
