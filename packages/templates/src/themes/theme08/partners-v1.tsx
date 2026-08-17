// lemonPPT - theme08 黑金实验 · 合作伙伴
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08PartnersV1Item {
  name: string;
}

export interface Theme08PartnersV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08PartnersV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08PartnersV1Meta: LayoutMeta = {
  id: 'theme08_partners_v1',
  theme: 'theme08',
  role: 'partners',
  displayName: 'Theme 08 合作伙伴',
  description: 'logo 墙网格，适合生态/合作展示',
  needsMedia: false,
  tags: ['partners', 'logos', 'black-gold'],
  contentShape: 'partners',
};

export const theme08PartnersV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ECOSYSTEM' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '生态合作伙伴' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '与算力、数据与渠道伙伴共建价值网络。' },
    {
      key: 'items',
      label: '伙伴',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: 'NOVA' }, { name: 'ORBIT' }, { name: 'PRISM' }, { name: 'AXON' },
        { name: 'HELIX' }, { name: 'QUARK' }, { name: 'VECTOR' }, { name: 'LUMEN' },
      ],
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '54' },
  ],
};

export function Theme08PartnersV1(props: Theme08PartnersV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 8);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-partners-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="globe" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-partners lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-partner-cell" style={{ animationDelay: `${i * 40}ms` }}>
                <EditableField prop={`items.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{it.name}</EditableField>
              </div>
            ))}
          </div>
        </div>
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
