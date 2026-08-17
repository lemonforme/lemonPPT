import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09AnnotatedV1Note {
  text?: string;
}
export interface Theme09AnnotatedV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  body?: string;
  notes?: Theme09AnnotatedV1Note[];
  images?: { url?: string; caption?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09AnnotatedV1Meta: LayoutMeta = {
  id: 'theme09_annotated_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 批注精读',
  description: '正文段落 + 右侧手写体批注挂栏 + 引出线',
  needsMedia: true,
  mediaSlots: [{ name: '配图', fieldPath: 'images', canPresetMedia: true }],
  tags: ['annotated', 'reading', 'editorial'],
  contentShape: 'annotated',
};

export const theme09AnnotatedV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '精读' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Close Reading' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一份报告的自我修养' },
    { key: 'body', label: '正文', type: 'textarea', inlineEditable: true, defaultValue: '好的报告不替读者下结论，它把证据铺开，把分歧摆正，然后退到一旁。我们在每一版草稿里都保留了“未决”的段落——那才是真正值得讨论的地方。' },
    {
      key: 'notes',
      label: '批注',
      type: 'array',
      defaultValue: [
        { text: '此处应给出样本口径，否则结论不可复现。' },
        { text: '“未决”比“确定”更诚实。' },
        { text: '考虑补一张时间轴对照。' },
      ],
    },
    { key: 'images', label: '配图', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '批注精读' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '54' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09AnnotatedV1(props: Theme09AnnotatedV1Props): ReactNode {
  const { section, sectionEn, mark, title, body, notes, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const img = images?.[0] ?? {};
  const list: Theme09AnnotatedV1Note[] = notes && notes.length > 0 ? notes : [{}];
  return (
    <Sheet frame="grid" substrate="paper" className="lp-theme09-annotated" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />
      <div className="lp-theme09-annotated-grid">
        <div className="lp-theme09-annotated-main">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-annotated-title">{title}</EditableField>
          <InkPhoto
            prop="images.0.url"
            src={img.url}
            slideIdx={s}
            editable={e}
            ratio="16:9"
            fit="cover"
            hint="点击上传配图"
            className="lp-theme09-annotated-photo"
          />
          {body && (
            <EditableField prop="body" slideIdx={s} editable={e} as="p" className="lp-theme09-annotated-body">{body}</EditableField>
          )}
        </div>
        <aside className="lp-theme09-annotated-rail">
          <span className="lp-theme09-annotated-rail-rule" aria-hidden="true" />
          {list.map((n, i) => (
            <EditableField
              key={i}
              prop={`notes.${i}.text`}
              slideIdx={s}
              editable={e}
              as="p"
              className="lp-theme09-annotated-note"
            >
              {n.text}
            </EditableField>
          ))}
        </aside>
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
