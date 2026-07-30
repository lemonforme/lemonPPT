// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04MetroV1Stop {
  label?: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04MetroV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  lineLabel?: string;
  stops?: Theme04MetroV1Stop[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04MetroV1Meta: LayoutMeta = {
  id: 'theme04_metro_v1',
  theme: 'theme04',
  role: 'process',
  displayName: 'Theme 04 资本地铁线',
  description: '地铁线路式流程图，展示关键站点与阶段目标',
  needsMedia: false,
  tags: ['process', 'metro', 'timeline', 'candy'],
  contentShape: 'horizontal-steps',
};

export const theme04MetroV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '融资路线' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{资本}}流动的地铁图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从种子轮到 IPO，每一站都是价值验证的里程碑。' },
    { key: 'lineLabel', label: '线路名', type: 'text', inlineEditable: true, defaultValue: 'AI 独角兽专线' },
    {
      key: 'stops',
      label: '站点',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '种子轮', description: '产品原型与早期用户验证', tone: 'green' },
        { label: 'A 轮', description: '商业模式验证，核心团队成型', tone: 'blue' },
        { label: 'B 轮', description: '规模化获客与收入高速增长', tone: 'pink' },
        { label: 'C 轮', description: '市场领导地位与生态布局', tone: 'yellow' },
        { label: 'IPO', description: '公开市场与全球化扩张', tone: 'green' },
      ],
      itemSchema: [
        { key: 'label', label: '站点名称', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 资本研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-metro-title lp-rise">
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

export function Theme04MetroV1(props: Theme04MetroV1Props): ReactNode {
  const { kicker, title, subtitle, lineLabel, stops, footnote, _slideIdx, _editable } = props;
  const safeStops = (stops || []).filter((s) => s != null).slice(0, 6);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-metro">
      <div className="lp-theme04-metro-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-metro-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {safeStops.length > 0 && (
        <div className="lp-theme04-metro-line-wrap lp-rise">
          {lineLabel && (
            <div className="lp-theme04-metro-line-badge">
              <EditableField prop="lineLabel" slideIdx={_slideIdx} editable={_editable} as="span">{lineLabel}</EditableField>
            </div>
          )}
          <div className="lp-theme04-metro-line" />
          <div className="lp-theme04-metro-stops">
            {safeStops.map((stop, idx) => (
              <div key={idx} className={`lp-theme04-metro-stop ${toneClass[stop.tone || 'green'] || ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="lp-theme04-metro-stop-dot">
                  <span className="lp-theme04-metro-stop-ring" />
                  <span className="lp-theme04-metro-stop-inner" />
                </div>
                <div className="lp-theme04-metro-stop-card lp-theme04-card">
                  {stop.label && (
                    <EditableField prop={`stops.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-metro-stop-label">{stop.label}</EditableField>
                  )}
                  {stop.description && (
                    <EditableField prop={`stops.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-metro-stop-description">{stop.description}</EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metro-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
