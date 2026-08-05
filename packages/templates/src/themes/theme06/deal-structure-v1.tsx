// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06DealStructureV1StructureItem {
  label?: string;
  percentage?: number;
}

export interface Theme06DealStructureV1Party {
  role?: string;
  name?: string;
}

export interface Theme06DealStructureV1Highlight {
  value?: string;
  label?: string;
}

export interface Theme06DealStructureV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  dealName?: string;
  buyer?: string;
  target?: string;
  value?: string;
  valuation?: string;
  structure?: Theme06DealStructureV1StructureItem[];
  parties?: Theme06DealStructureV1Party[];
  highlights?: Theme06DealStructureV1Highlight[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06DealStructureV1Meta: LayoutMeta = {
  id: 'theme06_deal_structure_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 交易结构',
  description: '展示并购/交易的关键参与方、对价结构与核心条款',
  needsMedia: true,
  tags: ['deal', 'structure', 'm&a', 'atlas'],
  contentShape: 'summary',
};

export const theme06DealStructureV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL STRUCTURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '交易结构与关键条款' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '拆解一桩标志性并购案的参与方与对价构成' },
    { key: 'dealName', label: '交易名称', type: 'text', inlineEditable: true, defaultValue: 'Alpha 收购 Beta' },
    { key: 'buyer', label: '买方', type: 'text', inlineEditable: true, defaultValue: 'Alpha Corp' },
    { key: 'target', label: '标的', type: 'text', inlineEditable: true, defaultValue: 'Beta Inc' },
    { key: 'value', label: '交易金额', type: 'text', inlineEditable: true, defaultValue: '$12.5B' },
    { key: 'valuation', label: '估值倍数', type: 'text', inlineEditable: true, defaultValue: 'EV/Revenue 8.2x' },
    {
      key: 'structure',
      label: '对价结构',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '现金', percentage: 55 },
        { label: '股票', percentage: 35 },
        { label: '债务承担', percentage: 10 },
      ],
      itemSchema: [
        { key: 'label', label: '形式', type: 'text', inlineEditable: true },
        { key: 'percentage', label: '占比（%）', type: 'number' },
      ],
    },
    {
      key: 'parties',
      label: '交易参与方',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { role: '买方顾问', name: '高盛' },
        { role: '标的顾问', name: '摩根士丹利' },
        { role: '法律顾问', name: '世达' },
        { role: '财务尽调', name: '德勤' },
      ],
      itemSchema: [
        { key: 'role', label: '角色', type: 'text', inlineEditable: true },
        { key: 'name', label: '机构', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'highlights',
      label: '核心条款',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '30 天', label: '独家谈判期' },
        { value: '$500M', label: '分手费' },
        { value: '监管', label: '需反垄断审批' },
        { value: 'Q4', label: '预计交割' },
      ],
      itemSchema: [
        { key: 'value', label: '值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '股票对价占比高意味着双方对未来协同效应有较强共识，监管审批是最大不确定性。' },
  ],
};

export function Theme06DealStructureV1(props: Theme06DealStructureV1Props): ReactNode {
  const {
    kicker,
    title,
    subtitle,
    dealName,
    buyer,
    target,
    value,
    valuation,
    structure = [],
    parties = [],
    highlights = [],
    insight,
    _slideIdx,
    _editable,
  } = props;
  const validStructure = (structure || []).filter((s): s is Theme06DealStructureV1StructureItem => s != null).slice(0, 4);
  const validParties = (parties || []).filter((p): p is Theme06DealStructureV1Party => p != null).slice(0, 4);
  const validHighlights = (highlights || []).filter((h): h is Theme06DealStructureV1Highlight => h != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-deal-structure">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-deal-structure-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-deal-structure-body lp-rise">
        <div className="lp-theme06-deal-structure-main">
          <div className="lp-theme06-deal-structure-hero">
            {dealName && (
              <EditableField prop="dealName" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-deal-structure-name">{dealName}</EditableField>
            )}
            <div className="lp-theme06-deal-structure-parties">
              {buyer && <span>{buyer}</span>}
              <span className="lp-theme06-deal-structure-arrow">→</span>
              {target && <span>{target}</span>}
            </div>
            <div className="lp-theme06-deal-structure-value">{value || ''}</div>
            {valuation && <div className="lp-theme06-deal-structure-valuation">{valuation}</div>}
          </div>

          {validStructure.length > 0 && (
            <div className="lp-theme06-deal-structure-breakdown">
              <div className="lp-theme06-deal-structure-bar">
                {validStructure.map((item, index) => (
                  <div
                    key={index}
                    className={`lp-theme06-deal-structure-segment seg-${index + 1}`}
                    style={{ flex: Number(item.percentage) || 0 }}
                  />
                ))}
              </div>
              <div className="lp-theme06-deal-structure-legend">
                {validStructure.map((item, index) => (
                  <div key={index} className="lp-theme06-deal-structure-legend-item">
                    <span className={`lp-theme06-deal-structure-dot seg-${index + 1}`} />
                    <span>{item.label || ''}</span>
                    <span className="lp-theme06-deal-structure-pct">{item.percentage || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lp-theme06-deal-structure-aside">
          {validParties.length > 0 && (
            <div className="lp-theme06-deal-structure-advisors">
              {validParties.map((item, index) => (
                <div key={index} className="lp-theme06-deal-structure-advisor">
                  <div className="lp-theme06-deal-structure-advisor-role">{item.role || ''}</div>
                  <div className="lp-theme06-deal-structure-advisor-name">{item.name || ''}</div>
                </div>
              ))}
            </div>
          )}
          {validHighlights.length > 0 && (
            <div className="lp-theme06-deal-structure-highlights">
              {validHighlights.map((item, index) => (
                <div key={index} className="lp-theme06-deal-structure-highlight">
                  <div className="lp-theme06-deal-structure-highlight-value">{item.value || ''}</div>
                  <div className="lp-theme06-deal-structure-highlight-label">{item.label || ''}</div>
                </div>
              ))}
            </div>
          )}
          {insight && (
            <div className="lp-theme06-deal-structure-insight">
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
