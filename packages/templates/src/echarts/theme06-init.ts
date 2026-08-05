// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import {
  BarChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  SankeyChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { resolveCssVar, resolveCssVarsInOption } from './shared-utils.js';

// 按需注册 theme06 深色图谱风实际使用的图表模块。
echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  BarChart,
  LineChart,
  RadarChart,
  GraphChart,
  PieChart,
  HeatmapChart,
  SankeyChart,
]);

function buildRuntimeEChartTheme(): Record<string, unknown> {
  return {
    color: [
      resolveCssVar('--lp-accent'),
      resolveCssVar('--lp-accent-2'),
      resolveCssVar('--lp-accent-cool'),
      resolveCssVar('--lp-red'),
      resolveCssVar('--lp-teal'),
      resolveCssVar('--lp-violet'),
    ],
    textStyle: {
      fontFamily: resolveCssVar('--lp-font', '"Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif'),
    },
  };
}

/**
 * 浏览器端初始化 theme06 的 ECharts 占位容器。
 */
export function initECharts(root?: Element | null): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const containers = root
    ? root.querySelectorAll('[data-lp-echart-type]')
    : document.querySelectorAll('[data-lp-echart-type]');
  containers.forEach((container) => {
    if (!(container instanceof HTMLElement)) return;

    const type = container.getAttribute('data-lp-echart-type');
    const optionRaw = container.getAttribute('data-lp-echart-option');
    if (!type || !optionRaw) return;

    const existing = (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance;
    const lastOptionRaw = container.getAttribute('data-lp-echart-last-option');

    try {
      const option = resolveCssVarsInOption(JSON.parse(optionRaw)) as Record<string, unknown>;
      if (existing && !existing.isDisposed()) {
        if (lastOptionRaw !== optionRaw) {
          existing.setOption(option, true);
          container.setAttribute('data-lp-echart-last-option', optionRaw);
        }
        existing.resize();
        return;
      }

      const theme = buildRuntimeEChartTheme();
      const instance = echarts.init(container, theme, { renderer: 'svg' });
      instance.setOption(option, true);
      (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance = instance;
      container.setAttribute('data-lp-echart-last-option', optionRaw);
    } catch (err) {
      console.warn('ECharts 初始化失败', type, err);
    }
  });
}

/**
 * 销毁当前容器内的 ECharts 实例。
 */
export function disposeECharts(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-lp-echart-type]').forEach((container) => {
    const inst = (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance;
    if (inst && !inst.isDisposed()) {
      inst.dispose();
    }
  });
}

export { echarts };
