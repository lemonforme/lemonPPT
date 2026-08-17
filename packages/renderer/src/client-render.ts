// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, Slide } from '@lemonppt/core';
import { renderSlide } from '@lemonppt/templates';
import ReactDOMClient from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';

declare global {
  interface Window {
    __lemonPPT_goal?: DeckGoal;
    __lemonPPT_renderSlideHtml?: (slide: Slide, options: { slideIdx: number; editable: boolean; theme?: string }) => string;
    __lemonPPT_renderSlideToRoot?: (container: HTMLElement, slide: Slide, options: { slideIdx: number; editable: boolean; theme?: string }) => void;
    __lemonPPT_initECharts?: (theme?: string, root?: Element | null) => Promise<void>;
    __lemonPPT_disposeECharts?: (theme?: string) => Promise<void>;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSlideHtml(slide: Slide, options: { slideIdx: number; editable: boolean; theme?: string }): string {
  const element = renderSlide(slide, options);
  if (!element) {
    return `<div class="lp-error">未找到版式: ${escapeHtml(slide.layout)}</div>`;
  }
  return ReactDOMServer.renderToStaticMarkup(element);
}

function renderSlideToRoot(
  container: HTMLElement,
  slide: Slide,
  options: { slideIdx: number; editable: boolean; theme?: string }
): void {
  const element = renderSlide(slide, options);
  if (!element) {
    container.innerHTML = `<div class="lp-error">未找到版式: ${escapeHtml(slide.layout)}</div>`;
    return;
  }
  // 复用已存在的 React root，避免重复创建
  let root = (container as unknown as { __lemonPPT_root?: ReactDOMClient.Root }).__lemonPPT_root;
  if (!root) {
    root = ReactDOMClient.createRoot(container);
    (container as unknown as { __lemonPPT_root?: ReactDOMClient.Root }).__lemonPPT_root = root;
  }
  root.render(element);
}

/**
 * 根据当前主题初始化对应分包的 ECharts 模块。
 * 旧代码可能无参调用，默认使用 theme01。
 *
 * ECharts 初始化逻辑已拆分到 theme-echarts.js IIFE bundle 中，通过全局函数委托调用，
 * 使 client-render.js 主 bundle 不依赖 echarts 核心库。
 */
async function initECharts(theme?: string, root?: Element | null): Promise<void> {
  const t = theme || (window.__lemonPPT_goal?.theme as string) || 'theme01';
  const fn = window.__lemonPPT_initEChartsForTheme;
  if (typeof fn === 'function') {
    await fn(t, root);
  } else {
    console.warn('[lemonPPT] ECharts 初始化脚本未加载，跳过图表渲染。主题：', t);
  }
}

async function disposeECharts(theme?: string): Promise<void> {
  const t = theme || (window.__lemonPPT_goal?.theme as string) || 'theme01';
  const fn = window.__lemonPPT_disposeEChartsForTheme;
  if (typeof fn === 'function') {
    await fn(t);
  }
}

window.__lemonPPT_renderSlideHtml = renderSlideHtml;
window.__lemonPPT_renderSlideToRoot = renderSlideToRoot;
window.__lemonPPT_initECharts = initECharts;
window.__lemonPPT_disposeECharts = disposeECharts;

export { renderSlideHtml, renderSlideToRoot, initECharts, disposeECharts };
