// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 循环图页（cycle_v1）
 * 情绪：aurora | 骨架：grid
 * 中心主题 + 四周错落节点 + 虚线闭环，强调流转与迭代。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11CycleV1Node {
  title: string;
  description?: string;
}

export interface Theme11CycleV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  centerLabel?: string;
  nodes?: Theme11CycleV1Node[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CycleV1Meta: LayoutMeta = {
  id: 'theme11_cycle_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 循环图页',
  description: '中心主题 + 四周错落节点 + 虚线闭环',
  needsMedia: false,
  tags: ['cycle', 'process', 'grid', 'light-stream'],
  contentShape: 'process',
};

export const theme11CycleV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '增长飞轮' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用户价值与产品能力的正向循环' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CYCLE' },
    { key: 'centerLabel', label: '中心主题', type: 'text', defaultValue: '价值闭环' },
    {
      key: 'nodes',
      label: '循环节点',
      type: 'array',
      maxItems: 6,
      defaultValue: [
        { title: '获客', description: '精准触达目标用户' },
        { title: '激活', description: '引导完成关键行为' },
        { title: '留存', description: '持续创造使用价值' },
        { title: '变现', description: '转化付费与复购' },
        { title: '推荐', description: '口碑裂变带来新客' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange', 'green', 'cyan', 'cyan'];

export function Theme11CycleV1(props: Theme11CycleV1Props): ReactNode {
  const { title, subtitle, eyebrow, centerLabel = '价值闭环', nodes = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validNodes = (nodes || []).filter((n): n is Theme11CycleV1Node => n != null).slice(0, 6);
  const count = validNodes.length || 1;
  const radius = 210;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-cycle">
      <div className="lp-theme11-cycle-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cycle-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-cycle-canvas">
        <svg className="lp-theme11-cycle-ring" viewBox="0 0 560 420" aria-hidden="true">
          <circle cx="280" cy="210" r={radius} fill="none" stroke="var(--lp-border-strong)" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
          {validNodes.map((_, i) => {
            const a = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x1 = 280 + Math.cos(a) * radius;
            const y1 = 210 + Math.sin(a) * radius;
            const x2 = 280 + Math.cos(a) * (radius + 18);
            const y2 = 210 + Math.sin(a) * (radius + 18);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--lp-accent)" strokeWidth="2" markerEnd="url(#arrow)" />;
          })}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--lp-accent)" />
            </marker>
          </defs>
        </svg>
        <div className="lp-theme11-cycle-center lp-rise">
          <div className="lp-theme11-cycle-center-dot" />
          <EditableField prop="centerLabel" slideIdx={s} editable={e} as="span" className="lp-theme11-cycle-center-label">{centerLabel}</EditableField>
        </div>
        {validNodes.map((node, i) => {
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          const leftPct = 50 + (Math.cos(a) * radius) / 5.6;
          const topPct = 50 + (Math.sin(a) * radius) / 4.2;
          return (
            <div
              key={i}
              className={`lp-theme11-cycle-node lp-rise lp-theme11-cycle-node-${i + 1}`}
              style={{ left: `${leftPct}%`, top: `${topPct}%`, animationDelay: `${i * 90}ms` }}
            >
              <Card className={`lp-theme11-cycle-card lp-theme11-tile-tone-${tones[i % tones.length]}`} padding="medium">
                <span className="lp-theme11-cycle-node-index">0{i + 1}</span>
                <EditableField prop={`nodes.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-cycle-node-title">{node.title}</EditableField>
                {node.description && <EditableField prop={`nodes.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-cycle-node-desc">{node.description}</EditableField>}
              </Card>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
