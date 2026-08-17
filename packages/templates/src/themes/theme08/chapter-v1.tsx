// lemonPPT - theme08 黑金实验 · 章节过渡
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';

export interface Theme08ChapterV1Props {
  index?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ChapterV1Meta: LayoutMeta = {
  id: 'theme08_chapter_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 章节过渡',
  description: '黑金大号章节序号 + 标题 + 副标题，强发布会章节感',
  needsMedia: false,
  tags: ['chapter', 'section', 'black-gold'],
  contentShape: 'chapter',
};

export const theme08ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'index', label: '章节序号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'kicker', label: '英文小标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'title', label: '章节标题', type: 'text', inlineEditable: true, defaultValue: '市场全景与趋势' },
    { key: 'subtitle', label: '章节副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本流向、技术拐点到生态格局，拆解高端科技叙事的底层逻辑。' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '02' },
  ],
};

export function Theme08ChapterV1(props: Theme08ChapterV1Props): ReactNode {
  const { index, kicker, title, subtitle, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-theme08 lp-theme08-chapter-page">
      <Theme08SlideBg />
      <div className="lp-theme08-watermark-number" aria-hidden="true">{index}</div>
      <div className="lp-theme08-chapter lp-rise">
        {index && (
          <div className="lp-theme08-chapter-index">
            <EditableField prop="index" slideIdx={_slideIdx} editable={_editable} as="span">{index}</EditableField>
          </div>
        )}
        {kicker && (
          <div className="lp-theme08-chapter-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme08-chapter-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-chapter-sub">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme08-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
