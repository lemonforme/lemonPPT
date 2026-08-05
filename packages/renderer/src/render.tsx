// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, RenderOutput } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import {
  renderSlide,
  listLayouts,
  getLayoutSchema,
  generateThemeCssVariablesWithDark,
  generateTheme02CssVariablesWithSchemes,
  generateTheme03CssVariablesWithSchemes,
  generateTheme04CssVariablesWithTonesAndAppearance,
  generateTheme05CssVariablesWithSchemesAndAppearance,
  generateTheme06CssVariablesWithSchemesAndAppearance,
} from '@lemonppt/templates';
import ReactDOMServer from 'react-dom/server';
import { editorScript } from './editor-script.js';

export interface RenderOptions {
  /** 页面宽度，默认 1280 */
  width?: number;
  /** 页面高度，默认 720 */
  height?: number;
  /** 是否开启浏览器端编辑 */
  editable?: boolean;
}

export function renderDeck(goal: DeckGoal, options: RenderOptions = {}): RenderOutput {
  goal = normalizeDeckGoal(goal);
  const { width = 1280, height = 720, editable = false } = options;

  const slideCount = goal.slides.length;

  const slideElements = goal.slides.map((slide, index) => {
    const element = renderSlide(slide, { slideIdx: index, editable, theme: goal.theme });
    const stateClass = index === 0 ? 'active' : '';
    return (
      <div
        key={index}
        className={`lp-slide-wrapper ${stateClass}`}
        data-slide-index={index}
        data-layout={slide.layout}
        data-lp-transition={String(slide.props.transition || 'none')}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxSizing: 'border-box',
        }}
      >
        {element ?? (
          <div className="lp-error">
            未找到版式: {slide.layout}
          </div>
        )}
      </div>
    );
  });

  const slidesMarkup = ReactDOMServer.renderToStaticMarkup(
    <div
      className="lp-deck"
      data-theme={goal.theme}
      data-lp-transition="none"
      data-editable={editable ? 'true' : undefined}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {slideElements}
    </div>
  );

  const slideHtmls = goal.slides.map((slide, index) => {
    const element = renderSlide(slide, { slideIdx: index, editable, theme: goal.theme });
    return ReactDOMServer.renderToStaticMarkup(
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxSizing: 'border-box',
        }}
      >
        {element ?? (
          <div className="lp-error">
            未找到版式: {slide.layout}
          </div>
        )}
      </div>
    );
  });

  const navMarkup = buildNavMarkup(slideCount);
  const scriptMarkup = editable ? buildEditorScriptMarkup(goal) : buildScriptMarkup();
  const editorBarMarkup = editable ? buildEditorBarMarkup(goal) : '';
  const leftPanelMarkup = editable ? buildLeftPanelMarkup(goal, slideHtmls, width, height) : '';
  const rightPanelMarkup = editable ? buildRightPanelMarkup() : '';
  const addSlideModalMarkup = editable ? buildAddSlideModalMarkup(goal) : '';
  const bodyClass = editable ? 'lp-editor-body' : '';

  const bodyMarkup = editable
    ? `<div class="lp-editor-root">
${editorBarMarkup}
<div class="lp-editor-workspace">
${leftPanelMarkup}
<main class="lp-editor-stage">
  <div class="lp-editor-stage-scaler">
    ${slidesMarkup}
    <div class="lp-editor-page-counter"><span id="lp-current">1</span> / ${slideCount}</div>
  </div>
  <div class="lp-editor-zoom-bar">
    <button id="lp-zoom-out" title="缩小">－</button>
    <input type="range" id="lp-zoom-slider" min="35" max="150" value="100">
    <button id="lp-zoom-in" title="放大">＋</button>
    <button id="lp-zoom-fit" title="适应画布">适应</button>
    <span id="lp-zoom-value">100%</span>
  </div>
</main>
${rightPanelMarkup}
</div>
${addSlideModalMarkup}
${scriptMarkup}
</div>`
    : `${slidesMarkup}${navMarkup}${scriptMarkup}`;

  const theme = goal.theme || 'theme01';
  const colorScheme = goal.colorScheme || (theme === 'theme02' || theme === 'theme03' ? 'scheme-a' : theme === 'theme04' ? 'green' : theme === 'theme05' ? 'coral' : theme === 'theme06' ? 'volt' : 'light');
  const appearance = goal.appearance || (theme === 'theme03' || theme === 'theme04' || theme === 'theme05' || theme === 'theme06' ? 'dark' : undefined);
  const appearanceAttr = appearance ? ` data-appearance="${appearance}"` : '';
  const themeCssVars = theme === 'theme01'
    ? generateThemeCssVariablesWithDark()
    : theme === 'theme02'
      ? generateTheme02CssVariablesWithSchemes()
      : theme === 'theme03'
        ? generateTheme03CssVariablesWithSchemes()
        : theme === 'theme04'
          ? generateTheme04CssVariablesWithTonesAndAppearance()
          : theme === 'theme05'
            ? generateTheme05CssVariablesWithSchemesAndAppearance()
            : theme === 'theme06'
              ? generateTheme06CssVariablesWithSchemesAndAppearance()
              : '';

  const html = `<!DOCTYPE html>
<html lang="${goal.language ?? 'zh'}" data-theme="${colorScheme}"${appearanceAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${width}, initial-scale=1.0">
  <title>${escapeHtml(goal.title)}</title>
  <link rel="stylesheet" href="./assets/fonts/fonts.css">
  <link rel="stylesheet" href="./assets/${theme}.css">
  <script src="./assets/jquery.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
${themeCssVars}
    html, body {
      width: 100%;
      height: 100%;
      background: #111;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lp-editor-body {
      display: block;
    }
    .lp-deck {
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
      border-radius: 12px;
      overflow: hidden;
    }
    .lp-error {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fee2e2;
      color: #991b1b;
      font-family: system-ui, sans-serif;
    }
    .lp-editor-root {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      background: #1a1a1a;
      color: #e5e5e5;
      overflow: hidden;
    }
    .lp-editor-root .lp-editor-bar {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      transform: none !important;
      width: 100% !important;
      height: 64px !important;
      box-sizing: border-box !important;
      border-radius: 0 !important;
      border-bottom: 1px solid #333 !important;
      background: #1e1e1e !important;
      color: #e5e5e5 !important;
      padding: 0 16px !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      z-index: 100;
    }
    .lp-editor-root .lp-editor-title {
      margin-right: auto;
    }
    .lp-editor-root .lp-appearance-switcher {
      display: inline-flex;
      align-items: center;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 999px;
      padding: 3px;
      gap: 3px;
    }
    .lp-editor-root .lp-appearance-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: transparent;
      color: #aaa;
      border: none;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .lp-editor-root .lp-appearance-btn:hover {
      color: #e5e5e5;
    }
    .lp-editor-root .lp-appearance-active {
      background: #3a3a3a;
      color: #fff;
      font-weight: 500;
    }
    .lp-editor-root .lp-editor-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #2a2a2a;
      color: #e5e5e5;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 13px;
      line-height: 1.4;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
    }
    .lp-editor-root .lp-editor-btn:hover:not(:disabled) {
      background: #333;
      border-color: #555;
    }
    .lp-editor-root .lp-editor-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .lp-editor-root .lp-editor-btn-primary {
      background: #34d399 !important;
      border-color: #34d399 !important;
      color: #111 !important;
      font-weight: 600;
    }
    .lp-editor-root .lp-editor-btn-primary:hover:not(:disabled) {
      background: #10b981 !important;
      border-color: #10b981 !important;
    }
    .lp-editor-root .lp-editor-select {
      background: #2a2a2a;
      color: #e5e5e5;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 13px;
      outline: none;
      max-width: 120px;
    }
    .lp-editor-root .lp-editor-select:focus {
      border-color: #5b8cff;
    }
    .lp-editor-export {
      position: relative;
    }
    .lp-editor-export-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .lp-editor-caret {
      font-size: 10px;
      line-height: 1;
      transform: translateY(1px);
    }
    .lp-editor-export-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 220px;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lp-editor-export-menu[hidden] {
      display: none !important;
    }
    .lp-editor-export-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 14px;
      cursor: pointer;
      text-align: left;
    }
    .lp-editor-export-item:hover {
      background: #3a3a3a;
    }
    .lp-editor-export-icon {
      width: 20px;
      text-align: center;
      color: #aaa;
      font-size: 14px;
    }
    .lp-editor-export-label {
      flex: 1;
    }
    .lp-editor-export-tag {
      font-size: 11px;
      color: #999;
      background: #3a3a3a;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .lp-editor-workspace {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .lp-editor-left-panel {
      width: 180px;
      flex: none;
      background: #1e1e1e;
      border-right: 1px solid #333;
      overflow-y: auto;
      padding: 12px;
      position: relative;
    }
    .lp-editor-right-panel {
      width: 400px;
      flex: none;
      background: #1e1e1e;
      border-left: 1px solid #333;
      overflow-y: auto;
      padding: 16px;
    }
    .lp-editor-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      background-color: #1a1a1a;
      background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
      background-size: 28px 28px;
      background-position: center center;
    }
    .lp-editor-stage-scaler {
      transform-origin: center center;
      transition: transform 0.2s ease;
      position: relative;
    }
    .lp-editor-page-counter {
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
      color: #888;
      font-size: 13px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .lp-editor-thumbnails {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .lp-thumbnail {
      width: 100%;
      aspect-ratio: 16 / 9;
      border: 2px solid transparent;
      border-radius: 6px;
      background: #2a2a2a;
      cursor: grab;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      text-align: left;
      color: #bbb;
      transition: border-color 0.15s, background 0.15s, opacity 0.15s;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      outline: none;
      content-visibility: auto;
      contain-intrinsic-size: auto 180px;
    }
    .lp-thumbnail:hover {
      background: #333;
    }
    .lp-thumbnail:focus-visible {
      border-color: #5b8cff;
    }
    .lp-thumbnail.active {
      border-color: #3b82f6;
      background: #26354f;
      color: #fff;
    }
    .lp-thumbnail.dragging,
    .lp-thumbnail:active {
      cursor: grabbing;
    }
    .lp-thumbnail-index {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }
    .lp-thumbnail-title {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .lp-thumbnail-layout {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
    .lp-thumbnail-drag-handle {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 20px;
      height: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      opacity: 0.45;
      z-index: 4;
      color: #888;
      transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;
      line-height: 1;
      font-size: 10px;
      user-select: none;
      -webkit-user-select: none;
      pointer-events: none;
      border-radius: 4px;
      padding: 2px;
    }
    .lp-thumbnail:hover .lp-thumbnail-drag-handle,
    .lp-thumbnail-drag-handle:hover {
      opacity: 0.9;
      color: #bbb;
      background: rgba(255, 255, 255, 0.08);
    }
    .lp-thumbnail.dragging .lp-thumbnail-drag-handle {
      opacity: 1;
      color: #fff;
      background: rgba(255, 255, 255, 0.15);
    }
    .lp-thumbnail.dragging {
      opacity: 0.45;
      border: 2px dashed #3b82f6;
      background: #1f2937;
    }
    .lp-thumbnail.drag-over {
      border-color: #10b981;
      background: #1f3d32;
    }
    .lp-thumbnail-drop-indicator {
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      background: #3b82f6;
      border-radius: 2px;
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.1s ease;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
    }
    .lp-thumbnail-drop-indicator.visible {
      opacity: 1;
    }
    .lp-editor-thumbnails {
      position: relative;
    }
    .lp-delete-confirm-toast {
      position: fixed;
      z-index: 1000;
      width: 180px;
      background: #262626;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: opacity 0.15s ease, transform 0.15s ease;
      margin: 0;
    }
    .lp-delete-confirm-toast[hidden] {
      display: none;
    }
    .lp-delete-confirm-text {
      font-size: 13px;
      color: #e5e5e5;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    .lp-delete-confirm-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .lp-delete-confirm-cancel,
    .lp-delete-confirm-confirm {
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid #555;
      background: #333;
      color: #e5e5e5;
      transition: background 0.15s, border-color 0.15s;
    }
    .lp-delete-confirm-cancel:hover {
      background: #3a3a3a;
      border-color: #666;
    }
    .lp-delete-confirm-confirm {
      background: #dc2626;
      border-color: #dc2626;
      color: #fff;
    }
    .lp-delete-confirm-confirm:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }
    .lp-property-header {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #fff;
    }
    .lp-property-empty {
      color: #888;
      font-size: 13px;
      line-height: 1.5;
    }
    .lp-property-group {
      margin-bottom: 16px;
    }
    .lp-property-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 6px;
      display: block;
    }
    .lp-property-input,
    .lp-property-textarea {
      width: 100%;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 4px;
      color: #e5e5e5;
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
    }
    .lp-property-input:focus,
    .lp-property-textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }
    .lp-property-textarea {
      min-height: 120px;
      resize: vertical;
    }
    .lp-selected {
      outline: 2px solid var(--lp-accent, #3b82f6) !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--lp-accent, #3b82f6) 20%, transparent);
    }
    .lp-editor-root .lp-nav,
    .lp-editor-root .lp-page-counter,
    .lp-editor-root .lp-hint {
      display: none !important;
    }
    .lp-thumbnail {
      position: relative;
      overflow: hidden;
      padding: 0;
      justify-content: flex-end;
      background: var(--lp-bg, #222);
      content-visibility: auto;
      contain-intrinsic-size: auto 120px;
    }
    .lp-thumbnail-render {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .lp-thumbnail-scaler {
      position: relative;
      pointer-events: none;
    }
    .lp-thumbnail-scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%);
      pointer-events: none;
    }
    .lp-thumbnail-content {
      position: relative;
      z-index: 2;
      padding: 10px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      pointer-events: none;
    }
    .lp-thumbnail-index {
      font-size: 11px;
      color: rgba(255,255,255,0.75);
      margin-bottom: 4px;
    }
    .lp-thumbnail-title {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .lp-thumbnail-layout {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      margin-top: 4px;
    }
    .lp-thumbnail.active {
      border-color: #3b82f6;
      background: #26354f;
    }
    .lp-thumbnail.active .lp-thumbnail-scrim {
      background: linear-gradient(to bottom, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.45) 100%);
    }
    .lp-thumbnail-delete {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 3;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.85);
      color: #fff;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s, background 0.15s;
      pointer-events: auto;
    }
    .lp-thumbnail:hover .lp-thumbnail-delete,
    .lp-thumbnail:focus-within .lp-thumbnail-delete {
      opacity: 1;
    }
    .lp-thumbnail-delete:hover {
      background: rgba(220, 38, 38, 1);
    }
    .lp-editor-zoom-bar {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      color: #bbb;
    }
    .lp-editor-zoom-bar button {
      background: #2a2a2a;
      border: 1px solid #444;
      color: #e5e5e5;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
    }
    .lp-editor-zoom-bar button:hover {
      background: #333;
    }
    .lp-editor-zoom-bar input[type="range"] {
      width: 100px;
    }
    .lp-property-section {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #333;
    }
    .lp-property-section:last-child {
      border-bottom: none;
    }
    .lp-property-section-title {
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .lp-property-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .lp-property-section-header .lp-property-section-title {
      margin-bottom: 0;
    }
    .lp-property-help {
      font-size: 12px;
      color: #888;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .lp-property-field {
      margin-bottom: 12px;
    }
    .lp-property-field:last-child {
      margin-bottom: 0;
    }
    .lp-property-input,
    .lp-property-textarea {
      width: 100%;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
    }
    .lp-property-input:focus,
    .lp-property-textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }
    .lp-property-textarea {
      min-height: 80px;
      resize: vertical;
    }
    .lp-property-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .lp-property-toggle-track {
      width: 46px;
      height: 24px;
      background: #444;
      border-radius: 12px;
      position: relative;
      transition: background 0.25s ease;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .lp-property-toggle input:checked + .lp-property-toggle-track {
      background: #34d399;
    }
    .lp-property-toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .lp-property-toggle input:checked + .lp-property-toggle-track .lp-property-toggle-thumb {
      transform: translateX(22px);
    }
    .lp-property-toggle input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .lp-property-segmented {
      display: flex;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      overflow: hidden;
    }
    .lp-property-segmented button {
      flex: 1;
      background: transparent;
      border: none;
      border-right: 1px solid #444;
      color: #bbb;
      padding: 6px 0;
      font-size: 12px;
      cursor: pointer;
    }
    .lp-property-segmented button:last-child {
      border-right: none;
    }
    .lp-property-segmented button.active {
      background: #3b82f6;
      color: #fff;
    }
    .lp-property-color-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .lp-property-color-btn {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
    }
    .lp-property-color-btn.active {
      border-color: #fff;
    }
    .lp-property-range {
      width: 100%;
    }
    .lp-property-slider-wrap {
      margin-bottom: 16px;
    }
    .lp-property-slider-label {
      font-size: 12px;
      color: #bbb;
    }
    .lp-property-slider-value {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      min-width: 26px;
      text-align: center;
      padding: 2px 8px;
      background: linear-gradient(135deg, rgba(91,155,213,0.9), rgba(139,92,246,0.9));
      border-radius: 999px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }
    .lp-property-slider-ruler {
      position: relative;
      padding: 18px 18px 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .lp-property-slider-ruler:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.14);
    }
    .lp-property-slider-ruler::before {
      content: '';
      position: absolute;
      top: 22px;
      left: 18px;
      right: 18px;
      height: 2px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 1px;
      pointer-events: none;
    }
    .lp-property-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      outline: none;
      display: block;
      margin: 0;
      cursor: pointer;
      transition: box-shadow 0.2s ease;
    }
    .lp-property-slider:hover {
      box-shadow: 0 0 0 4px rgba(91, 155, 213, 0.12);
    }
    .lp-property-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      background: #fff;
      border-radius: 50%;
      cursor: grab;
      border: 4px solid #5b9bd5;
      box-shadow: 0 0 0 4px rgba(91, 155, 213, 0.2), 0 4px 12px rgba(0, 0, 0, 0.35);
      margin-top: -8px;
      transition: transform 0.15s ease, box-shadow 0.2s ease;
    }
    .lp-property-slider::-webkit-slider-thumb:hover {
      transform: scale(1.12);
      box-shadow: 0 0 0 6px rgba(91, 155, 213, 0.28), 0 6px 16px rgba(0, 0, 0, 0.4);
    }
    .lp-property-slider:active::-webkit-slider-thumb {
      cursor: grabbing;
      transform: scale(1.05);
      border-color: #8b5cf6;
    }
    .lp-property-slider::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 4px;
    }
    .lp-property-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      background: #fff;
      border-radius: 50%;
      cursor: grab;
      border: 4px solid #5b9bd5;
      box-shadow: 0 0 0 4px rgba(91, 155, 213, 0.2), 0 4px 12px rgba(0, 0, 0, 0.35);
      transition: transform 0.15s ease, box-shadow 0.2s ease;
    }
    .lp-property-slider::-moz-range-thumb:hover {
      transform: scale(1.12);
      box-shadow: 0 0 0 6px rgba(91, 155, 213, 0.28), 0 6px 16px rgba(0, 0, 0, 0.4);
    }
    .lp-property-slider:active::-moz-range-thumb {
      cursor: grabbing;
      transform: scale(1.05);
      border-color: #8b5cf6;
    }
    .lp-property-slider::-moz-range-track {
      height: 8px;
      border-radius: 4px;
    }
    .lp-property-slider-scale {
      position: relative;
      height: 34px;
      margin-top: 10px;
      margin-left: 0;
      margin-right: 0;
    }
    .lp-property-slider-tick {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 0 6px;
      transition: transform 0.15s ease;
      min-width: 20px;
    }
    .lp-property-slider-tick:hover {
      transform: translateX(-50%) scale(1.15);
    }
    .lp-property-slider-tick::before {
      content: '';
      width: 2px;
      height: 12px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 1px;
      transition: background 0.2s ease, height 0.15s ease;
    }
    .lp-property-slider-tick:hover::before {
      background: #fff;
      height: 16px;
    }
    .lp-property-slider-tick-label {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1;
      transition: color 0.2s ease;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
    .lp-property-slider-tick:hover .lp-property-slider-tick-label {
      color: #fff;
    }
    .lp-property-array {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .lp-property-array-item {
      background: #252525;
      border-bottom: 1px solid #383838;
      border-radius: 8px;
      padding: 10px 10px 20px 10px;
    }
    .lp-property-array-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--lp-font-mono, ui-monospace, monospace);
      font-size: 11px;
      font-weight: 700;
      color: var(--lp-accent, #888);
      margin-bottom: 8px;
      letter-spacing: 0.04em;
    }
    .lp-property-array-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #aaa;
      line-height: 1;
    }
    .lp-property-array-header .lp-property-btn-sm {
      width: auto;
      margin-left: auto;
    }
    .lp-property-btn {
      width: 100%;
      padding: 8px;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 13px;
      cursor: pointer;
    }
    .lp-property-btn:hover {
      background: #333;
    }
    .lp-property-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .lp-property-btn-primary {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }
    .lp-property-btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }
    .lp-property-btn-danger {
      border-color: transparent;
      background: transparent;
      color: #ef4444;
      width: 22px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 16px;
      line-height: 1;
    }
    .lp-property-btn-danger:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.12);
    }
    .lp-property-btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }
    .lp-property-empty-state {
      color: #888;
      font-size: 13px;
      line-height: 1.5;
      text-align: center;
      padding: 20px 0;
    }
    /* 可编辑图片占位区：固定区域、点击直接上传、深色主题可见 */
    .lp-editable-image-placeholder {
      width: 100%;
      height: 100%;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: color-mix(in srgb, var(--lp-ink, #111) 6%, transparent);
      border: 2px dashed color-mix(in srgb, var(--lp-ink, #111) 22%, transparent);
      border-radius: 12px;
      color: var(--lp-ink3, #6b7280);
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      user-select: none;
    }
    .lp-editable-image-placeholder:hover {
      background: color-mix(in srgb, var(--lp-accent, #3b82f6) 10%, transparent);
      border-color: var(--lp-accent, #3b82f6);
      color: var(--lp-accent, #3b82f6);
    }
    .lp-editable-image-placeholder-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--lp-ink, #111) 10%, transparent);
      font-size: 20px;
      line-height: 1;
      transition: background 0.15s, transform 0.15s;
    }
    .lp-editable-image-placeholder:hover .lp-editable-image-placeholder-icon {
      background: color-mix(in srgb, var(--lp-accent, #3b82f6) 16%, transparent);
      transform: scale(1.08);
    }
    .lp-editable-image-placeholder-text {
      font-size: 13px;
      font-weight: 500;
    }
    /* 画布空编辑元素占位提示：新增数组项或清空标题时仍可定位和编辑 */
    [data-lp-editable="true"]:empty::before {
      content: '点击编辑';
      opacity: 0.35;
      pointer-events: none;
    }
    [data-lp-editable="true"]:empty {
      min-width: 3em;
      outline: 1px dashed color-mix(in srgb, var(--lp-accent, #3b82f6) 40%, transparent);
      outline-offset: 2px;
      border-radius: 2px;
    }
    @media print {
      html, body {
        display: block;
        background: #fff;
      }
      .lp-editor-bar,
      .lp-nav,
      .lp-page-counter,
      .lp-hint,
      .lp-editor-left-panel,
      .lp-editor-right-panel,
      .lp-editor-zoom-bar,
      .lp-editor-stage-scaler > .lp-editor-page-counter {
        display: none !important;
      }
      .lp-editor-root,
      .lp-editor-workspace,
      .lp-editor-stage {
        display: block !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
      }
      .lp-editor-stage-scaler {
        transform: none !important;
      }
      .lp-deck {
        box-shadow: none;
        border-radius: 0;
        width: 100% !important;
        height: auto !important;
        overflow: visible;
      }
      .lp-slide-wrapper {
        position: relative;
        transform: none !important;
        opacity: 1 !important;
        width: 100% !important;
        height: ${height}px !important;
        page-break-after: always;
        break-after: page;
        z-index: auto !important;
      }
      .lp-slide-wrapper:last-child {
        page-break-after: auto;
        break-after: auto;
      }
    }

    /* ---- 编辑器演示模式 ---- */
    .lp-editor-presentation-mode .lp-editor-bar,
    .lp-editor-presentation-mode .lp-editor-left-panel,
    .lp-editor-presentation-mode .lp-editor-right-panel,
    .lp-editor-presentation-mode .lp-editor-zoom-bar,
    .lp-editor-presentation-mode .lp-editor-page-counter {
      display: none !important;
    }
    .lp-editor-presentation-mode .lp-editor-workspace {
      display: block;
    }
    .lp-editor-presentation-mode .lp-editor-stage {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .lp-editor-presentation-mode .lp-editor-stage-scaler {
      transform: scale(var(--lp-presentation-scale, 1)) !important;
      width: ${width}px !important;
      height: ${height}px !important;
      max-width: none;
      max-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lp-editor-presentation-mode .lp-deck {
      width: ${width}px !important;
      height: ${height}px !important;
      border-radius: 0;
    }
    .lp-editor-root:fullscreen {
      background: #000;
    }
    .lp-editor-root:-webkit-full-screen {
      background: #000;
    }
    .lp-editor-presentation-exit {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1001;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 200ms ease;
    }
    .lp-editor-presentation-mode:hover .lp-editor-presentation-exit,
    .lp-editor-presentation-exit:focus {
      opacity: 1;
    }

    /* 添加幻灯片弹窗 */
    .lp-add-slide-modal {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lp-add-slide-modal[hidden] {
      display: none;
    }
    .lp-add-slide-modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(4px);
    }
    .lp-add-slide-modal-content {
      position: relative;
      width: min(1080px, calc(100vw - 48px));
      max-height: calc(100vh - 64px);
      background: #1e1e1e;
      border-radius: 16px;
      padding: 28px 32px 32px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.48);
      display: flex;
      flex-direction: column;
      color: #fff;
    }
    .lp-add-slide-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms ease, color 150ms ease;
    }
    .lp-add-slide-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .lp-add-slide-modal-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 24px;
      color: #fff;
    }
    .lp-add-slide-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 14px;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 4px;
      margin-bottom: 28px;
    }
    .lp-add-slide-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 8px;
      background: #2a2a2a;
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease, transform 120ms ease;
    }
    .lp-add-slide-option:hover {
      background: #333;
    }
    .lp-add-slide-option.selected {
      border-color: #34d399;
      background: #243a30;
    }
    .lp-add-slide-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #3f3f3f;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.75);
      transition: background 150ms ease, color 150ms ease;
    }
    .lp-add-slide-option:hover .lp-add-slide-icon {
      background: #4a4a4a;
      color: #fff;
    }
    .lp-add-slide-option.selected .lp-add-slide-icon {
      background: #34d399;
      color: #1e1e1e;
    }
    .lp-add-slide-icon svg {
      width: 22px;
      height: 22px;
    }
    .lp-add-slide-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .lp-add-slide-option.selected .lp-add-slide-label {
      color: #34d399;
    }
    .lp-add-slide-modal-btn {
      align-self: center;
      padding: 12px 32px;
      border-radius: 999px;
      border: none;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      background: #34d399;
      color: #111;
      transition: background 150ms ease, opacity 150ms ease, transform 120ms ease;
    }
    .lp-add-slide-modal-btn:hover:not(:disabled) {
      background: #2cb886;
    }
    .lp-add-slide-modal-btn:disabled {
      background: #4a4a4a;
      color: rgba(255, 255, 255, 0.4);
      cursor: not-allowed;
    }
    @media (max-width: 860px) {
      .lp-add-slide-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    @media (max-width: 560px) {
      .lp-add-slide-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      .lp-add-slide-modal-content {
        padding: 24px 20px 28px;
      }
    }

    /* jQuery 自定义滚动条样式（基于 WebKit + Firefox 标准属性） */
    .lp-editor-left-panel.lp-custom-scrollbar::-webkit-scrollbar,
    .lp-editor-right-panel.lp-custom-scrollbar::-webkit-scrollbar,
    .lp-add-slide-grid.lp-custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .lp-editor-left-panel.lp-custom-scrollbar::-webkit-scrollbar-track,
    .lp-editor-right-panel.lp-custom-scrollbar::-webkit-scrollbar-track,
    .lp-add-slide-grid.lp-custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .lp-editor-left-panel.lp-custom-scrollbar::-webkit-scrollbar-thumb,
    .lp-editor-right-panel.lp-custom-scrollbar::-webkit-scrollbar-thumb,
    .lp-add-slide-grid.lp-custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.35);
      border-radius: 4px;
    }
    .lp-editor-left-panel.lp-custom-scrollbar::-webkit-scrollbar-thumb:hover,
    .lp-editor-right-panel.lp-custom-scrollbar::-webkit-scrollbar-thumb:hover,
    .lp-add-slide-grid.lp-custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.55);
    }
    .lp-editor-left-panel.lp-custom-scrollbar,
    .lp-editor-right-panel.lp-custom-scrollbar,
    .lp-add-slide-grid.lp-custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.35) rgba(255, 255, 255, 0.1);
    }

    .lp-filmstrip-v1-track.lp-custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .lp-filmstrip-v1-track.lp-custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.08);
      border-radius: 4px;
    }
    .lp-filmstrip-v1-track.lp-custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.35);
      border-radius: 4px;
    }
    .lp-filmstrip-v1-track.lp-custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.55);
    }
    .lp-filmstrip-v1-track.lp-custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.35) rgba(0, 0, 0, 0.08);
    }
  </style>
</head>
<body class="${bodyClass}">
${bodyMarkup}
</body>
</html>`;

  return {
    html,
    assets: [
      './assets/fonts/fonts.css',
      `./assets/${theme}.css`,
      './assets/jquery.min.js',
    ],
  };
}

