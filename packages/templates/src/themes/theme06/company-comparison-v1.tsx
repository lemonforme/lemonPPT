// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CompanyComparisonV1Company {
  name?: string;
  values?: string[];
}

export interface Theme06CompanyComparisonV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  dimensions?: string[];
  companies?: Theme06CompanyComparisonV1Company[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CompanyComparisonV1Meta: LayoutMeta = {
  id: 'theme06_company_comparison_v1',
  theme: 'theme06',
  role: 'comparison',
  displayName: 'Theme 06 多公司对比',
  description: '多公司在关键维度上的横向对比表',
  needsMedia: true,
  tags: ['company', 'comparison', 'table', 'atlas'],
  contentShape: 'comparison',
};

export const theme06CompanyComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPARISON' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心玩家能力对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从技术、商业化、生态三个维度评估赛道代表公司' },
    {
      key: 'dimensions',
      label: '对比维度',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: ['技术深度', '商业化', '生态规模'],
      itemSchema: [{ key: 'item', label: '维度', type: 'text', inlineEditable: true }],
    },
    {
      key: 'companies',
      label: '公司数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '星云智能', values: ['领先', '快速', '完整'] },
        { name: '竞品 A', values: ['中等', '成熟', '分散'] },
        { name: '竞品 B', values: ['追赶', '早期', '垂直'] },
      ],
      itemSchema: [
        { key: 'name', label: '公司名称', type: 'text', inlineEditable: true },
        {
          key: 'values',
          label: '维度评分',
          type: 'array',
          minItems: 1,
          maxItems: 6,
          itemSchema: [{ key: 'item', label: '评分', type: 'text', inlineEditable: true }],
        },
      ],
    },
  ],
};

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === 'string' ? item : (item as { item?: string }).item ?? ''))
    .filter((item) => item !== '');
}

export function Theme06CompanyComparisonV1(props: Theme06CompanyComparisonV1Props): ReactNode {
  const { kicker, title, subtitle, dimensions = [], companies = [], _slideIdx, _editable } = props;
  const validDimensions = normalizeStringArray(dimensions).slice(0, 6);
  const validCompanies = (companies || [])
    .filter((c): c is Theme06CompanyComparisonV1Company => c != null)
    .slice(0, 6)
    .map((c) => ({ ...c, values: normalizeStringArray(c.values).slice(0, validDimensions.length) }));

  return (
    <div className="lp-slide lp-theme06-company-comparison">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-company-comparison-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-company-comparison-body lp-rise">
        {validDimensions.length > 0 && validCompanies.length > 0 && (
          <table className="lp-theme06-company-comparison-table">
            <thead>
              <tr>
                <th>公司 / 维度</th>
                {validDimensions.map((dimension, index) => (
                  <th key={index}>{dimension}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validCompanies.map((company, companyIndex) => (
                <tr key={companyIndex}>
                  <td>
                    <EditableField prop={`companies.${companyIndex}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{company.name || ''}</EditableField>
                  </td>
                  {validDimensions.map((_, dimensionIndex) => {
                    const value = company.values[dimensionIndex] ?? '';
                    return (
                      <td key={dimensionIndex} className={companyIndex === 0 ? 'focus' : ''}>
                        <EditableField prop={`companies.${companyIndex}.values.${dimensionIndex}.item`} slideIdx={_slideIdx} editable={_editable} as="span">{value}</EditableField>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
