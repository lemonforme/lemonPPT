// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, Slide } from '@lemonppt/core';
import { initECharts, disposeECharts, renderSlide } from '@lemonppt/templates';
import ReactDOMClient from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { renderDeck } from './render.js';

declare global {
  interface Window {
    __lemonPPT_renderEditableHtml?: (goal: DeckGoal) => string;
    __lemonPPT_renderSlideHtml?: (slide: Slide, options: { slideIdx: number; editable: boolean; theme?: string }) => string;
    __lemonPPT_renderSlideToRoot?: (container: HTMLElement, slide: Slide, options: { slideIdx: number; editable: boolean; theme?: string }) => void;
    __lemonPPT_initECharts?: (root?: Element | null) => void;
    __lemonPPT_disposeECharts?: () => void;
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

/**
 * 浏览器端离线渲染入口。
 * 将当前 goal 渲染为完整的 editor.html 字符串，供静态文件模式下结构变更后重新加载。
 */
function renderEditableHtml(goal: DeckGoal): string {
  const output = renderDeck(goal, { editable: true });
  return output.html;
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

window.__lemonPPT_renderEditableHtml = renderEditableHtml;
window.__lemonPPT_renderSlideHtml = renderSlideHtml;
window.__lemonPPT_renderSlideToRoot = renderSlideToRoot;
window.__lemonPPT_initECharts = initECharts;
window.__lemonPPT_disposeECharts = disposeECharts;

export { renderEditableHtml, renderSlideHtml, renderSlideToRoot, initECharts, disposeECharts };
