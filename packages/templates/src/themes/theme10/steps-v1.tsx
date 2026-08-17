// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 运作机制（steps_v1）
 * 情绪：obsidian | 骨架：grid | 图位：0
 * 横向步骤链 + 箭头连接（金融流程闭环）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10StepItem {
  no?: string;
  name?: string;
  desc?: string;
}
export interface Theme10StepsV1Props {
  kicker?: string;
  title?: string;
  lead?: string;
  items?: Theme10StepItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10StepsV1Meta: LayoutMeta = {
  id: 'theme10_steps_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 运作机制',
  description: '步骤链 + 箭头连接',
  needsMedia: false,
  tags: ['steps', 'content', 'gold-index', 'obsidian'],
  contentShape: 'steps',
};

export const theme10StepsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PROCESS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资金从募集到退出的四步闭环' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一步都设有清晰的权责边界与风控节点。' },
    {
      key: 'items',
      label: '步骤',
      type: 'array',
      minItems: 0,
      maxItems: 5,
      defaultValue: [
        { no: '01', name: '募集', desc: '向合格投资者定向募集，设定锁定期与预警线。' },
        { no: '02', name: '配置', desc: '按策略权重分配股、债与另类资产。' },
        { no: '03', name: '管理', desc: '动态再平衡，逐日盯市与回撤控制。' },
        { no: '04', name: '退出', desc: '达标或到期清算，分配本金与收益。' },
      ],
      itemSchema: [
        { key: 'no', label: '编号', type: 'text' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10StepsV1(props: Theme10StepsV1Props): ReactNode {
  const { kicker, title, lead, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 5);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-steps" accent>
      <div className="lp-theme10-steps-head">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField
            prop="title"
            slideIdx={s}
            editable={e}
            as="h2"
            className="lp-theme10-title lp-rise"
            style={{ animationDelay: '60ms', fontSize: 'var(--lp-font-size-h1)', marginTop: 12 }}
          >
            {title}
          </EditableField>
        )}
        {lead && (
          <EditableField
            prop="lead"
            slideIdx={s}
            editable={e}
            as="p"
            className="lp-theme10-steps-lead lp-rise"
            style={{ animationDelay: '120ms' }}
          >
            {lead}
          </EditableField>
        )}
      </div>
      <div className="lp-theme10-steps-flow">
        {list.map((it, i) => (
          <div className="lp-theme10-steps-node lp-rise" key={i} style={{ animationDelay: `${160 + i * 70}ms` }}>
            <div className="t10-step-no">
              <EditableField prop={`items.${i}.no`} slideIdx={s} editable={e} as="span">
                {it.no ?? String(i + 1).padStart(2, '0')}
              </EditableField>
            </div>
            <div className="t10-step-body">
              <div className="t10-step-name">
                <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span">
                  {it.name}
                </EditableField>
              </div>
              <div className="t10-step-desc">
                <EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span">
                  {it.desc}
                </EditableField>
              </div>
            </div>
            {i < list.length - 1 && (
              <div className="t10-step-arrow" aria-hidden="true">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
