// lemonPPT - theme08 黑金实验 · 金句 / 主张
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';

export interface Theme08QuoteV1Props {
  text: string;
  author?: string;
  kicker?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08QuoteV1Meta: LayoutMeta = {
  id: 'theme08_quote_v1',
  theme: 'theme08',
  role: 'quote',
  displayName: 'Theme 08 金句主张',
  description: '超大主张文字 + 署名，荧光金强调，适合金句/价值观页',
  needsMedia: false,
  tags: ['quote', 'statement', 'black-gold'],
  contentShape: 'quote',
};

export const theme08QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'OUR THESIS' },
    { key: 'text', label: '主张文字', type: 'textarea', inlineEditable: true, defaultValue: '真正的护城河，不是模型参数，而是把算力、数据与场景拧成一股绳的体系能力。' },
    { key: 'author', label: '署名', type: 'text', inlineEditable: true, defaultValue: '— 黑金实验工作室' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '16' },
  ],
};

export function Theme08QuoteV1(props: Theme08QuoteV1Props): ReactNode {
  const { text, author, kicker, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-theme08 lp-theme08-quote-page">
      <Theme08SlideBg />
      <div className="lp-theme08-quote lp-rise">
        {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
        <div className="lp-theme08-quote-mark" aria-hidden="true">“</div>
        <EditableField prop="text" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-quote-text">{text}</EditableField>
        {author && <div className="lp-theme08-quote-author"><EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span">{author}</EditableField></div>}
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
