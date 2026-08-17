// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

export const editorScript = `
(function () {
  // 用 jQuery 为所有带 data-scrollbar 的容器添加自定义滚动条样式类
  if (typeof jQuery !== 'undefined') {
    jQuery(function ($) {
      $('[data-scrollbar]').addClass('lp-custom-scrollbar');
    });
  }

  const MIGRATION_KEY = 'lemonppt:editor:migration:showInsight:v1';
  const MAX_HISTORY = 50;

  let goal = window.__lemonPPT_goal;
  if (!goal) return;

  function getStorageKey() {
    return 'lemonppt:editor:v2:' + (goal.theme || 'theme01') + ':' + (goal.randomSeed || goal.title || 'default');
  }

  // 优先从 localStorage 恢复
  let needsDomRebuild = false;
  try {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.slides) {
        // 一次性迁移：将图表页的重点强调开关重置为默认开启
        if (!localStorage.getItem(MIGRATION_KEY)) {
          parsed.slides.forEach((slide) => {
            if (slide.role === 'chart') {
              slide.props = slide.props || {};
              slide.props.showInsight = true;
            }
          });
          localStorage.setItem(MIGRATION_KEY, '1');
        }
        // 若结构数量或幻灯片顺序发生变化，需要重建 DOM；仅内容变化则同步文本即可
        const orderChanged = parsed.slides.length !== goal.slides.length ||
          parsed.slides.some((slide, i) => slide.layout !== goal.slides[i].layout);
        goal = parsed;
        window.__lemonPPT_goal = goal;
        if (orderChanged) {
          needsDomRebuild = true;
        } else {
          syncDomFromGoal();
        }
      }
    }
  } catch (err) {
    console.warn('自动恢复失败', err);
  }

  // 初始化外观模式（同一主题下的浅色/深色切换，通过 data-theme / data-appearance 切换 CSS 变量）
  syncAppearanceFromGoal();

  const TRANSITIONS = [
    { key: 'none', label: '无动画' },
    { key: 'slide', label: '横滑' },
    { key: 'fade', label: '淡入淡出' },
    { key: 'scale', label: '缩放' },
    { key: 'cut-in', label: '切入' },
    { key: 'cube', label: '立方体' },
    { key: 'flip', label: '翻页' },
    { key: 'cover', label: '覆盖' },
    { key: 'wipe', label: '擦除' },
  ];

  const history = [deepClone(goal)];
  let historyIndex = 0;

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function recordHistory() {
    // 截断 redo 分支
    if (historyIndex < history.length - 1) {
      history.splice(historyIndex + 1);
    }
    history.push(deepClone(goal));
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyIndex++;
    }
    updateUndoRedoButtons();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    restoreGoal(history[historyIndex]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    restoreGoal(history[historyIndex]);
  }

  function restoreGoal(newGoal) {
    const oldSlides = goal && goal.slides ? goal.slides : [];
    goal = newGoal;
    window.__lemonPPT_goal = goal;
    Object.assign(window.__lemonPPT_goal, newGoal);
    const orderChanged = oldSlides.length !== goal.slides.length ||
      oldSlides.some((slide, i) => slide.layout !== goal.slides[i].layout);
    if (orderChanged) {
      current = 0;
      selectedSlideIdx = 0;
      rebuildSlidesAndThumbnails();
      if (typeof selectSlide === 'function') selectSlide(current);
    } else {
      syncDomFromGoal();
    }
    syncAppearanceFromGoal();
    autoSave();
    updateUndoRedoButtons();
  }

  let autoSaveTimer = null;
  function autoSave() {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    autoSaveTimer = setTimeout(() => {
      autoSaveTimer = null;
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(goal));
      } catch (err) {
        console.warn('自动保存失败', err);
      }
    }, 400);
  }

  // 获取可编辑元素；兼容 Text 节点、Shadow DOM 等场景
  function getEditingElement(target) {
    if (!target) return null;
    if (target.nodeType === Node.TEXT_NODE) {
      target = target.parentElement;
    }
    if (!target || typeof target.closest !== 'function') return null;
    return target.closest('[data-lp-editable="true"], [contenteditable="true"], input, textarea, select');
  }

  function isEditingTarget(target) {
    return !!getEditingElement(target);
  }

  function propMatchesChangedPath(prop, changedPath) {
    if (!changedPath) return true;
    return prop === changedPath || prop.startsWith(changedPath + '.') || changedPath.startsWith(prop + '.');
  }

  function syncDomFromGoal(changedPath) {
    // 文本：如果指定了 changedPath，只同步受影响的路径，避免覆盖 React 渲染的特殊结构（如标题高亮）
    document.querySelectorAll('[data-lp-editable="true"]').forEach((el) => {
      const slideIdx = Number(el.getAttribute('data-lp-slide-idx'));
      const prop = el.getAttribute('data-lp-prop');
      if (Number.isNaN(slideIdx) || !prop) return;
      if (!propMatchesChangedPath(prop, changedPath)) return;
      const slide = goal.slides[slideIdx];
      if (!slide) return;
      const value = getProp(slide.props, prop);
      el.textContent = value == null ? '' : String(value);
    });

    // 图片
    document.querySelectorAll('[data-lp-editable-image="true"]').forEach((img) => {
      const slideIdx = Number(img.getAttribute('data-lp-slide-idx'));
      const prop = img.getAttribute('data-lp-prop') || 'image';
      if (Number.isNaN(slideIdx)) return;
      if (!propMatchesChangedPath(prop, changedPath)) return;
      const slide = goal.slides[slideIdx];
      if (!slide) return;
      const value = getProp(slide.props, prop);
      if (value) {
        if (img.tagName === 'IMG') {
          img.setAttribute('src', String(value));
        } else {
          // 占位容器需要替换为真实图片
          const newImg = document.createElement('img');
          newImg.className = img.className.replace(/\blp-editable-image-placeholder\b/g, '').trim();
          newImg.src = String(value);
          newImg.alt = img.getAttribute('alt') || '';
          newImg.setAttribute('data-lp-editable-image', 'true');
          newImg.setAttribute('data-lp-slide-idx', String(slideIdx));
          newImg.setAttribute('data-lp-prop', prop);
          img.parentNode.replaceChild(newImg, img);
        }
      }
      // 无图片时保留占位容器，确保仍可点击上传
    });
  }

  function getProp(obj, path) {
    const keys = path.split('.');
    let target = obj;
    for (const k of keys) {
      if (target == null || typeof target !== 'object') return undefined;
      target = target[k];
    }
    return target;
  }

  function setProp(obj, path, value) {
    const keys = path.split('.');
    let target = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target)) target[k] = [];
      target = target[k];
    }
    target[keys[keys.length - 1]] = value;
  }

  // 点击图片固定区域直接上传本地图片
  function handleImageUpload(target, slideIdx, prop) {
    const slide = goal.slides[slideIdx];
    if (!slide) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) {
        input.remove();
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (typeof dataUrl !== 'string') {
          input.remove();
          return;
        }
        recordHistory();
        setProp(slide.props, prop, dataUrl);
        autoSave();
        renderCurrentSlideToRoot();
        input.remove();
      };
      reader.readAsDataURL(file);
    });

    input.addEventListener('cancel', () => input.remove());
    input.click();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 初始化 contenteditable 属性；使用 MutationObserver 监听 React 重新渲染后新增的编辑元素
  function initEditableElements(container) {
    const scope = container || document;
    scope.querySelectorAll('[data-lp-editable="true"]').forEach((el) => {
      if (el.getAttribute('contenteditable') !== 'true') {
        el.setAttribute('contenteditable', 'true');
      }
    });
  }
  initEditableElements();

  const editableObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          initEditableElements(node);
        }
      });
    });
  });
  editableObserver.observe(document.body, { childList: true, subtree: true });

  // 使用事件委托处理文本编辑，支持 React 局部渲染后自动生效
  document.addEventListener('focus', (e) => {
    const el = e.target.closest('[data-lp-editable="true"]');
    if (!el) return;
    recordHistory();
  }, true);

  document.addEventListener('blur', (e) => {
    const el = e.target.closest('[data-lp-editable="true"]');
    if (!el) return;
    const slideIdx = Number(el.getAttribute('data-lp-slide-idx'));
    const prop = el.getAttribute('data-lp-prop');
    if (Number.isNaN(slideIdx) || !prop) return;

    const slide = goal.slides[slideIdx];
    if (!slide) return;

    const rawValue = el.textContent || '';
    const fieldType = el.getAttribute('data-lp-editable-type');
    const value = fieldType === 'number' ? Number(rawValue) : rawValue;
    setProp(slide.props, prop, value);
    autoSave();
    // 图表数据字段在画布上直接编辑后，需要重新渲染幻灯片以更新图表
    if (el.getAttribute('data-lp-chart-data') === 'true' && typeof window.__lemonPPT_initECharts === 'function') {
      refreshCurrentSlide();
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    const el = getEditingElement(e.target) || getEditingElement(document.activeElement);
    if (!el) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      el.blur();
    }
  });

  // 图片换图：点击固定区域直接唤起文件选择器上传
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-lp-editable-image="true"]');
    if (!target) return;
    const slideIdx = Number(target.getAttribute('data-lp-slide-idx'));
    const prop = target.getAttribute('data-lp-prop') || 'image';
    if (Number.isNaN(slideIdx)) return;
    handleImageUpload(target, slideIdx, prop);
  });

  const exportToggle = document.getElementById('lp-export-toggle');
  const exportMenu = document.getElementById('lp-export-menu');
  const exportWrapper = document.getElementById('lp-editor-export');
  if (exportToggle && exportMenu) {
    exportToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const hidden = exportMenu.hasAttribute('hidden');
      if (hidden) {
        exportMenu.removeAttribute('hidden');
        exportToggle.setAttribute('aria-expanded', 'true');
      } else {
        exportMenu.setAttribute('hidden', '');
        exportToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (e) => {
      if (!exportWrapper || exportWrapper.contains(e.target)) return;
      exportMenu.setAttribute('hidden', '');
      exportToggle.setAttribute('aria-expanded', 'false');
    });
  }

  const exportHtmlBtn = document.getElementById('lp-export-html');
  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener('click', () => {
      const html = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.html';
      a.click();
      URL.revokeObjectURL(url);
      if (exportMenu) exportMenu.setAttribute('hidden', '');
    });
  }

  const exportPptxBtn = document.getElementById('lp-export-pptx');
  if (exportPptxBtn) {
    const pptxLabel = exportPptxBtn.querySelector('.lp-editor-export-label');
    exportPptxBtn.addEventListener('click', async () => {
      if (window.location.protocol === 'file:') {
        alert('静态文件模式下无法直接导出 PPTX。\\n\\n请通过本地服务器访问后导出：\\n  pnpm dev\\n或运行：\\n  node scripts/export-pptx.mjs <goal.json> out.pptx');
        if (exportMenu) exportMenu.setAttribute('hidden', '');
        return;
      }
      if (pptxLabel) pptxLabel.textContent = '导出中...';
      exportPptxBtn.disabled = true;
      try {
        const res = await fetch('/api/export/pptx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal),
        });
        if (!res.ok) throw new Error('导出失败: ' + res.status);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.pptx';
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
      } finally {
        if (pptxLabel) pptxLabel.textContent = 'PPTX';
        exportPptxBtn.disabled = false;
        if (exportMenu) exportMenu.setAttribute('hidden', '');
      }
    });
  }

  const exportPdfBtn = document.getElementById('lp-export-pdf');
  if (exportPdfBtn) {
    const pdfLabel = exportPdfBtn.querySelector('.lp-editor-export-label');
    exportPdfBtn.addEventListener('click', async () => {
      if (window.location.protocol === 'file:') {
        alert('静态文件模式下无法直接导出 PDF。\\n\\n请通过本地服务器访问后导出：\\n  pnpm dev\\n或运行：\\n  node scripts/export-pdf.mjs <goal.json> out.pdf');
        if (exportMenu) exportMenu.setAttribute('hidden', '');
        return;
      }
      if (pdfLabel) pdfLabel.textContent = '导出中...';
      exportPdfBtn.disabled = true;
      try {
        const res = await fetch('/api/export/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal),
        });
        if (!res.ok) throw new Error('导出失败: ' + res.status);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.pdf';
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
      } finally {
        if (pdfLabel) pdfLabel.textContent = 'PDF';
        exportPdfBtn.disabled = false;
        if (exportMenu) exportMenu.setAttribute('hidden', '');
      }
    });
  }

  // 撤销 / 重做
  const undoBtn = document.getElementById('lp-undo');
  const redoBtn = document.getElementById('lp-redo');

  function updateUndoRedoButtons() {
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
  }

  if (undoBtn) undoBtn.addEventListener('click', undo);
  if (redoBtn) redoBtn.addEventListener('click', redo);

  const saveDeckBtn = document.getElementById('lp-save-deck');
  if (saveDeckBtn) {
    saveDeckBtn.addEventListener('click', () => {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(goal));
        const original = saveDeckBtn.textContent;
        saveDeckBtn.textContent = '已保存';
        saveDeckBtn.disabled = true;
        setTimeout(() => {
          saveDeckBtn.textContent = original;
          saveDeckBtn.disabled = false;
        }, 1200);
      } catch (err) {
        console.warn('手动保存失败', err);
        alert('保存失败，请检查浏览器存储权限。');
      }
    });
  }

  function syncAppearanceFromGoal() {
    const t = goal.theme || 'theme01';
    if (t === 'theme04' || t === 'theme05' || t === 'theme06' || t === 'theme07' || t === 'theme08' || t === 'theme09' || t === 'theme10') {
      const scheme = goal.colorScheme || (t === 'theme05' ? 'coral' : t === 'theme06' ? 'volt' : t === 'theme07' ? 'cold-white' : t === 'theme08' ? 'obsidian-gold' : t === 'theme09' ? 'ink-editorial' : t === 'theme10' ? 'gold-index' : 'green');
      const rawAppearance = goal.appearance || (t === 'theme07' ? 'light' : t === 'theme08' || t === 'theme09' || t === 'theme10' ? 'primary' : 'dark');
      /* theme08 / theme09 归一化：light→muted / dark→primary */
      const appearance = (t === 'theme08' || t === 'theme09') ? ((rawAppearance === 'light' || rawAppearance === 'muted') ? 'muted' : 'primary') : rawAppearance;
      document.documentElement.setAttribute('data-theme', scheme);
      document.documentElement.setAttribute('data-appearance', appearance);
    } else if (t === 'theme03') {
      const scheme = goal.colorScheme || 'scheme-a';
      const appearance = goal.appearance || 'dark';
      document.documentElement.setAttribute('data-theme', scheme);
      document.documentElement.setAttribute('data-appearance', appearance);
    } else {
      const scheme = goal.colorScheme || (t === 'theme02' ? 'scheme-a' : 'light');
      document.documentElement.setAttribute('data-theme', scheme);
      document.documentElement.removeAttribute('data-appearance');
    }

    document.querySelectorAll('.lp-appearance-btn').forEach((btn) => {
      const appearanceValue = btn.getAttribute('data-appearance');
      const themeValue = btn.getAttribute('data-theme');
      if (!appearanceValue && !themeValue) return;

      let active = false;
      if (t === 'theme04' || t === 'theme05' || t === 'theme06' || t === 'theme07' || t === 'theme08' || t === 'theme09' || t === 'theme10') {
        if (themeValue) {
          active = themeValue === (goal.colorScheme || (t === 'theme05' ? 'coral' : t === 'theme06' ? 'volt' : t === 'theme07' ? 'cold-white' : t === 'theme08' ? 'obsidian-gold' : t === 'theme09' ? 'ink-editorial' : t === 'theme10' ? 'gold-index' : 'green'));
        } else if (appearanceValue) {
          const rawGoal = goal.appearance || (t === 'theme07' ? 'light' : t === 'theme08' || t === 'theme09' || t === 'theme10' ? 'primary' : 'dark');
          const normGoal = (t === 'theme08' || t === 'theme09') ? ((rawGoal === 'light' || rawGoal === 'muted') ? 'muted' : 'primary') : rawGoal;
          const normBtn = (t === 'theme08' || t === 'theme09') ? ((appearanceValue === 'light' || appearanceValue === 'muted') ? 'muted' : 'primary') : appearanceValue;
          active = normBtn === normGoal;
        }
      } else if (t === 'theme03') {
        active = appearanceValue === (goal.appearance || 'dark');
      } else {
        active = appearanceValue === (goal.colorScheme || (t === 'theme02' ? 'scheme-a' : 'light'));
      }
      btn.classList.toggle('lp-appearance-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function applyAppearanceClientSide(newMode) {
    const t = goal.theme || 'theme01';

    if (t === 'theme04' || t === 'theme05' || t === 'theme06' || t === 'theme07' || t === 'theme08' || t === 'theme09' || t === 'theme10') {
      /* theme08 / theme09 归一化：light→muted / dark→primary */
      const normMode = (t === 'theme08' || t === 'theme09') ? ((newMode === 'light' || newMode === 'muted') ? 'muted' : 'primary') : newMode;
      const curNorm = (t === 'theme08' || t === 'theme09') ? ((goal.appearance === 'light' || goal.appearance === 'muted') ? 'muted' : 'primary') : goal.appearance;
      if (normMode === curNorm) return;
      recordHistory();
      goal.appearance = newMode;
      autoSave();
      document.documentElement.setAttribute('data-appearance', newMode);
    } else if (t === 'theme03') {
      if (newMode === goal.appearance) return;
      recordHistory();
      goal.appearance = newMode;
      autoSave();
      document.documentElement.setAttribute('data-appearance', newMode);
    } else {
      if (newMode === goal.colorScheme) return;
      recordHistory();
      goal.colorScheme = newMode;
      autoSave();
      document.documentElement.setAttribute('data-theme', newMode);
    }

    syncAppearanceFromGoal();

    // 切换外观后 CSS 变量值变化，释放全部实例并重新初始化当前 active slide 的 ECharts。
    if (typeof window.__lemonPPT_disposeECharts === 'function') {
      window.__lemonPPT_disposeECharts();
    }
    initActiveSlideECharts();
  }

  function applyToneClientSide(newTone) {
    const t = goal.theme || 'theme01';
    if (t !== 'theme04' && t !== 'theme05' && t !== 'theme06') return;
    if (newTone === goal.colorScheme) return;
    recordHistory();
    goal.colorScheme = newTone;
    autoSave();
    document.documentElement.setAttribute('data-theme', newTone);
    syncAppearanceFromGoal();
    if (typeof window.__lemonPPT_disposeECharts === 'function') {
      window.__lemonPPT_disposeECharts();
    }
    initActiveSlideECharts();
  }

  // 外观模式切换（浅色 / 深色 / 主题 04 色调）
  document.querySelectorAll('.lp-appearance-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const appearance = btn.getAttribute('data-appearance');
      const tone = btn.getAttribute('data-theme');
      if (tone) applyToneClientSide(tone);
      if (appearance) applyAppearanceClientSide(appearance);
    });
  });

  // 添加幻灯片
  function createDefaultSlide(layoutId, role) {
    const slide = { layout: layoutId, role, props: { title: '新幻灯片' } };
    switch (role) {
      case 'cover': {
        if (layoutId === 'theme02_cover_v1') {
          slide.props = {
            kicker: '霓虹主题演示',
            title: 'Neon Pitch',
            subtitle: '深色背景 + 双配色方案 + 科技感版式',
            date: '2026.07'
          };
        } else {
          slide.props = { title: '封面标题', subtitle: '副标题' };
        }
        break;
      }
      case 'closing': {
        if (layoutId === 'theme01_conclusion_v1') {
          slide.props = {
            title: '核心结论',
            subtitle: 'CONCLUSION',
            points: [
              { item: 'AI 演示生成已迈入实用阶段' },
              { item: '主题系统与布局引擎是护城河' },
              { item: '开放生态将加速行业落地' }
            ]
          };
        } else if (layoutId === 'theme02_closing_v1') {
          slide.props = {
            kicker: '感谢观看',
            title: "Let's Build Neon",
            subtitle: '用深色霓虹风格点亮下一场演示',
            cta: '开始使用',
            contact: '柠檬团队',
            email: 'hello@lemonppt.dev',
            link: 'lemonppt.dev'
          };
        } else {
          slide.props = {
            kicker: '感谢观看',
            title: '期待与您合作',
            subtitle: '有任何问题，欢迎随时交流',
            cta: '联系我们',
            contact: '柠檬团队',
            email: 'hello@lemonppt.dev',
            link: 'lemonppt.dev'
          };
        }
        break;
      }
      case 'quote': {
        if (layoutId === 'theme02_quote_v1') {
          slide.props = {
            quote: '设计的本质是解决问题，而好的设计是让复杂变得简单。',
            author: '柠檬团队',
            role: '产品理念'
          };
        } else {
          slide.props = {
            quote: '简洁是终极的复杂。',
            author: '莱昂纳多·达·芬奇'
          };
        }
        break;
      }
      case 'content': {
        if (layoutId === 'theme01_risk_v1') {
          slide.props = {
            kicker: '风险研判',
            title: '风险标题',
            items: [
              { risk: '风险 1', impact: '高', response: '应对策略' },
              { risk: '风险 2', impact: '中', response: '应对策略' }
            ]
          };
        } else if (layoutId === 'theme01_outlook_v1') {
          slide.props = {
            kicker: '投资展望',
            title: '展望标题',
            items: [
              { title: '趋势一', trend: '趋势判断', action: '行动建议' },
              { title: '趋势二', trend: '趋势判断', action: '行动建议' }
            ]
          };
        } else if (layoutId === 'theme01_region_v1') {
          slide.props = {
            kicker: '地区分布',
            title: '市场分布',
            regions: [
              { name: '地区一', value: '35%', change: '+2%', note: '说明文字' },
              { name: '地区二', value: '25%', change: '+1%', note: '说明文字' }
            ]
          };
        } else if (layoutId === 'theme01_case_study') {
          slide.props = {
            kicker: '典型案例',
            title: '柠檬科技',
            subtitle: 'FROM CHALLENGER TO FRONTRUNNER',
            intro: '柠檬科技成立于 2022 年，专注 AI 演示文稿生成。凭借自研布局引擎与主题系统，在 18 个月内完成从 0 到 1 的跨越。',
            rounds: [
              { date: '2022·06', round: '天使轮', valuation: '估值 ¥1 亿', amount: '¥1,000万' },
              { date: '2023·03', round: 'Pre-A', valuation: '估值 ¥5 亿', amount: '¥5,000万' },
              { date: '2024·01', round: 'A 轮', valuation: '估值 ¥20 亿', amount: '¥1.5亿' }
            ],
            quote: 'AI 不是要替代人做 PPT，而是把创意从格式中解放出来。',
            quoteAuthor: '李雷，联合创始人兼 CEO',
            footnote: '数据来源：公司公开披露与媒体整理。'
          };
        } else if (layoutId === 'theme01_spotlight_grid') {
          slide.props = {
            kicker: '主题聚焦',
            title: '钱，最终砸向了这三件事',
            subtitle: '资金集中流向模型能力、应用场景与基础设施',
            columns: [
              { tag: '模型能力', title: '通用大模型', description: '头部厂商持续加码基座模型，规模效应显现。' },
              { tag: '应用场景', title: '垂直应用', description: '办公、设计、编程等场景率先跑出商业化路径。' },
              { tag: '基础设施', title: 'AI 基础设施', description: '算力、数据与工具链成为支撑上层创新的关键底座。' }
            ]
          };
        } else if (layoutId === 'theme02_chapter_v1') {
          slide.props = {
            kicker: '章节',
            number: '01',
            title: '核心发现',
            subtitle: '从数据到洞察的关键转折'
          };
        } else if (layoutId === 'theme02_content_v1') {
          slide.props = {
            kicker: '要点总结',
            title: '内容标题',
            subtitle: '用霓虹 bullet 列表突出关键信息',
            bullets: [
              '全栈 AI 演示生成，从大纲到成稿一键完成',
              '双配色方案自由切换，适配不同品牌调性',
              'SVG 图表 + 洞察面板，数据表达更聚焦'
            ]
          };
        } else {
          slide.props = { title: '内容标题', points: ['新要点'] };
        }
        break;
      }
      case 'chart': {
        if (layoutId === 'theme01_chart_treemap') {
          slide.props = {
            title: '图表标题',
            kicker: '矩形树图',
            unit: '',
            data: [
              { name: '分类 A', value: 400, children: [
                { name: 'A-1', value: 200 },
                { name: 'A-2', value: 150 },
                { name: 'A-3', value: 50 }
              ]},
              { name: '分类 B', value: 300, children: [
                { name: 'B-1', value: 180 },
                { name: 'B-2', value: 120 }
              ]}
            ]
          };
        } else if (layoutId === 'theme01_chart_sankey') {
          slide.props = {
            title: '图表标题',
            kicker: '桑基图',
            data: [
              { source: '访问', target: '点击', value: 5000 },
              { source: '点击', target: '咨询', value: 3500 },
              { source: '咨询', target: '订单', value: 2200 },
              { source: '访问', target: '跳出', value: 1500 },
              { source: '点击', target: '离开', value: 1000 },
              { source: '咨询', target: '流失', value: 1300 }
            ]
          };
        } else if (layoutId === 'theme01_chart_sunburst') {
          slide.props = {
            title: '图表标题',
            kicker: '旭日图',
            data: [
              { name: '线上', value: 600, children: [
                { name: '搜索', value: 300 },
                { name: '社交', value: 200 },
                { name: '直访', value: 100 }
              ]},
              { name: '线下', value: 400, children: [
                { name: '门店', value: 250 },
                { name: '代理', value: 150 }
              ]}
            ]
          };
        } else if (layoutId === 'theme01_chart_gauge') {
          slide.props = {
            title: '图表标题',
            kicker: '仪表盘',
            value: 78,
            min: 0,
            max: 100,
            unit: '%'
          };
        } else if (layoutId === 'theme01_chart_heatmap') {
          slide.props = {
            title: '图表标题',
            kicker: '热力图',
            xAxis: ['A', 'B', 'C', 'D'],
            yAxis: ['W1', 'W2', 'W3'],
            data: [
              ['A', 'W1', 12], ['B', 'W1', 45], ['C', 'W1', 78], ['D', 'W1', 23],
              ['A', 'W2', 67], ['B', 'W2', 89], ['C', 'W2', 34], ['D', 'W2', 56],
              ['A', 'W3', 91], ['B', 'W3', 15], ['C', 'W3', 66], ['D', 'W3', 40]
            ]
          };
        } else if (layoutId === 'theme01_chart_funnel') {
          slide.props = {
            title: '图表标题',
            kicker: '漏斗图',
            data: [
              { name: '访问', value: 10000 },
              { name: '意向', value: 6500 },
              { name: '询价', value: 4200 },
              { name: '成交', value: 2800 }
            ]
          };
        } else if (layoutId === 'theme01_chart_radar') {
          slide.props = {
            title: '图表标题',
            kicker: '雷达图',
            indicators: [
              { name: '性能', max: 100 },
              { name: '稳定性', max: 100 },
              { name: '易用性', max: 100 },
              { name: '扩展性', max: 100 },
              { name: '安全性', max: 100 }
            ],
            data: [
              { name: '当前', value: [85, 90, 78, 88, 82] },
              { name: '目标', value: [95, 95, 90, 92, 95] }
            ]
          };
        } else if (layoutId === 'theme01_chart_graph') {
          slide.props = {
            title: '图表标题',
            kicker: '关系图',
            categories: [
              { name: '核心' },
              { name: '产品' },
              { name: '技术' }
            ],
            nodes: [
              { name: '平台', value: 80, category: 0 },
              { name: '用户端', value: 50, category: 1 },
              { name: '管理端', value: 45, category: 1 },
              { name: '数据中台', value: 60, category: 2 },
              { name: 'AI 引擎', value: 70, category: 2 },
              { name: '渲染器', value: 55, category: 2 },
              { name: '模板库', value: 40, category: 1 }
            ],
            links: [
              { source: '平台', target: '用户端', value: 5 },
              { source: '平台', target: '管理端', value: 5 },
              { source: '平台', target: '数据中台', value: 8 },
              { source: '数据中台', target: 'AI 引擎', value: 6 },
              { source: 'AI 引擎', target: '渲染器', value: 4 },
              { source: '管理端', target: '模板库', value: 3 },
              { source: '用户端', target: '渲染器', value: 4 }
            ]
          };
        } else if (layoutId === 'theme01_chart_bar3d') {
          slide.props = {
            title: '图表标题',
            kicker: '3D 柱状图',
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            data: [120, 200, 150, 80]
          };
        } else if (layoutId === 'theme01_chart_wordcloud') {
          slide.props = {
            title: '图表标题',
            kicker: '词云',
            words: [
              { name: 'AI', value: 100 },
              { name: 'PPT', value: 90 },
              { name: '数据可视化', value: 85 },
              { name: '自动化', value: 80 },
              { name: '大屏', value: 75 },
              { name: '主题', value: 70 },
              { name: '模板', value: 65 },
              { name: '智能生成', value: 60 }
            ]
          };
        } else if (layoutId === 'theme01_chart_donut') {
          slide.props = {
            title: '赛道分布',
            kicker: '环形图',
            subtitle: '融资额占比',
            total: { value: '970 亿美元', label: '全年合计' },
            segments: [
              { label: '通用大模型', labelEn: 'General LLM', value: '420', percent: '43.3%', color: 'var(--lp-blue)' },
              { label: '垂直应用', labelEn: 'Vertical Apps', value: '245', percent: '25.3%', color: 'var(--lp-green)' },
              { label: 'AI 基础设施', labelEn: 'AI Infra', value: '198', percent: '20.4%', color: 'var(--lp-amber)' },
              { label: 'AI 芯片', labelEn: 'AI Chips', value: '97', percent: '10.0%', color: 'var(--lp-red)' },
              { label: '其他', labelEn: 'Others', value: '10', percent: '1.0%', color: 'var(--lp-violet)' }
            ]
          };
        } else if (layoutId === 'theme02_chart_funnel') {
          slide.props = {
            title: '资金集中度',
            kicker: '霓虹漏斗',
            subtitle: '资本如何向头部收敛',
            data: [
              { name: '全市场', value: 970 },
              { name: '头部 10 家', value: 232 },
              { name: 'Top 3', value: 181 },
              { name: '单笔最大', value: 66 }
            ],
            showInsight: true,
            insight: {
              value: '24%',
              label: '头部 10 家 = 全市场近 1/4',
              description: '少数独角兽反复获得巨额追加投资，头部格局已然确立。'
            },
            footnote: '数据来源：lemonPPT 内部统计 · 2026'
          };
        } else if (layoutId === 'theme02_chart_donut') {
          slide.props = {
            title: '赛道分布',
            kicker: '霓虹环形',
            subtitle: '融资额占比',
            total: { value: '970 亿美元', label: '全年合计' },
            segments: [
              { label: '通用大模型', labelEn: 'General LLM', value: '420', percent: '43.3%', color: 'var(--lp-accent)' },
              { label: '垂直应用', labelEn: 'Vertical Apps', value: '245', percent: '25.3%', color: 'var(--lp-accent-cool)' },
              { label: 'AI 基础设施', labelEn: 'AI Infra', value: '198', percent: '20.4%', color: 'var(--lp-accent-2)' },
              { label: 'AI 芯片', labelEn: 'AI Chips', value: '97', percent: '10.0%', color: 'var(--lp-violet)' },
              { label: '其他', labelEn: 'Others', value: '10', percent: '1.0%', color: 'var(--lp-cyan)' }
            ],
            footnote: '数据来源：lemonPPT 内部统计 · 2026',
            showInsight: true,
            insight: {
              value: '43.3%',
              label: '通用大模型占比最高',
              description: '通用大模型与垂直应用合计贡献近七成融资额，赛道头部效应明显。'
            }
          };
        } else if (layoutId === 'theme02_chart_heatmap') {
          slide.props = {
            title: '用户活跃度热力',
            kicker: '霓虹热力',
            xAxis: ['周一', '周二', '周三', '周四', '周五'],
            yAxis: ['00:00', '06:00', '12:00', '18:00'],
            data: [
              ['周一', '00:00', 120], ['周一', '06:00', 80], ['周一', '12:00', 320], ['周一', '18:00', 280],
              ['周二', '00:00', 90], ['周二', '06:00', 60], ['周二', '12:00', 350], ['周二', '18:00', 300],
              ['周三', '00:00', 100], ['周三', '06:00', 70], ['周三', '12:00', 380], ['周三', '18:00', 340],
              ['周四', '00:00', 110], ['周四', '06:00', 75], ['周四', '12:00', 360], ['周四', '18:00', 310],
              ['周五', '00:00', 130], ['周五', '06:00', 85], ['周五', '12:00', 400], ['周五', '18:00', 360]
            ],
            showInsight: true,
            insight: {
              value: '400',
              label: '周五 12:00 活跃度峰值',
              description: '工作日午间是用户活跃高峰，适合推送关键内容与运营活动。'
            }
          };
        } else if (layoutId === 'theme02_chart_radar') {
          slide.props = {
            title: '能力雷达对比',
            kicker: '霓虹雷达',
            indicators: [
              { name: '性能', max: 100 },
              { name: '稳定性', max: 100 },
              { name: '易用性', max: 100 },
              { name: '扩展性', max: 100 },
              { name: '安全性', max: 100 }
            ],
            data: [
              { name: '当前', value: [85, 90, 78, 88, 82] },
              { name: '目标', value: [95, 95, 90, 92, 95] }
            ],
            showInsight: true,
            insight: {
              value: '84.6',
              label: '当前综合能力均分',
              description: '性能与稳定性表现突出，易用性仍有提升空间，建议优先优化交互流程。'
            }
          };
        } else if (layoutId === 'theme02_chart_gauge') {
          slide.props = {
            title: '年度目标达成率',
            kicker: '霓虹仪表',
            value: 78,
            min: 0,
            max: 100,
            unit: '%',
            showInsight: true,
            insight: {
              value: '+22%',
              label: '较上月提升',
              description: '年度目标完成率已接近 80%，按当前增速预计下季度可超额达成。'
            }
          };
        } else if (layoutId === 'theme02_chart_v1') {
          slide.props = {
            title: '季度营收增长',
            kicker: '霓虹图表',
            subtitle: '全年四个季度持续上扬',
            type: 'bar',
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            data: [1800, 2450, 3200, 4150],
            unit: '万元',
            showInsight: true,
            insight: {
              headline: '11,600',
              subheadline: 'FULL-YEAR TOTAL',
              items: [
                { label: 'Q4 环比', value: '+30%' },
                { label: '平均季度', value: '2,900' }
              ],
              badge: { text: 'Q4 增长最快', tone: 'accent' }
            }
          };
        } else {
          slide.props = { title: '图表标题', labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [20, 45, 70, 95] };
        }
        break;
      }
      case 'bento': {
        if (layoutId === 'theme02_bento_v1') {
          slide.props = {
            kicker: 'Bento',
            title: '模块化数据展示',
            subtitle: '用不规则网格突出关键数字',
            items: [
              { label: '年度营收', value: '1.2', unit: '亿元', size: 'large' },
              { label: '用户增长', value: '+320', unit: '%', size: 'medium' },
              { label: 'NPS', value: '72', unit: '分', size: 'small' },
              { label: '付费客户', value: '1,200', unit: '+', size: 'small' },
              { label: '模板数', value: '150', unit: '+', size: 'small' }
            ]
          };
        } else {
          slide.props = {
            kicker: 'Bento',
            title: '模块化展示',
            items: [
              { title: '核心指标', description: '关键数据一览', span: 'large' },
              { title: '用户增长', description: '月活跃用户持续提升', span: 'medium' },
              { title: '产品特性', description: '核心能力', span: 'small' },
              { title: '技术架构', description: '稳定可靠', span: 'small' }
            ]
          };
        }
        break;
      }
      case 'gallery': {
        if (layoutId === 'theme01_filmstrip_v1') {
          slide.props = {
            kicker: '影像长卷',
            title: '故事线',
            images: [
              { url: '', caption: '阶段一' },
              { url: '', caption: '阶段二' },
              { url: '', caption: '阶段三' },
              { url: '', caption: '阶段四' }
            ]
          };
        } else if (layoutId === 'theme02_gallery_v1') {
          slide.props = {
            kicker: '图集',
            title: '精选图片',
            subtitle: '用霓虹边框网格展示产品场景',
            images: [
              { url: '', caption: '图片说明 1' },
              { url: '', caption: '图片说明 2' },
              { url: '', caption: '图片说明 3' },
              { url: '', caption: '图片说明 4' }
            ]
          };
        } else {
          slide.props = {
            kicker: '图集',
            title: '精选图片',
            images: [
              { url: '', caption: '图片说明 1' },
              { url: '', caption: '图片说明 2' },
              { url: '', caption: '图片说明 3' },
              { url: '', caption: '图片说明 4' }
            ]
          };
        }
        break;
      }
      case 'table': {
        if (layoutId === 'theme01_table_data') {
          slide.props = {
            kicker: '数据表',
            title: '对比一览',
            columns: [
              { key: 'rank', label: '排名', align: 'left' },
              { key: 'company', label: '公司', align: 'left' },
              { key: 'track', label: '赛道', align: 'left' },
              { key: 'amount', label: '融资额', align: 'right' }
            ],
            rows: [
              { rank: '1', company: '柠檬科技', track: 'SaaS', amount: '¥5,000万' },
              { rank: '2', company: '青云数据', track: '云原生', amount: '¥3,200万' },
              { rank: '3', company: '红星智能', track: 'AI 硬件', amount: '¥2,800万' },
              { rank: '4', company: '蓝海资本', track: '金融科技', amount: '¥1,500万' }
            ],
            highlightRow: 0
          };
        } else if (layoutId === 'theme02_table_v1') {
          slide.props = {
            kicker: '数据表',
            title: '方案对比一览',
            subtitle: '多维度评估，辅助决策',
            headers: ['维度', '传统方式', '柠檬 PPT'],
            rows: [
              ['制作时间', '2-3 天', '10 分钟'],
              ['风格一致性', '依赖设计师', '主题系统保证'],
              ['数据更新', '手动修改', '联动刷新'],
              ['协作效率', '版本混乱', '实时协作'],
              ['导出格式', '单一', 'PPTX / PDF / 图片']
            ],
            highlightFirstColumn: true
          };
        } else {
          slide.props = {
            kicker: '数据表',
            title: '对比一览',
            headers: ['维度', '方案 A', '方案 B', '方案 C'],
            rows: [
              ['成本', '低', '中', '高'],
              ['性能', '中', '高', '高'],
              ['易用性', '高', '中', '低'],
              ['扩展性', '中', '高', '高']
            ],
            highlightFirstColumn: true
          };
        }
        break;
      }
      case 'tags': {
        if (layoutId === 'theme02_tags_v1') {
          slide.props = {
            kicker: '标签墙',
            title: '关键词云',
            subtitle: '一眼看懂用户最关心的能力',
            tags: [
              { label: 'AI', value: 98, tone: 'accent' },
              { label: '自动化', value: 85, tone: 'positive' },
              { label: '可视化', value: 72 },
              { label: '协作', value: 60 },
              { label: '云端', value: 55 },
              { label: '效率', value: 80, tone: 'positive' },
              { label: '设计', value: 45 },
              { label: '品牌', value: 38 },
              { label: 'PPTX', value: 65, tone: 'accent' },
              { label: '智能生成', value: 70 }
            ]
          };
        } else {
          slide.props = {
            kicker: '标签墙',
            title: '关键词云',
            tags: [
              { label: 'AI', value: 98, tone: 'accent' },
              { label: '自动化', value: 85, tone: 'positive' },
              { label: '可视化', value: 72 },
              { label: '协作', value: 60 },
              { label: '云端', value: 55 },
              { label: '效率', value: 80, tone: 'positive' },
              { label: '设计', value: 45 },
              { label: '品牌', value: 38 },
              { label: 'PPTX', value: 65, tone: 'accent' },
              { label: '智能生成', value: 70 }
            ]
          };
        }
        break;
      }
      case 'process': {
        if (layoutId === 'theme02_process_v1') {
          slide.props = {
            kicker: '实施路径',
            title: '四步上线',
            subtitle: '从需求到交付的标准化流程',
            steps: [
              { title: '需求梳理', description: '明确受众、目标与核心信息。' },
              { title: 'AI 生成', description: '输入主题，自动生成大纲与版式。' },
              { title: '视觉调优', description: '切换配色、替换图片、微调文案。' },
              { title: '导出交付', description: '一键导出 PPTX / PDF / 图片。' }
            ]
          };
        } else {
          slide.props = { title: '流程标题', steps: ['新步骤'] };
        }
        break;
      }
      case 'feature': {
        if (layoutId === 'theme02_feature_v1') {
          slide.props = {
            kicker: '产品特性',
            title: '为什么选择柠檬 PPT',
            subtitle: '从生成到交付，每个环节都更高效',
            features: [
              { title: 'AI 一键生成', description: '基于大模型自动理解需求，生成完整大纲与页面。' },
              { title: '主题系统', description: '深色霓虹、浅色玻璃等多种风格，全局一键切换。' },
              { title: '数据可视化', description: '内置 SVG 图表与洞察面板，数据表达更聚焦。' }
            ]
          };
        } else {
          slide.props = { title: '特性标题', features: [{ title: '新特性', description: '' }] };
        }
        break;
      }
      case 'stats': {
        if (layoutId === 'theme02_metrics_v1') {
          slide.props = {
            kicker: '数据墙',
            title: '核心指标一览',
            subtitle: '用霓虹卡片呈现关键业务数据',
            stats: [
              { label: '年度营收', value: '1.2', unit: '亿元', tone: 'accent' },
              { label: '用户增长', value: '+320', unit: '%', tone: 'cool' },
              { label: '客户满意度', value: '98', unit: '%', tone: 'accent2' },
              { label: '团队规模', value: '86', unit: '人', tone: 'default' }
            ]
          };
        } else if (layoutId === 'theme02_stats_v1') {
          slide.props = {
            kicker: '核心指标',
            title: '增长数据一览',
            subtitle: '用霓虹数字卡片突出关键成果',
            stats: [
              { label: '注册用户', value: '120K', unit: '+' },
              { label: '月活跃用户', value: '45K', unit: '+' },
              { label: '付费转化率', value: '8.5', unit: '%' },
              { label: '客户续费率', value: '92', unit: '%' },
              { label: '模板使用量', value: '2.4M', unit: '+' },
              { label: 'NPS 评分', value: '72', unit: '' }
            ]
          };
        } else {
          slide.props = { title: '数据标题', stats: [{ label: '指标', value: 0, unit: '', change: '' }] };
        }
        break;
      }
      case 'metric': {
        if (layoutId === 'theme01_metric_big') {
          slide.props = {
            kicker: '核心指标',
            title: '年度融资总额',
            subtitle: '全年大额融资事件汇总',
            value: '970',
            unit: '亿美元',
            context: '创历史新高，占全美风险投资近三分之一',
            metrics: [
              { value: '97', label: '事件笔数', accent: false },
              { value: '≈10 亿', label: '平均单笔', accent: false },
              { value: '+41%', label: 'Q4 环比', accent: true },
              { value: 'Q2-Q3', label: '高峰区间', accent: false }
            ]
          };
        } else if (layoutId === 'theme01_metric_triptych') {
          slide.props = {
            kicker: '指标总览',
            title: '关键数据三视图',
            subtitle: '规模、增速与质量的综合视角',
            panels: [
              { index: '01', title: '融资总额', value: '970 亿', subtitle: '全年累计规模创新高', chartType: 'bar', chartData: [120, 180, 320, 350] },
              { index: '02', title: '事件笔数', value: '97 笔', subtitle: '大额交易活跃度提升', chartType: 'line', chartData: [18, 22, 28, 29] },
              { index: '03', title: '平均单笔', value: '≈10 亿', subtitle: '单笔金额持续走高', chartType: 'area', chartData: [6.7, 8.2, 11.4, 12.1] }
            ]
          };
        } else if (layoutId === 'theme02_metric_big') {
          slide.props = {
            kicker: '核心指标',
            title: '年度融资总额',
            subtitle: '全年大额融资事件汇总',
            value: '970',
            unit: '亿美元',
            context: '创历史新高，占全美风险投资近三分之一',
            metrics: [
              { value: '97', label: '事件笔数', accent: false },
              { value: '≈10 亿', label: '平均单笔', accent: false },
              { value: '+41%', label: 'Q4 环比', accent: true },
              { value: 'Q2-Q3', label: '高峰区间', accent: false }
            ]
          };
        } else if (layoutId === 'theme02_progress_v1') {
          slide.props = {
            kicker: '达成度',
            title: '年度目标完成进度',
            subtitle: '关键 OKR 当前完成度',
            items: [
              { label: 'ARR 营收目标', value: 8400, max: 12000, unit: '万元' },
              { label: '企业客户签约', value: 320, max: 500, unit: '家' },
              { label: '产品 NPS', value: 72, max: 100, unit: '分' },
              { label: '团队规模', value: 86, max: 120, unit: '人' }
            ]
          };
        } else if (layoutId === 'theme02_delta_v1') {
          slide.props = {
            kicker: '今昔对照',
            title: '关键指标变化',
            subtitle: '去年同期 vs 当前表现',
            items: [
              { label: 'ARR 营收', previous: 4200, current: 8400, unit: '万元' },
              { label: '企业客户', previous: 120, current: 320, unit: '家' },
              { label: '产品 NPS', previous: 58, current: 72, unit: '分' },
              { label: '团队规模', previous: 45, current: 86, unit: '人' }
            ],
            footnote: '数据来源：公司财务与运营系统 · 2026'
          };
        } else {
          slide.props = { title: '指标标题', metrics: [{ label: '指标', value: '0', unit: '', change: '' }] };
        }
        break;
      }
      case 'comparison': {
        if (layoutId === 'theme01_diptych_contrast') {
          slide.props = {
            kicker: '双联对比',
            title: '模型能力 vs 应用落地',
            left: { label: '模型能力', labelEn: 'FOUNDATION MODEL', imageUrl: '' },
            right: { label: '应用落地', labelEn: 'APPLICATION', imageUrl: '' },
            centerCard: {
              title: '核心差异',
              comparisons: [
                { leftValue: '66%', leftLabel: '资本占比', rightValue: '25%', rightLabel: '资本占比' },
                { leftValue: '420 亿', leftLabel: '融资额', rightValue: '245 亿', rightLabel: '融资额' },
                { leftValue: '头部集中', leftLabel: '竞争格局', rightValue: '长尾分散', rightLabel: '竞争格局' }
              ],
              conclusion: '底层模型仍是资金主战场，但垂直应用的变现路径更清晰。'
            }
          };
        } else if (layoutId === 'theme02_comparison_v1') {
          slide.props = {
            kicker: '方案对比',
            title: '传统方式 vs 柠檬 PPT',
            subtitle: '从小时级到分钟级的效率跃迁',
            leftTitle: '传统 PPT 制作',
            rightTitle: '柠檬 PPT 生成',
            leftItems: ['手动排版耗时久', '风格难以统一', '协作版本混乱', '数据图表更新慢'],
            rightItems: ['AI 一键生成版式', '主题系统全局一致', '云端实时协作', '数据联动自动刷新']
          };
        } else {
          slide.props = { title: '对比标题', left: '左侧', right: '右侧' };
        }
        break;
      }
      case 'team': {
        if (layoutId === 'theme02_team_v1') {
          slide.props = {
            kicker: '核心团队',
            title: '我们是谁',
            subtitle: '一支相信技术与设计能改变演示的团队',
            members: [
              { name: '李雷', role: 'CEO', bio: '连续创业者，前头部 SaaS 产品负责人。' },
              { name: '韩梅梅', role: 'CTO', bio: '全栈工程师，专注 AI 与渲染引擎。' },
              { name: '林涛', role: '设计总监', bio: '十年品牌设计经验，深耕视觉系统。' },
              { name: '吉姆', role: '增长负责人', bio: '数据驱动增长，擅长 B2B 规模化获客。' }
            ]
          };
        } else {
          slide.props = { title: '团队', members: [{ name: '新成员', role: '', bio: '', imageUrl: '' }] };
        }
        break;
      }
      case 'timeline': {
        if (layoutId === 'theme02_timeline_v1') {
          slide.props = {
            kicker: '里程碑',
            title: '发展历程',
            subtitle: '从想法到产品的关键节点',
            milestones: [
              { date: '2022.06', title: '项目启动', description: '柠檬 PPT 立项，聚焦 AI 演示生成。' },
              { date: '2023.03', title: '产品上线', description: '首个版本发布，支持一键生成完整大纲。' },
              { date: '2024.01', title: '规模增长', description: '累计用户突破 10 万，企业客户签约。' },
              { date: '2025.09', title: '生态开放', description: '开放主题与模板市场，共建创作者生态。' }
            ]
          };
        } else {
          slide.props = { title: '时间线', events: [{ date: '', title: '新里程碑', description: '' }] };
        }
        break;
      }
      case 'faq': {
        if (layoutId === 'theme02_faq_v1') {
          slide.props = {
            kicker: '常见问题',
            title: '你可能想知道的',
            subtitle: '快速了解柠檬 PPT 的核心能力与使用方式',
            items: [
              { q: '柠檬 PPT 适合什么场景？', a: '融资路演、产品发布、季度汇报、培训课件等需要高质量演示的场合。' },
              { q: '生成后能否继续编辑？', a: '可以。编辑器支持直接修改文字、替换图片、调整配色与版式。' },
              { q: '导出格式有哪些？', a: '支持 PPTX、PDF 和高清图片导出，满足不同分发需求。' }
            ]
          };
        } else {
          slide.props = { title: '常见问题', items: [{ q: '问题', a: '回答' }] };
        }
        break;
      }
      case 'partners': {
        if (layoutId === 'theme02_partners_v1') {
          slide.props = {
            kicker: '合作伙伴',
            title: '他们都在使用',
            subtitle: '与领先企业共同推动演示方式升级',
            partners: [
              { name: '云智科技', logoUrl: '' },
              { name: '未来资本', logoUrl: '' },
              { name: '星辰数据', logoUrl: '' },
              { name: '蓝海传媒', logoUrl: '' },
              { name: '红石咨询', logoUrl: '' },
              { name: '极光设计', logoUrl: '' },
              { name: '万象集团', logoUrl: '' },
              { name: '银河创投', logoUrl: '' }
            ]
          };
        } else {
          slide.props = { title: '合作伙伴', partners: [{ name: '', logoUrl: '' }] };
        }
        break;
      }
      case 'roadmap': {
        if (layoutId === 'theme02_roadmap_v1') {
          slide.props = {
            kicker: '产品路线',
            title: '未来 12 个月规划',
            subtitle: '从基础能力到生态开放的清晰节奏',
            phases: [
              { phase: 'Q1 基础能力', items: ['编辑器内核重构', '主题系统 2.0', 'PPTX 导出优化'] },
              { phase: 'Q2 智能升级', items: ['AI 多轮对话生成', '自动配图与数据联动', '协作评论'] },
              { phase: 'Q3 企业场景', items: ['品牌资产中心', '权限与版本管理', '私有部署'] },
              { phase: 'Q4 生态开放', items: ['模板市场', '开发者 SDK', '开放主题协议'] }
            ]
          };
        } else {
          slide.props = { title: '路线图', phases: [{ phase: '阶段', items: ['里程碑'] }] };
        }
        break;
      }
      case 'pricing': {
        if (layoutId === 'theme02_pricing_v1') {
          slide.props = {
            kicker: '定价方案',
            title: '选择适合你的方案',
            subtitle: '从个人创作者到企业团队，灵活扩展',
            tiers: [
              {
                name: '免费版',
                price: '¥0',
                period: '/ 月',
                features: ['每月 10 次生成', '3 种基础主题', 'PNG 导出'],
                cta: '开始使用',
                highlight: false
              },
              {
                name: '专业版',
                price: '¥99',
                period: '/ 月',
                features: ['无限次生成', '全部主题与版式', 'PPTX / PDF 导出', '优先客服'],
                cta: '立即升级',
                highlight: true
              },
              {
                name: '团队版',
                price: '¥399',
                period: '/ 月',
                features: ['5 人协作', '品牌资产中心', 'API 接入', '专属客户成功'],
                cta: '联系销售',
                highlight: false
              }
            ]
          };
        } else {
          slide.props = { title: '定价', tiers: [{ name: '方案', price: '', period: '', features: [''], cta: '' }] };
        }
        break;
      }
      case 'image': {
        if (layoutId === 'theme02_image_v1') {
          slide.props = {
            kicker: '视觉呈现',
            title: '一张图讲清产品价值',
            subtitle: '上传高清大图，用霓虹渐变叠加打造科技感封面。',
            image: '',
            caption: '图注：产品界面示意图'
          };
        } else {
          slide.props = { title: '图片标题', subtitle: '副标题' };
        }
        break;
      }
      case 'swot': {
        if (layoutId === 'theme02_swot_v1') {
          slide.props = {
            kicker: '战略分析',
            title: 'SWOT 分析',
            subtitle: '看清内外部环境，制定下一步策略',
            strength: 'AI 生成能力领先，主题系统可扩展，社区活跃度高。',
            weakness: '品牌知名度仍在建立，部分高级版式依赖人工设计。',
            opportunity: '企业数字化汇报需求增长，AI 工具接受度提升。',
            threat: '大厂同类产品布局加速，用户审美要求持续提高。'
          };
        } else {
          slide.props = { title: 'SWOT 分析', strength: '优势', weakness: '劣势', opportunity: '机会', threat: '威胁' };
        }
        break;
      }
      case 'pest': {
        if (layoutId === 'theme02_pest_v1') {
          slide.props = {
            kicker: '宏观分析',
            title: 'PEST 分析',
            subtitle: '从政策、经济、社会、技术四维度洞察环境',
            political: 'AI 内容生成监管框架逐步完善，合规化成为产品准入门槛。',
            economic: '企业降本增效需求强烈，数字化工具预算占比持续提升。',
            social: '远程协作常态化，对轻量化、可分享演示内容的需求激增。',
            technological: '大模型多模态能力快速进步，文本到幻灯片的生成质量显著提高。'
          };
        } else {
          slide.props = { title: 'PEST 分析', political: '政治环境', economic: '经济环境', social: '社会环境', technological: '技术环境' };
        }
        break;
      }
      case 'testimonial': {
        if (layoutId === 'theme02_testimonial_v1') {
          slide.props = {
            kicker: '客户评价',
            quote: '柠檬 PPT 帮助我们把汇报制作时间从 2 天缩短到 2 小时，团队可以把更多精力放在业务思考上。',
            author: '陈晓明',
            role: '产品总监',
            company: '未来科技有限公司',
            avatarUrl: ''
          };
        } else {
          slide.props = { kicker: '客户评价', quote: '产品帮助我们把汇报效率提升了 3 倍。', author: '张三', role: '产品经理', company: '示例科技' };
        }
        break;
      }
      case 'tableOfContents': {
        if (layoutId === 'theme02_table_of_contents_v1') {
          slide.props = {
            title: '目录',
            subtitle: 'CONTENTS',
            items: [
              { title: '市场背景与机会', page: '02' },
              { title: '产品方案与优势', page: '04' },
              { title: '商业模式与增长', page: '06' },
              { title: '团队与融资计划', page: '08' }
            ]
          };
        } else {
          slide.props = { title: '目录', items: ['目录项'] };
        }
        break;
      }
    }
    return slide;
  }

  const addSlideBtn = document.getElementById('lp-add-slide');
  const addSlideModal = document.getElementById('lp-add-slide-modal');
  const addSlideConfirm = document.getElementById('lp-add-slide-confirm');
  let selectedLayoutId = null;
  let selectedRole = null;

  function closeAddSlideModal() {
    if (addSlideModal) addSlideModal.setAttribute('hidden', '');
    addSlideModal?.querySelectorAll('.lp-add-slide-option').forEach((el) => el.classList.remove('selected'));
    selectedLayoutId = null;
    selectedRole = null;
    if (addSlideConfirm) addSlideConfirm.disabled = true;
  }

  function openAddSlideModal() {
    if (addSlideModal) addSlideModal.removeAttribute('hidden');
  }

  function confirmAddSlide() {
    if (!selectedLayoutId) return;
    const newSlide = createDefaultSlide(selectedLayoutId, selectedRole || selectedLayoutId.split('_')[0]);
    recordHistory();
    goal.slides.push(newSlide);
    selectedSlideIdx = goal.slides.length - 1;
    // current 会在 rebuildSlidesAndThumbnails 中同步，避免在 DOM 重建前访问越界
    autoSave();
    closeAddSlideModal();
    reloadEditor();
  }

  if (addSlideBtn) {
    addSlideBtn.addEventListener('click', openAddSlideModal);
  }

  if (addSlideModal) {
    addSlideModal.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('[data-close-modal]')) {
        closeAddSlideModal();
        return;
      }
      const option = target.closest('.lp-add-slide-option');
      if (option) {
        addSlideModal.querySelectorAll('.lp-add-slide-option').forEach((el) => el.classList.remove('selected'));
        option.classList.add('selected');
        selectedLayoutId = option.getAttribute('data-layout');
        selectedRole = option.getAttribute('data-role');
        if (addSlideConfirm) addSlideConfirm.disabled = false;
      }
    });
  }

  if (addSlideConfirm) {
    addSlideConfirm.addEventListener('click', confirmAddSlide);
  }

  updateUndoRedoButtons();

  // 翻页脚本
  let slides = Array.from(document.querySelectorAll('.lp-slide-wrapper'));
  let thumbnails = Array.from(document.querySelectorAll('.lp-thumbnail'));
  const prevBtn = document.getElementById('lp-prev');
  const nextBtn = document.getElementById('lp-next');
  const currentLabel = document.getElementById('lp-current');
  const deck = document.querySelector('.lp-deck');
  let current = 0;
  let isTransitioning = false;
  let cleanupTimer = null;
  let dragSrcIndex = null;
  let dragDropIndicator = null;

  function refreshSlidesAndThumbnails() {
    slides = Array.from(document.querySelectorAll('.lp-slide-wrapper'));
    thumbnails = Array.from(document.querySelectorAll('.lp-thumbnail'));
  }

  function updateEditorUI() {
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });
    const activeThumb = thumbnails[current];
    if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const labelEl = document.getElementById('lp-current');
    if (labelEl) labelEl.textContent = String(current + 1);
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
    updateEditorUI();
  }

  function goTo(index) {
    if (index === current || index < 0 || index >= slides.length || isTransitioning) {
      return;
    }
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
      if (typeof selectSlide === 'function') selectSlide(current);
      // 切页后释放离开 slide 的图表并仅初始化新 active slide 的 ECharts。
      requestAnimationFrame(() => {
        disposeEChartsInWrapper(leaving);
        initActiveSlideECharts();
      });
      return;
    }

    isTransitioning = true;
    current = index;
    updateEditorUI();

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
      // 动画结束后释放离开 slide 的图表，并仅对当前 active slide 的 ECharts 进行 resize/初始化
      requestAnimationFrame(() => {
        disposeEChartsInWrapper(leaving);
        initActiveSlideECharts();
      });
    }
    entering.addEventListener('transitionend', finish);
    cleanupTimer = setTimeout(finish, 600);

    if (typeof selectSlide === 'function') selectSlide(current);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  const deleteConfirmToast = document.getElementById('lp-delete-confirm-toast');
  const deleteConfirmText = document.getElementById('lp-delete-confirm-text');
  const deleteConfirmCancel = document.getElementById('lp-delete-confirm-cancel');
  const deleteConfirmConfirm = document.getElementById('lp-delete-confirm-confirm');
  let pendingDeleteIndex = null;

  function showDeleteConfirm(index, triggerEl) {
    if (goal.slides.length <= 1) {
      alert('至少保留一页幻灯片。');
      return;
    }
    pendingDeleteIndex = index;
    if (deleteConfirmText) {
      deleteConfirmText.textContent = '确定删除第 ' + (index + 1) + ' 页幻灯片？';
    }
    if (deleteConfirmToast) {
      deleteConfirmToast.removeAttribute('hidden');
      positionDeleteConfirmToast(triggerEl);
    }
  }

  function positionDeleteConfirmToast(triggerEl) {
    if (!deleteConfirmToast || !triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const toastRect = deleteConfirmToast.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8;
    let top = rect.bottom + gap;
    let left = rect.left + rect.width / 2 - toastRect.width / 2;
    if (left < gap) left = gap;
    if (left + toastRect.width > viewportWidth - gap) {
      left = viewportWidth - toastRect.width - gap;
    }
    if (top + toastRect.height > viewportHeight - gap) {
      top = rect.top - toastRect.height - gap;
    }
    deleteConfirmToast.style.top = top + 'px';
    deleteConfirmToast.style.left = left + 'px';
  }

  function hideDeleteConfirm() {
    pendingDeleteIndex = null;
    if (deleteConfirmToast) {
      deleteConfirmToast.setAttribute('hidden', '');
      deleteConfirmToast.style.top = '';
      deleteConfirmToast.style.left = '';
    }
  }

  function confirmDelete() {
    if (pendingDeleteIndex == null) return;
    const index = pendingDeleteIndex;
    hideDeleteConfirm();
    recordHistory();
    goal.slides.splice(index, 1);
    selectedSlideIdx = Math.min(index, goal.slides.length - 1);
    // current 会在 rebuildSlidesAndThumbnails 中同步
    autoSave();
    reloadEditor();
  }

  if (deleteConfirmCancel) {
    deleteConfirmCancel.addEventListener('click', hideDeleteConfirm);
  }
  if (deleteConfirmConfirm) {
    deleteConfirmConfirm.addEventListener('click', confirmDelete);
  }
  if (deleteConfirmToast) {
    deleteConfirmToast.addEventListener('click', (e) => {
      if (e.target === deleteConfirmToast) {
        hideDeleteConfirm();
      }
    });
  }

  function attachThumbnailListeners() {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest && e.target.closest('.lp-thumbnail-delete');
        if (deleteBtn) {
          e.stopPropagation();
          const index = Number(deleteBtn.getAttribute('data-index'));
          showDeleteConfirm(index, deleteBtn);
          return;
        }
        goTo(Number(thumb.dataset.index));
      });

      // 缩略图改为 div 后，补充键盘选中支持
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(Number(thumb.dataset.index));
        }
      });
    });
  }
  attachThumbnailListeners();

  // 缩略图虚拟滚动：用 IntersectionObserver 卸载视口外 slide 渲染 DOM，仅保留占位框架与文字信息。
  const thumbnailRenderCache = {};
  let thumbnailObserver = null;

  function getThumbnailCacheKey(thumb) {
    return 'thumb-' + thumb.dataset.index;
  }

  function mountThumbnailRender(thumb) {
    const render = thumb.querySelector('.lp-thumbnail-render');
    if (!render) return;
    if (thumb.dataset.lpThumbMounted === 'true') return;
    const key = getThumbnailCacheKey(thumb);
    const html = thumbnailRenderCache[key];
    if (html != null) {
      render.innerHTML = html;
    }
    thumb.dataset.lpThumbMounted = 'true';
  }

  function unmountThumbnailRender(thumb) {
    const render = thumb.querySelector('.lp-thumbnail-render');
    if (!render) return;
    if (thumb.dataset.lpThumbMounted === 'false') return;
    const key = getThumbnailCacheKey(thumb);
    thumbnailRenderCache[key] = render.innerHTML;
    render.innerHTML = '';
    thumb.dataset.lpThumbMounted = 'false';
  }

  function initThumbnailVirtualScroll() {
    const container = document.querySelector('.lp-editor-left-panel');
    if (!container || !('IntersectionObserver' in window)) return;

    if (thumbnailObserver) {
      thumbnailObserver.disconnect();
      thumbnailObserver = null;
    }

    // 默认所有缩略图处于挂载状态
    thumbnails.forEach((thumb) => {
      thumb.dataset.lpThumbMounted = 'true';
    });

    thumbnailObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const thumb = entry.target;
        const index = Number(thumb.dataset.index);
        // 当前激活页始终保留渲染，避免切换时白屏
        if (index === current || entry.isIntersecting) {
          mountThumbnailRender(thumb);
        } else {
          unmountThumbnailRender(thumb);
        }
      });
    }, {
      root: container,
      rootMargin: '200px 0px 200px 0px',
      threshold: 0,
    });

    thumbnails.forEach((thumb) => thumbnailObserver.observe(thumb));
  }

  function disconnectThumbnailVirtualScroll() {
    if (thumbnailObserver) {
      thumbnailObserver.disconnect();
      thumbnailObserver = null;
    }
  }
  initThumbnailVirtualScroll();

  function attachDragAndDropListeners() {
    const container = document.querySelector('.lp-editor-thumbnails');
    if (!container) return;

    function getOrCreateDropIndicator() {
      if (dragDropIndicator && dragDropIndicator.parentElement) return dragDropIndicator;
      dragDropIndicator = document.createElement('div');
      dragDropIndicator.className = 'lp-thumbnail-drop-indicator';
      container.appendChild(dragDropIndicator);
      return dragDropIndicator;
    }

    function clearDragState() {
      dragSrcIndex = null;
      thumbnails.forEach((t) => t.classList.remove('dragging', 'drag-over'));
      if (dragDropIndicator) dragDropIndicator.classList.remove('visible');
    }

    function positionDropIndicator(target, before) {
      const indicator = getOrCreateDropIndicator();
      if (!indicator || !target) return;
      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const top = before ? rect.top - containerRect.top - 1 : rect.bottom - containerRect.top - 1;
      indicator.style.top = top + 'px';
      indicator.classList.add('visible');
    }

    container.addEventListener('dragstart', (e) => {
      const thumb = e.target && e.target.closest && e.target.closest('.lp-thumbnail');
      if (!thumb) return;
      // 点击删除按钮时不应触发拖拽
      const deleteBtn = e.target.closest && e.target.closest('.lp-thumbnail-delete');
      if (deleteBtn) {
        e.preventDefault();
        return;
      }
      if (isTransitioning || goal.slides.length <= 1) {
        e.preventDefault();
        return;
      }
      const src = Number(thumb.dataset.index);
      if (Number.isNaN(src)) return;
      dragSrcIndex = src;
      hideDeleteConfirm();
      thumb.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(src));
        try {
          e.dataTransfer.setDragImage(thumb, 16, 16);
        } catch (_) {}
      }
    });

    container.addEventListener('dragover', (e) => {
      if (dragSrcIndex == null) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      const targetThumb = e.target && e.target.closest && e.target.closest('.lp-thumbnail');
      const indicator = getOrCreateDropIndicator();
      if (!targetThumb) {
        const lastThumb = container.querySelector('.lp-thumbnail:last-child');
        if (lastThumb && dragSrcIndex !== goal.slides.length - 1) {
          positionDropIndicator(lastThumb, false);
        } else {
          indicator.classList.remove('visible');
        }
        thumbnails.forEach((t) => t.classList.remove('drag-over'));
        return;
      }
      const targetIndex = Number(targetThumb.dataset.index);
      if (Number.isNaN(targetIndex)) return;
      const rect = targetThumb.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      if (targetIndex === dragSrcIndex) {
        indicator.classList.remove('visible');
        targetThumb.classList.remove('drag-over');
        return;
      }
      thumbnails.forEach((t) => t.classList.remove('drag-over'));
      targetThumb.classList.add('drag-over');
      positionDropIndicator(targetThumb, before);
    });

    container.addEventListener('dragleave', (e) => {
      if (dragSrcIndex == null) return;
      if (!container.contains(e.relatedTarget)) {
        if (dragDropIndicator) dragDropIndicator.classList.remove('visible');
        thumbnails.forEach((t) => t.classList.remove('drag-over'));
      }
    });

    container.addEventListener('drop', (e) => {
      if (dragSrcIndex == null) return;
      e.preventDefault();
      const src = dragSrcIndex;
      const targetThumb = e.target && e.target.closest && e.target.closest('.lp-thumbnail');
      let targetIndex = 0;
      let insertBefore = true;
      if (targetThumb) {
        targetIndex = Number(targetThumb.dataset.index);
        const rect = targetThumb.getBoundingClientRect();
        insertBefore = e.clientY < rect.top + rect.height / 2;
      } else {
        targetIndex = goal.slides.length - 1;
        insertBefore = false;
      }
      if (Number.isNaN(targetIndex) || src === targetIndex) {
        clearDragState();
        return;
      }
      let insertAt = targetIndex;
      if (insertBefore) {
        if (src < targetIndex) insertAt = targetIndex - 1;
      } else {
        if (src > targetIndex) insertAt = targetIndex + 1;
      }
      const activeSlide = goal.slides[current];
      const movingSlide = goal.slides[src];
      const newSlides = goal.slides.filter((_, i) => i !== src);
      insertAt = Math.max(0, Math.min(insertAt, newSlides.length));
      newSlides.splice(insertAt, 0, movingSlide);
      goal.slides = newSlides;
      recordHistory();
      selectedSlideIdx = goal.slides.indexOf(activeSlide);
      current = selectedSlideIdx;
      autoSave();
      rebuildSlidesAndThumbnails();
      if (typeof selectSlide === 'function') selectSlide(current);
      clearDragState();
    });

    container.addEventListener('dragend', () => {
      clearDragState();
    });
  }
  attachDragAndDropListeners();

  function deleteSlide(index) {
    if (goal.slides.length <= 1) {
      alert('至少保留一页幻灯片。');
      return;
    }
    const deleteBtn = document.querySelector('.lp-thumbnail-delete[data-index="' + index + '"]');
    showDeleteConfirm(index, deleteBtn);
  }

  document.addEventListener('keydown', (e) => {
    if (isEditingTarget(e.target) || isEditingTarget(document.activeElement)) return;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const mod = isMac ? e.metaKey : e.ctrlKey;

    // 关闭删除确认气泡
    if (e.key === 'Escape' && pendingDeleteIndex != null) {
      e.preventDefault();
      hideDeleteConfirm();
      return;
    }

    // 撤销 / 重做
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
      return;
    }

    // 翻页导航
    if (isTransitioning || slides.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(current - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  });

  updateClasses();

  // 缩放控制
  const stage = document.querySelector('.lp-editor-stage');
  const scaler = document.querySelector('.lp-editor-stage-scaler');
  const editorRoot = document.querySelector('.lp-editor-root');
  const zoomSlider = document.getElementById('lp-zoom-slider');
  const zoomValue = document.getElementById('lp-zoom-value');
  const zoomOutBtn = document.getElementById('lp-zoom-out');
  const zoomInBtn = document.getElementById('lp-zoom-in');
  const zoomFitBtn = document.getElementById('lp-zoom-fit');
  let userZoom = null;

  const SLIDE_WIDTH = 1280;
  const SLIDE_HEIGHT = 720;

  function fitScale() {
    if (!stage || !scaler) return 1;
    return Math.min(stage.clientWidth / SLIDE_WIDTH, stage.clientHeight / SLIDE_HEIGHT) * 0.92;
  }

  function updateScale() {
    if (!stage || !scaler) return;
    if (editorRoot && editorRoot.classList.contains('lp-editor-presentation-mode')) {
      const scale = Math.min(window.innerWidth / SLIDE_WIDTH, window.innerHeight / SLIDE_HEIGHT);
      scaler.style.setProperty('--lp-presentation-scale', String(Math.max(scale, 0.35)));
      scaler.style.transform = '';
      return;
    }
    const scale = userZoom == null ? fitScale() : userZoom;
    scaler.style.transform = 'scale(' + Math.max(scale, 0.35) + ')';
    scaler.style.removeProperty('--lp-presentation-scale');
    if (zoomValue) zoomValue.textContent = Math.round(scale * 100) + '%';
    if (zoomSlider && userZoom != null) zoomSlider.value = String(Math.round(scale * 100));
  }

  if (zoomSlider) {
    zoomSlider.addEventListener('input', () => {
      userZoom = Number(zoomSlider.value) / 100;
      updateScale();
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      userZoom = (userZoom == null ? fitScale() : userZoom) - 0.1;
      if (userZoom < 0.35) userZoom = 0.35;
      updateScale();
    });
  }
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      userZoom = (userZoom == null ? fitScale() : userZoom) + 0.1;
      if (userZoom > 1.5) userZoom = 1.5;
      updateScale();
    });
  }
  if (zoomFitBtn) {
    zoomFitBtn.addEventListener('click', () => {
      userZoom = null;
      updateScale();
    });
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // 播放：进入全屏演示模式，使用当前编辑状态直接播放
  const playBtn = document.getElementById('lp-play');
  let presentationExitBtn = null;
  let presentationKeyHandler = null;

  let isExitingPresentation = false;

  function exitPresentationMode() {
    if (!editorRoot || isExitingPresentation) return;
    isExitingPresentation = true;
    editorRoot.classList.remove('lp-editor-presentation-mode');
    if (presentationExitBtn && presentationExitBtn.parentNode) {
      presentationExitBtn.parentNode.removeChild(presentationExitBtn);
      presentationExitBtn = null;
    }
    if (presentationKeyHandler) {
      document.removeEventListener('keydown', presentationKeyHandler);
      presentationKeyHandler = null;
    }
    const done = () => {
      isExitingPresentation = false;
      updateScale();
    };
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {}).finally(done);
    } else {
      done();
    }
  }

  async function enterPresentationMode() {
    if (!editorRoot) return;
    editorRoot.classList.add('lp-editor-presentation-mode');
    updateScale();
    try {
      const target = editorRoot.requestFullscreen ? editorRoot : document.documentElement;
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      }
    } catch (err) {
      console.warn('进入全屏失败，将以窗口演示模式播放', err);
    }
    if (!presentationExitBtn) {
      presentationExitBtn = document.createElement('button');
      presentationExitBtn.className = 'lp-editor-presentation-exit';
      presentationExitBtn.textContent = '退出演示 (Esc)';
      presentationExitBtn.type = 'button';
      presentationExitBtn.addEventListener('click', exitPresentationMode);
      document.body.appendChild(presentationExitBtn);
    }
    if (!presentationKeyHandler) {
      presentationKeyHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          exitPresentationMode();
        }
      };
      document.addEventListener('keydown', presentationKeyHandler);
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && editorRoot && editorRoot.classList.contains('lp-editor-presentation-mode')) {
      exitPresentationMode();
    }
  });

  if (playBtn) {
    playBtn.addEventListener('click', enterPresentationMode);
  }

  // 内容结构变更后重新渲染当前编辑器（仅用于数组增删等模板内容调整）
  function saveCurrentForReload() {
    try {
      localStorage.setItem('lemonppt:editor:currentSlide', String(selectedSlideIdx));
    } catch (e) {}
  }

  function getSlideLabel(slide) {
    const props = slide.props || {};
    const candidates = [
      props.title,
      props.name,
      props.kicker,
      props.quote,
      props.heading,
      props.items && Array.isArray(props.items) ? props.items[0] : undefined,
      props.metric,
      props.value,
    ];
    for (const c of candidates) {
      if (c !== undefined && c !== null && String(c).trim()) return String(c).trim();
    }
    return slide.layout;
  }

  // 静态文件模式下，增删幻灯片后不再使用 document.write 重写整页（会中断 CSS/资源加载），
  // 而是直接在现有 DOM 中重建 slide 容器和缩略图，并复用 React root 重新渲染内容。
  function rebuildSlidesAndThumbnails() {
    if (!deck) return;
    if (typeof window.__lemonPPT_renderSlideHtml !== 'function') return;

    // DOM 重建前将 current 同步到合法范围，避免后续 goTo/updateClasses 越界
    current = Math.max(0, Math.min(selectedSlideIdx, goal.slides.length - 1));

    const firstWrapper = slides[0];
    const width = firstWrapper ? parseInt(firstWrapper.style.width, 10) || 1280 : 1280;
    const height = firstWrapper ? parseInt(firstWrapper.style.height, 10) || 720 : 720;
    const theme = goal.theme || 'theme01';

    // 重建 deck 中的 slide 容器
    const wrappersHtml = goal.slides.map((slide, index) => {
      const slideHtml = window.__lemonPPT_renderSlideHtml(slide, { slideIdx: index, editable: true, theme });
      const stateClass = index === current ? 'active' : (index < current ? 'prev' : '');
      const transition = String((slide.props && slide.props.transition) || 'none');
      return '<div class="lp-slide-wrapper ' + stateClass + '" data-slide-index="' + index + '" data-layout="' + slide.layout + '" data-lp-transition="' + transition + '" style="width:' + width + 'px;height:' + height + 'px;box-sizing:border-box;">' + slideHtml + '</div>';
    }).join('');
    deck.innerHTML = wrappersHtml;

    // 重建左侧缩略图
    const thumbnailsContainer = document.querySelector('.lp-editor-thumbnails');
    if (thumbnailsContainer) {
      const thumbInnerWidth = 156;
      const scale = thumbInnerWidth / width;
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
      const buttonsHtml = goal.slides.map((slide, index) => {
        const label = getSlideLabel(slide);
        const activeClass = index === current ? 'active' : '';
        const slideHtml = window.__lemonPPT_renderSlideHtml(slide, { slideIdx: index, editable: true, theme });
        const draggableAttr = goal.slides.length > 1 ? 'draggable="true"' : '';
        return '<div class="lp-thumbnail ' + activeClass + '" data-index="' + index + '" role="button" tabindex="0" ' + draggableAttr + ' aria-label="幻灯片 ' + (index + 1) + '，拖动可调整顺序">' +
          dragHandleHtml +
          '<div class="lp-thumbnail-render">' +
            '<div class="lp-thumbnail-scaler" style="width:' + width + 'px;height:' + height + 'px;transform:scale(' + scale + ');transform-origin:top left;">' + slideHtml + '</div>' +
          '</div>' +
          '<div class="lp-thumbnail-scrim"></div>' +
          '<div class="lp-thumbnail-content">' +
            '<div class="lp-thumbnail-index">' + (index + 1) + ' / ' + goal.slides.length + '</div>' +
            '<div class="lp-thumbnail-title">' + escapeHtml(label) + '</div>' +
            '<div class="lp-thumbnail-layout">' + escapeHtml(slide.layout) + '</div>' +
          '</div>' +
          '<span class="lp-thumbnail-delete" data-lp-action="delete-slide" data-index="' + index + '" title="删除幻灯片" aria-label="删除幻灯片">×</span>' +
        '</div>';
      }).join('');
      thumbnailsContainer.innerHTML = buttonsHtml;
      // 缩略图 DOM 重建后清空虚拟滚动缓存，避免旧 HTML 与新索引错位
      Object.keys(thumbnailRenderCache).forEach((key) => {
        delete thumbnailRenderCache[key];
      });
    }

    // 同步页码计数器
    const pageCounter = document.querySelector('.lp-editor-page-counter');
    if (pageCounter) {
      pageCounter.innerHTML = '<span id="lp-current">' + (current + 1) + '</span> / ' + goal.slides.length;
    }

    refreshSlidesAndThumbnails();
    attachThumbnailListeners();
    updateClasses();
    renderAllSlidesToRoot();
    initThumbnailVirtualScroll();
  }

  function refreshCurrentSlide() {
    if (typeof window.__lemonPPT_renderSlideToRoot === 'function') {
      renderCurrentSlideToRoot();
    } else {
      // 兜底：旧版静态 HTML 替换
      const wrapper = document.querySelector('.lp-slide-wrapper.active');
      if (!wrapper) return;
      const slide = goal.slides[selectedSlideIdx];
      if (!slide) return;
      if (typeof window.__lemonPPT_disposeECharts === 'function') {
        window.__lemonPPT_disposeECharts();
      }
      const html = window.__lemonPPT_renderSlideHtml(slide, { slideIdx: selectedSlideIdx, editable: true, theme: goal.theme });
      wrapper.innerHTML = html;
      initActiveSlideECharts();
    }
  }

  async function reloadEditor() {
    saveCurrentForReload();

    // 优先尝试服务器端重新渲染（开发服务器模式）
    try {
      const res = await fetch('/api/render-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('重新渲染失败: ' + res.status);
      window.location.reload();
      return;
    } catch (err) {
      // 静态文件模式下，直接在当前 DOM 中重建 slide 容器和缩略图，
      // 避免 document.write 中断 CSS/资源加载导致幻灯片内容无法渲染。
      if (typeof window.__lemonPPT_disposeECharts === 'function') {
        window.__lemonPPT_disposeECharts();
      }
      rebuildSlidesAndThumbnails();
      initActiveSlideECharts();
    }
  }

  // 元素选中与右侧属性面板
  let selectedEl = null;
  let selectedSlideIdx = 0;
  const propertyContent = document.getElementById('lp-property-content');
  const layoutSchemas = window.__lemonPPT_layoutSchemas || {};

  const FIELD_LABELS = {
    kicker: '标签',
    title: '标题',
    subtitle: '副标题',
    date: '日期',
    quote: '引用',
    author: '作者',
    role: '职位',
    company: '公司',
    value: '数值',
    unit: '单位',
    label: '指标名',
    description: '说明',
    change: '变化',
    imageUrl: '图片',
    url: '图片',
    logoUrl: 'Logo',
    avatarUrl: '头像',
    caption: '说明',
    q: '问题',
    a: '回答',
    question: '问题',
    answer: '回答',
    name: '名称',
    price: '价格',
    period: '周期',
    cta: '按钮文案',
    type: '图表类型',
    status: '状态',
    bio: '简介',
    items: '目录项',
    points: '要点',
    leftPoints: '左侧要点',
    rightPoints: '右侧要点',
    features: '特性',
    steps: '步骤',
    stats: '统计数据',
    members: '成员',
    milestones: '里程碑',
    phases: '阶段',
    plans: '方案',
    tiers: '套餐',
    images: '图片',
    partners: '合作伙伴',
    datasets: '数据集',
    metrics: '指标',
    cards: '卡片',
    highlighted: '高亮',
    columns: '主题列',
    panels: '指标面板',
    left: '左侧内容',
    right: '右侧内容',
    centerCard: '中央结论卡',
    comparisons: '对比项',
    conclusion: '结论',
    chartType: '图表类型',
    chartData: '图表数据',
    footnote: '脚注',
    source: '来源',
    number: '序号',
    context: '上下文',
    showInsight: '重点强调',
    insight: '洞察面板',
    previous: '原数值',
    current: '现数值',
    max: '最大值',
    tone: '色调',
    percent: '占比',
    color: '颜色',
    rank: '排名',
    company: '公司',
    track: '赛道',
    amount: '金额',
    highlightRow: '高亮行',
    highlightFirstColumn: '高亮首列',
    leftTitle: '左侧标题',
    rightTitle: '右侧标题',
    leftValue: '左侧数值',
    rightValue: '右侧数值',
    leftLabel: '左侧标签',
    rightLabel: '右侧标签',
    size: '尺寸',
    icon: '图标',
    page: '页码',
    image: '图片',
    avatar: '头像',
    logo: 'Logo',
  };

  const LAYOUT_LABELS = {
    cover_v1: '封面',
    cover_v2: '封面（居中）',
    cover_v3: '封面（全图）',
    table_of_contents_v1: '目录',
    table_of_contents_v2: '目录（卡片）',
    content_v1: '内容列表',
    content_v2: '内容对比',
    content_v3: '内容段落',
    content_v4: '内容卡片',
    chart_v1: '图表',
    chart_v2: '多系列图表',
    process_v1: '流程步骤',
    process_v2: '流程时间线',
    process_v3: '流程卡片',
    stats_v1: '数据指标',
    stats_v2: '数据指标（卡片）',
    metric_v1: '核心指标',
    metric_v2: '核心指标（大数字）',
    metric_v3: '双指标对比',
    feature_v1: '特性列表',
    feature_v2: '特性网格',
    feature_v3: '特性卡片',
    team_v1: '团队介绍',
    team_v2: '团队卡片',
    timeline_v1: '时间线',
    timeline_v2: '时间线（横向）',
    timeline_v3: '时间线（里程碑）',
    roadmap_v1: '路线图',
    faq_v1: '问答',
    partners_v1: '合作伙伴',
    gallery_v1: '图片集',
    gallery_v2: '图片集（网格）',
    pricing_v1: '定价',
    pricing_v2: '定价方案',
    closing_v2: '结束页',
    quote_v1: '引用页',
    testimonial_v1: '推荐语',
    metric_big: '大数字页',
    metric_triptych: '三指标总览',
    chart_donut: '环形图拆解',
    chart_funnel: '漏斗图',
    table_data: '数据表格',
    case_study: '案例详情',
    spotlight_grid: '主题聚焦网格',
    diptych_contrast: '双联对比',
    conclusion_v1: '结论页',
    table_v1: '表格',
    ranking_v1: '排行榜',
    region_v1: '地区分布',
    risk_v1: '风险研判',
    outlook_v1: '投资展望',
    bento_v1: 'Bento 网格',
    gallery_v1: '图片集',
    gantt_v1: '甘特图',
    quadrant_v1: '四象限',
    scorecard_v1: '评分卡',
    tags_v1: '标签云',
    filmstrip_v1: '胶片条',
    swot_v1: 'SWOT 分析',
    pest_v1: 'PEST 分析',
    appendix_v1: '附录',
    image_v1: '图片页',
    process_v1: '流程步骤',
    faq_v1: '问答',
    partners_v1: '合作伙伴',
    pricing_v1: '定价',
    team_v1: '团队介绍',
    team_v2: '团队卡片',
    timeline_v1: '时间线',
    roadmap_v1: '路线图',
    chapter_v1: '章节页',
    chapter_v2: '章节页（全图）',
    chapter_v3: '章节页（卡片）',
    cover_v3: '封面（全图）',
    cover_v4: '封面（杂志）',
    chart_bar3d: '3D 柱状图',
    chart_gauge: '仪表盘',
    chart_graph: '关系图',
    chart_heatmap: '热力图',
    chart_radar: '雷达图',
    chart_sankey: '桑基图',
    chart_sunburst: '旭日图',
    chart_treemap: '矩形树图',
    chart_wordcloud: '词云',
    content_v4: '内容卡片',
    metrics_v1: '指标墙',
    delta_v1: '今昔对照',
    comparison_v1: '对比分析',
    progress_v1: '进度条',
    number_showcase_v1: '数字秀',
    testimonial_v1: '推荐语',
    closing_v1: '结束页',
  };

  function getLayoutLabel(layoutId) {
    if (LAYOUT_LABELS[layoutId]) return LAYOUT_LABELS[layoutId];
    const shortId = String(layoutId).replace(/^theme\d+_/, '');
    return LAYOUT_LABELS[shortId] || layoutId;
  }

  function resolveLayoutSchema(slide) {
    if (layoutSchemas[slide.layout]) return layoutSchemas[slide.layout];
    const theme = goal.theme || 'theme01';
    const shortId = String(slide.layout).replace(/^theme\d+_/, '');
    return layoutSchemas[theme + '_' + shortId] || null;
  }

  function getFieldLabel(path) {
    const key = String(path).split('.').pop() || '';
    return FIELD_LABELS[key] || key;
  }

  function inferFieldType(path, value) {
    const key = String(path).split('.').pop() || '';
    if (/image|url|logo|avatar/i.test(key) && typeof value === 'string') return 'image';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (key === 'type' && ['bar', 'line', 'pie'].includes(String(value))) return 'select';
    if (key === 'status') return 'select';
    if (['description', 'bio', 'quote', 'answer', 'a', 'subtitle'].includes(key)) return 'textarea';
    return 'text';
  }

  function getSelectOptions(path) {
    const key = String(path).split('.').pop() || '';
    if (key === 'type') return [{ value: 'bar', label: '柱状' }, { value: 'line', label: '折线' }, { value: 'pie', label: '饼图' }];
    if (key === 'status') return [{ value: '已完成', label: '已完成' }, { value: '进行中', label: '进行中' }, { value: '规划中', label: '规划中' }];
    return [];
  }

  function clearSelection() {
    if (selectedEl) {
      selectedEl.classList.remove('lp-selected');
      selectedEl = null;
    }
    selectedSlideIdx = current;
    renderSlidePanel();
  }

  function setField(path, value) {
    const slide = goal.slides[selectedSlideIdx];
    if (!slide) return;
    recordHistory();
    setProp(slide.props, path, value);
    // 打开依赖开关时，如果被控字段为空且配有默认值，则自动填充测试数据
    if (value === true) {
      const schema = resolveLayoutSchema(slide);
      if (schema && schema.fields) {
        schema.fields.forEach((field) => {
          if (field.visibleWhen && field.visibleWhen.key === path && field.visibleWhen.value === true && field.defaultValue !== undefined) {
            const current = getProp(slide.props, field.key);
            const isEmpty = current == null || (typeof current === 'object' && Object.keys(current).length === 0);
            if (isEmpty) {
              setProp(slide.props, field.key, deepClone(field.defaultValue));
            }
          }
        });
      }
    }
    syncDomFromGoal(path);
    autoSave();
    // 如果该字段在画布上没有对应的直接编辑元素（如 SVG 图表数据），刷新整页幻灯片。
    // 对于标记为 data-lp-chart-data 的图表数据字段，即使画布上可直接编辑，也需要
    // 重新渲染图表以同步数据变化。
    if (!hasEditableElementForPath(path) || hasChartDataElementForPath(path)) {
      refreshCurrentSlide();
    }
  }

  function hasEditableElementForPath(path) {
    const selector = '[data-lp-editable="true"][data-lp-slide-idx="' + selectedSlideIdx + '"][data-lp-prop="' + path + '"]';
    return document.querySelector(selector) !== null;
  }

  function hasChartDataElementForPath(path) {
    const selector = '[data-lp-editable="true"][data-lp-chart-data="true"][data-lp-slide-idx="' + selectedSlideIdx + '"][data-lp-prop="' + path + '"]';
    return document.querySelector(selector) !== null;
  }

  function createEl(tag, className, parent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (parent) parent.appendChild(el);
    return el;
  }

  function createTextField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const input = createEl('input', 'lp-property-input', wrap);
    input.type = 'text';
    input.value = value == null ? '' : String(value);
    input.addEventListener('input', () => onChange(input.value));
    return wrap;
  }

  function createTextareaField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const textarea = createEl('textarea', 'lp-property-textarea', wrap);
    textarea.value = value == null ? '' : String(value);
    textarea.addEventListener('input', () => onChange(textarea.value));
    return wrap;
  }

  function createNumberField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const input = createEl('input', 'lp-property-input', wrap);
    input.type = 'number';
    input.value = value == null ? '' : String(value);
    input.addEventListener('input', () => onChange(Number(input.value)));
    return wrap;
  }

  function renderSliderTicks(ruler, min, max) {
    const scale = createEl('div', 'lp-property-slider-scale', ruler);
    const span = max - min;
    if (span <= 0) return scale;
    // 刻度步长：范围小时每个整数一个刻度，范围大时均匀取 6~10 个
    const desiredTicks = 8;
    const step = span <= desiredTicks ? 1 : Math.max(1, Math.round(span / desiredTicks));
    for (let i = min; i <= max; i += step) {
      const tick = createEl('div', 'lp-property-slider-tick', scale);
      tick.style.left = ((i - min) / span) * 100 + '%';
      const label = createEl('div', 'lp-property-slider-tick-label', tick);
      label.textContent = String(i);
      tick.addEventListener('click', () => {
        const input = ruler.querySelector('input[type="range"]');
        if (input) {
          input.value = String(i);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    return scale;
  }

  function createSliderField(field, value, onChange) {
    const wrap = createEl('div', 'lp-property-slider-field');
    const header = createEl('div', 'lp-property-section-header', wrap);
    createEl('div', 'lp-property-section-title', header).textContent = field.label;
    const countBadge = createEl('span', 'lp-property-slider-value', header);
    const initialValue = value == null ? (field.min || 0) : value;
    countBadge.textContent = String(initialValue);

    const min = typeof field.min === 'number' ? field.min : 0;
    const max = typeof field.max === 'number' ? field.max : 100;

    const sliderWrap = createEl('div', 'lp-property-slider-wrap', wrap);
    const ruler = createEl('div', 'lp-property-slider-ruler', sliderWrap);
    const range = document.createElement('input');
    range.type = 'range';
    range.className = 'lp-property-slider';
    range.min = String(min);
    range.max = String(max);
    range.value = String(initialValue);
    ruler.appendChild(range);
    renderSliderTicks(ruler, min, max);

    range.addEventListener('input', () => {
      const num = Number(range.value);
      countBadge.textContent = String(num);
      onChange(num);
    });

    return wrap;
  }

  function createToggleField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    const labelEl = createEl('label', 'lp-property-toggle', wrap);
    const text = createEl('span', '', labelEl);
    text.textContent = label;
    const input = createEl('input', '', labelEl);
    input.type = 'checkbox';
    input.checked = !!value;
    const track = createEl('div', 'lp-property-toggle-track', labelEl);
    createEl('div', 'lp-property-toggle-thumb', track);
    input.addEventListener('change', () => onChange(input.checked));
    return wrap;
  }

  function createSelectField(label, value, options, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const segmented = createEl('div', 'lp-property-segmented', wrap);
    options.forEach((opt) => {
      const btn = createEl('button', '', segmented);
      btn.textContent = opt.label;
      btn.type = 'button';
      if (opt.value === value) btn.classList.add('active');
      btn.addEventListener('click', () => {
        Array.from(segmented.children).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        onChange(opt.value);
      });
    });
    return wrap;
  }

  function createImageHintField(label) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const hint = createEl('div', 'lp-property-help', wrap);
    hint.textContent = '请点击画布中的图片区域直接上传';
    return wrap;
  }

  function createColorField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const row = createEl('div', '', wrap);
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    const input = createEl('input', 'lp-property-input', row);
    input.type = 'text';
    input.value = value == null ? '' : String(value);
    input.style.flex = '1';
    input.addEventListener('input', () => onChange(input.value));
    const picker = createEl('input', '', row);
    picker.type = 'color';
    picker.value = value || '#000000';
    picker.style.width = '32px';
    picker.style.height = '32px';
    picker.style.border = 'none';
    picker.style.background = 'none';
    picker.style.cursor = 'pointer';
    picker.addEventListener('input', () => {
      input.value = picker.value;
      onChange(picker.value);
    });
    return wrap;
  }

  function createFieldControl(path, value) {
    const type = inferFieldType(path, value);
    const label = getFieldLabel(path);
    if (type === 'image') return createImageHintField(label);
    if (type === 'textarea') return createTextareaField(label, value, (v) => setField(path, v || undefined));
    if (type === 'number') return createNumberField(label, value, (v) => setField(path, v));
    if (type === 'boolean') return createToggleField(label, value, (v) => setField(path, v));
    if (type === 'select') return createSelectField(label, value, getSelectOptions(path), (v) => setField(path, v));
    return createTextField(label, value, (v) => setField(path, v || undefined));
  }

  function createSchemaFieldControl(field, value, path, skipCanvasEditable) {
    const label = field.label || field.key;
    if (skipCanvasEditable && (field.type === 'text' || field.type === 'textarea' || field.type === 'image')) {
      return null;
    }
    if (field.type === 'array') {
      const wrap = createEl('div', 'lp-property-nested-array');
      createSchemaArraySection(field, Array.isArray(value) ? value : [], wrap, path, skipCanvasEditable);
      return wrap;
    }
    if (field.type === 'image') return createImageHintField(label);
    if (field.type === 'textarea') return createTextareaField(label, value, (v) => setField(path, v || undefined));
    if (field.type === 'number') return createNumberField(label, value, (v) => setField(path, Number(v)));
    if (field.type === 'slider') {
      const effectiveValue = value === undefined && field.defaultValue !== undefined ? field.defaultValue : value;
      let sliderField = field;
      if (field.key === 'highlightRow') {
        const slideProps = goal.slides[selectedSlideIdx]?.props;
        const rows = Array.isArray(slideProps?.rows) ? slideProps.rows : [];
        sliderField = { ...field, max: Math.min(field.max ?? 11, Math.max(0, rows.length - 1)) };
      }
      return createSliderField(sliderField, effectiveValue, (v) => setField(path, v));
    }
    if (field.type === 'boolean') {
      const effectiveValue = value === undefined && field.defaultValue !== undefined ? field.defaultValue : value;
      return createToggleField(label, effectiveValue, (v) => {
        setField(path, v);
        renderSlidePanel();
      });
    }
    if (field.type === 'select') return createSelectField(label, value, field.options || [], (v) => setField(path, v));
    if (field.type === 'color') return createColorField(label, value, (v) => setField(path, v));
    return createTextField(label, value, (v) => setField(path, v || undefined));
  }

  function getSchemaEmptyItem(itemSchema) {
    if (!itemSchema || !itemSchema.length) return '示例项';
    // itemSchema 只有单一占位字段时，表示数组元素是原始值（字符串/数字等）
    if (itemSchema.length === 1 && itemSchema[0].key === 'item') {
      const field = itemSchema[0];
      if (field.defaultValue !== undefined) return JSON.parse(JSON.stringify(field.defaultValue));
      if (field.type === 'boolean') return false;
      if (field.type === 'number') return 100;
      if (field.type === 'textarea') return '示例内容';
      return '示例项';
    }
    const item = {};
    itemSchema.forEach((field) => {
      if (field.defaultValue !== undefined) {
        item[field.key] = JSON.parse(JSON.stringify(field.defaultValue));
      } else if (field.type === 'boolean') {
        item[field.key] = false;
      } else if (field.type === 'number') {
        item[field.key] = 100;
      } else if (field.type === 'textarea') {
        item[field.key] = '示例内容';
      } else if (field.type === 'array') {
        const count = typeof field.minItems === 'number' ? Math.max(1, field.minItems) : 1;
        const empty = [];
        for (let i = 0; i < count; i++) {
          empty.push(getSchemaEmptyItem(field.itemSchema));
        }
        item[field.key] = empty;
      } else if (field.type === 'image') {
        item[field.key] = '';
      } else if (field.type === 'text') {
        item[field.key] = '';
      } else if (field.type === 'select') {
        const firstOption = Array.isArray(field.options) && field.options.length > 0 ? field.options[0] : undefined;
        item[field.key] = firstOption && typeof firstOption === 'object' ? firstOption.value : '';
      } else {
        item[field.key] = '示例文字';
      }
    });
    return item;
  }

  function createSchemaArraySection(field, array, parent, basePath, skipCanvasEditable) {
    const path = basePath || field.key;
    const section = createEl('div', 'lp-property-section', parent);

    // 条目数由组件样式决定：minItems / maxItems 来自版式 Schema
    const minItems = typeof field.minItems === 'number' ? field.minItems : 1;
    // 当 Schema 未声明 maxItems 时，使用一个默认上限（而不是当前数组长度），
    // 避免用户减少条目后 slider 的 max 同步缩小，导致无法恢复或继续增加。
    const maxItems = typeof field.maxItems === 'number' ? field.maxItems : Math.max(array.length, minItems, 6);
    const currentCount = Math.max(minItems, Math.min(maxItems, array.length));

    // 标题与数值放在同一行
    const header = createEl('div', 'lp-property-section-header', section);
    createEl('div', 'lp-property-section-title', header).textContent = field.label;
    const countBadge = createEl('span', 'lp-property-slider-value', header);
    countBadge.textContent = String(currentCount);

    // 数量滑块（标尺样式）
    const sliderWrap = createEl('div', 'lp-property-slider-wrap', section);
    const ruler = createEl('div', 'lp-property-slider-ruler', sliderWrap);
    const range = document.createElement('input');
    range.type = 'range';
    range.className = 'lp-property-slider';
    range.min = String(minItems);
    range.max = String(maxItems);
    range.value = String(currentCount);
    ruler.appendChild(range);
    renderSliderTicks(ruler, minItems, maxItems);

    function setArrayLength(newLength) {
      const slide = goal.slides[selectedSlideIdx];
      if (!slide) return;
      let arr = getProp(slide.props, path);
      if (!Array.isArray(arr)) {
        arr = [];
        setProp(slide.props, path, arr);
      }
      if (newLength < arr.length) {
        arr.length = newLength;
      } else if (newLength > arr.length) {
        while (arr.length < newLength) {
          arr.push(getSchemaEmptyItem(field.itemSchema));
        }
      }
    }

    function updateSliderFill() {
      const min = Number(range.min);
      const max = Number(range.max);
      const pct = max === min ? 0 : ((Number(range.value) - min) / (max - min)) * 100;
      range.style.background = 'linear-gradient(90deg, rgba(91,155,213,1) 0%, rgba(139,92,246,1) ' + pct + '%, rgba(255,255,255,0.14) ' + pct + '%, rgba(255,255,255,0.14) 100%)';
    }
    updateSliderFill();

    range.addEventListener('input', () => {
      const newLength = Number(range.value);
      countBadge.textContent = String(newLength);
      setArrayLength(newLength);
      updateSliderFill();
      refreshCurrentSlide();
    });

    range.addEventListener('change', () => {
      recordHistory();
      autoSave();
      renderSlidePanel();
    });

    // 点击标尺快速跳转
    ruler.addEventListener('click', (e) => {
      if (e.target === range || range.contains(e.target)) return;
      const rect = ruler.getBoundingClientRect();
      const padding = 9;
      const availableWidth = rect.width - padding * 2;
      const x = e.clientX - rect.left - padding;
      const ratio = Math.max(0, Math.min(1, x / availableWidth));
      const newLength = Math.round(minItems + ratio * (maxItems - minItems));
      if (newLength !== Number(range.value)) {
        range.value = String(newLength);
        countBadge.textContent = String(newLength);
        setArrayLength(newLength);
        updateSliderFill();
        refreshCurrentSlide();
        recordHistory();
        autoSave();
        renderSlidePanel();
      }
    });

    // 显示当前条目的可编辑字段（简单文字字段仍在画布上编辑，此处跳过）
    const isPrimitiveItem = field.itemSchema && field.itemSchema.length === 1 && field.itemSchema[0].key === 'item';
    const allSubFieldsAreCanvasEditable = skipCanvasEditable && (() => {
      if (!field.itemSchema) return true;
      if (isPrimitiveItem) {
        return ['text', 'textarea', 'image'].includes(field.itemSchema[0].type);
      }
      return field.itemSchema.every((subField) => ['text', 'textarea', 'image'].includes(subField.type));
    })();

    if (!allSubFieldsAreCanvasEditable) {
      const list = createEl('div', 'lp-property-array', section);
      array.forEach((item, index) => {
        const itemWrap = createEl('div', 'lp-property-array-item', list);

        const itemHeader = createEl('div', 'lp-property-array-item-header', itemWrap);
        const itemIndexLabel = createEl('span', '', itemHeader);
        itemIndexLabel.textContent = '#' + (index + 1);
        const deleteBtn = createEl('button', 'lp-property-btn-danger', itemHeader);
        deleteBtn.type = 'button';
        deleteBtn.title = '删除该项';
        deleteBtn.textContent = '×';
        deleteBtn.disabled = array.length <= minItems;
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const slide = goal.slides[selectedSlideIdx];
          if (!slide) return;
          const arr = getProp(slide.props, path);
          if (!Array.isArray(arr)) return;
          arr.splice(index, 1);
          refreshCurrentSlide();
          recordHistory();
          autoSave();
          renderSlidePanel();
        });

        if (isPrimitiveItem) {
          const subField = field.itemSchema[0];
          const itemPath = path + '.' + index;
          const itemValue = item;
          const control = createSchemaFieldControl(subField, itemValue, itemPath, skipCanvasEditable);
          if (control) itemWrap.appendChild(control);
        } else if (field.itemSchema) {
          field.itemSchema.forEach((subField) => {
            if (skipCanvasEditable && (subField.type === 'text' || subField.type === 'textarea' || subField.type === 'image')) return;
            const itemPath = path + '.' + index + '.' + subField.key;
            const itemValue = typeof item === 'object' && item !== null ? item[subField.key] : undefined;
            const control = createSchemaFieldControl(subField, itemValue, itemPath, skipCanvasEditable);
            if (control) itemWrap.appendChild(control);
          });
        } else if (typeof item === 'string') {
          if (skipCanvasEditable) return;
          const textarea = createEl('textarea', 'lp-property-textarea', itemWrap);
          textarea.value = item;
          textarea.addEventListener('input', () => {
            setField(path + '.' + index, textarea.value);
          });
        }
      });
    }
  }

  function findSchemaField(schema, path) {
    if (!schema || !schema.fields || !path) return null;
    const parts = path.split('.');
    let fields = schema.fields;
    let field = null;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (!fields) return null;
      if (/^\d+$/.test(key)) {
        // 数组索引，进入下一层 itemSchema
        if (field && field.itemSchema) {
          fields = field.itemSchema;
        }
        continue;
      }
      field = fields.find((f) => f.key === key) || null;
      if (!field) return null;
      if (i < parts.length - 1) {
        fields = field.type === 'array' ? field.itemSchema : (field.type === 'object' ? field.itemSchema : null);
      }
    }
    return field;
  }

  function renderSchemaFields(schema, props, parent, basePath, skipCanvasEditable) {
    if (!schema || !schema.fields) return;
    schema.fields.forEach((field) => {
      // 简单文字字段直接在画布上编辑，不在右侧边栏重复渲染
      if (field.inlineEditable) return;
      // 非图表组件中，可在画布直接编辑的文字、图片字段不再在右侧边栏重复提供
      if (skipCanvasEditable && (field.type === 'text' || field.type === 'textarea' || field.type === 'image')) return;
      // 依赖开关的字段，开关关闭时收起；未设置时按开关默认值判断
      if (field.visibleWhen) {
        const controller = findSchemaField(schema, field.visibleWhen.key);
        const rawValue = getProp(props, field.visibleWhen.key);
        const effectiveValue = rawValue === undefined && controller?.defaultValue !== undefined ? controller.defaultValue : rawValue;
        if (effectiveValue !== field.visibleWhen.value) return;
      }
      const path = basePath ? basePath + '.' + field.key : field.key;
      const value = getProp(props, path);
      if (field.type === 'array') {
        createSchemaArraySection(field, Array.isArray(value) ? value : [], parent, path, skipCanvasEditable);
      } else if (field.type === 'object') {
        const section = createEl('div', 'lp-property-section', parent);
        createEl('div', 'lp-property-section-title', section).textContent = field.label;
        if (field.itemSchema) {
          renderSchemaFields({ fields: field.itemSchema }, props, section, path, skipCanvasEditable);
        }
      } else if (field.type === 'slider') {
        const section = createEl('div', 'lp-property-section', parent);
        const effectiveValue = value === undefined && field.defaultValue !== undefined ? field.defaultValue : value;
        let sliderField = field;
        if (field.key === 'highlightRow') {
          const rows = Array.isArray(props?.rows) ? props.rows : [];
          sliderField = { ...field, max: Math.min(field.max ?? 11, Math.max(0, rows.length - 1)) };
        }
        section.appendChild(createSliderField(sliderField, effectiveValue, (v) => setField(path, v)));
      } else {
        const control = createSchemaFieldControl(field, value, path, skipCanvasEditable);
        if (control) parent.appendChild(control);
      }
    });
  }

  function renderSlideFields(props, parent, skipCanvasEditable) {
    Object.keys(props).forEach((key) => {
      if (key === '_style') return;
      const value = props[key];
      if (Array.isArray(value)) {
        // 无 Schema 时仅提供简单文本编辑，不显示序号刻度
        const section = createEl('div', 'lp-property-section', parent);
        createEl('div', 'lp-property-section-title', section).textContent = getFieldLabel(key) + ' (' + value.length + ')';
        const list = createEl('div', 'lp-property-array', section);
        value.forEach((item, index) => {
          const itemWrap = createEl('div', 'lp-property-array-item', list);
          if (typeof item === 'string') {
            if (skipCanvasEditable) return;
            const textarea = createEl('textarea', 'lp-property-textarea', itemWrap);
            textarea.value = item;
            textarea.addEventListener('input', () => {
              setField(key + '.' + index, textarea.value);
            });
          } else if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach((subKey) => {
              const type = inferFieldType(key + '.' + index + '.' + subKey, item[subKey]);
              if (skipCanvasEditable && (type === 'text' || type === 'textarea' || type === 'image')) return;
              itemWrap.appendChild(createFieldControl(key + '.' + index + '.' + subKey, item[subKey]));
            });
          }
          if (!itemWrap.hasChildNodes()) {
            itemWrap.remove();
          }
        });
        if (!list.hasChildNodes()) {
          list.remove();
        }
      } else if (value !== null && typeof value === 'object') {
        // 嵌套对象直接展开（目前较少）
        const section = createEl('div', 'lp-property-section', parent);
        createEl('div', 'lp-property-section-title', section).textContent = getFieldLabel(key);
        Object.keys(value).forEach((subKey) => {
          const type = inferFieldType(key + '.' + subKey, value[subKey]);
          if (skipCanvasEditable && (type === 'text' || type === 'textarea' || type === 'image')) return;
          section.appendChild(createFieldControl(key + '.' + subKey, value[subKey]));
        });
      } else {
        const type = inferFieldType(key, value);
        if (skipCanvasEditable && (type === 'text' || type === 'textarea' || type === 'image')) return;
        parent.appendChild(createFieldControl(key, value));
      }
    });
  }

  function renderSlidePanel() {
    if (!propertyContent) return;
    propertyContent.innerHTML = '';
    const slide = goal.slides[selectedSlideIdx];
    if (!slide) return;

    const info = createEl('div', 'lp-property-section', propertyContent);
    createEl('div', 'lp-property-section-title', info).textContent = '幻灯片 ' + (selectedSlideIdx + 1);
    const layoutLabel = createEl('div', 'lp-property-help', info);
    layoutLabel.textContent = '版式：' + getLayoutLabel(slide.layout);

    const transitionSection = createEl('div', 'lp-property-section', propertyContent);
    createEl('div', 'lp-property-section-title', transitionSection).textContent = '切换动画';
    const transitionSelect = document.createElement('select');
    transitionSelect.className = 'lp-editor-select';
    transitionSelect.style.width = '100%';
    const currentTransition = slide.props.transition || 'none';
    TRANSITIONS.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.key;
      opt.textContent = t.label;
      if (t.key === currentTransition) opt.selected = true;
      transitionSelect.appendChild(opt);
    });
    transitionSelect.addEventListener('change', () => {
      slide.props.transition = transitionSelect.value;
      const wrapper = document.querySelector('.lp-slide-wrapper[data-slide-index="' + selectedSlideIdx + '"]');
      if (wrapper) wrapper.setAttribute('data-lp-transition', slide.props.transition);
      recordHistory();
      saveState();
    });
    transitionSection.appendChild(transitionSelect);

    if (selectedEl && slide.role === 'chart') {
      const prop = selectedEl.getAttribute('data-lp-prop');
      const schema = resolveLayoutSchema(slide);
      const schemaField = schema ? findSchemaField(schema, prop) : null;
      // 简单文字字段已在画布上直接编辑，不在右侧边栏重复显示
      if (!schemaField || !schemaField.inlineEditable) {
        const quickSection = createEl('div', 'lp-property-section', propertyContent);
        createEl('div', 'lp-property-section-title', quickSection).textContent = '当前选中';
        const fieldValue = getProp(slide.props, prop);
        quickSection.appendChild(createFieldControl(prop, fieldValue));
      }
    }

    const fieldsSection = createEl('div', 'lp-property-section', propertyContent);
    createEl('div', 'lp-property-section-title', fieldsSection).textContent = '内容属性';
    const schema = resolveLayoutSchema(slide);
    const skipCanvasEditable = slide.role !== 'chart';
    if (schema && schema.fields) {
      renderSchemaFields(schema, slide.props, fieldsSection, undefined, skipCanvasEditable);
    } else {
      renderSlideFields(slide.props, fieldsSection, skipCanvasEditable);
    }
  }

  function selectEl(el) {
    if (selectedEl === el) return;
    if (selectedEl) selectedEl.classList.remove('lp-selected');
    selectedEl = el;
    selectedEl.classList.add('lp-selected');
    selectedSlideIdx = Number(el.getAttribute('data-lp-slide-idx')) || current;
    renderSlidePanel();
    // 滚动到当前选中字段
    const path = el.getAttribute('data-lp-prop');
    if (path && propertyContent) {
      const label = propertyContent.querySelector('.lp-property-label');
      // 简单高亮：暂时不做自动滚动，避免复杂度
    }
  }

  function renderSlideToRootByIndex(index, wrapper) {
    if (typeof window.__lemonPPT_renderSlideToRoot !== 'function') return;
    const slide = goal.slides[index];
    if (!slide || !wrapper) {
      return;
    }
    window.__lemonPPT_renderSlideToRoot(wrapper, slide, { slideIdx: index, editable: true, theme: goal.theme });
    initEditableElements(wrapper);
  }

  function initActiveSlideECharts() {
    const activeWrapper = document.querySelector('.lp-slide-wrapper.active');
    if (activeWrapper && typeof window.__lemonPPT_initECharts === 'function') {
      window.__lemonPPT_initECharts(goal.theme || 'theme01', activeWrapper);
    }
  }

  function disposeEChartsInWrapper(wrapper) {
    if (!wrapper) return;
    wrapper.querySelectorAll('[data-lp-echart-type]').forEach((container) => {
      const inst = container.__lpEChartInstance;
      if (inst && !inst.isDisposed()) {
        inst.dispose();
      }
      container.__lpEChartInstance = undefined;
    });
  }

  function renderCurrentSlideToRoot() {
    const wrapper = document.querySelector('.lp-slide-wrapper.active');
    if (!wrapper) return;
    renderSlideToRootByIndex(selectedSlideIdx, wrapper);
    // React 18 createRoot().render() 是异步的，延迟到下一帧再初始化 ECharts，
    // 确保占位容器已经挂载到 DOM 并有可测量的尺寸。
    requestAnimationFrame(() => {
      initActiveSlideECharts();
    });
  }

  // 预创建所有 slide 的 React root 并渲染，使切页和非 active slide 更新都无需重新构建 DOM
  function renderAllSlidesToRoot() {
    if (typeof window.__lemonPPT_renderSlideToRoot !== 'function') {
      return;
    }
    const wrappers = document.querySelectorAll('.lp-slide-wrapper');
    wrappers.forEach((wrapper, index) => {
      renderSlideToRootByIndex(index, wrapper);
    });
    // 编辑器场景下只初始化当前 active slide 的 ECharts，避免 75+ 页同时渲染导致卡顿。
    requestAnimationFrame(() => {
      initActiveSlideECharts();
    });
  }

  function selectSlide(index) {
    if (selectedEl) {
      selectedEl.classList.remove('lp-selected');
      selectedEl = null;
    }
    selectedSlideIdx = index;
    renderSlidePanel();
  }

  document.addEventListener('focusin', (e) => {
    const el = e.target.closest && e.target.closest('[data-lp-editable="true"], [data-lp-editable-image="true"]');
    if (el) selectEl(el);
  });

  document.addEventListener('click', (e) => {
    const editableEl = e.target.closest && e.target.closest('[data-lp-editable="true"], [data-lp-editable-image="true"]');
    if (editableEl) {
      selectEl(editableEl);
      return;
    }
    const wrapper = e.target.closest && e.target.closest('.lp-slide-wrapper');
    if (wrapper) {
      selectSlide(Number(wrapper.getAttribute('data-slide-index')));
      return;
    }
    if (e.target.closest && !e.target.closest('.lp-editor-right-panel')) {
      clearSelection();
    }
  });

  // 恢复上次停留的幻灯片（结构变更后重载用）
  const savedCurrent = localStorage.getItem('lemonppt:editor:currentSlide');
  if (savedCurrent) {
    const savedIndex = Number(savedCurrent);
    if (!Number.isNaN(savedIndex) && savedIndex >= 0 && savedIndex < slides.length) {
      goTo(savedIndex);
    }
    localStorage.removeItem('lemonppt:editor:currentSlide');
  }

  // 默认选中当前幻灯片
  selectSlide(current);

  // 若 localStorage 中幻灯片数量与当前 DOM 不匹配，重建 DOM 后再渲染
  if (needsDomRebuild) {
    rebuildSlidesAndThumbnails();
  } else {
    // 预创建并渲染所有 slide 的 React root，使切页与后续更新都走 React reconcile
    renderAllSlidesToRoot();
  }

  // 暴露给 editor.js：无刷新切换主题时重置内部状态
  window.__lemonPPT_applyTheme = function(newGoal, newSlidesMarkup) {
    try {
      const oldKey = 'lemonppt:editor:v2:' + (goal.theme || 'theme01') + ':' + (goal.randomSeed || goal.title || 'default');
      localStorage.setItem(oldKey, JSON.stringify(goal));
    } catch (err) {
      console.warn('切换主题前保存失败', err);
    }
    goal = newGoal;
    window.__lemonPPT_goal = goal;

    // 尝试恢复当前主题的本地编辑状态
    try {
      const newKey = 'lemonppt:editor:v2:' + (goal.theme || 'theme01') + ':' + (goal.randomSeed || goal.title || 'default');
      const saved = localStorage.getItem(newKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides)) {
          goal = parsed;
          window.__lemonPPT_goal = goal;
        }
      }
    } catch (err) {
      console.warn('切换主题后恢复失败', err);
    }

    const slidesContainer = document.getElementById('lp-slides');
    if (slidesContainer) {
      slidesContainer.innerHTML = newSlidesMarkup;
    }
    current = 0;
    selectedSlideIdx = 0;
    rebuildSlidesAndThumbnails();
    selectSlide(current);
    syncAppearanceFromGoal();
    autoSave();
    updateUndoRedoButtons();
  };
})();
`;
