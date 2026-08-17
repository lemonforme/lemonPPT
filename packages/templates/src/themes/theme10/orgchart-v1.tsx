// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 组织层级图（orgchart_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * root(name/role) + children[]{name,role}；根节点居中在上，
 * 子节点一行铺开，连线自根而下。使用 echarts tree 渲染（与 theme01–07 统一）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, orgchartOption } from './t10echart.js';

export interface Theme10OrgchartV1Child { name?: string; role?: string; }
export interface Theme10OrgchartV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  rootName?: string;
  rootRole?: string;
  children?: Theme10OrgchartV1Child[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10OrgchartV1Meta: LayoutMeta = {
  id: 'theme10_orgchart_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 组织层级图',
  description: '层级结构组织图',
  needsMedia: false,
  tags: ['orgchart', 'hierarchy', 'tree', 'gold-index', 'aurora', 'chart'],
  contentShape: 'orgchart',
};

export const theme10OrgchartV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '组织与结构' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Org' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一棵树的样子' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '根是决策，枝叶是执行；层级一眼看清。' },
    { key: 'rootName', label: '根名称', type: 'text', inlineEditable: true, defaultValue: '总部' },
    { key: 'rootRole', label: '根职能', type: 'text', inlineEditable: true, defaultValue: '战略中枢' },
    {
      key: 'children',
      label: '子节点',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { name: '研发', role: '产品与技术' },
        { name: '市场', role: '增长与品牌' },
        { name: '运营', role: '交付与客服' },
        { name: '财务', role: '资金与风控' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'role', label: '职能', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '组织与结构' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '67' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10OrgchartV1(props: Theme10OrgchartV1Props): ReactNode {
  const { section, title, lead, rootName, rootRole, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const kids = (props.children ?? []).map((c, i) => ({ name: c.name ?? `单元 ${i + 1}`, role: c.role ?? '' }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-orgchart">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={orgchartOption({ root: { name: rootName ?? '总部', role: rootRole }, children: kids })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
