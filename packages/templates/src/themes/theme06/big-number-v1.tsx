// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06BigNumberV1Supporting {
  value?: string;
  label?: string;
}

export interface Theme06BigNumberV1Props {
  imageUrl?: string;
  kicker?: string;
  title?: string;
  number: string;
  unit?: string;
  label?: string;
  description?: string;
  supporting?: Theme06BigNumberV1Supporting[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06BigNumberV1Meta: LayoutMeta = {
  id: 'theme06_big_number_v1',
  theme: 'theme06',
  role: 'metric',
  displayName: 'Theme 06 大数字页',
  description: '超大核心数字 + 解读与支撑指标',
  needsMedia: true,
  tags: ['metric', 'big-number', 'hero', 'atlas'],
  contentShape: 'metric-hero',
};

export const theme06BigNumberV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY METRIC' },
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
  ],
};

export function Theme06BigNumberV1(props: Theme06BigNumberV1Props): ReactNode {
  const { kicker, title, number, unit, label, description, supporting = [], _slideIdx, _editable } = props;
  const validSupporting = (supporting || []).filter((s): s is Theme06BigNumberV1Supporting => s != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-big-number">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-big-number-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        )}
        <div className="lp-theme06-big-number-hero">
          <span className="lp-theme06-big-number-value">{number || '0'}</span>
          {unit && <span className="lp-theme06-big-number-unit">{unit}</span>}
        </div>
        {label && <div className="lp-theme06-big-number-label">{label}</div>}
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-big-number-description">{description}</EditableField>
        )}
      </div>

      {validSupporting.length > 0 && (
        <div className="lp-theme06-big-number-supporting lp-rise">
          {validSupporting.map((item, index) => (
            <div key={index} className="lp-theme06-big-number-supporting-item">
              <div className="lp-theme06-big-number-supporting-value">{item.value || ''}</div>
              <div className="lp-theme06-big-number-supporting-label">{item.label || ''}</div>
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
