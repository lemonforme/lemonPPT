// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 雷达图（radar_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 多维雷达（多序列多边形）（echarts radar）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, radarOption } from './t10echart.js';

export interface Theme10RadarV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  axes?: string[];
  series?: { name?: string; values?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10RadarV1Meta: LayoutMeta = {
  id: 'theme10_radar_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 雷达图',
  description: '多维度雷达（多边形）',
  needsMedia: false,
  tags: ['radar', 'polar', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'radar',
};

export const theme10RadarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Radar' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '五个维度，被一张网罩住强弱' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每条轴是一个能力维度；面积越大，整体越饱满。' },
    {
      key: 'axes',
      label: '维度',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: ['收益', '风险', '流动', '规模', '透明'],
      itemSchema: [{ key: 'text', label: '维度名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: '组合 A', values: '80,55,70,60,75' },
        { name: '组合 B', values: '60,75,50,80,65' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '50' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10RadarV1(props: Theme10RadarV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const axes = (props.axes ?? []).map((a) => (typeof a === 'string' ? a : String((a as { text?: string })?.text ?? ''))).filter(Boolean);
  const sers = (props.series ?? []).map((sr, i) => ({
    name: sr?.name ?? `序列 ${i + 1}`,
    values: (sr?.values ?? '')
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((n) => isFinite(n)),
  }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-radar">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={radarOption({ axes, series: sers })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
