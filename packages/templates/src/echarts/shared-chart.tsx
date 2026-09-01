// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';

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
  | 'bubble'
  | 'pie'
  | 'themeRiver'
  | 'waterfall'
  | 'candlestick'
  | 'parallel'
  | 'radian'
  | 'bump'
  | 'custom';

export interface LpEChartProps {
  type: LpEChartType;
  option: Record<string, unknown>;
  className?: string;
}

/**
 * SSR 阶段只输出占位容器，不依赖 echarts 核心库。
 * ECharts 实例在浏览器端由对应主题的 initECharts 按需初始化。
 */
export function LpEChart(props: LpEChartProps): ReactNode {
  const { type, option, className = '' } = props;
  const containerId = `lp-echart-${type}-${Math.random().toString(36).slice(2, 11)}`;
  return (
    <div
      id={containerId}
      className={`lp-echart ${className}`}
      data-lp-echart-type={type}
      data-lp-echart-id={containerId}
      data-lp-echart-option={JSON.stringify(option)}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
