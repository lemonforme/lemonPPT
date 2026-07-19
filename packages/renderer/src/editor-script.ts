export const editorScript = `
(function () {
  const STORAGE_KEY = 'lemonppt:editor:' + (window.__lemonPPT_goal?.randomSeed || window.__lemonPPT_goal?.title || 'default');
  const MAX_HISTORY = 50;

  let goal = window.__lemonPPT_goal;
  if (!goal) return;

  // 优先从 localStorage 恢复
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.slides) {
        goal = parsed;
        window.__lemonPPT_goal = goal;
        syncDomFromGoal();
      }
    }
  } catch (err) {
    console.warn('自动恢复失败', err);
  }

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
    goal = newGoal;
    window.__lemonPPT_goal = goal;
    Object.assign(window.__lemonPPT_goal, newGoal);
    syncDomFromGoal();
    autoSave();
    updateUndoRedoButtons();
  }

  function autoSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
    } catch (err) {
      console.warn('自动保存失败', err);
    }
  }

  function syncDomFromGoal() {
    // 文本
    document.querySelectorAll('[data-lp-editable="true"]').forEach((el) => {
      const slideIdx = Number(el.getAttribute('data-lp-slide-idx'));
      const prop = el.getAttribute('data-lp-prop');
      if (Number.isNaN(slideIdx) || !prop) return;
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
      const slide = goal.slides[slideIdx];
      if (!slide) return;
      const value = getProp(slide.props, prop);
      if (value) {
        img.setAttribute('src', String(value));
      } else {
        img.remove();
      }
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

  // 图片编辑弹窗
  function openImageEditor(img, slideIdx, prop) {
    const slide = goal.slides[slideIdx];
    if (!slide) return;

    const overlay = document.createElement('div');
    overlay.className = 'lp-image-editor-overlay';
    overlay.innerHTML = \`
      <div class="lp-image-editor">
        <h3>编辑图片</h3>
        <label>
          <span>图片 URL</span>
          <input type="text" class="lp-image-url" placeholder="https://..." value="\${escapeHtml(img.getAttribute('src') || '')}">
        </label>
        <div class="lp-image-or">或</div>
        <label class="lp-image-file-label">
          <span>上传本地图片</span>
          <input type="file" class="lp-image-file" accept="image/*">
        </label>
        <div class="lp-image-preview-wrap">
          <img class="lp-image-preview" src="\${escapeHtml(img.getAttribute('src') || '')}" alt="">
        </div>
        <div class="lp-image-actions">
          <button class="lp-image-delete lp-image-btn-secondary">删除图片</button>
          <div class="lp-image-actions-right">
            <button class="lp-image-cancel lp-image-btn-secondary">取消</button>
            <button class="lp-image-confirm">确认</button>
          </div>
        </div>
      </div>
    \`;

    document.body.appendChild(overlay);

    const urlInput = overlay.querySelector('.lp-image-url');
    const fileInput = overlay.querySelector('.lp-image-file');
    const preview = overlay.querySelector('.lp-image-preview');
    const confirmBtn = overlay.querySelector('.lp-image-confirm');
    const cancelBtn = overlay.querySelector('.lp-image-cancel');
    const deleteBtn = overlay.querySelector('.lp-image-delete');

    let pendingValue = img.getAttribute('src') || '';

    urlInput.addEventListener('input', () => {
      pendingValue = urlInput.value;
      preview.src = pendingValue;
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingValue = e.target.result;
        urlInput.value = '';
        preview.src = pendingValue;
      };
      reader.readAsDataURL(file);
    });

    function close() {
      overlay.remove();
    }

    function apply() {
      recordHistory();
      if (pendingValue) {
        img.setAttribute('src', pendingValue);
        setProp(slide.props, prop, pendingValue);
      } else {
        img.remove();
        setProp(slide.props, prop, undefined);
      }
      autoSave();
      close();
    }

    function remove() {
      recordHistory();
      img.remove();
      setProp(slide.props, prop, undefined);
      autoSave();
      close();
    }

    confirmBtn.addEventListener('click', apply);
    cancelBtn.addEventListener('click', close);
    deleteBtn.addEventListener('click', remove);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const editableEls = document.querySelectorAll('[data-lp-editable="true"]');

  editableEls.forEach((el) => {
    el.setAttribute('contenteditable', 'true');

    el.addEventListener('focus', () => {
      recordHistory();
    });

    el.addEventListener('blur', () => {
      const slideIdx = Number(el.getAttribute('data-lp-slide-idx'));
      const prop = el.getAttribute('data-lp-prop');
      if (Number.isNaN(slideIdx) || !prop) return;

      const slide = goal.slides[slideIdx];
      if (!slide) return;

      const value = el.textContent || '';
      setProp(slide.props, prop, value);
      autoSave();
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  });

  // 图片换图
  const imageEls = document.querySelectorAll('[data-lp-editable-image="true"]');
  imageEls.forEach((img) => {
    img.addEventListener('click', () => {
      const slideIdx = Number(img.getAttribute('data-lp-slide-idx'));
      const prop = img.getAttribute('data-lp-prop') || 'image';
      if (Number.isNaN(slideIdx)) return;
      openImageEditor(img, slideIdx, prop);
    });
  });

  const downloadBtn = document.getElementById('lp-download-goal');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(goal, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'goal.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const exportPptxBtn = document.getElementById('lp-export-pptx');
  if (exportPptxBtn) {
    exportPptxBtn.addEventListener('click', async () => {
      exportPptxBtn.textContent = '导出中...';
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
        exportPptxBtn.textContent = '导出 PPTX';
        exportPptxBtn.disabled = false;
      }
    });
  }

  const exportPdfBtn = document.getElementById('lp-export-pdf');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', async () => {
      exportPdfBtn.textContent = '导出中...';
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
        exportPdfBtn.textContent = '导出 PDF';
        exportPdfBtn.disabled = false;
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

  // 主题切换
  const themeSwitcher = document.getElementById('lp-theme-switcher');
  if (themeSwitcher) {
    themeSwitcher.value = goal.theme || 'base';
    themeSwitcher.addEventListener('change', () => {
      const newTheme = themeSwitcher.value;
      if (newTheme === goal.theme) return;
      goal.theme = newTheme;
      autoSave();
      window.location.href = '/editor?theme=' + encodeURIComponent(newTheme);
    });
  }

  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    }
  });

  updateUndoRedoButtons();

  // 翻页脚本
  const slides = document.querySelectorAll('.lp-slide-wrapper');
  const thumbnails = document.querySelectorAll('.lp-thumbnail');
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
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });
    const activeThumb = thumbnails[current];
    if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (currentLabel) currentLabel.textContent = String(current + 1);
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    current = index;
    updateClasses();
    if (typeof selectSlide === 'function') selectSlide(current);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => goTo(Number(thumb.dataset.index)));
  });
  function isEditingTarget(target) {
    if (!target || !target.closest) return false;
    return target.closest('[contenteditable="true"]') || target.closest('.lp-image-editor');
  }

  document.addEventListener('keydown', (e) => {
    if (isEditingTarget(e.target)) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  updateClasses();

  // 缩放控制
  const stage = document.querySelector('.lp-editor-stage');
  const scaler = document.querySelector('.lp-editor-stage-scaler');
  const zoomSlider = document.getElementById('lp-zoom-slider');
  const zoomValue = document.getElementById('lp-zoom-value');
  const zoomOutBtn = document.getElementById('lp-zoom-out');
  const zoomInBtn = document.getElementById('lp-zoom-in');
  const zoomFitBtn = document.getElementById('lp-zoom-fit');
  let userZoom = null;

  function fitScale() {
    if (!stage || !scaler) return 1;
    return Math.min(stage.clientWidth / 1280, stage.clientHeight / 720) * 0.92;
  }

  function updateScale() {
    if (!stage || !scaler) return;
    const scale = userZoom == null ? fitScale() : userZoom;
    scaler.style.transform = 'scale(' + Math.max(scale, 0.35) + ')';
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

  // 播放：先渲染静态版本再打开
  const playBtn = document.getElementById('lp-play');
  if (playBtn) {
    playBtn.addEventListener('click', async () => {
      playBtn.textContent = '准备中...';
      playBtn.disabled = true;
      try {
        const res = await fetch('/api/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal),
        });
        if (!res.ok) throw new Error('渲染失败: ' + res.status);
        window.open('/deck/index.html', '_blank');
      } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
      } finally {
        playBtn.textContent = '▶ 播放';
        playBtn.disabled = false;
      }
    });
  }

  // 内容结构变更后重新渲染当前编辑器（仅用于数组增删等模板内容调整）
  function saveCurrentForReload() {
    try {
      localStorage.setItem('lemonppt:editor:currentSlide', String(current));
    } catch (e) {}
  }

  async function reloadEditor() {
    saveCurrentForReload();
    try {
      const res = await fetch('/api/render-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('重新渲染失败: ' + res.status);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  // 元素选中与右侧属性面板
  let selectedEl = null;
  let selectedSlideIdx = 0;
  const propertyContent = document.getElementById('lp-property-content');

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
  };

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
    syncDomFromGoal();
    autoSave();
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

  function createImageField(label, value, onChange) {
    const wrap = createEl('div', 'lp-property-field');
    createEl('label', 'lp-property-label', wrap).textContent = label;
    const urlInput = createEl('input', 'lp-property-input', wrap);
    urlInput.type = 'text';
    urlInput.value = value == null ? '' : String(value);
    urlInput.placeholder = 'https://...';
    urlInput.addEventListener('input', () => onChange(urlInput.value));

    const fileWrap = createEl('div', 'lp-property-field');
    fileWrap.style.marginTop = '8px';
    const fileInput = createEl('input', 'lp-property-input', fileWrap);
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        urlInput.value = dataUrl;
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    });
    wrap.appendChild(fileWrap);
    return wrap;
  }

  function createFieldControl(path, value) {
    const type = inferFieldType(path, value);
    const label = getFieldLabel(path);
    if (type === 'image') return createImageField(label, value, (v) => setField(path, v || undefined));
    if (type === 'textarea') return createTextareaField(label, value, (v) => setField(path, v || undefined));
    if (type === 'number') return createNumberField(label, value, (v) => setField(path, v));
    if (type === 'boolean') return createToggleField(label, value, (v) => setField(path, v));
    if (type === 'select') return createSelectField(label, value, getSelectOptions(path), (v) => setField(path, v));
    return createTextField(label, value, (v) => setField(path, v || undefined));
  }

  function inferEmptyItem(array) {
    if (!array.length) return {};
    const sample = array[0];
    if (typeof sample === 'string') return '';
    if (typeof sample === 'object' && sample !== null) {
      const item = {};
      Object.keys(sample).forEach((k) => {
        const v = sample[k];
        item[k] = typeof v === 'boolean' ? false : (typeof v === 'number' ? 0 : '');
      });
      return item;
    }
    return '';
  }

  function createArraySection(path, array, parent) {
    const section = createEl('div', 'lp-property-section', parent);
    createEl('div', 'lp-property-section-title', section).textContent = getFieldLabel(path) + ' (' + array.length + ')';

    const list = createEl('div', 'lp-property-array', section);
    array.forEach((item, index) => {
      const itemWrap = createEl('div', 'lp-property-array-item', list);
      const header = createEl('div', 'lp-property-array-header', itemWrap);
      header.textContent = '第 ' + (index + 1) + ' 项';
      const removeBtn = createEl('button', 'lp-property-btn lp-property-btn-sm lp-property-btn-danger', header);
      removeBtn.textContent = '删除';
      removeBtn.type = 'button';
      removeBtn.addEventListener('click', () => {
        recordHistory();
        const arr = getProp(goal.slides[selectedSlideIdx].props, path);
        if (Array.isArray(arr)) {
          arr.splice(index, 1);
          autoSave();
          reloadEditor();
        }
      });

      if (typeof item === 'string') {
        const textarea = createEl('textarea', 'lp-property-textarea', itemWrap);
        textarea.value = item;
        textarea.addEventListener('input', () => {
          setField(path + '.' + index, textarea.value);
        });
      } else if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach((key) => {
          itemWrap.appendChild(createFieldControl(path + '.' + index + '.' + key, item[key]));
        });
      }
    });

    const addBtn = createEl('button', 'lp-property-btn lp-property-btn-primary', section);
    addBtn.textContent = '＋ 添加一项';
    addBtn.type = 'button';
    addBtn.addEventListener('click', () => {
      recordHistory();
      const arr = getProp(goal.slides[selectedSlideIdx].props, path);
      if (Array.isArray(arr)) {
        arr.push(inferEmptyItem(arr));
        autoSave();
        reloadEditor();
      }
    });
  }

  function renderSlideFields(props, parent) {
    Object.keys(props).forEach((key) => {
      if (key === '_style') return;
      const value = props[key];
      if (Array.isArray(value)) {
        createArraySection(key, value, parent);
      } else if (value !== null && typeof value === 'object') {
        // 嵌套对象直接展开（目前较少）
        const section = createEl('div', 'lp-property-section', parent);
        createEl('div', 'lp-property-section-title', section).textContent = getFieldLabel(key);
        Object.keys(value).forEach((subKey) => {
          section.appendChild(createFieldControl(key + '.' + subKey, value[subKey]));
        });
      } else {
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
    layoutLabel.textContent = '版式：' + slide.layout;

    if (selectedEl) {
      const prop = selectedEl.getAttribute('data-lp-prop');
      const quickSection = createEl('div', 'lp-property-section', propertyContent);
      createEl('div', 'lp-property-section-title', quickSection).textContent = '当前选中';
      const fieldValue = getProp(slide.props, prop);
      quickSection.appendChild(createFieldControl(prop, fieldValue));
    }

    const fieldsSection = createEl('div', 'lp-property-section', propertyContent);
    createEl('div', 'lp-property-section-title', fieldsSection).textContent = '内容属性';
    renderSlideFields(slide.props, fieldsSection);
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
})();
`;
