// lemonPPT - theme07 壁垒压力带
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07MoatV1Band {
  label?: string;
  pressure?: number;
  strength?: string;
  note?: string;
}

export interface Theme07MoatV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  bands?: Theme07MoatV1Band[];
  showBand?: boolean;
  axisStart?: string;
  axisEnd?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07MoatV1Meta: LayoutMeta = {
  id: 'theme07_moat_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 壁垒压力带',
  description: '三条水平压力带，带宽自左向右收窄表达壁垒被压缩的程度',
  needsMedia: true,
  tags: ['moat', 'pressure', 'band', 'chart'],
  contentShape: 'pressure-bands',
};

export const theme07MoatV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MOAT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '壁垒压缩风险' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '模型能力快速商品化，各类壁垒的有效宽度持续收窄' },
    {
      key: 'bands',
      label: '压力带',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '技术壁垒', pressure: 68, strength: '弱', note: '开源追赶周期缩短至 6 个月' },
        { label: '资本壁垒', pressure: 44, strength: '中', note: '算力投入门槛仍然显著' },
        { label: '生态壁垒', pressure: 26, strength: '强', note: '企业渠道与数据闭环最难复制' },
      ],
      itemSchema: [
        { key: 'label', label: '壁垒类型', type: 'text', inlineEditable: true },
        { key: 'pressure', label: '压缩程度', type: 'number' },
        { key: 'strength', label: '剩余强度', type: 'text', inlineEditable: true },
        { key: 'note', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'showBand', label: '显示压缩遮罩', type: 'boolean', defaultValue: true },
    { key: 'axisStart', label: '左轴标签', type: 'text', defaultValue: '原始壁垒宽度' },
    { key: 'axisEnd', label: '右轴标签', type: 'text', defaultValue: '当前有效宽度' },
    { key: 'focusIndex', label: '高亮压力带', type: 'slider', min: 0, max: 3, defaultValue: 0 },
  ],
};

export function Theme07MoatV1(props: Theme07MoatV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    bands = [],
    showBand = true,
    axisStart,
    axisEnd,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validBands = (bands || [])
    .filter((b): b is Theme07MoatV1Band => b != null && !!b.label)
    .slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-moat-bands">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-moat-bands-header lp-rise">
        <Theme07IconChip name="shield" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {(axisStart || axisEnd) && (
        <div className="lp-theme07-moat-bands-axis lp-rise">
          {axisStart && <span>{axisStart}</span>}
          {axisEnd && <span>{axisEnd}</span>}
        </div>
      )}
      {validBands.length > 0 && (
        <div className="lp-theme07-moat-bands-list lp-rise">
          {validBands.map((band, index) => {
            const pressure = Math.max(0, Math.min(90, Number(band.pressure) || 0));
            const startHalf = 17;
            const endHalf = startHalf * (1 - pressure / 100);
            const isFocus = index === focusIndex;
            return (
              <div
                key={index}
                className={`lp-theme07-moat-band ${isFocus ? 'is-focus' : ''}`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="lp-theme07-moat-band-label">
                  <span className="lp-theme07-moat-band-name">
                    <EditableField prop={`bands.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{band.label}</EditableField>
                  </span>
                  {band.strength && (
                    <span className="lp-theme07-moat-band-strength">
                      <EditableField prop={`bands.${index}.strength`} slideIdx={_slideIdx} editable={_editable} as="span">{band.strength}</EditableField>
                    </span>
                  )}
                </div>
                <div className="lp-theme07-moat-band-track">
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id={`lp-theme07-moat-grad-${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="var(--lp-accent-cool)" stopOpacity="0.85" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points={`0,${20 - startHalf} 100,${20 - endHalf} 100,${20 + endHalf} 0,${20 + startHalf}`}
                      fill={`url(#lp-theme07-moat-grad-${index})`}
                    />
                    <polyline
                      points={`0,${20 - startHalf} 100,${20 - endHalf}`}
                      fill="none"
                      stroke="var(--lp-accent)"
                      strokeWidth="1.4"
                      vectorEffect="non-scaling-stroke"
                      opacity="0.75"
                    />
                    <polyline
                      points={`0,${20 + startHalf} 100,${20 + endHalf}`}
                      fill="none"
                      stroke="var(--lp-accent)"
                      strokeWidth="1.4"
                      vectorEffect="non-scaling-stroke"
                      opacity="0.75"
                    />
                    {showBand && (
                      <rect
                        x={100 - pressure}
                        y="0"
                        width={pressure}
                        height="40"
                        fill="color-mix(in srgb, var(--lp-accent-cool) 16%, transparent)"
                        stroke="var(--lp-accent-cool)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        vectorEffect="non-scaling-stroke"
                        opacity="0.7"
                      />
                    )}
                  </svg>
                  <span className="lp-theme07-moat-band-pressure">压缩 {Math.round(pressure)}%</span>
                </div>
                {band.note && (
                  <div className="lp-theme07-moat-band-note">
                    <EditableField prop={`bands.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{band.note}</EditableField>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
