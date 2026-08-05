// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06BentoV1Item {
  title: string;
  description?: string;
  value?: string;
  accent?: boolean;
}

export interface Theme06BentoV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06BentoV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06BentoV1Meta: LayoutMeta = {
  id: 'theme06_bento_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 Bento 网格',
  description: '模块化数据卡片网格，适合多维度概览',
  needsMedia: true,
  tags: ['bento', 'grid', 'overview', 'atlas'],
  contentShape: 'summary',
};

export const theme06BentoV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'OVERVIEW' },
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
        { title: '实时协同编辑', description: '多人同时在线调整内容与样式', value: '03' },
        { title: '一键导出', description: 'PPTX / PDF / 图片多格式无缝输出', value: '04', accent: true },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '序号/数值', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
  ],
};

export function Theme06BentoV1(props: Theme06BentoV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;
  const validItems = (items || []).filter((item): item is Theme06BentoV1Item => item != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-bento">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-bento-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-bento-grid lp-rise">
        {validItems.map((item, index) => (
          <div
            key={index}
            className={`lp-theme06-bento-cell ${item.accent ? 'lp-theme06-bento-cell--accent' : ''}`}
            style={{ animationDelay: `${index * 80}ms` } as React.CSSProperties}
          >
            {item.value && (
              <div className="lp-theme06-bento-number">{item.value}</div>
            )}
            <EditableField
              prop={`items.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-theme06-bento-cell-title"
            >
              {item.title}
            </EditableField>
            {item.description && (
              <EditableField
                prop={`items.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme06-bento-cell-desc"
              >
                {item.description}
              </EditableField>
            )}
          </div>
        ))}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
