import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface QuoteV1Props {
  quote: string;
  author?: string;
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const quoteV1Meta: LayoutMeta = {
  id: 'quote_v1',
  theme: 'base',
  role: 'quote',
  displayName: '引用观点',
  description: '大段引用 + 作者/来源',
  needsMedia: false,
};

export function QuoteV1(props: QuoteV1Props): ReactNode {
  const { quote, author, source, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-quote-v1">
      <div className="lp-quote-inner">
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-quote-text">
          “{quote}”
        </EditableField>
        {(author || source) && (
          <div className="lp-quote-attribution">
            {author && (
              <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-author">
                {author}
              </EditableField>
            )}
            {author && source && <span className="lp-quote-divider">·</span>}
            {source && (
              <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-source">
                {source}
              </EditableField>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
