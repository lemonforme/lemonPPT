// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { z } from 'zod';
import type { DeckGoal, LayoutMeta, RawDeckGoal, Slide, SlideRole } from './types.js';

const slideRoleSchema = z.enum([
  'cover',
  'tableOfContents',
  'metric',
  'stats',
  'chart',
  'comparison',
  'pricing',
  'process',
  'timeline',
  'roadmap',
  'quote',
  'testimonial',
  'content',
  'faq',
  'feature',
  'team',
  'partners',
  'image',
  'gallery',
  'bento',
  'table',
  'tags',
  'filmstrip',
  'swot',
  'pest',
  'closing',
]) satisfies z.ZodType<SlideRole>;

export const mediaSlotSchema = z.object({
  name: z.string(),
  fieldPath: z.string(),
  canPresetMedia: z.boolean(),
  filled: z.boolean().optional(),
});

export const layoutMetaSchema = z.object({
  id: z.string(),
  theme: z.string(),
  role: slideRoleSchema,
  displayName: z.string(),
  description: z.string().optional(),
  needsMedia: z.boolean(),
  mediaSlots: z.array(mediaSlotSchema).optional(),
}) satisfies z.ZodType<LayoutMeta>;

export const slideSchema = z.object({
  role: slideRoleSchema,
  layout: z.string().min(1),
  props: z.record(z.unknown()),
});

export const deckGoalSchema = z.object({
  title: z.string().min(1),
  goal: z.string().min(1),
  audience: z.string().min(1),
  owner: z.string().optional(),
  theme: z.string().min(1),
  colorScheme: z.enum(['light', 'dark', 'scheme-a', 'scheme-b', 'green', 'yellow', 'blue', 'pink', 'coral', 'amber', 'teal', 'indigo', 'violet', 'volt', 'magma', 'nebula', 'nova']).default('light'),
  appearance: z.enum(['light', 'dark']).optional(),
  language: z.enum(['zh', 'en']).default('zh'),
  pageCount: z.number().int().min(1).max(200),
  randomSeed: z.string().optional(),
  slides: z.array(slideSchema),
}) satisfies z.ZodType<DeckGoal>;

export const rawSlideSchema = z.object({
  role: slideRoleSchema,
  layout: z.string().min(1).optional(),
  props: z.record(z.unknown()),
});

export const rawDeckGoalSchema = z.object({
  title: z.string().min(1),
  goal: z.string().min(1),
  audience: z.string().min(1),
  owner: z.string().optional(),
  theme: z.string().min(1),
  colorScheme: z.enum(['light', 'dark', 'scheme-a', 'scheme-b', 'green', 'yellow', 'blue', 'pink', 'coral', 'amber', 'teal', 'indigo', 'violet', 'volt', 'magma', 'nebula', 'nova']).default('light'),
  appearance: z.enum(['light', 'dark']).optional(),
  language: z.enum(['zh', 'en']).default('zh'),
  pageCount: z.number().int().min(1).max(200),
  randomSeed: z.string().optional(),
  slides: z.array(rawSlideSchema),
}) satisfies z.ZodType<RawDeckGoal>;

/**
 * 校验最终 goal.json 是否合法（每页必须包含版式）
 */
