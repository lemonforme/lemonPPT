// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02BentoV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02BentoV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items: Array<{ label: string; value: string; unit?: string; size?: 'small' | 'medium' | 'large' }>;
  showInsight?: boolean;
  insight?: Theme02BentoV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02BentoV1Meta: LayoutMeta = {
  id: 'theme02_bento_v1',
  theme: 'theme02',
  role: 'bento',
  displayName: 'Theme 02 霓虹 Bento',
  description: '不规则数据卡片网格 + 霓虹强调',
  needsMedia: false,
};

export const theme02BentoV1Schema: PropsSchema = {
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
      key: 'items',
      label: '数据项',
      type: 'array',
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'size', label: '尺寸', type: 'select', options: [{ value: 'small', label: '小' }, { value: 'medium', label: '中' }, { value: 'large', label: '大' }] },
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
        value: '5',
        label: '核心增长引擎',
        description: 'Bento 网格呈现的五项业务均保持双位数增长。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme02BentoV1(props: Theme02BentoV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], showInsight = true, insight, _slideIdx, _editable } = props;

  return (
    <div className={`lp-slide lp-theme02-bento-v1 ${showInsight && insight ? 'lp-theme02-bento-v1--insight' : ''}`}>
      <div className="lp-theme02-bento-main">
        <div className="lp-theme02-bento-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
              {kicker}
            </EditableField>
          )}
          {title && (
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-bento-title lp-rise">
              {title}
            </EditableField>
          )}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-bento-subtitle lp-rise">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-bento-grid">
          {items.map((item, index) => (
            <div
              key={index}
              className={`lp-theme02-bento-card lp-rise lp-theme02-bento-card--${item.size || 'medium'}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <EditableField
                prop={`items.${index}.value`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-bento-value"
              >
                {item.value}
              </EditableField>
              {item.unit && (
                <EditableField
                  prop={`items.${index}.unit`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  className="lp-theme02-bento-unit"
                >
                  {item.unit}
                </EditableField>
              )}
              <EditableField
                prop={`items.${index}.label`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-bento-label"
              >
                {item.label}
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
