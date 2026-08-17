// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 仪表盘（gauge_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 单值 KPI 仪表盘（echarts gauge）：进度弧 + 指针 + 中心数值。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, gaugeOption } from './t10echart.js';

export interface Theme10GaugeV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  value?: number;
  unit?: string;
  gaugeLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10GaugeV1Meta: LayoutMeta = {
  id: 'theme10_gauge_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 仪表盘',
  description: '单值 KPI 仪表盘',
  needsMedia: false,
  tags: ['gauge', 'gold-index', 'ember', 'chart'],
  contentShape: 'gauge',
};

export const theme10GaugeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '关键指标' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'KPI' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '达成率不是终点，而是下一程的发令枪' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把目标刻在表盘上，剩下的只是与时间赛跑。' },
    { key: 'value', label: '数值(0-100)', type: 'number', inlineEditable: true, defaultValue: 72 },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'gaugeLabel', label: '表盘标签', type: 'text', inlineEditable: true, defaultValue: '目标达成率' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '关键指标' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10GaugeV1(props: Theme10GaugeV1Props): ReactNode {
  const { section, title, lead, value = 0, unit = '%', gaugeLabel, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const label = gaugeLabel || undefined;

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-gauge">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={gaugeOption({ value: v, max: 100, label, unit })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
