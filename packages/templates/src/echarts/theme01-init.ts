// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  PieChart,
  PictorialBarChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  TreemapChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { theme01Tokens } from '../themes/theme01/tokens.js';
import { resolveCssVarsInOption } from './shared-utils.js';

// 按需注册 theme01 需要的 ECharts 模块，控制分包体积。
echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  TreemapChart,
  SankeyChart,
  SunburstChart,
  GaugeChart,
  HeatmapChart,
  FunnelChart,
  RadarChart,
  GraphChart,
  PictorialBarChart,
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
]);

function buildRuntimeEChartTheme(): Record<string, unknown> {
  return {
    color: [
      resolveCssVar('--lp-blue', theme01Tokens.blue),
      resolveCssVar('--lp-green', theme01Tokens.green),
      resolveCssVar('--lp-amber', theme01Tokens.amber),
      resolveCssVar('--lp-red', theme01Tokens.red),
      resolveCssVar('--lp-violet', theme01Tokens.violet),
      resolveCssVar('--lp-pink', theme01Tokens.pink),
      resolveCssVar('--lp-cyan', theme01Tokens.cyan),
      resolveCssVar('--lp-orange', theme01Tokens.orange),
      resolveCssVar('--lp-lime', theme01Tokens.lime),
    ],
    textStyle: {
      fontFamily: resolveCssVar('--lp-font', theme01Tokens.font),
    },
  };
}

function resolveCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * 浏览器端初始化 ECharts 占位容器。
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
