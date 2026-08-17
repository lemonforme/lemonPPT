// lemonPPT - theme08 黑金实验 · 倾斜拼贴照片墙
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08CollageV1Photo {
  imageUrl?: string;
  label?: string; // 底部彩色标签文字
  labelColor?: string; // 标签背景色 (default: var(--lp-accent))
  rotation?: number; // 旋转角度 -6 ~ 6 deg
}

export interface Theme08CollageV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  desc?: string;
  photos?: Theme08CollageV1Photo[];
  bigNumber?: string; // 右下角大数字（如 "2024"）
  bigNumberLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08CollageV1Meta: LayoutMeta = {
  id: 'theme08_collage_v1',
  theme: 'theme08',
  role: 'gallery',
  displayName: 'Theme 08 拼贴照片',
  description: '左侧标题+右侧倾斜拼贴照片墙，适合封面变体/品牌展示',
  needsMedia: true,
  tags: ['collage', 'photo', 'tilted', 'black-gold'],
  contentShape: 'gallery',
};

export const theme08CollageV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COVERAGE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一年内的高光现场' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '把分散的现场拼成一面粉，密度本身就是叙事。' },
    { key: 'desc', label: '说明文字', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'photos',
      label: '照片',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { imageUrl: '', label: 'FIG.01', labelColor: '#FF2D9B', rotation: -2.5 },
        { imageUrl: '', label: 'FIG.02', labelColor: '#8DBEEC', rotation: 1.8 },
        { imageUrl: '', label: 'FIG.03', labelColor: '#FFD23F', rotation: -1.2 },
        { imageUrl: '', label: 'FIG.04', labelColor: '#E83B22', rotation: 3 },
      ],
      itemSchema: [
        { key: 'imageUrl', label: '图片', type: 'image' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'labelColor', label: '标签色', type: 'text' },
        { key: 'rotation', label: '旋转角度', type: 'number' },
      ],
    },
    { key: 'bigNumber', label: '大数字', type: 'text', inlineEditable: true, defaultValue: '97' },
    { key: 'bigNumberLabel', label: '大数字标签', type: 'text', inlineEditable: true, defaultValue: '高光事件' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '82' },
  ],
};

export function Theme08CollageV1(props: Theme08CollageV1Props): ReactNode {
  const {
    tag,
    title,
    subtitle,
    desc,
    photos = [],
    bigNumber,
    bigNumberLabel,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;
  const valid = (photos || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme08 lp-theme08-collage-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {tag && (
            <div className="lp-theme08-kicker">
              <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
            </div>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>
          )}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-collage-layout lp-rise">
            <div className="lp-theme08-collage-left">
              {desc && (
                <p className="lp-theme08-collage-desc">
                  <EditableField prop="desc" slideIdx={_slideIdx} editable={_editable} as="span">{desc}</EditableField>
                </p>
              )}
              {(bigNumber || bigNumberLabel) && (
                <div className="lp-theme08-collage-bignum">
                  {bigNumber && (
                    <div className="lp-theme08-collage-bignum-value">
                      <EditableField prop="bigNumber" slideIdx={_slideIdx} editable={_editable} as="span">{bigNumber}</EditableField>
                    </div>
                  )}
                  {bigNumberLabel && (
                    <div className="lp-theme08-collage-bignum-label">
                      <EditableField prop="bigNumberLabel" slideIdx={_slideIdx} editable={_editable} as="span">{bigNumberLabel}</EditableField>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="lp-theme08-collage-right">
              {valid.map((p, i) => {
                const label = p.label ?? `FIG.0${i + 1}`;
                const labelColor = p.labelColor ?? 'var(--lp-accent)';
                return (
                  <div
                    key={i}
                    className={`lp-theme08-collage-photo lp-theme08-collage-frame lp-theme08-collage-rot-${i + 1}`}
                    style={p.rotation ? { transform: `rotate(${p.rotation}deg)` } : undefined}
                  >
                    <LpEditableImage
                      prop={`photos.${i}.imageUrl`}
                      src={p.imageUrl}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      className="lp-theme08-collage-img"
                      placeholderClassName="lp-theme08-collage-img-placeholder"
                      placeholderText="上传图片"
                    />
                    {label && (
                      <div className="lp-theme08-collage-label" style={{ background: labelColor }}>
                        <EditableField prop={`photos.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{label}</EditableField>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme08-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
