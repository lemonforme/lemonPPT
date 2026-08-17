// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09MegaNumberV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  caption?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09MegaNumberV1Meta: LayoutMeta = {
  id: 'theme09_mega_number_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '数字海报',
  description: '单个超巨数字铺满版面，上引语下注解，专色单位，墨底',
  needsMedia: false,
  tags: ['chart', 'stat', 'poster', 'single-number'],
  contentShape: 'single-stat-poster',
};

export const theme09MegaNumberV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '数字海报' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'MEGA' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '海报数' },
    { key: 'title', label: '主数字', type: 'text', inlineEditable: true, defaultValue: '1,024' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'subtitle', label: '数字上方引语', type: 'text', inlineEditable: true, defaultValue: '这一年，被写进年报的数字只有一个' },
    {
      key: 'caption',
      label: '数字下方注解',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '全年智能产业新增投资总额，为过去三年之和的 1.4 倍。',
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_TITLE = '1,024';
const DEFAULT_UNIT = '亿元';
const DEFAULT_SUBTITLE = '这一年，被写进年报的数字只有一个';
const DEFAULT_CAPTION = '全年智能产业新增投资总额，为过去三年之和的 1.4 倍。';

export function Theme09MegaNumberV1(props: Theme09MegaNumberV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    unit,
    caption,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const num = title && title.trim() ? title : DEFAULT_TITLE;
  const u = unit && unit.trim() ? unit : DEFAULT_UNIT;
  const lead = subtitle && subtitle.trim() ? subtitle : DEFAULT_SUBTITLE;
  const cap = caption && caption.trim() ? caption : DEFAULT_CAPTION;

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-mega-number">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-mega-number-body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 auto',
              minHeight: 0,
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                fontFamily: c.font,
                fontSize: '17px',
                letterSpacing: '.04em',
                color: c.ink3,
                paddingLeft: '4px',
              }}
            >
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="span">
                {lead}
              </EditableField>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', justifyContent: 'center' }}>
              <div
                style={{
                  fontFamily: c.fontHeading,
                  fontWeight: 700,
                  fontSize: '300px',
                  lineHeight: 0.82,
                  letterSpacing: '-0.055em',
                  color: c.ink,
                  textShadow: `0 0 60px ${t9Rgba(c.accent, 0.16)}`,
                }}
              >
                <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="span">
                  {num}
                </EditableField>
              </div>
              <div
                style={{
                  fontFamily: c.fontHeading,
                  fontWeight: 700,
                  fontSize: '38px',
                  lineHeight: 1,
                  color: c.accent,
                  paddingTop: '26px',
                  whiteSpace: 'nowrap',
                }}
              >
                <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
                  {u}
                </EditableField>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                justifyContent: 'center',
                paddingTop: '10px',
              }}
            >
              <span style={{ width: '58px', height: '2px', background: c.accent, flex: '0 0 auto' }} />
              <span
                style={{
                  fontFamily: c.font,
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: c.ink2,
                  maxWidth: '620px',
                  textAlign: 'center',
                }}
              >
                <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="span">
                  {cap}
                </EditableField>
              </span>
              <span style={{ width: '58px', height: '2px', background: c.accent, flex: '0 0 auto' }} />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
