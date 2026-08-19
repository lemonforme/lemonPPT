// lemonPPT - theme08 黑金实验 · 环形图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ChartDonutV1Segment {
  name: string;
  value: string;
}

export interface Theme08ChartDonutV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  centerNum?: string;
  centerLabel?: string;
  segments?: Theme08ChartDonutV1Segment[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ChartDonutV1Meta: LayoutMeta = {
  id: 'theme08_chart_donut_v1',
  theme: 'theme08',
  role: 'chart',
  displayName: 'Theme 08 环形图',
  description: '多色环形图 + 中心总量 + 图例，适合占比',
  needsMedia: false,
  tags: ['chart', 'donut', 'black-gold'],
  contentShape: 'chart-donut',
};

export const theme08ChartDonutV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SHARE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本来源构成' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '产业资本与战略基金为主力。' },
    { key: 'centerNum', label: '中心数字', type: 'text', inlineEditable: true, defaultValue: '100%' },
    { key: 'centerLabel', label: '中心标签', type: 'text', inlineEditable: true, defaultValue: '总占比' },
    {
      key: 'segments',
      label: '扇区',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '产业资本', value: '42' },
        { name: '战略基金', value: '28' },
        { name: '财务投资', value: '18' },
        { name: '政府引导', value: '12' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '51' },
  ],
};

export function Theme08ChartDonutV1(props: Theme08ChartDonutV1Props): ReactNode {
  const { kicker, title, subtitle, centerNum, centerLabel, segments = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (segments || []).slice(0, 6);
  const total = Math.max(1, valid.reduce((s, x) => s + (parseFloat(x.value) || 0), 0));
  let acc = 0;
  const stops: string[] = [];
  valid.forEach((seg, i) => {
    const pct = ((parseFloat(seg.value) || 0) / total) * 100;
    stops.push(`var(--lp-series-${i + 1}) ${acc.toFixed(2)}% ${(acc + pct).toFixed(2)}%`);
    acc += pct;
  });
  const gradient = stops.length ? `conic-gradient(${stops.join(', ')})` : 'var(--lp-surface)';
  return (
    <div className="lp-slide lp-theme08 lp-theme08-chart-donut-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-chart-donut lp-rise">
            <div className="lp-theme08-donut-wrap">
              <div className="lp-theme08-donut" style={{ width: '100%', height: '100%', borderRadius: '50%', background: gradient }} />
              <div className="lp-theme08-donut-hole" aria-hidden="true" />
              <div className="lp-theme08-donut-center">
                {centerNum && <div className="lp-theme08-donut-center-num"><EditableField prop="centerNum" slideIdx={_slideIdx} editable={_editable} as="span">{centerNum}</EditableField></div>}
                {centerLabel && <div className="lp-theme08-donut-center-label"><EditableField prop="centerLabel" slideIdx={_slideIdx} editable={_editable} as="span">{centerLabel}</EditableField></div>}
              </div>
            </div>
            <div className="lp-theme08-donut-legend">
              {valid.map((seg, i) => {
                const pct = Math.round(((parseFloat(seg.value) || 0) / total) * 100);
                return (
                  <div key={i} className="lp-theme08-donut-legend-row">
                    <span className="lp-theme08-legend-dot" style={{ background: `var(--lp-series-${i + 1})` }} />
                    <span className="lp-theme08-donut-legend-name"><EditableField prop={`segments.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{seg.name}</EditableField></span>
                    <span className="lp-theme08-donut-legend-val">{pct}%</span>
                  </div>
                );
              })}
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
