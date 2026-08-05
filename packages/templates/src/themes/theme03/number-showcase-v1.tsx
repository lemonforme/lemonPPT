// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03NumberShowcaseV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  description?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03NumberShowcaseV1Meta: LayoutMeta = {
  id: 'theme03_number_showcase_v1',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风数字秀',
  description: '深色代码编辑风单个大数字秀，光环脉冲装饰',
  needsMedia: false,
  tags: ['metric', 'high-impact', 'single-stat'],
  contentShape: 'single-stat',
};

export const theme03NumberShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FIGURE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全年{{AI}}风险投资额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'description', label: '解读说明', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-number-showcase-title lp-rise">
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

export function Theme03NumberShowcaseV1(props: Theme03NumberShowcaseV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, value, unit, description, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-number-showcase-v1 lp-theme03-scanlines lp-theme03-grid-bg">
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

      <div className="lp-theme03-number-showcase-main">
        <div className="lp-theme03-number-showcase-rings" aria-hidden="true">
          <div className="lp-theme03-number-showcase-ring" />
          <div className="lp-theme03-number-showcase-ring lp-theme03-number-showcase-ring--inner" />
          <div className="lp-theme03-number-showcase-glow" />
        </div>

        <div className="lp-theme03-number-showcase-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-number-showcase-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-number-showcase-value-wrap lp-rise">
          {value && (
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-number-showcase-value">{value}</EditableField>
          )}
          {unit && (
            <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-number-showcase-unit">{unit}</EditableField>
          )}
        </div>

        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-number-showcase-description lp-rise">{description}</EditableField>
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
