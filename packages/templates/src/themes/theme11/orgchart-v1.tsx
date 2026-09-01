// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 组织架构图页（orgchart_v1）
 * 情绪：daylight | 骨架：chart-canvas
 * ECharts 树图 + 左侧标题面板。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { T11EChart, t11TreeOption } from './t11echart.js';
import { EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11OrgchartV1Node {
  name: string;
  children?: Theme11OrgchartV1Node[];
}

export interface Theme11OrgchartV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  rootName?: string;
  treeData?: Theme11OrgchartV1Node;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11OrgchartV1Meta: LayoutMeta = {
  id: 'theme11_orgchart_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 组织架构图页',
  description: '树状组织架构，支持多层节点',
  needsMedia: false,
  tags: ['orgchart', 'tree', 'chart-canvas', 'light-stream'],
  contentShape: 'hierarchy',
};

export const theme11OrgchartV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '产品团队架构' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从战略到执行的职能分工' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'ORG CHART' },
    { key: 'rootName', label: '根节点名称', type: 'text', defaultValue: '产品 VP' },
    {
      key: 'treeData',
      label: '树状数据',
      type: 'object',
      defaultValue: {
        name: '产品 VP',
        children: [
          {
            name: '产品组',
            children: [{ name: '用户产品' }, { name: '商业产品' }, { name: '数据产品' }],
          },
          {
            name: '设计组',
            children: [{ name: 'UX 研究' }, { name: '视觉设计' }],
          },
          {
            name: '工程组',
            children: [{ name: '前端' }, { name: '后端' }, { name: 'QA' }],
          },
        ],
      },
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11OrgchartV1(props: Theme11OrgchartV1Props): ReactNode {
  const { title, subtitle, eyebrow, treeData, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const data = treeData || { name: props.rootName ?? 'Root', children: [] };

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-orgchart">
      <div className="lp-theme11-orgchart-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="blue"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-orgchart-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-orgchart-body lp-theme11-chart-body lp-rise">
        <T11EChart option={t11TreeOption({ data: [data] })} type="tree" />
      </div>
    </Sheet>
  );
}
