// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 人物特写（profile_v1）
 * 情绪：obsidian | 骨架：sidebar | 图位：1
 * 左肖像出血（满高左栏）+ 右 mono 履历条（栏目 / 姓名 / 职务 / 年限 / 方向）。
 * 金融人物志「本期人物」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10ProfileV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  name?: string;
  title?: string;
  en?: string;
  role?: string;
  years?: string;
  focus?: string;
  bio?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ProfileV1Meta: LayoutMeta = {
  id: 'theme10_profile_v1',
  theme: 'theme10',
  role: 'feature',
  displayName: 'Theme 10 人物特写',
  description: '左肖像出血 + 右 mono 履历条',
  needsMedia: true,
  mediaSlots: [{ name: '人物肖像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['profile', 'gold-index', 'obsidian'],
  contentShape: 'profile',
};

export const theme10ProfileV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '本期人物' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Profile' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'name', label: '姓名', type: 'text', inlineEditable: true, defaultValue: '陈知远' },
    { key: 'title', label: '头衔', type: 'text', inlineEditable: true, defaultValue: '首席资产配置官' },
    { key: 'en', label: '姓名(英)', type: 'text', inlineEditable: true, defaultValue: 'Chen Zhiyuan' },
    { key: 'role', label: '职务', type: 'text', inlineEditable: true, defaultValue: '宏观策略 · 多资产' },
    { key: 'years', label: '从业年限', type: 'text', inlineEditable: true, defaultValue: '14 YRS' },
    { key: 'focus', label: '研究方向', type: 'text', inlineEditable: true, defaultValue: '久期 · 信用利差 · 跨市场套利' },
    { key: 'bio', label: '短评', type: 'textarea', inlineEditable: true, defaultValue: '在他看来，配置不是预测，而是为不确定性预留位置——把仓位放进时间的剖面里慢慢看。' },
    { key: 'imageUrl', label: '人物肖像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '本期人物' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '22' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ProfileV1(props: Theme10ProfileV1Props): ReactNode {
  const {
    section, mark, name, title, en, role, years, focus, bio,
    imageUrl, folioLeft, folioPage, folioRight, mood = 'obsidian',
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme10-profile">
      <div className="lp-theme10-profile-photo">
        <EditorialPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="fill"
          fit="cover"
          hint="点击上传人物肖像"
        />
        <div className="lp-theme10-profile-photo-scrim" aria-hidden="true" />
      </div>

      <div className="lp-theme10-profile-body">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
          {section}
        </EditableField>
        <div className="lp-theme10-profile-head lp-rise" style={{ animationDelay: '60ms' }}>
          <EditableField prop="name" slideIdx={s} editable={e} as="h1" className="lp-theme10-profile-name">{name}</EditableField>
          {en && <EditableField prop="en" slideIdx={s} editable={e} as="div" className="lp-theme10-profile-en">{en}</EditableField>}
        </div>
        <EditableField prop="title" slideIdx={s} editable={e} as="div" className="lp-theme10-profile-title lp-rise" style={{ animationDelay: '110ms' }}>
          {title}
        </EditableField>

        <div className="lp-theme10-ledger" />

        <div className="lp-theme10-profile-resume lp-rise" style={{ animationDelay: '160ms' }}>
          <div className="t10-row">
            <span className="t10-k">职务</span>
            <EditableField prop="role" slideIdx={s} editable={e} as="span" className="t10-v">{role}</EditableField>
          </div>
          <div className="t10-row">
            <span className="t10-k">年限</span>
            <EditableField prop="years" slideIdx={s} editable={e} as="span" className="t10-v">{years}</EditableField>
          </div>
          <div className="t10-row">
            <span className="t10-k">方向</span>
            <EditableField prop="focus" slideIdx={s} editable={e} as="span" className="t10-v">{focus}</EditableField>
          </div>
        </div>

        {bio && (
          <EditableField prop="bio" slideIdx={s} editable={e} as="p" className="lp-theme10-profile-bio lp-rise" style={{ animationDelay: '210ms' }}>
            {bio}
          </EditableField>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
