// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, EditorData, RenderOutput } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import {
  renderSlide,
  generateThemeCssVariablesWithDark,
  generateTheme02CssVariablesWithSchemes,
  generateTheme03CssVariablesWithSchemes,
  generateTheme04CssVariablesWithTonesAndAppearance,
  generateTheme05CssVariablesWithSchemesAndAppearance,
  generateTheme06CssVariablesWithSchemesAndAppearance,
  generateTheme07CssVariablesWithSchemesAndAppearance,
  generateTheme08CssVariablesWithSchemesAndAppearance,
  generateTheme09CssVariablesWithSchemesAndAppearance,
  generateTheme10CssVariables,
  generateTheme11CssVariables,
} from '@lemonppt/templates';
import ReactDOMServer from 'react-dom/server';

export interface RenderEditorOptions {
  width?: number;
  height?: number;
}

function resolveThemeMeta(goal: DeckGoal) {
  const theme = goal.theme || 'theme01';
  const colorScheme =
    goal.colorScheme ||
    (theme === 'theme02' || theme === 'theme03'
      ? 'scheme-a'
      : theme === 'theme04'
        ? 'green'
        : theme === 'theme05'
          ? 'coral'
          : theme === 'theme06'
            ? 'volt'
            : theme === 'theme07'
              ? 'cold-white'
              : theme === 'theme08'
                ? 'obsidian-gold'
                : theme === 'theme09'
                  ? 'ink-editorial'
                  : theme === 'theme10'
                    ? 'gold-index'
                    : 'light');
  const appearance =
    goal.appearance ||
    (theme === 'theme03' || theme === 'theme04' || theme === 'theme05' || theme === 'theme06'
      ? 'dark'
      : theme === 'theme07'
        ? 'light'
        : theme === 'theme08' || theme === 'theme09' || theme === 'theme10'
          ? 'primary'
          : undefined);

  const themeCssVars =
    theme === 'theme01'
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
                : theme === 'theme07'
                  ? generateTheme07CssVariablesWithSchemesAndAppearance()
                  : theme === 'theme08'
                    ? generateTheme08CssVariablesWithSchemesAndAppearance()
                    : theme === 'theme09'
                      ? generateTheme09CssVariablesWithSchemesAndAppearance()
                      : theme === 'theme10'
                        ? generateTheme10CssVariables()
                        : theme === 'theme11'
                          ? generateTheme11CssVariables()
                          : '';

  return { theme, colorScheme, appearance, themeCssVars };
}

/**
 * 根据 goal 生成单页编辑器所需数据。
 * 返回的各字段可直接注入统一的 editor.html 模板，不再为每个主题单独生成完整页面。
 */
