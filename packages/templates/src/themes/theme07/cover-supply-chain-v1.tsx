// lemonPPT - theme07 供应链封面
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07MiniBars, Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CoverSupplyChainV1Channel {
  name?: string;
  metric?: string;
}

export interface Theme07CoverSupplyChainV1Props {
  imageUrl?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  headline?: string;
  channels?: Theme07CoverSupplyChainV1Channel[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CoverSupplyChainV1Meta: LayoutMeta = {
  id: 'theme07_cover_supply_chain_v1',
  theme: 'theme07',
  role: 'cover',
  displayName: 'Theme 07 供应链封面',
  description: '左侧标题 + 右侧供应链节点卡片',
  needsMedia: true,
  tags: ['cover', 'supply-chain', 'channels'],
  contentShape: 'cover',
};

export const theme07CoverSupplyChainV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SUPPLY CHAIN' },
    { key: 'headline', label: '英文大标题', type: 'text', inlineEditable: true, defaultValue: 'AI SUPPLY CHAIN' },
    { key: 'title', label: '主标题', type: 'text', inlineEditable: true, defaultValue: 'AI 供应链与算力网络' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从芯片、云到模型层的关键节点与资本逻辑' },
    {
      key: 'channels',
      label: '供应链节点',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { name: '芯片设计', metric: 'HBM / 先进制程' },
        { name: '晶圆制造', metric: 'TSMC / 三星' },
        { name: '云服务', metric: 'AWS / Azure / GCP' },
        { name: '基础模型', metric: 'GPT / Claude / Gemini' },
        { name: '中间件', metric: 'Agent / RAG' },
        { name: '应用层', metric: '垂直 SaaS' },
      ],
      itemSchema: [
        { key: 'name', label: '节点', type: 'text', inlineEditable: true },
        { key: 'metric', label: '代表', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '02' },
  ],
};

export function Theme07CoverSupplyChainV1(props: Theme07CoverSupplyChainV1Props): ReactNode {
  const { imageUrl, badge, headline, title, subtitle, channels = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validChannels = (channels || []).filter((c): c is Theme07CoverSupplyChainV1Channel => c != null && !!c.name).slice(0, 6);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-cover-supply-chain">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <Theme07WatermarkNumber number="02" />
      <div className="lp-theme07-cover-supply-chain-main lp-rise">
        <Theme07IconChip name="globe" />
        {badge && <div className="lp-theme07-kicker">{badge}</div>}
        {headline && <div className="lp-theme07-cover-supply-chain-headline">{headline}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme07-cover-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validChannels.length > 0 && (
        <div className="lp-theme07-cover-supply-chain-channels lp-rise">
          {validChannels.map((c, i) => (
            <div key={i} className="lp-theme07-card lp-theme07-cover-supply-chain-channel" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme07-cover-supply-chain-channel-name">
                <EditableField prop={`channels.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{c.name}</EditableField>
              </div>
              <div className="lp-theme07-cover-supply-chain-channel-metric">{c.metric || ''}</div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme07-footer">
        <span className="lp-theme07-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme07-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme07MiniBars count={22} />
    </div>
  );
}
