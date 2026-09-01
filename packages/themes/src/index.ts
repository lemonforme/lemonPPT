// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { theme01Tokens } from './theme01/tokens.js';
import { theme02Tokens } from './theme02/tokens.js';
import { theme03Tokens } from './theme03/tokens.js';
import { theme04Tokens } from './theme04/tokens.js';
import { theme05Tokens } from './theme05/tokens.js';
import { theme06Tokens } from './theme06/tokens.js';
import { theme07Tokens } from './theme07/tokens.js';
import { theme08Tokens } from './theme08/tokens.js';
import { theme09Tokens } from './theme09/tokens.js';
import { theme10Tokens } from './theme10/tokens.js';
import { theme11Tokens } from './theme11/tokens.js';

export const themes = [theme01Tokens, theme02Tokens, theme03Tokens, theme04Tokens, theme05Tokens, theme06Tokens, theme07Tokens, theme08Tokens, theme09Tokens, theme10Tokens, theme11Tokens] as const;

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
export * from './theme07/tokens.js';
export * from './theme08/tokens.js';
export * from './theme09/tokens.js';
export * from './theme10/tokens.js';
export * from './theme11/tokens.js';
