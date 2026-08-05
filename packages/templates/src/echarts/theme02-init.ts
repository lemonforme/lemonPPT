// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { theme02TokensA, theme02TokensB, type Theme02Tokens } from '../themes/theme02/tokens.js';
import { resolveCssVar, resolveCssVarsInOption } from './shared-utils.js';

// theme02 霓虹科技风：仅注册该主题实际使用的图表模块。
echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  FunnelChart,
  RadarChart,
  GaugeChart,
  BarChart,
  LineChart,
  PieChart,
]);

function getCurrentScheme(): 'a' | 'b' {
  const html = document.documentElement;
  const theme = html.getAttribute('data-theme');
  return theme === 'scheme-b' ? 'b' : 'a';
}

function buildRuntimeEChartTheme(): Record<string, unknown> {
  const scheme = getCurrentScheme();
  const tokens: Theme02Tokens = scheme === 'b' ? theme02TokensB : theme02TokensA;
  return {
    color: [tokens.accent, tokens.accent2, tokens.accentCool, tokens.ink3, tokens.ink2],
    textStyle: {
      fontFamily: resolveCssVar('--lp-font', tokens.font),
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
      const instance = echarts.init(container, theme, { renderer: 'svg' });
      instance.setOption(option, true);
      (container as HTMLElement & { __lpEChartInstance?: echarts.ECharts }).__lpEChartInstance = instance;
      container.setAttribute('data-lp-echart-last-option', optionRaw);
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
  });
}

export { echarts };
