// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

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
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
    {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'note',
          label: '备注',
          type: 'textarea',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01ScorecardV1(props: Theme01ScorecardV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-scorecard-v1">
      <div className="lp-scorecard-v1-inner">
    {kicker && (
          <EditableField
      prop="kicker"
      slideIdx={_slideIdx}
      editable={_editable}
      as="div"
      className="lp-pill lp-rise"
          >
      {kicker}
          </EditableField>
    )}
    <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h2"
          className="lp-head lp-scorecard-v1-title lp-rise"
    >
          {title}
    </EditableField>
    {items.length > 0 && (
          <div className="lp-scorecard-v1-list lp-rise">
      {items.map((item, index) => {
              const score = typeof item.score === 'number' ? item.score : 0;
              const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
              const pct = Math.min(100, Math.max(0, (score / max) * 100));
              return (
        <div key={index} className="lp-scorecard-v1-row">
                  <div className="lp-scorecard-v1-info">
          <EditableField
                      prop={`items.${index}.label`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-scorecard-v1-label"
          >
                      {item.label || ''}
          </EditableField>
          <div className="lp-scorecard-v1-score-wrap">
                      <span className="lp-scorecard-v1-score">{score}</span>
                      <span className="lp-scorecard-v1-max">/ {max}</span>
          </div>
                  </div>
                  <div className="lp-scorecard-v1-bar">
          <div className="lp-scorecard-v1-bar-fill" style={{ width: `${pct}%` }} />
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
  </div>
  );
}
