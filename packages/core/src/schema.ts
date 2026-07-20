// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { z } from 'zod';
import type { DeckGoal, LayoutMeta, RawDeckGoal, SlideRole } from './types.js';

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