function buildNavMarkup(slideCount: number): string {
  if (slideCount <= 1) return '';
  const dots = Array.from({ length: slideCount }, (_, i) =>
    `<span class="lp-nav-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
  ).join('');

  return `<div class="lp-nav" aria-label="幻灯片导航">
  <button class="lp-nav-btn" id="lp-prev" aria-label="上一页">‹</button>
  <div class="lp-nav-dots">${dots}</div>
  <button class="lp-nav-btn" id="lp-next" aria-label="下一页">›</button>
</div>
<div class="lp-page-counter"><span id="lp-current">1</span> / ${slideCount}</div>
<div class="lp-hint">← → 翻页</div>`;
}

function buildEditorBarMarkup(goal: DeckGoal): string {
  const theme = goal.theme || 'theme01';
  const isTheme02 = theme === 'theme02';
  const isTheme03 = theme === 'theme03';
  const isTheme04 = theme === 'theme04';
  const isTheme05 = theme === 'theme05';
  const isTheme06 = theme === 'theme06';
  const colorScheme = goal.colorScheme || (isTheme02 || isTheme03 ? 'scheme-a' : isTheme04 ? 'green' : isTheme05 ? 'coral' : isTheme06 ? 'volt' : 'light');
  const appearance = goal.appearance || ((isTheme03 || isTheme04 || isTheme05 || isTheme06) ? 'dark' : undefined);

  let appearanceButtons = '';
  if (isTheme02) {
    appearanceButtons = `<button class="lp-appearance-btn ${colorScheme === 'scheme-a' ? 'lp-appearance-active' : ''}" data-appearance="scheme-a" title="电光青绿" aria-pressed="${colorScheme === 'scheme-a'}">
      电光青绿
    </button>
    <button class="lp-appearance-btn ${colorScheme === 'scheme-b' ? 'lp-appearance-active' : ''}" data-appearance="scheme-b" title="靛蓝珊瑚" aria-pressed="${colorScheme === 'scheme-b'}">
      靛蓝珊瑚
    </button>`;
  } else if (isTheme03) {
    appearanceButtons = `<button class="lp-appearance-btn ${appearance === 'light' ? 'lp-appearance-active' : ''}" data-appearance="light" title="浅色" aria-pressed="${appearance === 'light'}">
      浅色
    </button>
    <button class="lp-appearance-btn ${appearance === 'dark' ? 'lp-appearance-active' : ''}" data-appearance="dark" title="深色" aria-pressed="${appearance === 'dark'}">
      深色
    </button>`;
  } else if (isTheme04) {
    appearanceButtons = `<button class="lp-appearance-btn ${colorScheme === 'green' ? 'lp-appearance-active' : ''}" data-theme="green" title="糖果绿" aria-pressed="${colorScheme === 'green'}">
      糖果绿
    </button>
    <button class="lp-appearance-btn ${colorScheme === 'yellow' ? 'lp-appearance-active' : ''}" data-theme="yellow" title="柠檬黄" aria-pressed="${colorScheme === 'yellow'}">
      柠檬黄
    </button>
    <button class="lp-appearance-btn ${colorScheme === 'blue' ? 'lp-appearance-active' : ''}" data-theme="blue" title="冰晶蓝" aria-pressed="${colorScheme === 'blue'}">
      冰晶蓝
    </button>
    <button class="lp-appearance-btn ${colorScheme === 'pink' ? 'lp-appearance-active' : ''}" data-theme="pink" title="糖果粉" aria-pressed="${colorScheme === 'pink'}">
      糖果粉
    </button>`;
  } else if (isTheme05) {
    const scheme = String(colorScheme);
    appearanceButtons = `<button class="lp-appearance-btn ${scheme === 'coral' ? 'lp-appearance-active' : ''}" data-theme="coral" title="珊瑚红" aria-pressed="${scheme === 'coral'}">
      珊瑚红
    </button>
    <button class="lp-appearance-btn ${scheme === 'amber' ? 'lp-appearance-active' : ''}" data-theme="amber" title="琥珀黄" aria-pressed="${scheme === 'amber'}">
      琥珀黄
    </button>
    <button class="lp-appearance-btn ${scheme === 'teal' ? 'lp-appearance-active' : ''}" data-theme="teal" title="青绿" aria-pressed="${scheme === 'teal'}">
      青绿
    </button>
    <button class="lp-appearance-btn ${scheme === 'indigo' ? 'lp-appearance-active' : ''}" data-theme="indigo" title="靛蓝" aria-pressed="${scheme === 'indigo'}">
      靛蓝
    </button>
    <button class="lp-appearance-btn ${scheme === 'violet' ? 'lp-appearance-active' : ''}" data-theme="violet" title="紫罗兰" aria-pressed="${scheme === 'violet'}">
      紫罗兰
    </button>`;
  } else if (isTheme06) {
    const scheme = String(colorScheme);
    appearanceButtons = `<button class="lp-appearance-btn ${scheme === 'volt' ? 'lp-appearance-active' : ''}" data-theme="volt" title="电光青柠" aria-pressed="${scheme === 'volt'}">
      电光青柠
    </button>
    <button class="lp-appearance-btn ${scheme === 'magma' ? 'lp-appearance-active' : ''}" data-theme="magma" title="熔岩珊瑚" aria-pressed="${scheme === 'magma'}">
      熔岩珊瑚
    </button>
    <button class="lp-appearance-btn ${scheme === 'nebula' ? 'lp-appearance-active' : ''}" data-theme="nebula" title="星云蓝紫" aria-pressed="${scheme === 'nebula'}">
      星云蓝紫
    </button>
    <button class="lp-appearance-btn ${scheme === 'nova' ? 'lp-appearance-active' : ''}" data-theme="nova" title="新星金黄" aria-pressed="${scheme === 'nova'}">
      新星金黄
    </button>`;
  } else {
    appearanceButtons = `<button class="lp-appearance-btn ${colorScheme === 'light' ? 'lp-appearance-active' : ''}" data-appearance="light" title="浅色" aria-pressed="${colorScheme === 'light'}">
      浅色
    </button>
    <button class="lp-appearance-btn ${colorScheme === 'dark' ? 'lp-appearance-active' : ''}" data-appearance="dark" title="深色" aria-pressed="${colorScheme === 'dark'}">
      深色
    </button>`;
  }

  let lightDarkButtons = '';
  if (isTheme04 || isTheme05 || isTheme06) {
    lightDarkButtons = `<div class="lp-appearance-switcher lp-appearance-switcher--lightdark" role="group" aria-label="深浅模式">
      <button class="lp-appearance-btn ${appearance === 'light' ? 'lp-appearance-active' : ''}" data-appearance="light" title="浅色" aria-pressed="${appearance === 'light'}">
        浅色
      </button>
      <button class="lp-appearance-btn ${appearance === 'dark' ? 'lp-appearance-active' : ''}" data-appearance="dark" title="深色" aria-pressed="${appearance === 'dark'}">
        深色
      </button>
    </div>`;
  }

  return `<div class="lp-editor-bar">
  <span class="lp-editor-title">lemonPPT 编辑器</span>
  <div class="lp-appearance-switcher" role="group" aria-label="外观">
    ${appearanceButtons}
  </div>
  ${lightDarkButtons}
  <button class="lp-editor-btn" id="lp-add-slide" title="添加新幻灯片">＋ 添加幻灯片</button>
  <button class="lp-editor-btn lp-editor-btn-primary" id="lp-play" title="播放演示">▶ 播放</button>
  <button class="lp-editor-btn" id="lp-undo" title="撤销 (Ctrl+Z)">↩ 撤销</button>
  <button class="lp-editor-btn" id="lp-redo" title="重做 (Ctrl+Y)">↪ 重做</button>
  <div class="lp-editor-export" id="lp-editor-export">
    <button class="lp-editor-btn lp-editor-export-toggle" id="lp-export-toggle" type="button" aria-haspopup="true" aria-expanded="false">
      <span>⬇</span> 导出 <span class="lp-editor-caret">⌄</span>
    </button>
    <div class="lp-editor-export-menu" id="lp-export-menu" hidden>
      <button class="lp-editor-export-item" id="lp-export-html" type="button">
        <span class="lp-editor-export-icon">&lt;/&gt;</span>
        <span class="lp-editor-export-label">HTML</span>
        <span class="lp-editor-export-tag">离线包</span>
      </button>
      <button class="lp-editor-export-item" id="lp-export-pdf" type="button">
        <span class="lp-editor-export-icon">🗎</span>
        <span class="lp-editor-export-label">PDF</span>
        <span class="lp-editor-export-tag">下载</span>
      </button>
      <button class="lp-editor-export-item" id="lp-export-pptx" type="button">
        <span class="lp-editor-export-icon">🖵</span>
        <span class="lp-editor-export-label">PPTX</span>
        <span class="lp-editor-export-tag">可编辑</span>
      </button>
    </div>
  </div>
</div>`;
}

const LAYOUT_ICONS: Record<string, string> = {
  cover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  tableOfContents: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
  metric: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10c0-3 2-5 5-5m-5 5v5h5m6-5c0-3 2-5 5-5m-5 5v5h5"/></svg>',
  closing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M12 5l7 7-7 7"/></svg>',
  feature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>',
  process: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  chapter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 13h6"/></svg>',
  comparison: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h7v12H4zM13 6h7v12h-7z"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v16h16"/></svg>',
  timeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M4 12h4m8 0h4"/></svg>',
  testimonial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>',
  roadmap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19v-6m5 6V9m5 10V5m5 14v-8"/></svg>',
  bento: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="18" height="8" rx="1"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-5 6-3-3-5 5"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 10h18M3 14h18M3 18h18"/></svg>',
  tags: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h10M4 17h14"/></svg>',
  filmstrip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6v12M18 6v12"/></svg>',
  faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-1a3 3 0 0 1 3-3h0a3 3 0 0 0 3-3h0a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v1"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  pricing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
  partners: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="17" cy="7" r="4"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-5 6-3-3-5 5"/></svg>',
  swot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h8v8H4zM12 4h8v8h-8zM4 12h8v8H4zM12 12h8v8h-8z"/></svg>',
  pest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4zM4 9h16M4 15h16M9 4v16"/></svg>',
};

function getLayoutIcon(role: string): string {
  return LAYOUT_ICONS[role] ?? LAYOUT_ICONS.content;
}

function buildAddSlideModalMarkup(goal: DeckGoal): string {
  const theme = goal.theme || 'theme01';
  const layouts = listLayouts()
    .filter((l) => l.theme === theme)
    .sort((a, b) => a.role.localeCompare(b.role) || a.displayName.localeCompare(b.displayName));

  const options = layouts.map((layout) => {
    const icon = getLayoutIcon(layout.role);
    const label = (layout.displayName || layout.id).replace(/^Theme\s+\d+\s*/, '');
    return `<div class="lp-add-slide-option" data-layout="${escapeHtml(layout.id)}" data-role="${escapeHtml(layout.role)}">
  <div class="lp-add-slide-icon">${icon}</div>
  <span class="lp-add-slide-label">${escapeHtml(label)}</span>
</div>`;
  }).join('\n');

  return `<div id="lp-add-slide-modal" class="lp-add-slide-modal" hidden>
  <div class="lp-add-slide-modal-overlay" data-close-modal></div>
  <div class="lp-add-slide-modal-content">
    <button class="lp-add-slide-modal-close" data-close-modal aria-label="关闭">&times;</button>
    <h3 class="lp-add-slide-modal-title">请选择你想添加的幻灯片版式</h3>
    <div class="lp-add-slide-grid" data-scrollbar>
      ${options}
    </div>
    <button class="lp-add-slide-modal-btn" id="lp-add-slide-confirm" disabled>添加幻灯片</button>
  </div>
</div>`;
}

function buildLeftPanelMarkup(
  goal: DeckGoal,
  slideHtmls: string[],
  slideWidth: number,
  slideHeight: number,
): string {
  const thumbInnerWidth = 156;
  const scale = thumbInnerWidth / slideWidth;

  const showDragHandle = goal.slides.length > 1;
  const dragHandleHtml = showDragHandle
    ? '<span class="lp-thumbnail-drag-handle" data-lp-action="drag-handle" aria-hidden="true">' +
        '<svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">' +
          '<circle cx="2.5" cy="2.5" r="1.5"/>' +
          '<circle cx="9.5" cy="2.5" r="1.5"/>' +
          '<circle cx="2.5" cy="8" r="1.5"/>' +
          '<circle cx="9.5" cy="8" r="1.5"/>' +
          '<circle cx="2.5" cy="13.5" r="1.5"/>' +
          '<circle cx="9.5" cy="13.5" r="1.5"/>' +
        '</svg>' +
      '</span>'
    : '';

  const buttons = goal.slides.map((slide, index) => {
    const label = getSlideLabel(slide);
    const activeClass = index === 0 ? 'active' : '';
    const slideHtml = slideHtmls[index] || '';
    const draggableAttr = goal.slides.length > 1 ? 'draggable="true"' : '';
    return `<div class="lp-thumbnail ${activeClass}" data-index="${index}" role="button" tabindex="0" ${draggableAttr} aria-label="幻灯片 ${index + 1}，拖动可调整顺序">
  ${dragHandleHtml}
  <div class="lp-thumbnail-render">
    <div class="lp-thumbnail-scaler" style="width:${slideWidth}px;height:${slideHeight}px;transform:scale(${scale});transform-origin:top left;">
      ${slideHtml}
    </div>
  </div>
  <div class="lp-thumbnail-scrim"></div>
  <div class="lp-thumbnail-content">
    <div class="lp-thumbnail-index">${index + 1} / ${goal.slides.length}</div>
    <div class="lp-thumbnail-title">${escapeHtml(label)}</div>
    <div class="lp-thumbnail-layout">${escapeHtml(slide.layout)}</div>
  </div>
  <span class="lp-thumbnail-delete" data-lp-action="delete-slide" data-index="${index}" title="删除幻灯片" aria-label="删除幻灯片">×</span>
</div>`;
  }).join('');

  return `<aside class="lp-editor-left-panel" data-scrollbar aria-label="幻灯片缩略图">
  <div class="lp-delete-confirm-toast" id="lp-delete-confirm-toast" hidden>
    <div class="lp-delete-confirm-text" id="lp-delete-confirm-text">确定删除该幻灯片？</div>
    <div class="lp-delete-confirm-actions">
      <button class="lp-delete-confirm-cancel" id="lp-delete-confirm-cancel" type="button">取消</button>
      <button class="lp-delete-confirm-confirm" id="lp-delete-confirm-confirm" type="button">删除</button>
    </div>
  </div>
  <div class="lp-editor-thumbnails">
    ${buttons}
  </div>
</aside>`;
}

function getSlideLabel(slide: DeckGoal['slides'][number]): string {
  const props = slide.props as Record<string, unknown> | undefined;
  if (!props) return slide.layout;
  const candidates = [
    props.title,
    props.name,
    props.kicker,
    props.quote,
    props.heading,
    (props.items && Array.isArray(props.items) ? props.items[0] : undefined),
    (props.features && Array.isArray(props.features) ? (props.features[0] as { title?: string })?.title : undefined),
    (props.members && Array.isArray(props.members) ? (props.members[0] as { name?: string })?.name : undefined),
  ];
  for (const value of candidates) {
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return slide.layout;
}

function buildRightPanelMarkup(): string {
  return `<aside class="lp-editor-right-panel" data-scrollbar aria-label="属性面板">
  <div class="lp-property-header">属性</div>
  <div id="lp-property-content">
    <div class="lp-property-empty">点击幻灯片中的文本或图片以编辑属性</div>
  </div>
</aside>`;
}

function buildScriptMarkup(): string {
  return `<script>
(function () {
  const slides = document.querySelectorAll('.lp-slide-wrapper');
  const dots = document.querySelectorAll('.lp-nav-dot');
  const prevBtn = document.getElementById('lp-prev');
  const nextBtn = document.getElementById('lp-next');
  const currentLabel = document.getElementById('lp-current');
  const deck = document.querySelector('.lp-deck');
  let current = 0;
  let isTransitioning = false;
  let cleanupTimer = null;

  function updateUI() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === current);
    });
    if (currentLabel) currentLabel.textContent = String(current + 1);
    if (prevBtn) prevBtn.disabled = current === 0 || isTransitioning;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1 || isTransitioning;
  }

  function resetTransitionState() {
    slides.forEach((slide) => slide.classList.remove('enter', 'leave'));
    if (deck) {
      deck.setAttribute('data-lp-transition', 'none');
      deck.removeAttribute('data-lp-direction');
    }
    isTransitioning = false;
    updateClasses();
  }

  function updateClasses() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'enter', 'leave');
      if (index === current) slide.classList.add('active');
      else if (index < current) slide.classList.add('prev');
    });
    updateUI();
  }

  function goTo(index) {
    if (index === current || index < 0 || index >= slides.length || isTransitioning) return;
    const leaving = slides[current];
    const entering = slides[index];
    const transition = entering.dataset.lpTransition || 'none';
    const direction = index > current ? 'next' : 'prev';

    if (transition === 'none') {
      current = index;
      if (deck) {
        deck.setAttribute('data-lp-transition', 'none');
        deck.removeAttribute('data-lp-direction');
      }
      leaving.classList.remove('active');
      entering.classList.add('active');
      updateClasses();
      return;
    }

    isTransitioning = true;
    current = index;
    updateUI();

    if (deck) {
      deck.setAttribute('data-lp-transition', transition);
      deck.setAttribute('data-lp-direction', direction);
    }

    leaving.classList.add('leave');
    entering.classList.add('enter');
    // 先禁用 transition，让 leave/enter 的初始状态直接落位，
    // 避免从上一状态的 translateX 插值；随后恢复 transition 再切换 active。
    leaving.style.transition = 'none';
    entering.style.transition = 'none';
    void entering.offsetWidth;
    leaving.style.transition = '';
    entering.style.transition = '';
    leaving.classList.remove('active');
    entering.classList.add('active');

    function finish() {
      entering.removeEventListener('transitionend', finish);
      clearTimeout(cleanupTimer);
      resetTransitionState();
    }
    entering.addEventListener('transitionend', finish);
    cleanupTimer = setTimeout(finish, 600);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });
  document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  updateClasses();
})();
</script>
<script src="./assets/client-render.js"></script>
<script src="./assets/theme-echarts.js"></script>
<script>
(function () {
  if (typeof window.__lemonPPT_initECharts === 'function') {
    window.__lemonPPT_initECharts();
  }
})();
</script>`;
}

function buildEditorScriptMarkup(goal: DeckGoal): string {
  const goalJson = JSON.stringify(goal, null, 2).replace(/</g, '\\u003c');
  const schemas: Record<string, unknown> = {};
  listLayouts().forEach((layout) => {
    const schema = getLayoutSchema(layout.id);
    if (schema) {
      schemas[layout.id] = schema;
    }
  });
  const schemasJson = JSON.stringify(schemas).replace(/</g, '\\u003c');
  return `<script src="./assets/client-render.js"></script>
<script src="./assets/theme-echarts.js"></script>
<script>
window.__lemonPPT_goal = ${goalJson};
window.__lemonPPT_layoutSchemas = ${schemasJson};
${editorScript}
</script>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
