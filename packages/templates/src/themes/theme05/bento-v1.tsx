// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05BentoV1Item {
  title: string;
  value: string;
  description?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  span?: '1' | '2';
}

export interface Theme05BentoV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme05BentoV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05BentoV1Meta: LayoutMeta = {
  id: 'theme05_bento_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 一图速览',
  description: 'Bento Grid 布局，2x3 或 3x2 卡片网格，每个卡片展示一个数据亮点',
  needsMedia: false,
  tags: ['bento', 'metrics', 'spectrum'],
  contentShape: 'bento-grid',
};

export const theme05BentoV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'BENTO' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一图速览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心数据模块化呈现' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '全年融资总额', value: '970', description: '亿美元，同比 +23%', scheme: 'coral', span: '2' },
        { title: '大额事件', value: '97', description: '笔单笔超 5 亿美元交易', scheme: 'amber', span: '1' },
        { title: '平均单笔', value: '≈10', description: '亿美元', scheme: 'teal', span: '1' },
        { title: '头部集中度', value: '68', description: 'TOP3 赛道占比', scheme: 'indigo', span: '1' },
        { title: '晚期轮次', value: '74', description: 'C 轮及以后占比', scheme: 'violet', span: '1' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'description', label: '描述', type: 'text' },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
        { key: 'span', label: '跨度', type: 'select', defaultValue: '1', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }] },
      ],
    },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-bento-card--${scheme || 'coral'}`;
}

export function Theme05BentoV1(props: Theme05BentoV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme05-bento">
      <div className="lp-theme05-bento-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme05-bento-grid lp-rise">
          {validItems.map((item, idx) => (
            <div
              key={idx}
              className={`lp-theme05-bento-card lp-theme05-card ${schemeClass(item.scheme)} lp-theme05-bento-card--span-${item.span || '1'}`}
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-bento-card-title">{item.title}</EditableField>
              <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-bento-card-value">{item.value}</EditableField>
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-bento-card-description">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
