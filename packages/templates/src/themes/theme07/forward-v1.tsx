// lemonPPT - theme07 前瞻斜率图
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ForwardV1Line {
  label?: string;
  start?: number;
  end?: number;
  unit?: string;
}

export interface Theme07ForwardV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  axisStart?: string;
  axisEnd?: string;
  lines?: Theme07ForwardV1Line[];
  showBand?: boolean;
  footnote?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ForwardV1Meta: LayoutMeta = {
  id: 'theme07_forward_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 前瞻斜率图',
  description: '多指标斜率图：左右两期数值端点连线，上升区叠加渐变带',
  needsMedia: true,
  tags: ['forward', 'slope', 'trend', 'chart'],
  contentShape: 'slope-chart',
};

/** 系列配色统一取自 theme07 数据系列 token */
const SERIES_COLORS = [
  'var(--lp-series-1)',
  'var(--lp-series-2)',
  'var(--lp-series-3)',
  'var(--lp-series-4)',
  'var(--lp-series-5)',
];

export const theme07ForwardV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'FORWARD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '未来三年关键指标斜率' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '以 2024 年为基准，各指标向 2027 年的预期斜率' },
    { key: 'axisStart', label: '起点年份', type: 'text', inlineEditable: true, defaultValue: '2024' },
    { key: 'axisEnd', label: '终点年份', type: 'text', inlineEditable: true, defaultValue: '2027' },
    {
      key: 'lines',
      label: '指标折线',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '模型收入', start: 18, end: 96, unit: '亿美元' },
        { label: '推理需求', start: 32, end: 84, unit: '指数' },
        { label: '企业渗透率', start: 12, end: 58, unit: '%' },
        { label: '单位算力成本', start: 74, end: 41, unit: '指数' },
        { label: '垂直应用数量', start: 24, end: 67, unit: '百个' },
      ],
      itemSchema: [
        { key: 'label', label: '指标名称', type: 'text', inlineEditable: true },
        { key: 'start', label: '起点数值', type: 'number' },
        { key: 'end', label: '终点数值', type: 'number' },
        { key: 'unit', label: '单位', type: 'text' },
      ],
    },
    { key: 'showBand', label: '显示上升渐变带', type: 'boolean', defaultValue: true },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '注：数值经归一化处理，仅用于比较斜率方向与陡峭度。' },
    { key: 'focusIndex', label: '高亮指标', type: 'slider', min: 0, max: 5, defaultValue: 0 },
  ],
};

export function Theme07ForwardV1(props: Theme07ForwardV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    axisStart = '2024',
    axisEnd = '2027',
    lines = [],
    showBand = true,
    footnote,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validLines = (lines || [])
    .filter((l): l is Theme07ForwardV1Line => l != null && !!l.label)
    .slice(0, 6);

  const allValues = validLines.flatMap((l) => [Number(l.start) || 0, Number(l.end) || 0]);
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 1;
  const span = rawMax - rawMin || 1;
  // 上下各留 10% 余量，避免端点贴边
  const toY = (value: number): number => 90 - ((value - rawMin) / span) * 80;

  const startYs = validLines.map((l) => toY(Number(l.start) || 0));
  const endYs = validLines.map((l) => toY(Number(l.end) || 0));
  const bandTop = `0,${Math.min(...(startYs.length ? startYs : [90]))} 100,${Math.min(...(endYs.length ? endYs : [10]))}`;
  const bandBottom = `100,${Math.max(...(endYs.length ? endYs : [90]))} 0,${Math.max(...(startYs.length ? startYs : [90]))}`;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-forward-slope">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-forward-slope-header lp-rise">
        <Theme07IconChip name="trend" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validLines.length > 0 && (
        <div className="lp-theme07-forward-slope-body lp-rise">
          <div className="lp-theme07-forward-slope-col lp-theme07-forward-slope-col--start">
            <div className="lp-theme07-forward-slope-axis-name">{axisStart}</div>
            {validLines.map((line, index) => (
              <div
                key={index}
                className={`lp-theme07-forward-slope-tag ${index === focusIndex ? 'is-focus' : ''}`}
                style={{ top: `${startYs[index] ?? 50}%`, '--lp-theme07-line-color': SERIES_COLORS[index % SERIES_COLORS.length] } as CSSProperties}
              >
                <span className="lp-theme07-forward-slope-tag-value">
                  <EditableField prop={`lines.${index}.start`} slideIdx={_slideIdx} editable={_editable} as="span" fieldType="number" chartData>{line.start ?? 0}</EditableField>
                </span>
              </div>
            ))}
          </div>
          <div className="lp-theme07-forward-slope-plot">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="lp-theme07-forward-band" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="var(--lp-accent-2)" stopOpacity="0.22" />
                </linearGradient>
              </defs>
              {[10, 30, 50, 70, 90].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="var(--lp-panel-line)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <line x1="0" y1="0" x2="0" y2="100" stroke="var(--lp-border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="100" y1="0" x2="100" y2="100" stroke="var(--lp-border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              {showBand && (
                <polygon points={`${bandTop} ${bandBottom}`} fill="url(#lp-theme07-forward-band)" />
              )}
              {validLines.map((_, index) => (
                <line
                  key={`line-${index}`}
                  x1="0"
                  y1={startYs[index] ?? 50}
                  x2="100"
                  y2={endYs[index] ?? 50}
                  stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                  strokeWidth={index === focusIndex ? 3 : 2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity={index === focusIndex ? 1 : 0.68}
                />
              ))}
            </svg>
            {validLines.map((_, index) => (
              <span
                key={`dot-start-${index}`}
                className="lp-theme07-forward-slope-dot"
                aria-hidden="true"
                style={{ left: '0%', top: `${startYs[index] ?? 50}%`, background: SERIES_COLORS[index % SERIES_COLORS.length] }}
              />
            ))}
            {validLines.map((_, index) => (
              <span
                key={`dot-end-${index}`}
                className={`lp-theme07-forward-slope-dot ${index === focusIndex ? 'is-focus' : ''}`}
                aria-hidden="true"
                style={{ left: '100%', top: `${endYs[index] ?? 50}%`, background: SERIES_COLORS[index % SERIES_COLORS.length] }}
              />
            ))}
          </div>
          <div className="lp-theme07-forward-slope-col lp-theme07-forward-slope-col--end">
            <div className="lp-theme07-forward-slope-axis-name">{axisEnd}</div>
            {validLines.map((line, index) => (
              <div
                key={index}
                className={`lp-theme07-forward-slope-tag lp-theme07-forward-slope-tag--end ${index === focusIndex ? 'is-focus' : ''}`}
                style={{ top: `${endYs[index] ?? 50}%`, '--lp-theme07-line-color': SERIES_COLORS[index % SERIES_COLORS.length] } as CSSProperties}
              >
                <span className="lp-theme07-forward-slope-tag-value">
                  <EditableField prop={`lines.${index}.end`} slideIdx={_slideIdx} editable={_editable} as="span" fieldType="number" chartData>{line.end ?? 0}</EditableField>
                  {line.unit && <em className="lp-theme07-forward-slope-tag-unit">{line.unit}</em>}
                </span>
                <span className="lp-theme07-forward-slope-tag-label">
                  <EditableField prop={`lines.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{line.label}</EditableField>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {footnote && (
        <div className="lp-theme07-forward-slope-footnote">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
