// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CompanyInvestorsV1Investor {
  name?: string;
  type?: string;
  stage?: string;
}

export interface Theme06CompanyInvestorsV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  investors?: Theme06CompanyInvestorsV1Investor[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CompanyInvestorsV1Meta: LayoutMeta = {
  id: 'theme06_company_investors_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 投资机构网格',
  description: '头部投资机构网格展示',
  needsMedia: true,
  tags: ['company', 'investors', 'grid', 'atlas'],
  contentShape: 'grid',
};

export const theme06CompanyInvestorsV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'INVESTORS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '主要投资方可视化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '覆盖早期 VC、产业基金与战略投资方' },
    {
      key: 'investors',
      label: '投资机构',
      type: 'array',
      minItems: 3,
      maxItems: 9,
      defaultValue: [
        { name: '红杉中国', type: 'VC', stage: 'A 轮' },
        { name: '高瓴投资', type: 'PE', stage: 'B 轮' },
        { name: '某产业基金', type: 'CVC', stage: '战略' },
        { name: '某头部 VC', type: 'VC', stage: 'Pre-A' },
        { name: '某天使基金', type: 'Angel', stage: '种子' },
        { name: '某主权基金', type: 'Sovereign', stage: 'B+ 轮' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'type', label: '类型', type: 'text', inlineEditable: true },
        { key: 'stage', label: '参与轮次', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06CompanyInvestorsV1(props: Theme06CompanyInvestorsV1Props): ReactNode {
  const { kicker, title, subtitle, investors = [], _slideIdx, _editable } = props;
  const validInvestors = (investors || []).filter((i): i is Theme06CompanyInvestorsV1Investor => i != null).slice(0, 9);

  return (
    <div className="lp-slide lp-theme06-company-investors">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-company-investors-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-company-investors-grid lp-rise">
        {validInvestors.map((investor, index) => (
          <div key={index} className={`lp-theme06-company-investors-cell ${index === 0 ? 'focus' : ''}`}>
            <div className="lp-theme06-company-investors-name">
              <EditableField prop={`investors.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{investor.name || ''}</EditableField>
            </div>
            <div className="lp-theme06-company-investors-meta">
              {investor.type && <span className="lp-theme06-company-investors-type">{investor.type}</span>}
              {investor.stage && <span className="lp-theme06-company-investors-stage">{investor.stage}</span>}
            </div>
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
