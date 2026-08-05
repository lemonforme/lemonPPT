// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06SectorSpotlightV1Highlight {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme06SectorSpotlightV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme06SectorSpotlightV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  takeaways?: Array<{ text?: string }>;
  highlights?: Theme06SectorSpotlightV1Highlight[];
  insight?: Theme06SectorSpotlightV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SectorSpotlightV1Meta: LayoutMeta = {
  id: 'theme06_sector_spotlight_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 行业专题',
  description: '行业或技术专题页，左栏要点右栏指标卡',
  needsMedia: true,
  tags: ['sector', 'spotlight', 'topic', 'atlas'],
  contentShape: 'summary',
};

export const theme06SectorSpotlightV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SECTOR SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '医疗健康 AI 落地现状' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从影像辅助诊断到药物发现，AI 正在重塑研发与临床路径' },
    {
      key: 'takeaways',
      label: '核心要点',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { text: '影像识别准确率已接近资深医师水平' },
        { text: '药物研发周期从 5 年压缩至 18 个月' },
        { text: '监管框架仍是规模化落地的最大变量' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea', inlineEditable: true }],
    },
    {
      key: 'highlights',
      label: '指标卡',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '470+', label: '在研项目', accent: true },
        { value: '$12B', label: '年度融资', accent: false },
        { value: '38%', label: '渗透率提升', accent: false },
        { value: '24', label: '获批产品', accent: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    {
      key: 'insight',
      label: '关键洞察',
      type: 'object',
      defaultValue: { value: '3.2x', label: '投资回报率中位数', description: '在已商业化的场景中，AI 辅助诊疗展现出显著的运营效率提升。' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06SectorSpotlightV1(props: Theme06SectorSpotlightV1Props): ReactNode {
  const { kicker, title, subtitle, takeaways = [], highlights = [], insight, _slideIdx, _editable } = props;

  const validTakeaways = (takeaways || []).filter((t): t is { text: string } => t != null).slice(0, 5);
  const validHighlights = (highlights || []).filter((h): h is Theme06SectorSpotlightV1Highlight => h != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-sector-spotlight">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-sector-spotlight-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-sector-spotlight-body lp-rise">
        <div className="lp-theme06-sector-spotlight-main">
          <ul className="lp-theme06-sector-spotlight-takeaways">
            {validTakeaways.map((item, index) => (
              <li key={index} className="lp-theme06-sector-spotlight-takeaway">
                <EditableField prop={`takeaways.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{item.text || ''}</EditableField>
              </li>
            ))}
          </ul>
        </div>

        <div className="lp-theme06-sector-spotlight-aside">
          <div className="lp-theme06-sector-spotlight-grid">
            {validHighlights.map((item, index) => (
              <div key={index} className={`lp-theme06-sector-spotlight-cell ${item.accent ? 'accent' : ''}`}>
                <div className="lp-theme06-sector-spotlight-value">{item.value || ''}</div>
                <div className="lp-theme06-sector-spotlight-label">{item.label || ''}</div>
              </div>
            ))}
          </div>
          {insight && (
            <div className="lp-theme06-sector-spotlight-insight">
              <div className="lp-theme06-sector-spotlight-insight-value">{insight.value || ''}</div>
              <div className="lp-theme06-sector-spotlight-insight-label">{insight.label || ''}</div>
              {insight.description && (
                <div className="lp-theme06-sector-spotlight-insight-desc">{insight.description}</div>
              )}
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
