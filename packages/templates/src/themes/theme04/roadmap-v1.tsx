// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04RoadmapV1Step {
  period: string;
  title: string;
  subtitle?: string;
  description?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04RoadmapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme04RoadmapV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04RoadmapV1Meta: LayoutMeta = {
  id: 'theme04_roadmap_v1',
  theme: 'theme04',
  role: 'roadmap',
  displayName: 'Theme 04 资本三段式路线图',
  description: '三个阶梯上升的彩色卡片，适合资本节奏/阶段路线',
  needsMedia: false,
  tags: ['roadmap', 'strategy', 'candy'],
  contentShape: 'three-step-roadmap',
};

export const theme04RoadmapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资本节奏 · ROADMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一年三步：从赌叙事，到{{看兑现}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'steps',
      label: '阶段',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { period: '2024 H1', title: '叙事驱动', subtitle: '「为愿景下注」', description: '估值跑在收入前面，资本愿意为故事埋单。', tone: 'green' },
        { period: '2024 H2', title: '算力卡位', subtitle: '「卖铲子的赢」', description: '资金大举涌入算力与云，谁锁住 GPU 谁掌握主动。', tone: 'blue' },
        { period: '2025 起', title: '兑现为王', subtitle: '「看 ARR 说话」', description: '能把模型变成真实收入的公司，才留在牌桌上。', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'period', label: '时间段', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'subtitle', label: '副标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '资本叙事的重心逐级上移：愿景 → 算力 → 兑现。' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-roadmap-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04RoadmapV1(props: Theme04RoadmapV1Props): ReactNode {
  const { kicker, title, subtitle, steps, footnote, _slideIdx, _editable } = props;
  const safeSteps = (steps ?? []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme04-roadmap">
      <div className="lp-theme04-roadmap-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-roadmap-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-roadmap-grid lp-rise">
        {safeSteps.map((step, idx) => (
          <div key={idx} className={`lp-theme04-roadmap-card lp-theme04-card lp-theme04-card--${step.tone ?? 'green'}`}>
            <div className="lp-theme04-roadmap-card-top">
              <span className="lp-theme04-roadmap-period">{step.period}</span>
              <span className="lp-theme04-roadmap-step-number">{idx + 1}</span>
            </div>
            <EditableField prop={`steps.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-roadmap-card-title">{step.title}</EditableField>
            {step.subtitle && (
              <EditableField prop={`steps.${idx}.subtitle`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-roadmap-card-subtitle">{step.subtitle}</EditableField>
            )}
            {step.description && (
              <EditableField prop={`steps.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-roadmap-card-desc">{step.description}</EditableField>
            )}
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-roadmap-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
