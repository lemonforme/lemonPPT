// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Arrow,
  Blob,
  DottedPattern,
  Headline,
  Masthead,
  NumberSticker,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ProcessV1Meta: LayoutMeta = {
  id: 'theme01_process_v1',
  theme: 'theme01',
  role: 'process',
  displayName: 'Theme 01 横向流程',
  description: '色块拼贴横向步骤流程',
  needsMedia: false,
};

export const theme01ProcessV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const STEP_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan', 'pink', 'lime'] as const;

export function Theme01ProcessV1(props: Theme01ProcessV1Props): ReactNode {
  const { kicker, title, steps = [], _slideIdx, _editable } = props;
  const safeSteps = steps.slice(0, 8);

  return (
    <Sheet substrate="light" frame="grid" className="lp-process-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="PROCESS" size="large" className="lp-process-v1-headline lp-rise" />
      {safeSteps.length > 0 && (
        <div className="lp-process-v1-track lp-rise">
          {safeSteps.map((step, index) => {
            const color = STEP_COLORS[index % STEP_COLORS.length];
            const isLast = index === safeSteps.length - 1;
            return (
              <div key={index} className={`lp-process-v1-step color-${color}`}>
                <NumberSticker value={String(index + 1).padStart(2, '0')} className="lp-process-v1-number" />
                <EditableField
                  prop={`steps.${index}`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-process-v1-text"
                >
                  {step}
                </EditableField>
                {!isLast && <Arrow direction="right" className="lp-process-v1-arrow" />}
              </div>
            );
          })}
        </div>
      )}
      <Blob
        className="lp-process-v1-blob"
        style={{ width: 320, height: 320, bottom: -100, right: -70, background: 'var(--lp-amber)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-process-v1-dots"
        style={{ top: 130, left: 60, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-process-v1-slash"
        style={{ top: 110, right: 90, height: 56, background: 'var(--lp-blue)', opacity: 0.55 }}
      />
      <Plus
        className="lp-process-v1-plus"
        style={{ bottom: 90, left: 80, width: 24, height: 24, color: 'var(--lp-green)' }}
      />
      <Ring
        className="lp-process-v1-ring"
        style={{ bottom: 80, right: 100, width: 56, height: 56, borderColor: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
