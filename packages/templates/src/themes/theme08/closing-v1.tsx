// lemonPPT - theme08 黑金实验 · 结尾致谢
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ClosingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  contact?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ClosingV1Meta: LayoutMeta = {
  id: 'theme08_closing_v1',
  theme: 'theme08',
  role: 'closing',
  displayName: 'Theme 08 结尾致谢',
  description: '居中大标题 + 标签 + 联系方式，适合收尾',
  needsMedia: false,
  tags: ['closing', 'thanks', 'black-gold'],
  contentShape: 'closing',
};

export const theme08ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'THANK YOU' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一起定义下一个时代' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '感谢每一位同行者，期待与您共建黑金实验。' },
    {
      key: 'tags',
      label: '标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['高端发布', '品牌提案', '实验概念'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    { key: 'contact', label: '联系方式', type: 'text', inlineEditable: true, defaultValue: 'hello@blackgold.studio' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: 'ENDING' },
  ],
};

export function Theme08ClosingV1(props: Theme08ClosingV1Props): ReactNode {
  const { kicker, title, subtitle, tags = [], contact, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const normalizedTags = (tags || [])
    .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
    .filter(Boolean);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-closing-page">
      <Theme08SlideBg />
      <div className="lp-theme08-watermark-number" aria-hidden="true">08</div>
      <div className="lp-theme08-closing lp-rise">
        <Theme08IconChip name="spark" size={48} />
        {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme08-closing-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-closing-sub">{subtitle}</EditableField>}
        {normalizedTags.length > 0 && (
          <div className="lp-theme08-closing-tags">
            {normalizedTags.map((t, i) => (
              <span key={i} className="lp-theme08-closing-tag"><EditableField prop={`tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField></span>
            ))}
          </div>
        )}
        {contact && <div className="lp-theme08-closing-sub"><EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="span">{contact}</EditableField></div>}
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
