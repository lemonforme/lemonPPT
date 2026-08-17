// lemonPPT - theme08 黑金实验封面（P0 smoke 版式）

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08CoverV1Metric {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme08CoverV1Props {
  tag?: string;
  enTag?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metrics?: Theme08CoverV1Metric[];
  tags?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  accent?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08CoverV1Meta: LayoutMeta = {
  id: 'theme08_cover_v1',
  theme: 'theme08',
  role: 'cover',
  displayName: 'Theme 08 黑金封面',
  description: '黑金实验封面：左侧大标题 + 荧光金指标卡 + 右侧主视觉图 + 手绘装饰',
  needsMedia: true,
  tags: ['cover', 'black-gold', 'experimental'],
  contentShape: 'cover',
};

export const theme08CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'BLACK GOLD' },
    { key: 'enTag', label: '英文小标签', type: 'text', inlineEditable: true, defaultValue: 'EXPERIMENTAL RELEASE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 黑金实验发布会' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '以荧光金与高饱和点缀，重新定义高端科技叙事' },
    { key: 'accent', label: '整页强调', type: 'boolean', defaultValue: false },
    { key: 'imageUrl', label: '封面图片', type: 'image' },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { value: '84', unit: '页', label: '完整版式', accent: true },
        { value: '12', unit: '亿$', label: '融资规模', accent: false },
        { value: '+47', unit: '%', label: '同比增长', accent: false },
        { value: 'Top 3', unit: '', label: '赛道集中度', accent: false },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    {
      key: 'tags',
      label: '底部标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['高端发布', '品牌提案', '实验概念'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

export function Theme08CoverV1(props: Theme08CoverV1Props): ReactNode {
  const { tag, enTag, title, subtitle, imageUrl, metrics = [], tags = [], footnoteLeft, footnoteRight, accent, _slideIdx, _editable } = props;
  const normalizedTags = tags
    .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
    .filter(Boolean);

  return (
    <div className={`lp-slide lp-theme08 lp-theme08-cover ${accent ? 'accent' : ''}`}>
      <Theme08SlideBg />
      <div className="lp-theme08-watermark-number">08</div>
      <div className="lp-theme08-cover-main lp-rise">
        <Theme08IconChip name="bolt" size={44} />
        {tag && (
          <div className="lp-theme08-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme08-cover-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>
        )}
        {normalizedTags.length > 0 && (
          <div className="lp-theme08-cover-tags lp-rise">
            {normalizedTags.map((t, i) => (
              <span key={i} className="lp-theme08-cover-tag">
                <EditableField prop={`tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme08-cover-aside lp-rise">
        <div className="lp-theme08-cover-image">
          <LpEditableImage
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            className="lp-theme08-cover-image-img"
            placeholderClassName="lp-theme08-cover-image-placeholder"
            placeholderText="点击上传封面主视觉"
          />
        </div>
        {metrics.length > 0 && (
          <div className="lp-theme08-cover-metrics">
            {metrics.map((m, i) => (
              <div key={i} className={`lp-theme08-cover-metric ${m.accent ? 'accent' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="lp-theme08-cover-metric-value">
                  <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                  {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
                </div>
                <div className="lp-theme08-cover-metric-label">
                  <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme08-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
          {enTag && <span className="lp-theme08-kicker" style={{ marginLeft: 16 }}>{enTag}</span>}
        </span>
        <span className="lp-theme08-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
      <Theme08MiniBars count={22} />
    </div>
  );
}
