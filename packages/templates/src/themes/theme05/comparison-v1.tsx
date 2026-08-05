// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ComparisonV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  leftTitle?: string;
  leftItems?: string[];
  leftScheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  rightTitle?: string;
  rightItems?: string[];
  rightScheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  vsLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ComparisonV1Meta: LayoutMeta = {
  id: 'theme05_comparison_v1',
  theme: 'theme05',
  role: 'comparison',
  displayName: 'Theme 05 左右对比',
  description: '左右双栏 A/B 对比，顶部不同 scheme 色条，中间 VS 徽章',
  needsMedia: false,
  tags: ['comparison', 'versus', 'a-b'],
  contentShape: 'comparison',
};

export const theme05ComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'A / B 对比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两种方案的关键差异' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从成本、效率与风险三个维度比较' },
    { key: 'leftTitle', label: '左栏标题', type: 'text', inlineEditable: true, defaultValue: '方案 A' },
    {
      key: 'leftItems',
      label: '左栏要点',
      type: 'array',
      maxItems: 6,
      defaultValue: ['前期投入低', '上线周期短', '灵活可扩展', '适合快速验证'],
      itemSchema: [{ key: 'item', label: '要点', type: 'text' }],
    },
    {
      key: 'leftScheme',
      label: '左栏强调色',
      type: 'select',
      defaultValue: 'coral',
      options: [
        { value: 'coral', label: '珊瑚红' },
        { value: 'amber', label: '琥珀黄' },
        { value: 'teal', label: '青绿' },
        { value: 'indigo', label: '靛蓝' },
        { value: 'violet', label: '紫罗兰' },
      ],
    },
    { key: 'rightTitle', label: '右栏标题', type: 'text', inlineEditable: true, defaultValue: '方案 B' },
    {
      key: 'rightItems',
      label: '右栏要点',
      type: 'array',
      maxItems: 6,
      defaultValue: ['长期总拥有成本低', '性能天花板高', '依赖自建团队', '适合规模化运营'],
      itemSchema: [{ key: 'item', label: '要点', type: 'text' }],
    },
    {
      key: 'rightScheme',
      label: '右栏强调色',
      type: 'select',
      defaultValue: 'indigo',
      options: [
        { value: 'coral', label: '珊瑚红' },
        { value: 'amber', label: '琥珀黄' },
        { value: 'teal', label: '青绿' },
        { value: 'indigo', label: '靛蓝' },
        { value: 'violet', label: '紫罗兰' },
      ],
    },
    { key: 'vsLabel', label: 'VS 标签', type: 'text', inlineEditable: true, defaultValue: 'VS' },
  ],
};

function schemeClass(prefix: string, scheme?: string): string {
  return `${prefix}--${scheme || 'coral'}`;
}

export function Theme05ComparisonV1(props: Theme05ComparisonV1Props): ReactNode {
  const {
    kicker,
    title,
    subtitle,
    leftTitle,
    leftItems = [],
    leftScheme,
    rightTitle,
    rightItems = [],
    rightScheme,
    vsLabel,
    _slideIdx,
    _editable,
  } = props;

  const validLeft = (leftItems || []).filter((i): i is string => typeof i === 'string').slice(0, 6);
  const validRight = (rightItems || []).filter((i): i is string => typeof i === 'string').slice(0, 6);

  return (
    <div className="lp-slide lp-theme05-comparison-v1">
      <div className="lp-theme05-comparison-v1-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-comparison-v1-main lp-rise">
        <div className={`lp-theme05-comparison-v1-card lp-theme05-comparison-v1-card--left ${schemeClass('lp-theme05-comparison-v1-card', leftScheme)}`}>
          {leftTitle && (
            <div className="lp-theme05-comparison-v1-card-title">
              <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="span">{leftTitle}</EditableField>
            </div>
          )}
          <ul className="lp-theme05-comparison-v1-list">
            {validLeft.map((item, i) => (
              <li key={i} className="lp-theme05-comparison-v1-item">
                <EditableField prop={`leftItems.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{item}</EditableField>
              </li>
            ))}
          </ul>
        </div>

        <div className="lp-theme05-comparison-v1-vs">
          <EditableField prop="vsLabel" slideIdx={_slideIdx} editable={_editable} as="span">{vsLabel ?? 'VS'}</EditableField>
        </div>

        <div className={`lp-theme05-comparison-v1-card lp-theme05-comparison-v1-card--right ${schemeClass('lp-theme05-comparison-v1-card', rightScheme)}`}>
          {rightTitle && (
            <div className="lp-theme05-comparison-v1-card-title">
              <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="span">{rightTitle}</EditableField>
            </div>
          )}
          <ul className="lp-theme05-comparison-v1-list">
            {validRight.map((item, i) => (
              <li key={i} className="lp-theme05-comparison-v1-item">
                <EditableField prop={`rightItems.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{item}</EditableField>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
