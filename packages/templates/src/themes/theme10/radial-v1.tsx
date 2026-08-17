// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 径向雷达图（radial_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 径向雷达：每类目占一轴，半径编码数值；专色描边 + 渐变填充（echarts）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, radialOption } from './t10echart.js';

export interface Theme10RadialV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { name?: string; value?: number }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10RadialV1Meta: LayoutMeta = {
  id: 'theme10_radial_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 径向图',
  description: '径向雷达（半径编码数值）',
  needsMedia: false,
  tags: ['radial', 'rose', 'polar', 'gold-index', 'ember', 'chart'],
  contentShape: 'radial',
};

export const theme10RadialV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Radial' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一圈扇形，把排名转成了长度' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每个扇区是一类目，伸得越长权重越大；中心到外缘即全距。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: '权益', value: 82 },
        { name: '固收', value: 64 },
        { name: '另类', value: 48 },
        { name: '现金', value: 36 },
        { name: '海外', value: 70 },
        { name: '商品', value: 44 },
      ],
      itemSchema: [
        { key: 'name', label: '类目名', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '51' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10RadialV1(props: Theme10RadialV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? [])
    .map((it, i) => ({ name: it?.name ?? `类目 ${i + 1}`, value: Number(it?.value ?? 0) }))
    .slice(0, 8);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-radial">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={radialOption({ items })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
