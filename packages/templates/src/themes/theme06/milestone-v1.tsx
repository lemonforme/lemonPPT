// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MilestoneV1Milestone {
  date?: string;
  title?: string;
  value?: string;
  status?: string;
  description?: string;
  focus?: boolean;
}

export interface Theme06MilestoneV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  milestones?: Theme06MilestoneV1Milestone[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MilestoneV1Meta: LayoutMeta = {
  id: 'theme06_milestone_v1',
  theme: 'theme06',
  role: 'timeline',
  displayName: 'Theme 06 里程碑时间轴',
  description: '横向里程碑时间轴，适合 IPO、融资或产品路线图',
  needsMedia: true,
  tags: ['milestone', 'timeline', 'roadmap', 'atlas'],
  contentShape: 'timeline',
};

export const theme06MilestoneV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MILESTONES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从初创到 IPO 的关键节点' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '五年内的融资、产品与商业化里程碑' },
    {
      key: 'milestones',
      label: '里程碑',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { date: '2021', title: '公司成立', value: 'Seed', status: '已完成', description: '完成核心团队组建与产品原型' },
        { date: '2022', title: '产品发布', value: 'Series A', status: '已完成', description: '首个商业版本上线，签约 10 家客户' },
        { date: '2023', title: '规模化', value: 'Series B', status: '已完成', description: '年收入突破 1 亿元，团队扩张至 200 人' },
        { date: '2024', title: '全球化', value: 'Series C', status: '已完成', description: '进入亚太与欧洲市场' },
        { date: '2026', title: 'IPO', value: 'NASDAQ', status: '进行中', focus: true, description: '预计 Q3 挂牌上市' },
      ],
      itemSchema: [
        { key: 'date', label: '日期', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值/轮次', type: 'text', inlineEditable: true },
        { key: 'status', label: '状态', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'focus', label: '高亮', type: 'boolean' },
      ],
    },
  ],
};

export function Theme06MilestoneV1(props: Theme06MilestoneV1Props): ReactNode {
  const { kicker, title, subtitle, milestones = [], _slideIdx, _editable } = props;
  const validMilestones = (milestones || []).filter((m): m is Theme06MilestoneV1Milestone => m != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-milestone">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-milestone-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-milestone-body lp-rise">
        <div className="lp-theme06-milestone-track">
          {validMilestones.map((milestone, index) => (
            <div
              key={index}
              className={`lp-theme06-milestone-item ${milestone.focus ? 'focus' : ''}`}
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="lp-theme06-milestone-dot">{String(index + 1).padStart(2, '0')}</div>
              {milestone.date && <div className="lp-theme06-milestone-date">{milestone.date}</div>}
              {milestone.title && (
                <EditableField prop={`milestones.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-milestone-title">{milestone.title}</EditableField>
              )}
              {milestone.value && <div className="lp-theme06-milestone-value">{milestone.value}</div>}
              {milestone.description && (
                <EditableField prop={`milestones.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-milestone-desc">{milestone.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
