// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { theme01Tokens } from './theme01/tokens.js';
import { theme02Tokens } from './theme02/tokens.js';
import { theme03Tokens } from './theme03/tokens.js';
import { theme04Tokens } from './theme04/tokens.js';
import { theme05Tokens } from './theme05/tokens.js';
import { theme06Tokens } from './theme06/tokens.js';

export const themes = [theme01Tokens, theme02Tokens, theme03Tokens, theme04Tokens, theme05Tokens, theme06Tokens] as const;

export type ThemeToken = typeof themes[number];

export function getTheme(id: string): ThemeToken | undefined {
  return themes.find((t) => t.id === id);
}

export * from './theme01/tokens.js';
export * from './theme02/tokens.js';
export * from './theme03/tokens.js';
export * from './theme04/tokens.js';
export * from './theme05/tokens.js';
export * from './theme06/tokens.js';
