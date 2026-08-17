// lemonPPT - theme08 黑金实验 · 团队
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08TeamV1Member {
  name: string;
  role?: string;
  initial?: string;
}

export interface Theme08TeamV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08TeamV1Member[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08TeamV1Meta: LayoutMeta = {
  id: 'theme08_team_v1',
  theme: 'theme08',
  role: 'team',
  displayName: 'Theme 08 团队',
  description: '头像 + 姓名 + 角色的四宫格，适合团队/人物',
  needsMedia: false,
  tags: ['team', 'people', 'black-gold'],
  contentShape: 'team',
};

export const theme08TeamV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'THE TEAM' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心团队' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '跨学科背景，覆盖研究、工程与商业。' },
    {
      key: 'items',
      label: '成员',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { name: '林深', role: '首席科学家', initial: 'LS' },
        { name: '周岚', role: '工程负责人', initial: 'ZL' },
        { name: '陈野', role: '产品负责人', initial: 'CY' },
        { name: '苏阳', role: '生态负责人', initial: 'SY' },
      ],
      itemSchema: [
        { key: 'name', label: '姓名', type: 'text' },
        { key: 'role', label: '角色', type: 'text' },
        { key: 'initial', label: '字标', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '44' },
  ],
};

export function Theme08TeamV1(props: Theme08TeamV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 4);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-team-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="bolt" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-team lp-rise">
            {valid.map((m, i) => (
              <div key={i} className="lp-theme08-card lp-theme08-card-pad lp-theme08-team-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme08-team-avatar"><EditableField prop={`items.${i}.initial`} slideIdx={_slideIdx} editable={_editable} as="span">{m.initial || m.name?.[0] || '·'}</EditableField></div>
                <div className="lp-theme08-team-name"><EditableField prop={`items.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{m.name}</EditableField></div>
                {m.role && <div className="lp-theme08-team-role"><EditableField prop={`items.${i}.role`} slideIdx={_slideIdx} editable={_editable} as="span">{m.role}</EditableField></div>}
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
