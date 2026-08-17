// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 卷宗封面（cover_dossier_v1）
 * 基底：纸 | 骨架：sidebar | 图位：0
 *
 * 档案袋质感：最左装订孔列，中栏密级章 + 标题 + 归档字段表，
 * 右栏手写体批注挂栏 + 骑缝章。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverDossierV1Field {
  k: string;
  v: string;
}

export interface Theme09CoverDossierV1Props {
  classif?: string;
  stampNote?: string;
  title: string;
  subtitle?: string;
  fields?: Theme09CoverDossierV1Field[];
  memo?: string;
  chop?: string;
  metaLines?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverDossierV1Meta: LayoutMeta = {
  id: 'theme09_cover_dossier_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 卷宗封面',
  description: '档案袋质感封面：装订孔 + 密级章 + 归档字段 + 手写批注，适合调研/立项文件',
  needsMedia: false,
  tags: ['cover', 'dossier', 'archive', 'paper'],
  contentShape: 'cover-dossier',
};

export const theme09CoverDossierV1Schema: PropsSchema = {
  fields: [
    { key: 'classif', label: '密级章', type: 'text', inlineEditable: true, defaultValue: 'Confidential' },
    { key: 'stampNote', label: '章旁标注', type: 'text', inlineEditable: true, defaultValue: '仅限项目组内部传阅' },
    { key: 'title', label: '卷宗标题', type: 'text', inlineEditable: true, defaultValue: '品牌重塑立项卷宗' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从识别系统到内容体系的一次完整梳理，含调研原始记录与决策依据。' },
    {
      key: 'fields',
      label: '归档字段',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { k: 'File No.', v: 'BR-2026-009' },
        { k: 'Opened', v: '2026.03.14' },
        { k: 'Owner', v: '品牌与内容中心' },
        { k: 'Volume', v: '第 3 卷 / 共 5 卷' },
        { k: 'Status', v: '评审通过' },
        { k: 'Review', v: '2026.08.20' },
      ],
      itemSchema: [
        { key: 'k', label: '字段名', type: 'text' },
        { key: 'v', label: '字段值', type: 'text' },
      ],
    },
    { key: 'memo', label: '手写批注', type: 'textarea', inlineEditable: true, defaultValue: '第三稿，\n重点看第 2 章的用户口述。' },
    { key: 'chop', label: '骑缝章文字', type: 'text', inlineEditable: true, defaultValue: '存档' },
    {
      key: 'metaLines',
      label: '侧栏元信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['ARCHIVE / LEMONPPT', 'RETENTION 10 YEARS', 'COPY 02 OF 06'],
      itemSchema: [{ key: 'item', label: '行', type: 'text' }],
    },
  ],
};

export function Theme09CoverDossierV1(props: Theme09CoverDossierV1Props): ReactNode {
  const { classif, stampNote, title, subtitle, memo, chop, _slideIdx: s, _editable: e } = props;
  const fields = (props.fields ?? []).slice(0, 6);
  const metaLines = normalizeStrings(props.metaLines).slice(0, 4);

  return (
    <Sheet substrate="paper" frame="sidebar" className="lp-theme09-dossier">
      <div className="lp-theme09-dossier-punch" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>

      <div className="lp-theme09-dossier-main">
        <div className="lp-theme09-dossier-stamp lp-rise">
          {classif && (
            <EditableField prop="classif" slideIdx={s} editable={e} as="span" className="lp-theme09-dossier-classif">
              {classif}
            </EditableField>
          )}
          {stampNote && (
            <EditableField prop="stampNote" slideIdx={s} editable={e} as="span" className="lp-theme09-note">
              {stampNote}
            </EditableField>
          )}
        </div>

        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-dossier-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme09-dossier-sub lp-rise">
            {subtitle}
          </EditableField>
        )}

        {fields.length > 0 && (
          <div className="lp-theme09-dossier-fields lp-rise" style={{ animationDelay: '140ms' }}>
            {fields.map((f, i) => (
              <div key={i} className="lp-theme09-dossier-field">
                <EditableField prop={`fields.${i}.k`} slideIdx={s} editable={e} as="span" className="lp-theme09-dossier-field-k">
                  {f.k}
                </EditableField>
                <EditableField prop={`fields.${i}.v`} slideIdx={s} editable={e} as="span" className="lp-theme09-dossier-field-v">
                  {f.v}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="lp-theme09-dossier-side">
        {memo && (
          <EditableField prop="memo" slideIdx={s} editable={e} as="div" className="lp-theme09-dossier-memo">
            {memo}
          </EditableField>
        )}
        {chop && <span className="lp-theme09-chop">{chop}</span>}
        {metaLines.length > 0 && (
          <div className="lp-theme09-dossier-meta">
            {metaLines.map((t, i) => (
              <EditableField key={i} prop={`metaLines.${i}`} slideIdx={s} editable={e} as="div">
                {t}
              </EditableField>
            ))}
          </div>
        )}
      </aside>
    </Sheet>
  );
}
