// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

export function resolveCssVar(name: string, fallback?: string): string {
  if (typeof document === 'undefined') return fallback ?? '';
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback || '';
}

export function resolveCssVarsInOption(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/var\((--[\w-]+)\)/g, (_, varName) => {
      return resolveCssVar(varName, value);
    });
  }
  if (Array.isArray(value)) {
    return value.map(resolveCssVarsInOption);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = resolveCssVarsInOption(v);
    }
    return result;
  }
  return value;
}
