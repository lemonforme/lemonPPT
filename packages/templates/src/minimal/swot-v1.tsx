import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface SwotV1Props {
  title: string;
  kicker?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const swotV1Meta: LayoutMeta = {
  id: 'swot_v1',
  theme: 'base',
  role: 'swot',
  displayName: 'SWOT 分析',
  description: '2x2 SWOT 分析矩阵',
  needsMedia: false,
};

export function SwotV1(props: SwotV1Props): ReactNode {
  const { title, kicker, strength, weakness, opportunity, threat, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-swot-v1">
      <div className="lp-swot-v1-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-swot-title">
          {title}
        </EditableField>
        <div className="lp-swot-grid">
          <div className="lp-swot-cell lp-swot-s">
            <h3>S</h3>
            <EditableField prop="strength" slideIdx={_slideIdx} editable={_editable} as="p">
              {strength || '优势'}
            </EditableField>
          </div>
          <div className="lp-swot-cell lp-swot-w">
            <h3>W</h3>
            <EditableField prop="weakness" slideIdx={_slideIdx} editable={_editable} as="p">
              {weakness || '劣势'}
            </EditableField>
          </div>
          <div className="lp-swot-cell lp-swot-o">
            <h3>O</h3>
            <EditableField prop="opportunity" slideIdx={_slideIdx} editable={_editable} as="p">
              {opportunity || '机会'}
            </EditableField>
          </div>
          <div className="lp-swot-cell lp-swot-t">
            <h3>T</h3>
            <EditableField prop="threat" slideIdx={_slideIdx} editable={_editable} as="p">
              {threat || '威胁'}
            </EditableField>
          </div>
        </div>
      </div>
    </div>
  );
}
