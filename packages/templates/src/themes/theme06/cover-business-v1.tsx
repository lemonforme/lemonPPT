// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CoverBusinessV1Bar {
  label?: string;
  value?: string;
  unit?: string;
  progress?: number;
}

export interface Theme06CoverBusinessV1Props {
  imageUrl?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  bars?: Theme06CoverBusinessV1Bar[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CoverBusinessV1Meta: LayoutMeta = {
  id: 'theme06_cover_business_v1',
  theme: 'theme06',
  role: 'cover',
  displayName: 'Theme 06 商业计划封面',
  description: '左侧标题 + 右侧进度条 KPI 卡片',
  needsMedia: true,
  tags: ['cover', 'business', 'plan', 'atlas'],
  contentShape: 'cover',
};

export const theme06CoverBusinessV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'BUSINESS PLAN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产业投资蓝图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从基础设施到应用层的全栈机会分析' },
    {
      key: 'bars',
      label: '进度条指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { label: '市场规模', value: '$420B', unit: '', progress: 0.78 },
        { label: '年复合增长率', value: '34%', unit: '', progress: 0.65 },
        { label: '渗透率', value: '18%', unit: '', progress: 0.42 },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'progress', label: '进度', type: 'number' },
      ],
    },
    { key: 'footnoteLeft', label: '左下角脚注', type: 'text', inlineEditable: true, defaultValue: 'CONFIDENTIAL' },
    { key: 'footnoteRight', label: '右下角脚注', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme06CoverBusinessV1(props: Theme06CoverBusinessV1Props): ReactNode {
  const { tag, title, subtitle, bars = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validBars = (bars || []).filter((b): b is Theme06CoverBusinessV1Bar => b != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-cover-business">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-cover-business-main lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme06-cover-business-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validBars.length > 0 && (
        <div className="lp-theme06-cover-business-bars lp-rise">
          {validBars.map((bar, index) => (
            <div key={index} className="lp-theme06-cover-business-bar">
              <div className="lp-theme06-cover-business-bar-header">
                <span className="lp-theme06-cover-business-bar-label">{bar.label || ''}</span>
                <span className="lp-theme06-cover-business-bar-value">{bar.value || ''}{bar.unit || ''}</span>
              </div>
              <div className="lp-theme06-cover-business-bar-track">
                <div
                  className="lp-theme06-cover-business-bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, (bar.progress || 0) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left">{footnoteLeft || ''}</span>
        <span className="lp-theme06-footer-right">{footnoteRight || ''}</span>
      </div>
    </div>
  );
}
