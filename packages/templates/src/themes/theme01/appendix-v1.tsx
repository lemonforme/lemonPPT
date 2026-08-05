// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
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
  description: '数据来源与参考资料列表',
  needsMedia: false,
};
export const theme01AppendixV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true
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
          inlineEditable: true
        },
        {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01AppendixV1(props: Theme01AppendixV1Props): ReactNode {
  const { title = '附录 / 数据来源', subtitle, sources = [], _slideIdx, _editable } = props;
  return (<div className="lp-slide lp-appendix-v1">
      <div className="lp-appendix-v1-inner">
    {subtitle && (<EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {subtitle}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-head lp-appendix-v1-title lp-rise">
          {title}
    </EditableField>
    {sources.length > 0 && (<div className="lp-card lp-appendix-v1-list lp-rise">
      {sources.map((source, index) => (<div key={index} className="lp-appendix-v1-row">
        {source.label && (<EditableField prop={`sources.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-appendix-v1-label">
          {source.label}
                  </EditableField>)}
        <EditableField prop={`sources.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-appendix-v1-value">
                  {source.value || ''}
        </EditableField>
              </div>))}
          </div>)}
      </div>
  </div>);
}
