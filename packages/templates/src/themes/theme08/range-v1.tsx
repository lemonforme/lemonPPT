// lemonPPT - theme08 黑金实验 · 哑铃/范围图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface RangeRow {
  name: string;
  nameSub?: string;
  low: number;
  lowVal: string;
  high: number;
  highVal: string;
  span: string;
  highlight?: boolean;
}

export interface Theme08RangeV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: RangeRow[];
  midLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08RangeV1Meta: LayoutMeta = {
  id: 'theme08_range_v1',
  theme: 'theme08',
  role: 'comparison',
  displayName: 'Theme 08 范围图',
  description: '哑铃/范围图，每行展示单笔规模低值与高值区间及跨度倍数，适合分化/对比',
  needsMedia: false,
  tags: ['range', 'dumbbell', 'comparison', 'black-gold'],
  contentShape: 'range',
};

export const theme08RangeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL SIZE RANGE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '单笔融资区间分化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '同一赛道里，头部与长尾的单笔规模差距正在被持续拉大。' },
    {
      key: 'rows',
      label: '范围行',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: '通用大模型', nameSub: 'FOUNDATION', low: 20, lowVal: '20', high: 95, highVal: '95亿', span: '×4.8' },
        { name: '算力基础设施', nameSub: 'COMPUTE', low: 15, lowVal: '15', high: 78, highVal: '78亿', span: '×5.2', highlight: true },
        { name: '垂直应用', nameSub: 'VERTICAL APPS', low: 5, lowVal: '5', high: 42, highVal: '42亿', span: '×8.4' },
        { name: 'AI 芯片', nameSub: 'CHIPS', low: 12, lowVal: '12', high: 60, highVal: '60亿', span: '×5.0' },
        { name: '具身智能', nameSub: 'EMBODIED', low: 4, lowVal: '4', high: 28, highVal: '28亿', span: '×7.0' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'nameSub', label: '名称副标', type: 'text' },
        { key: 'low', label: '低值位置(0-100)', type: 'number' },
        { key: 'lowVal', label: '低值文本', type: 'text' },
        { key: 'high', label: '高值位置(0-100)', type: 'number' },
        { key: 'highVal', label: '高值文本', type: 'text' },
        { key: 'span', label: '跨度倍数', type: 'text' },
        { key: 'highlight', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'midLabel', label: '中位线标签', type: 'text', inlineEditable: true, defaultValue: '全赛道中位' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '23' },
  ],
};

export function Theme08RangeV1(props: Theme08RangeV1Props): ReactNode {
  const { kicker, title, subtitle, rows = [], midLabel, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (rows || []).slice(0, 8);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-range-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body lp-theme08-range-body">
          {valid.map((row, i) => {
            const left = Math.max(0, Math.min(100, Number(row.low) || 0));
            const right = Math.max(0, Math.min(100, Number(row.high) || 0));
            const fillW = Math.max(0, right - left);
            const fillBg = row.highlight ? 'var(--lp-accent)' : 'color-mix(in srgb, var(--lp-ink2) 70%, transparent)';
            return (
              <div key={i} className="lp-theme08-range-row lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme08-range-name">
                  <EditableField prop={`rows.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
                  {row.nameSub && <span className="lp-theme08-range-name-sub"><EditableField prop={`rows.${i}.nameSub`} slideIdx={_slideIdx} editable={_editable} as="span">{row.nameSub}</EditableField></span>}
                </div>
                <div className="lp-theme08-range-track">
                  <span
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '50%', top: -14, bottom: -14, transform: 'translateX(-50%)', borderLeft: '1px dashed color-mix(in srgb, var(--lp-ink2) 55%, transparent)', zIndex: 0 }}
                  />
                  {i === 0 && <div className="lp-theme08-range-mid"><EditableField prop="midLabel" slideIdx={_slideIdx} editable={_editable} as="span">{midLabel}</EditableField></div>}
                  <div className="lp-theme08-range-line" />
                  <div className="lp-theme08-range-fill" style={{ left: `${left}%`, width: `${fillW}%`, background: fillBg }} />
                  <span className="lp-theme08-range-val" style={{ left: `${left}%` }}><EditableField prop={`rows.${i}.lowVal`} slideIdx={_slideIdx} editable={_editable} as="span">{row.lowVal}</EditableField></span>
                  <span className="lp-theme08-range-val" style={{ left: `${right}%` }}><EditableField prop={`rows.${i}.highVal`} slideIdx={_slideIdx} editable={_editable} as="span">{row.highVal}</EditableField></span>
                  <span className="lp-theme08-range-dot low" style={{ left: `${left}%` }} />
                  <span className="lp-theme08-range-dot high" style={{ left: `${right}%` }} />
                </div>
                <div className="lp-theme08-range-span"><EditableField prop={`rows.${i}.span`} slideIdx={_slideIdx} editable={_editable} as="span">{row.span}</EditableField></div>
              </div>
            );
          })}
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
