// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CoverBrandV1Channel {
  name?: string;
  metric?: string;
}

export interface Theme06CoverBrandV1Props {
  imageUrl?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  headline?: string;
  channels?: Theme06CoverBrandV1Channel[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CoverBrandV1Meta: LayoutMeta = {
  id: 'theme06_cover_brand_v1',
  theme: 'theme06',
  role: 'cover',
  displayName: 'Theme 06 品牌营销封面',
  description: '品牌标语 + 整合营销渠道环形展示',
  needsMedia: true,
  tags: ['cover', 'brand', 'marketing', 'atlas'],
  contentShape: 'cover',
};

export const theme06CoverBrandV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: 'BRAND MKT' },
    { key: 'headline', label: '主口号', type: 'text', inlineEditable: true, defaultValue: '整合营销 · 全域增长' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '品牌整合营销方案' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '打通内容、社交、电商与私域，构建品牌增长飞轮' },
    {
      key: 'channels',
      label: '渠道节点',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { name: '内容种草', metric: '3.2M 曝光' },
        { name: '社交传播', metric: '18% 互动率' },
        { name: '电商转化', metric: '12% ROI' },
        { name: '私域运营', metric: '45% 复购率' },
        { name: 'KOL 矩阵', metric: '120+ 达人' },
      ],
      itemSchema: [
        { key: 'name', label: '渠道名', type: 'text', inlineEditable: true },
        { key: 'metric', label: '指标', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '左下角脚注', type: 'text', inlineEditable: true, defaultValue: 'CONFIDENTIAL' },
    { key: 'footnoteRight', label: '右下角脚注', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme06CoverBrandV1(props: Theme06CoverBrandV1Props): ReactNode {
  const { badge, title, subtitle, headline, channels = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validChannels = (channels || []).filter((c): c is Theme06CoverBrandV1Channel => c != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-cover-brand">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-cover-brand-main lp-rise">
        {badge && <div className="lp-theme06-cover-brand-badge">{badge}</div>}
        {headline && (
          <EditableField prop="headline" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme06-cover-brand-headline">{headline}</EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-cover-brand-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-cover-brand-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validChannels.length > 0 && (
        <div className="lp-theme06-cover-brand-channels lp-rise">
          {validChannels.map((channel, index) => (
            <div key={index} className="lp-theme06-cover-brand-channel">
              <div className="lp-theme06-cover-brand-channel-name">{channel.name || ''}</div>
              <div className="lp-theme06-cover-brand-channel-metric">{channel.metric || ''}</div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left">{footnoteLeft || ''}</span>
        <span className="lp-theme06-footer-right">{footnoteRight || ''}</span>
      </div>
    </div>
  );
}
