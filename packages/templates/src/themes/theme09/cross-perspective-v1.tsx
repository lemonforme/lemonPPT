// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 横向透视（cross_perspective_v1）
 * 基底：墨 | 骨架：chart-canvas | 图位：—
 *
 * 多维横向对照条：左侧按维度分组的横条阵列，右侧侧栏收口结论。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba } from './chart-utils.js';

export interface Theme09CrossMetric {
  name?: string;
  value?: string | number;
}

export interface Theme09CrossDimension {
  label?: string;
  note?: string;
  metrics?: string | Array<Theme09CrossMetric | string>;
}

export interface Theme09CrossPerspectiveV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  dimensions?: Theme09CrossDimension[];
  conclusion?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CrossPerspectiveV1Meta: LayoutMeta = {
  id: 'theme09_cross_perspective_v1',
  theme: 'theme09',
  role: 'comparison',
  displayName: '横向透视',
  description: '多维横向对照条 + 右侧结论侧栏，专色分维，墨底',
  needsMedia: false,
  tags: ['comparison', 'cross', 'bars', 'insight'],
  contentShape: 'cross-perspective',
};

export const theme09CrossPerspectiveV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '横向透视' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CROSS PERSPECTIVE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '对照' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四个维度上的 {{横向差距}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '同口径对照三类主体在关键指标上的表现，条长为组内相对值。' },
    {
      key: 'dimensions',
      label: '对照维度',
      type: 'array',
      maxItems: 4,
      itemSchema: [
        { key: 'label', label: '维度名称', type: 'text' },
        { key: 'note', label: '维度注释', type: 'text' },
        { key: 'metrics', label: '指标（名称:数值，用 | 分隔）', type: 'text' },
      ],
    },
    {
      key: 'conclusion',
      label: '侧栏结论',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '资金与算力向头部聚集，中腰部的差距更多出现在交付效率而非融资额度。',
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '数据来源：行业调研 · 全年口径' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'CROSS PERSPECTIVE / 03' },
  ],
};

const DEFAULT_DIMENSIONS: Theme09CrossDimension[] = [
  { label: '融资规模', note: '亿元 · 全年累计', metrics: '头部厂商:186|腰部厂商:94|新锐团队:38' },
  { label: '算力储备', note: 'PFLOPS 折算', metrics: '头部厂商:142|腰部厂商:66|新锐团队:24' },
  { label: '交付效率', note: '指数 · 越高越快', metrics: '头部厂商:72|腰部厂商:88|新锐团队:96' },
  { label: '客户续约', note: '% · 十二个月口径', metrics: '头部厂商:91|腰部厂商:78|新锐团队:63' },
];

const DEFAULT_CONCLUSION = '资金与算力向头部聚集，中腰部的差距更多出现在交付效率而非融资额度。';

function parseMetric(raw: string): Theme09CrossMetric {
  const parts = String(raw).split(/[:：]/);
  return { name: (parts[0] ?? '').trim(), value: (parts[1] ?? '').trim() };
}

function toMetrics(v?: string | Array<Theme09CrossMetric | string>): Theme09CrossMetric[] {
  if (Array.isArray(v)) {
    return v.map((m) => (typeof m === 'string' ? parseMetric(m) : m)).filter((m) => !!(m && m.name));
  }
  const s = String(v ?? '').trim();
  if (!s) return [];
  return s
    .split(/[|、]/)
    .map((x) => parseMetric(x))
    .filter((m) => !!m.name);
}

export function Theme09CrossPerspectiveV1(props: Theme09CrossPerspectiveV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    dimensions = [],
    conclusion,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const list = (dimensions.length ? dimensions : DEFAULT_DIMENSIONS).slice(0, 4);
  const text = conclusion ?? DEFAULT_CONCLUSION;

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-crossper">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}

            <div style={{ display: 'flex', gap: 30, flex: '1 1 auto', minHeight: 0 }}>
              {/* 左：多维横向对照条 */}
              <div
                style={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                {list.map((dim, di) => {
                  const metrics = toMetrics(dim.metrics);
                  const max = Math.max(...metrics.map((m) => t9ParseNumber(m.value)), 1);
                  const color = c.series[di % c.series.length];
                  return (
                    <div key={di} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 10,
                          borderBottom: `1px solid ${c.rule}`,
                          paddingBottom: 4,
                        }}
                      >
                        <span style={{ width: 4, height: 13, background: color, display: 'inline-block', alignSelf: 'center' }} aria-hidden="true" />
                        <span
                          className="lp-t9-serif"
                          style={{ fontSize: 16, fontWeight: 700, color: c.ink, letterSpacing: '0.04em' }}
                        >
                          <EditableField prop={`dimensions.${di}.label`} slideIdx={_slideIdx} editable={_editable} as="span">
                            {dim.label ?? ''}
                          </EditableField>
                        </span>
                        {dim.note && (
                          <span style={{ fontSize: 11, color: c.ink3, fontFamily: c.fontMono, letterSpacing: '0.08em' }}>
                            <EditableField prop={`dimensions.${di}.note`} slideIdx={_slideIdx} editable={_editable} as="span">
                              {dim.note}
                            </EditableField>
                          </span>
                        )}
                      </div>

                      {metrics.map((m, mi) => {
                        const pct = Math.max(6, Math.round((t9ParseNumber(m.value) / max) * 100));
                        return (
                          <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span
                              style={{
                                width: 88,
                                flex: 'none',
                                fontSize: 12.5,
                                color: c.ink2,
                                fontFamily: c.font,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {m.name}
                            </span>
                            <span style={{ flex: '1 1 auto', height: 12, background: t9Rgba(c.ink, 0.08), position: 'relative', display: 'block' }}>
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  bottom: 0,
                                  left: 0,
                                  width: `${pct}%`,
                                  background: mi === 0 ? color : t9Rgba(color, 0.5),
                                  display: 'block',
                                }}
                              />
                            </span>
                            <span
                              style={{
                                width: 54,
                                flex: 'none',
                                textAlign: 'right',
                                fontFamily: c.fontMono,
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: mi === 0 ? color : c.ink2,
                              }}
                            >
                              {String(m.value ?? '')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* 右：结论侧栏 */}
              <aside
                style={{
                  width: 244,
                  flex: 'none',
                  borderLeft: `1px solid ${c.rule}`,
                  paddingLeft: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 14,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 22, height: 4, background: c.accent, display: 'inline-block' }} aria-hidden="true" />
                  <span style={{ fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.18em', color: c.accent }}>CONCLUSION</span>
                </span>
                <p className="lp-t9-serif" style={{ margin: 0, fontSize: 19, lineHeight: 1.62, color: c.ink, fontWeight: 600 }}>
                  <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="span">
                    {text}
                  </EditableField>
                </p>
                <span style={{ height: 1, background: c.rule, display: 'block' }} aria-hidden="true" />
                <span style={{ fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.14em', color: c.ink3 }}>
                  {`${list.length} DIMENSIONS`}
                </span>
              </aside>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
