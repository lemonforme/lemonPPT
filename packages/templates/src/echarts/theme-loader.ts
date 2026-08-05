// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

export type EChartsInitFn = (root?: Element | null) => void;
export type EChartsDisposeFn = () => void;

interface EChartsThemeModule {
  initECharts: EChartsInitFn;
  disposeECharts: EChartsDisposeFn;
}

const loadedModules: Record<string, EChartsThemeModule | undefined> = {};

/**
 * 按主题动态加载对应的 ECharts 初始化模块。
 * 首次调用时动态 import，后续从缓存复用，避免主 bundle 同时包含所有主题的图表模块。
 */
export async function loadEChartsTheme(theme: string): Promise<EChartsThemeModule> {
  const normalized = theme || 'theme01';
  const cached = loadedModules[normalized];
  if (cached) return cached;

  let module: EChartsThemeModule;
  switch (normalized) {
    case 'theme02':
      module = await import('./theme02-init.js');
      break;
    case 'theme03':
      module = await import('./theme03-init.js');
      break;
    case 'theme04':
      module = await import('./theme04-init.js');
      break;
    case 'theme06':
      module = await import('./theme06-init.js');
      break;
    case 'theme01':
    default:
      module = await import('./theme01-init.js');
      break;
  }
  loadedModules[normalized] = module;
  return module;
}

/**
 * 初始化指定主题对应的 ECharts 实例。
 * 若该主题模块尚未加载，会先异步加载再初始化；首次加载完成后即缓存。
 */
export async function initEChartsForTheme(theme: string, root?: Element | null): Promise<void> {
  const mod = await loadEChartsTheme(theme);
  mod.initECharts(root);
}

/**
 * 销毁当前已加载主题的所有 ECharts 实例。
 */
export async function disposeEChartsForTheme(theme: string): Promise<void> {
  const mod = await loadEChartsTheme(theme);
  mod.disposeECharts();
}
