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

  it('should not truncate short titles', () => {
    const goal = createFallbackGoal({ input: 'AI 助手产品发布会' });
    expect(goal.title).toBe('AI 助手产品发布会');
  });

  it('should keep full title within 80 chars', () => {
    const input = '面向企业客户的 AI 助手产品发布会，核心卖点：效率提升 10 倍、支持私有化部署';
    const goal = createFallbackGoal({ input });
    expect(goal.title).toBe(input);
    expect(goal.title).toContain('效率提升 10 倍');
  });

  it('should truncate long title at punctuation boundary', () => {
    const input = '面向企业客户的 AI 助手产品发布会，核心卖点：效率提升 10 倍、支持私有化部署、服务 50+ 标杆客户、覆盖金融/制造/零售三大行业';
    const goal = createFallbackGoal({ input });
    expect(goal.title.length).toBeLessThanOrEqual(80);
    expect(goal.title).not.toMatch(/\d+$/); // should not end with a broken number
  });

  it('should infer audience from input', () => {
    const goal = createFallbackGoal({ input: '面向企业客户的 AI 助手产品发布会' });
    expect(goal.audience).toBe('企业客户');
  });

  it('should extract selling points', () => {
    const goal = createFallbackGoal({
      input: 'AI 助手产品发布会，核心卖点：效率提升 10 倍、支持私有化部署、服务 50+ 客户',
    });
    const contentSlide = goal.slides.find((s) => s.layout === 'content_v2');
    expect(contentSlide).toBeDefined();
    const props = contentSlide!.props as Record<string, string[]>;
    expect(props.leftPoints).toContain('效率提升 10 倍');
    expect(props.rightPoints).toContain('服务 50+ 客户');
  });
});
