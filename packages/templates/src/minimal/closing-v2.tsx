import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ClosingV2Props {
  title: string;
  subtitle?: string;
  contact?: string;
  email?: string;
  link?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const closingV2Meta: LayoutMeta = {
  id: 'minimal_closing_v2',
  theme: 'minimal',
  role: 'closing',
  displayName: '联系方式结尾',
  description: '结尾页 + 联系方式/邮箱/链接',
  needsMedia: false,
};

export function ClosingV2(props: ClosingV2Props): ReactNode {
  const { title, subtitle, contact, email, link, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-closing-v2">
      <div className="lp-closing-v2-content">
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-heading lp-closing-v2-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-closing-v2-subtitle">
            {subtitle}
          </EditableField>
        )}
        <div className="lp-closing-v2-contacts">
          {contact && (
            <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-contact">
              {contact}
            </EditableField>
          )}
          {email && (
            <EditableField prop="email" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-email">
              {email}
            </EditableField>
          )}
          {link && (
            <EditableField prop="link" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-link">
              {link}
            </EditableField>
          )}
        </div>
      </div>
    </div>
  );
}
