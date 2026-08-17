// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 景气仪表（gauge_v1）
 * 基底：墨 | 骨架：chart-canvas | 图位：—
 *
 * 半环仪表盘（echarts gauge）：区间色带分档，中心挂读数，右侧列区间图例。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, type T9ChartColors } from './chart-utils.js';

export interface Theme09GaugeRange {
  min?: string | number;
  max?: string | number;
  /** 色档：红 / 黄 / 绿，或直接给 #RRGGBB */
  color?: string;
  label?: string;
}

export interface Theme09GaugeV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  value?: string | number;
  min?: string | number;
  max?: string | number;
  ranges?: Theme09GaugeRange[];
  unit?: string;
  readingLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09GaugeV1Meta: LayoutMeta = {
  id: 'theme09_gauge_v1',
  theme: 'theme09',
  role: 'metric',
  displayName: '景气仪表',
  description: '半环仪表盘 + 红黄绿区间色带 + 中心读数，墨底',
  needsMedia: false,
  tags: ['chart', 'gauge', 'index', 'sentiment'],
  contentShape: 'gauge',
};

export const theme09GaugeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '景气仪表' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'GAUGE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '14' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '读数' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产业景气度回到 {{扩张区间}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '综合订单、产能利用率与融资可得性三项分指标加权，50 为荣枯线。' },
    { key: 'value', label: '当前读数', type: 'number', defaultValue: 63.4 },
    { key: 'min', label: '量程下限', type: 'number', defaultValue: 0 },
    { key: 'max', label: '量程上限', type: 'number', defaultValue: 100 },
    {
      key: 'ranges',
      label: '区间色带',
      type: 'array',
      maxItems: 5,
      itemSchema: [
        { key: 'min', label: '区间起', type: 'number' },
        { key: 'max', label: '区间止', type: 'number' },
        { key: 'color', label: '色档（红/黄/绿）', type: 'text' },
        { key: 'label', label: '区间名', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'readingLabel', label: '读数说明', type: 'text', inlineEditable: true, defaultValue: '当前景气指数' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '口径：季调后加权综合指数' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'GAUGE / 14' },
  ],
};

const DEFAULT_VALUE = 63.4;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

const DEFAULT_RANGES: Theme09GaugeRange[] = [
  { min: 0, max: 40, color: '红', label: '收缩' },
  { min: 40, max: 55, color: '黄', label: '徘徊' },
  { min: 55, max: 100, color: '绿', label: '扩张' },
];

/** 把色档名映射到基底专色（未知值原样透传，允许直接写 #RRGGBB）。 */
function toneColor(name: string | undefined, c: T9ChartColors): string {
  const s = String(name ?? '').trim().toLowerCase();
  if (!s) return c.ink3;
  if (/^#|^rgb|^var\(/.test(s)) return s;
  if (/红|red|danger|差/.test(s)) return c.accent;
  if (/黄|橙|amber|orange|yellow|warn|中/.test(s)) return c.accent3;
  if (/绿|青|green|teal|good|优/.test(s)) return c.accent4;
  if (/蓝|紫|blue|violet/.test(s)) return c.accent5;
  return c.ink3;
}

function buildOption(
  value: number,
  min: number,
  max: number,
  ranges: Theme09GaugeRange[],
  unit: string,
): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const span = max - min || 1;

  // 区间 → axisLine.color 的 [百分比, 色值] 序列，按上界排序并裁剪到量程内。
  const stops = ranges
    .map((r) => ({
      to: Math.min(max, Math.max(min, t9ParseNumber(r.max ?? max))),
      color: toneColor(r.color, c),
    }))
    .sort((a, b) => a.to - b.to)
    .map((r) => [(r.to - min) / span, r.color] as [number, string]);

  const colorStops = stops.length ? stops : [[1, c.accent] as [number, string]];
  // 保证最后一档铺满整圈，避免 echarts 因末档 < 1 报错。
  if (colorStops[colorStops.length - 1][0] < 1) {
    colorStops[colorStops.length - 1] = [1, colorStops[colorStops.length - 1][1]];
  }

  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '76%'],
        radius: '116%',
        min,
        max,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 26,
            color: colorStops,
          },
        },
        progress: { show: false },
        pointer: {
          show: true,
          length: '62%',
          width: 5,
          itemStyle: { color: c.ink },
        },
        anchor: {
          show: true,
          size: 14,
          showAbove: true,
          itemStyle: { color: c.ink, borderColor: c.surfaceSolid, borderWidth: 3 },
        },
        axisTick: {
          distance: -26,
          length: 6,
          lineStyle: { color: t9Rgba(c.ink, 0.35), width: 1 },
        },
        splitLine: {
          distance: -26,
          length: 14,
          lineStyle: { color: t9Rgba(c.ink, 0.55), width: 2 },
        },
        axisLabel: {
          distance: -18,
          color: c.ink3,
          fontFamily: c.fontMono,
          fontSize: 12,
        },
        title: { show: false },
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '-14%'],
          formatter: unit ? `{value}${unit}` : '{value}',
          color: c.accent,
          fontFamily: c.fontHeading,
          fontSize: 54,
          fontWeight: 700,
        },
        data: [{ value }],
      },
    ],
  };
}

