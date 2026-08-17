// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 投资展望（outlook_v1）
 * 基底：墨 | 骨架：sidebar | 图位：1
 *
 * 左栏三条展望（编号 + 标题 + 描述 + 趋势箭头），右侧影像出血位。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09OutlookItem {
  title?: string;
  description?: string;
  trend?: string;
}

export interface Theme09OutlookV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  outlooks?: Theme09OutlookItem[];
  image?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09OutlookV1Meta: LayoutMeta = {
  id: 'theme09_outlook_v1',
  theme: 'theme09',
  role: 'content',
  displayName: '投资展望',
  description: '三条纵向展望 + 趋势箭头 + 右侧影像窄栏，墨底',
  needsMedia: true,
  mediaSlots: [{ name: '展望影像', fieldPath: 'image', canPresetMedia: true }],
  tags: ['outlook', 'forecast', 'sidebar', 'photo'],
  contentShape: 'outlook',
};

export const theme09OutlookV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '投资展望' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'OUTLOOK' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '07' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '下一年度的三条主线' },
    {
      key: 'outlooks',
      label: '展望条目',
      type: 'array',
      maxItems: 3,
      itemSchema: [
        { key: 'title', label: '展望标题', type: 'text' },
        { key: 'description', label: '展望说明', type: 'textarea' },
        { key: 'trend', label: '趋势（上行/下行/持平）', type: 'text' },
      ],
    },
    { key: 'image', label: '展望影像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '展望 · 配置' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_OUTLOOKS: Theme09OutlookItem[] = [
  {
    title: '算力租赁进入买方市场',
    description: '集群交付集中释放，单位算力价格年内预计回落 18%–24%，长约议价权转向需求方。',
    trend: '下行',
  },
  {
    title: '应用层估值中枢上移',
    description: '具备行业数据与交付队伍的应用主体，收入可预测性提升，估值倍数有望修复至 8–10 倍。',
    trend: '上行',
  },
  {
    title: '合规成本趋于稳定',
    description: '备案流程与语料授权规则逐步定型，头部主体的单项目合规支出维持在营收的 3% 上下。',
    trend: '持平',
  },
];

function trendGlyph(trend?: string): { glyph: string; tone: string } {
  const s = String(trend ?? '').trim();
  if (/上行|上升|增长|up|↑|↗/i.test(s)) return { glyph: '↗', tone: 'var(--lp-teal)' };
  if (/下行|下降|回落|down|↓|↘/i.test(s)) return { glyph: '↘', tone: 'var(--lp-accent)' };
  return { glyph: '→', tone: 'var(--lp-amber)' };
}

export function Theme09OutlookV1(props: Theme09OutlookV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    outlooks = [],
    image,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (outlooks.length ? outlooks : DEFAULT_OUTLOOKS).slice(0, 3);

  return (
    <Sheet substrate="ink" frame="sidebar" className="lp-theme09-outlook">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', gap: 40, padding: '96px 60px 70px' }}>
        {/* 左：三条展望 */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.24, color: 'var(--lp-ink)' }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, justifyContent: 'space-between', gap: 14 }}>
            {list.map((it, i) => {
              const t = trendGlyph(it.trend);
              return (
                <article
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 18,
                    borderTop: '1px solid var(--lp-t9-rule)',
                    paddingTop: 14,
                    flex: '1 1 0',
                    minHeight: 0,
                  }}
                >
                  <span
                    className="lp-t9-serif"
                    style={{
                      flex: 'none',
                      width: 52,
                      fontSize: 34,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: 'var(--lp-accent)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 className="lp-t9-serif" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--lp-ink)', lineHeight: 1.3 }}>
                        <EditableField prop={`outlooks.${i}.title`} slideIdx={s} editable={e} as="span">
                          {it.title ?? ''}
                        </EditableField>
                      </h3>
                      <span
                        style={{
                          flex: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          border: `1px solid ${t.tone}`,
                          color: t.tone,
                          fontFamily: 'var(--lp-font-mono)',
                          fontSize: 11,
                          letterSpacing: '0.1em',
                          padding: '2px 7px',
                        }}
                      >
                        <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>{t.glyph}</span>
                        <EditableField prop={`outlooks.${i}.trend`} slideIdx={s} editable={e} as="span">
                          {it.trend ?? '持平'}
                        </EditableField>
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.76, color: 'var(--lp-ink2)' }}>
                      <EditableField prop={`outlooks.${i}.description`} slideIdx={s} editable={e} as="span">
                        {it.description ?? ''}
                      </EditableField>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 右：影像窄栏 */}
        <div style={{ flex: 'none', width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InkPhoto
            prop="image"
            src={image}
            slideIdx={s}
            editable={e}
            ratio="fill"
            hint="上传展望影像"
            scrim="bottom"
            style={{ flex: '1 1 auto', minHeight: 0 }}
          />
          <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--lp-ink3)', flex: 'none' }}>
            OUTLOOK / NEXT 12 MONTHS
          </span>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
