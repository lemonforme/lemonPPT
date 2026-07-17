import type { DeckGoal, RenderOutput } from '@lemonppt/core';
import { renderSlide } from '@lemonppt/templates';
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
  const { width = 1280, height = 720, editable = false } = options;

  const slideCount = goal.slides.length;

  const slideElements = goal.slides.map((slide, index) => {
    const element = renderSlide(slide, { slideIdx: index, editable });
    const stateClass = index === 0 ? 'active' : '';
    return (
      <div
        key={index}
        className={`lp-slide-wrapper ${stateClass}`}
        data-slide-index={index}
        data-layout={slide.layout}
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
    const element = renderSlide(slide, { slideIdx: index, editable });
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
  const editorBarMarkup = editable ? buildEditorBarMarkup() : '';
  const leftPanelMarkup = editable ? buildLeftPanelMarkup(goal, slideHtmls, width, height) : '';
  const rightPanelMarkup = editable ? buildRightPanelMarkup() : '';
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
${scriptMarkup}
</div>`
    : `${slidesMarkup}${navMarkup}${scriptMarkup}`;

  const html = `<!DOCTYPE html>
<html lang="${goal.language ?? 'zh'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${width}, initial-scale=1.0">
  <title>${escapeHtml(goal.title)}</title>
  <link rel="stylesheet" href="./assets/${goal.theme || 'minimal'}.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      border-radius: 0 !important;
      border-bottom: 1px solid #333 !important;
      background: #1e1e1e !important;
      color: #e5e5e5 !important;
      padding: 0 16px !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
    }
    .lp-editor-root .lp-editor-title {
      margin-right: auto;
    }
    .lp-editor-root .lp-editor-btn {
      background: #2a2a2a;
      color: #e5e5e5;
      border: 1px solid #444;
    }
    .lp-editor-root .lp-editor-btn:hover:not(:disabled) {
      background: #333;
    }
    .lp-editor-root .lp-editor-btn:disabled {
      opacity: 0.5;
    }
    .lp-editor-workspace {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .lp-editor-left-panel {
      width: 240px;
      flex: none;
      background: #1e1e1e;
      border-right: 1px solid #333;
      overflow-y: auto;
      padding: 12px;
    }
    .lp-editor-right-panel {
      width: 280px;
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
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      text-align: left;
      color: #bbb;
      transition: border-color 0.15s, background 0.15s;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .lp-thumbnail:hover {
      background: #333;
    }
    .lp-thumbnail.active {
      border-color: #3b82f6;
      background: #26354f;
      color: #fff;
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
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
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
      width: 38px;
      height: 20px;
      background: #444;
      border-radius: 10px;
      position: relative;
      transition: background 0.2s;
    }
    .lp-property-toggle input:checked + .lp-property-toggle-track {
      background: #3b82f6;
    }
    .lp-property-toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    .lp-property-toggle input:checked + .lp-property-toggle-track .lp-property-toggle-thumb {
      transform: translateX(18px);
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
    .lp-property-array {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .lp-property-array-item {
      background: #252525;
      border: 1px solid #383838;
      border-radius: 8px;
      padding: 10px;
    }
    .lp-property-array-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #aaa;
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
    .lp-property-btn-primary {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }
    .lp-property-btn-primary:hover {
      background: #2563eb;
    }
    .lp-property-btn-danger {
      border-color: #7f1d1d;
      color: #fca5a5;
    }
    .lp-property-btn-danger:hover {
      background: #450a0a;
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
  </style>
</head>
<body class="${bodyClass}">
${bodyMarkup}
</body>
</html>`;

  return {
    html,
    assets: ['./assets/minimal.css'],
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

function buildEditorBarMarkup(): string {
  return `<div class="lp-editor-bar">
  <span class="lp-editor-title">lemonPPT 编辑器</span>
  <label class="lp-theme-switcher-label">
    主题
    <select id="lp-theme-switcher">
      <option value="minimal">极简白</option>
      <option value="dark-tech">深色科技</option>
      <option value="warm-business">暖色商务</option>
    </select>
  </label>
  <button class="lp-editor-btn" id="lp-play" title="播放演示">▶ 播放</button>
  <button class="lp-editor-btn" id="lp-undo" title="撤销 (Ctrl+Z)">↩ 撤销</button>
  <button class="lp-editor-btn" id="lp-redo" title="重做 (Ctrl+Y)">↪ 重做</button>
  <button class="lp-editor-btn" id="lp-download-goal" title="下载 goal.json">下载 goal.json</button>
  <button class="lp-editor-btn" id="lp-export-pptx" title="导出 PPTX">导出 PPTX</button>
  <button class="lp-editor-btn" id="lp-export-pdf" title="导出 PDF">导出 PDF</button>
</div>`;
}

function buildLeftPanelMarkup(
  goal: DeckGoal,
  slideHtmls: string[],
  slideWidth: number,
  slideHeight: number,
): string {
  const thumbInnerWidth = 216;
  const scale = thumbInnerWidth / slideWidth;

  const buttons = goal.slides.map((slide, index) => {
    const label = getSlideLabel(slide);
    const activeClass = index === 0 ? 'active' : '';
    const slideHtml = slideHtmls[index] || '';
    return `<button class="lp-thumbnail ${activeClass}" data-index="${index}" type="button">
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
</button>`;
  }).join('');

  return `<aside class="lp-editor-left-panel" aria-label="幻灯片缩略图">
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
  return `<aside class="lp-editor-right-panel" aria-label="属性面板">
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
  let current = 0;

  function updateClasses() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev');
      if (index === current) slide.classList.add('active');
      else if (index < current) slide.classList.add('prev');
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === current);
    });
    if (currentLabel) currentLabel.textContent = String(current + 1);
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    current = index;
    updateClasses();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  updateClasses();
})();
</script>`;
}

function buildEditorScriptMarkup(goal: DeckGoal): string {
  const goalJson = JSON.stringify(goal, null, 2).replace(/</g, '\\u003c');
  return `<script>
window.__lemonPPT_goal = ${goalJson};
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
