import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ProcessV2Props {
  kicker?: string;
  title: string;
  steps?: { title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const processV2Meta: LayoutMeta = {
  id: 'process_v2',
  theme: 'base',
  role: 'process',
  displayName: '垂直时间线',
  description: '垂直时间线流程，每个步骤含标题和描述',
  needsMedia: false,
};

export function ProcessV2(props: ProcessV2Props): ReactNode {
  const { kicker, title, steps = [], _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-process-v2">
      <div className="lp-process-v2-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-process-v2-title">
          {title}
        </EditableField>
        {steps.length > 0 && (
          <div className="lp-process-v2-timeline">
            {steps.map((step, index) => (
              <div key={index} className="lp-process-v2-step">
                <div className="lp-process-v2-marker">{index + 1}</div>
                <div className="lp-process-v2-content">
                  <EditableField
                    prop={`steps.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                  >
                    {step.title || `步骤 ${index + 1}`}
                  </EditableField>
                  {step.description && (
                    <EditableField
                      prop={`steps.${index}.description`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                    >
                      {step.description}
                    </EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
