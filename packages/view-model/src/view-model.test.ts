// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal } from '@lemonppt/core';
import { describe, expect, it } from 'vitest';
import { normalizeDeck, normalizeSlide, truncateText } from './index.js';
import { adaptChartProps } from './chart-adapters.js';

const baseGoal: DeckGoal = {
  title: '测试',
  goal: '测试目标',
  audience: '测试受众',
  theme: 'theme01',
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

describe('adaptChartProps', () => {
  describe('theme02', () => {
    it('converts top-level data to series for theme02_chart_bar_v1', () => {
      const props = { title: '使用频率', labels: ['每天', '每周', '每月'], data: [25.3, 48, 12] };
      adaptChartProps('theme02_chart_bar_v1', props);
      expect(props.series).toEqual([{ name: '使用频率', values: [25.3, 48, 12] }]);
    });

    it('converts datasets to series for theme02_chart_line_v1', () => {
      const props = {
        title: '趋势',
        labels: ['Q1', 'Q2'],
        datasets: [{ label: 'A', data: [10, 20] }, { label: 'B', data: [15, 25] }],
      };
      adaptChartProps('theme02_chart_line_v1', props);
      expect(props.series).toEqual([
        { name: 'A', values: [10, 20] },
        { name: 'B', values: [15, 25] },
      ]);
    });

    it('normalizes object-array values for theme02_chart_area_v1', () => {
      const props = {
        title: '面积',
        labels: ['a', 'b'],
        series: [{ name: 'S', values: [{ item: 1 }, { item: 2 }] }],
      };
      adaptChartProps('theme02_chart_area_v1', props);
      expect(props.series).toEqual([{ name: 'S', values: [1, 2] }]);
    });

    it('converts datasets to data for theme02_chart_v1', () => {
      const props = { labels: ['a', 'b'], datasets: [{ data: [3, 4] }] };
      adaptChartProps('theme02_chart_v1', props);
      expect(props.data).toEqual([3, 4]);
    });

    it('converts data to segments for theme02_chart_donut', () => {
      const props = { title: '占比', labels: ['A', 'B'], data: [30, 70] };
      adaptChartProps('theme02_chart_donut', props);
      expect(props.segments).toEqual([
        { label: 'A', value: 30 },
        { label: 'B', value: 70 },
      ]);
    });
  });

  describe('theme04', () => {
    it('converts data to segments for theme04_chart_donut', () => {
      const props = { labels: ['A', 'B', 'C'], data: [10, 20, 30] };
      adaptChartProps('theme04_chart_donut', props);
      expect(props.segments).toEqual([
        { label: 'A', value: 10 },
        { label: 'B', value: 20 },
        { label: 'C', value: 30 },
      ]);
    });

    it('converts data to items for theme04_waterfall_v1', () => {
      const props = { labels: ['Q1', 'Q2'], data: [100, 50] };
      adaptChartProps('theme04_waterfall_v1', props);
      expect(props.items).toEqual([
        { label: 'Q1', value: 100, tone: 100 },
        { label: 'Q2', value: 50, tone: 50 },
      ]);
    });

    it('uses two datasets for theme04_slope_v1 previous/current', () => {
      const props = {
        labels: ['A', 'B'],
        datasets: [
          { label: '去年', data: [100, 200] },
          { label: '今年', data: [120, 180] },
        ],
      };
      adaptChartProps('theme04_slope_v1', props);
      expect(props.items).toEqual([
        { name: 'A', previous: 100, current: 120, tone: 0 },
        { name: 'B', previous: 200, current: 180, tone: 0 },
      ]);
    });
  });

  describe('theme05', () => {
    it('converts data to items for theme05_donut_v1', () => {
      const props = { labels: ['A', 'B'], data: [40, 60] };
      adaptChartProps('theme05_donut_v1', props);
      expect(props.items).toEqual([
        { name: 'A', value: 40, scheme: 40 },
        { name: 'B', value: 60, scheme: 60 },
      ]);
    });

    it('converts data to series for theme05_radar_v1', () => {
      const props = { labels: ['速度', '质量'], data: [80, 90] };
      adaptChartProps('theme05_radar_v1', props);
      expect(props.series).toEqual([{ name: '数值', values: [80, 90] }]);
    });
  });

  describe('theme06', () => {
    it('converts data to labels/values for theme06_chart_waterfall_v1', () => {
      const props = { labels: ['A', 'B'], data: [10, -5] };
      adaptChartProps('theme06_chart_waterfall_v1', props);
      expect(props.labels).toEqual(['A', 'B']);
      expect(props.values).toEqual([10, -5]);
    });

    it('converts data to items for theme06_map_v1', () => {
      const props = { labels: ['北京', '上海'], data: [100, 200] };
      adaptChartProps('theme06_map_v1', props);
      expect(props.items).toEqual([
        { name: '北京', value: 100 },
        { name: '上海', value: 200 },
      ]);
    });
  });

  describe('theme08', () => {
    it('converts data to bars for theme08_chart_bar_v1', () => {
      const props = { labels: ['A', 'B'], data: [10, 20] };
      adaptChartProps('theme08_chart_bar_v1', props);
      expect(props.bars).toEqual([
        { value: 10, label: 'A', alt: '' },
        { value: 20, label: 'B', alt: '' },
      ]);
    });

    it('converts data to segments for theme08_chart_donut_v1', () => {
      const props = { labels: ['A', 'B'], data: [30, 70] };
      adaptChartProps('theme08_chart_donut_v1', props);
      expect(props.segments).toEqual([
        { name: 'A', value: 30 },
        { name: 'B', value: 70 },
      ]);
    });
  });

  describe('theme09', () => {
    it('converts data to items for theme09_ranking_v1', () => {
      const props = { labels: ['A', 'B'], data: [100, 80] };
      adaptChartProps('theme09_ranking_v1', props);
      expect(props.items).toEqual([
        { name: 'A', value: 100, delta: 100 },
        { name: 'B', value: 80, delta: 80 },
      ]);
    });

    it('converts data to stages for theme09_funnel_v1', () => {
      const props = { labels: ['访问', '转化'], data: [1000, 100] };
      adaptChartProps('theme09_funnel_v1', props);
      expect(props.stages).toEqual([
        { name: '访问', value: 1000 },
        { name: '转化', value: 100 },
      ]);
    });

    it('uses two datasets for theme09_tornado_v1 left/right', () => {
      const props = {
        labels: ['A', 'B'],
        datasets: [
          { label: '男', data: [40, 30] },
          { label: '女', data: [35, 45] },
        ],
      };
      adaptChartProps('theme09_tornado_v1', props);
      expect(props.items).toEqual([
        { name: 'A', left: 40, right: 35 },
        { name: 'B', left: 30, right: 45 },
      ]);
    });
  });

  describe('theme10', () => {
    it('converts data to categories + comma-separated series for theme10_bar_v1', () => {
      const props = { labels: ['Q1', 'Q2'], data: [100, 200] };
      adaptChartProps('theme10_bar_v1', props);
      expect(props.categories).toEqual([{ text: 'Q1' }, { text: 'Q2' }]);
      expect(props.series).toEqual([{ name: '数值', values: '100,200' }]);
    });

    it('converts data to items for theme10_donut_v1', () => {
      const props = { labels: ['A', 'B'], data: [40, 60] };
      adaptChartProps('theme10_donut_v1', props);
      expect(props.items).toEqual([
        { name: 'A', value: 40 },
        { name: 'B', value: 60 },
      ]);
    });

    it('uses multiple datasets for theme10_candlestick_v1', () => {
      const props = {
        labels: ['周一', '周二'],
        datasets: [
          { label: 'open', data: [10, 12] },
          { label: 'high', data: [15, 18] },
          { label: 'low', data: [8, 11] },
          { label: 'close', data: [14, 13] },
        ],
      };
      adaptChartProps('theme10_candlestick_v1', props);
      expect(props.items).toEqual([
        { open: 10, high: 15, low: 8, close: 14 },
        { open: 12, high: 18, low: 11, close: 13 },
      ]);
    });
  });
});
