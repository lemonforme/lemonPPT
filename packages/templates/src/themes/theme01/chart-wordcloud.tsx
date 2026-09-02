// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';
export interface Theme01ChartWordcloudProps {
  title?: string;
  kicker?: string;
  words?: Array<{
    name: string;
    value: number;
  }>;
  shape?: 'circle' | 'rect';
  colors?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartWordcloudMeta: LayoutMeta = {
  id: 'theme01_chart_wordcloud',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 词云',
  description: 'SVG 词云，适合展示关键词权重分布',
  needsMedia: false,
};
export const theme01ChartWordcloudSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'words',
      label: 'words',
      type: 'array',
      maxItems: 50,
      minItems: 1,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'value',
          label: '数值',
          type: 'number'
        }
      ]
    },
    {
      key: 'shape',
      label: 'shape',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'colors',
      label: 'colors',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
const DEFAULT_COLORS = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)', 'var(--lp-violet)', 'var(--lp-pink)', 'var(--lp-cyan)', 'var(--lp-orange)'];
export function Theme01ChartWordcloud(props: Theme01ChartWordcloudProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const words = props.words ?? [
    { name: 'AI', value: 100 },
    { name: 'PPT', value: 90 },
    { name: '数据可视化', value: 85 },
    { name: '自动化', value: 80 },
    { name: '大屏', value: 75 },
    { name: '主题', value: 70 },
    { name: '模板', value: 65 },
    { name: '智能生成', value: 60 },
    { name: 'ECharts', value: 58 },
    { name: 'React', value: 55 },
    { name: 'PPTX', value: 50 },
    { name: '交互', value: 48 },
    { name: '导出', value: 45 },
    { name: '设计', value: 42 },
    { name: '品牌', value: 40 },
    { name: '效率', value: 38 },
    { name: '协同', value: 35 },
    { name: '云端', value: 32 },
    { name: '自定义', value: 30 },
  ];
  const shape = props.shape ?? 'circle';
  const colors = props.colors ?? DEFAULT_COLORS;
  const width = 720;
  const height = 360;
  const placed = layoutWords(words, width, height, shape);
  return (
    <Sheet substrate="tint" tint="pink" frame="chart-canvas" className="lp-chart-v2">
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, bottom: -160, left: -120, background: 'var(--lp-violet)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ top: 110, right: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ top: 130, left: 110, height: 70, background: 'var(--lp-pink)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ bottom: 130, right: 110, width: 64, height: 64, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ bottom: 140, right: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="violet">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '关键词云'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-wordcloud-wrapper">
          <svg viewBox={`0 0 ${width} ${height}`} className="lp-wordcloud-svg" style={{ width: '100%', height: '100%' }}>
            {placed.map((item, i) => (
              <text
                key={i}
                x={item.x + item.w / 2}
                y={item.y + item.h * 0.75}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={item.size}
                fontWeight={item.value > 70 ? 700 : item.value > 45 ? 600 : 500}
                fill={colors[i % colors.length]}
                style={{ userSelect: 'none' }}
              >
                {item.text}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <Folio
        left="CHART"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
interface PlacedWord {
  text: string;
  value: number;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
}
function layoutWords(words: Array<{
  name: string;
  value: number;
}>, width: number, height: number, shape: 'circle' | 'rect'): PlacedWord[] {
  const sorted = [...words].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sorted.map((w) => w.value), 1);
  const minSize = 16;
  const maxSize = 56;
  const aspect = width / height;
  const placed: PlacedWord[] = [];
  const cx = width / 2;
  const cy = height / 2;
  for (let idx = 0; idx < sorted.length; idx++) {
    const word = sorted[idx];
    const size = minSize + (word.value / maxValue) * (maxSize - minSize);
    const w = estimateTextWidth(word.name, size);
    const h = size * 1.2;
    let placedRect: PlacedWord | null = null;
    for (let step = 0; step < 2400; step++) {
      const angle = 0.4 * step;
      const radius = 3.5 * Math.sqrt(step);
      const x = cx + radius * Math.cos(angle) - w / 2;
      const y = cy + (radius / aspect) * Math.sin(angle) - h / 2;
      if (shape === 'circle') {
        const dx = x + w / 2 - cx;
        const dy = (y + h / 2 - cy) * aspect;
        if (Math.hypot(dx, dy) > Math.min(width, height) / 2 - 8)
          continue;
      }
      const rect = { x, y, w, h };
      if (!placed.some((p) => rectsOverlap(p, rect))) {
        placedRect = { text: word.name, value: word.value, x, y, w, h, size };
        break;
      }
    }
    if (placedRect) {
      placed.push(placedRect);
    }
  }
  return placed;
}
function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const char of String(text)) {
    const code = char.charCodeAt(0);
    const isCjk = code >= 0x4e00 && code <= 0x9fff;
    width += isCjk ? fontSize * 1.02 : fontSize * 0.55;
  }
  return width + fontSize * 0.2;
}
function rectsOverlap(a: {
  x: number;
  y: number;
  w: number;
  h: number;
}, b: {
  x: number;
  y: number;
  w: number;
  h: number;
}): boolean {
  const padding = 4;
  return (a.x < b.x + b.w + padding &&
    a.x + a.w + padding > b.x &&
    a.y < b.y + b.h + padding &&
    a.y + a.h + padding > b.y);
}
