import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, Standfirst } from './shared.js';

export interface Theme09CaseFolioV1Item {
  url?: string;
  caption?: string;
}
export interface Theme09CaseFolioV1Case {
  title?: string;
  desc?: string;
}
export interface Theme09CaseFolioV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  standfirst?: string;
  cases?: Theme09CaseFolioV1Case[];
  images?: Theme09CaseFolioV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CaseFolioV1Meta: LayoutMeta = {
  id: 'theme09_case_folio_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 案例对开',
  description: '装订线居中的对开版式，左文右图三案例',
  needsMedia: true,
  mediaSlots: [{ name: '案例影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['case', 'folio', 'editorial'],
  contentShape: 'case-folio',
};

export const theme09CaseFolioV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Case Folio' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三个被推翻的方案' },
    { key: 'standfirst', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一次推翻都不是浪费——它把团队的判断边界往前推了一点点。' },
    {
      key: 'cases',
      label: '案例',
      type: 'array',
      defaultValue: [
        { title: '案例一 · 重做引导', desc: '我们删掉了首屏的三个按钮，转化反而涨了。' },
        { title: '案例二 · 延迟上线', desc: '为了一个边界情况，把发布推迟两周，值。' },
        { title: '案例三 · 关掉功能', desc: '砍掉使用率最低的能力，用户更专注了。' },
      ],
    },
    { key: 'images', label: '影像(3)', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '38' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09CaseFolioV1(props: Theme09CaseFolioV1Props): ReactNode {
  const { section, sectionEn, mark, title, standfirst, cases, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const rawImgs = (images ?? []).slice(0, 3);
  const list: Theme09CaseFolioV1Item[] = [rawImgs[0] ?? {}, rawImgs[1] ?? {}, rawImgs[2] ?? {}];
  const rawCases = (cases ?? []).slice(0, 3);
  const caseList: Theme09CaseFolioV1Case[] = [rawCases[0] ?? {}, rawCases[1] ?? {}, rawCases[2] ?? {}];
  return (
    <Sheet frame="spread" substrate="paper" className="lp-theme09-casefolio" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />
      <div className="lp-theme09-casefolio-grid">
        <div className="lp-theme09-casefolio-left">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-casefolio-title">{title}</EditableField>
          <Standfirst text={standfirst ?? ''} slideIdx={s} editable={e} dropCap columns={1} className="lp-theme09-casefolio-lead" />
          <ol className="lp-theme09-casefolio-list">
            {caseList.map((c, i) => (
              <li key={i} className="lp-theme09-casefolio-item">
                <EditableField prop={`cases.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme09-casefolio-item-title">{c.title}</EditableField>
                <EditableField prop={`cases.${i}.desc`} slideIdx={s} editable={e} as="p" className="lp-theme09-casefolio-item-desc">{c.desc}</EditableField>
              </li>
            ))}
          </ol>
        </div>
        <div className="lp-theme09-casefolio-right">
          {list.map((im, i) => (
            <figure key={i} className="lp-theme09-casefolio-fig">
              <InkPhoto prop={`images.${i}.url`} src={im.url} slideIdx={s} editable={e} ratio="4:3" fit="cover" hint="点击上传案例图" className="lp-theme09-casefolio-photo" />
              {im.caption && <figcaption className="lp-theme09-casefolio-cap"><EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">{im.caption}</EditableField></figcaption>}
            </figure>
          ))}
        </div>
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
