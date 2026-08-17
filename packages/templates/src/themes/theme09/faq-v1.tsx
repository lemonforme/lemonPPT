// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 关键问答（faq_v1）
 * 基底：纸 | 骨架：grid | 图位：—
 *
 * Q/A 双栏列表：问句挂专色圆角徽章，答句为正文段落。
 * 折叠展开由原生 details/summary 承担，纯 CSS，无需脚本状态。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Folio, Masthead, Sheet } from './shared.js';

export interface Theme09FaqItem {
  question?: string;
  answer?: string;
}

export interface Theme09FaqV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  faqs?: Theme09FaqItem[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09FaqV1Meta: LayoutMeta = {
  id: 'theme09_faq_v1',
  theme: 'theme09',
  role: 'faq',
  displayName: '关键问答',
  description: 'Q/A 双栏列表 + 专色圆角问句徽章 + 原生折叠展开，纸底',
  needsMedia: false,
  tags: ['faq', 'qa', 'grid', 'questions'],
  contentShape: 'faq-list',
};

export const theme09FaqV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '关键问答' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'Q & A' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '49' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '评审会上最常被追问的六个问题' },
    {
      key: 'faqs',
      label: '问答',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'question', label: '问题', type: 'text' },
        { key: 'answer', label: '回答', type: 'textarea' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '问答 · 答疑' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '49' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_FAQS: Theme09FaqItem[] = [
  {
    question: '为什么不等下一代模型出来再动？',
    answer: '收益来自流程与数据的重排，这部分工作与模型代际无关；等待只会把同样的准备期后移一年。',
  },
  {
    question: '预算超支的风险怎么控制？',
    answer: '按季度设置停止线，任一场景连续两个季度未达基线即暂停投入，剩余额度回流至已验证场景。',
  },
  {
    question: '数据出域的合规怎么解决？',
    answer: '核心数据留在域内，只把脱敏后的特征送出；跨境部分走轻量版方案，单独走一次备案。',
  },
  {
    question: '现有团队能不能接得住？',
    answer: '试点阶段由中台团队兜底，第二季度起用标准手册带教区域实施，人员缺口按两名/区域补充。',
  },
  {
    question: '效果怎么被证明是真的？',
    answer: '每个场景设对照组，效果以对照组差值计量，由财务与业务双口径共同签字确认。',
  },
  {
    question: '如果供应商变更怎么办？',
    answer: '接口层做了抽象，模型能力可替换；切换成本已按一次性两周工作量计入预算。',
  },
];

export function Theme09FaqV1(props: Theme09FaqV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    faqs = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (faqs.length ? faqs : DEFAULT_FAQS).slice(0, 6);

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-faq">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18, padding: '96px 60px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flex: 'none' }}>
          {title && (
            <h2
              className="lp-t9-serif"
              style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)' }}
            >
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          <ColorBar count={6} className="lp-theme09-faq-bar" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: 40,
            rowGap: 14,
            alignContent: 'space-between',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          {list.map((item, i) => {
            const tone = i % 2 === 0 ? 'var(--lp-accent)' : `var(--lp-series-${(i % 6) + 1})`;
            return (
              <details
                key={i}
                open
                className="lp-rise"
                style={{
                  borderTop: '1px solid var(--lp-t9-rule)',
                  paddingTop: 12,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <summary
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 11,
                    listStyle: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 'none',
                      minWidth: 30,
                      height: 22,
                      borderRadius: 5,
                      background: tone,
                      color: 'var(--lp-on-accent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      padding: '0 6px',
                      marginTop: 1,
                    }}
                  >
                    {`Q${i + 1}`}
                  </span>
                  <span
                    className="lp-t9-serif"
                    style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.42, color: 'var(--lp-ink)', minWidth: 0 }}
                  >
                    <EditableField prop={`faqs.${i}.question`} slideIdx={s} editable={e} as="span">
                      {item.question ?? ''}
                    </EditableField>
                  </span>
                </summary>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, paddingTop: 8 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 'none',
                      minWidth: 30,
                      height: 22,
                      borderRadius: 5,
                      border: '1px solid var(--lp-border-strong)',
                      color: 'var(--lp-ink3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      padding: '0 6px',
                    }}
                  >
                    A
                  </span>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.76, color: 'var(--lp-ink2)', minWidth: 0 }}>
                    <EditableField prop={`faqs.${i}.answer`} slideIdx={s} editable={e} as="span">
                      {item.answer ?? ''}
                    </EditableField>
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
