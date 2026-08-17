// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 专题洞察（spotlight_v1）
 * 基底：纸 | 骨架：grid | 图位：1~2
 *
 * 聚光式渐晕 + 洞察句分段加粗，底部指标条。
 * 杂志「专题洞察 / Spotlight」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

interface MetricItem {
  value: string;
  label: string;
}

export interface Theme09SpotlightV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  kicker?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  subImageUrl?: string;
  metrics?: MetricItem[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SpotlightV1Meta: LayoutMeta = {
  id: 'theme09_spotlight_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 专题洞察',
  description: '聚光式渐晕 + 洞察句分段加粗 + 底部指标条，Spotlight / 专题栏',
  needsMedia: true,
  mediaSlots: [
    { name: '配图', fieldPath: 'imageUrl', canPresetMedia: true },
    { name: '辅图', fieldPath: 'subImageUrl', canPresetMedia: true },
  ],
  tags: ['spotlight', 'insight', 'grid', 'paper'],
  contentShape: 'spotlight',
};

export const theme09SpotlightV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '15' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'Spotlight' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '专题洞察' },
    { key: 'kicker', label: '专题副标', type: 'text', inlineEditable: true, defaultValue: '专题洞察' },
    { key: 'subtitle', label: '英文副标', type: 'text', inlineEditable: true, defaultValue: 'Compute is the hard currency' },
    { key: 'body', label: '正文段落', type: 'textarea', inlineEditable: true, defaultValue: '当模型参数与训练规模演变为军备竞赛，谁锁定了算力，谁就锁定了入场券。\n\n2024 年，提前签下长期 GPU 供给的基础设施商，成为一级市场最稀缺、也最受追捧的标的 —— 「卖铲子的人」率先赚到了确定性的钱。' },
    { key: 'imageUrl', label: '配图', type: 'image', defaultValue: '' },
    { key: 'subImageUrl', label: '辅图', type: 'image', defaultValue: '' },
    { key: 'metrics', label: '指标列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '洞察 · 专题' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '19' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_METRICS: MetricItem[] = [
  { value: '110 亿$元', label: '头部算力云累计融资' },
  { value: '63.9 %', label: '资金集中于旧金山湾区' },
  { value: '43.3 %', label: '大模型赛道资金占比' },
];

export function Theme09SpotlightV1(props: Theme09SpotlightV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, kicker, subtitle, body,
    imageUrl, subImageUrl, metrics = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeMetrics = metrics.length > 0 ? metrics : DEFAULT_METRICS;

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-spotlight">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <h2 className="lp-theme09-spotlight-title lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
      </h2>

      <div className="lp-theme09-spotlight-grid">
        {/* 左侧配图 */}
        <div className="lp-theme09-spotlight-photos">
          <InkPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="4:3"
            hint="上传配图"
          />
          {subImageUrl && (
            <InkPhoto
              prop="subImageUrl"
              src={subImageUrl}
              slideIdx={s}
              editable={e}
              ratio="4:3"
              hint="上传辅图"
            />
          )}
        </div>

        {/* 右侧文本 */}
        <div className="lp-theme09-spotlight-body">
          {kicker && (
            <span className="lp-theme09-spotlight-kicker lp-rise">
              <EditableField prop="kicker" slideIdx={s} editable={e}>{kicker}</EditableField>
            </span>
          )}

          <h3 className="lp-theme09-spotlight-headline lp-rise">
            <EditableField prop="body" slideIdx={s} editable={e}>
              {/* body 第一行作为 headline */}
              {(body || '').split('\n')[0]}
            </EditableField>
          </h3>

          {subtitle && (
            <span className="lp-theme09-spotlight-subtitle">
              <EditableField prop="subtitle" slideIdx={s} editable={e}>{subtitle}</EditableField>
            </span>
          )}

          {/* 正文后续行 */}
          {body && body.split('\n').slice(1).filter(Boolean).map((para, i) => (
            <p key={i} className="lp-theme09-spotlight-para lp-rise">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* 底部指标条 */}
      <div className="lp-theme09-spotlight-metrics">
        {safeMetrics.map((m, i) => (
          <div key={i} className="lp-theme09-spotlight-metric">
            <span className="lp-theme09-spotlight-metric-val lp-rise">
              <EditableField prop={`metrics.${i}.value`} slideIdx={s} editable={e}>{m.value}</EditableField>
            </span>
            <span className="lp-theme09-spotlight-metric-lbl">
              <EditableField prop={`metrics.${i}.label`} slideIdx={s} editable={e}>{m.label}</EditableField>
            </span>
          </div>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
