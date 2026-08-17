// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 关于我们（profile_v1）
 * 基底：纸 | 骨架：grid | 图位：1
 *
 * 左侧机构简介三栏（项目+描述+标签）+ 右侧建筑影像出血。
 * 杂志「关于我们 / About」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Sheet } from './shared.js';

interface ProfileProject {
  title: string;
  period?: string;
  desc?: string;
  tag?: string;
}

export interface Theme09ProfileV1Props {
  orgName?: string;
  orgNameEn?: string;
  tagline?: string;
  projects?: ProfileProject[];
  imageUrl?: string;
  sideCards?: Array<{ abbr?: string; title?: string; dots?: number }>;
  tags?: string[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ProfileV1Meta: LayoutMeta = {
  id: 'theme09_profile_v1',
  theme: 'theme09',
  role: 'team',
  displayName: 'Theme 09 关于我们',
  description: '左侧机构简介三栏 + 右侧建筑影像出血，About / 关于我们栏',
  needsMedia: true,
  mediaSlots: [{ name: '建筑影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['about', 'profile', 'team', 'paper'],
  contentShape: 'profile',
};

export const theme09ProfileV1Schema: PropsSchema = {
  fields: [
    { key: 'orgName', label: '机构名', type: 'text', inlineEditable: true, defaultValue: 'About us' },
    { key: 'orgNameEn', label: '机构英文名', type: 'text', inlineEditable: true, defaultValue: 'AI Capital Lab' },
    { key: 'tagline', label: '标语', type: 'text', inlineEditable: true, defaultValue: '资本研究室' },
    { key: 'projects', label: '项目列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'imageUrl', label: '建筑影像', type: 'image', defaultValue: '' },
    { key: 'sideCards', label: '右侧卡片', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'tags', label: '底部标签', type: 'text', inlineEditable: true, defaultValue: '大模型 · 算力基础设施 · 垂直应用 · 数据与标注' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '关于 · 我们' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '20' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_PROJECTS: ProfileProject[] = [
  { title: '2024 大额融资全景追踪', period: '2024.01 – 2024.12', desc: '系统追踪美国 AI 产业单笔亿美元以上的大额融资事件，构建结构化数据库与可视化图谱。', tag: '年度旗舰' },
  { title: 'AI 一级市场连续观察', period: '2021 – 2023', desc: '连续三年覆盖全球 AI 投融资动态，沉淀可复用的「横纵分析法」研究框架。', tag: '长期研究' },
];

const DEFAULT_CARDS: Array<{ abbr?: string; title?: string; dots?: number }> = [
  { abbr: 'Db', title: '一级市场数据', dots: 6 },
  { abbr: 'Va', title: '估值与建模', dots: 5 },
  { abbr: 'Se', title: '赛道结构研究', dots: 4 },
  { abbr: 'Vz', title: '数据可视化', dots: 5 },
];

export function Theme09ProfileV1(props: Theme09ProfileV1Props): ReactNode {
  const {
    orgName, orgNameEn, tagline, projects = [], imageUrl,
    sideCards = [], tags = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeProjects = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const safeCards = Array.isArray(sideCards) && sideCards.length > 0 ? sideCards : DEFAULT_CARDS;
  const tagInput: unknown = tags;
  const rawTags: string[] = Array.isArray(tagInput) ? tagInput as string[] : (typeof tagInput === 'string' ? tagInput.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : []);
  const safeTags: string[] = rawTags.length > 0 ? rawTags : ['大模型', '算力基础设施', '垂直应用', '数据与标注'];

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-profile">
      {/* 顶部品牌条 */}
      <header className="lp-theme09-profile-brand">
        <h2 className="lp-theme09-profile-org">
          <EditableField prop="orgName" slideIdx={s} editable={e}>{orgName}</EditableField>
        </h2>
        {orgNameEn && (
          <span className="lp-theme09-profile-org-en">
            <EditableField prop="orgNameEn" slideIdx={s} editable={e}>{orgNameEn}</EditableField>
          </span>
        )}
        {tagline && (
          <span className="lp-theme09-profile-tagline">
            <EditableField prop="tagline" slideIdx={s} editable={e}>{tagline}</EditableField>
          </span>
        )}
      </header>

      <div className="lp-theme09-profile-grid">
        {/* 左侧项目列表 */}
        <div className="lp-theme09-profile-projects">
          {safeProjects.map((proj, i) => (
            <article key={i} className="lp-theme09-profile-proj lp-rise">
              <span className="lp-theme09-profile-proj-bullet" aria-hidden="true" />
              <div className="lp-theme09-profile-proj-head">
                <EditableField prop={`projects.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme09-profile-proj-title">
                  {proj.title}
                </EditableField>
                {proj.tag && (
                  <span className="lp-theme09-profile-proj-tag">
                    <EditableField prop={`projects.${i}.tag`} slideIdx={s} editable={e}>{proj.tag}</EditableField>
                  </span>
                )}
              </div>
              {proj.period && (
                <span className="lp-theme09-profile-proj-period">
                  <EditableField prop={`projects.${i}.period`} slideIdx={s} editable={e}>{proj.period}</EditableField>
                </span>
              )}
              {proj.desc && (
                <p className="lp-theme09-profile-proj-desc">
                  <EditableField prop={`projects.${i}.desc`} slideIdx={s} editable={e}>{proj.desc}</EditableField>
                </p>
              )}
            </article>
          ))}

          {/* 底部指标摘要 */}
          <div className="lp-theme09-profile-stats">
            <span className="lp-theme09-profile-stat"><b>970</b>亿$<small>全年总额资</small></span>
            <span className="lp-theme09-profile-stat"><b>240</b>+<small>大额事件</small></span>
            <span className="lp-theme09-profile-stat"><b>12</b><small className="t9-ac">类</small><small>赛道覆盖</small></span>
            <span className="lp-theme09-profile-stat"><b>63.9</b>%<small>湾区集中</small></span>
          </div>
        </div>

        {/* 右侧影像 + 卡片网格 */}
        <aside className="lp-theme09-profile-side">
          <InkPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="3:4"
            hint="上传建筑影像"
          >
            <span className="lp-theme09-profile-photo-meta">
              <span>口径</span> ≥1亿美元<br />
              <span>周期</span> 季度更新<br />
              <span>区域</span> 美国为主
            </span>
          </InkPhoto>

          <div className="lp-theme09-profile-cards">
            {safeCards.map((card, i) => (
              <div key={i} className="lp-theme09-profile-card">
                <span className="lp-theme09-profile-card-abbr">{card.abbr || '?'}</span>
                <span className="lp-theme09-profile-card-title">{card.title}</span>
                <span className="lp-theme09-profile-card-dots" style={{ '--dots': card.dots || 3 } as React.CSSProperties} aria-hidden="true" />
              </div>
            ))}

            {/* 标签行 */}
            <div className="lp-theme09-profile-tagrow">
              {safeTags.map((tg, i) => (
                <span key={i} className="lp-theme09-profile-chip">
                  <EditableField prop={`tags.${i}`} slideIdx={s} editable={e}>{tg}</EditableField>
                </span>
              ))}
            </div>

            {/* 条形码装饰 */}
            <div className="lp-theme09-profile-barcode" aria-hidden="true" />
          </div>
        </aside>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
