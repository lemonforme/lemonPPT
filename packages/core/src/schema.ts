import { z } from 'zod';
import type { DeckGoal, LayoutMeta, SlideRole } from './types.js';

const slideRoleSchema = z.enum([
  'cover',
  'tableOfContents',
  'metric',
  'chart',
  'comparison',
  'process',
  'quote',
  'content',
  'image',
  'analysis',
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

/**
 * 校验 goal.json 是否合法
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
 * 校验 pageCount 与 slides 数量是否一致
 */
export function validateSlideCount(goal: DeckGoal): string[] {
  const errors: string[] = [];
  if (goal.pageCount !== goal.slides.length) {
    errors.push(
      `pageCount (${goal.pageCount}) 与 slides 数量 (${goal.slides.length}) 不一致`
    );
  }
  return errors;
}
