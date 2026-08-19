// lemonPPT - theme08 黑金实验 · 投资阶段（早期轮）
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface FundingRow {
  name: string;
  nameSub: string;
  dotCount: number;
  count: string;
  avg: string;
  tags: string[];
  signalCount: number;
  alt?: boolean;
}

export interface Theme08FundingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: FundingRow[];
  summaryPct?: string;
  summaryLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08FundingV1Meta: LayoutMeta = {
  id: 'theme08_funding_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 投资阶段',
  description: '早期轮（Seed/A）事件数、平均金额、代表主题与信号强度一览',
  needsMedia: false,
  tags: ['funding', 'early-stage', 'investment', 'black-gold'],
  contentShape: 'list',
};

export const theme08FundingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EARLY STAGE SIGNAL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '新主题萌芽' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: 'Seed 与 A 轮金额虽小，却藏着下一轮主题的方向。' },
    {
      key: 'rows',
      label: '轮次行',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { name: '种子轮 Seed', nameSub: 'Seed', dotCount: 8, count: '8', avg: '1.2', tags: ['Agent', '安全'], signalCount: 2, alt: false },
        { name: 'A 轮', nameSub: 'Series A', dotCount: 12, count: '12', avg: '1.8', tags: ['具身智能', '行业模型'], signalCount: 3, alt: true },
        { name: 'A+/ 扩展', nameSub: 'Series A+', dotCount: 6, count: '6', avg: '1.4', tags: ['企业搜索'], signalCount: 1, alt: false },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'nameSub', label: '副名', type: 'text' },
        { key: 'dotCount', label: '事件圆点数', type: 'number' },
        { key: 'count', label: '事件数', type: 'text' },
        { key: 'avg', label: '平均金额', type: 'text' },
        { key: 'tags', label: '代表主题', type: 'array', itemSchema: [{ key: 'item', label: '主题', type: 'text' }] },
        { key: 'signalCount', label: '信号强度', type: 'number' },
        { key: 'alt', label: '深色行', type: 'boolean' },
      ],
    },
    { key: 'summaryPct', label: '汇总百分比', type: 'text', inlineEditable: true, defaultValue: '20.6%' },
    { key: 'summaryLabel', label: '汇总说明', type: 'text', inlineEditable: true, defaultValue: '早期轮占全年事件数' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '08' },
  ],
};

export function Theme08FundingV1(props: Theme08FundingV1Props): ReactNode {
  const {
    kicker, title, subtitle,
    rows = [],
    summaryPct, summaryLabel,
    footnoteLeft, footnoteRight,
    _slideIdx, _editable,
  } = props;
  const validRows = (rows || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme08 lp-theme08-funding-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-funding-table lp-rise">
            <div className="lp-theme08-funding-header">
              <span style={{ width: 150, flexShrink: 0 }}>轮次</span>
              <span style={{ flex: 1 }}>事件数（圆点）</span>
              <span style={{ width: 50, textAlign: 'center' }}>数量</span>
              <span style={{ width: 120, textAlign: 'center' }}>平均金额</span>
              <span style={{ width: 80, textAlign: 'right' }}>均值</span>
              <span style={{ flex: 1, textAlign: 'right' }}>代表主题</span>
              <span style={{ width: 80, textAlign: 'right' }}>信号</span>
            </div>
            {validRows.map((row, r) => {
              const dots = Array.from({ length: Math.max(0, Number(row.dotCount) || 0) });
              const avgNum = parseFloat(String(row.avg)) || 0;
              const barWidth = `${Math.min(100, (avgNum / 2.5) * 100)}%`;
              const signals = Array.from({ length: 5 });
              const filled = Math.max(0, Math.min(5, Number(row.signalCount) || 0));
              return (
                <div key={r} className={`lp-theme08-funding-row${row.alt ? ' alt' : ''}`} style={{ animationDelay: `${r * 50}ms`, color: row.alt ? 'var(--lp-ink)' : undefined }}>
                  <div className="lp-theme08-funding-row-name">
                    <div className="lp-theme08-funding-row-name-main"><EditableField prop={`rows.${r}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField></div>
                    <div className="lp-theme08-funding-row-name-sub" style={{ color: row.alt ? 'var(--lp-ink2)' : undefined }}><EditableField prop={`rows.${r}.nameSub`} slideIdx={_slideIdx} editable={_editable} as="span">{row.nameSub}</EditableField></div>
                  </div>
                  <div className="lp-theme08-funding-dots">
                    {dots.map((_, i) => <span key={i} />)}
                  </div>
                  <div className="lp-theme08-funding-count"><EditableField prop={`rows.${r}.count`} slideIdx={_slideIdx} editable={_editable} as="span">{row.count}</EditableField></div>
                  <div className="lp-theme08-funding-bar-wrap">
                    <div className="lp-theme08-funding-bar" style={{ width: barWidth }} />
                  </div>
                  <div className="lp-theme08-funding-avg"><EditableField prop={`rows.${r}.avg`} slideIdx={_slideIdx} editable={_editable} as="span">{row.avg}</EditableField></div>
                  <div className="lp-theme08-funding-tags">
                    {(row.tags || []).map((t, i) => (
                      <span key={i} className="lp-theme08-funding-tag">{t}</span>
                    ))}
                  </div>
                  <div className="lp-theme08-funding-signals">
                    {signals.map((_, i) => (
                      <span key={i} className={`lp-theme08-funding-signal${i < filled ? ' filled' : ''}`} />
                    ))}
                  </div>
                </div>
              );
            })}
            {summaryPct && (
              <div className="lp-theme08-funding-summary">
                <span className="lp-theme08-funding-summary-value"><EditableField prop="summaryPct" slideIdx={_slideIdx} editable={_editable} as="span">{summaryPct}</EditableField></span>
                {summaryLabel && <span className="lp-theme08-funding-summary-label"><EditableField prop="summaryLabel" slideIdx={_slideIdx} editable={_editable} as="span">{summaryLabel}</EditableField></span>}
              </div>
            )}
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
