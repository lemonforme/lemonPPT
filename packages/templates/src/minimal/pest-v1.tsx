import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface PestV1Props {
  title: string;
  kicker?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const pestV1Meta: LayoutMeta = {
  id: 'minimal_pest_v1',
  theme: 'minimal',
  role: 'pest',
  displayName: 'PEST 分析',
  description: '2x2 PEST 宏观环境分析矩阵',
  needsMedia: false,
};

export function PestV1(props: PestV1Props): ReactNode {
  const { title, kicker, political, economic, social, technological, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-pest-v1">
      <div className="lp-pest-v1-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-pest-title">
          {title}
        </EditableField>
        <div className="lp-pest-grid">
          <div className="lp-pest-cell lp-pest-p">
            <h3>P</h3>
            <EditableField prop="political" slideIdx={_slideIdx} editable={_editable} as="p">
              {political || '政治环境'}
            </EditableField>
          </div>
          <div className="lp-pest-cell lp-pest-e">
            <h3>E</h3>
            <EditableField prop="economic" slideIdx={_slideIdx} editable={_editable} as="p">
              {economic || '经济环境'}
            </EditableField>
          </div>
          <div className="lp-pest-cell lp-pest-s">
            <h3>S</h3>
            <EditableField prop="social" slideIdx={_slideIdx} editable={_editable} as="p">
              {social || '社会环境'}
            </EditableField>
          </div>
          <div className="lp-pest-cell lp-pest-t">
            <h3>T</h3>
            <EditableField prop="technological" slideIdx={_slideIdx} editable={_editable} as="p">
              {technological || '技术环境'}
            </EditableField>
          </div>
        </div>
      </div>
    </div>
  );
}
