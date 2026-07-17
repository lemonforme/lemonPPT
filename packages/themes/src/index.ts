import { darkTechTokens } from './dark-tech/tokens.js';
import { minimalTokens } from './minimal/tokens.js';
import { warmBusinessTokens } from './warm-business/tokens.js';

export const themes = [minimalTokens, darkTechTokens, warmBusinessTokens] as const;

export type ThemeToken = typeof themes[number];

export function getTheme(id: string): ThemeToken | undefined {
  return themes.find((t) => t.id === id);
}

export * from './minimal/tokens.js';
export * from './dark-tech/tokens.js';
export * from './warm-business/tokens.js';
