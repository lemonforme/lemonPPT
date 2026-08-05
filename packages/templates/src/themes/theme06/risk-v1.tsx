// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06RiskV1Item {
  risk?: string;
  level?: 'high' | 'medium' | 'low' | string;
  response?: string;
}

export interface Theme06RiskV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06RiskV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RiskV1Meta: LayoutMeta = {
  id: 'theme06_risk_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 风险研判',
  description: '2×2 风险矩阵，按等级着色并给出应对策略',
  needsMedia: true,
  tags: ['risk', 'analysis', 'atlas'],
  contentShape: 'title-grid',
};

export const theme06RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RISK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键风险与应对' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别潜在不确定性，提前准备缓冲方案。' },
    {
      key: 'items',
      label: '风险项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { risk: '估值回调', level: 'high', response: '优先持有收入可验证资产，减少纯叙事敞口。' },
        { risk: '监管收紧', level: 'medium', response: '布局合规工具链与模型审计能力。' },
        { risk: '技术迭代', level: 'high', response: '保持模型接口弹性，避免单点绑定。' },
        { risk: '人才竞争', level: 'medium', response: '构建内部 AI 卓越中心，降低外部依赖。' },
      ],
      itemSchema: [
        { key: 'risk', label: '风险', type: 'text' },
        { key: 'level', label: '等级', type: 'select', defaultValue: 'medium', options: [{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }] },
        { key: 'response', label: '应对策略', type: 'textarea' },
      ],
    },
    { key: 'footnote', label: '底部总标注', type: 'text', inlineEditable: true, defaultValue: '4 项风险 / 4 RISKS' },
  ],
};

function levelClass(level?: string): string {
  if (level === 'high') return 'high';
  if (level === 'low') return 'low';
  return 'medium';
}

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function Theme06RiskV1(props: Theme06RiskV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnote, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 4);
  const footnoteParts = splitBilingual(footnote);

  return (
    <div className="lp-slide lp-theme06-risk">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-risk-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme06-risk-grid lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className={`lp-theme06-risk-cell ${levelClass(item.level)}`}>
              <div className="lp-theme06-risk-title">
                <EditableField prop={`items.${index}.risk`} slideIdx={_slideIdx} editable={_editable} as="h3">{item.risk || ''}</EditableField>
              </div>
              <div className="lp-theme06-risk-level">{item.level === 'high' ? '高风险' : item.level === 'low' ? '低风险' : '中风险'}</div>
              {item.response && (
                <div className="lp-theme06-risk-desc">
                  <EditableField prop={`items.${index}.response`} slideIdx={_slideIdx} editable={_editable} as="p">{item.response}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
