// lemonPPT - theme07 调研目录
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07MiniBars } from './decoration.js';
import { Theme07IconChip } from './theme07-icons.js';

export interface Theme07TocEntry {
  number: string;
  title: string;
  page?: string;
  accent?: boolean;
}

export interface Theme07TableOfContentsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  entries?: Theme07TocEntry[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme07_table_of_contents_v1',
  theme: 'theme07',
  role: 'tableOfContents',
  displayName: 'Theme 07 调研目录',
  description: '衬线目录标题 + 2 列大卡片章节条目，卡片带半透明数字水印',
  needsMedia: false,
  tags: ['toc', 'agenda', 'research'],
  contentShape: 'toc',
};

export const theme07TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'STRUCTURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '报告结构' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从方法到结论的阅读路径' },
    {
      key: 'entries',
      label: '章节条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { number: '01', title: '研究方法', page: 'P.04', accent: false },
        { number: '02', title: '市场全景', page: 'P.12', accent: true },
        { number: '03', title: '横向透视', page: 'P.24', accent: false },
        { number: '04', title: '产业链条', page: 'P.36', accent: false },
        { number: '05', title: '典型案例', page: 'P.48', accent: false },
        { number: '06', title: '风险展望', page: 'P.58', accent: false },
        { number: '07', title: '结论判断', page: 'P.66', accent: false },
        { number: '08', title: '数据来源', page: 'P.70', accent: false },
      ],
      itemSchema: [
        { key: 'number', label: '序号', type: 'text' },
        { key: 'title', label: '章节标题', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
        { key: 'accent', label: '高亮', type: 'boolean' },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '先建立框架，再进入数据和判断。' },
  ],
};

export function Theme07TableOfContentsV1(props: Theme07TableOfContentsV1Props): ReactNode {
  const { kicker, title, subtitle, entries = [], footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-toc">
      <div className="lp-theme07-toc-header lp-rise">
        <Theme07IconChip name="layers" />
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
      </div>
      {entries.length > 0 && (
        <div className="lp-theme07-toc-grid lp-rise">
          {entries.map((entry, i) => (
            <div
              key={i}
              className={`lp-theme07-toc-item ${entry.accent ? 'accent' : ''}`}
              data-number={entry.number}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="lp-theme07-toc-number">
                <EditableField prop={`entries.${i}.number`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.number}</EditableField>
              </div>
              <div className="lp-theme07-toc-title">
                <EditableField prop={`entries.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.title}</EditableField>
              </div>
              {entry.page && (
                <div className="lp-theme07-toc-page">
                  <EditableField prop={`entries.${i}.page`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.page}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {footnote && (
        <div className="lp-theme07-sources-footnote lp-rise" style={{ marginTop: 18 }}>
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="p">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07MiniBars count={20} />
    </div>
  );
}
