import type { DeckGoal } from '@lemonppt/core';
import { describe, expect, it } from 'vitest';
import { normalizeDeck, normalizeSlide, truncateText } from './index.js';

const baseGoal: DeckGoal = {
  title: '测试',
  goal: '测试目标',
  audience: '测试受众',
  theme: 'base',
  language: 'zh',
  pageCount: 2,
  randomSeed: 'test',
  slides: [
    { role: 'cover', layout: 'cover_v1', props: { title: '封面', subtitle: '副标题' } },
    { role: 'content', layout: 'content_v1', props: { title: '内容', points: ['a', 'b', 'c'] } },
  ],
};

describe('truncateText', () => {
  it('returns original text when within limit', () => {
    expect(truncateText('short', 10)).toBe('short');
  });

  it('truncates long text with ellipsis', () => {
    const text = 'a'.repeat(100);
    expect(truncateText(text, 10)).toBe('a'.repeat(9) + '…');
  });
});

describe('normalizeSlide', () => {
  it('injects page metadata', () => {
    const slide = normalizeSlide(baseGoal.slides[0]!, 0, 2);
    expect(slide.props._slideIdx).toBe(1);
    expect(slide.props._pageCount).toBe(2);
  });

  it('truncates title', () => {
    const slide = normalizeSlide(
      { role: 'cover' as const, layout: 'cover_v1', props: { title: 'a'.repeat(100) } },
      0,
      1,
      { maxTitleLength: 20 }
    );
    expect((slide.props.title as string).length).toBe(20);
  });

  it('ensures points array exists', () => {
    const slide = normalizeSlide(
      { role: 'content' as const, layout: 'content_v1', props: {} },
      0,
      1
    );
    expect(slide.props.points).toEqual([]);
  });

  it('caps points length', () => {
    const slide = normalizeSlide(
      { role: 'content' as const, layout: 'content_v1', props: { points: ['1', '2', '3', '4', '5', '6', '7'] } },
      0,
      1,
      { maxPoints: 5 }
    );
    expect((slide.props.points as string[]).length).toBe(5);
  });
});

describe('normalizeDeck', () => {
  it('syncs pageCount with slides length', () => {
    const normalized = normalizeDeck({ ...baseGoal, pageCount: 99 });
    expect(normalized.pageCount).toBe(2);
  });

  it('normalizes every slide', () => {
    const normalized = normalizeDeck(baseGoal);
    expect(normalized.slides[0]?.props._slideIdx).toBe(1);
    expect(normalized.slides[1]?.props._slideIdx).toBe(2);
  });
});
