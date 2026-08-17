// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 预测扇形（forecast_fan_v1）
 * 基底：墨 | 骨架：sidebar | 图位：1
 *
 * 历史实线延伸为预测虚线，上下界之间填充置信扇形（堆叠面积实现），
 * 右侧 InkPhoto 影像位作远景底。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';
import {
  t9AxisLabel,
  t9ChartColors,
  t9Grid,
  t9ParseNumber,
  t9Rgba,
  t9SplitLine,
  t9Tooltip,
} from './chart-utils.js';

export interface Theme09ForecastPoint {
  label?: string;
  value?: string | number;
  upper?: string | number;
  lower?: string | number;
}

export type Theme09HistoricalPoint = string | number | { label?: string; value?: string | number };

export interface Theme09ForecastFanV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  subtitle?: string;
  historical?: Theme09HistoricalPoint[];
  forecast?: Theme09ForecastPoint[];
  image?: string;
  unit?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ForecastFanV1Meta: LayoutMeta = {
  id: 'theme09_forecast_fan_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '预测扇形',
  description: '历史实线 + 预测置信区间扇形渐变 + 右侧影像远景底，墨底',
  needsMedia: true,
  mediaSlots: [{ name: '远景影像', fieldPath: 'image', canPresetMedia: true }],
  tags: ['chart', 'forecast', 'confidence', 'fan', 'photo'],
  contentShape: 'forecast-fan',
};

export const theme09ForecastFanV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '预测扇形' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'FORECAST FAN' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '18' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '未来四个季度的中枢与不确定带' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '实线为历史真值，虚线为中性情形，扇形区域覆盖乐观与保守情形的取值范围。' },
    {
      key: 'historical',
      label: '历史序列',
      type: 'array',
      maxItems: 12,
      itemSchema: [
        { key: 'label', label: '期次', type: 'text' },
        { key: 'value', label: '真值', type: 'number' },
      ],
    },
    {
      key: 'forecast',
      label: '预测序列',
      type: 'array',
      maxItems: 8,
      itemSchema: [
        { key: 'label', label: '期次', type: 'text' },
        { key: 'value', label: '中性值', type: 'number' },
        { key: 'upper', label: '上界', type: 'number' },
        { key: 'lower', label: '下界', type: 'number' },
      ],
    },
    { key: 'image', label: '远景影像', type: 'image', defaultValue: '' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '预测 · 区间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '38' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_HISTORICAL: Theme09HistoricalPoint[] = [
  { label: '24Q3', value: 112 },
  { label: '24Q4', value: 134 },
  { label: '25Q1', value: 148 },
  { label: '25Q2', value: 163 },
  { label: '25Q3', value: 181 },
];

const DEFAULT_FORECAST: Theme09ForecastPoint[] = [
  { label: '25Q4', value: 196, upper: 208, lower: 186 },
  { label: '26Q1', value: 214, upper: 238, lower: 194 },
  { label: '26Q2', value: 233, upper: 272, lower: 202 },
  { label: '26Q3', value: 254, upper: 312, lower: 208 },
];

interface HistNorm {
  label: string;
  value: number;
}

function normalizeHistorical(input: Theme09HistoricalPoint[]): HistNorm[] {
  return input.map((h, i) => {
    if (typeof h === 'object' && h !== null) {
      return { label: h.label ?? `H${i + 1}`, value: t9ParseNumber(h.value) };
    }
    return { label: `H${i + 1}`, value: t9ParseNumber(h) };
  });
}

