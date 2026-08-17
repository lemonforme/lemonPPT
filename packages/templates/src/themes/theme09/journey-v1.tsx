// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像纪程（journey_v1）
 * 基底：墨 | 骨架：grid | 图位：4
 *
 * 弧线路径串起四张影像节点，底部时间轴。
 * 杂志「影像纪程 / 资本之年」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, photoSlots } from './shared.js';

interface JourneyNode {
  date: string;
  title: string;
  desc?: string;
}

export interface Theme09JourneyV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  nodes?: JourneyNode[];
  images?: Array<{ url?: string; caption?: string }>;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09JourneyV1Meta: LayoutMeta = {
  id: 'theme09_journey_v1',
  theme: 'theme09',
  role: 'timeline',
  displayName: 'Theme 09 影像纪程',
  description: '弧线路径串起影像节点 + 底部时间轴，纪程 / 资本之年栏',
  needsMedia: true,
  mediaSlots: [{ name: '节点影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['timeline', 'journey', 'photo', 'ink'],
  contentShape: 'journey',
};

export const theme09JourneyV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '08' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'Photo Journey · 2024' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '影像纪程 · 资本之年' },
    { key: 'nodes', label: '节点列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'images', label: '节点图片', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '纪程 · 影像' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '15' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_NODES: JourneyNode[] = [
  { date: '2024-02', title: 'OpenAI 要约收购 · 估值约 880 亿$' },
  { date: '2024-05', title: 'xAI B 轮 60 亿$ · 投后 240 亿' },
  { date: '2024-06', title: 'Anthropic 获亚马逊追加战略投资' },
  { date: '2024-09', title: 'Databricks J 轮约 100 亿$' },
];

export function Theme09JourneyV1(props: Theme09JourneyV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, nodes = [], images = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeNodes = nodes.length > 0 ? nodes : DEFAULT_NODES;
  const slots = photoSlots(Math.max(safeNodes.length, 4), 8);
  const safeImages = [...images];
  while (safeImages.length < slots.length) safeImages.push({});

  return (
    <Sheet substrate="ink" frame="grid" className="lp-theme09-journey" grain={false}>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <h2 className="lp-theme09-journey-title lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
      </h2>

      <div className="lp-theme09-journey-track">
        {slots.map((i) => {
          const node = safeNodes[i] || { date: '', title: `节点 ${i + 1}` };
          return (
            <figure key={i} className={`lp-theme09-journey-node ${i === 0 ? 'featured' : ''}`}>
              <InkPhoto
                prop={`images.${i}.url`}
                src={safeImages[i]?.url}
                slideIdx={s}
                editable={e}
                ratio="3:4"
                hint="上传节点影像"
              >
                <span className="lp-theme09-journey-node-num">{String(i + 1).padStart(2, '0')}</span>
              </InkPhoto>
              <figcaption className="lp-theme09-journey-node-info">
                <span className="lp-theme09-journey-date lp-rise">{node.date}</span>
                <EditableField prop={`nodes.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme09-journey-node-title">
                  {node.title}
                </EditableField>
              </figcaption>
            </figure>
          );
        })}

        {/* 时间轴线 */}
        <div className="lp-theme09-journey-axis" aria-hidden="true">
          {slots.map((i) => {
            const node = safeNodes[i];
            return (
              <div key={i} className="lp-theme09-journey-dot-wrap">
                <span className="lp-theme09-journey-dot" />
                {node && (
                  <span className="lp-theme09-journey-axis-date">{node.date}</span>
                )}
              </div>
            );
          })}
          <span className="lp-theme09-journey-line" />
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
