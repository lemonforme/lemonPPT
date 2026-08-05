// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export type Theme05RoadmapV1Scheme = 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';

export interface Theme05RoadmapV1Phase {
  title: string;
  period: string;
  description?: string;
  scheme?: Theme05RoadmapV1Scheme;
}

export interface Theme05RoadmapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  phases?: Theme05RoadmapV1Phase[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05RoadmapV1Meta: LayoutMeta = {
  id: 'theme05_roadmap_v1',
  theme: 'theme05',
  role: 'process',
  displayName: 'Theme 05 路线图',
  description: '横向时间轴式路线图，3-4 个光谱阶段节点',
  needsMedia: false,
  tags: ['process', 'roadmap', 'spectrum'],
  contentShape: 'horizontal-roadmap',
};

export const theme05RoadmapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ROADMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '未来三年落地路线图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从试点验证到规模推广，分阶段推进。' },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      minItems: 3,
      maxItems: 4,
      defaultValue: [
        { title: '试点验证', period: '2025 Q1', description: '聚焦核心场景，完成 MVP 验证与效果评估。', scheme: 'coral' },
        { title: '工具集成', period: '2025 Q2-Q3', description: '嵌入现有工作流，建立标准化交付模板。', scheme: 'amber' },
        { title: '规模推广', period: '2025 Q4', description: '复制到全团队，沉淀最佳实践与培训体系。', scheme: 'teal' },
        { title: '持续运营', period: '2026 起', description: '建立数据监测与迭代机制，保持长期增长。', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'title', label: '阶段标题', type: 'text', inlineEditable: true },
        { key: 'period', label: '时间段', type: 'text', inlineEditable: true },
        { key: 'description', label: '阶段说明', type: 'textarea', inlineEditable: true },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
  ],
};

const schemeClass: Record<string, string> = {
  coral: 'lp-theme05-roadmap-card--coral',
  amber: 'lp-theme05-roadmap-card--amber',
  teal: 'lp-theme05-roadmap-card--teal',
  indigo: 'lp-theme05-roadmap-card--indigo',
  violet: 'lp-theme05-roadmap-card--violet',
};

const nodeSchemeClass: Record<string, string> = {
  coral: 'lp-theme05-roadmap-node--coral',
  amber: 'lp-theme05-roadmap-node--amber',
  teal: 'lp-theme05-roadmap-node--teal',
  indigo: 'lp-theme05-roadmap-node--indigo',
  violet: 'lp-theme05-roadmap-node--violet',
};

export function Theme05RoadmapV1(props: Theme05RoadmapV1Props): ReactNode {
  const { kicker, title, subtitle, phases = [], _slideIdx, _editable } = props;
  const validPhases = (phases || []).filter((p): p is Theme05RoadmapV1Phase => p != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-roadmap">
      <div className="lp-theme05-roadmap-head lp-rise">
        {kicker && (
          <div className="lp-theme05-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">
          {title}
        </EditableField>
        <div className="lp-theme05-underline" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>

      {validPhases.length > 0 && (
        <div className="lp-theme05-roadmap-track lp-rise">
          <div className="lp-theme05-roadmap-line" aria-hidden="true" />
          {validPhases.map((phase, index) => {
            const scheme = phase.scheme || 'coral';
            return (
              <div key={index} className="lp-theme05-roadmap-step" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`lp-theme05-roadmap-node ${nodeSchemeClass[scheme] || ''}`}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className={`lp-theme05-roadmap-card lp-theme05-card ${schemeClass[scheme] || ''}`}>
                  <EditableField
                    prop={`phases.${index}.period`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-theme05-roadmap-period"
                  >
                    {phase.period}
                  </EditableField>
                  <EditableField
                    prop={`phases.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme05-roadmap-step-title"
                  >
                    {phase.title}
                  </EditableField>
                  {phase.description && (
                    <EditableField
                      prop={`phases.${index}.description`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-theme05-roadmap-step-description"
                    >
                      {phase.description}
                    </EditableField>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
