// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05VersusV1Side {
  value: string;
  unit?: string;
  label: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05VersusV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  left: Theme05VersusV1Side;
  right: Theme05VersusV1Side;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05VersusV1Meta: LayoutMeta = {
  id: 'theme05_versus_v1',
  theme: 'theme05',
  role: 'comparison',
  displayName: 'Theme 05 双数对比页',
  description: '左右大数值对比，中间 VS 徽章，光谱色卡片',
  needsMedia: false,
  tags: ['metric', 'comparison', 'versus', 'spectrum'],
  contentShape: 'title-metric',
};

export const theme05VersusV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '横向对比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{基础设施}} vs 应用层' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '资金在两层之间的分布差异明显' },
    { key: 'left.value', label: '左侧数值', type: 'text', defaultValue: '420' },
    { key: 'left.unit', label: '左侧单位', type: 'text', defaultValue: '亿美元' },
    { key: 'left.label', label: '左侧说明', type: 'text', defaultValue: '基础设施层' },
    { key: 'left.scheme', label: '左侧强调色', type: 'select', defaultValue: 'coral', options: [{ value: 'coral', label: '珊瑚红' }, { value: 'amber', label: '琥珀黄' }, { value: 'teal', label: '青绿' }, { value: 'indigo', label: '靛蓝' }, { value: 'violet', label: '紫罗兰' }] },
    { key: 'right.value', label: '右侧数值', type: 'text', defaultValue: '180' },
    { key: 'right.unit', label: '右侧单位', type: 'text', defaultValue: '亿美元' },
    { key: 'right.label', label: '右侧说明', type: 'text', defaultValue: '应用层' },
    { key: 'right.scheme', label: '右侧强调色', type: 'select', defaultValue: 'indigo', options: [{ value: 'coral', label: '珊瑚红' }, { value: 'amber', label: '琥珀黄' }, { value: 'teal', label: '青绿' }, { value: 'indigo', label: '靛蓝' }, { value: 'violet', label: '紫罗兰' }] },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-versus-card--${scheme || 'coral'}`;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme05-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme05-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function VersusCard({ side, sideKey, slideIdx, editable }: { side: Theme05VersusV1Side; sideKey: 'left' | 'right'; slideIdx?: number; editable?: boolean }): ReactNode {
  return (
    <div className={`lp-theme05-versus-card ${schemeClass(side.scheme)} lp-rise`}>
      <EditableField prop={`${sideKey}.label`} slideIdx={slideIdx} editable={editable} as="div" className="lp-theme05-versus-card-label">{side.label}</EditableField>
      <div className="lp-theme05-versus-card-value-row">
        <EditableField prop={`${sideKey}.value`} slideIdx={slideIdx} editable={editable} as="span" className="lp-theme05-versus-card-value">{side.value}</EditableField>
        {side.unit && <EditableField prop={`${sideKey}.unit`} slideIdx={slideIdx} editable={editable} as="span" className="lp-theme05-versus-card-unit">{side.unit}</EditableField>}
      </div>
    </div>
  );
}

export function Theme05VersusV1(props: Theme05VersusV1Props): ReactNode {
  const { kicker, title, subtitle, left, right, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-versus">
      <div className="lp-theme05-versus-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-versus-main lp-rise">
        <VersusCard side={left || { value: '', label: '' }} sideKey="left" slideIdx={_slideIdx} editable={_editable} />
        <div className="lp-theme05-versus-badge">
          <span className="lp-theme05-versus-badge-text">VS</span>
        </div>
        <VersusCard side={right || { value: '', label: '' }} sideKey="right" slideIdx={_slideIdx} editable={_editable} />
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-versus-footnote lp-rise">{footnote}</EditableField>
      )}

      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
