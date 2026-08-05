// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ProcessV2Step {
  title: string;
  description?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05ProcessV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme05ProcessV2Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ProcessV2Meta: LayoutMeta = {
  id: 'theme05_process_v2',
  theme: 'theme05',
  role: 'process',
  displayName: 'Theme 05 垂直流程 V2',
  description: '4-6 步垂直卡片流程，步骤间用箭头连接',
  needsMedia: false,
  tags: ['process', 'workflow', 'vertical'],
  contentShape: 'vertical-steps',
};

export const theme05ProcessV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '实施路径' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四步让 {{AI 助手}} 融入工作流' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求识别到规模推广，构建可复用的落地路径' },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '需求识别', description: '梳理高频、高价值的重复性工作场景。', scheme: 'coral' },
        { title: '原型验证', description: '用小范围试点验证模型能力与提效空间。', scheme: 'amber' },
        { title: '工具集成', description: '嵌入现有工作流，降低使用门槛。', scheme: 'teal' },
        { title: '规模推广', description: '沉淀模板与最佳实践，复制到全团队。', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
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

function schemeClass(scheme?: string): string {
  return `lp-theme05-process-v2-step--${scheme || 'coral'}`;
}

export function Theme05ProcessV2(props: Theme05ProcessV2Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme05ProcessV2Step => s != null && !!s.title).slice(0, 6);

  return (
    <div className="lp-slide lp-theme05-process-v2">
      <div className="lp-theme05-process-v2-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validSteps.length > 0 && (
        <div className="lp-theme05-process-v2-track lp-rise">
          {validSteps.map((step, index) => (
            <div key={index} className={`lp-theme05-process-v2-step ${schemeClass(step.scheme)}`} style={{ animationDelay: `${index * 80}ms` }}>
              <div className="lp-theme05-process-v2-node">
                <span className="lp-theme05-process-v2-node-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="lp-theme05-process-v2-card">
                <EditableField
                  prop={`steps.${index}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-theme05-process-v2-step-title"
                >
                  {step.title}
                </EditableField>
                {step.description && (
                  <EditableField
                    prop={`steps.${index}.description`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-theme05-process-v2-step-description"
                  >
                    {step.description}
                  </EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
