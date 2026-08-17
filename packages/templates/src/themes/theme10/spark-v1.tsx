// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 持仓小图集（spark_v1）
 * 情绪：obsidian | 骨架：grid | 图位：6
 * 2×3 持仓小图集（每张含标的名 + 涨跌幅）+ 底部刻度 sparkline。
 * 金融编辑「持仓快照」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Scale, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10SparkV1Item {
  url?: string;
  name?: string;
  value?: string;
}
export interface Theme10SparkV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10SparkV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

export const theme10SparkV1Meta: LayoutMeta = {
  id: 'theme10_spark_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 持仓小图集',
  description: '2×3 持仓小图集 + 刻度 sparkline',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `持仓 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['spark', 'gold-index', 'obsidian'],
  contentShape: 'spark',
};

export const theme10SparkV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '持仓快照' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Holdings' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六只标的，一组被反复验算的仓位' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们把组合拆成六格，每一格都贴上名字与当周涨跌——读图之前，先看数字。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, (_, i) => ({ url: '', name: `标的 ${i + 1}`, value: '+0.00%' })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'name', label: '标的名', type: 'text', inlineEditable: true },
        { key: 'value', label: '涨跌幅', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '持仓快照' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10SparkV1(props: Theme10SparkV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10SparkV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-spark">
      <div className="lp-theme10-spark-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-spark-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-spark-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-spark-grid">
        {images.map((img, i) => {
          const up = img.value != null && !/^-/.test(img.value.trim());
          return (
            <figure className="lp-theme10-spark-cell lp-rise" style={{ animationDelay: `${160 + i * 40}ms` }} key={i}>
              <EditorialPhoto
                prop={`images.${i}.url`}
                src={img.url}
                slideIdx={s}
                editable={e}
                ratio="fill"
                fit="cover"
                hint={`点击上传持仓 ${i + 1}`}
                className="lp-theme10-spark-photo"
              />
              <figcaption className="lp-theme10-spark-cap">
                <EditableField prop={`images.${i}.name`} slideIdx={s} editable={e} as="span" className="t10-name">{img.name}</EditableField>
                <EditableField prop={`images.${i}.value`} slideIdx={s} editable={e} as="span" className={`t10-val ${up ? 'up' : 'down'}`}>{img.value}</EditableField>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="lp-theme10-spark-foot">
        <span className="t10-foot-label">组合表现 · SPARK</span>
        <Scale ticks={24} majors={[0, 6, 12, 18, 23]} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
