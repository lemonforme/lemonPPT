// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06QuadrantV1Bubble {
  name?: string;
  x?: number;
  y?: number;
  size?: number;
}

export interface Theme06QuadrantV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  bubbles?: Theme06QuadrantV1Bubble[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06QuadrantV1Meta: LayoutMeta = {
  id: 'theme06_quadrant_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 2×2 气泡矩阵',
  description: '象限气泡图 + 右侧图例',
  needsMedia: true,
  tags: ['matrix', 'quadrant', 'bubble', 'atlas'],
  contentShape: 'matrix',
};

export const theme06QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'QUADRANT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '竞争格局象限分析' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按市场影响力与增长潜力划分赛道玩家' },
    { key: 'xAxisLabel', label: '横轴标签', type: 'text', inlineEditable: true, defaultValue: '市场影响力 →' },
    { key: 'yAxisLabel', label: '纵轴标签', type: 'text', inlineEditable: true, defaultValue: '增长潜力 →' },
    {
      key: 'bubbles',
      label: '气泡数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { name: '领导者', x: 85, y: 82, size: 48 },
        { name: '挑战者', x: 72, y: 45, size: 36 },
        { name: '探索者', x: 35, y: 78, size: 32 },
        { name: '利基者', x: 28, y: 30, size: 24 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'x', label: 'X 值', type: 'number' },
        { key: 'y', label: 'Y 值', type: 'number' },
        { key: 'size', label: '大小', type: 'number' },
      ],
    },
  ],
};

function buildOption(bubbles: Theme06QuadrantV1Bubble[]): Record<string, unknown> {
  const validBubbles = bubbles.filter((b) => b != null && typeof b.x === 'number' && typeof b.y === 'number');
  const data = validBubbles.map((b) => [b.x, b.y, b.size ?? 30, b.name ?? '']);

  return {
    grid: { top: 24, right: 24, bottom: 48, left: 56, containLabel: false },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: 'var(--lp-border)', type: 'dashed' } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: 'var(--lp-border)', type: 'dashed' } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { show: false },
    },
    series: [
      {
        type: 'scatter',
        data,
        symbolSize: (value: number[]) => value[2] ?? 30,
        itemStyle: {
          color: 'rgba(182, 255, 43, 0.22)',
          borderColor: 'var(--lp-accent)',
          borderWidth: 1,
          shadowColor: 'var(--lp-focus-glow)',
          shadowBlur: 12,
        },
        label: {
          show: true,
          formatter: (params: { data?: (string | number)[] }) => params.data?.[3] ?? '',
          color: 'var(--lp-ink)',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'var(--lp-font)',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: 'var(--lp-border-strong)', type: 'solid', width: 1 },
          data: [
            { xAxis: 50 },
            { yAxis: 50 },
          ],
        },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme06QuadrantV1(props: Theme06QuadrantV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, yAxisLabel, bubbles = [], _slideIdx, _editable } = props;

  const validBubbles = (bubbles || [])
    .filter((b): b is Theme06QuadrantV1Bubble => b != null && typeof b.x === 'number' && typeof b.y === 'number')
    .slice(0, 12);
  const hasData = validBubbles.length > 0;

  return (
    <div className="lp-slide lp-theme06-quadrant">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-quadrant-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-quadrant-body lp-rise">
        <div className="lp-theme06-quadrant-grid">
          {xAxisLabel && <div className="lp-theme06-quadrant-axis-x">{xAxisLabel}</div>}
          {yAxisLabel && <div className="lp-theme06-quadrant-axis-y">{yAxisLabel}</div>}
          <div className="lp-theme06-quadrant-bubbles">
            {hasData ? (
              <LpEChart
                type="scatter"
                option={buildOption(validBubbles)}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
                请在右侧属性面板输入数据
              </div>
            )}
          </div>
        </div>

        <div className="lp-theme06-quadrant-aside">
          <div className="lp-theme06-quadrant-legend">
            <div className="lp-theme06-quadrant-legend-title">图例说明</div>
            {validBubbles.slice(0, 6).map((bubble, index) => (
              <div key={index} className="lp-theme06-quadrant-legend-item">
                <span className="lp-theme06-quadrant-legend-dot" style={{ opacity: 0.6 + index * 0.08 }} />
                <EditableField prop={`bubbles.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{bubble.name || `气泡 ${index + 1}`}</EditableField>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
