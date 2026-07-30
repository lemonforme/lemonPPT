// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';
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
import { theme01Tokens } from './tokens.js';

// P2 阶段按需注册 ECharts 模块，控制 client-render.js 体积。
// 后续新增图表类型时在此按序扩展注册。
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

export type LpEChartType =
  | 'treemap'
  | 'sankey'
  | 'sunburst'
  | 'gauge'
  | 'heatmap'
  | 'funnel'
  | 'radar'
  | 'graph'
  | 'bar3d'
  | 'bar'
  | 'line'
  | 'scatter'
  | 'pie';

export interface LpEChartProps {
  type: LpEChartType;
  option: Record<string, unknown>;
  className?: string;
}

function resolveCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function resolveCssVarsInOption(value: unknown): unknown {
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

/**
 * SSR 阶段只输出占位容器。
 * ECharts 实例在浏览器端由 editor-script 调用 initECharts() 初始化。
 */
export function LpEChart(props: LpEChartProps): ReactNode {
  const { type, option, className = '' } = props;
  const containerId = `lp-echart-${type}-${Math.random().toString(36).slice(2, 11)}`;
  const dataAttrs = {
  'data-lp-echart-type': type,
  'data-lp-echart-id': containerId,
  'data-lp-echart-option': JSON.stringify(option),
  };

  return (
  <div
      id={containerId}
      className={`lp-echart ${className}`}
      {...dataAttrs}
      style={{ width: '100%', height: '100%' }}
  />
  );
}

/**
 * 浏览器端初始化 ECharts 占位容器。
 * 需要在 client-render.js 中暴露，并由 editor-script 在页面加载/重新渲染后调用。
 * @param root 可选的根元素；传入时只初始化该元素内的图表，用于编辑器仅激活 slide 按需初始化。
 */
export function initECharts(root?: Element | null): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const containers = root
    ? root.querySelectorAll('[data-lp-echart-type]')
    : document.querySelectorAll('[data-lp-echart-type]');
  containers.forEach((container) => {
  if (!(container instanceof HTMLElement)) return;

  const type = container.getAttribute('data-lp-echart-type') as LpEChartType | null;
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
 * 在 reloadEditor 重新写入 HTML 前调用，避免内存泄漏。
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
