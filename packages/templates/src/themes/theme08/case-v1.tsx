// lemonPPT - theme08 黑金实验 · 案例卡
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08CaseV1Metric {
  num: string;
  label: string;
}

export interface Theme08CaseV1Props {
  kicker?: string;
  logoText?: string;
  name: string;
  tag?: string;
  desc?: string;
  metrics?: Theme08CaseV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08CaseV1Meta: LayoutMeta = {
  id: 'theme08_case_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 案例卡',
  description: '左侧品牌标识 + 右侧要点与三项指标，适合公司/案例展示',
  needsMedia: false,
  tags: ['case', 'company', 'black-gold'],
  contentShape: 'case',
};

export const theme08CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'logoText', label: '品牌字标', type: 'text', inlineEditable: true, defaultValue: 'xA' },
    { key: 'name', label: '名称', type: 'text', inlineEditable: true, defaultValue: 'xAI' },
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '通用大模型' },
    { key: 'desc', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '以超大规模算力与端到端训练体系，快速跻身第一梯队。' },
    {
      key: 'metrics',
      label: '案例指标',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: [
        { num: '50', label: '融资(亿$)' },
        { num: '10万+', label: 'H100 等效卡' },
        { num: 'Top 3', label: '榜单位次' },
      ],
      itemSchema: [
        { key: 'num', label: '数字', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '61' },
  ],
};

export function Theme08CaseV1(props: Theme08CaseV1Props): ReactNode {
  const { kicker, logoText, name, tag, desc, metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (metrics || []).slice(0, 3);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-case-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="globe" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-case lp-rise">
            <div className="lp-theme08-case-brand">
              <div className="lp-theme08-case-logo"><EditableField prop="logoText" slideIdx={_slideIdx} editable={_editable} as="span">{logoText}</EditableField></div>
              <div className="lp-theme08-case-name"><EditableField prop="name" slideIdx={_slideIdx} editable={_editable} as="span">{name}</EditableField></div>
              {tag && <div className="lp-theme08-case-tag"><EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField></div>}
            </div>
            <div className="lp-theme08-case-detail">
              {desc && <div className="lp-theme08-card lp-theme08-card-pad lp-theme08-case-desc"><EditableField prop="desc" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-card-desc">{desc}</EditableField></div>}
              {valid.length > 0 && (
                <div className="lp-theme08-case-metrics">
                  {valid.map((m, i) => (
                    <div key={i} className="lp-theme08-card lp-theme08-card-pad">
                      <div className="lp-theme08-case-metric-num"><EditableField prop={`metrics.${i}.num`} slideIdx={_slideIdx} editable={_editable} as="span">{m.num}</EditableField></div>
                      <div className="lp-theme08-case-metric-label"><EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
