// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06TechLandscapeV1Topic {
  title: string;
  description?: string;
  value?: string;
  accent?: boolean;
}

export interface Theme06TechLandscapeV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  topics?: Theme06TechLandscapeV1Topic[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06TechLandscapeV1Meta: LayoutMeta = {
  id: 'theme06_tech_landscape_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 技术全景',
  description: '3 列 Bento 网格展示技术栈或能力全景',
  needsMedia: true,
  tags: ['tech', 'landscape', 'bento', 'overview', 'atlas'],
  contentShape: 'summary',
};

export const theme06TechLandscapeV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TECH LANDSCAPE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 应用栈全景图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从基础设施到终端应用的六层能力矩阵' },
    {
      key: 'topics',
      label: '技术模块',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { title: '基础模型', description: '大参数预训练模型提供通用语义与推理能力', value: 'L0', accent: true },
        { title: '领域微调', description: '针对行业数据做 RLHF 与知识注入', value: 'L1', accent: false },
        { title: '工具编排', description: 'Agent、RAG、函数调用构建可执行工作流', value: 'L2', accent: false },
        { title: '应用界面', description: '聊天、Copilot、嵌入式组件等多端交互', value: 'L3', accent: true },
        { title: '评估治理', description: '安全护栏、评测集、合规审计与版本控制', value: 'L4', accent: false },
        { title: '运营观测', description: '成本、延迟、质量与反馈闭环监控', value: 'L5', accent: false },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '层级/编号', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
  ],
};

export function Theme06TechLandscapeV1(props: Theme06TechLandscapeV1Props): ReactNode {
  const { kicker, title, subtitle, topics = [], _slideIdx, _editable } = props;
  const validTopics = (topics || []).filter((t): t is Theme06TechLandscapeV1Topic => t != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-tech-landscape">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-tech-landscape-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-tech-landscape-grid lp-rise">
        {validTopics.map((topic, index) => (
          <div
            key={index}
            className={`lp-theme06-tech-landscape-cell ${topic.accent ? 'accent' : ''}`}
            style={{ animationDelay: `${index * 80}ms` } as React.CSSProperties}
          >
            {topic.value && <div className="lp-theme06-tech-landscape-number">{topic.value}</div>}
            <EditableField
              prop={`topics.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-theme06-tech-landscape-cell-title"
            >
              {topic.title}
            </EditableField>
            {topic.description && (
              <EditableField
                prop={`topics.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme06-tech-landscape-cell-desc"
              >
                {topic.description}
              </EditableField>
            )}
          </div>
        ))}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