export function validateDeckGoal(input: unknown): {
  success: boolean;
  data?: DeckGoal;
  errors?: z.ZodError;
} {
  const result = deckGoalSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * 校验 Agent 原始输出是否合法（允许只含角色、不含版式）
 */
export function validateRawGoal(input: unknown): {
  success: boolean;
  data?: RawDeckGoal;
  errors?: z.ZodError;
} {
  const result = rawDeckGoalSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

function getArray(props: Record<string, unknown>, key: string): unknown[] {
  const value = props[key];
  return Array.isArray(value) ? value : [];
}

/**
 * 校验单页 slide 的关键内容字段是否缺失，用于提前发现可能导致空白页的数据问题。
 */
export function validateSlideContent(slide: Slide, index?: number): string[] {
  const errors: string[] = [];
  const prefix = `Slide ${index ?? '?'}`;
  const add = (msg: string) => errors.push(`${prefix} (${slide.layout ?? slide.role}): ${msg}`);
  const props = (slide.props ?? {}) as Record<string, unknown>;
  const arr = (key: string) => getArray(props, key);

  const layoutId = slide.layout ?? '';

  // theme04 部分版式使用自定义字段名，优先按 layoutId 校验以避免误报。
  if (layoutId.startsWith('theme05_')) {
    const theme05Checks: Record<string, () => void> = {
      theme05_heatmap_v1: () => {
        if (arr('values').length === 0) add('heatmap values missing');
        if (arr('months').length === 0) add('heatmap months missing');
      },
      theme05_waterfall_v1: () => {
        if (arr('items').length === 0) add('waterfall items missing');
      },
      theme05_closing_v1: () => {
        if (!props.claim) add('closing claim missing');
      },
      theme05_roadmap_v1: () => {
        if (arr('phases').length === 0) add('roadmap phases missing');
      },
      theme05_scorecards_v1: () => {
        if (arr('cards').length === 0) add('scorecards missing');
      },
      theme05_donut_v1: () => {
        if (arr('items').length === 0) add('donut items missing');
      },
      theme05_radar_v1: () => {
        if (arr('indicators').length === 0) add('radar indicators missing');
        if (arr('series').length === 0) add('radar series missing');
      },
      theme05_treemap_v1: () => {
        if (arr('items').length === 0) add('treemap items missing');
      },
      theme05_metric_delta_v1: () => {
        if (!props.currentValue && !props.previousValue && !props.delta) {
          add('metric delta values missing');
        }
        if (arr('labels').length === 0) add('metric trend labels missing');
        if (arr('data').length === 0) add('metric trend data missing');
      },
      theme05_bubble_v1: () => {
        if (arr('items').length === 0) add('bubble items missing');
      },
      theme05_map_v1: () => {
        if (arr('items').length === 0) add('map items missing');
      },
      theme05_chart_funnel_v1: () => {
        if (arr('stages').length === 0) add('funnel stages missing');
      },
      theme05_chart_gauge_v1: () => {
        if (props.value === undefined || props.value === '') add('gauge value missing');
      },
      theme05_chart_share_v1: () => {
        if (arr('items').length === 0) add('share items missing');
      },
      theme05_chart_stacked_v1: () => {
        if (arr('labels').length === 0) add('stacked labels missing');
        if (arr('series').length === 0) add('stacked series missing');
      },
      theme05_timeline_v1: () => {
        if (arr('phases').length === 0) add('timeline phases missing');
      },
    };
    const check = theme05Checks[layoutId];
    if (check) {
      check();
      return errors;
    }
  }

  if (layoutId.startsWith('theme04_')) {
    const theme04Checks: Record<string, () => void> = {
      theme04_gauges_v1: () => {
        if (arr('gauges').length === 0) add('gauges missing');
      },
      theme04_scorecards_v1: () => {
        if (arr('cards').length === 0) add('scorecards missing');
      },
      theme04_versus_v1: () => {
        const left = props.left as Record<string, unknown> | undefined;
        const right = props.right as Record<string, unknown> | undefined;
        const hasLeft = left && (left.value || left.metric);
        const hasRight = right && (right.value || right.metric);
        if (!hasLeft || !hasRight) add('versus values missing');
      },
      theme04_calendar_v1: () => {
        if (arr('events').length === 0) add('calendar events missing');
      },
      theme04_dumbbell_v1: () => {
        if (arr('items').length === 0) add('dumbbell items missing');
      },
      theme04_groupbars_v1: () => {
        if (arr('labels').length === 0) add('groupbars labels missing');
        if (arr('series').length === 0) add('groupbars series missing');
      },
      theme04_pyramid_v1: () => {
        if (arr('items').length === 0) add('pyramid items missing');
      },
      theme04_region_v1: () => {
        if (arr('items').length === 0) add('region items missing');
      },
      theme04_scatter_v1: () => {
        if (arr('items').length === 0) add('scatter items missing');
      },
      theme04_slope_v1: () => {
        if (arr('items').length === 0) add('slope items missing');
      },
      theme04_spread_v1: () => {
        if (arr('items').length === 0) add('spread items missing');
      },
      theme04_stacked_v1: () => {
        if (arr('labels').length === 0) add('stacked labels missing');
        if (arr('series').length === 0) add('stacked series missing');
      },
      theme04_treemap_v1: () => {
        if (arr('items').length === 0) add('treemap items missing');
      },
      theme04_valuechart_v1: () => {
        if (arr('stages').length === 0) add('valuechart stages missing');
      },
      theme04_waterfall_v1: () => {
        if (arr('items').length === 0) add('waterfall items missing');
      },
      theme04_chaintable_v1: () => {
        if (arr('tiers').length === 0) add('chaintable tiers missing');
      },
      theme04_ledger_v1: () => {
        if (arr('investors').length === 0) add('ledger investors missing');
      },
      theme04_layers_v1: () => {
        if (arr('layers').length === 0) add('layers missing');
      },
      theme04_metro_v1: () => {
        if (arr('stops').length === 0) add('metro stops missing');
      },
      theme04_riskchain_v1: () => {
        if (arr('risks').length === 0) add('riskchain risks missing');
      },
      theme04_roadmap_v1: () => {
        if (arr('steps').length === 0) add('roadmap steps missing');
      },
      theme04_timeline_v1: () => {
        if (arr('phases').length === 0) add('timeline phases missing');
      },
      theme04_cards_v1: () => {
        if (arr('cards').length === 0) add('cards missing');
      },
      theme04_voices_v1: () => {
        if (arr('voices').length === 0) add('voices missing');
      },
    };
    const check = theme04Checks[layoutId];
    if (check) {
      check();
      return errors;
    }
  }

  switch (slide.role) {
    case 'chart': {
      if (layoutId === 'theme04_radar_v1') {
        if (arr('datasets').length === 0) add('radar datasets missing');
        if (arr('labels').length === 0) add('radar labels missing');
      } else if (layoutId === 'theme04_heatmap_v1') {
        if (arr('cells').length === 0) add('heatmap cells missing');
        if (arr('xLabels').length === 0 || arr('yLabels').length === 0) add('heatmap labels missing');
      } else {
        const chartLabels = arr('labels');
        const chartBars = arr('bars');
        const chartSegments = arr('segments');
        if (chartLabels.length === 0 && chartBars.length === 0 && chartSegments.length === 0) {
          add('chart labels missing');
        }
        if (layoutId === 'chart_v2') {
          const datasets = arr('datasets');
          const hasData = datasets.some(
            (d) => Array.isArray((d as Record<string, unknown>).data) && ((d as Record<string, unknown>).data as unknown[]).length > 0
          );
          if (datasets.length === 0 || !hasData) add('chart datasets missing or empty');
        } else if (
          arr('data').length === 0 &&
          chartBars.length === 0 &&
          chartSegments.length === 0
        ) {
          add('chart data missing');
        }
      }
      break;
    }
    case 'stats':
      if (arr('stats').length === 0) add('stats missing');
      break;
    case 'process':
      if (arr('steps').length === 0) add('steps missing');
      break;
    case 'timeline':
      if (arr('milestones').length === 0) add('milestones missing');
      break;
    case 'roadmap': {
      const layoutId = slide.layout ?? '';
      if (layoutId === 'theme04_gantt_v1') {
        if (arr('lanes').length === 0) add('gantt lanes missing');
        if (arr('periods').length === 0) add('gantt periods missing');
      } else if (arr('quarters').length === 0 && arr('phases').length === 0) {
        add('quarters missing');
      }
      break;
    }
    case 'faq':
      if (arr('items').length === 0) add('faq items missing');
      break;
    case 'feature':
      if (arr('features').length === 0 && arr('items').length === 0) add('features missing');
      break;
    case 'team':
      if (arr('members').length === 0) add('members missing');
      break;
    case 'partners':
      if (arr('logos').length === 0) add('logos missing');
      break;
    case 'pricing':
      if (arr('plans').length === 0) add('plans missing');
      break;
    case 'gallery':
    case 'filmstrip': {
      const layoutId = slide.layout ?? '';
      if (layoutId === 'theme04_triptych_v1') {
        if (arr('panels').length === 0) add('triptych panels missing');
      } else if (arr('images').length === 0) {
        add('images missing');
      }
      break;
    }
    case 'bento':
      if (arr('items').length === 0) add('bento items missing');
      break;
    case 'table':
      if (arr('rows').length === 0) add('table rows missing');
      break;
    case 'tags':
      if (arr('tags').length === 0) add('tags missing');
      break;
    case 'tableOfContents':
      if (arr('items').length === 0) add('toc items missing');
      break;
    case 'metric': {
      const metrics = arr('metrics');
      const items = arr('items');
      if (metrics.length > 0) {
        const hasValue = metrics.some((m) => (m as Record<string, unknown>).value || (m as Record<string, unknown>).metric);
        if (!hasValue) add('metric value missing');
      } else if (items.length > 0) {
        const hasValue = items.some((m) => (m as Record<string, unknown>).value || (m as Record<string, unknown>).metric);
        if (!hasValue) add('metric value missing');
      } else if (!props.value && !props.metric) {
        add('metric value missing');
      }
      break;
    }
    case 'quote':
    case 'testimonial':
      if (!props.quote) add('quote missing');
      break;
    case 'cover':
    case 'closing':
      if (!props.title) add('title missing');
      break;
    case 'swot':
      if (
        !props.strength &&
        !props.weakness &&
        !props.opportunity &&
        !props.threat
      ) {
        add('swot fields missing');
      }
      break;
    case 'pest':
      if (
        !props.political &&
        !props.economic &&
        !props.social &&
        !props.technological
      ) {
        add('pest fields missing');
      }
      break;
    default:
      break;
  }

  return errors;
}

/**
 * 校验 DeckGoal 中各 slide 的关键内容字段是否缺失。
 */
export function validateDeckGoalContent(goal: DeckGoal): string[] {
  return goal.slides.flatMap((slide, index) => validateSlideContent(slide, index));
}

/**
 * 校验 pageCount 与 slides 数量是否一致
 */
export function validateSlideCount(goal: { pageCount: number; slides: unknown[] }): string[] {
  const errors: string[] = [];
  if (goal.pageCount !== goal.slides.length) {
    errors.push(
      `pageCount (${goal.pageCount}) 与 slides 数量 (${goal.slides.length}) 不一致`
    );
  }
  return errors;
}
