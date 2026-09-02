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
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01ComparisonV1Props {
  kicker?: string;
  title: string;
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ComparisonV1Meta: LayoutMeta = {
  id: 'theme01_comparison_v1',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 左右对比',
  description: '无卡片左右两栏对比，中央 VS 徽章',
  needsMedia: false,
  tags: ['comparison', 'columns', 'grid', 'light'],
  contentShape: 'comparison',
};

export const theme01ComparisonV1Schema: PropsSchema = {
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
      key: 'leftTitle',
      label: '左侧标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'leftPoints',
      label: '左侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'rightTitle',
      label: '右侧标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'rightPoints',
      label: '右侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
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

export function Theme01ComparisonV1(props: Theme01ComparisonV1Props): ReactNode {
  const {
    kicker,
    title,
    leftTitle = '方案 A',
    leftPoints = [],
    rightTitle = '方案 B',
    rightPoints = [],
    _slideIdx,
    _editable,
  } = props;

  return (
    <Sheet substrate="tint" tint="blue" frame="grid" className="lp-comparison-v1">
      <Blob
        className="lp-comparison-v1-blob"
        style={{ width: 380, height: 380, top: -140, left: -100, background: 'var(--lp-blue)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-comparison-v1-dots"
        style={{ bottom: 100, right: 80, width: 240, height: 240, opacity: 0.2 }}
      />
      <Slash
        className="lp-comparison-v1-slash"
        style={{ top: 120, right: 120, height: 80, background: 'var(--lp-amber)', opacity: 0.5 }}
      />
      <Ring
        className="lp-comparison-v1-ring"
        style={{ width: 140, height: 140, bottom: 100, left: 90, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-comparison-v1-plus"
        style={{ top: 150, left: 130, width: 32, height: 32, color: 'var(--lp-red)' }}
      />

      <div className="lp-comparison-v1-content">
        <div className="lp-comparison-v1-header lp-rise">
          {kicker && (
            <div className="lp-comparison-v1-kicker">
              <Pill variant="outline" color="blue">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        <div className="lp-comparison-v1-grid lp-rise">
          <div className="lp-comparison-v1-col lp-comparison-v1-col--left">
            <EditableField
              prop="leftTitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-comparison-v1-col-title"
            >
              {leftTitle}
            </EditableField>
            <ul className="lp-comparison-v1-list">
              {leftPoints.map((point, index) => (
                <li key={index} className="lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
                  <EditableField
                    prop={`leftPoints.${index}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {point}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-comparison-v1-vs lp-rise">VS</div>

          <div className="lp-comparison-v1-col lp-comparison-v1-col--right">
            <EditableField
              prop="rightTitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-comparison-v1-col-title"
            >
              {rightTitle}
            </EditableField>
            <ul className="lp-comparison-v1-list">
              {rightPoints.map((point, index) => (
                <li key={index} className="lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
                  <EditableField
                    prop={`rightPoints.${index}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {point}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Folio
        left="COMPARE"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
