import { describe, expect, it } from 'vitest';
import { createFallbackGoal } from './fallback.js';

describe('fallback', () => {
  it('should create a valid goal with default page count', () => {
    const goal = createFallbackGoal({ input: '测试主题' });
    expect(goal.title).toBe('测试主题');
    expect(goal.pageCount).toBe(5);
    expect(goal.slides.length).toBe(5);
  });

  it('should create goal with custom page count', () => {
    const goal = createFallbackGoal({ input: '测试主题', pageCount: 10 });
    expect(goal.pageCount).toBe(10);
    expect(goal.slides.length).toBe(10);
  });

  it('should start with cover and end with closing', () => {
    const goal = createFallbackGoal({ input: '测试主题', pageCount: 8 });
    expect(goal.slides[0].layout).toBe('cover_v1');
    const last = goal.slides[goal.slides.length - 1];
    expect(last.layout).toMatch(/closing_v\d/);
  });

  it('should apply theme and language options', () => {
    const goal = createFallbackGoal({ input: '测试', theme: 'dark-tech', language: 'en' });
    expect(goal.theme).toBe('dark-tech');
    expect(goal.language).toBe('en');
  });
});
