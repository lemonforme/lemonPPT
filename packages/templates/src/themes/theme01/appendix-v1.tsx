// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet } from './shared.js';

export interface Theme01AppendixV1Item {
  label?: string;
  value?: string;
}

export interface Theme01AppendixV1Props {
  title?: string;
  subtitle?: string;
  sources?: Theme01AppendixV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01AppendixV1Meta: LayoutMeta = {
  id: 'theme01_appendix_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 附录页',
  description: 'Vivid Pop 数据来源与参考资料列表',
  needsMedia: false,
};

export const theme01AppendixV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'sources',
      label: 'sources',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const rowColors = ['blue', 'green', 'amber', 'violet', 'red', 'cyan', 'pink', 'orange'] as const;

export function Theme01AppendixV1(props: Theme01AppendixV1Props): ReactNode {
  const { title = '附录 / 数据来源', subtitle, sources = [], _slideIdx, _editable } = props;
  const safeSources = sources.slice(0, 10);

  return (
    <Sheet substrate="light" frame="grid" className="lp-appendix-v1">
      <Blob
        className="lp-appendix-v1-blob"
        style={{ width: 380, height: 380, top: -140, right: -100, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-appendix-v1-dots"
        style={{ bottom: 90, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Ring
        className="lp-appendix-v1-ring"
        style={{ width: 120, height: 120, bottom: 100, right: 100, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-appendix-v1-plus"
        style={{ top: 140, left: 100, width: 32, height: 32, color: 'var(--lp-red)' }}
      />

      <div className="lp-appendix-v1-content">
        <div className="lp-appendix-v1-header lp-rise">
          {subtitle && (
            <div className="lp-appendix-v1-kicker">
              <Pill variant="outline" color="blue">
                {subtitle}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        {safeSources.length > 0 && (
          <div className="lp-appendix-v1-list">
            {safeSources.map((source, index) => {
              const color = rowColors[index % rowColors.length];
              return (
                <div
                  key={index}
                  className={`lp-appendix-v1-row lp-appendix-v1-row--${color} lp-rise`}
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  <span className="lp-appendix-v1-bullet" aria-hidden="true" />
                  {source.label && (
                    <EditableField
                      prop={`sources.${index}.label`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-appendix-v1-label"
                    >
                      {source.label}
                    </EditableField>
                  )}
                  <EditableField
                    prop={`sources.${index}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-appendix-v1-value"
                  >
                    {source.value || ''}
                  </EditableField>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Folio
        left="APPENDIX"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
