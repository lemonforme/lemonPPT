// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · Bento 网格页（bento_v1）
 * 情绪：aurora | 骨架：grid
 * 模块化数据卡片网格，适合多维度概览。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, GradientCard, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11BentoV1Item {
  title: string;
  description?: string;
  value?: string;
  accent?: boolean;
}

export interface Theme11BentoV1Props {
  title?: string;
  subtitle?: string;
  items?: Theme11BentoV1Item[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11BentoV1Meta: LayoutMeta = {
  id: 'theme11_bento_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 Bento 网格',
  description: '模块化数据卡片网格，适合多维度概览',
  needsMedia: false,
  tags: ['bento', 'grid', 'overview', 'light-stream'],
  contentShape: 'summary',
};

export const theme11BentoV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心能力全景' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据洞察到内容生成的完整链路' },
    {
      key: 'items',
      label: '模块项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '多模态理解', description: '支持文本、图表与布局语义联合解析', value: '01', accent: true },
        { title: '智能版式匹配', description: '基于角色与内容自动选择最佳版式', value: '02' },
        { title: '实时协同编辑', description: '多人同时在线调整内容与样式', value: '03', accent: true },
        { title: '一键导出', description: 'PPTX / PDF / 图片多格式无缝输出', value: '04' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '序号/数值', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11BentoV1(props: Theme11BentoV1Props): ReactNode {
  const { title, subtitle, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validItems = (items || []).filter((item): item is Theme11BentoV1Item => item != null).slice(0, 6);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-bento">
      <div className="lp-theme11-bento-header">
        <SectionTitle tone="accent" className="lp-theme11-bento-eyebrow">OVERVIEW</SectionTitle>
        {title && (
          <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-bento-title">{title}</EditableField>
        )}
        {subtitle && <Caption className="lp-theme11-bento-sub"><EditableField prop="subtitle" slideIdx={s} editable={e} as="span">{subtitle}</EditableField></Caption>}
      </div>

      <div className="lp-theme11-bento-grid">
        {validItems.map((item, index) => {
          const cellClass = `lp-theme11-bento-cell lp-rise ${item.accent ? 'lp-theme11-bento-cell-accent' : ''}`;
          const cellStyle = { animationDelay: `${index * 60}ms` } as React.CSSProperties;
          const titleField = (
            <EditableField
              prop={`items.${index}.title`}
              slideIdx={s}
              editable={e}
              as="h3"
              className="lp-theme11-bento-cell-title"
            >
              {item.title}
            </EditableField>
          );
          const descField = item.description ? (
            <EditableField
              prop={`items.${index}.description`}
              slideIdx={s}
              editable={e}
              as="p"
              className="lp-theme11-bento-cell-desc"
            >
              {item.description}
            </EditableField>
          ) : null;
          const numberEl = item.value ? <div className="lp-theme11-bento-number">{item.value}</div> : null;

          return item.accent ? (
            <GradientCard key={index} tone="blue" className={cellClass} style={cellStyle}>
              {numberEl}
              {titleField}
              {descField}
            </GradientCard>
          ) : (
            <Card key={index} className={cellClass} style={cellStyle}>
              {numberEl}
              {titleField}
              {descField}
            </Card>
          );
        })}
      </div>
    </Sheet>
  );
}
