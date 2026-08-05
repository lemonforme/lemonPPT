// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06RiskV2Item {
  number?: string;
  risk: string;
  level?: 'high' | 'medium' | 'low' | string;
  response?: string;
  meta?: string;
}

export interface Theme06RiskV2Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06RiskV2Item[];
  insight?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RiskV2Meta: LayoutMeta = {
  id: 'theme06_risk_v2',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 风险研判 v2',
  description: '左侧编号风险卡片 + 右侧 DROP IMAGE 占位区与传导说明',
  needsMedia: true,
  tags: ['risk', 'analysis', 'atlas'],
  contentShape: 'title-grid',
};

export const theme06RiskV2Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '右侧主视觉图片', type: 'image' },
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
        { number: '01', risk: '估值回调', level: 'high', response: '优先持有收入可验证资产，减少纯叙事敞口。', meta: 'HIGH / 高风险' },
        { number: '02', risk: '监管收紧', level: 'medium', response: '布局合规工具链与模型审计能力。', meta: 'MEDIUM / 中风险' },
        { number: '03', risk: '技术迭代', level: 'high', response: '保持模型接口弹性，避免单点绑定。', meta: 'HIGH / 高风险' },
        { number: '04', risk: '人才竞争', level: 'medium', response: '构建内部 AI 卓越中心，降低外部依赖。', meta: 'MEDIUM / 中风险' },
      ],
      itemSchema: [
        { key: 'number', label: '编号', type: 'text', inlineEditable: true },
        { key: 'risk', label: '风险', type: 'text', inlineEditable: true },
        { key: 'level', label: '等级', type: 'select', defaultValue: 'medium', options: [{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }] },
        { key: 'response', label: '应对策略', type: 'textarea', inlineEditable: true },
        { key: 'meta', label: '底部元数据', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '右侧传导说明', type: 'textarea', inlineEditable: true, defaultValue: '四类风险相互传导：估值回调会加剧人才流失，监管收紧则提高合规成本，需建立联动缓冲机制。' },
    { key: 'footnote', label: '底部总标注', type: 'text', inlineEditable: true, defaultValue: '4 项风险 / 4 RISKS' },
  ],
};

function levelClass(level?: string): string {
  if (level === 'high') return 'lp-theme06-risk-v2-item--high';
  if (level === 'low') return 'lp-theme06-risk-v2-item--low';
  return 'lp-theme06-risk-v2-item--medium';
}

function levelLabel(level?: string): string {
  if (level === 'high') return '高风险';
  if (level === 'low') return '低风险';
  return '中风险';
}

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function Theme06RiskV2(props: Theme06RiskV2Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, items = [], insight, footnote, _slideIdx, _editable } = props;
  const validItems = (items || [])
    .filter((item): item is Theme06RiskV2Item => item != null && typeof item.risk === 'string')
    .slice(0, 4);
  const footnoteParts = splitBilingual(footnote);

  return (
    <div className="lp-slide lp-theme06-risk-v2">
      <Theme06SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />

      <div className="lp-theme06-risk-v2-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-risk-v2-body">
        <div className="lp-theme06-risk-v2-list lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className={`lp-theme06-card lp-theme06-risk-v2-item ${levelClass(item.level)}`}>
              <div className="lp-theme06-risk-v2-item-main">
                <div className="lp-theme06-risk-v2-item-number">{item.number || String(index + 1).padStart(2, '0')}</div>
                <div className="lp-theme06-risk-v2-item-content">
                  <div className="lp-theme06-risk-v2-item-title">
                    <EditableField prop={`items.${index}.risk`} slideIdx={_slideIdx} editable={_editable} as="h3">{item.risk}</EditableField>
                  </div>
                  <div className="lp-theme06-risk-v2-item-level">{levelLabel(item.level)}</div>
                  {item.response && (
                    <div className="lp-theme06-risk-v2-item-response">
                      <EditableField prop={`items.${index}.response`} slideIdx={_slideIdx} editable={_editable} as="p">{item.response}</EditableField>
                    </div>
                  )}
                </div>
              </div>
              {item.meta && <div className="lp-theme06-card-meta">{item.meta}</div>}
            </div>
          ))}
        </div>

        <div className="lp-theme06-risk-v2-aside lp-rise">
          <div className="lp-theme06-risk-v2-dropzone">
            <LpEditableImage
              prop="imageUrl"
              src={imageUrl}
              slideIdx={_slideIdx}
              editable={_editable}
              className="lp-theme06-risk-v2-img"
              placeholderClassName="lp-theme06-risk-v2-placeholder"
              placeholderText="DROP IMAGE"
            />
          </div>
          {insight && (
            <div className="lp-theme06-risk-v2-insight">
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
