// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 团队展示页（team_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 4 列团队成员卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11TeamV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  members?: { name: string; role: string; bio?: string; photo?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TeamV1Meta: LayoutMeta = {
  id: 'theme11_team_v1',
  theme: 'theme11',
  role: 'team',
  displayName: 'Theme 11 团队展示页',
  description: '顶部标题 + 4 列团队成员卡片',
  needsMedia: true,
  tags: ['team', 'grid', 'light-stream'],
  contentShape: 'team',
};

export const theme11TeamV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '核心团队' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '多元背景，共同构建下一代演示体验' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'TEAM' },
    { key: 'members', label: '成员', type: 'array', maxItems: 4, defaultValue: [
      { name: '林晓', role: '创始人', bio: '前产品经理，专注 AI 工具设计。' },
      { name: '陈默', role: '技术负责人', bio: '全栈工程师，热爱渲染与自动化。' },
      { name: '王悦', role: '设计总监', bio: '品牌与界面设计专家。' },
      { name: '张远', role: '增长负责人', bio: '数据驱动的增长实践者。' },
    ], itemSchema: [{ key: 'name', label: '姓名', type: 'text', inlineEditable: true }, { key: 'role', label: '职位', type: 'text', inlineEditable: true }, { key: 'bio', label: '简介', type: 'textarea', inlineEditable: true }, { key: 'photo', label: '照片', type: 'image', defaultValue: '' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11TeamV1(props: Theme11TeamV1Props): ReactNode {
  const { title, subtitle, eyebrow, members = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-team">
      <div className="lp-theme11-team-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-team-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-team-grid">
        {members.slice(0, 4).map((m, i) => (
          <Card key={i} className="lp-theme11-team-card lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <EditorialPhoto prop={`members.${i}.photo`} src={m.photo} slideIdx={s} editable={e} alt={m.name} className="lp-theme11-team-photo" placeholderClassName="lp-theme11-team-photo-placeholder" />
            <EditableField prop={`members.${i}.name`} slideIdx={s} editable={e} as="h3" className="lp-theme11-team-name">{m.name}</EditableField>
            <EditableField prop={`members.${i}.role`} slideIdx={s} editable={e} as="span" className="lp-theme11-team-role">{m.role}</EditableField>
            {m.bio && <Caption><EditableField prop={`members.${i}.bio`} slideIdx={s} editable={e} as="span">{m.bio}</EditableField></Caption>}
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
