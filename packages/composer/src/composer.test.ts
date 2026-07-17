import { describe, expect, it } from 'vitest';
import { composeDeck, selectLayoutForRole } from './index.js';

describe('selectLayoutForRole', () => {
  it('returns a registered layout for cover', () => {
    const layout = selectLayoutForRole('cover');
    expect(layout.startsWith('minimal_')).toBe(true);
  });

  it('is deterministic with the same seed and index', () => {
    const a = selectLayoutForRole('metric', 'seed-1', 0);
    const b = selectLayoutForRole('metric', 'seed-1', 0);
    expect(a).toBe(b);
  });

  it('can return different layouts for the same role with different seeds', () => {
    const a = selectLayoutForRole('closing', 'seed-a', 0);
    const b = selectLayoutForRole('closing', 'seed-b', 0);
    // 概率上可能相同，但 closing 有两个候选，不同种子通常不同
    expect([a, b].every((l) => l.startsWith('minimal_closing'))).toBe(true);
  });
});

describe('composeDeck', () => {
  it('composes a deck from roles and normalizes it', () => {
    const goal = composeDeck({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      language: 'zh',
      randomSeed: 'test',
      slides: [
        { role: 'cover', props: { title: '封面' } },
        { role: 'content', props: { title: '内容', points: ['a', 'b'] } },
        { role: 'closing' },
      ],
    });

    expect(goal.slides.length).toBe(3);
    expect(goal.pageCount).toBe(3);
    expect(goal.slides[0]?.layout.startsWith('minimal_cover')).toBe(true);
    expect(goal.slides[1]?.layout.startsWith('minimal_content')).toBe(true);
    expect(goal.slides[2]?.layout.startsWith('minimal_closing')).toBe(true);
    expect(goal.slides[0]?.props._slideIdx).toBe(1);
    expect(goal.slides[2]?.props._slideIdx).toBe(3);
  });

  it('respects explicit layout over role', () => {
    const goal = composeDeck({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      slides: [{ role: 'cover', layout: 'minimal_chart_v1', props: { title: 'T' } }],
    });

    expect(goal.slides[0]?.layout).toBe('minimal_chart_v1');
  });

  it('falls back to content layout when role and layout are missing', () => {
    const goal = composeDeck({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      slides: [{ props: { title: 'X' } }],
    });

    expect(goal.slides[0]?.layout).toBe('minimal_content_v1');
  });

  it('normalizes pageCount even if input is wrong', () => {
    const goal = composeDeck({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      pageCount: 99,
      slides: [{ role: 'cover' }],
    });

    expect(goal.pageCount).toBe(1);
  });
});
