// lemonPPT - theme08 黑金实验 · 柱状图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ChartBarV1Bar {
  value: string;
  label: string;
  alt?: boolean;
}

export interface Theme08ChartBarV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  bars?: Theme08ChartBarV1Bar[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ChartBarV1Meta: LayoutMeta = {
  id: 'theme08_chart_bar_v1',
  theme: 'theme08',
  role: 'chart',
  displayName: 'Theme 08 柱状图',
  description: '荧光金/玫红双色柱状图 + 数值标签，适合对比',
  needsMedia: false,
  tags: ['chart', 'bar', 'black-gold'],
  contentShape: 'chart-bar',
};

export const theme08ChartBarV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPARISON' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '各赛道融资规模' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '通用大模型显著领先于基础设施与应用层。' },
    {
      key: 'bars',
      label: '柱数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { value: '181', label: '通用大模型', alt: false },
        { value: '21', label: '基础设施', alt: true },
        { value: '6.8', label: '具身智能', alt: true },
        { value: '5.2', label: '垂直应用', alt: true },
        { value: '4.1', label: '安全合规', alt: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'alt', label: '副色', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '13' },
  ],
};

export function Theme08ChartBarV1(props: Theme08ChartBarV1Props): ReactNode {
  const { kicker, title, subtitle, bars = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (bars || []).slice(0, 8);
  const max = Math.max(1, ...valid.map((b) => parseFloat(b.value) || 0));
  return (
    <div className="lp-slide lp-theme08 lp-theme08-chart-bar-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-chart-bar lp-rise">
            <div className="lp-theme08-bars">
              {valid.map((b, i) => {
                const h = Math.round(((parseFloat(b.value) || 0) / max) * 100);
                return (
                  <div key={i} className="lp-theme08-bar-col" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="lp-theme08-bar-val"><EditableField prop={`bars.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{b.value}</EditableField></div>
                    <div className={`lp-theme08-bar ${b.alt ? 'alt' : ''}`} style={{ height: `${Math.max(6, h)}%` }}>
                      <span className="lp-rise" style={{ display: 'block' }} />
                    </div>
                    <div className="lp-theme08-bar-label"><EditableField prop={`bars.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{b.label}</EditableField></div>
                  </div>
                );
              })}
            </div>
            <div className="lp-theme08-chart-legend">
              <div className="lp-theme08-legend-item"><span className="lp-theme08-legend-dot" /><span>主系列</span></div>
              <div className="lp-theme08-legend-item"><span className="lp-theme08-legend-dot alt" /><span>对比系列</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
