import { describe, expect, it } from 'vitest';
import { validateDeckGoal, validateSlideCount } from './schema.js';

describe('schema', () => {
  const validGoal = {
    title: '测试演示',
    goal: '验证 schema 校验',
    audience: '开发者',
    theme: 'minimal',
    language: 'zh',
    pageCount: 2,
    slides: [
      { role: 'cover' as const, layout: 'cover_v1', props: { title: '封面' } },
      { role: 'closing' as const, layout: 'closing_v1', props: { title: '结尾' } },
    ],
  };

  it('should validate a correct goal', () => {
    const result = validateDeckGoal(validGoal);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should reject goal with missing required fields', () => {
    const result = validateDeckGoal({ title: '只有标题' });
    expect(result.success).toBe(false);
  });

  it('should validate slide count matches pageCount', () => {
    const result = validateSlideCount(validGoal as any);
    expect(result).toEqual([]);
  });

  it('should report slide count mismatch', () => {
    const result = validateSlideCount({ ...validGoal, pageCount: 3 } as any);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('pageCount');
  });
});
