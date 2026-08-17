// lemonPPT - theme07 冷启动页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ColdStartV1Supporting {
  value?: string;
  label?: string;
}

export interface Theme07ColdStartV1Props {
  imageUrl?: string;
  kicker?: string;
  title?: string;
  number: string;
  unit?: string;
  label?: string;
  description?: string;
  supporting?: Theme07ColdStartV1Supporting[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ColdStartV1Meta: LayoutMeta = {
  id: 'theme07_cold_start_v1',
  theme: 'theme07',
  role: 'metric',
  displayName: 'Theme 07 冷启动指标',
  description: '超大核心数字 + 解读与支撑指标',
  needsMedia: true,
  tags: ['metric', 'big-number', 'hero'],
  contentShape: 'metric-hero',
};

export const theme07ColdStartV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COLD START' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '早期融资起点' },
    { key: 'number', label: '核心数字', type: 'text', inlineEditable: true, defaultValue: '2.4' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'label', label: '数字说明', type: 'text', inlineEditable: true, defaultValue: '种子至 A 轮平均单笔' },
    { key: 'description', label: '解读', type: 'textarea', inlineEditable: true, defaultValue: '早期项目单笔融资门槛显著提升，资本向具备技术壁垒的团队集中。' },
    {
      key: 'supporting',
      label: '支撑指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '18%', label: '早期交易占比' },
        { value: '320+', label: '种子轮事件' },
        { value: '$400M', label: '早期资金总量' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme07ColdStartV1(props: Theme07ColdStartV1Props): ReactNode {
  const { imageUrl, kicker, title, number, unit, label, description, supporting = [], _slideIdx, _editable } = props;
  const validSupporting = (supporting || []).filter((s): s is Theme07ColdStartV1Supporting => s != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-big-number">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-big-number-main lp-rise">
        <Theme07IconChip name="compass" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        {title && <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>}
        <div className="lp-theme07-big-number-hero">
          <span className="lp-theme07-big-number-value">{number || '0'}</span>
          {unit && <span className="lp-theme07-big-number-unit">{unit}</span>}
        </div>
        {label && <div className="lp-theme07-big-number-label">{label}</div>}
        {description && <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-big-number-description">{description}</EditableField>}
      </div>
      {validSupporting.length > 0 && (
        <div className="lp-theme07-big-number-supporting lp-rise">
          {validSupporting.map((item, index) => (
            <div key={index} className="lp-theme07-card">
              <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-h2)' }}>{item.value || ''}</div>
              <div className="lp-theme07-card-label">{item.label || ''}</div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
