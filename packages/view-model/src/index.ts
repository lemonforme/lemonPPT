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

  // 确保常见数组字段存在且长度受控
  const arrayFields = [
    'points',
    'leftPoints',
    'rightPoints',
    'items',
    'steps',
    'features',
    'milestones',
    'phases',
    'tiers',
    'images',
    'partners',
    'stats',
    'members',
  ];
  for (const key of arrayFields) {
    normalizeArrayField(props, key, opts.maxPoints, opts.maxPointLength);
  }

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
