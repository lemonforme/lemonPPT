// lemonPPT - theme08 黑金实验 · 月度热力图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';
import { bestTextColorForBg } from './contrast.js';

export interface Theme08HeatmapCell {
  month: string;
  monthEn: string;
  value: string;
  unit?: string;
  color: string;
  isPeak?: boolean;
}

export interface Theme08HeatmapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cells?: Theme08HeatmapCell[];
  scaleMin?: string;
  scaleMax?: string;
  scaleUnit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08HeatmapV1Meta: LayoutMeta = {
  id: 'theme08_heatmap_v1',
  theme: 'theme08',
  role: 'stats',
  displayName: 'Theme 08 热力图',
  description: '12 个月度热力格 + 色阶渐变条',
  needsMedia: false,
  tags: ['heatmap', 'calendar', 'chart', 'black-gold'],
  contentShape: 'heatmap',
};

export const theme08HeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MONTHLY HEATMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场月度热力' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年热度并非均匀释放，8 月为明显峰值。' },
    {
      key: 'cells',
      label: '月格',
      type: 'array',
      minItems: 12,
      maxItems: 12,
      defaultValue: [
        { month: '1月', monthEn: 'JAN', value: '45', unit: '亿美元', color: '#D6E4FF', isPeak: false },
        { month: '2月', monthEn: 'FEB', value: '58', unit: '亿美元', color: '#B8CCFF', isPeak: false },
        { month: '3月', monthEn: 'MAR', value: '59', unit: '亿美元', color: '#A8C0FF', isPeak: false },
        { month: '4月', monthEn: 'APR', value: '86', unit: '亿美元', color: '#FFD966', isPeak: false },
        { month: '5月', monthEn: 'MAY', value: '105', unit: '亿美元', color: '#FF6B9D', isPeak: false },
        { month: '6月', monthEn: 'JUN', value: '93', unit: '亿美元', color: '#FF8F8F', isPeak: false },
        { month: '7月', monthEn: 'JUL', value: '92', unit: '亿美元', color: '#FF7B7B', isPeak: false },
        { month: '8月', monthEn: 'AUG', value: '118', unit: '亿美元', color: '#E83B22', isPeak: true },
        { month: '9月', monthEn: 'SEP', value: '108', unit: '亿美元', color: '#FF6B9D', isPeak: false },
        { month: '10月', monthEn: 'OCT', value: '73', unit: '亿美元', color: '#B8E8A8', isPeak: false },
        { month: '11月', monthEn: 'NOV', value: '81', unit: '亿美元', color: '#FFE066', isPeak: false },
        { month: '12月', monthEn: 'DEC', value: '52', unit: '亿美元', color: '#B8CCFF', isPeak: false },
      ],
      itemSchema: [
        { key: 'month', label: '月份', type: 'text' },
        { key: 'monthEn', label: '英文', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'color', label: '颜色', type: 'text' },
        { key: 'isPeak', label: '峰值', type: 'boolean' },
      ],
    },
    { key: 'scaleMin', label: '色阶最小', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'scaleMax', label: '色阶最大', type: 'text', inlineEditable: true, defaultValue: '118' },
    { key: 'scaleUnit', label: '色阶单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '33' },
  ],
};

export function Theme08HeatmapV1(props: Theme08HeatmapV1Props): ReactNode {
  const { kicker, title, subtitle, cells = [], scaleMin, scaleMax, scaleUnit, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (cells || []).slice(0, 12);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-heatmap-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="flame" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div
            className="lp-theme08-heatmap lp-rise"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridAutoRows: '1fr',
              gap: 10,
            }}
          >
            {valid.map((cell, i) => {
              const labelColor = bestTextColorForBg(cell.color);
              return (
                <div
                  key={i}
                  className={`lp-theme08-heat-cell${cell.isPeak ? ' peak' : ''}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: cell.color,
                    color: labelColor,
                    minHeight: 92,
                    boxShadow: cell.isPeak ? '0 0 0 2px var(--lp-ink), 0 10px 24px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12 }}>
                    <span style={{ fontWeight: 700 }}><EditableField prop={`cells.${i}.month`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.month}</EditableField></span>
                    <span style={{ letterSpacing: 1 }}><EditableField prop={`cells.${i}.monthEn`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.monthEn}</EditableField></span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
                    <EditableField prop={`cells.${i}.value`} slideIdx={_slideIdx} editable={_editable} chartData as="span">{cell.value}</EditableField>
                  </div>
                  {cell.unit && (
                    <div style={{ fontSize: 10 }}>
                      <EditableField prop={`cells.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.unit}</EditableField>
                    </div>
                  )}
                  {cell.isPeak && (
                    <span
                      className="lp-theme08-heat-peak-badge"
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '2px 7px',
                        borderRadius: 999,
                        background: 'var(--lp-accent)',
                        color: 'var(--lp-text-inverse)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >峰值</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="lp-theme08-heatmap-scale" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <span style={{ fontSize: 11, color: 'var(--lp-ink-soft)' }}>
              {scaleMin && <EditableField prop="scaleMin" slideIdx={_slideIdx} editable={_editable} as="span">{scaleMin}</EditableField>}
            </span>
            <span
              className="lp-theme08-heatmap-bar"
              style={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                background: 'linear-gradient(90deg, #D6E4FF 0%, #A8C0FF 18%, #B8E8A8 34%, #FFE066 50%, #FFD966 64%, #FF6B9D 80%, #E83B22 100%)',
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 11, color: 'var(--lp-ink-soft)' }}>
              {scaleMax && <EditableField prop="scaleMax" slideIdx={_slideIdx} editable={_editable} as="span">{scaleMax}</EditableField>}
              {scaleUnit && <EditableField prop="scaleUnit" slideIdx={_slideIdx} editable={_editable} as="span"> {scaleUnit}</EditableField>}
            </span>
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
