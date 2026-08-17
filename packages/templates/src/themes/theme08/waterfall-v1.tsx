// lemonPPT - theme08 黑金实验 · 瀑布图
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface WaterfallBar {
  label: string;
  sub?: string;
  value: number;
  pct?: string;
  color?: string;
}

export interface Theme08WaterfallV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  bars?: WaterfallBar[];
  totalValue?: string;
  totalLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08WaterfallV1Meta: LayoutMeta = {
  id: 'theme08_waterfall_v1',
  theme: 'theme08',
  role: 'stats',
  displayName: 'Theme 08 瀑布图',
  description: '浮动累计瀑布图 + 汇总卡片，适合贡献拆分',
  needsMedia: false,
  tags: ['waterfall', 'chart', 'black-gold'],
  contentShape: 'chart',
};

export const theme08WaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'FUNDING WATERFALL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '赛道贡献拆分' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年 970 亿美元融资沿赛道逐级累积，通用大模型贡献近半。' },
    {
      key: 'bars',
      label: '瀑布柱',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { label: '通用大模型', sub: 'Foundation', value: 420, pct: '43%', color: '#FF2D9B' },
        { label: '垂直应用', sub: 'Vertical', value: 245, pct: '25%', color: '#8DBEEC' },
        { label: '基础设施', sub: 'Infra', value: 158, pct: '16%', color: '#FFD23F' },
        { label: 'AI 芯片', sub: 'Chips', value: 97, pct: '10%', color: '#B98CFF' },
        { label: '其他', sub: 'Others', value: 50, pct: '5%', color: '#8A8A93' },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'sub', label: '英文', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'pct', label: '百分比', type: 'text' },
        { key: 'color', label: '颜色', type: 'text' },
      ],
    },
    { key: 'totalValue', label: '总计数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'totalLabel', label: '总计标签', type: 'text', inlineEditable: true, defaultValue: '亿·全年' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '34' },
  ],
};

export function Theme08WaterfallV1(props: Theme08WaterfallV1Props): ReactNode {
  const { kicker, title, subtitle, bars = [], totalValue, totalLabel, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (bars || []).slice(0, 8);
  const n = Math.max(valid.length, 1);
  const total = Math.max(1, valid.reduce((s, b) => s + (parseFloat(String(b.value)) || 0), 0));

  let cum = 0;
  const items = valid.map((b) => {
    const v = parseFloat(String(b.value)) || 0;
    const start = cum;
    cum += v;
    return { b, start, end: cum, v };
  });

  return (
    <div className="lp-slide lp-theme08 lp-theme08-waterfall-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && (
            <div className="lp-theme08-kicker">
              <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
            </div>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme08-body">
          <div className="lp-theme08-waterfall lp-rise" style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="lp-theme08-waterfall-chart"
                style={{ position: 'relative', height: 340, borderBottom: '1px solid var(--lp-divider)' }}
              >
                {items.map(({ b, start, end, v }, i) => (
                  <div
                    key={i}
                    style={{ position: 'absolute', left: `${(i / n) * 100}%`, width: `${100 / n}%`, top: 0, bottom: 0 }}
                  >
                    {/* 浮动柱 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '18%',
                        right: '18%',
                        bottom: `${(start / total) * 100}%`,
                        height: `${(v / total) * 100}%`,
                        background: b.color || 'var(--lp-accent)',
                        borderRadius: 6,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                      }}
                    />
                    {/* 数值 + 百分比 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${((total - end) / total) * 100}%`,
                        transform: 'translateY(-100%)',
                        textAlign: 'center',
                        lineHeight: 1.1,
                      }}
                    >
                      <div style={{ fontFamily: 'var(--lp-font-display)', fontSize: 20, color: 'var(--lp-ink)' }}>
                        <EditableField prop={`bars.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{b.value}</EditableField>
                      </div>
                      {b.pct && (
                        <div style={{ fontSize: 11, color: 'var(--lp-ink2)', opacity: 0.85, fontFamily: 'var(--lp-font-mono)' }}>
                          <EditableField prop={`bars.${i}.pct`} slideIdx={_slideIdx} editable={_editable} as="span">{b.pct}</EditableField>
                        </div>
                      )}
                    </div>
                    {/* 累计虚线连接 */}
                    {i < n - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: `${((total - end) / total) * 100}%`,
                          left: '50%',
                          width: '50%',
                          borderTop: '1px dashed rgba(255,255,255,0.4)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="lp-theme08-waterfall-labels" style={{ display: 'flex', marginTop: 10 }}>
                {items.map(({ b }, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
                    <div style={{ fontSize: 14, color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' }}>
                      <EditableField prop={`bars.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{b.label}</EditableField>
                    </div>
                    {b.sub && (
                      <div style={{ fontSize: 10, letterSpacing: 1, color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' }}>{b.sub}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="lp-theme08-waterfall-total"
              style={{
                flex: '0 0 200px',
                alignSelf: 'flex-end',
                background: 'var(--lp-inverse-panel)',
                border: '1px solid var(--lp-border-strong)',
                borderRadius: 'var(--lp-radius-large)',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)', textTransform: 'uppercase' }}>
                <EditableField prop="totalLabel" slideIdx={_slideIdx} editable={_editable} as="span">{totalLabel}</EditableField>
              </div>
              <div style={{ fontFamily: 'var(--lp-font-display)', fontSize: 56, color: 'var(--lp-accent)', lineHeight: 1, marginTop: 6 }}>
                <EditableField prop="totalValue" slideIdx={_slideIdx} editable={_editable} as="span">{totalValue}</EditableField>
              </div>
            </div>
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
