(function () {
  const params = new URLSearchParams(window.location.search);
  const initialTheme = params.get('theme') || window.__lemonPPT_editorData?.theme || window.__lemonPPT_goal?.theme || 'theme01';
  const isStatic = !!window.__lemonPPT_editorData || !!window.__lemonPPT_goal;
  const assetsBase = window.__lemonPPT_assetsBase || '/deck/assets/';
  const apiBase = window.__lemonPPT_apiBase || '';
  let editorScriptLoaded = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function assetUrl(name) {
    const base = assetsBase.endsWith('/') ? assetsBase : assetsBase + '/';
    return base + name;
  }

  function buildEditorBar(goal) {
    const appearance = goal.appearance || 'primary';
    const appearanceButtons = [
      { value: 'primary', label: '亮', icon: '☀' },
      { value: 'dark', label: '暗', icon: '☾' },
      { value: 'contrast', label: '彩', icon: '◐' },
    ]
      .map(btn => `<button type="button" class="lp-appearance-btn ${btn.value === appearance ? 'lp-appearance-active' : ''}" data-appearance="${btn.value}"><span>${btn.icon}</span><span>${btn.label}</span></button>`)
      .join('');

    return `
      <div class="lp-editor-title">${escapeHtml(goal.title || 'Untitled')}</div>
      <div class="lp-appearance-switcher">${appearanceButtons}</div>
      <div class="lp-editor-btn-group">
        <button id="lp-undo" class="lp-editor-btn" type="button" title="撤销 (Ctrl+Z)" disabled><span>↶</span> 撤销</button>
        <button id="lp-redo" class="lp-editor-btn" type="button" title="重做 (Ctrl+Y)" disabled><span>↷</span> 重做</button>
      </div>
      <button id="lp-save-deck" class="lp-editor-btn lp-editor-btn-primary" type="button">保存</button>
      <button id="lp-play" class="lp-editor-btn lp-editor-btn-primary" type="button" title="播放演示"><span>▶</span> 播放</button>
      <div id="lp-editor-export" class="lp-editor-export">
        <button id="lp-export-toggle" class="lp-editor-btn lp-editor-export-toggle" type="button" aria-expanded="false"><img class="lp-editor-export-toggle-icon" src="${assetsBase}icons/导出.svg" alt=""> 导出 <span class="lp-editor-caret">▼</span></button>
        <div id="lp-export-menu" class="lp-editor-export-menu" hidden>
          <button id="lp-export-pptx-client" class="lp-editor-export-item" data-format="pptx-client"><img class="lp-editor-export-icon" src="${assetsBase}icons/导出.svg" alt=""><span class="lp-editor-export-label">快速导出 PPTX</span><span class="lp-editor-export-tag">可编辑</span></button>
          <button id="lp-export-html" class="lp-editor-export-item" data-format="html"><img class="lp-editor-export-icon" src="${assetsBase}icons/HTML.svg" alt=""><span class="lp-editor-export-label">HTML 演示</span><span class="lp-editor-export-tag">在线播放</span></button>
          <button id="lp-export-pptx" class="lp-editor-export-item" data-format="pptx"><img class="lp-editor-export-icon" src="${assetsBase}icons/ppt文件.svg" alt=""><span class="lp-editor-export-label">PowerPoint</span><span class="lp-editor-export-tag">服务端</span></button>
          <button id="lp-export-pdf" class="lp-editor-export-item" data-format="pdf"><img class="lp-editor-export-icon" src="${assetsBase}icons/pdf.svg" alt=""><span class="lp-editor-export-label">PDF</span><span class="lp-editor-export-tag">打印/分享</span></button>
        </div>
      </div>`;
  }

  function buildLeftPanel(goal, slideHtmls, width, height) {
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
    const thumbnails = goal.slides.map((slide, index) => {
      const activeClass = index === 0 ? ' active' : '';
      const title = slide.props && slide.props.title ? String(slide.props.title) : `Slide ${index + 1}`;
      const slideHtml = slideHtmls[index] || '';
      const draggableAttr = showDragHandle ? 'draggable="true"' : '';
      return `<div class="lp-thumbnail${activeClass}" role="button" tabindex="0" ${draggableAttr} data-index="${index}" data-layout="${slide.layout}" aria-label="幻灯片 ${index + 1}，拖动可调整顺序">
  ${dragHandleHtml}
  <div class="lp-thumbnail-render">
    <div class="lp-thumbnail-scaler" style="width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left;">${slideHtml}</div>
  </div>
  <div class="lp-thumbnail-scrim"></div>
  <div class="lp-thumbnail-content">
    <div class="lp-thumbnail-index">${index + 1} / ${slideCount}</div>
    <div class="lp-thumbnail-title">${escapeHtml(title)}</div>
    <div class="lp-thumbnail-layout">${escapeHtml(slide.layout)}</div>
  </div>
  <span class="lp-thumbnail-delete" data-lp-action="delete-slide" data-index="${index}" title="删除幻灯片" aria-label="删除幻灯片">×</span>
</div>`;
    }).join('\n');
    return `<div class="lp-editor-thumbnails" id="lp-thumbnails">${thumbnails}</div>`;
  }

  function buildRightPanel() {
    return `<div class="lp-property-header">属性面板</div><div class="lp-property-content" id="lp-property-content"><div class="lp-property-empty">点击左侧缩略图选择幻灯片，然后编辑内容。</div></div>`;
  }

  async function applyData(data, { isInitial = false, staticMode = false } = {}) {
    const goal = data.goal;
    const theme = data.theme;

    document.documentElement.setAttribute('data-theme', data.colorScheme);
    if (data.appearance) {
      document.documentElement.setAttribute('data-appearance', data.appearance);
    } else {
      document.documentElement.removeAttribute('data-appearance');
    }

    // 更新主题 CSS 变量
    let varStyle = document.getElementById('lp-theme-vars');
    if (!varStyle) {
      varStyle = document.createElement('style');
      varStyle.id = 'lp-theme-vars';
      document.head.appendChild(varStyle);
    }
    varStyle.textContent = data.themeCssVars;

    // 更新主题样式表
    let themeLink = document.getElementById('lp-theme-css');
    const themeCssUrl = assetUrl(`${theme}.css`);
    if (themeLink) {
      themeLink.href = themeCssUrl;
    } else {
      themeLink = document.createElement('link');
      themeLink.id = 'lp-theme-css';
      themeLink.rel = 'stylesheet';
      themeLink.href = themeCssUrl;
      document.head.appendChild(themeLink);
    }
    // 等待样式表加载完成（首次加载需要，后续 href 变更浏览器会异步加载）
    await new Promise((resolve) => {
      if (themeLink.sheet) return resolve();
      themeLink.onload = resolve;
      setTimeout(resolve, 100);
    });

    // 先填充画布，才能从 slide 容器读取真实宽高
    document.getElementById('lp-slides').innerHTML = data.slidesMarkup;
    document.getElementById('lp-total').textContent = String(goal.slides.length);

    const firstWrapper = document.querySelector('#lp-slides .lp-slide-wrapper');
    const width = firstWrapper ? parseInt(firstWrapper.style.width, 10) || 1280 : 1280;
    const height = firstWrapper ? parseInt(firstWrapper.style.height, 10) || 720 : 720;

    // 填充 UI
    document.getElementById('lp-editor-bar').innerHTML = buildEditorBar(goal);
    document.getElementById('lp-left-panel').innerHTML = buildLeftPanel(goal, data.slideHtmls, width, height);
    document.getElementById('lp-right-panel').innerHTML = buildRightPanel();

    // 暴露 goal 给 editor-script
    window.__lemonPPT_goal = goal;

    // 显示编辑器
    document.getElementById('lp-loading').classList.add('hidden');
    document.getElementById('lp-editor-root').style.display = '';

    // 首次加载需要注入 editor-script，后续直接复用已初始化的实例
    if (!editorScriptLoaded) {
      // editor-script 依赖 client-render 的渲染函数与 ECharts 主题脚本
      await loadScript(assetUrl('client-render.js'));
      await loadScript(assetUrl('theme-echarts.js'));
      await loadScript(assetUrl('client-export.js'));
      await loadScript(assetUrl('editor-script.js'));
      editorScriptLoaded = true;
    } else if (typeof window.__lemonPPT_applyTheme === 'function') {
      window.__lemonPPT_applyTheme(goal, data.slidesMarkup);
    }

    // 同步 URL（不刷新）
    if (!staticMode) {
      const url = new URL(window.location.href);
      url.searchParams.set('theme', theme);
      window.history.replaceState({}, '', url.toString());
    }
  }

  async function fetchTheme(theme) {
    try {
      const res = await fetch(`${apiBase}/api/render-editor?theme=${encodeURIComponent(theme)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || '加载失败');
      await applyData(json.data, { staticMode: false });
    } catch (err) {
      console.error(err);
      document.getElementById('lp-loading').classList.remove('hidden');
      document.getElementById('lp-loading').innerHTML = `<div>加载失败：${escapeHtml(err.message)}</div>`;
    }
  }

  window.__lemonPPT_exportProgress = {
    show(title) {
      const overlay = document.getElementById('lp-export-progress');
      const titleEl = document.getElementById('lp-export-progress-title');
      if (titleEl && title) titleEl.textContent = title;
      this.set(0, '准备中');
      if (overlay) overlay.classList.remove('hidden');
    },
    set(percent, status) {
      const bar = document.getElementById('lp-export-progress-bar');
      const statusEl = document.getElementById('lp-export-progress-status');
      const percentEl = document.getElementById('lp-export-progress-percent');
      const value = Math.max(0, Math.min(100, Math.round(percent)));
      if (bar) bar.style.width = value + '%';
      if (statusEl && status) statusEl.textContent = status;
      if (percentEl) percentEl.textContent = value + '%';
    },
    hide() {
      const overlay = document.getElementById('lp-export-progress');
      if (overlay) overlay.classList.add('hidden');
    },
  };

  async function init() {
    try {
      if (window.__lemonPPT_editorData) {
        await applyData(window.__lemonPPT_editorData, { isInitial: true, staticMode: true });
      } else if (window.__lemonPPT_goal) {
        // 兼容旧的内嵌方式：将 goal 转换为 editor data 结构
        await applyData({
          goal: window.__lemonPPT_goal,
          theme: window.__lemonPPT_goal.theme,
          colorScheme: window.__lemonPPT_goal.colorScheme || 'light',
          appearance: window.__lemonPPT_goal.appearance,
          slidesMarkup: document.getElementById('lp-slides')?.innerHTML || '',
          themeCssVars: '',
        }, { isInitial: true, staticMode: true });
      } else {
        await fetchTheme(initialTheme);
      }
    } catch (err) {
      console.error(err);
      document.getElementById('lp-loading').innerHTML = `<div>加载失败：${escapeHtml(err.message)}</div>`;
    }
  }

  init();
})();
