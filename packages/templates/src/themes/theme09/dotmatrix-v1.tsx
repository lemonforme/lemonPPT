// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors } from './chart-utils.js';

export interface Theme09DotMatrixV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  percent?: number;
  legend?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09DotMatrixV1Meta: LayoutMeta = {
  id: 'theme09_dotmatrix_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '百点阵占比',
  description: '100 点阵表达占比，专色填充 + 图例，杂志数据可视化语汇',
  needsMedia: false,
  tags: ['chart', 'proportion', 'matrix'],
  contentShape: 'dot-matrix',
};

export const theme09DotMatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '资本结构' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CAPITAL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '09' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '集中度' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '头部企业拿走 {{64%}} 的融资份额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一格代表 1% 的样本企业，朱砂填充越多，集中度越高。' },
    { key: 'percent', label: '占比（0-100）', type: 'number', inlineEditable: true, defaultValue: 64 },
    { key: 'legend', label: '图例文字', type: 'text', inlineEditable: true, defaultValue: '朱砂 = 头部阵营' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
      {parts.map((part, idx) => {
        const m = part.match(/^\{\{(.+)\}\}$/);
        if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme09DotMatrixV1(props: Theme09DotMatrixV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    percent = 64,
    legend,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const filled = Math.round(pct);
  const dots = Array.from({ length: 100 }, (_, i) => i < filled);

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-dotmatrix">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div className="lp-theme09-dotmatrix-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-dotmatrix-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title, _slideIdx, _editable)}
            <div className="lp-theme09-dotmatrix-grid">
              {dots.map((on, i) => (
                <span
                  key={i}
                  className="lp-theme09-dotmatrix-dot"
                  style={{ background: on ? c.accent : c.surfaceStrong }}
                />
              ))}
            </div>
            <div className="lp-theme09-dotmatrix-legend">
              <span className="lp-theme09-dotmatrix-swatch" style={{ background: c.accent }} />
              {legend && (
                <EditableField prop="legend" slideIdx={_slideIdx} editable={_editable} as="span">
                  {legend}
                </EditableField>
              )}
              <span className="lp-theme09-dotmatrix-pct" style={{ color: c.accent }}>{pct}%</span>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
