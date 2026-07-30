// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ProcessV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  steps?: Array<{ title?: string; description?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ProcessV1Meta: LayoutMeta = {
  id: 'theme04_process_v1',
  theme: 'theme04',
  role: 'process',
  displayName: 'Theme 04 糖果流程页',
  description: '横向步骤流程 + 糖果色编号节点 + 连接线 + 底部页脚',
  needsMedia: false,
  tags: ['process', 'workflow', 'candy'],
  contentShape: 'horizontal-steps',
};

export const theme04ProcessV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '实施路径' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '07' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI 助手落地 · 四步闭环' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四步让 {{AI 助手}} 融入工作流' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求识别到规模推广，构建可复用的落地路径' },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '需求识别', description: '梳理高频、高价值的重复性工作场景。' },
        { title: '原型验证', description: '用小范围试点验证模型能力与提效空间。' },
        { title: '工具集成', description: '嵌入现有工作流，降低使用门槛。' },
        { title: '规模推广', description: '沉淀模板与最佳实践，复制到全团队。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-process-title lp-rise">
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

export function Theme04ProcessV1(props: Theme04ProcessV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    steps = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validSteps = (steps || []).filter((s): s is { title?: string; description?: string } => s != null);

  return (
    <div className="lp-slide lp-theme04-process">
      <div className="lp-theme04-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-process-main">
        <div className="lp-theme04-process-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-process-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validSteps.length > 0 && (
          <div className="lp-theme04-process-track lp-rise">
            {validSteps.map((step, index) => (
              <div key={index} className="lp-theme04-process-step" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="lp-theme04-process-card lp-theme04-card">
                  <div className="lp-theme04-process-card-header">
                    <span className="lp-theme04-process-node-number">{String(index + 1).padStart(2, '0')}</span>
                    <EditableField
                      prop={`steps.${index}.title`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="h3"
                      className="lp-theme04-process-step-title"
                    >
                      {step.title}
                    </EditableField>
                  </div>
                  {step.description && (
                    <EditableField
                      prop={`steps.${index}.description`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-theme04-process-step-description"
                    >
                      {step.description}
                    </EditableField>
                  )}
                </div>
                {index < validSteps.length - 1 && <div className="lp-theme04-process-arrow" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
