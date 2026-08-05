// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02StatsV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02StatsV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  stats?: Array<{ value?: string; unit?: string; label?: string }>;
  showInsight?: boolean;
  insight?: Theme02StatsV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02StatsV1Meta: LayoutMeta = {
  id: 'theme02_stats_v1',
  theme: 'theme02',
  role: 'stats',
  displayName: 'Theme 02 霓虹多指标',
  description: '深色背景 + 霓虹发光多指标数据卡片',
  needsMedia: false,
};

export const theme02StatsV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'stats',
      label: '统计数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        {
          key: 'value',
          label: '数值',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'unit',
          label: '单位',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '3.2x',
        label: '全年增长倍数',
        description: '核心指标呈现指数级增长，市场渗透率快速提升。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme02StatsV1(props: Theme02StatsV1Props): ReactNode {
  const { kicker, title, subtitle, stats = [], showInsight = true, insight, _slideIdx, _editable } = props;

  return (
    <div className={`lp-slide lp-theme02-stats-v1 ${showInsight && insight ? 'lp-theme02-stats-v1--insight' : ''}`}>
      <div className="lp-theme02-stats-main">
        <div className="lp-theme02-stats-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-stats-title lp-rise">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-stats-subtitle lp-rise">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`lp-theme02-stats-card lp-rise lp-theme02-stats-card--${['accent', 'cool', 'warm'][index % 3]}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="lp-theme02-stats-value">
                <EditableField prop={`stats.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {stat.value}
                </EditableField>
                {stat.unit && (
                  <EditableField prop={`stats.${index}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-stats-unit">
                    {stat.unit}
                  </EditableField>
                )}
              </div>
              <EditableField prop={`stats.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-stats-label">
                {stat.label}
              </EditableField>
            </div>
          ))}
        </div>
      </div>

      {showInsight && insight && (
        <div className="lp-theme02-insight-panel lp-rise">
          <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-insight-value">
            {insight.value}
          </EditableField>
          <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-insight-label">
            {insight.label}
          </EditableField>
          {insight.description && (
            <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-insight-description">
              {insight.description}
            </EditableField>
          )}
        </div>
      )}
    </div>
  );
}
