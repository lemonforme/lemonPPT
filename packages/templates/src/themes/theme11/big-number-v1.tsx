// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 大数字页（big_number_v1）
 * 情绪：aurora | 骨架：stage
 * 超大核心数字 + 解读与支撑指标。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, GradientCard, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11BigNumberV1Supporting {
  value?: string;
  label?: string;
}

export interface Theme11BigNumberV1Props {
  title?: string;
  number?: string;
  unit?: string;
  label?: string;
  description?: string;
  supporting?: Theme11BigNumberV1Supporting[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11BigNumberV1Meta: LayoutMeta = {
  id: 'theme11_big_number_v1',
  theme: 'theme11',
  role: 'metric',
  displayName: 'Theme 11 大数字页',
  description: '超大核心数字 + 解读与支撑指标',
  needsMedia: false,
  tags: ['metric', 'big-number', 'hero', 'light-stream'],
  contentShape: 'metric-hero',
};

export const theme11BigNumberV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度核心指标' },
    { key: 'number', label: '核心数字', type: 'text', inlineEditable: true, defaultValue: '128' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'label', label: '数字说明', type: 'text', inlineEditable: true, defaultValue: '同比增长' },
    { key: 'description', label: '解读', type: 'textarea', inlineEditable: true, defaultValue: '核心业务收入实现翻倍增长，增速连续四个季度领跑行业。' },
    {
      key: 'supporting',
      label: '支撑指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '34%', label: '市场份额提升' },
        { value: '12M', label: '新增用户' },
        { value: '$2.4B', label: '总交易额' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11BigNumberV1(props: Theme11BigNumberV1Props): ReactNode {
  const { title, number, unit, label, description, supporting = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validSupporting = (supporting || []).filter((item): item is Theme11BigNumberV1Supporting => item != null).slice(0, 3);

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-big-number">
      <div className="lp-theme11-big-number-inner">
        <SectionTitle tone="accent" className="lp-theme11-big-number-eyebrow">KEY METRIC</SectionTitle>
        {title && (
          <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-big-number-title">{title}</EditableField>
        )}

        <div className="lp-theme11-big-number-hero lp-rise">
          <GradientCard tone="blue" className="lp-theme11-big-number-card">
            <span className="lp-theme11-big-number-value">{number || '0'}</span>
            {unit && <span className="lp-theme11-big-number-unit">{unit}</span>}
          </GradientCard>
          {label && <div className="lp-theme11-big-number-label"><EditableField prop="label" slideIdx={s} editable={e} as="span">{label}</EditableField></div>}
        </div>

        {description && (
          <Caption className="lp-theme11-big-number-desc lp-rise">
            <EditableField prop="description" slideIdx={s} editable={e} as="span">{description}</EditableField>
          </Caption>
        )}

        {validSupporting.length > 0 && (
          <div className="lp-theme11-big-number-supporting">
            {validSupporting.map((item, index) => (
              <Card key={index} className="lp-theme11-big-number-supporting-item lp-rise" style={{ animationDelay: `${index * 60}ms` } as React.CSSProperties}>
                <div className="lp-theme11-big-number-supporting-value">{item.value || ''}</div>
                <div className="lp-theme11-big-number-supporting-label">{item.label || ''}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