export function Theme09GaugeV1(props: Theme09GaugeV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    value,
    min,
    max,
    ranges = [],
    unit = '',
    readingLabel,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const lo = min == null ? DEFAULT_MIN : t9ParseNumber(min);
  const hi = max == null ? DEFAULT_MAX : t9ParseNumber(max);
  const val = value == null ? DEFAULT_VALUE : t9ParseNumber(value);
  const bands = ranges.length ? ranges : DEFAULT_RANGES;
  const label = readingLabel && readingLabel.trim() ? readingLabel : '当前景气指数';

  const activeIdx = bands.findIndex((r) => val >= t9ParseNumber(r.min ?? lo) && val <= t9ParseNumber(r.max ?? hi));

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-gauge">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}

            <div style={{ display: 'flex', alignItems: 'stretch', gap: 30, flex: '1 1 auto', minHeight: 0 }}>
              <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, display: 'flex' }}>
                <LpEChart type="gauge" option={buildOption(val, lo, hi, bands, unit)} className="lp-theme09-chart-area" />
              </div>

              {/* 右：区间图例 + 读数说明 */}
              <div
                style={{
                  flex: 'none',
                  width: 236,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 14,
                  borderLeft: `1px solid ${c.rule}`,
                  paddingLeft: 22,
                }}
              >
                <span style={{ fontFamily: c.font, fontSize: 13, color: c.ink3 }}>
                  <EditableField prop="readingLabel" slideIdx={_slideIdx} editable={_editable} as="span">
                    {label}
                  </EditableField>
                </span>

                {bands.map((r, i) => {
                  const tone = toneColor(r.color, c);
                  const on = i === activeIdx;
                  return (
                    <span
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        border: `1px solid ${on ? tone : c.border}`,
                        background: on ? t9Rgba(tone, 0.14) : 'transparent',
                      }}
                    >
                      <span aria-hidden="true" style={{ flex: 'none', width: 14, height: 14, background: tone }} />
                      <span style={{ fontFamily: c.font, fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? c.ink : c.ink2 }}>
                        {r.label ?? `区间 ${i + 1}`}
                      </span>
                      <span style={{ marginLeft: 'auto', fontFamily: c.fontMono, fontSize: 11.5, color: c.ink3 }}>
                        {`${t9ParseNumber(r.min ?? lo)}–${t9ParseNumber(r.max ?? hi)}`}
                      </span>
                    </span>
                  );
                })}

                <span style={{ fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.16em', color: c.ink3 }}>
                  {`RANGE ${lo} – ${hi}${unit}`}
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
