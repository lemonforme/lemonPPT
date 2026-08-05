// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06TableOfContentsV1Item {
  title?: string;
  page?: string;
}

export interface Theme06TableOfContentsV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06TableOfContentsV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme06_table_of_contents_v1',
  theme: 'theme06',
  role: 'tableOfContents',
  displayName: 'Theme 06 目录导航',
  description: '双列目录卡片，章节编号 + 标题 + 页码',
  needsMedia: true,
  tags: ['toc', 'navigation', 'atlas'],
  contentShape: 'table-of-contents',
};

export const theme06TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本次汇报的核心章节安排' },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { title: '市场格局与投资趋势', page: '02' },
        { title: '核心数据与关键指标', page: '04' },
        { title: '竞争态势与机会象限', page: '06' },
        { title: '落地路径与里程碑', page: '08' },
        { title: '风险研判与应对策略', page: '10' },
        { title: '结论与下一步行动', page: '12' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
      ],
    },
  ],
};

export function Theme06TableOfContentsV1(props: Theme06TableOfContentsV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;
  const validItems = (items || []).filter((it): it is Theme06TableOfContentsV1Item => it != null).slice(0, 8);

  return (
    <div className="lp-slide lp-theme06-toc">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-toc-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme06-toc-grid lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className="lp-theme06-toc-item">
              <div className="lp-theme06-toc-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="lp-theme06-toc-body">
                <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-toc-title">{item.title || ''}</EditableField>
                {item.page && (
                  <EditableField prop={`items.${index}.page`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-toc-page">第 {item.page} 页</EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
