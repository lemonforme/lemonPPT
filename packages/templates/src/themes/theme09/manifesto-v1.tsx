import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Folio, Sheet } from './shared.js';

export interface Theme09ManifestoV1Line {
  text?: string;
  accent?: boolean;
}
export interface Theme09ManifestoV1Props {
  kicker?: string;
  lines?: Theme09ManifestoV1Line[];
  footnote?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ManifestoV1Meta: LayoutMeta = {
  id: 'theme09_manifesto_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 金句主张',
  description: '全版专色主张，逐行错位对齐',
  needsMedia: false,
  tags: ['manifesto', 'claim', 'editorial'],
  contentShape: 'manifesto',
};

export const theme09ManifestoV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '我们的主张' },
    {
      key: 'lines',
      label: '主张行',
      type: 'array',
      defaultValue: [
        { text: '把产品做薄，', accent: false },
        { text: '把关系做厚。', accent: true },
        { text: '相信慢的力量，', accent: false },
        { text: '也相信被使用出来的品牌。', accent: true },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '这不是一句口号，而是我们衡量每一个决定的尺子。' },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '金句主张' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '53' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09ManifestoV1(props: Theme09ManifestoV1Props): ReactNode {
  const { kicker, lines, footnote, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const list: Theme09ManifestoV1Line[] = lines && lines.length > 0 ? lines : [{}];
  return (
    <Sheet frame="column-3" substrate="ink" className="lp-theme09-manifesto" cropMarks accent>
      <div className="lp-theme09-manifesto-inner">
        <div className="lp-theme09-manifesto-kicker">
          <EditableField prop="kicker" slideIdx={s} editable={e} as="span">{kicker}</EditableField>
        </div>
        <div className="lp-theme09-manifesto-lines">
          {list.map((ln, i) => (
            <EditableField
              key={i}
              prop={`lines.${i}.text`}
              slideIdx={s}
              editable={e}
              as="p"
              className={`lp-theme09-manifesto-line ${ln.accent ? 'accent' : ''} offset-${i % 3}`}
            >
              {ln.text}
            </EditableField>
          ))}
        </div>
        {footnote && (
          <EditableField prop="footnote" slideIdx={s} editable={e} as="p" className="lp-theme09-manifesto-foot">{footnote}</EditableField>
        )}
        <ColorBar count={6} labeled className="lp-theme09-manifesto-bar" />
        <Folio inverse left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
      </div>
    </Sheet>
  );
}
