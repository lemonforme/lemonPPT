// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 子弹图（bullet_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 每行：值条 + 目标刻度（金色）；适合「实际 vs 目标」绩效读图。
 * 使用 echarts 渲染（与 theme01–07 统一）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, bulletOption } from './t10echart.js';

export interface Theme10BulletV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { label?: string; value?: number; target?: number; range?: number }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10BulletV1Meta: LayoutMeta = {
  id: 'theme10_bullet_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 子弹图',
  description: '实际值条 + 目标刻度线（绩效 vs 目标）',
  needsMedia: false,
  tags: ['bullet', 'gold-index', 'aurora', 'chart'],
  contentShape: 'bullet',
};

export const theme10BulletV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '绩效看板' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Bullets' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把目标画成一条线，实际就成了它的影子' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '值条是此刻的位置，金线是必须到达的地方。' },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { label: '营收', value: 82, target: 90, range: 100 },
        { label: '获客', value: 64, target: 60, range: 100 },
        { label: '留存', value: 71, target: 75, range: 100 },
        { label: '毛利', value: 58, target: 55, range: 100 },
      ],
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
        { key: 'value', label: '实际值', type: 'number', inlineEditable: true },
        { key: 'target', label: '目标值', type: 'number', inlineEditable: true },
        { key: 'range', label: '满量程(可选)', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '绩效看板' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10BulletV1(props: Theme10BulletV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({
    label: it?.label ?? `指标 ${i + 1}`,
    value: Number(it?.value ?? 0),
    target: Number(it?.target ?? 0),
    range: Number(it?.range ?? 0),
  }));
  const maxV = items.length ? Math.max(...items.flatMap((it) => [it.value, it.target, it.range].filter((x) => x > 0)), 1) : 1;

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-bullet">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={bulletOption({ labels: items.map((it) => it.label), value: items.map((it) => it.value), target: items.map((it) => it.target), max: maxV })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
