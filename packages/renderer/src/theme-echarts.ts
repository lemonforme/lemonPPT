// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { disposeEChartsForTheme, initEChartsForTheme } from '@lemonppt/templates';

declare global {
  interface Window {
    __lemonPPT_initEChartsForTheme?: (theme: string, root?: Element | null) => Promise<void>;
    __lemonPPT_disposeEChartsForTheme?: (theme: string) => Promise<void>;
  }
}

/**
 * 主题化 ECharts 初始化脚本（独立 IIFE bundle）。
 *
 * 该脚本与 client-render.js 分离，使主 bundle 不包含 echarts 核心库，
 * 仅在需要图表渲染时按需加载此脚本，从而显著减小初始加载体积。
 */
window.__lemonPPT_initEChartsForTheme = initEChartsForTheme;
window.__lemonPPT_disposeEChartsForTheme = disposeEChartsForTheme;

export { initEChartsForTheme, disposeEChartsForTheme };
