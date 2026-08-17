// lemonPPT - theme08 黑金实验 · 仪表盘圆环
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface GaugeBreakdown {
  value: string;
  label: string;
}

export interface Theme08GaugeV1Props {
  kicker?: string;
  title: string;
  year?: string;
  /** 如 "67" */
  value: string;
  /** 如 "%" */
  unit?: string;
  /** 中心描述文字 */
  desc?: string;
  breakdown?: GaugeBreakdown[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08GaugeV1Meta: LayoutMeta = {
  id: 'theme08_gauge_v1',
  theme: 'theme08',
  role: 'metric',
  displayName: 'Theme 08 仪表盘',
  description: '居中大圆环进度 + 中心数字 + 分解指标',
  needsMedia: false,
  tags: ['gauge', 'metric', 'ring', 'black-gold'],
  contentShape: 'metric',
};

export const theme08GaugeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ONE NUMBER' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 展望' },
    { key: 'year', label: '年份', type: 'text', inlineEditable: true, defaultValue: '2025 一个数字' },
    { key: 'value', label: '中心数值', type: 'text', inlineEditable: true, defaultValue: '67' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true, defaultValue: '2025 年新增 AI 资本预计有三分之二流向可直接计费的应用与垂重层。' },
    {
      key: 'breakdown',
      label: '分解指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '67', label: '基础设施' },
        { value: '24', label: '模型层' },
        { value: '9', label: '其他' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '61' },
  ],
};

const GAUGE_R = 130;
const GAUGE_CX = 150;
const GAUGE_CY = 150;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R; // ≈ 816.81

export function Theme08GaugeV1(props: Theme08GaugeV1Props): ReactNode {
  const { kicker, title, year, value, unit, desc, breakdown = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validBreakdown = (breakdown || []).slice(0, 4);
  const pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
  const offset = GAUGE_CIRC * (1 - pct / 100);

  return (
    <div className="lp-slide lp-theme08 lp-theme08-gauge-page">
      <style>{`
        @keyframes lp-theme08-gauge-sweep { from { stroke-dashoffset: ${GAUGE_CIRC.toFixed(2)}px; } }
        .lp-theme08-gauge-ring { animation: lp-theme08-gauge-sweep 1.2s ease-out both; }
      `}</style>
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="bolt" size={40} />
          {kicker && (
            <div className="lp-theme08-kicker">
              <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
            </div>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {year && (
            <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)', marginTop: 4 }}>
              <EditableField prop="year" slideIdx={_slideIdx} editable={_editable} as="span">{year}</EditableField>
            </div>
          )}
        </div>

        <div className="lp-theme08-body">
          <div className="lp-theme08-gauge lp-rise" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="lp-theme08-gauge-ring-wrap" style={{ position: 'relative', width: 300, height: 300 }}>
              <svg width={300} height={300} viewBox="0 0 300 300" aria-hidden="true">
                <circle
                  cx={GAUGE_CX}
                  cy={GAUGE_CY}
                  r={GAUGE_R}
                  fill="none"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth={18}
                />
                <circle
                  className="lp-theme08-gauge-ring"
                  cx={GAUGE_CX}
                  cy={GAUGE_CY}
                  r={GAUGE_R}
                  fill="none"
                  stroke="var(--lp-gold,#E8D22D)"
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeDasharray={GAUGE_CIRC.toFixed(2)}
                  strokeDashoffset={offset.toFixed(2)}
                  transform={`rotate(-90 ${GAUGE_CX} ${GAUGE_CY})`}
                />
              </svg>
              <div
                className="lp-theme08-gauge-center"
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--lp-font-display)', color: 'var(--lp-ink)' }}>
                  <span style={{ fontSize: 88, lineHeight: 1 }}>
                    <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span">{value}</EditableField>
                  </span>
                  {unit && (
                    <span style={{ fontSize: 32, color: 'var(--lp-accent)', marginLeft: 4 }}>
                      <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">{unit}</EditableField>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {desc && (
              <p
                className="lp-theme08-gauge-desc"
                style={{ maxWidth: 520, textAlign: 'center', marginTop: 18, fontSize: 15, lineHeight: 1.6, color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' }}
              >
                <EditableField prop="desc" slideIdx={_slideIdx} editable={_editable} as="span">{desc}</EditableField>
              </p>
            )}

            {validBreakdown.length > 0 && (
              <div
                className="lp-theme08-gauge-breakdown"
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 26,
                  width: '100%',
                  maxWidth: 560,
                  justifyContent: 'center',
                }}
              >
                {validBreakdown.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '16px 12px',
                      background: 'var(--lp-surface)',
                      border: '1px solid var(--lp-divider)',
                      borderRadius: 'var(--lp-radius-medium)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--lp-font-display)', fontSize: 36, color: 'var(--lp-accent)', lineHeight: 1 }}>
                      <EditableField prop={`breakdown.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{b.value}</EditableField>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--lp-ink2)', marginTop: 6, fontFamily: 'var(--lp-font)' }}>
                      <EditableField prop={`breakdown.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{b.label}</EditableField>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme08-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
