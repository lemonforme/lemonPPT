// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 刊头封面（cover_masthead_v1）
 * 基底：墨 | 骨架：column-3 | 图位：0
 *
 * 报头式横排刊名压顶，双规线夹住导语条，正文左重右轻双栏，
 * 底部专色色标条收口 —— 完整复刻杂志报头的信息层级。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverMastheadV1Props {
  title: string;
  issueEn?: string;
  issue?: string;
  strapline?: string;
  straplineEn?: string;
  kick: string;
  lead?: string;
  items?: string[];
  sign?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverMastheadV1Meta: LayoutMeta = {
  id: 'theme09_cover_masthead_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 刊头封面',
  description: '报头式刊名 + 期号栏线 + 双栏导语 + 专色色标条，适合特刊/年度报告开篇',
  needsMedia: false,
  tags: ['cover', 'masthead', 'editorial', 'ink'],
  contentShape: 'cover-masthead',
};

export const theme09CoverMastheadV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '刊名', type: 'text', inlineEditable: true, defaultValue: '墨 韵 专 刊' },
    { key: 'issueEn', label: '期号（英）', type: 'text', inlineEditable: true, defaultValue: 'VOL. 09' },
    { key: 'issue', label: '出版信息', type: 'text', inlineEditable: true, defaultValue: '2026 年度特刊 · 内部发行' },
    { key: 'strapline', label: '导语条', type: 'text', inlineEditable: true, defaultValue: '品牌叙事 · 人物访谈 · 深度专题' },
    { key: 'straplineEn', label: '导语条（英）', type: 'text', inlineEditable: true, defaultValue: 'Ink Rhythm Editorial' },
    { key: 'kick', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '把一年的重量，压进一叠纸里' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '从第一条产线到第一位用户，我们用十二个月记录下所有值得被印刷的瞬间。' },
    {
      key: 'items',
      label: '本期看点',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: ['创始团队口述：那些没写进财报的决定', '产品线全景：从原型到量产的 400 天', '用户田野：走进十二座城市的真实场景'],
      itemSchema: [{ key: 'item', label: '看点', type: 'text' }],
    },
    { key: 'sign', label: '落款', type: 'text', inlineEditable: true, defaultValue: 'EDITED BY LEMONPPT STUDIO' },
  ],
};

export function Theme09CoverMastheadV1(props: Theme09CoverMastheadV1Props): ReactNode {
  const { title, issueEn, issue, strapline, straplineEn, kick, lead, sign, _slideIdx: s, _editable: e } = props;
  const items = normalizeStrings(props.items).slice(0, 5);

  return (
    <Sheet substrate="ink" frame="column-3" className="lp-theme09-covermast" cropMarks>
      <div className="lp-theme09-covermast-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-covermast-title">
          {title}
        </EditableField>
        {(issueEn || issue) && (
          <div className="lp-theme09-covermast-issue">
            {issueEn && (
              <EditableField prop="issueEn" slideIdx={s} editable={e} as="strong">
                {issueEn}
              </EditableField>
            )}
            {issue && (
              <EditableField prop="issue" slideIdx={s} editable={e} as="span">
                {issue}
              </EditableField>
            )}
          </div>
        )}
      </div>

      {(strapline || straplineEn) && (
        <div className="lp-theme09-covermast-strap lp-rise" style={{ animationDelay: '60ms' }}>
          {strapline && (
            <EditableField prop="strapline" slideIdx={s} editable={e} as="span">
              {strapline}
            </EditableField>
          )}
          {straplineEn && <span className="lp-theme09-rule" aria-hidden="true" />}
          {straplineEn && (
            <EditableField prop="straplineEn" slideIdx={s} editable={e} as="span">
              {straplineEn}
            </EditableField>
          )}
        </div>
      )}

      <div className="lp-theme09-covermast-body">
        <div className="lp-theme09-covermast-lead lp-rise" style={{ animationDelay: '120ms' }}>
          <EditableField prop="kick" slideIdx={s} editable={e} as="h2" className="lp-theme09-covermast-kick">
            {kick}
          </EditableField>
          {lead && (
            <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme09-lede">
              {lead}
            </EditableField>
          )}
        </div>

        {items.length > 0 && (
          <div className="lp-theme09-covermast-side lp-rise" style={{ animationDelay: '180ms' }}>
            {items.map((t, i) => (
              <div key={i} className="lp-theme09-covermast-item">
                <span className="lp-theme09-covermast-item-no">{String(i + 1).padStart(2, '0')}</span>
                <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span" className="lp-theme09-covermast-item-txt">
                  {t}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme09-covermast-foot">
        <ColorBar count={6} />
        {sign && (
          <EditableField prop="sign" slideIdx={s} editable={e} as="span" className="lp-theme09-covermast-sign">
            {sign}
          </EditableField>
        )}
      </div>
    </Sheet>
  );
}
