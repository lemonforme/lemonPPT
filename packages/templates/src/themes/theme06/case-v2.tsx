// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06CaseV2Item {
  number?: string;
  title: string;
  description?: string;
  meta?: string;
}

export interface Theme06CaseV2Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  items?: Theme06CaseV2Item[];
  insight?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CaseV2Meta: LayoutMeta = {
  id: 'theme06_case_v2',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 典型案例 v2',
  description: '左侧编号案例卡片 + 右侧 DROP IMAGE 占位区与公司/传导说明',
  needsMedia: true,
  tags: ['case', 'study', 'atlas'],
  contentShape: 'case-study',
};

export const theme06CaseV2Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '右侧主视觉图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求到落地的完整闭环' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'Anthropic' },
    { key: 'tagline', label: '一句话说明', type: 'textarea', inlineEditable: true, defaultValue: '用 Constitutional AI 构建更可解释、更可控的大模型。' },
    {
      key: 'items',
      label: '案例分段',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { number: '01', title: '挑战', description: '如何在快速扩张的同时保持 AI 系统的安全性与可控性。', meta: 'CHALLENGE / 挑战' },
        { number: '02', title: '方案', description: '引入 Constitutional AI，通过自我监督与反馈机制训练更可解释的大模型。', meta: 'SOLUTION / 方案' },
        { number: '03', title: '成果', description: '在一年内完成多轮大额融资，估值跃升至全球 AI 初创公司首位。', meta: 'RESULT / 成果' },
        { number: '04', title: '启示', description: '安全与性能并非零和，结构化反馈可成为核心竞争壁垒。', meta: 'INSIGHT / 启示' },
      ],
      itemSchema: [
        { key: 'number', label: '编号', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'meta', label: '底部元数据', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '右侧传导说明', type: 'textarea', inlineEditable: true, defaultValue: '案例验证：安全优先的产品叙事在资本寒冬中仍能获得溢价估值。' },
    { key: 'footnote', label: '底部总标注', type: 'text', inlineEditable: true, defaultValue: '4 段 / FLOW' },
  ],
};

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function Theme06CaseV2(props: Theme06CaseV2Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, company, tagline, items = [], insight, footnote, _slideIdx, _editable } = props;
  const validItems = (items || [])
    .filter((item): item is Theme06CaseV2Item => item != null && typeof item.title === 'string')
    .slice(0, 4);
  const footnoteParts = splitBilingual(footnote);

  return (
    <div className="lp-slide lp-theme06-case-v2">
      <Theme06SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />

      <div className="lp-theme06-case-v2-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-case-v2-body">
        <div className="lp-theme06-case-v2-list lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className="lp-theme06-card lp-theme06-case-v2-item">
              <div className="lp-theme06-case-v2-item-main">
                <div className="lp-theme06-case-v2-item-number">{item.number || String(index + 1).padStart(2, '0')}</div>
                <div className="lp-theme06-case-v2-item-content">
                  <div className="lp-theme06-case-v2-item-title">
                    <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3">{item.title}</EditableField>
                  </div>
                  {item.description && (
                    <div className="lp-theme06-case-v2-item-desc">
                      <EditableField prop={`items.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p">{item.description}</EditableField>
                    </div>
                  )}
                </div>
              </div>
              {item.meta && <div className="lp-theme06-card-meta">{item.meta}</div>}
            </div>
          ))}
        </div>

        <div className="lp-theme06-case-v2-aside lp-rise">
          <div className="lp-theme06-case-v2-dropzone">
            <LpEditableImage
              prop="imageUrl"
              src={imageUrl}
              slideIdx={_slideIdx}
              editable={_editable}
              className="lp-theme06-case-v2-img"
              placeholderClassName="lp-theme06-case-v2-placeholder"
              placeholderText="DROP IMAGE"
            />
          </div>
          <div className="lp-theme06-case-v2-hero">
            {company && (
              <div className="lp-theme06-case-v2-company">
                <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="div">{company}</EditableField>
              </div>
            )}
            {tagline && (
              <div className="lp-theme06-case-v2-tagline">
                <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p">{tagline}</EditableField>
              </div>
            )}
          </div>
          {insight && (
            <div className="lp-theme06-case-v2-insight">
              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        {footnote ? (
          <div className="lp-theme06-footer-bilingual">
            {footnoteParts.cn && (
              <span className="lp-theme06-footer-cn">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.cn}</EditableField>
              </span>
            )}
            {footnoteParts.en && (
              <span className="lp-theme06-footer-en">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.en}</EditableField>
              </span>
            )}
          </div>
        ) : (
          <>
            <span className="lp-theme06-footer-left" />
            <span className="lp-theme06-footer-right" />
          </>
        )}
      </div>
    </div>
  );
}
