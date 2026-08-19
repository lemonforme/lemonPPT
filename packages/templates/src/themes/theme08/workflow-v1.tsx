// lemonPPT - theme08 黑金实验 · 嵌入流程
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface WorkflowStep {
  num: string;
  title: string;
  desc: string;
  tags?: string[];
}

export interface Theme08WorkflowV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: WorkflowStep[];
  timelineLabels?: string[]; // 底部时间轴标签
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08WorkflowV1Meta: LayoutMeta = {
  id: 'theme08_workflow_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 工作流',
  description: '横向步骤卡片 + 底部时间轴，适合管线/工作流嵌入',
  needsMedia: false,
  tags: ['workflow', 'process', 'steps', 'black-gold'],
  contentShape: 'process',
};

export const theme08WorkflowV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'WORKFLOW' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '嵌入流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { num: '①', title: '数据接入', desc: '通过标准化 API 和 SDK 将多源异构数据统一接入平台。', tags: ['RESTful', 'GraphQL'] },
        { num: '②', title: '处理引擎', desc: '分布式流批一体引擎，支持实时与离线双模式处理。', tags: ['Spark', 'Flink'] },
        { num: '③', title: '模型服务', desc: '模型训练、评估、部署全生命周期自动化管理。', tags: ['MLflow', 'K8s'] },
      ],
      itemSchema: [
        { key: 'num', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '描述', type: 'textarea' },
        { key: 'tags', label: '标签', type: 'array', itemSchema: [{ key: 'item', label: '标签', type: 'text' }] },
      ],
    },
    {
      key: 'timelineLabels',
      label: '时间轴标签',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: ['数据源', '处理', '服务', '输出'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '10' },
  ],
};

export function Theme08WorkflowV1(props: Theme08WorkflowV1Props): ReactNode {
  const {
    kicker, title, subtitle,
    steps = [],
    timelineLabels = [],
    footnoteLeft, footnoteRight,
    _slideIdx, _editable,
  } = props;
  const validSteps = (steps || []).slice(0, 5);
  const validTimeline = (timelineLabels || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme08 lp-theme08-workflow-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-workflow-body lp-rise">
            <div className="lp-theme08-workflow-steps">
              {validSteps.map((step, i) => (
                <div key={i} className="lp-theme08-workflow-step" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="lp-theme08-workflow-step-num"><EditableField prop={`steps.${i}.num`} slideIdx={_slideIdx} editable={_editable} as="span">{step.num}</EditableField></div>
                  <div className="lp-theme08-workflow-step-title"><EditableField prop={`steps.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{step.title}</EditableField></div>
                  <div className="lp-theme08-workflow-step-desc"><EditableField prop={`steps.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{step.desc}</EditableField></div>
                  {step.tags && step.tags.length > 0 && (
                    <div className="lp-theme08-workflow-step-tags">
                      {step.tags.map((t, ti) => (
                        <span key={ti} className="lp-theme08-workflow-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {validTimeline.length > 0 && (
              <div className="lp-theme08-workflow-timeline">
                {validTimeline.map((label, i) => (
                  <span key={i} className="lp-theme08-workflow-node">
                    {i > 0 && <span className="lp-theme08-workflow-line active" />}
                    <span className={`lp-theme08-workflow-dot${i === 0 ? ' active' : ''}`} />
                    <span className="lp-theme08-workflow-dot-label">{label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
