// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06RecapV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  points?: Array<{ text?: string }>;
  value?: string;
  valueLabel?: string;
  valueDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RecapV1Meta: LayoutMeta = {
  id: 'theme06_recap_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 回顾总结',
  description: '左侧要点清单 + 右侧大数字结论',
  needsMedia: true,
  tags: ['recap', 'summary', 'atlas'],
  contentShape: 'summary',
};

export const theme06RecapV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RECAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本次研究最值得记住的三条判断' },
    {
      key: 'points',
      label: '要点',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { text: '生成式 AI 正从工具层向平台层演进' },
        { text: '基础设施仍是最确定的短期受益环节' },
        { text: '垂直应用的竞争壁垒在于数据飞轮' },
        { text: '治理与安全将成为差异化竞争要素' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea', inlineEditable: true }],
    },
    { key: 'value', label: '大数字', type: 'text', inlineEditable: true, defaultValue: '3.2x' },
    { key: 'valueLabel', label: '数字标签', type: 'text', inlineEditable: true, defaultValue: '投资回报中位数' },
    { key: 'valueDescription', label: '数字说明', type: 'textarea', inlineEditable: true, defaultValue: '在已规模化落地的场景中，领先企业普遍实现 3 倍以上 ROI。' },
  ],
};

export function Theme06RecapV1(props: Theme06RecapV1Props): ReactNode {
  const { kicker, title, subtitle, points = [], value, valueLabel, valueDescription, _slideIdx, _editable } = props;
  const validPoints = (points || []).filter((p): p is { text: string } => p != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-recap">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <ul className="lp-theme06-recap-list">
          {validPoints.map((item, index) => (
            <li key={index} className="lp-theme06-recap-item">
              <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{item.text || ''}</EditableField>
            </li>
          ))}
        </ul>
      </div>

      <div className="lp-theme06-recap-aside lp-rise">
        <div className="lp-theme06-recap-card">
          <div className="lp-theme06-recap-card-value">{value || ''}</div>
          <div className="lp-theme06-recap-card-label">{valueLabel || ''}</div>
          {valueDescription && <div className="lp-theme06-recap-card-label" style={{ marginTop: 8, color: 'var(--lp-ink3)' }}>{valueDescription}</div>}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
