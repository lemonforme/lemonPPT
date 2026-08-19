// lemonPPT - theme08 黑金实验 · 指标网格
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08MetricsV1Item {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme08MetricsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08MetricsV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08MetricsV1Meta: LayoutMeta = {
  id: 'theme08_metrics_v1',
  theme: 'theme08',
  role: 'metric',
  displayName: 'Theme 08 指标四宫格',
  description: '四张指标卡，主指标荧光金高亮，适合业绩/概览',
  needsMedia: false,
  tags: ['metrics', 'kpi', 'black-gold'],
  contentShape: 'metrics',
};

export const theme08MetricsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY METRICS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度核心指标' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '四项指标共同刻画增长质量。' },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { value: '12', unit: '亿$', label: '融资规模', accent: true },
        { value: '+47', unit: '%', label: '同比增长' },
        { value: '92', unit: '%', label: '算力利用率' },
        { value: 'Top 3', unit: '', label: '赛道集中度' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '20' },
  ],
};

export function Theme08MetricsV1(props: Theme08MetricsV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 4);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-metrics">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-metrics-grid lp-rise">
            {valid.map((it, i) => (
              <div key={i} className={`lp-theme08-card lp-theme08-card-pad lp-theme08-metric-card ${it.accent ? 'accent' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="lp-theme08-metric-value">
                  <EditableField prop={`items.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{it.value}</EditableField>
                  {it.unit && <span className="lp-theme08-metric-unit"><EditableField prop={`items.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{it.unit}</EditableField></span>}
                </div>
                <div className="lp-theme08-metric-label"><EditableField prop={`items.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{it.label}</EditableField></div>
              </div>
            ))}
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
