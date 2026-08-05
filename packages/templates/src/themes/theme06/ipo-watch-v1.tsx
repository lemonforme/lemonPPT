// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IpoWatchV1Company {
  name?: string;
  exchange?: string;
  expectedDate?: string;
  valuation?: string;
  status?: string;
}

export interface Theme06IpoWatchV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  companies?: Theme06IpoWatchV1Company[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IpoWatchV1Meta: LayoutMeta = {
  id: 'theme06_ipo_watch_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 IPO 观察',
  description: 'IPO 候选公司观察清单与关键信息表',
  needsMedia: true,
  tags: ['ipo', 'watch', 'pipeline', 'atlas'],
  contentShape: 'summary',
};

export const theme06IpoWatchV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'IPO WATCH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 AI 赛道 IPO 观察' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '高估值独角兽的上市窗口与关键变量' },
    {
      key: 'companies',
      label: '候选公司',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: 'CoreWeave', exchange: 'NASDAQ', expectedDate: '2026 Q2', valuation: '$35B', status: '已递交' },
        { name: 'Databricks', exchange: 'NYSE', expectedDate: '2026 Q3', valuation: '$62B', status: '筹备中' },
        { name: 'Scale AI', exchange: 'NASDAQ', expectedDate: '2026 Q4', valuation: '$25B', status: '筹备中' },
        { name: 'Glean', exchange: 'NYSE', expectedDate: '2027', valuation: '$4.6B', status: '观望中' },
      ],
      itemSchema: [
        { key: 'name', label: '公司', type: 'text', inlineEditable: true },
        { key: 'exchange', label: '交易所', type: 'text', inlineEditable: true },
        { key: 'expectedDate', label: '预期时间', type: 'text', inlineEditable: true },
        { key: 'valuation', label: '估值', type: 'text', inlineEditable: true },
        { key: 'status', label: '状态', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '算力与数据基础设施公司率先进入上市窗口，应用层公司仍需证明规模化盈利。' },
  ],
};

export function Theme06IpoWatchV1(props: Theme06IpoWatchV1Props): ReactNode {
  const { kicker, title, subtitle, companies = [], conclusion, _slideIdx, _editable } = props;
  const validCompanies = (companies || []).filter((c): c is Theme06IpoWatchV1Company => c != null).slice(0, 8);

  return (
    <div className="lp-slide lp-theme06-ipo-watch">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-ipo-watch-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-ipo-watch-body lp-rise">
        <div className="lp-theme06-ipo-watch-table">
          <div className="lp-theme06-ipo-watch-row lp-theme06-ipo-watch-head">
            <span>公司</span>
            <span>交易所</span>
            <span>预期时间</span>
            <span>估值</span>
            <span>状态</span>
          </div>
          {validCompanies.map((item, index) => (
            <div key={index} className="lp-theme06-ipo-watch-row">
              <EditableField prop={`companies.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{item.name || ''}</EditableField>
              <EditableField prop={`companies.${index}.exchange`} slideIdx={_slideIdx} editable={_editable} as="span">{item.exchange || ''}</EditableField>
              <EditableField prop={`companies.${index}.expectedDate`} slideIdx={_slideIdx} editable={_editable} as="span">{item.expectedDate || ''}</EditableField>
              <EditableField prop={`companies.${index}.valuation`} slideIdx={_slideIdx} editable={_editable} as="span">{item.valuation || ''}</EditableField>
              <EditableField prop={`companies.${index}.status`} slideIdx={_slideIdx} editable={_editable} as="span">{item.status || ''}</EditableField>
            </div>
          ))}
        </div>
        {conclusion && (
          <div className="lp-theme06-ipo-watch-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
