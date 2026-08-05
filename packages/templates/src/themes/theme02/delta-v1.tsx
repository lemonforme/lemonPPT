// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02DeltaItem {
  label?: string;
  previous?: number;
  current?: number;
  unit?: string;
}

export interface Theme02DeltaV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02DeltaV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02DeltaItem[];
  footnote?: string;
  showInsight?: boolean;
  insight?: Theme02DeltaV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02DeltaV1Meta: LayoutMeta = {
  id: 'theme02_delta_v1',
  theme: 'theme02',
  role: 'metric',
  displayName: 'Theme 02 今昔对照',
  description: '霓虹数据对比卡，展示关键指标的前后变化',
  needsMedia: false,
};

export const theme02DeltaV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '对照项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'previous',
          label: '前值',
          type: 'number',
        },
        {
          key: 'current',
          label: '现值',
          type: 'number',
        },
        {
          key: 'unit',
          label: '单位',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
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
        value: '+127%',
        label: '平均改善幅度',
        description: '所有对照项均实现正增长，运营效率显著提升。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme02DeltaV1(props: Theme02DeltaV1Props): ReactNode {
  const { title, kicker, subtitle, items = [], footnote, showInsight = true, insight, _slideIdx, _editable } = props;

  const validItems = items
    .filter((item): item is Theme02DeltaItem => item != null)
    .map((item) => {
      const previous = Number(item.previous) || 0;
      const current = Number(item.current) || 0;
      const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0;
      return { ...item, previous, current, delta };
    });

  return (
    <div className={`lp-slide lp-theme02-delta-v1 ${showInsight && insight ? 'lp-theme02-delta-v1--insight' : ''}`}>
      <div className="lp-theme02-delta-main">
        <div className="lp-theme02-delta-card lp-rise">
          <div className="lp-theme02-delta-header">
            {kicker && (
              <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
                {kicker}
              </EditableField>
            )}
            <div>
              <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-delta-title">
                {title}
              </EditableField>
              {subtitle && (
                <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-delta-subtitle">
                  {subtitle}
                </EditableField>
              )}
            </div>
          </div>

          <div className="lp-theme02-delta-grid">
            {validItems.map((item, index) => {
              const positive = item.delta >= 0;
              return (
                <div
                  key={index}
                  className={`lp-theme02-delta-item lp-rise ${positive ? 'lp-theme02-delta-item--up' : 'lp-theme02-delta-item--down'}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <EditableField
                    prop={`items.${index}.label`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-theme02-delta-label"
                  >
                    {item.label}
                  </EditableField>
                  <div className="lp-theme02-delta-values">
                    <div className="lp-theme02-delta-previous">
                      <span className="lp-theme02-delta-value-label">前</span>
                      <span className="lp-theme02-delta-value-number">{item.previous}</span>
                      {item.unit && <span className="lp-theme02-delta-value-unit">{item.unit}</span>}
                    </div>
                    <div className="lp-theme02-delta-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {positive ? (
                          <path d="M5 17l7-7 7 7" />
                        ) : (
                          <path d="M5 7l7 7 7-7" />
                        )}
                      </svg>
                    </div>
                    <div className="lp-theme02-delta-current">
                      <span className="lp-theme02-delta-value-label">现</span>
                      <EditableField
                        prop={`items.${index}.current`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="span"
                        className="lp-theme02-delta-value-number"
                      >
                        {item.current}
                      </EditableField>
                      {item.unit && (
                        <EditableField
                          prop={`items.${index}.unit`}
                          slideIdx={_slideIdx}
                          editable={_editable}
                          as="span"
                          className="lp-theme02-delta-value-unit"
                        >
                          {item.unit}
                        </EditableField>
                      )}
                    </div>
                  </div>
                  <div className="lp-theme02-delta-change">
                    <span className="lp-theme02-delta-change-badge">
                      {positive ? '+' : ''}
                      {item.delta.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {footnote && (
            <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-delta-footnote">
              {footnote}
            </EditableField>
          )}
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
