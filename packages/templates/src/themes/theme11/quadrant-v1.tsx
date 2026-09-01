// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 四象限图（quadrant_v1）
 * 情绪：daylight | 骨架：chart-canvas
 * 散点 + 象限标注，用于优先级/影响力分析。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11QuadrantOption } from './t11echart.js';

export interface Theme11QuadrantV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  xName?: string;
  yName?: string;
  qLabels?: [string, string, string, string];
  points?: { name: string; x: number; y: number; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11QuadrantV1Meta: LayoutMeta = {
  id: 'theme11_quadrant_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 四象限图',
  description: '优先级/影响力四象限散点图',
  needsMedia: false,
  tags: ['chart', 'quadrant', 'scatter', 'light-stream'],
  contentShape: 'quadrant',
};

export const theme11QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'PRIORITY' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '需求优先级四象限' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '横轴为影响度，纵轴为投入成本' },
    { key: 'xName', label: 'X轴名', type: 'text', defaultValue: '影响度' },
    { key: 'yName', label: 'Y轴名', type: 'text', defaultValue: '投入成本' },
    { key: 'qLabels', label: '象限标签', type: 'array', maxItems: 4, defaultValue: ['高影响\n高投入', '高影响\n低投入', '低影响\n高投入', '低影响\n低投入'], itemSchema: [{ key: 'item', label: '标签', type: 'text' }] },
    {
      key: 'points',
      label: '数据点',
      type: 'array',
      maxItems: 12,
      defaultValue: [
        { name: 'AI 排版', x: 85, y: 70, tone: 'accent' },
        { name: '智能配色', x: 78, y: 30, tone: 'green' },
        { name: '实时协作', x: 60, y: 80, tone: 'violet' },
        { name: '图表导入', x: 45, y: 40, tone: 'orange' },
        { name: '权限管理', x: 30, y: 60, tone: 'accent' },
        { name: '模板市场', x: 25, y: 20, tone: 'green' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11QuadrantV1(props: Theme11QuadrantV1Props): ReactNode {
  const { title, subtitle, eyebrow, xName, yName, qLabels, points = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const labels = (qLabels ?? ['高影响\n高投入', '高影响\n低投入', '低影响\n高投入', '低影响\n低投入']) as [string, string, string, string];
  const option = t11QuadrantOption({ points, xName, yName, qLabels: labels });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-quadrant">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chart-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-chart-body lp-rise">
        <div className="lp-theme11-chart-main">
          <T11EChart option={option} type="scatter" />
        </div>
      </div>
    </Sheet>
  );
}
