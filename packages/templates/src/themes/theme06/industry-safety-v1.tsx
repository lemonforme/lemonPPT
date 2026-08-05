// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IndustrySafetyV1Risk {
  category?: string;
  level?: 'high' | 'medium' | 'low' | string;
  description?: string;
}

export interface Theme06IndustrySafetyV1Control {
  title?: string;
  status?: '已部署' | '进行中' | '规划中' | string;
}

export interface Theme06IndustrySafetyV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  risks?: Theme06IndustrySafetyV1Risk[];
  controls?: Theme06IndustrySafetyV1Control[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IndustrySafetyV1Meta: LayoutMeta = {
  id: 'theme06_industry_safety_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 安全合规专题',
  description: '展示安全风险类别、等级与对应控制措施',
  needsMedia: true,
  tags: ['industry', 'safety', 'compliance', 'atlas'],
  contentShape: 'summary',
};

export const theme06IndustrySafetyV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SAFETY SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 安全与合规框架' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从模型安全到数据治理，构建可信 AI 基础设施' },
    {
      key: 'risks',
      label: '风险类别',
      type: 'array',
      minItems: 3,
      maxItems: 4,
      defaultValue: [
        { category: '提示注入', level: 'high', description: '恶意提示绕过安全护栏，导致输出有害内容。' },
        { category: '数据泄露', level: 'high', description: '训练数据或上下文中的敏感信息被泄露。' },
        { category: '幻觉风险', level: 'medium', description: '模型生成看似合理但事实错误的内容。' },
        { category: '版权争议', level: 'medium', description: '训练语料与生成结果引发知识产权纠纷。' },
      ],
      itemSchema: [
        { key: 'category', label: '风险', type: 'text', inlineEditable: true },
        { key: 'level', label: '等级', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
    {
      key: 'controls',
      label: '控制措施',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '输入输出过滤', status: '已部署' },
        { title: '敏感数据脱敏', status: '已部署' },
        { title: '模型审计日志', status: '进行中' },
        { title: '合规评估报告', status: '规划中' },
      ],
      itemSchema: [
        { key: 'title', label: '措施', type: 'text', inlineEditable: true },
        { key: 'status', label: '状态', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '安全不是一次性工程，而是贯穿模型训练、部署与运营的全生命周期治理。' },
  ],
};

function levelClass(level?: string): string {
  if (!level) return '';
  const normalized = String(level).toLowerCase();
  if (normalized.includes('high') || normalized.includes('高')) return 'high';
  if (normalized.includes('medium') || normalized.includes('中')) return 'medium';
  if (normalized.includes('low') || normalized.includes('低')) return 'low';
  return '';
}

function statusClass(status?: string): string {
  if (!status) return '';
  const normalized = String(status).toLowerCase();
  if (normalized.includes('已部署') || normalized.includes('done') || normalized.includes('deployed')) return 'done';
  if (normalized.includes('进行中') || normalized.includes('progress')) return 'progress';
  return 'planned';
}

export function Theme06IndustrySafetyV1(props: Theme06IndustrySafetyV1Props): ReactNode {
  const { kicker, title, subtitle, risks = [], controls = [], insight, _slideIdx, _editable } = props;
  const validRisks = (risks || []).filter((r): r is Theme06IndustrySafetyV1Risk => r != null).slice(0, 4);
  const validControls = (controls || []).filter((c): c is Theme06IndustrySafetyV1Control => c != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-industry-safety">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-industry-safety-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-industry-safety-body lp-rise">
        <div className="lp-theme06-industry-safety-risks">
          {validRisks.map((item, index) => (
            <div key={index} className={`lp-theme06-industry-safety-risk ${levelClass(item.level)}`}>
              <div className="lp-theme06-industry-safety-risk-header">
                <EditableField prop={`risks.${index}.category`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-safety-risk-category">{item.category || ''}</EditableField>
                <span className="lp-theme06-industry-safety-risk-level">{item.level || ''}</span>
              </div>
              {item.description && (
                <EditableField prop={`risks.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-safety-risk-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>

        <div className="lp-theme06-industry-safety-aside">
          <div className="lp-theme06-industry-safety-controls">
            {validControls.map((item, index) => (
              <div key={index} className={`lp-theme06-industry-safety-control ${statusClass(item.status)}`}>
                <EditableField prop={`controls.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-safety-control-title">{item.title || ''}</EditableField>
                <span className="lp-theme06-industry-safety-control-status">{item.status || ''}</span>
              </div>
            ))}
          </div>
          {insight && (
            <div className="lp-theme06-industry-safety-insight">
              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
            </div>
          )}
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