function buildOption(hist: HistNorm[], fcs: Theme09ForecastPoint[], unit: string): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const H = hist.length;
  const labels = [...hist.map((h) => h.label), ...fcs.map((f, i) => f.label ?? `F${i + 1}`)];

  const bridgeIdx = Math.max(0, H - 1);
  const bridgeValue = H > 0 ? hist[H - 1].value : 0;

  const histLine: Array<number | null> = labels.map((_, i) => (i < H ? hist[i].value : null));

  // 预测线与扇形都从最后一个历史点起接续，避免出现断口。
  const fcLine: Array<number | null> = labels.map((_, i) => {
    if (i === bridgeIdx) return bridgeValue;
    if (i > bridgeIdx) return t9ParseNumber(fcs[i - H].value);
    return null;
  });

  const bandBase: Array<number | null> = labels.map((_, i) => {
    if (i === bridgeIdx) return bridgeValue;
    if (i > bridgeIdx) return t9ParseNumber(fcs[i - H].lower);
    return null;
  });

  const bandSpan: Array<number | null> = labels.map((_, i) => {
    if (i === bridgeIdx) return 0;
    if (i > bridgeIdx) {
      const f = fcs[i - H];
      return Math.max(0, t9ParseNumber(f.upper) - t9ParseNumber(f.lower));
    }
    return null;
  });

  return {
    grid: t9Grid({ left: 18, right: 26, top: 34, bottom: 34 }),
    tooltip: { ...t9Tooltip(c), trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
    },
    yAxis: {
      type: 'value',
      name: unit,
      nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, align: 'left', padding: [0, 0, 6, -6] },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
      splitLine: t9SplitLine(c),
    },
    series: [
      // 扇形底：透明打底，仅用于把区间抬到下界
      {
        type: 'line',
        name: '下界',
        stack: 'fan',
        data: bandBase,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
        silent: true,
        z: 1,
      },
      // 扇形带：上下界之差，渐变填充
      {
        type: 'line',
        name: '置信区间',
        stack: 'fan',
        data: bandSpan,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: t9Rgba(c.accent, 0.1) },
              { offset: 1, color: t9Rgba(c.accent, 0.34) },
            ],
          },
        },
        silent: true,
        z: 2,
      },
      {
        type: 'line',
        name: '历史真值',
        data: histLine,
        smooth: 0.26,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: c.ink, width: 3 },
        itemStyle: { color: c.ink, borderColor: c.surfaceSolid, borderWidth: 2 },
        z: 5,
      },
      {
        type: 'line',
        name: '预测中枢',
        data: fcLine,
        smooth: 0.26,
        symbol: 'emptyCircle',
        symbolSize: 7,
        lineStyle: { color: c.accent, width: 3, type: 'dashed' },
        itemStyle: { color: c.accent },
        z: 4,
      },
    ],
  };
}

export function Theme09ForecastFanV1(props: Theme09ForecastFanV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    subtitle,
    historical = [],
    forecast = [],
    image,
    unit = '亿元',
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const hist = normalizeHistorical(historical.length ? historical : DEFAULT_HISTORICAL);
  const fcs = forecast.length ? forecast : DEFAULT_FORECAST;
  const last = fcs[fcs.length - 1];

  return (
    <Sheet substrate="ink" frame="sidebar" className="lp-theme09-forecastfan">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', gap: 34, padding: '96px 60px 70px' }}>
        {/* 左：预测扇形 */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)', flex: 'none' }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          {subtitle && (
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: 'var(--lp-ink2)', flex: 'none' }}>
              <EditableField prop="subtitle" slideIdx={s} editable={e} as="span">
                {subtitle}
              </EditableField>
            </p>
          )}

          <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}>
            <LpEChart type="line" option={buildOption(hist, fcs, unit)} className="lp-theme09-chart-area" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flex: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ width: 20, height: 3, background: 'var(--lp-ink)' }} />
              <span style={{ fontSize: 12, color: 'var(--lp-ink2)' }}>历史真值</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ width: 20, height: 0, borderTop: '3px dashed var(--lp-accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--lp-ink2)' }}>预测中枢</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                aria-hidden="true"
                style={{ width: 20, height: 12, background: 'var(--lp-accent)', opacity: 0.3 }}
              />
              <span style={{ fontSize: 12, color: 'var(--lp-ink2)' }}>置信区间</span>
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--lp-ink3)' }}>
              {`UNIT / ${unit}`}
            </span>
          </div>
        </div>

        {/* 右：远景影像 + 终值读数 */}
        <div style={{ flex: 'none', width: 288, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InkPhoto
            prop="image"
            src={image}
            slideIdx={s}
            editable={e}
            ratio="fill"
            hint="上传远景影像"
            scrim="bottom"
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--lp-text-inverse)' }}>
              FORWARD VIEW
            </span>
          </InkPhoto>

          <div style={{ flex: 'none', borderTop: '2px solid var(--lp-accent)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--lp-ink3)' }}>
              {`${last?.label ?? '期末'} 中枢`}
            </span>
            <span className="lp-t9-serif" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, color: 'var(--lp-accent)', letterSpacing: '-0.02em' }}>
              {t9ParseNumber(last?.value)}
            </span>
            <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 12, color: 'var(--lp-ink2)' }}>
              {`区间 ${t9ParseNumber(last?.lower)} – ${t9ParseNumber(last?.upper)} ${unit}`}
            </span>
          </div>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
