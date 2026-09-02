// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, NumberSticker, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01ScorecardV1Item {
  label?: string;
  score?: number;
  max?: number;
  note?: string;
}

export interface Theme01ScorecardV1Props {
  kicker?: string;
  title?: string;
  items?: Theme01ScorecardV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ScorecardV1Meta: LayoutMeta = {
  id: 'theme01_scorecard_v1',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 评分卡',
  description: '多维度评分卡 + 进度条',
  needsMedia: false,
};

export const theme01ScorecardV1Schema: PropsSchema = {
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
      key: 'items',
      label: '评分项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'score',
          label: '得分',
          type: 'number',
          inlineEditable: true,
        },
        {
          key: 'max',
          label: '满分',
          type: 'number',
          inlineEditable: true,
        },
        {
          key: 'note',
          label: '备注',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const barColors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-violet)', 'var(--lp-red)', 'var(--lp-cyan)', 'var(--lp-pink)', 'var(--lp-teal)'];

export function Theme01ScorecardV1(props: Theme01ScorecardV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;
  const safeItems = (items || []).slice(0, 8);

  return (
    <Sheet substrate="light" frame="grid" className="lp-scorecard-v1">
      <Blob
        className="lp-scorecard-v1-blob"
        style={{ width: 360, height: 360, top: -130, right: -90, background: 'var(--lp-cyan)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-scorecard-v1-dots"
        style={{ bottom: 90, right: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-scorecard-v1-slash"
        style={{ top: 110, left: 90, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-scorecard-v1-ring"
        style={{ width: 120, height: 120, bottom: 100, left: 80, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-scorecard-v1-plus"
        style={{ top: 140, right: 100, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-scorecard-v1-content">
        <div className="lp-scorecard-v1-header lp-rise">
          {kicker && (
            <div className="lp-scorecard-v1-kicker">
              <Pill variant="outline" color="violet">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title || ''} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        {safeItems.length > 0 && (
          <div className="lp-scorecard-v1-list">
            {safeItems.map((item, index) => {
              const score = typeof item.score === 'number' ? item.score : 0;
              const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
              const pct = Math.min(100, Math.max(0, (score / max) * 100));
              const color = barColors[index % barColors.length];
              return (
                <div key={index} className="lp-scorecard-v1-row lp-rise" style={{ animationDelay: `${index * 55}ms` }}>
                  <div className="lp-scorecard-v1-info">
                    <div className="lp-scorecard-v1-label-wrap">
                      <NumberSticker value={String(index + 1).padStart(2, '0')} outline />
                      <EditableField
                        prop={`items.${index}.label`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="span"
                        className="lp-scorecard-v1-label"
                      >
                        {item.label || ''}
                      </EditableField>
                    </div>
                    <div className="lp-scorecard-v1-score-wrap">
                      <span className="lp-scorecard-v1-score">{score}</span>
                      <span className="lp-scorecard-v1-max">/ {max}</span>
                    </div>
                  </div>
                  <div className="lp-scorecard-v1-bar">
                    <div
                      className="lp-scorecard-v1-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  {item.note && (
                    <EditableField
                      prop={`items.${index}.note`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-scorecard-v1-note"
                    >
                      {item.note}
                    </EditableField>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Folio
        left="SCORECARD"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
