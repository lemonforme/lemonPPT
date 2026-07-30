// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ChaintableV1TierItem {
  value: string;
}

export interface Theme04ChaintableV1Tier {
  layer: string;
  items: Theme04ChaintableV1TierItem[];
  value?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ChaintableV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  tiers?: Theme04ChaintableV1Tier[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChaintableV1Meta: LayoutMeta = {
  id: 'theme04_chaintable_v1',
  theme: 'theme04',
  role: 'table',
  displayName: 'Theme 04 产业链分层表',
  description: '产业链各层及代表企业/环节的玻璃卡片表格',
  needsMedia: false,
  tags: ['table', 'industry-chain', 'candy'],
  contentShape: 'data-table',
};

export const theme04ChaintableV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '产业链 · VALUE CHAIN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产业链{{分层}}结构' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从底层算力到上层应用，资本逐层向上传导' },
    {
      key: 'tiers',
      label: '产业链层级',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { layer: '底层算力', items: [{ value: 'GPU / TPU' }, { value: '云服务' }, { value: '数据中心' }], value: '45%', tone: 'blue' },
        { layer: '基础模型', items: [{ value: '大语言模型' }, { value: '多模态模型' }, { value: '开源模型' }], value: '28%', tone: 'green' },
        { layer: '开发工具', items: [{ value: '模型训练平台' }, { value: '推理框架' }, { value: '数据标注' }], value: '15%', tone: 'yellow' },
        { layer: '应用层', items: [{ value: 'AI 助手' }, { value: '行业 SaaS' }, { value: '内容生成' }], value: '12%', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'layer', label: '层级名称', type: 'text' },
        {
          key: 'items',
          label: '环节/企业',
          type: 'array',
          maxItems: 6,
          itemSchema: [{ key: 'value', label: '项', type: 'text' }],
        },
        { key: 'value', label: '占比/数值', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究整理' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-chaintable-title lp-rise">
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

const toneClass: Record<string, string> = {
  green: 'lp-theme04-chaintable-tier--green',
  pink: 'lp-theme04-chaintable-tier--pink',
  blue: 'lp-theme04-chaintable-tier--blue',
  yellow: 'lp-theme04-chaintable-tier--yellow',
};

export function Theme04ChaintableV1(props: Theme04ChaintableV1Props): ReactNode {
  const { kicker, title, subtitle, tiers = [], footnote, _slideIdx, _editable } = props;
  const validTiers = (tiers || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme04-chaintable">
      <div className="lp-theme04-chaintable-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chaintable-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-chaintable-wrap lp-rise">
        {validTiers.map((tier, idx) => (
          <div key={idx} className={`lp-theme04-chaintable-tier lp-theme04-card ${toneClass[tier.tone ?? 'green']}`}>
            <div className="lp-theme04-chaintable-tier-head">
              <EditableField prop={`tiers.${idx}.layer`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-chaintable-tier-title">{tier.layer}</EditableField>
              {tier.value && (
                <EditableField prop={`tiers.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-chaintable-tier-value">{tier.value}</EditableField>
              )}
            </div>
            <div className="lp-theme04-chaintable-tier-items">
              {(tier.items || []).slice(0, 6).map((item, itemIdx) => (
                <div key={itemIdx} className="lp-theme04-chaintable-tier-item">
                  <EditableField prop={`tiers.${idx}.items.${itemIdx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{typeof item === 'string' ? item : item?.value}</EditableField>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chaintable-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
