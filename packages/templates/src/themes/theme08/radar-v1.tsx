// lemonPPT - theme08 黑金实验 · 雷达图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface RadarAxis {
  label: string;
  /** 0-100 */
  value: number;
}

export interface RadarMetric {
  label: string;
  sub?: string;
  value: number;
  /** 正负 */
  delta?: number;
}

export interface Theme08RadarV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  /** 5 个轴标签 + 值 */
  axes?: RadarAxis[];
  /** 右侧指标条 */
  metrics?: RadarMetric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08RadarV1Meta: LayoutMeta = {
  id: 'theme08_radar_v1',
  theme: 'theme08',
  role: 'stats',
  displayName: 'Theme 08 雷达图',
  description: '五边形雷达图 + 右侧指标条，适合多维能力对比',
  needsMedia: false,
  tags: ['radar', 'chart', 'black-gold'],
  contentShape: 'chart',
};

export const theme08RadarV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MODEL LAB RACE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '算力、数据、人才与渠道' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '模型实验室竞争不只看模型指标，算力、数据、人才与渠道共同决定落地速度。' },
    {
      key: 'axes',
      label: '雷达轴',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { label: '算力', value: 92 },
        { label: '数据', value: 84 },
        { label: '人才', value: 88 },
        { label: '渠道', value: 80 },
        { label: '模型', value: 90 },
      ],
      itemSchema: [
        { key: 'label', label: '轴标签', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    {
      key: 'metrics',
      label: '指标条',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { label: '算力预算', sub: 'COMPUTE BUDGET', value: 64, delta: null },
        { label: '研究团队', sub: 'RESEARCH TEAM', value: 38, delta: null },
        { label: '企业 API 客户', sub: 'ENTERPRISE API', value: 52, delta: null },
        { label: '推理成本', sub: 'INFERENCE COST', value: 21, delta: null },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'sub', label: '英文', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'delta', label: '增减', type: 'number' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '52' },
  ],
};

// 5 个顶点角度（度）：上、右上、右下、左下、左上
const RADAR_ANGLES = [-90, -18, 54, 126, 198];
const RADAR_CENTER = 180;
const RADAR_RADIUS = 140;

function radarPoint(angleDeg: number, radius: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [RADAR_CENTER + radius * Math.cos(a), RADAR_CENTER + radius * Math.sin(a)];
}

export function Theme08RadarV1(props: Theme08RadarV1Props): ReactNode {
  const { kicker, title, subtitle, axes = [], metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validAxes = (axes || []).slice(0, 6);
  const validMetrics = (metrics || []).slice(0, 6);
  const count = Math.max(validAxes.length, 3);
  const angles = Array.from(
    { length: count },
    (_, i) => RADAR_ANGLES[i] ?? -90 + (360 / count) * i,
  );

  const dataPoints = validAxes.map((ax, i) =>
    radarPoint(angles[i], (Math.max(0, Math.min(100, ax.value)) / 100) * RADAR_RADIUS),
  );
  const dataPolygon = dataPoints.map((p) => p.join(',')).join(' ');

  return (
    <div className="lp-slide lp-theme08 lp-theme08-radar-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
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
          <div
            className="lp-theme08-radar lp-rise"
            style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}
          >
            <div
              className="lp-theme08-radar-chart"
              style={{ position: 'relative', width: 360, height: 360, flex: '0 0 auto' }}
            >
              <svg width={360} height={360} viewBox="0 0 360 360" aria-hidden="true">
                {/* 同心网格 */}
                {[0.25, 0.5, 0.75, 1].map((lvl, gi) => (
                  <polygon
                    key={gi}
                    points={angles.map((ang) => radarPoint(ang, RADAR_RADIUS * lvl).join(',')).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth={1}
                  />
                ))}
                {/* 轴线 */}
                {angles.map((ang, i) => {
                  const [x, y] = radarPoint(ang, RADAR_RADIUS);
                  return (
                    <line key={i} x1={RADAR_CENTER} y1={RADAR_CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
                  );
                })}
                {/* 数据多边形 */}
                <polygon
                  points={dataPolygon}
                  fill="color-mix(in srgb, var(--lp-accent) 32%, transparent)"
                  stroke="var(--lp-accent)"
                  strokeWidth={2}
                />
                {/* 顶点 */}
                {dataPoints.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="var(--lp-accent)" />
                ))}
                {/* 轴标签 */}
                {validAxes.map((ax, i) => {
                  const [x, y] = radarPoint(angles[i], RADAR_RADIUS + 22);
                  const anchor = x < RADAR_CENTER - 4 ? 'end' : x > RADAR_CENTER + 4 ? 'start' : 'middle';
                  return (
                    <text key={i} x={x} y={y + 4} textAnchor={anchor} fontSize={13} fill="var(--lp-ink2)" fontFamily="var(--lp-font)">
                      {ax.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div
              className="lp-theme08-radar-metrics"
              style={{ flex: '1 1 280px', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {validMetrics.map((m, i) => (
                <div
                  key={i}
                  className="lp-theme08-radar-row"
                  style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--lp-divider)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="lp-theme08-radar-row-label" style={{ fontSize: 16, color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' }}>
                      <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
                    </span>
                    {m.sub && (
                      <span className="lp-theme08-radar-row-sub" style={{ fontSize: 11, letterSpacing: 1, color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' }}>
                        {m.sub}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="lp-theme08-radar-row-val" style={{ fontSize: 30, fontFamily: 'var(--lp-font-display)', color: 'var(--lp-accent)', lineHeight: 1 }}>
                      <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                    </span>
                    {m.delta != null && m.delta !== 0 && (
                      <span style={{ fontSize: 13, color: m.delta > 0 ? 'var(--lp-green)' : 'var(--lp-red)', fontFamily: 'var(--lp-font-mono)' }}>
                        {m.delta > 0 ? '▲' : '▼'} {Math.abs(m.delta)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="lp-theme08-radar-legend"
            style={{ display: 'flex', gap: 24, marginTop: 22, fontSize: 13, color: 'var(--lp-ink2)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: 'color-mix(in srgb, var(--lp-accent) 50%, transparent)', border: '1px solid var(--lp-accent)' }} />
              <span>实际</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, border: '1px dashed rgba(255,255,255,0.4)' }} />
              <span>行业均值</span>
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
