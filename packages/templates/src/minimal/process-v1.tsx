import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const processV1Meta: LayoutMeta = {
  id: 'minimal_process_v1',
  theme: 'minimal',
  role: 'process',
  displayName: '横向流程',
  description: '横向步骤流程，适合流程说明',
  needsMedia: false,
};

export function ProcessV1(props: ProcessV1Props): ReactNode {
  const { kicker, title, steps = [], _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-process-v1">
      <div className="lp-process-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-process-title">
          {title}
        </EditableField>
        {steps.length > 0 && (
          <div className="lp-process-steps">
            {steps.map((step, index) => (
              <div key={index} className="lp-process-step">
                <div className="lp-process-step-number">{index + 1}</div>
                <EditableField
                  prop={`steps.${index}`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-process-step-text"
                >
                  {step}
                </EditableField>
                {index < steps.length - 1 && <div className="lp-process-arrow" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
