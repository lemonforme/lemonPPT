// lemonPPT - theme07 调研内容页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme07SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07Barcode } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ContentV1Item {
  title?: string;
  desc?: string;
}

export interface Theme07ContentV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme07ContentV1Item[];
  showConclusion?: boolean;
  conclusion?: { value?: string; label?: string; description?: string };
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ContentV1Meta: LayoutMeta = {
  id: 'theme07_content_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 调研内容页',
  description: '左文右要点：衬线标题 + 编号要点列表 + 可选结论面板 + 背景图',
  needsMedia: true,
  tags: ['content', 'insight', 'research'],
  contentShape: 'content',
};

export const theme07ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY POINTS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心要点总结' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本章节提炼了三个关键结论' },
    {
      key: 'items',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '资本向头部集中', desc: '前 10% 的项目吸纳了 70% 的新增资金，马太效应明显。' },
        { title: '应用层增速最快', desc: 'Agent 与垂直场景的早期项目交易量同比翻倍。' },
        { title: '退出周期拉长', desc: '平均退出周期从 5.2 年延长至 7.4 年，流动性压力上升。' },
      ],
      itemSchema: [
        { key: 'title', label: '要点标题', type: 'text' },
        { key: 'desc', label: '要点说明', type: 'textarea' },
      ],
    },
    { key: 'showConclusion', label: '显示结论区', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: { value: '+38%', label: '年度同比增长', description: '核心指标连续四个季度保持双位数增长。' },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme07ContentV1(props: Theme07ContentV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);
  const validItems = (items || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-content">
      <Theme07SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-content-main lp-rise">
        <Theme07IconChip name="doc" />
        {kicker && (
          <div className="lp-theme07-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme07-underline" aria-hidden="true" />
        {hasConclusion && (
          <div className="lp-theme07-conclusion">
            {conclusion!.value && (
              <div className="lp-theme07-conclusion-value">
                <EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField>
              </div>
            )}
            {conclusion!.label && (
              <div className="lp-theme07-conclusion-label">
                <EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField>
              </div>
            )}
            {conclusion!.description && (
              <div className="lp-theme07-conclusion-desc">
                <EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion!.description}</EditableField>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="lp-theme07-content-aside lp-rise">
        {validItems.length > 0 && (
          <div className="lp-theme07-content-items">
            {validItems.map((item, i) => (
              <div key={i} className="lp-theme07-content-item" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme07-content-item-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="lp-theme07-content-item-body">
                  {item.title && (
                    <EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-content-item-title">{item.title}</EditableField>
                  )}
                  {item.desc && (
                    <EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-content-item-desc">{item.desc}</EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07Barcode count={22} />
    </div>
  );
}
