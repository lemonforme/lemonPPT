// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  HighlightBlock,
  NumberSticker,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
  normalizeStrings,
} from './shared.js';

export interface Theme01ContentV2Props {
  kicker?: string;
  title: string;
  leftPoints?: string[];
  rightPoints?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV2Meta: LayoutMeta = {
  id: 'theme01_content_v2',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 双栏内容',
  description: '分屏布局：左侧标题要点 + 右侧时间线色块',
  needsMedia: false,
};

export const theme01ContentV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    {
      key: 'leftPoints',
      label: '左侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'rightPoints',
      label: '右侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
  ],
};

const POINT_COLORS = ['blue', 'green', 'amber', 'red', 'violet'] as const;
const TIMELINE_COLORS = ['amber', 'green', 'blue', 'red', 'violet'] as const;

export function Theme01ContentV2(props: Theme01ContentV2Props): ReactNode {
  const { kicker, title, leftPoints = [], rightPoints = [], _slideIdx, _editable } = props;
  const left = normalizeStrings(leftPoints);
  const right = normalizeStrings(rightPoints);

  return (
    <Sheet substrate="tint" tint="blue" frame="split" className="lp-content-v2">
      <Blob
        className="lp-content-v2-blob"
        style={{ width: 380, height: 380, bottom: -140, left: -100, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-content-v2-dots"
        style={{ top: 120, right: 80, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-content-v2-slash"
        style={{ top: 110, left: 90, height: 70, background: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-content-v2-plus"
        style={{ bottom: 100, right: 100, width: 28, height: 28, color: 'var(--lp-green)' }}
      />
      <Ring
        className="lp-content-v2-ring"
        style={{ top: 110, right: 110, width: 60, height: 60, borderColor: 'var(--lp-red)' }}
      />

      <div className="lp-content-v2-main lp-rise">
        {kicker && (
          <div className="lp-content-v2-kicker">
            <Pill variant="fill" color="blue">{kicker}</Pill>
          </div>
        )}
        <Headline cn={title || '双栏内容'} size="large" className="lp-content-v2-headline" />
        <ul className="lp-content-v2-list">
          {left.map((point, index) => {
            const color = POINT_COLORS[index % POINT_COLORS.length];
            return (
              <li key={index} className={`color-${color}`}>
                <span className="lp-content-v2-bullet" aria-hidden="true" />
                <EditableField prop={`leftPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {point}
                </EditableField>
              </li>
            );
          })}
        </ul>
      </div>

      <HighlightBlock className="lp-content-v2-side lp-rise" color="blue" curled>
        <div className="lp-content-v2-side-title">关键历程</div>
        <div className="lp-content-v2-timeline">
          {right.map((point, index) => {
            const color = TIMELINE_COLORS[index % TIMELINE_COLORS.length];
            return (
              <div key={index} className="lp-content-v2-timeline-item">
                <NumberSticker value={String(index + 1).padStart(2, '0')} className={`lp-content-v2-timeline-number color-${color}`} />
                <EditableField prop={`rightPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-content-v2-timeline-text">
                  {point}
                </EditableField>
              </div>
            );
          })}
        </div>
      </HighlightBlock>

      <Folio
        left="CONTENT"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
