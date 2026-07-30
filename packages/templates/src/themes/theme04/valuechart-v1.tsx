// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ValuechartV1Stage {
  label: string;
  value: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ValuechartV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  name?: string;
  stages?: Theme04ValuechartV1Stage[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ValuechartV1Meta: LayoutMeta = {
  id: 'theme04_valuechart_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 估值三级跳',
  description: '三阶段估值跳跃式展示',
  needsMedia: false,
  tags: ['chart', 'value', 'valuation', 'candy'],
  contentShape: 'title-grid',
};

export const theme04ValuechartV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '估值跃迁' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{OpenAI}} 估值三级跳' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从早期实验室到全球最高估值 AI 公司的跨越' },
    { key: 'name', label: '主体名称', type: 'text', inlineEditable: true, defaultValue: 'OpenAI' },
    {
      key: 'stages',
      label: '估值阶段',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '2021', value: '200 亿', description: '由 Microsoft 领投，开启商业化探索', tone: 'green' },
        { label: '2023', value: '860 亿', description: 'ChatGPT 引爆市场，员工回购估值飙升', tone: 'blue' },
        { label: '2024', value: '1570 亿', description: '新一轮融资巩固龙头地位', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'label', label: '阶段标签', type: 'text' },
        { key: 'value', label: '估值', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：公开融资报道整理 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-valuechart-title lp-rise">
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

export function Theme04ValuechartV1(props: Theme04ValuechartV1Props): ReactNode {
  const { kicker, title, subtitle, name, stages, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validStages = (stages || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-valuechart">
      <div className="lp-theme04-valuechart-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-valuechart-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {name && (
        <div className="lp-theme04-valuechart-name lp-rise">
          <EditableField prop="name" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-valuechart-name-text">{name}</EditableField>
        </div>
      )}

      <div className="lp-theme04-valuechart-stages lp-rise">
        {validStages.map((stage, idx) => (
          <div key={idx} className={`lp-theme04-valuechart-stage lp-theme04-card ${toneClass[stage.tone || 'green'] || ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
            <EditableField prop={`stages.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-valuechart-stage-label">{stage.label}</EditableField>
            <EditableField prop={`stages.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-valuechart-stage-value">{stage.value}</EditableField>
            {stage.description && (
              <EditableField prop={`stages.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-valuechart-stage-desc">{stage.description}</EditableField>
            )}
            {idx < validStages.length - 1 && (
              <div className="lp-theme04-valuechart-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-valuechart-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
