// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

export function resolveCssVar(name: string, fallback?: string): string {
  if (typeof document === 'undefined') return fallback ?? '';
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback || '';
}

export function resolveCssVarsInOption(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/var\((--[\w-]+)\)/g, (_, varName) => {
      return resolveCssVar(varName, value);
    });
  }
  if (Array.isArray(value)) {
    return value.map(resolveCssVarsInOption);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = resolveCssVarsInOption(v);
    }
    return result;
  }
  return value;
}

/** 具备 resize / isDisposed 能力的最小 ECharts 实例接口（避免此文件依赖 echarts 类型）。 */
interface ResizableChart {
  resize: () => void;
  isDisposed: () => boolean;
}

type ObservedEl = HTMLElement & {
  __lpChartRO?: ResizeObserver;
  __lpChartLastW?: number;
  __lpChartLastH?: number;
};

/**
 * 解决「图表默认只渲染一半、hover/交互后才完整」的通病。
 *
 * 根因：`echarts.init()` 执行时，slide 容器可能仍处于 `display:none`、
 * CSS `transform: scale()` 未落地或 React 刚挂载尚未完成布局，
 * 导致 ECharts 记录到 0 或过小的画布尺寸。单帧 `requestAnimationFrame` 不足以覆盖。
 *
 * 方案：
 * 1. 多档延迟主动 resize（覆盖字体加载、CSS transition 等异步阶段）；
 * 2. 挂载 `ResizeObserver` 持续跟随容器真实尺寸变化，尺寸真正变化时才 resize（避免抖动）。
 */
export function observeChartResize(container: HTMLElement, instance: ResizableChart): void {
  if (typeof window === 'undefined') return;

  const el = container as ObservedEl;

  const safeResize = (): void => {
    try {
      if (!instance.isDisposed() && el.offsetWidth > 0 && el.offsetHeight > 0) {
        instance.resize();
      }
    } catch {
      /* 容器已卸载或实例已销毁，忽略 */
    }
  };

  // 多档兜底：覆盖布局落地、Web Font 加载、CSS 过渡等不同时机。
  requestAnimationFrame(() => {
    safeResize();
    requestAnimationFrame(safeResize);
  });
  [60, 200, 600].forEach((ms) => window.setTimeout(safeResize, ms));

  // 字体加载完成后重排，避免 label 尺寸测量偏差。
  const fontSet = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
  if (fontSet?.ready) {
    fontSet.ready.then(safeResize).catch(() => undefined);
  }

  // 同一容器只挂载一个 observer。
  if (el.__lpChartRO || typeof ResizeObserver === 'undefined') return;

  el.__lpChartLastW = el.offsetWidth;
  el.__lpChartLastH = el.offsetHeight;

  const ro = new ResizeObserver(() => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w === 0 || h === 0) return;
    if (w === el.__lpChartLastW && h === el.__lpChartLastH) return;
    el.__lpChartLastW = w;
    el.__lpChartLastH = h;
    safeResize();
  });

  ro.observe(el);
  el.__lpChartRO = ro;
}

/** 销毁图表时同步断开 ResizeObserver，避免内存泄漏。 */
export function unobserveChartResize(container: HTMLElement): void {
  const el = container as ObservedEl;
  if (el.__lpChartRO) {
    el.__lpChartRO.disconnect();
    el.__lpChartRO = undefined;
  }
}
