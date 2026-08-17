// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Legend, t9DataLabel, t9BarItemStyle } from './chart-utils.js';

export interface Theme09RoundsV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  rounds?: string[];
  categories?: string[];
  matrix?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RoundsV1Meta: LayoutMeta = {
  id: 'theme09_rounds_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '轮次结构',
  description: '分组柱 + 轮次标签列，纸底',
  needsMedia: false,
  tags: ['chart', 'bar', 'comparison'],
  contentShape: 'grouped-bar',
};

export const theme09RoundsV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '轮次结构' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ROUNDS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '34' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '阶段' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资向 {{后期轮次}} 集中' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '各赛道在种子到 D+ 轮间的事件分布。' },
    { key: 'rounds', label: '轮次标签', type: 'array', inlineEditable: true, defaultValue: ['种子', 'A', 'B', 'C', 'D+'] },
    { key: 'categories', label: '赛道', type: 'array', inlineEditable: true, defaultValue: ['大模型', '算力', '应用'] },
    { key: 'matrix', label: '数值矩阵（每行 轮次|值1|值2|...）', type: 'array', inlineEditable: true, defaultValue: [] },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_ROUNDS = ['种子', 'A', 'B', 'C', 'D+'];
const DEFAULT_CATS = ['大模型', '算力', '应用'];
const DEFAULT_MATRIX = ['种子|12|8|20', 'A|18|14|26', 'B|22|20|18', 'C|16|24|10', 'D+|28|30|6'];

function buildOption(rounds: string[], cats: string[], matrix: string[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const r = rounds.length ? rounds : DEFAULT_ROUNDS;
  const categories = cats.length ? cats : DEFAULT_CATS;
  const rows = matrix.length ? matrix : DEFAULT_MATRIX;
  const series = categories.map((cat, ci) => ({
    name: cat,
    type: 'bar' as const,
    barGap: '12%',
    barCategoryGap: '38%',
    itemStyle: t9BarItemStyle(c.series[ci % c.series.length], 'paper', [3, 3, 0, 0]),
    label: t9DataLabel(c, 'top', { show: ci === categories.length - 1 }),
    data: r.map((_, ri) => {
      const parts = (rows[ri] ?? '').split('|');
      return t9ParseNumber(parts[ci + 1]);
    }),
  }));

  return {
    grid: t9Grid({ bottom: 36 }),
    legend: t9Legend(c, { data: categories, top: 6, right: 'auto', itemHeight: 10 }),
    xAxis: {
      type: 'category',
      data: r,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: t9AxisLabel(c, 13),
    },
    yAxis: {
      type: 'value',
      splitLine: t9SplitLine(c),
      axisLabel: t9AxisLabel(c, 12),
    },
    series,
  };
}

export function Theme09RoundsV1(props: Theme09RoundsV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    rounds = [],
    categories = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-rounds">
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
          <div className="lp-theme09-rounds-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-rounds-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-rounds-chart">
              <LpEChart type="bar" option={buildOption(rounds, categories, matrix)} className="lp-theme09-rounds-echart" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
