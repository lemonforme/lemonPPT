// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal } from '@lemonppt/core';
import { validateRawGoal } from '@lemonppt/core';
import { composeDeckFromRaw, recomposeDeck } from '@lemonppt/composer';
import { createFallbackGoal } from './fallback.js';
import { callOpenAICompatible, type LlmOptions } from './llm.js';
import { buildPrompt, type PromptContext } from './prompt.js';

export interface GenerateGoalOptions extends PromptContext {
  /** LLM 配置；不提供则使用 fallback */
  llm?: LlmOptions;
}

export interface GenerateGoalResult {
  goal: DeckGoal;
  source: 'llm' | 'fallback';
  raw?: string;
}

function extractJson(text: string): string {
  // 尝试去除 markdown 代码块
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // 尝试提取第一个 { ... }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }
  return text.trim();
}

export async function generateGoal(
  options: GenerateGoalOptions
): Promise<GenerateGoalResult> {
  const { input, pageCount, theme, language, llm } = options;

  // 无 API Key 时直接 fallback
  const apiKey = llm?.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const goal = recomposeDeck(createFallbackGoal({ input, pageCount, theme, language }));
    return { goal, source: 'fallback' };
  }

  const prompt = buildPrompt({ input, pageCount, theme, language });
  const response = await callOpenAICompatible(prompt, llm);
  const raw = extractJson(response.content);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`LLM 返回不是合法 JSON: ${err instanceof Error ? err.message : String(err)}\n\n${raw}`);
  }

  const validation = validateRawGoal(parsed);
  if (!validation.success || !validation.data) {
    throw new Error(`goal.json 校验失败: ${JSON.stringify(validation.errors?.format())}`);
  }

  const goal = recomposeDeck(composeDeckFromRaw(validation.data));
  return { goal, source: 'llm', raw };
}

export { buildPrompt, createFallbackGoal, callOpenAICompatible };
export type { PromptContext, LlmOptions };
