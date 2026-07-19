import { describe, expect, it } from 'vitest';
import { composeDeck, composeDeckFromRaw, selectLayoutForRole } from './index.js';

describe('selectLayoutForRole', () => {
  it('returns a registered layout for cover', () => {
    const layout = selectLayoutForRole('cover');
    expect(layout).toBe('cover_v1');
  });

  it('is deterministic with the same seed and index', () => {
    const a = selectLayoutForRole('metric', 'seed-1', 0);
    const b = selectLayoutForRole('metric', 'seed-1', 0);
    expect(a).toBe(b);
  });

  it('can return different layouts for the same role with different seeds', () => {
    const a = selectLayoutForRole('closing', 'seed-a', 0);
    const b = selectLayoutForRole('closing', 'seed-b', 0);
    expect([a, b].every((l) => l.startsWith('closing'))).toBe(true);
  });

  it('covers stats role', () => {
    const layout = selectLayoutForRole('stats');
    expect(layout).toBe('stats_v1');
  });

  it('covers team role', () => {
    const layout = selectLayoutForRole('team');
    expect(layout).toBe('team_v1');
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
    expect(goal.slides[0]?.role).toBe('cover');
    expect(goal.slides[0]?.layout.startsWith('cover')).toBe(true);
    expect(goal.slides[1]?.role).toBe('content');
    expect(goal.slides[2]?.role).toBe('closing');
    expect(goal.slides[0]?.props._slideIdx).toBe(1);
    expect(goal.slides[2]?.props._slideIdx).toBe(3);
  });

  it('respects explicit layout over role', () => {
    const goal = composeDeck({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      slides: [{ role: 'cover', layout: 'chart_v1', props: { title: 'T' } }],
    });

    expect(goal.slides[0]?.layout).toBe('chart_v1');
    expect(goal.slides[0]?.role).toBe('cover');
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

describe('composeDeckFromRaw', () => {
  it('composes from a raw goal without layout', () => {
    const goal = composeDeckFromRaw({
      title: '测试',
      goal: '测试目标',
      audience: '测试受众',
      theme: 'minimal',
      language: 'zh',
      pageCount: 2,
      randomSeed: 'raw-test',
      slides: [
        { role: 'cover', props: { title: '封面' } },
        { role: 'metric', props: { value: '99%' } },
      ],
    });

    expect(goal.slides[0]?.layout.startsWith('cover')).toBe(true);
    expect(goal.slides[1]?.layout.startsWith('metric')).toBe(true);
    expect(goal.slides[0]?.props._slideIdx).toBe(1);
  });
});
