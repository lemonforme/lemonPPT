// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06SourcesV1Source {
  text?: string;
}

export interface Theme06SourcesV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  sources?: Theme06SourcesV1Source[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SourcesV1Meta: LayoutMeta = {
  id: 'theme06_sources_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 数据来源',
  description: '数据来源与参考资料列表，适合报告附录',
  needsMedia: true,
  tags: ['sources', 'references', 'atlas'],
  contentShape: 'sources',
};

export const theme06SourcesV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SOURCES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '数据来源' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本报告引用的公开数据与研究来源' },
    {
      key: 'sources',
      label: '来源项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { text: 'PitchBook：2026 全球 AI 投融资报告' },
        { text: 'CB Insights：State of AI 2026' },
        { text: 'lemonPPT 研究：中国 AI 应用落地调研' },
        { text: 'OpenAI / Anthropic 官方博客与论文' },
      ],
      itemSchema: [{ key: 'text', label: '来源', type: 'textarea' }],
    },
  ],
};

export function Theme06SourcesV1(props: Theme06SourcesV1Props): ReactNode {
  const { kicker, title, subtitle, sources = [], _slideIdx, _editable } = props;
  const validSources = (sources || []).filter((s): s is Theme06SourcesV1Source => s != null).slice(0, 8);

  return (
    <div className="lp-slide lp-theme06-sources">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-sources-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validSources.length > 0 && (
        <ul className="lp-theme06-sources-list lp-rise">
          {validSources.map((source, index) => (
            <li key={index} className="lp-theme06-sources-item">
              <span className="lp-theme06-sources-marker">{String(index + 1).padStart(2, '0')}</span>
              <EditableField prop={`sources.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{source.text || ''}</EditableField>
            </li>
          ))}
        </ul>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
