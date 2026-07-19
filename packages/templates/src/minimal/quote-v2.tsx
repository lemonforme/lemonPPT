import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const quoteV2Meta: LayoutMeta = {
  id: 'quote_v2',
  theme: 'base',
  role: 'quote',
  displayName: '侧栏引用',
  description: '左侧 accent 边框的引用样式',
  needsMedia: false,
};

export function QuoteV2(props: QuoteV2Props): ReactNode {
  const { quote, author, role, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-quote-v2">
      <div className="lp-quote-v2-inner">
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-quote-v2-text">
          {quote}
        </EditableField>
        {(author || role) && (
          <div className="lp-quote-v2-attribution">
            {author && (
              <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-v2-author">
                {author}
              </EditableField>
            )}
            {role && (
              <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-v2-role">
                {role}
              </EditableField>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
