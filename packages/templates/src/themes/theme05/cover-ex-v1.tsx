// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05CoverExV1Stat {
  value: string;
  unit?: string;
  label: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05CoverExV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  stats?: Theme05CoverExV1Stat[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05CoverExV1Meta: LayoutMeta = {
  id: 'theme05_cover_ex_v1',
  theme: 'theme05',
  role: 'cover',
  displayName: 'Theme 05 封面 左文右数',
  description: '左侧大标题 + 右侧 2×2 数据卡片网格',
  needsMedia: false,
  tags: ['cover', 'spectrum', 'grid'],
  contentShape: 'cover',
};

export const theme05CoverExV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'DATA REPORT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 大额融资年报' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本热度看行业格局演变' },
    {
      key: 'stats',
      label: '关键数据',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { value: '970', unit: '亿美元', label: '年度融资总额', scheme: 'coral' },
        { value: '128', unit: '笔', label: '大额交易数量', scheme: 'amber' },
        { value: '+38%', unit: '', label: '年度同比增长', scheme: 'teal' },
        { value: '12', unit: '家', label: '新晋独角兽', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-cover-ex-stat--${scheme || 'coral'}`;
}

export function Theme05CoverExV1(props: Theme05CoverExV1Props): ReactNode {
  const { tag, title, subtitle, stats = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-cover-ex">
      <div className="lp-theme05-cover-ex-main lp-rise">
        {tag && (
          <div className="lp-theme05-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme05-cover-ex-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-spectrum-bar lp-theme05-cover-ex-bar" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="lp-theme05-cover-ex-stats">
        {stats.map((s, i) => (
          <div key={i} className={`lp-theme05-cover-ex-stat ${schemeClass(s.scheme)} lp-rise`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="lp-theme05-cover-ex-stat-value">
              <EditableField prop={`stats.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{s.value}</EditableField>
              {s.unit && <EditableField prop={`stats.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{s.unit}</EditableField>}
            </div>
            <div className="lp-theme05-cover-ex-stat-label">
              <EditableField prop={`stats.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{s.label}</EditableField>
            </div>
          </div>
        ))}
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
