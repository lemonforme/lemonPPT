// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ProgressItem {
  label?: string;
  value?: number;
  max?: number;
  unit?: string;
}

export interface Theme02ProgressV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02ProgressItem[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ProgressV1Meta: LayoutMeta = {
  id: 'theme02_progress_v1',
  theme: 'theme02',
  role: 'metric',
  displayName: 'Theme 02 达成度',
  description: '霓虹进度条组合，展示多项指标的完成度',
  needsMedia: false,
};

export const theme02ProgressV1Schema: PropsSchema = {
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
      label: '进度项',
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
          key: 'value',
          label: '当前值',
          type: 'number',
        },
        {
          key: 'max',
          label: '最大值',
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
  ],
};

export function Theme02ProgressV1(props: Theme02ProgressV1Props): ReactNode {
  const { title, kicker, subtitle, items = [], _slideIdx, _editable } = props;

  const validItems = items
    .filter((item): item is Theme02ProgressItem => item != null)
    .map((item) => {
      const value = Number(item.value) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.round((value / max) * 1000) / 10) : 0;
      return { ...item, value, max, pct };
    });

  return (
    <div className="lp-slide lp-theme02-progress-v1">
      <div className="lp-theme02-progress-card lp-rise">
        <div className="lp-theme02-progress-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-progress-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-progress-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className="lp-theme02-progress-list">
          {validItems.map((item, index) => (
            <div key={index} className="lp-theme02-progress-item lp-rise" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="lp-theme02-progress-meta">
                <EditableField prop={`items.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-progress-label">
                  {item.label}
                </EditableField>
                <div className="lp-theme02-progress-value">
                  <span className="lp-theme02-progress-number">{item.value}</span>
                  <span className="lp-theme02-progress-unit">{item.unit}</span>
                  <span className="lp-theme02-progress-pct">{item.pct}%</span>
                </div>
              </div>
              <div className="lp-theme02-progress-bar">
                <div
                  className="lp-theme02-progress-fill"
                  style={{ width: `${item.pct}%` }}
                  data-pct={item.pct}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
