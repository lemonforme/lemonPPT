// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 韦恩图页（venn_v1）
 * 情绪：daylight | 骨架：chart-canvas
 * 三圆交集 + 标签 + 洞察面板。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11VennV1Circle {
  name: string;
  description?: string;
}

export interface Theme11VennV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  circles?: Theme11VennV1Circle[];
  centerLabel?: string;
  centerDescription?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11VennV1Meta: LayoutMeta = {
  id: 'theme11_venn_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 韦恩图页',
  description: '三圆交集关系与核心共识区',
  needsMedia: false,
  tags: ['venn', 'relationship', 'chart-canvas', 'light-stream'],
  contentShape: 'diagram',
};

export const theme11VennV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '用户价值交集' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '产品、用户与商业目标的共同区域' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'VENN' },
    {
      key: 'circles',
      label: '维度',
      type: 'array',
      maxItems: 3,
      defaultValue: [
        { name: '用户需求', description: '真实痛点与场景' },
        { name: '产品能力', description: '可交付的解决方案' },
        { name: '商业目标', description: '可持续的盈利模式' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'centerLabel', label: '交集标题', type: 'text', defaultValue: 'PMF 契合点' },
    { key: 'centerDescription', label: '交集说明', type: 'textarea', defaultValue: '需求、能力与目标三者共振，形成产品市场契合。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const colors = ['rgba(0,188,212,0.45)', 'rgba(124,77,255,0.45)', 'rgba(255,145,0,0.45)'];
const strokes = ['var(--lp-accent)', 'var(--lp-violet)', 'var(--lp-orange)'];

export function Theme11VennV1(props: Theme11VennV1Props): ReactNode {
  const { title, subtitle, eyebrow, circles = [], centerLabel, centerDescription, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validCircles = (circles || []).filter((n): n is Theme11VennV1Circle => n != null).slice(0, 3);
  const count = validCircles.length || 1;
  const cx = 200;
  const cy = 150;
  const r = 90;

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-venn lp-theme11-chart-with-insight">
      <div className="lp-theme11-venn-main lp-theme11-chart-main">
        <div className="lp-theme11-venn-head">
          {eyebrow && <Tagline>{eyebrow}</Tagline>}
          <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
          {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-venn-sub">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme11-venn-canvas">
          <svg viewBox="0 0 400 300" className="lp-theme11-venn-svg" aria-hidden="true">
            {validCircles.map((_, i) => {
              const a = (i / count) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * 48;
              const y = cy + Math.sin(a) * 48;
              return <circle key={i} cx={x} cy={y} r={r} fill={colors[i % colors.length]} stroke={strokes[i % strokes.length]} strokeWidth="3" />;
            })}
            {validCircles.map((c, i) => {
              const a = (i / count) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (r + 58);
              const y = cy + Math.sin(a) * (r + 58);
              return (
                <foreignObject key={`label-${i}`} x={x - 60} y={y - 22} width="120" height="44">
                  <div className="lp-theme11-venn-circle-label" style={{ color: strokes[i % strokes.length] }}>
                    <EditableField prop={`circles.${i}.name`} slideIdx={s} editable={e} as="span">{c.name}</EditableField>
                  </div>
                </foreignObject>
              );
            })}
            <foreignObject x={cx - 70} y={cy - 35} width="140" height="70">
              <div className="lp-theme11-venn-center">
                <EditableField prop="centerLabel" slideIdx={s} editable={e} as="span" className="lp-theme11-venn-center-title">{centerLabel}</EditableField>
              </div>
            </foreignObject>
          </svg>
          <div className="lp-theme11-venn-center-desc">
            <EditableField prop="centerDescription" slideIdx={s} editable={e} as="p">{centerDescription}</EditableField>
          </div>
        </div>
      </div>
      <div className="lp-theme11-venn-side lp-theme11-chart-side lp-rise">
        <div className="lp-theme11-chart-side-title">维度说明</div>
        <div className="lp-theme11-venn-list">
          {validCircles.map((c, i) => (
            <Card key={i} className="lp-theme11-venn-item" padding="medium">
              <span className="lp-theme11-venn-dot" style={{ background: strokes[i % strokes.length] }} />
              <div>
                <EditableField prop={`circles.${i}.name`} slideIdx={s} editable={e} as="h4" className="lp-theme11-venn-item-title">{c.name}</EditableField>
                {c.description && <EditableField prop={`circles.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-venn-item-desc">{c.description}</EditableField>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
