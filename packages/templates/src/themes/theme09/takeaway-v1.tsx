// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 核心要点（takeaway_v1）
 * 基底：墨 | 骨架：sidebar | 图位：1
 *
 * 左栏编号要点列表（3–5 条，大号编号 + 标题 + 说明），
 * 右侧一条窄幅影像，作为整页的收口视觉。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09TakeawayPoint {
  number?: string;
  title?: string;
  summary?: string;
}

export interface Theme09TakeawayV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  points?: Theme09TakeawayPoint[];
  image?: string;
  imageCaption?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TakeawayV1Meta: LayoutMeta = {
  id: 'theme09_takeaway_v1',
  theme: 'theme09',
  role: 'content',
  displayName: '核心要点',
  description: '编号要点列表（3–5 条）+ 大号编号 + 右侧窄条影像，墨底',
  needsMedia: true,
  mediaSlots: [{ name: '要点影像', fieldPath: 'image', canPresetMedia: true }],
  tags: ['takeaway', 'summary', 'points', 'sidebar', 'photo'],
  contentShape: 'numbered-takeaways',
};

export const theme09TakeawayV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '核心要点' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'KEY TAKEAWAYS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '如果只带走四句话' },
    {
      key: 'points',
      label: '要点',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      itemSchema: [
        { key: 'number', label: '编号', type: 'text' },
        { key: 'title', label: '要点标题', type: 'text' },
        { key: 'summary', label: '要点说明', type: 'textarea' },
      ],
    },
    { key: 'image', label: '要点影像', type: 'image', defaultValue: '' },
    { key: 'imageCaption', label: '影像说明', type: 'text', inlineEditable: true, defaultValue: 'KEY TAKEAWAYS / 2026' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '要点 · 收口' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_POINTS: Theme09TakeawayPoint[] = [
  {
    number: '01',
    title: '溢价正在离开底座',
    summary: '通用底座的定价权随产能释放而下滑，收入结构里模型订阅的占比连续两年走低。',
  },
  {
    number: '02',
    title: '交付能力决定续约',
    summary: '续约率与实施队伍规模的相关性，明显高于与模型指标的相关性，交付即护城河。',
  },
  {
    number: '03',
    title: '模板化是降本关键',
    summary: '行业模板把单项目人日压到六成，复制速度成为区域扩张能否成立的前提。',
  },
  {
    number: '04',
    title: '合规成本已可预期',
    summary: '备案与授权规则定型后，单项目合规支出稳定在营收 3% 上下，不再是决策变量。',
  },
];

const DEFAULT_CAPTION = 'KEY TAKEAWAYS / 2026';

export function Theme09TakeawayV1(props: Theme09TakeawayV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    points = [],
    image,
    imageCaption,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (points.length ? points : DEFAULT_POINTS).slice(0, 5);
  const caption = imageCaption ?? DEFAULT_CAPTION;

  return (
    <Sheet substrate="ink" frame="sidebar" className="lp-theme09-takeaway">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', gap: 40, padding: '96px 60px 70px' }}>
        {/* 左：编号要点 */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {title && (
            <h2
              className="lp-t9-serif"
              style={{ margin: 0, fontSize: 34, fontWeight: 700, lineHeight: 1.22, color: 'var(--lp-ink)', flex: 'none' }}
            >
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}

          <ol
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
              flex: '1 1 auto',
              minHeight: 0,
            }}
          >
            {list.map((pt, i) => (
              <li
                key={i}
                className="lp-rise"
                style={{
                  display: 'flex',
                  gap: 20,
                  borderTop: `1px solid ${i === 0 ? 'var(--lp-accent)' : 'var(--lp-t9-rule)'}`,
                  paddingTop: 13,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                <span
                  className="lp-t9-serif"
                  style={{
                    flex: 'none',
                    width: 62,
                    fontSize: 44,
                    fontWeight: 700,
                    lineHeight: 0.94,
                    letterSpacing: '-0.03em',
                    color: i === 0 ? 'var(--lp-accent)' : 'var(--lp-ink3)',
                  }}
                >
                  <EditableField prop={`points.${i}.number`} slideIdx={s} editable={e} as="span">
                    {pt.number ?? String(i + 1).padStart(2, '0')}
                  </EditableField>
                </span>

                <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3
                    className="lp-t9-serif"
                    style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.32, color: 'var(--lp-ink)' }}
                  >
                    <EditableField prop={`points.${i}.title`} slideIdx={s} editable={e} as="span">
                      {pt.title ?? ''}
                    </EditableField>
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.76, color: 'var(--lp-ink2)', paddingRight: 6 }}>
                    <EditableField prop={`points.${i}.summary`} slideIdx={s} editable={e} as="span">
                      {pt.summary ?? ''}
                    </EditableField>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 右：窄条影像 */}
        <div style={{ flex: 'none', width: 248, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InkPhoto
            prop="image"
            src={image}
            slideIdx={s}
            editable={e}
            ratio="fill"
            hint="上传要点影像"
            scrim="bottom"
            style={{ flex: '1 1 auto', minHeight: 0 }}
          />
          <span
            style={{
              flex: 'none',
              fontFamily: 'var(--lp-font-mono)',
              fontSize: 11,
              letterSpacing: '0.16em',
              color: 'var(--lp-ink3)',
            }}
          >
            <EditableField prop="imageCaption" slideIdx={s} editable={e} as="span">
              {caption}
            </EditableField>
          </span>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
