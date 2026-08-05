// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03StatsV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  stats?: Array<{ value?: string; unit?: string; label?: string; change?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03StatsV1Meta: LayoutMeta = {
  id: 'theme03_stats_v1',
  theme: 'theme03',
  role: 'stats',
  displayName: 'Theme 03 编辑风多指标',
  description: '深色代码编辑风多指标数据卡片展示',
  needsMedia: false,
  tags: ['stats', 'metrics', 'data'],
  contentShape: 'metric-grid',
};

export const theme03StatsV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'STATS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{增长}}数据一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'stats',
      label: '统计数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'change', label: '变化', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-stats-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03StatsV1(props: Theme03StatsV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    stats = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;
  const safeStats = stats.slice(0, 6);

  return (
    <div className="lp-slide lp-theme03-stats-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-stats-main">
        <div className="lp-theme03-stats-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-stats-subtitle">{subtitle}</EditableField>
          )}
        </div>
        {safeStats.length > 0 && (
          <div className="lp-theme03-stats-grid">
            {safeStats.map((stat, index) => (
              <div key={index} className="lp-theme03-stats-card lp-rise" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="lp-theme03-stats-card-top">
                  <div className="lp-theme03-stats-value">
                    <EditableField prop={`stats.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {stat.value}
                    </EditableField>
                    {stat.unit && (
                      <EditableField prop={`stats.${index}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-stats-unit">
                        {stat.unit}
                      </EditableField>
                    )}
                  </div>
                  {stat.change && (
                    <div className="lp-theme03-stats-change">
                      <EditableField prop={`stats.${index}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{stat.change}</EditableField>
                    </div>
                  )}
                </div>
                <EditableField prop={`stats.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-stats-label">
                  {stat.label}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
