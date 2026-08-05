// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MegadealsV1Deal {
  company?: string;
  buyer?: string;
  value?: string;
  date?: string;
  rationale?: string;
}

export interface Theme06MegadealsV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  heroValue?: string;
  heroLabel?: string;
  deals?: Theme06MegadealsV1Deal[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MegadealsV1Meta: LayoutMeta = {
  id: 'theme06_megadeals_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 大额交易',
  description: '展示市场中的重磅交易与背后的战略逻辑',
  needsMedia: true,
  tags: ['deals', 'megadeals', 'm&a', 'atlas'],
  contentShape: 'summary',
};

export const theme06MegadealsV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MEGADEALS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度重磅交易盘点' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '资本向头部集中，大额交易正在重塑产业格局' },
    { key: 'heroValue', label: '总交易金额', type: 'text', inlineEditable: true, defaultValue: '$86B' },
    { key: 'heroLabel', label: '金额说明', type: 'text', inlineEditable: true, defaultValue: 'TOP 10 交易总额' },
    {
      key: 'deals',
      label: '交易列表',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      defaultValue: [
        { company: 'Beta AI', buyer: 'Alpha Cloud', value: '$18.5B', date: '2026 Q1', rationale: '补齐模型层能力' },
        { company: 'Neural Chip', buyer: 'GPU Giant', value: '$12.0B', date: '2026 Q1', rationale: '掌控训练芯片供应链' },
        { company: 'Data Vault', buyer: 'Enterprise Soft', value: '$7.2B', date: '2026 Q2', rationale: '获取高质量行业数据' },
        { company: 'AutoDrive X', buyer: 'Mega Auto', value: '$5.8B', date: '2026 Q2', rationale: '加速自动驾驶落地' },
        { company: 'HealthLLM', buyer: 'Pharma Plus', value: '$4.5B', date: '2026 Q3', rationale: '拓展药物研发场景' },
      ],
      itemSchema: [
        { key: 'company', label: '标的公司', type: 'text', inlineEditable: true },
        { key: 'buyer', label: '买方', type: 'text', inlineEditable: true },
        { key: 'value', label: '金额', type: 'text', inlineEditable: true },
        { key: 'date', label: '时间', type: 'text', inlineEditable: true },
        { key: 'rationale', label: '战略逻辑', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '大额交易集中在模型、芯片与数据三大核心要素，买家更关注战略卡位而非短期财务回报。' },
  ],
};

export function Theme06MegadealsV1(props: Theme06MegadealsV1Props): ReactNode {
  const { kicker, title, subtitle, heroValue, heroLabel, deals = [], insight, _slideIdx, _editable } = props;
  const validDeals = (deals || []).filter((d): d is Theme06MegadealsV1Deal => d != null).slice(0, 5);

  return (
    <div className="lp-slide lp-theme06-megadeals">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-megadeals-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-megadeals-body lp-rise">
        <div className="lp-theme06-megadeals-hero">
          <div className="lp-theme06-megadeals-hero-value">{heroValue || ''}</div>
          {heroLabel && <div className="lp-theme06-megadeals-hero-label">{heroLabel}</div>}
          {insight && (
            <div className="lp-theme06-megadeals-insight">
              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
            </div>
          )}
        </div>

        <div className="lp-theme06-megadeals-list">
          {validDeals.map((item, index) => (
            <div key={index} className="lp-theme06-megadeals-item" data-index={String(index + 1).padStart(2, '0')}>
              <div className="lp-theme06-megadeals-item-main">
                <EditableField prop={`deals.${index}.company`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-megadeals-item-company">{item.company || ''}</EditableField>
                <div className="lp-theme06-megadeals-item-buyer">{item.buyer || ''}</div>
              </div>
              <div className="lp-theme06-megadeals-item-meta">
                <div className="lp-theme06-megadeals-item-value">{item.value || ''}</div>
                <div className="lp-theme06-megadeals-item-date">{item.date || ''}</div>
              </div>
              {item.rationale && (
                <EditableField prop={`deals.${index}.rationale`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-megadeals-item-rationale">{item.rationale}</EditableField>
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