export function renderEditorData(goal: DeckGoal, options: RenderEditorOptions = {}): EditorData {
  goal = normalizeDeckGoal(goal);
  const { width = 1280, height = 720 } = options;

  const slideElements = goal.slides.map((slide, index) => {
    const element = renderSlide(slide, { slideIdx: index, editable: true, theme: goal.theme });
    const stateClass = index === 0 ? 'active' : '';
    return (
      <div
        key={index}
        className={`lp-slide-wrapper ${stateClass}`}
        data-slide-index={index}
        data-layout={slide.layout}
        data-lp-transition={String(slide.props.transition || 'none')}
        style={{ width: `${width}px`, height: `${height}px`, boxSizing: 'border-box' }}
      >
        {element ?? <div className="lp-error">未找到版式: {slide.layout}</div>}
      </div>
    );
  });

  const slidesMarkup = ReactDOMServer.renderToStaticMarkup(
    <div
      className="lp-deck"
      data-theme={goal.theme}
      data-lp-transition="none"
      data-editable="true"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {slideElements}
    </div>
  );

  const slideHtmls = goal.slides.map((slide, index) => {
    const element = renderSlide(slide, { slideIdx: index, editable: true, theme: goal.theme });
    return ReactDOMServer.renderToStaticMarkup(
      <div style={{ width: `${width}px`, height: `${height}px`, boxSizing: 'border-box' }}>
        {element ?? <div className="lp-error">未找到版式: {slide.layout}</div>}
      </div>
    );
  });

  const { theme, colorScheme, appearance, themeCssVars } = resolveThemeMeta(goal);

  return {
    goal,
    theme,
    colorScheme,
    appearance,
    slidesMarkup,
    slideHtmls,
    themeCssVars,
    editorBarMarkup: '',
    leftPanelMarkup: '',
    rightPanelMarkup: '',
    addSlideModalMarkup: '',
    editorScriptMarkup: '',
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEditorBarMarkup(goal: DeckGoal): string {
  const appearance = goal.appearance || 'primary';
  const appearanceButtons = [
    { value: 'primary', label: '亮', icon: '☀' },
    { value: 'dark', label: '暗', icon: '☾' },
    { value: 'contrast', label: '彩', icon: '◐' },
  ]
    .map(
      (btn) =>
        `<button type="button" class="lp-appearance-btn ${btn.value === appearance ? 'lp-appearance-active' : ''}" data-appearance="${btn.value}"><span class="lp-appearance-icon">${btn.icon}</span><span class="lp-appearance-label">${btn.label}</span></button>`
    )
    .join('');

  return `<div class="lp-editor-bar" data-appearance="${appearance}">
  <div class="lp-editor-title">${escapeHtml(goal.title || 'Untitled')}</div>
  <div class="lp-appearance-switcher">${appearanceButtons}</div>
  <select id="lp-theme-select" class="lp-editor-select" title="切换主题">
    <option value="theme01" ${goal.theme === 'theme01' ? 'selected' : ''}>Theme 01</option>
    <option value="theme02" ${goal.theme === 'theme02' ? 'selected' : ''}>Theme 02</option>
    <option value="theme03" ${goal.theme === 'theme03' ? 'selected' : ''}>Theme 03</option>
    <option value="theme04" ${goal.theme === 'theme04' ? 'selected' : ''}>Theme 04</option>
    <option value="theme05" ${goal.theme === 'theme05' ? 'selected' : ''}>Theme 05</option>
    <option value="theme06" ${goal.theme === 'theme06' ? 'selected' : ''}>Theme 06</option>
    <option value="theme07" ${goal.theme === 'theme07' ? 'selected' : ''}>Theme 07</option>
    <option value="theme08" ${goal.theme === 'theme08' ? 'selected' : ''}>Theme 08</option>
    <option value="theme09" ${goal.theme === 'theme09' ? 'selected' : ''}>Theme 09</option>
    <option value="theme10" ${goal.theme === 'theme10' ? 'selected' : ''}>Theme 10</option>
  </select>
  <button id="lp-add-slide" class="lp-editor-btn" type="button"><span>+</span> 添加页面</button>
  <button id="lp-save-deck" class="lp-editor-btn lp-editor-btn-primary" type="button">保存</button>
  <button id="lp-play" class="lp-editor-btn lp-editor-btn-primary" type="button" title="播放演示"><span>▶</span> 播放</button>
  <div class="lp-editor-export">
    <button id="lp-export-toggle" class="lp-editor-btn lp-editor-export-toggle" type="button"><span>⬇</span> 导出 <span class="lp-editor-caret">▼</span></button>
    <div id="lp-export-menu" class="lp-editor-export-menu" hidden>
      <button class="lp-editor-export-item" data-format="html"><span class="lp-editor-export-icon">🌐</span><span class="lp-editor-export-label">HTML 演示</span><span class="lp-editor-export-tag">在线播放</span></button>
      <button class="lp-editor-export-item" data-format="pdf"><span class="lp-editor-export-icon">📄</span><span class="lp-editor-export-label">PDF</span><span class="lp-editor-export-tag">打印/分享</span></button>
      <button class="lp-editor-export-item" data-format="pptx"><span class="lp-editor-export-icon">📊</span><span class="lp-editor-export-label">PowerPoint</span><span class="lp-editor-export-tag">.pptx</span></button>
    </div>
  </div>
</div>`;
}

function buildLeftPanelMarkup(goal: DeckGoal, data: EditorData, width: number, height: number): string {
  const slideCount = goal.slides.length;
  const showDragHandle = slideCount > 1;
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
  const scale = 156 / width;
  const thumbnails = goal.slides
    .map((slide, index) => {
      const activeClass = index === 0 ? ' active' : '';
      const slideHtml = data.slideHtmls[index] || '';
      const draggableAttr = showDragHandle ? 'draggable="true"' : '';
      return `<div class="lp-thumbnail${activeClass}" role="button" tabindex="0" ${draggableAttr} data-index="${index}" data-layout="${slide.layout}" aria-label="幻灯片 ${index + 1}，拖动可调整顺序">
  ${dragHandleHtml}
  <div class="lp-thumbnail-render">
    <div class="lp-thumbnail-scaler" style="width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left;">${slideHtml}</div>
  </div>
  <div class="lp-thumbnail-scrim"></div>
  <div class="lp-thumbnail-content">
    <div class="lp-thumbnail-index">${index + 1} / ${slideCount}</div>
    <div class="lp-thumbnail-title">${slide.props.title ? escapeHtml(String(slide.props.title)) : `Slide ${index + 1}`}</div>
    <div class="lp-thumbnail-layout">${escapeHtml(slide.layout)}</div>
  </div>
  <span class="lp-thumbnail-delete" data-lp-action="delete-slide" data-index="${index}" title="删除幻灯片" aria-label="删除幻灯片">×</span>
</div>`;
    })
    .join('\n');

  return `<aside class="lp-editor-left-panel">
  <div class="lp-editor-thumbnails" id="lp-thumbnails">
    ${thumbnails}
  </div>
</aside>`;
}

function buildRightPanelMarkup(): string {
  return `<aside class="lp-editor-right-panel">
  <div class="lp-property-header">属性面板</div>
  <div class="lp-property-content" id="lp-property-content">
    <div class="lp-property-empty">点击左侧缩略图选择幻灯片，然后编辑内容。</div>
  </div>
</aside>`;
}

function buildAddSlideModalMarkup(goal: DeckGoal): string {
  const layouts = goal.slides.length > 0 ? Array.from(new Set(goal.slides.map((s) => s.layout))) : ['title', 'content', 'section', 'closing'];
  const layoutItems = layouts
    .map(
      (layout) =>
        `<div class="lp-add-slide-item" data-layout="${layout}"><span class="lp-add-slide-item-icon">⊞</span><span class="lp-add-slide-item-label">${layout}</span></div>`
    )
    .join('\n');

  return `<div id="lp-add-slide-modal" class="lp-add-slide-modal-overlay">
  <div class="lp-add-slide-modal">
    <div class="lp-add-slide-modal-header"><span class="lp-add-slide-modal-title">添加幻灯片</span><button id="lp-add-slide-close" class="lp-add-slide-modal-close" type="button">×</button></div>
    <div class="lp-add-slide-modal-body">
      <div class="lp-add-slide-section-title">选择版式</div>
      <div class="lp-add-slide-grid">
        ${layoutItems}
      </div>
    </div>
  </div>
</div>`;
}

function buildEditorScriptMarkup(goal: DeckGoal): string {
  return `<script>
window.__lemonPPT_goal = ${JSON.stringify(goal)};
</script>
<script src="./assets/editor-script.js"></script>`;
}

/**
 * 补全 EditorData 中的 UI 片段字段。
 * 将渲染数据与 UI 组件解耦，方便服务端返回纯数据。
 */
export function fillEditorDataUi(
  data: EditorData,
  width = 1280,
  height = 720,
): EditorData {
  return {
    ...data,
    editorBarMarkup: buildEditorBarMarkup(data.goal),
    leftPanelMarkup: buildLeftPanelMarkup(data.goal, data, width, height),
    rightPanelMarkup: buildRightPanelMarkup(),
    addSlideModalMarkup: buildAddSlideModalMarkup(data.goal),
    editorScriptMarkup: buildEditorScriptMarkup(data.goal),
  };
}

/**
 * 将 EditorData 组装成完整 HTML 页面。
 * 这是为兼容旧版 renderDeck(editable: true) 保留的封装。
 */
export function renderEditorHtmlFromData(data: EditorData, options: RenderEditorOptions = {}): RenderOutput {
  const { width = 1280, height = 720 } = options;
  const { goal, theme, colorScheme, appearance, slidesMarkup, themeCssVars, editorBarMarkup, leftPanelMarkup, rightPanelMarkup, addSlideModalMarkup, editorScriptMarkup } = fillEditorDataUi(data, width, height);
  const slideCount = goal.slides.length;
  const appearanceAttr = appearance ? ` data-appearance="${appearance}"` : '';

  const bodyMarkup = `<div class="lp-editor-root">
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
${editorScriptMarkup}
</div>`;

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
    .lp-editor-root.lp-editor-presentation-mode {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background: #000;
    }
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-bar,
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-left-panel,
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-right-panel,
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-zoom-bar,
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-page-counter,
    .lp-editor-root.lp-editor-presentation-mode .lp-add-slide-modal-overlay {
      display: none !important;
    }
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-workspace {
      width: 100vw;
      height: 100vh;
      min-height: 100vh;
    }
    .lp-editor-root.lp-editor-presentation-mode .lp-editor-stage {
      width: 100vw;
      height: 100vh;
      background: #000;
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
    .lp-thumbnail.dragging {
      opacity: 0.45;
      border: 2px dashed #3b82f6;
      background: #1f2937;
    }
    .lp-thumbnail.drag-over {
      border-color: #10b981;
      background: #1f3d32;
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
      grid-template: repeat(5, 1fr);
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
      background: rgba(255, 255, 255,  0.12);
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
    .lp-property-slider::-moz-range-progress {
      background: #5b9bd5;
      border-radius: 4px;
      height: 8px;
    }
    .lp-add-slide-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .lp-add-slide-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .lp-add-slide-modal {
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .lp-add-slide-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #333;
    }
    .lp-add-slide-modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
    .lp-add-slide-modal-close {
      background: transparent;
      border: none;
      color: #888;
      font-size: 20px;
      cursor: pointer;
    }
    .lp-add-slide-modal-close:hover {
      color: #fff;
    }
    .lp-add-slide-modal-body {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
    }
    .lp-add-slide-section-title {
      font-size: 13px;
      font-weight: 600;
      color: #bbb;
      margin: 16px 0 10px;
    }
    .lp-add-slide-section-title:first-child {
      margin-top: 0;
    }
    .lp-add-slide-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .lp-add-slide-item {
      aspect-ratio: 16 / 9;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      padding: 8px;
      text-align: center;
    }
    .lp-add-slide-item:hover {
      background: #333;
      border-color: #5b8cff;
    }
    .lp-add-slide-item-icon {
      font-size: 24px;
      color: #888;
    }
    .lp-add-slide-item-label {
      font-size: 12px;
      color: #bbb;
    }
    .lp-filmstrip-v1-track {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      overflow-y: auto;
      max-height: 100%;
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
<body class="lp-editor-body">
${bodyMarkup}
</body>
</html>`;

  return { html, assets: [] };
}
