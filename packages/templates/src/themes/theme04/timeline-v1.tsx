// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04TimelineV1Phase {
  period: string;
  badge?: string;
  title: string;
  description?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04TimelineV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  phases?: Theme04TimelineV1Phase[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TimelineV1Meta: LayoutMeta = {
  id: 'theme04_timeline_v1',
  theme: 'theme04',
  role: 'timeline',
  displayName: 'Theme 04 阶段策略时间线',
  description: '顶部时间轴节点 + 三列玻璃卡片，适合阶段策略',
  needsMedia: false,
  tags: ['timeline', 'strategy', 'candy'],
  contentShape: 'three-phase-timeline',
};

export const theme04TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '投资展望 · 阶段性策略' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '分三步走，{{穿越周期}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不押注单点爆发，按时间窗口分阶段布局——用纪律穿越 AI 资本周期的起伏。' },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { period: '2025 - 2026', badge: '观察 IPO', title: '观察 IPO 窗口', description: '盯头部公司 IPO 表现；若 OpenAI / Anthropic 上市破发，警惕全行业估值回调。', tone: 'green' },
        { period: '2026 - 2027', badge: '收入曲线', title: '收入曲线验证', description: '关注垂直应用收入增长；优选 ARR ≥ 1 亿美元、续约率 > 120% 的标的。', tone: 'blue' },
        { period: '2027 年后', badge: '行业洗牌', title: '行业洗牌抄底', description: '若 AGI 突破未兑现，进入洗牌期，可逢低抄底被低估的技术资产。', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'period', label: '时间段', type: 'text' },
        { key: 'badge', label: '徽章', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-timeline-title lp-rise">
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

export function Theme04TimelineV1(props: Theme04TimelineV1Props): ReactNode {
  const { kicker, title, subtitle, phases, _slideIdx, _editable } = props;
  const safePhases = (phases ?? []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme04-timeline">
      <div className="lp-theme04-timeline-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-timeline-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-timeline-track lp-rise">
        <div className="lp-theme04-timeline-line" />
        {safePhases.map((phase, idx) => (
          <div key={idx} className="lp-theme04-timeline-node">
            <div className={`lp-theme04-timeline-dot lp-theme04-timeline-dot--${phase.tone ?? 'green'}`}>{idx + 1}</div>
            <EditableField prop={`phases.${idx}.period`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-timeline-period">{phase.period}</EditableField>
          </div>
        ))}
      </div>

      <div className="lp-theme04-timeline-grid lp-rise">
        {safePhases.map((phase, idx) => (
          <div key={idx} className={`lp-theme04-timeline-card lp-theme04-card lp-theme04-card--${phase.tone ?? 'green'}`}>
            <div className="lp-theme04-timeline-card-number">{String(idx + 1).padStart(2, '0')}</div>
            {phase.badge && <span className="lp-theme04-timeline-badge">{phase.badge}</span>}
            <EditableField prop={`phases.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-timeline-card-title">{phase.title}</EditableField>
            {phase.description && (
              <EditableField prop={`phases.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-timeline-card-desc">{phase.description}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
