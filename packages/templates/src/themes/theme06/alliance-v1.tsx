// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06AllianceV1Partner {
  name?: string;
  role?: string;
  contribution?: string;
}

export interface Theme06AllianceV1Resource {
  title?: string;
  description?: string;
}

export interface Theme06AllianceV1Outcome {
  value?: string;
  label?: string;
}

export interface Theme06AllianceV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  partners?: Theme06AllianceV1Partner[];
  resources?: Theme06AllianceV1Resource[];
  outcomes?: Theme06AllianceV1Outcome[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06AllianceV1Meta: LayoutMeta = {
  id: 'theme06_alliance_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 联盟与资源',
  description: '展示战略联盟中的参与方、资源互补与合作成果',
  needsMedia: true,
  tags: ['alliance', 'partnership', 'resources', 'atlas'],
  contentShape: 'summary',
};

export const theme06AllianceV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ALLIANCE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '战略联盟与资源整合' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '通过互补能力共建生态，扩大市场覆盖与技术纵深' },
    {
      key: 'partners',
      label: '联盟成员',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { name: '云厂商 A', role: '基础设施', contribution: '提供 GPU 集群与全球机房' },
        { name: '模型厂商 B', role: '基础模型', contribution: '开放模型 API 与微调能力' },
        { name: '行业龙头 C', role: '场景入口', contribution: '提供行业数据与客户渠道' },
        { name: '咨询公司 D', role: '落地服务', contribution: '提供变革管理与实施交付' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'role', label: '角色', type: 'text', inlineEditable: true },
        { key: 'contribution', label: '贡献', type: 'textarea', inlineEditable: true },
      ],
    },
    {
      key: 'resources',
      label: '共享资源',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '算力池', description: '统一调度 GPU/TPU，降低训练成本' },
        { title: '数据联盟', description: '合规共享行业数据，提升模型效果' },
        { title: '品牌联合', description: '共同举办峰会与白皮书发布' },
        { title: '渠道互通', description: '互相引入客户，扩大销售漏斗' },
      ],
      itemSchema: [
        { key: 'title', label: '资源', type: 'text', inlineEditable: true },
        { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
      ],
    },
    {
      key: 'outcomes',
      label: '合作成果',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '40%', label: '成本下降' },
        { value: '3x', label: '触达客户' },
        { value: '6 个月', label: '上线周期' },
        { value: '15+', label: '联合方案' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '联盟的价值在于把各方的“长板”组合成端到端解决方案，而不是简单的客户转介绍。' },
  ],
};

export function Theme06AllianceV1(props: Theme06AllianceV1Props): ReactNode {
  const { kicker, title, subtitle, partners = [], resources = [], outcomes = [], insight, _slideIdx, _editable } = props;
  const validPartners = (partners || []).filter((p): p is Theme06AllianceV1Partner => p != null).slice(0, 4);
  const validResources = (resources || []).filter((r): r is Theme06AllianceV1Resource => r != null).slice(0, 4);
  const validOutcomes = (outcomes || []).filter((o): o is Theme06AllianceV1Outcome => o != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-alliance">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-alliance-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-alliance-body lp-rise">
        <div className="lp-theme06-alliance-partners">
          {validPartners.map((item, index) => (
            <div key={index} className="lp-theme06-alliance-partner">
              <EditableField prop={`partners.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-alliance-partner-name">{item.name || ''}</EditableField>
              <div className="lp-theme06-alliance-partner-role">{item.role || ''}</div>
              {item.contribution && (
                <EditableField prop={`partners.${index}.contribution`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-alliance-partner-contribution">{item.contribution}</EditableField>
              )}
            </div>
          ))}
        </div>

        <div className="lp-theme06-alliance-lower">
          <div className="lp-theme06-alliance-resources">
            {validResources.map((item, index) => (
              <div key={index} className="lp-theme06-alliance-resource">
                <EditableField prop={`resources.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h4" className="lp-theme06-alliance-resource-title">{item.title || ''}</EditableField>
                {item.description && (
                  <EditableField prop={`resources.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-alliance-resource-desc">{item.description}</EditableField>
                )}
              </div>
            ))}
          </div>

          <div className="lp-theme06-alliance-outcomes">
            {validOutcomes.map((item, index) => (
              <div key={index} className="lp-theme06-alliance-outcome">
                <div className="lp-theme06-alliance-outcome-value">{item.value || ''}</div>
                <div className="lp-theme06-alliance-outcome-label">{item.label || ''}</div>
              </div>
            ))}
            {insight && (
              <div className="lp-theme06-alliance-insight">
                <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
              </div>
            )}
          </div>
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
