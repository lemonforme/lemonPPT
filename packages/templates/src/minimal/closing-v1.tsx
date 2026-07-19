import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ClosingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const closingV1Meta: LayoutMeta = {
  id: 'closing_v1',
  theme: 'base',
  role: 'closing',
  displayName: '极简结尾',
  description: '居中大标题 + 行动号召，适合结尾页',
  needsMedia: false,
};

export function ClosingV1(props: ClosingV1Props): ReactNode {
  const { kicker, title, subtitle, cta, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-closing-v1">
      <div className="lp-closing-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-heading lp-closing-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-closing-subtitle">
            {subtitle}
          </EditableField>
        )}
        {cta && (
          <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-cta">
            {cta}
          </EditableField>
        )}
      </div>
    </div>
  );
}
