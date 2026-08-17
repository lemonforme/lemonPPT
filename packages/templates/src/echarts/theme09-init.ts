// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import {
  BarChart,
  CustomChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  ParallelChart,
  PieChart,
  PictorialBarChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  ThemeRiverChart,
  TreemapChart,
} from 'echarts/charts';
import {
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  GraphicComponent,
  LegendComponent,
  MarkAreaComponent,
  PolarComponent,
  MarkLineComponent,
  MarkPointComponent,
  ParallelComponent,
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { getTheme09Tokens } from '../themes/theme09/tokens.js';
import { observeChartResize, resolveCssVarsInOption, unobserveChartResize } from './shared-utils.js';

// theme09 墨韵专色风：注册该主题实际使用的图表模块（覆盖 P2 数据图表全部类型）。
echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
  GraphicComponent,
  MarkLineComponent,
  MarkPointComponent,
  DatasetComponent,
  SingleAxisComponent,
  ParallelComponent,
  PolarComponent,
  MarkAreaComponent,
  TreemapChart,
  SankeyChart,
  SunburstChart,
  GaugeChart,
  HeatmapChart,
  FunnelChart,
  RadarChart,
  GraphChart,
  PictorialBarChart,
  ThemeRiverChart,
  CustomChart,
  ParallelChart,
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
]);

function buildRuntimeEChartTheme(): Record<string, unknown> {
  // 多数 P2 图表位于纸底；option 已携带按基底解析的具体色值，此处仅作默认兜底。
  const t = getTheme09Tokens('paper', 'primary');
  return {
    color: [...t.colors.series],
    textStyle: {
      fontFamily: t.fonts.body,
    },
  };
}

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
      // 显式传入当前测量尺寸；容器尚未布局时退回 16:9 稿面比例，避免 ECharts 记录 0 尺寸。
      const measuredW = container.offsetWidth || container.clientWidth;
      const measuredH = container.offsetHeight || container.clientHeight;
      const instance = echarts.init(container, theme, {
        renderer: 'svg',
        width: measuredW > 0 ? measuredW : 1140,
        height: measuredH > 0 ? measuredH : 612,
      });
      instance.setOption(option, true);
      (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance = instance;
      container.setAttribute('data-lp-echart-last-option', optionRaw);
      // 持续跟随容器真实尺寸，彻底解决「默认只渲染一半、交互后才完整」的问题。
      observeChartResize(container, instance);
    } catch (err) {
      console.warn('ECharts 初始化失败', type, err);
    }
  });
}

export function disposeECharts(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-lp-echart-type]').forEach((container) => {
    const inst = (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance;
    if (inst && !inst.isDisposed()) {
      inst.dispose();
    }
    if (container instanceof HTMLElement) unobserveChartResize(container);
  });
}

export { echarts };
