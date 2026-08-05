// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05CoverV1Metric {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme05CoverV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  metrics?: Theme05CoverV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05CoverV1Meta: LayoutMeta = {
  id: 'theme05_cover_v1',
  theme: 'theme05',
  role: 'cover',
  displayName: 'Theme 05 光谱封面',
  description: '编辑感封面：大标题 + 光谱色带 + 右侧关键指标',
  needsMedia: false,
  tags: ['cover', 'spectrum', 'data-report'],
  contentShape: 'cover',
};

export const theme05CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'DATA REPORT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 大额融资年报' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本热度看行业格局演变' },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

export function Theme05CoverV1(props: Theme05CoverV1Props): ReactNode {
  const { tag, title, subtitle, metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-cover">
      <div className="lp-theme05-cover-main lp-rise">
        {tag && (
          <div className="lp-theme05-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme05-cover-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        {metrics.length > 0 && (
          <div className="lp-theme05-cover-metrics">
            {metrics.map((m, i) => (
              <div key={i} className={`lp-theme05-cover-metric ${m.accent ? 'accent' : ''} lp-rise`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="lp-theme05-cover-metric-value">
                  <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                  {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
                </div>
                <div className="lp-theme05-cover-metric-label">
                  <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme05-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
    </div>
  );
}
