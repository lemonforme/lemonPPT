// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Tooltip, t9Legend, t9Emphasis } from './chart-utils.js';

export interface Theme09StreamItem {
  date?: string;
  values?: string[];
  names?: string[];
}

export interface Theme09StreamgraphV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  dates?: string[];
  series?: string[];
  matrix?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09StreamgraphV1Meta: LayoutMeta = {
  id: 'theme09_streamgraph_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '资金流带',
  description: '流带堆叠图，专色主流 + 灰阶辅流，墨底',
  needsMedia: false,
  tags: ['chart', 'stream', 'trend'],
  contentShape: 'streamgraph',
};

export const theme09StreamgraphV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '季度资金之流' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CAPITAL FLOW' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '13' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '流向' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资金在{{大模型}}与{{算力}}间往复奔流' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一束流带代表一个赛道的季度融资强度，堆叠高度即总盘子。' },
    { key: 'dates', label: '时间轴（季度）', type: 'array', inlineEditable: true, defaultValue: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'] },
    { key: 'series', label: '流带名称', type: 'array', inlineEditable: true, defaultValue: ['大模型', '算力', '应用', '数据'] },
    { key: 'matrix', label: '数值矩阵（每行 时间|值1|值2|...）', type: 'array', inlineEditable: true, defaultValue: [] },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_DATES = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
const DEFAULT_SERIES = ['大模型', '算力', '应用', '数据'];
const DEFAULT_MATRIX = [
  'Q1|120|52|68|28',
  'Q2|166|86|74|40',
  'Q3|184|126|85|50',
  'Q4|230|172|102|62',
  'Q5|206|200|114|74',
  'Q6|246|234|136|86',
];

function buildOption(dates: string[], seriesNames: string[], matrix: string[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const rows = matrix.length ? matrix : DEFAULT_MATRIX;
  const dts = dates.length ? dates : DEFAULT_DATES;
  const sns = seriesNames.length ? seriesNames : DEFAULT_SERIES;

  // 按系列组织数据：每行一个 series，兼容 JSON 序列化（无函数式属性）
  const seriesData: number[][] = [];
  for (let si = 0; si < sns.length; si++) {
    const arr: number[] = [];
    for (let ri = 0; ri < rows.length && ri < dts.length; ri++) {
      const parts = rows[ri].split('|');
      arr.push(parseFloat(parts[si + 1] ?? '0') || 0);
    }
    seriesData.push(arr);
  }

  return {
    color: [c.accent, c.series[0], c.series[1], c.series[2]],
    tooltip: { ...t9Tooltip(c), trigger: 'axis', axisPointer: { type: 'line' } },
    legend: t9Legend(c, { data: sns, top: 0, right: 0, itemHeight: 4, itemGap: 16 }),
    grid: { left: '6%', right: '6%', top: '14%', bottom: '14%', containLabel: false },
    xAxis: {
      type: 'category',
      data: dts,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { color: c.ink3, fontFamily: c.font, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: sns.map((name, i) => ({
      name,
      type: 'line',
      stack: 'total',
      smooth: 0.3,
      symbol: 'none',
      lineStyle: { width: 0 },
      areaStyle: { opacity: 0.88 },
      emphasis: t9Emphasis(c),
      data: seriesData[i],
    })),
  };
}

export function Theme09StreamgraphV1(props: Theme09StreamgraphV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    dates = [],
    series = [],
    matrix = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-streamgraph">
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
          <div
            className="lp-theme09-streamgraph-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-streamgraph-chart" style={{ flex: '1 1 auto', minHeight: 0 }}>
              <LpEChart type="line" option={buildOption(dates, series, matrix)} className="lp-theme09-chart-area" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
