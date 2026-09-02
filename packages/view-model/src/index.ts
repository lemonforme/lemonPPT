// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, Slide } from '@lemonppt/core';

export interface NormalizeOptions {
  /** 标题最大长度，默认 80 */
  maxTitleLength?: number;
  /** 单条要点最大长度，默认 120 */
  maxPointLength?: number;
  /** 要点最大条数，默认 6 */
  maxPoints?: number;
  /** 摘要/描述最大长度，默认 200 */
  maxDescriptionLength?: number;
}

const DEFAULT_OPTIONS: Required<NormalizeOptions> = {
  maxTitleLength: 80,
  maxPointLength: 120,
  maxPoints: 6,
  maxDescriptionLength: 200,
};

interface GenericDataset {
  label?: string;
  name?: string;
  data?: unknown[];
  values?: unknown[];
}

function normalizeNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') return Number(v);
      if (v && typeof v === 'object') return Number((v as { item?: number | string }).item ?? 0);
      return Number(v ?? 0);
    })
    .filter((v) => !Number.isNaN(v));
}

function buildSeriesFromGenericChart(
  title: string,
  props: Record<string, unknown>
): GenericDataset[] | undefined {
  if (Array.isArray(props.datasets)) {
    return (props.datasets as GenericDataset[]).map((ds, i) => ({
      name: ds.label ?? ds.name ?? (i === 0 ? title : `系列${i + 1}`),
      values: normalizeNumberArray(ds.data ?? ds.values),
    }));
  }
  if (props.data !== undefined) {
    return [{ name: title, values: normalizeNumberArray(props.data) }];
  }
  return undefined;
}

/**
 * 将 Agent 生成的通用 chart 数据（labels + data / datasets）
 * 适配为 theme02 专用图表版式所需的 series 结构。
 */
function adaptTheme02ChartProps(layout: string, props: Record<string, unknown>): void {
  // theme02 的 bar/line/area/stack 图表需要 series
  const seriesLayouts = new Set([
    'theme02_chart_bar_v1',
    'theme02_chart_line_v1',
    'theme02_chart_area_v1',
    'theme02_chart_stack_v1',
  ]);

  if (seriesLayouts.has(layout)) {
    const existingSeries = props.series;
    if (Array.isArray(existingSeries) && existingSeries.length > 0) {
      props.series = existingSeries
        .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
        .map((s) => ({
          ...s,
          values: normalizeNumberArray(s.values),
        }));
      return;
    }

    const title = typeof props.title === 'string' && props.title ? props.title : '数值';
    const series = buildSeriesFromGenericChart(title, props);
    if (series) {
      props.series = series;
    }
    return;
  }

  // theme02_chart_v1 使用顶层 data；如果只有 datasets 则取第一个 dataset 的 data
  if (layout === 'theme02_chart_v1' && props.data === undefined && Array.isArray(props.datasets)) {
    const first = (props.datasets as GenericDataset[])[0];
    if (first) {
      props.data = normalizeNumberArray(first.data ?? first.values);
    }
  }
}

/**
 * 截断文本，超出部分显示省略号。
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * 确保字段是数组，并截断每条内容。
 */
function normalizeArrayField(
  props: Record<string, unknown>,
  key: string,
  maxItems: number,
  maxItemLength: number
): void {
  const value = props[key];
  if (value === undefined || value === null) {
    props[key] = [];
    return;
  }
  if (!Array.isArray(value)) {
    props[key] = [];
    return;
  }
  props[key] = value
    .slice(0, maxItems)
    .map((item) => (typeof item === 'string' ? truncateText(item, maxItemLength) : item));
}

/**
 * 规范化单个 slide 的 props：注入页码、截断文本、确保数组存在。
 */
export function normalizeSlide(
  slide: Slide,
  index: number,
  pageCount: number,
  options: NormalizeOptions = {}
): Slide {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const props: Record<string, unknown> = { ...slide.props };

  // 注入页码信息，供版式组件使用
  props._slideIdx = index + 1;
  props._pageCount = pageCount;

  // 截断常见文本字段
  if (typeof props.title === 'string') {
    props.title = truncateText(props.title, opts.maxTitleLength);
  }
  if (typeof props.kicker === 'string') {
    props.kicker = truncateText(props.kicker, opts.maxTitleLength);
  }
  if (typeof props.subtitle === 'string') {
    props.subtitle = truncateText(props.subtitle, opts.maxDescriptionLength);
  }
  if (typeof props.description === 'string') {
    props.description = truncateText(props.description, opts.maxDescriptionLength);
  }
  if (typeof props.quote === 'string') {
    props.quote = truncateText(props.quote, opts.maxPointLength * 2);
  }
  if (typeof props.content === 'string') {
    props.content = truncateText(props.content, opts.maxDescriptionLength);
  }

  // 按角色确保相关数组字段存在，同时保留已自定义的数组字段
  const roleArrayFields: Record<string, string[]> = {
    content: ['points', 'leftPoints', 'rightPoints'],
    tableOfContents: ['items'],
    faq: ['items'],
    process: ['steps'],
    feature: ['features'],
    timeline: ['milestones'],
    roadmap: ['phases'],
    pricing: ['plans', 'tiers'],
    gallery: ['images'],
    partners: ['partners'],
    stats: ['stats'],
    team: ['members'],
    metric: ['metrics'],
  };
  const existingArrayFields = Object.keys(props).filter((key) => Array.isArray(props[key]));
  const fieldsToNormalize = new Set([...(roleArrayFields[slide.role] ?? []), ...existingArrayFields]);
  for (const key of fieldsToNormalize) {
    normalizeArrayField(props, key, opts.maxPoints, opts.maxPointLength);
  }

  // 适配 theme02 专用 chart 版式的数据格式
  adaptTheme02ChartProps(slide.layout, props);

  return { ...slide, props };
}

/**
 * 规范化整个 DeckGoal：同步 pageCount、逐页规范化 props。
 */
export function normalizeDeck(goal: DeckGoal, options?: NormalizeOptions): DeckGoal {
  const pageCount = goal.slides.length;
  const slides = goal.slides.map((slide, index) => normalizeSlide(slide, index, pageCount, options));

  return {
    ...goal,
    pageCount,
    slides,
  };
}
