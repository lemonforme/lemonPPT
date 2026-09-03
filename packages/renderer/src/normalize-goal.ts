// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { normalizeDeckGoal } from '@lemonppt/core';
import type { DeckGoal } from '@lemonppt/core';
import { getLayoutContract } from '@lemonppt/templates';

/**
 * 规范化 DeckGoal，并自动应用版式 Prop Contract 补齐默认值。
 */
export function normalizeGoal(goal: DeckGoal): DeckGoal {
  return normalizeDeckGoal(goal, (_theme, layout) => getLayoutContract(layout));
}
